from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import generate_otp, generate_token, hash_password, verify_password
from app.models.activity import Activity
from app.models.device import Device
from app.models.user import User


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()


def create_user(db: Session, name: str, email: str, password: str) -> User:
    user = User(
        name=name,
        email=email,
        hashed_password=hash_password(password),
        avatar="".join([p[0] for p in name.split()[:2]]).upper() or "U",
        email_verify_code=generate_otp(),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def is_locked(user: User) -> bool:
    if user.locked_until is None:
        return False
    now = datetime.now(timezone.utc)
    locked_until = user.locked_until
    if locked_until.tzinfo is None:
        locked_until = locked_until.replace(tzinfo=timezone.utc)
    if now >= locked_until:
        return False
    return True


def register_failed_attempt(db: Session, user: User) -> None:
    user.failed_login_attempts += 1
    if user.failed_login_attempts >= settings.max_login_attempts:
        user.locked_until = datetime.now(timezone.utc) + timedelta(minutes=settings.lockout_minutes)
    db.commit()


def reset_failed_attempts(db: Session, user: User) -> None:
    user.failed_login_attempts = 0
    user.locked_until = None
    db.commit()


def authenticate_user(db: Session, email: str, password: str) -> User | None:
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


def issue_otp(db: Session, user: User) -> str:
    code = generate_otp()
    user.otp_code = code
    user.otp_expires_at = datetime.now(timezone.utc) + timedelta(minutes=settings.otp_expire_minutes)
    db.commit()
    return code


def verify_otp(db: Session, user: User, code: str) -> bool:
    if not user.otp_code or not user.otp_expires_at:
        return False
    expires_at = user.otp_expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if datetime.now(timezone.utc) > expires_at:
        return False
    if user.otp_code != code:
        return False
    user.otp_code = None
    user.otp_expires_at = None
    db.commit()
    return True


def issue_reset_code(db: Session, user: User) -> str:
    code = generate_token(8)
    user.reset_code = code
    user.reset_code_expires_at = datetime.now(timezone.utc) + timedelta(minutes=30)
    db.commit()
    return code


def verify_reset_code(db: Session, user: User, code: str) -> bool:
    if not user.reset_code or not user.reset_code_expires_at:
        return False
    expires_at = user.reset_code_expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if datetime.now(timezone.utc) > expires_at:
        return False
    return user.reset_code == code


def log_activity(
    db: Session,
    user: User,
    action: str,
    request,
    status_label: str = "success",
    device_label: str | None = None,
    location_label: str = "Unknown location",
) -> None:
    ua = request.headers.get("user-agent", "Unknown device") if request else "Unknown device"
    ip = request.client.host if request and request.client else "0.0.0.0"
    activity = Activity(
        user_id=user.id,
        action=action,
        device=device_label or ua,
        location=location_label,
        ip_address=ip,
        status=status_label,
    )
    db.add(activity)
    db.commit()


def ensure_current_device(db: Session, user: User, request) -> None:
    ua = request.headers.get("user-agent", "Unknown device") if request else "Unknown device"
    existing = db.query(Device).filter(Device.user_id == user.id, Device.browser == ua).first()
    if existing:
        existing.is_current = True
        existing.last_active = datetime.now(timezone.utc)
    else:
        db.query(Device).filter(Device.user_id == user.id).update({Device.is_current: False})
        device = Device(
            user_id=user.id,
            name="New Device",
            browser=ua,
            os="",
            location="Unknown location",
            is_current=True,
        )
        db.add(device)
    db.commit()
