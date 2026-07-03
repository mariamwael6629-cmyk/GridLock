from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.security import hash_password, verify_password
from app.db.database import get_db
from app.models.user import User
from app.schemas.user import ChangePasswordRequest, MessageResponse, ProfileUpdateRequest, UserOut
from app.services import auth_service

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("/profile", response_model=UserOut)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/profile", response_model=UserOut)
def update_profile(
    payload: ProfileUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if payload.email != current_user.email and auth_service.get_user_by_email(db, payload.email):
        raise HTTPException(status_code=400, detail="Email already in use.")

    current_user.name = payload.name
    current_user.email = payload.email
    db.commit()
    db.refresh(current_user)
    return current_user


@router.put("/change-password", response_model=MessageResponse)
def change_password(
    payload: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not verify_password(payload.current, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Current password is incorrect.")
    if payload.new_password != payload.confirm:
        raise HTTPException(status_code=400, detail="Passwords do not match.")

    current_user.hashed_password = hash_password(payload.new_password)
    db.commit()
    return MessageResponse(message="Password changed successfully.")


@router.delete("/account", response_model=MessageResponse)
def delete_account(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db.delete(current_user)
    db.commit()
    return MessageResponse(message="Account deleted.")
