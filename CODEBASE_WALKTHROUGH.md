# Comprehensive Codebase Walkthrough

## Architecture Overview

Your application is a **3-tier architecture**: React frontend → FastAPI backend → MongoDB + JSON vector store.

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React 19)                         │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐              │
│  │  Dashboard  │  │ ExaShowcase  │  │  ChatWidget   │              │
│  │ (Knowledge) │  │   (Search)   │  │   (RAG Chat)  │              │
│  └──────┬──────┘  └──────┬───────┘  └───────┬───────┘              │
│         │                │                   │                      │
│         └────────────────┼───────────────────┘                      │
│                          ▼                                          │
│              ┌───────────────────────┐                              │
│              │   api/client.js       │  ← Axios + JWT interceptor   │
│              │   (centralized API)   │                              │
│              └───────────┬───────────┘                              │
└──────────────────────────┼──────────────────────────────────────────┘
                           │ HTTP + Bearer Token
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      BACKEND (FastAPI)                              │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  API Layer: auth.py, chat.py, knowledge.py                   │   │
│  │             └── deps.py (JWT validation)                     │   │
│  └─────────────────────────┬───────────────────────────────────┘   │
│                            │                                        │
│  ┌─────────────────────────▼───────────────────────────────────┐   │
│  │  Service Layer:                                              │   │
│  │  ├── chat_service.py     (LLM orchestration)                │   │
│  │  ├── knowledge_service.py (CRUD + Exa)                      │   │
│  │  ├── vector_service.py   (embeddings + search)              │   │
│  │  ├── context_builder.py  (RAG context assembly)             │   │
│  │  ├── prompt_builder.py   (system prompt construction)       │   │
│  │  └── query_classifier.py (intent classification)            │   │
│  └─────────────────────────┬───────────────────────────────────┘   │
│                            │                                        │
│  ┌─────────────────────────▼───────────────────────────────────┐   │
│  │  Core Layer: config.py, database.py, security.py             │   │
│  └─────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────┘
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
    ┌──────────┐    ┌───────────┐    ┌─────────────┐
    │ MongoDB  │    │ vectors   │    │  Anthropic  │
    │(3 colls) │    │  .json    │    │  Claude API │
    └──────────┘    └───────────┘    └─────────────┘
```

---

## Request Flow (Chat Query Example)

```
1. User types message in ChatWidget
2. handleSend() → chatApi.sendQuery()
3. POST /api/v1/chats/query with JWT
4. deps.get_current_user() validates token
5. chat_service.process_query():
   a. Load last 10 messages from MongoDB
   b. query_classifier.classify() → LLM call to determine context need
   c. context_builder.build():
      - knowledge_service.get_all_titles() → MongoDB query
      - vector_service.search() → cosine similarity in RAM
   d. prompt_builder.build_system_message() → construct prompt
   e. Anthropic API call with prompt caching
   f. Save messages to MongoDB
6. Return response to frontend
7. ChatWidget displays with markdown rendering
```

---

## Critical Issues & Bugs

### 1. **BLOCKING BUG: Synchronous Anthropic Client in Async Context**
**File:** `backend/app/services/query_classifier.py:50`
```python
# Uses synchronous client in async method
self.client = Anthropic(api_key=...)  # Line 27 - SYNC client
async def classify(...):  # Line 30 - ASYNC method
    response = self.client.messages.create(...)  # Line 50 - BLOCKS event loop!
```
**Impact:** This blocks the entire event loop during classification, causing all concurrent requests to hang.
**Fix:** Use `AsyncAnthropic` like `chat_service.py` does.

### 2. **Data Loss: Vectors Not Deleted on Session Delete**
**File:** `backend/app/services/chat_service.py:113`
When a chat session is deleted, the code only deletes from MongoDB—if there were embedded documents associated with that session, they remain orphaned in `vectors.json`. Not critical for your current schema but a design inconsistency.

### 3. **Race Condition in Vector Service**
**File:** `backend/app/services/vector_service.py:35-37`
```python
def save(self):
    with open(self.filename, 'w') as f:
        json.dump(self.data, f)
