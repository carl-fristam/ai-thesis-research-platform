# MSc thesis research tool

This research tool is a containerized, full-stack application designed for research gathering and source management. It integrates AI search via the Exa API.

## Features

- **Research Chat**: A session-based interface for dynamic research queries using Exa AI.
- **Knowledge Base**: A central repository to organize, tag, and favorite saved research papers and verified sources.
- **Authentication**: Secure JWT-based access control for private research sessions.
- **Corporate UI**: A professional, responsive interface built with React and Tailwind CSS.

## Technical Architecture

- **Frontend**: React (Vite), Tailwind CSS
- **Backend**: FastAPI (Python), Exa SDK
- **Database**: MongoDB
- **Infrastructure**: Docker & Docker Compose

## Repository Structure

```text
├── backend/            # FastAPI application
│   ├── main.py         # API endpoints and logic
│   ├── db_config.py    # MongoDB configuration and helpers
│   ├── auth.py         # JWT and security logic
│   └── Dockerfile      # Backend container definition
├── frontend/           # React application
│   ├── src/
│   │   ├── components/ # Dashboard, Research Chat, and Login
│   │   └── App.jsx     # Main routing and state management
│   └── Dockerfile      # Frontend container definition
└── docker-compose.yml  # Service orchestration
```

## Quick Start

### 1. Initialize the Stack
Build and start the services (Frontend, Backend, MongoDB, Mongo Express):

```bash
docker-compose up --build -d
```

### 2. Environment Configuration
The system assumes the and Exa API Key is configured in the backend. Ensure the Exa client has a valid key for search functionality.

### 3. Usage
- **Auth**: Register a user account via the secure login portal.
- **Search**: Navigate to the Research Area to start a session.
- **Save**: Selected findings can be promoted to the Knowledge Base for tagging and long-term storage.

## Access Links

| Service | Local URL |
| --- | --- |
| **Frontend UI** | [http://localhost:5173](http://localhost:5173) |
| **API Docs** | [http://localhost:8000/docs](http://localhost:8000/docs) |
| **Database UI** | [http://localhost:8081](http://localhost:8081) |

## Maintenance

**Stop and clean volumes:**
```bash
docker-compose down -v
```

**View system logs:**
```bash
docker-compose logs -f
```