from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from .models import UserRole, AppointmentStatus

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    phone: Optional[str] = None

class UserCreate(UserBase):
    password: str
    role: UserRole = UserRole.PATIENT

class UserResponse(UserBase):
    id: int
    role: UserRole
    created_at: datetime
    
    class Config:
        from_attributes = True

class DoctorBase(BaseModel):
    specialty: str
    consultation_fee: float
    bio: Optional[str] = None
    avatar_url: Optional[str] = None

class DoctorCreate(DoctorBase):
    pass

class DoctorResponse(DoctorBase):
    id: int
    user_id: int
    is_verified: bool
    user: UserResponse
    
    class Config:
        from_attributes = True

class SlotCreate(BaseModel):
    start_time: datetime
    end_time: datetime

class SlotResponse(BaseModel):
    id: int
    doctor_id: int
    start_time: datetime
    end_time: datetime
    is_booked: bool
    
    class Config:
        from_attributes = True

class AppointmentBase(BaseModel):
    slot_id: int

class AppointmentCreate(AppointmentBase):
    pass

class AppointmentResponse(BaseModel):
    id: int
    patient_id: int
    doctor_id: int
    slot_id: int
    status: AppointmentStatus
    payment_status: str
    meeting_link: Optional[str] = None
    notes: Optional[str] = None
    patient_report_url: Optional[str] = None
    rating: Optional[int] = None
    review: Optional[str] = None
    created_at: datetime
    patient: Optional[UserResponse] = None
    doctor: Optional[DoctorResponse] = None
    
    class Config:
        from_attributes = True

class PrescriptionCreate(BaseModel):
    appointment_id: int
    medicines: Optional[str] = None
    instructions: Optional[str] = None
    file_url: Optional[str] = None

class MessageCreate(BaseModel):
    message: str

class PrescriptionResponse(PrescriptionCreate):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class InventoryItemBase(BaseModel):
    name: str
    description: Optional[str] = None
    stock_quantity: int
    price: float
    requires_prescription: bool = False

class InventoryItemCreate(InventoryItemBase):
    pass

class InventoryItemResponse(InventoryItemBase):
    id: int
    
    class Config:
        from_attributes = True
