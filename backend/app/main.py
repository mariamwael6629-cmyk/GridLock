from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import activity, auth, devices, security, users
from app.core.config import settings
from app.db.database import Base, engine
from app.models import Activity, Device, User  # noqa: F401 (ensures models are registered)

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.app_name,
    description="GridLock authentication and account-security API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(activity.router)
app.include_router(devices.router)
app.include_router(security.router)


@app.get("/api/health", tags=["health"])
def health_check():
    return {"status": "ok", "app": settings.app_name}
