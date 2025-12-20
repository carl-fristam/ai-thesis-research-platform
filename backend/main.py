from fastapi import FastAPI, Depends
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

import db_config

app = FastAPI()

# Wide open CORS for testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Task(BaseModel):
    title: str
    description: str | None = None
    priority: int

@app.get("/")
async def root():
    return {"status": "online", "message": "FastAPI + SQLite is humming"}

@app.get("/tasks")
async def get_tasks():
    tasks = []
    # cursor is a stream of data from Mongo
    async for task in db_config.task_collection.find():
        tasks.append(db_config.task_helper(task))
    return tasks

@app.post("/tasks")
async def create_task(task: Task):
    # Convert Pydantic model to a Python Dictionary
    task_dict = task.model_dump()
    
    # Insert into MongoDB
    new_task = await db_config.task_collection.insert_one(task_dict)
    
    # Find the newly created task to return it
    created_task = await db_config.task_collection.find_one({"_id": new_task.inserted_id})
    return db_config.task_helper(created_task)