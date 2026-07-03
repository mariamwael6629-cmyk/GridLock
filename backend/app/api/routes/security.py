from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.schemas.security import SecurityScoreOut, StatsOut
from app.services.security_service import compute_security_score, compute_stats

router = APIRouter(prefix="/api/security", tags=["security"])


@router.get("/score", response_model=SecurityScoreOut)
def get_security_score(current_user: User = Depends(get_current_user)):
    return compute_security_score(current_user)


@router.get("/stats", response_model=StatsOut)
def get_stats(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return compute_stats(db, current_user)
