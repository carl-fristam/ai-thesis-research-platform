# MSc research tool

Full-stack application for gathering and organizing research using the Exa AI API. Built with React, FastAPI, and MongoDB.

## Tech Stack

- **Frontend:** React + Tailwind CSS
- **Backend:** FastAPI (Python)
- **Database:** MongoDB
- **Search:** Exa API

## Setup

The easiest way to run everything is with Docker:

```bash
docker-compose up --build
```

Access the app at `http://localhost:5173`.

## Project Structure

- **`backend/`**: FastAPI application.
    - `main.py`: API endpoints (Auth, Chat, Search, Persistence).
    - `auth.py`: JWT handling and password hashing.
    - `db_config.py`: MongoDB connection and schema helpers.
- **`frontend/`**: React application (Vite).
    - `src/components/`: Core UI components (Dashboard, Research Interface, Login).

## How it Works

1.  **Auth**: Users register/login to get a JWT. All data is scoped to the user ID from this token.
2.  **Search**: The frontend sends queries to the backend, which proxies them to the **Exa API** for semantic search.
3.  **Persistence**:
    - **Chats**: Conversation history is stored in MongoDB.
    - **Saved Results**: Papers/Links are saved to a separate collection in MongoDB.
4.  **Docker**: `docker-compose` orchestrates the Frontend, Backend, and Database containers in a shared network.

## Configuration

Make sure your Exa API key is set in `backend/main.py` or your environment variables.