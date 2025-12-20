from fastapi import FastAPI, Depends
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy.orm import Session
import database

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

database.Base.metadata.create_all(bind=database.engine)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
async def root():
    return {"status": "online", "message": "FastAPI + SQLite is humming"}

@app.get("/tasks")
async def get_tasks(db: Session = Depends(get_db)):
    # This queries the database for EVERY task in the table
    tasks = db.query(database.DBTask).all()
    return tasks

@app.post("/tasks")
async def create_task(task: Task, db: Session = Depends(get_db)):

    new_db_task = database.DBTask(
        title = task.title,
        description = task.description,
        priority = task.priority
    )

    db.add(new_db_task)
    db.commit()
    db.refresh(new_db_task)

    return {"message": "Success", "task": task}