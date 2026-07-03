from datetime import datetime

from pydantic import BaseModel


class ActivityOut(BaseModel):
    id: int
    action: str
    device: str
    location: str
    ip_address: str
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}
