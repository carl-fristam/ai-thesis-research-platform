from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from sqlalchemy import Column, Integer, String

# This creates a local file called 'tasks.db' in your backend folder
SQLALCHEMY_DATABASE_URL = "sqlite:///./tasks.db"

# The 'engine' handles the actual connection to the file
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# Each instance of the SessionLocal class will be a database session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# This is the base class we will use to create our Database Models
Base = declarative_base()

class DBTask(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String, nullable=True)
    priority = Column(Integer)