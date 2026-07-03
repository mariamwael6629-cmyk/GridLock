from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.database import get_db
from app.models.device import Device
from app.models.user import User
from app.schemas.device import DeviceOut
from app.schemas.user import MessageResponse

router = APIRouter(prefix="/api/devices", tags=["devices"])


@router.get("", response_model=list[DeviceOut])
def list_devices(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Device).filter(Device.user_id == current_user.id).order_by(Device.last_active.desc()).all()


@router.delete("/{device_id}", response_model=MessageResponse)
def remove_device(device_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    device = db.query(Device).filter(Device.id == device_id, Device.user_id == current_user.id).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found.")
    if device.is_current:
        raise HTTPException(status_code=400, detail="Cannot remove the current device.")
    db.delete(device)
    db.commit()
    return MessageResponse(message="Device removed.")


@router.post("/logout-all", response_model=MessageResponse)
def logout_all(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db.query(Device).filter(Device.user_id == current_user.id, Device.is_current.is_(False)).delete()
    db.commit()
    return MessageResponse(message="All other sessions terminated.")