```
Multiple concurrent requests can corrupt `vectors.json`. No file locking, no atomic writes.

### 4. **Silent Failure on Exa Search**
**File:** `backend/app/api/v1/knowledge.py:22-24`
```python
except Exception as e:
    return {"error": str(e)}  # Returns 200 OK with error in body!
```
**Impact:** Frontend receives `{error: "..."}` but HTTP status is 200. Frontend doesn't handle this case in `ExaShowcase.jsx:103`.

### 5. **JWT Expiration Not Checked Proactively**
**File:** `frontend/src/App.jsx:9-23`
The `getUsernameFromToken()` decodes the JWT but doesn't check `exp` claim. Users stay "logged in" with expired tokens until a 401 forces logout.

---

## Efficiency Issues

### 1. **Double LLM Call Per Chat Message**
**File:** `backend/app/services/chat_service.py:36-37`
```python
context_need = await query_classifier.classify(...)  # 1st LLM call (Haiku)
# ... then main Claude call                          # 2nd LLM call (Sonnet)
```
Every single chat message makes 2 API calls. For simple queries like "thanks!" you're paying for classification.

**Cost Impact:** ~$0.0001 per classification call adds up.
**Alternative:** Use heuristics first (message length, keywords) before LLM classification.

### 2. **O(n) Vector Search Without Indexing**
**File:** `backend/app/services/vector_service.py:65-83`
```python
# Full scan every query
user_data = [d for d in self.data if d.get('user_id') == user_id]
similarities = np.dot(embeddings, query_vec) / (denominators + 1e-9)
```
Linear scan of all vectors on every query. Works for hundreds, breaks at thousands.

### 3. **Full Library Loaded on Every Query**
**File:** `backend/app/services/context_builder.py:16`
```python
all_sources = await knowledge_service.get_all_titles(user_id)
```
Even for `ContextNeed.HIGH`, this fetches ALL paper metadata. With 500 papers, this is ~50KB of context per message.

### 4. **No Connection Pooling for MongoDB**
**File:** `backend/app/core/database.py:6`
```python
self.client = AsyncIOMotorClient(settings.MONGO_DETAILS)
```
No `maxPoolSize` configured. Motor defaults to 100, but for high traffic you'd want explicit configuration.

### 5. **Frontend Re-renders Entire Message List**
**File:** `frontend/src/components/ChatWidget.jsx:245`
```jsx
{messages.map((m, i) => (
    <div key={i} ...>  // Using index as key
```
Using array index as React key causes unnecessary re-renders. Should use message ID.

---

## Naming & Structure Issues

### 1. **Inconsistent Enum Usage**
**File:** `backend/app/models/chat.py:25-31`
```python
class ChatSession(BaseModel):
    category: str = SessionCategory.CONVERSATION  # Accepts string, not Enum
    mode: str = AssistantMode.THESIS              # Same issue
```
Enums exist but models accept `str`. No validation that values are valid enum members.

### 2. **Misleading Service Name: `knowledge_service`**
The service handles both research paper CRUD AND Exa search. These are distinct concerns. Consider `paper_service` + separate `search_service`.

### 3. **`ContextNeed.MEDIUM` Comment is Wrong**
**File:** `backend/app/models/chat.py:8`
```python
MEDIUM = "medium"    # Library only, no RAG  ← Comment says this
```
But `context_builder.py:22` shows MINIMAL skips RAG, not MEDIUM:
```python
if context_need == ContextNeed.MINIMAL:
    return library_context, "", []
```
MEDIUM actually does full RAG search.

### 4. **Inconsistent API Response Shapes**
- `POST /auth/login` → `{access_token, token_type}`
- `POST /knowledge/saved-results` → `{message, id}`
- `POST /chats/query` → `{response, sources_used}`
- `DELETE /chats/{id}` → `{message}`

No consistent envelope. Makes frontend error handling fragmented.

### 5. **`user_id` vs `username` Confusion**
Backend uses `username` from JWT as `user_id`. The variable naming is inconsistent:
- `deps.py:15` returns `username`
- Routes receive it as `user_id: str = Depends(get_current_user)`
- But the actual value is the username string

---

## Logic Issues

### 1. **Duplicate Detection Only by URL**
**File:** `backend/app/services/knowledge_service.py:14`
```python
existing = await self.collection.find_one({"url": result.url, "user_id": user_id})
```
If same paper appears at different URLs (arxiv vs semantic scholar), it's saved twice.

### 2. **Undo Delete Race Condition**
**File:** `frontend/src/components/Dashboard.jsx:188-195`
```javascript
const timerId = setTimeout(async () => {
    await knowledgeService.deleteResult(id);  // Actual delete after 5s
    setUndoState(current => ...);
}, 5000);
```
If user navigates away during the 5s window, the timeout still fires but UI state is lost. Document gets deleted silently.

### 3. **No Pagination**
- `get_sessions()` returns ALL sessions
- `get_results()` returns ALL saved papers
- `get_all_titles()` returns ALL paper metadata

For power users with 1000+ papers/sessions, this becomes problematic.

### 4. **Session Mode Ignored in Query**
**File:** `backend/app/services/chat_service.py:33`
```python
session_mode = session.get("mode", AssistantMode.THESIS)
```
The mode from the request (`query.mode`) is ignored once a session exists. User can't switch modes mid-conversation.

### 5. **Orphaned Search Sessions**
**File:** `frontend/src/components/ExaShowcase.jsx:96-100`
```javascript
if (!activeSearchId) {
    const sessionData = await chatApi.createSession(query, "search");
    activeSearchId = sessionData.id;
}
```
A new session is created before search. If search fails, an empty session remains.

---

## Security Concerns

### 1. **No Rate Limiting**
Any authenticated user can spam the LLM endpoints. No protection against cost attacks.

### 2. **JWT Secret in Environment**
**File:** `backend/app/core/config.py:10`
```python
SECRET_KEY: str  # Required, no default
```
Good that there's no default, but ensure it's cryptographically random in production.

### 3. **CORS Allows localhost**
**File:** `backend/app/core/config.py:23`
```python
ALLOWED_ORIGINS: list[str] = ["http://localhost:5173", "http://localhost:8000"]
```
Fine for dev, but production deployment needs proper origin configuration.

### 4. **No Input Sanitization for Paper Text**
**File:** `backend/app/services/vector_service.py:46`
```python
combined_text = f"{title}: {text}"
```
Raw user-provided text goes directly into embeddings. While not XSS (backend), malicious content could poison the vector space.

---

## Quick Wins for Production

1. **Fix the sync/async bug** in `query_classifier.py` - this is causing blocking
2. **Add file locking** to `vector_service.py:save()`
3. **Return proper HTTP error codes** from Exa search endpoint
4. **Add pagination** to list endpoints (sessions, papers)
5. **Use message IDs as React keys** instead of array indices

---

## Debugging Production Issues

If the system breaks in production, check these first:

| Symptom | Likely Cause | File to Check |
|---------|--------------|---------------|
| All requests slow/hanging | QueryClassifier blocking event loop | `query_classifier.py:50` |
| 401 errors after some time | JWT expired, no refresh | `frontend/src/App.jsx` |
| Chat returns empty response | Claude API rate limit/error | `chat_service.py:56-62` |
| Papers not appearing in chat | Vector upsert failed silently | `vector_service.py:42-56` |
| Duplicate papers | URL mismatch (http vs https) | `knowledge_service.py:14` |
| Search works, no results saved | Session not created properly | `ExaShowcase.jsx:96-100` |
| MongoDB connection errors | Pool exhausted | `database.py:6` |
