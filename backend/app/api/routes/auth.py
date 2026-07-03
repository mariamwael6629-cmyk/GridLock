from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.security import create_access_token, hash_password
from app.db.database import get_db
from app.models.user import User
from app.schemas.user import (
    EmailVerifyRequest,
    ForgotPasswordRequest,
    LoginRequest,
    LoginResponse,
    MessageResponse,
    OTPVerifyRequest,
    RegisterRequest,
    ResetPasswordRequest,
    TokenResponse,
    UserOut,
)
from app.services import auth_service

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    if auth_service.get_user_by_email(db, payload.email):
        raise HTTPException(status_code=400, detail="An account with this email already exists.")

    user = auth_service.create_user(db, payload.name, payload.email, payload.password)
    # In production this code would be emailed; returned here for demo purposes only.
    return MessageResponse(message=f"Account created. Verification code: {user.email_verify_code}")


@router.post("/verify-email", response_model=MessageResponse)
def verify_email(payload: EmailVerifyRequest, db: Session = Depends(get_db)):
    user = auth_service.get_user_by_email(db, payload.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    if user.email_verify_code != payload.code:
        raise HTTPException(status_code=400, detail="Invalid verification code.")
    user.verified = True
    user.email_verify_code = None
    db.commit()
    return MessageResponse(message="Email verified successfully.")


@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest, request: Request, db: Session = Depends(get_db)):
    user = auth_service.get_user_by_email(db, payload.email)

    if user and auth_service.is_locked(user):
        raise HTTPException(status_code=423, detail="Account locked. Try again later.")

    authenticated = auth_service.authenticate_user(db, payload.email, payload.password)
    if not authenticated:
        if user:
            auth_service.register_failed_attempt(db, user)
            auth_service.log_activity(db, user, "Failed Login", request, status_label="danger")
            remaining = max(0, 5 - user.failed_login_attempts)
            if auth_service.is_locked(user):
                raise HTTPException(status_code=423, detail="Too many failed attempts. Account locked.")
            raise HTTPException(status_code=401, detail=f"Invalid credentials. {remaining} attempts remaining.")
        raise HTTPException(status_code=401, detail="Invalid credentials.")

    auth_service.reset_failed_attempts(db, authenticated)

    if authenticated.two_fa_enabled:
        auth_service.issue_otp(db, authenticated)
        return LoginResponse(requires_2fa=True, email=authenticated.email)

    auth_service.log_activity(db, authenticated, "Login", request, status_label="success")
    auth_service.ensure_current_device(db, authenticated, request)
    token = create_access_token(authenticated.email)
    return LoginResponse(
        requires_2fa=False,
        token=TokenResponse(access_token=token, user=UserOut.model_validate(authenticated)),
    )


@router.post("/verify-otp", response_model=TokenResponse)
def verify_otp(payload: OTPVerifyRequest, request: Request, db: Session = Depends(get_db)):
    user = auth_service.get_user_by_email(db, payload.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    if not auth_service.verify_otp(db, user, payload.code):
        raise HTTPException(status_code=400, detail="Invalid or expired OTP code.")

    auth_service.log_activity(db, user, "Login", request, status_label="success")
    auth_service.ensure_current_device(db, user, request)
    token = create_access_token(user.email)
    return TokenResponse(access_token=token, user=UserOut.model_validate(user))


@router.post("/forgot-password", response_model=MessageResponse)
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = auth_service.get_user_by_email(db, payload.email)
    if not user:
        # Avoid leaking whether an email exists.
        return MessageResponse(message="If that email exists, a reset code has been sent.")
    code = auth_service.issue_reset_code(db, user)
    return MessageResponse(message=f"Reset code sent. Code: {code}")


@router.post("/reset-password", response_model=MessageResponse)
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    user = auth_service.get_user_by_email(db, payload.email)
    if not user or not auth_service.verify_reset_code(db, user, payload.code):
        raise HTTPException(status_code=400, detail="Invalid or expired reset code.")

    user.hashed_password = hash_password(payload.password)
    user.reset_code = None
    user.reset_code_expires_at = None
    user.failed_login_attempts = 0
    user.locked_until = None
    db.commit()
    return MessageResponse(message="Password reset successfully.")


@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    return current_user
