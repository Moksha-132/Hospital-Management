from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from sqlalchemy.orm import Session
import os
import shutil
from typing import List
from app import models, schemas
from app.database import get_db
from app.utils.deps import get_current_doctor, get_current_user
from datetime import datetime
from fastapi import BackgroundTasks
from app.utils.email import send_prescription_notification
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

router = APIRouter(prefix="/doctors", tags=["Doctors"])

@router.get("/", response_model=List[schemas.DoctorResponse])
def get_all_doctors(db: Session = Depends(get_db)):
    doctors = db.query(models.Doctor).filter(models.Doctor.is_verified == True).all()
    return doctors

@router.get("/average-rating")
def get_average_rating(db: Session = Depends(get_db)):
    from sqlalchemy import func
    avg_rating = db.query(func.avg(models.Appointment.rating)).filter(models.Appointment.rating != None).scalar()
    total_reviews = db.query(func.count(models.Appointment.id)).filter(models.Appointment.rating != None).scalar()
    return {"average": round(avg_rating or 0, 1), "total": total_reviews or 0}

@router.get("/profile", response_model=schemas.DoctorResponse)
def get_my_profile(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_doctor)):
    if not current_user.doctor_profile:
        raise HTTPException(status_code=404, detail="Doctor profile not found")
    return current_user.doctor_profile

@router.put("/profile", response_model=schemas.DoctorResponse)
def update_profile(profile: schemas.DoctorCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_doctor)):
    doctor_profile = current_user.doctor_profile
    if not doctor_profile:
        raise HTTPException(status_code=404, detail="Doctor profile not found")
        
    doctor_profile.specialty = profile.specialty
    doctor_profile.consultation_fee = profile.consultation_fee
    doctor_profile.bio = profile.bio
    db.commit()
    db.refresh(doctor_profile)
    return doctor_profile

@router.post("/profile/avatar", response_model=schemas.DoctorResponse)
async def upload_avatar(file: UploadFile = File(...), db: Session = Depends(get_db), current_user: models.User = Depends(get_current_doctor)):
    doctor_profile = current_user.doctor_profile
    if not doctor_profile:
        raise HTTPException(status_code=404, detail="Doctor profile not found")
        
    safe_filename = file.filename.replace(" ", "_")
    filename = f"doctor_{current_user.id}_avatar_{safe_filename}"
    file_path = os.path.join("uploads", filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    avatar_url = f"http://localhost:8000/uploads/{filename}"
    doctor_profile.avatar_url = avatar_url
    db.commit()
    db.refresh(doctor_profile)
    return doctor_profile

@router.post("/slots", response_model=schemas.SlotResponse)
def create_slot(slot: schemas.SlotCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_doctor)):
    doctor_profile = current_user.doctor_profile
    if not doctor_profile:
        raise HTTPException(status_code=404, detail="Doctor profile not found")
        
    new_slot = models.DoctorSlot(
        doctor_id=doctor_profile.id,
        start_time=slot.start_time,
        end_time=slot.end_time,
        is_booked=False
    )
    db.add(new_slot)
    db.commit()
    db.refresh(new_slot)
    return new_slot

@router.get("/my/slots", response_model=List[schemas.SlotResponse])
def get_my_slots(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_doctor)):
    doctor_profile = current_user.doctor_profile
    if not doctor_profile:
        raise HTTPException(status_code=404, detail="Doctor profile not found")
    
    slots = db.query(models.DoctorSlot).filter(
        models.DoctorSlot.doctor_id == doctor_profile.id
    ).all()
    return slots

@router.get("/{doctor_id}/slots", response_model=List[schemas.SlotResponse])
def get_doctor_slots(doctor_id: int, db: Session = Depends(get_db)):
    slots = db.query(models.DoctorSlot).filter(
        models.DoctorSlot.doctor_id == doctor_id,
        models.DoctorSlot.is_booked == False,
        models.DoctorSlot.start_time > datetime.utcnow()
    ).all()
    return slots

