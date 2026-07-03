from datetime import datetime

from pydantic import BaseModel


class DeviceOut(BaseModel):
    id: int
    name: str
    browser: str
    os: str
    location: str
    is_current: bool
    last_active: datetime

    model_config = {"from_attributes": True}
