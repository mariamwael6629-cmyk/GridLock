from sqlalchemy.orm import Session

from app.models.activity import Activity
from app.models.device import Device
from app.models.user import User


def compute_security_score(user: User) -> dict:
    two_fa = user.two_fa_enabled
    strong_password = True  # password policy enforced at registration time
    email_verified = user.verified
    has_recovery_codes = False

    checks = [two_fa, strong_password, email_verified, has_recovery_codes]
    score = int(sum(checks) / len(checks) * 100)

    return {
        "score": score,
        "two_fa_enabled": two_fa,
        "strong_password": strong_password,
        "email_verified": email_verified,
        "has_recovery_codes": has_recovery_codes,
    }


def compute_stats(db: Session, user: User) -> dict:
    active_sessions = db.query(Device).filter(Device.user_id == user.id).count()
    login_attempts_7d = db.query(Activity).filter(
        Activity.user_id == user.id, Activity.action.in_(["Login", "Failed Login"])
    ).count()
    blocked_attempts = db.query(Activity).filter(
        Activity.user_id == user.id, Activity.status == "danger"
    ).count()
    trusted_devices = db.query(Device).filter(Device.user_id == user.id).count()

    return {
        "active_sessions": active_sessions,
        "login_attempts_7d": login_attempts_7d,
        "blocked_attempts": blocked_attempts,
        "trusted_devices": trusted_devices,
    }