@router.delete("/slots/{slot_id}")
def delete_slot(slot_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_doctor)):
    doctor_profile = current_user.doctor_profile
    slot = db.query(models.DoctorSlot).filter(
        models.DoctorSlot.id == slot_id,
        models.DoctorSlot.doctor_id == doctor_profile.id
    ).first()
    
    if not slot:
        raise HTTPException(status_code=404, detail="Slot not found")
    if slot.is_booked:
        raise HTTPException(status_code=400, detail="Cannot delete a booked slot")
        
    db.delete(slot)
    db.commit()
    return {"message": "Slot deleted successfully"}

@router.get("/my/appointments", response_model=List[schemas.AppointmentResponse])
def get_my_appointments(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_doctor)):
    doctor_profile = current_user.doctor_profile
    if not doctor_profile:
        raise HTTPException(status_code=404, detail="Doctor profile not found")
        
    appointments = db.query(models.Appointment).filter(
        models.Appointment.doctor_id == doctor_profile.id
    ).all()
    return appointments

@router.put("/appointments/{appointment_id}/approve")
def approve_appointment(appointment_id: int, meet_link: str = None, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_doctor)):
    doctor_profile = current_user.doctor_profile
    
    appointment = db.query(models.Appointment).filter(
        models.Appointment.id == appointment_id,
        models.Appointment.doctor_id == doctor_profile.id
    ).first()
    
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
        
    appointment.status = models.AppointmentStatus.CONFIRMED
    if meet_link:
        appointment.meeting_link = meet_link
    else:
        appointment.meeting_link = f"https://meet.jit.si/hospital_appointment_{appointment.id}_{appointment.patient_id}"
        
    db.commit()
    return {"message": "Appointment approved", "status": "confirmed", "meeting_link": appointment.meeting_link}

@router.put("/appointments/{appointment_id}/reject")
def reject_appointment(appointment_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_doctor)):
    doctor_profile = current_user.doctor_profile
    
    appointment = db.query(models.Appointment).filter(
        models.Appointment.id == appointment_id,
        models.Appointment.doctor_id == doctor_profile.id
    ).first()
    
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
        
    appointment.status = models.AppointmentStatus.REJECTED
    slot = db.query(models.DoctorSlot).filter(models.DoctorSlot.id == appointment.slot_id).first()
    if slot:
        slot.is_booked = False
        
    if appointment.payment_intent_id and appointment.payment_status == "paid":
        appointment.payment_status = "refunded"
        
    db.commit()
    return {"message": "Appointment rejected and payment rolled back to user"}

@router.post("/appointments/{appointment_id}/notify-call")
def notify_patient_call_started(appointment_id: int, background_tasks: BackgroundTasks, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_doctor)):
    from app.utils.email import send_call_started_email
    doctor_profile = current_user.doctor_profile
    
    appointment = db.query(models.Appointment).filter(
        models.Appointment.id == appointment_id,
        models.Appointment.doctor_id == doctor_profile.id
    ).first()
    
    if not appointment or not appointment.patient:
        raise HTTPException(status_code=404, detail="Appointment not found")
        
    if appointment.meeting_link:
        background_tasks.add_task(
            send_call_started_email, 
            appointment.patient.email, 
            appointment.patient.full_name,
            current_user.full_name,
            appointment.meeting_link
        )
        
    return {"message": "Patient notified successfully"}

