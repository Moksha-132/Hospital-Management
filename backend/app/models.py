from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Float, Enum, Text
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from .database import Base

class UserRole(enum.Enum):
    ADMIN = "admin"
    DOCTOR = "doctor"
    PATIENT = "patient"

class AppointmentStatus(enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    REJECTED = "rejected"
    COMPLETED = "completed"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.PATIENT, nullable=False)
    full_name = Column(String, nullable=False)
    phone = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
   
    doctor_profile = relationship("Doctor", back_populates="user", uselist=False)
    appointments_as_patient = relationship("Appointment", back_populates="patient", foreign_keys="Appointment.patient_id")

class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    specialty = Column(String, nullable=False)
    consultation_fee = Column(Float, nullable=False)
    bio = Column(Text)
    avatar_url = Column(String, nullable=True)
    is_verified = Column(Boolean, default=False)
    
    user = relationship("User", back_populates="doctor_profile")
    appointments = relationship("Appointment", back_populates="doctor", foreign_keys="Appointment.doctor_id")
    slots = relationship("DoctorSlot", back_populates="doctor")

class DoctorSlot(Base):
    __tablename__ = "doctor_slots"

    id = Column(Integer, primary_key=True, index=True)
    doctor_id = Column(Integer, ForeignKey("doctors.id"))
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    is_booked = Column(Boolean, default=False)
    
    doctor = relationship("Doctor", back_populates="slots")

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("users.id"))
    doctor_id = Column(Integer, ForeignKey("doctors.id"))
    slot_id = Column(Integer, ForeignKey("doctor_slots.id"))
    status = Column(Enum(AppointmentStatus), default=AppointmentStatus.PENDING)
    payment_intent_id = Column(String)
    payment_status = Column(String, default="pending")
    meeting_link = Column(String)
    notes = Column(Text)
    patient_report_url = Column(String, nullable=True)
    rating = Column(Integer, nullable=True)
    review = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    patient = relationship("User", back_populates="appointments_as_patient", foreign_keys=[patient_id])
    doctor = relationship("Doctor", back_populates="appointments", foreign_keys=[doctor_id])
    slot = relationship("DoctorSlot")
    prescription = relationship("Prescription", back_populates="appointment", uselist=False)

class Prescription(Base):
    __tablename__ = "prescriptions"

    id = Column(Integer, primary_key=True, index=True)
    appointment_id = Column(Integer, ForeignKey("appointments.id"), unique=True)
    medicines = Column(Text, nullable=True)
    instructions = Column(Text)
    file_url = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    appointment = relationship("Appointment", back_populates="prescription")

class InventoryItem(Base):
    __tablename__ = "inventory"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    description = Column(Text)
    stock_quantity = Column(Integer, default=0)
    price = Column(Float, nullable=False)
    requires_prescription = Column(Boolean, default=False)
