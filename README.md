# M4 Fullstack Starter

A lightweight, professional boilerplate built for M4 Macs. This project connects a **Python (Flask)** API with a **React (Vite)** frontend, designed to run entirely in user-space without admin rights.

---

## Project Structure

```text
M4-Fullstack/
├── backend/            # Flask API & Python Logic
│   ├── app.py
│   ├── requirements.txt
│   └── venv/           # Python Virtual Environment
├── frontend/           # React + Vite UI
│   ├── src/
│   └── package.json
├── start_all.sh        # One-click launch script
└── .gitignore          # Keeps the repo clean

```

---

## Quick Start (Automated)

The easiest way to get the app running is to use the provided shell script:

1. **Clone the Repo:**
```bash
git clone [https://github.com/carl-fristam/m4-fullstack-test.git](https://github.com/carl-fristam/m4-fullstack-test.git)
cd m4-fullstack-test

```


2. **Run the Script:**
```bash
chmod +x start_all.sh
zsh start_all.sh

```


* **Frontend:** [http://localhost:5173](https://www.google.com/search?q=http://localhost:5173)
* **Backend API:** [http://localhost:5000](https://www.google.com/search?q=http://localhost:5000)

---

## Manual Setup (Step-by-Step)

If you need to install dependencies for the first time or run servers separately:

### 1. Backend Setup (Python)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 app.py

```

### 2. Frontend Setup (React)

```bash
cd frontend
npm install
npm run dev

```

---

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/` | Base Health Check |
| `GET` | `/api/data` | Returns JSON data to the React UI |

---

## Stopping the App

The backend runs as a background process to allow a single terminal window to handle both servers. To stop it:

1. **Frontend:** Press `Ctrl + C` in the terminal.
2. **Backend:** Run the following command:
```bash
pkill -f app.py

```



---

## Roadmap

* [ ] Add **SQLite** for data persistence.
* [ ] Implement a `POST` route to save user input.
* [ ] Add `.env` support for secret keys.

```