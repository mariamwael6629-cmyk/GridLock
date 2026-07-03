from pydantic import BaseModel


class SecurityScoreOut(BaseModel):
    score: int
    two_fa_enabled: bool
    strong_password: bool
    email_verified: bool
    has_recovery_codes: bool


class StatsOut(BaseModel):
    active_sessions: int
    login_attempts_7d: int
    blocked_attempts: int
    trusted_devices: int
