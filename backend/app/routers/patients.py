from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, BackgroundTasks
from fastapi.responses import JSONResponse
import uuid
import os
import shutil
from sqlalchemy.orm import Session
from typing import List
from app import models, schemas
from app.database import get_db
from app.utils.deps import get_current_user
from app.utils.email import send_patient_report_notification

router = APIRouter(prefix="/patients", tags=["Patients"])

@router.get("/inventory", response_model=List[schemas.InventoryItemResponse])
def get_inventory(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """Patient views all inventory items"""
    return db.query(models.InventoryItem).all()

@router.get("/doctors", response_model=List[schemas.DoctorResponse])
def search_doctors(specialty: str = None, db: Session = Depends(get_db)):
    """Search for doctors, optionally filtering by specialty"""
    query = db.query(models.Doctor).filter(models.Doctor.is_verified == True)
    if specialty:
        query = query.filter(models.Doctor.specialty.ilike(f"%{specialty}%"))
    return query.all()

@router.post("/appointments", response_model=schemas.AppointmentResponse)
def book_appointment(appointment: schemas.AppointmentCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """Patient books a slot"""
    if current_user.role != models.UserRole.PATIENT:
        raise HTTPException(status_code=403, detail="Only patients can book appointments directly")
        
    slot = db.query(models.DoctorSlot).filter(models.DoctorSlot.id == appointment.slot_id).first()
    if not slot or slot.is_booked:
        raise HTTPException(status_code=400, detail="Slot is not available")
        
    new_appointment = models.Appointment(
        patient_id=current_user.id,
        doctor_id=slot.doctor_id,
        slot_id=slot.id,
        status=models.AppointmentStatus.PENDING,
        payment_status="pending"
    )
    
    db.add(new_appointment)
    db.commit()
    db.refresh(new_appointment)
    
    return new_appointment

@router.get("/appointments", response_model=List[schemas.AppointmentResponse])
def my_appointments(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """View patient's appointments"""
    return db.query(models.Appointment).filter(models.Appointment.patient_id == current_user.id).all()

@router.get("/appointments/{appointment_id}/prescription", response_model=schemas.PrescriptionResponse)
def get_prescription(appointment_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """View prescription for an appointment"""
    appointment = db.query(models.Appointment).filter(
        models.Appointment.id == appointment_id,
        models.Appointment.patient_id == current_user.id
    ).first()
    
    if not appointment or not appointment.prescription:
        raise HTTPException(status_code=404, detail="Prescription not found")
        
    return appointment.prescription

@router.post("/upload-prescription")
async def upload_pharmacy_prescription(file: UploadFile = File(...), current_user: models.User = Depends(get_current_user)):
    """Upload prescription file for ordering medicines"""
    if not os.path.exists("uploads"):
        os.makedirs("uploads")
    safe_filename = file.filename.replace(" ", "_")
    filename = f"pharmacy_{current_user.id}_{uuid.uuid4().hex[:8]}_{safe_filename}"
    file_path = os.path.join("uploads", filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    file_url = f"http://localhost:8000/uploads/{filename}"
    return {"message": "File uploaded successfully", "file_url": file_url}


@router.post("/appointments/{appointment_id}/upload")
async def upload_patient_file(appointment_id: int, background_tasks: BackgroundTasks, file: UploadFile = File(...), db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """Upload patient files/images"""
    appointment = db.query(models.Appointment).filter(
        models.Appointment.id == appointment_id,
        models.Appointment.patient_id == current_user.id
    ).first()
    
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
        
    safe_filename = file.filename.replace(" ", "_")
    filename = f"patient_{current_user.id}_apt_{appointment_id}_{safe_filename}"
    file_path = os.path.join("uploads", filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    file_url = f"http://localhost:8000/uploads/{filename}"
    appointment.patient_report_url = file_url
    db.commit()
    
    if appointment.doctor and appointment.doctor.user:
        background_tasks.add_task(
            send_patient_report_notification, 
            appointment.doctor.user.email, 
            appointment.id, 
            file_url,
            current_user.full_name,
            appointment.doctor.user.full_name
        )
    
    return {"message": "File uploaded successfully", "file_url": file_url}

@router.post("/order-medicine/{item_id}")
def order_medicine(item_id: int, quantity: int = 1, prescription_url: str = None, delivery_address: str = None, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """Order medicine with mock payment gateway"""
    if current_user.role != models.UserRole.PATIENT:
        raise HTTPException(status_code=403, detail="Only patients can order medicine")
        
    item = db.query(models.InventoryItem).filter(models.InventoryItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
        
    if item.stock_quantity < quantity:
        raise HTTPException(status_code=400, detail="Not enough stock")
        
    # Mock payment processing
    total_price = item.price * quantity
    payment_id = f"pi_med_{uuid.uuid4().hex[:10]}"
    
    new_order = models.PharmacyOrder(
        patient_id=current_user.id,
        item_id=item_id,
        quantity=quantity,
        total_price=total_price,
        prescription_url=prescription_url,
        delivery_address=delivery_address
    )
    db.add(new_order)
    
    item.stock_quantity -= quantity
    db.commit()
    
    return {
        "message": "Medicine ordered successfully",
        "item": item.name,
        "quantity": quantity,
        "total_paid": total_price,
        "payment_id": payment_id
    }

@router.post("/generate-receipt")
def generate_receipt(receipt_data: dict, current_user: models.User = Depends(get_current_user)):
    from reportlab.pdfgen import canvas
    from reportlab.lib.pagesizes import letter
    import os
    
    file_name = f"receipt_{receipt_data['group_id']}.pdf"
    file_path = f"uploads/{file_name}"
    
    if not os.path.exists("uploads"):
        os.makedirs("uploads")
        
    c = canvas.Canvas(file_path, pagesize=letter)
    c.setFont("Helvetica-Bold", 24)
    c.drawString(50, 750, "MEDICARE")
    
    c.setFont("Helvetica", 14)
    c.drawString(50, 710, "PAYMENT RECEIPT")
    c.drawString(50, 680, f"Order #: {receipt_data['group_id']}")
    c.drawString(50, 660, f"Date: {receipt_data['created_at']}")
    c.drawString(50, 640, f"Patient: {current_user.full_name}")
    
    y = 600
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "Items Purchased:")
    y -= 20
    
    c.setFont("Helvetica", 12)
    for item in receipt_data['items']:
        c.drawString(70, y, f"- {item['name']} (Qty: {item['quantity']}) : ${item['price']}")
        y -= 20
        
    y -= 20
    c.setFont("Helvetica-Bold", 14)
    c.drawString(50, y, f"Total Paid: ${receipt_data['total_price']}")
    
    if receipt_data.get('delivery_address'):
        y -= 40
        c.setFont("Helvetica-Bold", 12)
        c.drawString(50, y, "Delivery Address:")
        c.setFont("Helvetica", 12)
        y -= 20
        c.drawString(70, y, receipt_data['delivery_address'].replace('\n', ', ')[:100])
        
    c.save()
    
    return {"receipt_url": f"http://localhost:8000/{file_path}"}

@router.get("/my/orders", response_model=List[schemas.PharmacyOrderResponse])
def get_my_orders(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """Patient views all past pharmacy orders"""
    if current_user.role != models.UserRole.PATIENT:
        raise HTTPException(status_code=403, detail="Only patients can view orders")
    return db.query(models.PharmacyOrder).filter(models.PharmacyOrder.patient_id == current_user.id).order_by(models.PharmacyOrder.created_at.desc()).all()

@router.post("/appointments/{appointment_id}/message")
def patient_send_message(appointment_id: int, message_data: schemas.MessageCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """Patient sends a message to the doctor"""
    appointment = db.query(models.Appointment).filter(
        models.Appointment.id == appointment_id,
        models.Appointment.patient_id == current_user.id
    ).first()
    
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
        
    existing_notes = appointment.notes or ""
    appointment.notes = existing_notes + f"\nPatient [{current_user.full_name}]: {message_data.message}"
    db.commit()
    
    if appointment.doctor and appointment.doctor.user:
        from app.utils.email import send_message_notification
        background_tasks.add_task(
            send_message_notification,
            appointment.doctor.user.email,
            appointment.doctor.user.full_name,
            current_user.full_name,
            False
        )
        
    return {"message": "Message sent successfully"}

@router.post("/appointments/{appointment_id}/pay")
def pay_appointment(appointment_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """Patient pays for an approved appointment"""
    appointment = db.query(models.Appointment).filter(
        models.Appointment.id == appointment_id,
        models.Appointment.patient_id == current_user.id
    ).first()
    
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
        
    if appointment.status != models.AppointmentStatus.CONFIRMED:
        raise HTTPException(status_code=400, detail="Appointment must be approved by doctor before payment")
        
    if appointment.payment_status == "paid":
        raise HTTPException(status_code=400, detail="Already paid")
        
    slot = appointment.slot
    if slot.is_booked:
        raise HTTPException(status_code=400, detail="This slot has already been booked and paid for by another patient.")
        
    # Mocking Payment Gateway
    mock_payment_id = f"pi_{uuid.uuid4().hex[:16]}"
    
    appointment.payment_status = "paid"
    appointment.payment_intent_id = mock_payment_id
    slot.is_booked = True
    db.commit()
    return {"message": "Payment successful. Slot is now confirmed."}

@router.post("/appointments/{appointment_id}/rate")
def rate_doctor(appointment_id: int, rating: int, review: str = None, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """Patient rates a completed appointment"""
    appointment = db.query(models.Appointment).filter(
        models.Appointment.id == appointment_id,
        models.Appointment.patient_id == current_user.id
    ).first()
    
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
        
    if appointment.status != models.AppointmentStatus.COMPLETED:
        raise HTTPException(status_code=400, detail="Can only rate completed appointments")
        
    if rating < 1 or rating > 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")
        
    appointment.rating = rating
    appointment.review = review
    db.commit()
    return {"message": "Rating submitted successfully"}
