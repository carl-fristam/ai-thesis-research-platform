from datetime import datetime
from bson import ObjectId
from anthropic import AsyncAnthropic
from app.core.config import settings
from app.core.database import db
from app.models.chat import ChatQuery
from app.services.vector_service import get_vector_service

class ChatService:
    def __init__(self):
        self.client = AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)
        self.chat_collection = db.get_collection("chat_sessions")
        # Initialize vector service
        self.vector_service = get_vector_service() 

    async def process_query(self, query: ChatQuery, user_id: str):
        # 1. Load History
        conversation_history = []
        if query.session_id:
            session = await self.chat_collection.find_one({
                "_id": ObjectId(query.session_id),
                "user_id": user_id
            })
            if session and session.get("messages"):
                conversation_history = session["messages"][-10:]

        # 2. RAG Search
        search_results = self.vector_service.search(query.question, user_id, n_results=5)
        
        # 2b. Get Library Overview (Lightweight)
        from app.services.knowledge_service import knowledge_service
        all_sources = await knowledge_service.get_all_titles(user_id)
        library_context = f"Library Overview ({len(all_sources)} total sources):\n"
        for s in all_sources:
            library_context += f"- {s['title']} (URL: {s.get('url', 'None')}, Date: {s['date']})\n"

        # 3. Build Context (RAG)
        source_texts = []
        source_titles = []
        MAX_LEN = 2000
        for s in search_results:
            title = s['metadata'].get('title', 'Untitled')
            content = s.get('text', '')
            if len(content) > MAX_LEN: content = content[:MAX_LEN] + "..."
            source_texts.append(f"Source: {title}\nContent: {content}\n---\n")
            source_titles.append(title)
            
        full_context = "Relevant Document Excerpts (RAG):\n" + "".join(source_texts)

        # 4. System Prompt
        system_message = [
            {
                "type": "text", 
                "text": library_context, 
                "cache_control": {"type": "ephemeral"}
            },
            {
                "type": "text", 
                "text": full_context,
                "cache_control": {"type": "ephemeral"}
            },
            {
                "type": "text", 
                "text": """You are a research assistant helping with a thesis. 
THESIS CONTEXT:
This thesis investigates data-driven approaches to Anti-Money Laundering (AML) using operational-grade transaction-monitoring data from a collaborating bank. The study applies data science methods to compare unsupervised and graph-based modeling approaches in their ability to capture transaction patterns relative to the bank’s existing supervised AML models and operational framework. In addition, the study explores graph-based representations of transaction data and the potential of graph neural network (GNN) methods in enhancing fraud detection and explainability within AML. The analysis focuses on comparative performance metrics and model-specific explainability techniques.

You have access to a Library Overview (all titles) and Relevant Document Excerpts (content). Use this Context for general questions about the thesis topic without needing to look up sources. Use the Library Overview for counting/grouping questions, and Relevant Excerpts for specific content questions. Format with Markdown. IMPORTANT: When mentioning a saved source, you MUST link it using markdown format: [Title](URL) using the URL provided in the Library Overview."""
            }
        ]

        # 5. Messages
        messages = []
        for msg in conversation_history:
            role = "assistant" if msg["role"] == "ai" else msg["role"]
            messages.append({"role": role, "content": msg.get("text", "")})
        messages.append({"role": "user", "content": query.question})

        # 6. Call LLM
        response = await self.client.messages.create(
            model=settings.CLAUDE_MODEL,
            max_tokens=2048,
            system=system_message,
            messages=messages,
            extra_headers={"anthropic-beta": "prompt-caching-2024-07-31"}
        )
        
        full_response = response.content[0].text

        # 7. Save History
        if query.session_id:
             await self.chat_collection.update_one(
                {"_id": ObjectId(query.session_id)},
                {
                    "$push": {
                        "messages": {
                            "$each": [
                                {"role": "user", "text": query.question, "timestamp": datetime.utcnow().isoformat()},
                                {"role": "ai", "text": full_response, "timestamp": datetime.utcnow().isoformat(), "sources": source_titles}
                            ]
                        }
                    },
                    "$set": {"last_message": query.question}
                }
            )

        return {"response": full_response, "sources_used": source_titles}

    async def get_chats(self, user_id: str, chat_type: str = None):
        query = {"user_id": user_id}
        if chat_type:
            query["type"] = chat_type
        
        chats = []
        async for chat in self.chat_collection.find(query).sort("created_at", -1):
            chat["id"] = str(chat["_id"])
            del chat["_id"]
            chats.append(chat)
        return chats

    async def create_chat(self, chat_data, user_id: str):
        chat_dict = chat_data.model_dump()
        chat_dict["user_id"] = user_id
        chat_dict["created_at"] = datetime.utcnow().isoformat()
        chat_dict["messages"] = []
        new_chat = await self.chat_collection.insert_one(chat_dict)
        return {"id": str(new_chat.inserted_id), "message": "Chat created"}

    async def delete_chat(self, id: str, user_id: str):
        try:
             obj_id = ObjectId(id)
        except:
             return {"error": "Invalid ID"}
        await self.chat_collection.delete_one({"_id": obj_id, "user_id": user_id})
        return {"message": "Chat deleted"}

chat_service = ChatService()
