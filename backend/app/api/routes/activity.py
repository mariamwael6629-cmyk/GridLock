from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.database import get_db
from app.models.activity import Activity
from app.models.user import User
from app.schemas.activity import ActivityOut

router = APIRouter(prefix="/api/activity", tags=["activity"])


@router.get("", response_model=list[ActivityOut])
def list_activity(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return (
        db.query(Activity)
        .filter(Activity.user_id == current_user.id)
        .order_by(Activity.created_at.desc())
        .limit(50)
        .all()
    )
