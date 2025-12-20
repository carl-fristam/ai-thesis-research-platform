import motor.motor_asyncio
import os

# Inside Docker-Compose, the hostname 'mongo' matches our service name
# Locally, it would be 'localhost'
MONGO_DETAILS = os.getenv("MONGO_DETAILS", "mongodb://localhost:27017")

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)

# This creates a database named 'agent_db' and a collection named 'tasks'
database = client.agent_db
task_collection = database.get_collection("tasks")

# Helper function: MongoDB uses '_id' (an ObjectId), but React prefers 'id' (a string)
def task_helper(task) -> dict:
    return {
        "id": str(task["_id"]),
        "title": task["title"],
        "description": task["description"],
        "priority": task["priority"],
    }