@router.post("/appointments/{appointment_id}/prescription", response_model=schemas.PrescriptionResponse)
def add_prescription(appointment_id: int, prescription: schemas.PrescriptionCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_doctor)):
    doctor_profile = current_user.doctor_profile
    
    appointment = db.query(models.Appointment).filter(
        models.Appointment.id == appointment_id,
        models.Appointment.doctor_id == doctor_profile.id
    ).first()
    
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
        
    new_prescription = models.Prescription(
        appointment_id=appointment_id,
        medicines=prescription.medicines,
        instructions=prescription.instructions,
        file_url=prescription.file_url
    )
    
    db.add(new_prescription)
    appointment.status = models.AppointmentStatus.COMPLETED
    db.commit()
    db.refresh(new_prescription)
    
    pdf_filename = f"prescription_pdf_{appointment_id}.pdf"
    pdf_path = os.path.join("uploads", pdf_filename)
    if not os.path.exists("uploads"):
        os.makedirs("uploads")
        
    c = canvas.Canvas(pdf_path, pagesize=letter)
    width, height = letter
    
    # Logo / Header
    c.setFont("Helvetica-Bold", 24)
    c.setFillColorRGB(0.1, 0.2, 0.5)
    c.drawString(50, height - 50, "MEDICARE")
    
    c.setFont("Helvetica", 10)
    c.setFillColorRGB(0.5, 0.5, 0.5)
    c.drawString(50, height - 65, "Hospital Management System")
    
    # Line
    c.setStrokeColorRGB(0.8, 0.8, 0.8)
    c.line(50, height - 75, width - 50, height - 75)
    
    # Doctor Details
    c.setFont("Helvetica-Bold", 12)
    c.setFillColorRGB(0, 0, 0)
    c.drawString(50, height - 100, f"Dr. {current_user.full_name}")
    c.setFont("Helvetica", 10)
    c.drawString(50, height - 115, f"Specialty: {doctor_profile.specialty}")
    
    # Patient Details
    c.setFont("Helvetica-Bold", 12)
    if appointment.patient:
        c.drawString(width - 250, height - 100, f"Patient: {appointment.patient.full_name}")
    c.setFont("Helvetica", 10)
    c.drawString(width - 250, height - 115, f"Date: {datetime.now().strftime('%B %d, %Y %H:%M')}")
    c.drawString(width - 250, height - 130, f"Appointment ID: #{appointment.id}")
    
    # Prescription Title
    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, height - 160, "PRESCRIPTION DETAILS")
    
    # Content
    y = height - 190
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "Medicines:")
    y -= 20
    c.setFont("Helvetica", 11)
    
    medicines_lines = prescription.medicines.split('\n') if prescription.medicines else ["None"]
    for line in medicines_lines:
        c.drawString(60, y, line)
        y -= 15
        
    y -= 10
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "Instructions / Notes:")
    y -= 20
    c.setFont("Helvetica", 11)
    
    instructions_lines = prescription.instructions.split('\n') if prescription.instructions else ["None"]
    for line in instructions_lines:
        c.drawString(60, y, line)
        y -= 15
        
    # Signature
    y -= 50
    c.setFont("Times-Italic", 14)
    c.drawString(width - 200, y, f"Dr. {current_user.full_name}")
    y -= 15
    c.setFont("Helvetica", 10)
    c.setStrokeColorRGB(0,0,0)
    c.line(width - 210, y+10, width - 50, y+10)
    c.drawString(width - 200, y - 5, "Signature")
    
    c.save()

    if appointment.patient:
        background_tasks.add_task(
            send_prescription_notification, 
            appointment.patient.email, 
            appointment_id,
            appointment.patient.full_name,
            current_user.full_name,
            pdf_path
        )
    
    return new_prescription

@router.post("/appointments/{appointment_id}/message")
def doctor_send_message(appointment_id: int, message_data: schemas.MessageCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_doctor)):
    """Doctor sends a message to the patient"""
    doctor_profile = current_user.doctor_profile
    appointment = db.query(models.Appointment).filter(
        models.Appointment.id == appointment_id,
        models.Appointment.doctor_id == doctor_profile.id
    ).first()
    
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
        
    existing_notes = appointment.notes or ""
    appointment.notes = existing_notes + f"\nDoctor [{current_user.full_name}]: {message_data.message}"
    db.commit()
    
    if appointment.patient:
        from app.utils.email import send_message_notification
        background_tasks.add_task(
            send_message_notification,
            appointment.patient.email,
            appointment.patient.full_name,
            current_user.full_name,
            True
        )
        
    return {"message": "Message sent successfully"}
