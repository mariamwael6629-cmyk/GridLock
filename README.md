# 🔐 GridLock

A modern, high-security full-stack authentication and account-security portal. GridLock bridges a high-performance **FastAPI** backend with a sleek, ultra-responsive **React (Vite)** frontend to deliver an enterprise-grade security experience.

---

## 🚀 Key Features

* **Secure Authentication:** Robust JWT-based bearer token authentication flow with secure storage.
* **Account Security Hub:** Comprehensive live tracking of user activity logs, active sessions, and authorized devices.
* **Flexible Database Control:** Seamless automatic SQLite initialization for local development, pre-configured for instant migration to production databases like PostgreSQL or MySQL.
* **Developer-Friendly Sandbox:** OTP codes and verification links are intelligently logged to the API console for frictionless, zero-configuration testing.

---

## 📁 Project Structure

```text
GridLock/
├── backend/       # FastAPI Core Service (Auth, Users, Activity, Devices, Security)
└── frontend/      # React (Vite) Single-Page Application (Modern UI/UX)

```

---

## 🛠️ Architecture & Tech Stack

* **Frontend:** React.js, Vite, Tailwind CSS (Modern, clean, and highly responsive layouts).
* **Backend:** Python (FastAPI), Pydantic, SQLAlchemy.
* **Database:** SQLite (Dev) / Production-ready for PostgreSQL & MySQL.

---

## ⚡ Getting Started

### 1. Backend Setup

Navigate to the backend directory, initialize your virtual environment, and fire up the FastAPI server:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env   

# Start the live development server
uvicorn app.main:app --reload --port 8000

```

> 💡 **Interactive API Documentation:** Once the backend is running, explore and test the endpoints live via **Swagger UI** at `http://127.0.0.1:8000/docs` or view alternative docs at `/redoc`.

### 2. Frontend Setup

Open a new terminal window, install the dependencies, and launch the Vite development server:

```bash
cd frontend
npm install

# Configure environment variables
cp .env.example .env   

# Launch the application
npm run dev

```

> 🌐 **Live Preview:** The frontend application will be running locally at `http://127.0.0.1:5173`.

---

## ⚠️ Production Checklist

* **Database Integration:** Update the `DATABASE_URL` in your backend `.env` file to point to an enterprise database (PostgreSQL/MySQL).
* **Notification Services:** Swap the console-logged OTP/verification links with a production-ready **SMTP** server or a third-party email gateway.
* **Security Hardening:** Ensure the `SECRET_KEY` is changed to a cryptographically secure value in production environments.

```