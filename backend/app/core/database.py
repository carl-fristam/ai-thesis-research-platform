from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

class Database:
    def __init__(self):
        self.client = AsyncIOMotorClient(settings.MONGO_DETAILS)
        self.db = self.client.research_db
        print("Initialized MongoDB Client")

    def close(self):
        if self.client:
            self.client.close()
            print("Closed MongoDB Connection")

    def get_collection(self, name: str):
        return self.db.get_collection(name)

db = Database()
