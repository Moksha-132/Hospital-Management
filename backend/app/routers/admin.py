from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app import models, schemas
from app.database import get_db
from app.utils.deps import get_current_admin
from sqlalchemy import func

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/dashboard/stats")
def get_dashboard_stats(db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin)):
    """Admin dashboard stats including total patients"""
    total_patients = db.query(func.count(models.User.id)).filter(models.User.role == models.UserRole.PATIENT).scalar()
    total_doctors = db.query(func.count(models.Doctor.id)).scalar()
    
    return {
        "total_patients": total_patients,
        "total_doctors": total_doctors
    }

@router.get("/patients", response_model=List[schemas.UserResponse])
def get_all_patients(db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin)):
    """View all patients"""
    return db.query(models.User).filter(models.User.role == models.UserRole.PATIENT).all()

@router.get("/doctors", response_model=List[schemas.DoctorResponse])
def get_all_doctors_admin(db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin)):
    """View all doctors for verification"""
    return db.query(models.Doctor).all()

@router.put("/doctors/{doctor_id}/verify", response_model=schemas.DoctorResponse)
def verify_doctor(doctor_id: int, db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin)):
    """Verify a doctor"""
    doctor = db.query(models.Doctor).filter(models.Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    doctor.is_verified = True
    db.commit()
    db.refresh(doctor)
    return doctor

@router.delete("/doctors/{doctor_id}")
def delete_doctor(doctor_id: int, db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin)):
    """Delete a doctor and their user account"""
    doctor = db.query(models.Doctor).filter(models.Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    user = db.query(models.User).filter(models.User.id == doctor.user_id).first()
    db.delete(doctor)
    if user:
        db.delete(user)
    db.commit()
    return {"message": "Doctor deleted successfully"}

@router.put("/patients/{user_id}", response_model=schemas.UserResponse)
def update_patient(user_id: int, user_update: schemas.UserUpdate, db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin)):
    """Update patient details"""
    user = db.query(models.User).filter(models.User.id == user_id, models.User.role == models.UserRole.PATIENT).first()
    if not user:
        raise HTTPException(status_code=404, detail="Patient not found")
    if user_update.full_name is not None: user.full_name = user_update.full_name
    if user_update.email is not None: user.email = user_update.email
    if user_update.phone is not None: user.phone = user_update.phone
    db.commit()
    db.refresh(user)
    return user

@router.put("/doctors/{doctor_id}", response_model=schemas.DoctorResponse)
def update_doctor(doctor_id: int, doc_update: schemas.DoctorUpdate, db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin)):
    """Update doctor details"""
    doctor = db.query(models.Doctor).filter(models.Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    user = db.query(models.User).filter(models.User.id == doctor.user_id).first()
    
    if doc_update.full_name is not None: user.full_name = doc_update.full_name
    if doc_update.email is not None: user.email = doc_update.email
    if doc_update.phone is not None: user.phone = doc_update.phone
    
    if doc_update.specialty is not None: doctor.specialty = doc_update.specialty
    if doc_update.consultation_fee is not None: doctor.consultation_fee = doc_update.consultation_fee
    
    db.commit()
    db.refresh(user)
    db.refresh(doctor)
    return doctor

@router.get("/inventory", response_model=List[schemas.InventoryItemResponse])
def get_inventory(db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin)):
    """View all inventory items"""
    return db.query(models.InventoryItem).all()

@router.post("/inventory", response_model=schemas.InventoryItemResponse)
def add_inventory_item(item: schemas.InventoryItemCreate, db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin)):
    """Add a new medicine/item to inventory"""
    new_item = models.InventoryItem(
        name=item.name,
        description=item.description,
        stock_quantity=item.stock_quantity,
        price=item.price,
        requires_prescription=item.requires_prescription
    )
    
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@router.put("/inventory/{item_id}", response_model=schemas.InventoryItemResponse)
def update_inventory_stock(item_id: int, added_stock: int, db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin)):
    """Update stock quantity"""
    item = db.query(models.InventoryItem).filter(models.InventoryItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
        
    item.stock_quantity += added_stock
    db.commit()
    db.refresh(item)
    return item

@router.put("/inventory/{item_id}/details", response_model=schemas.InventoryItemResponse)
def update_inventory_item(item_id: int, item_update: schemas.InventoryItemUpdate, db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin)):
    """Update inventory item details"""
    item = db.query(models.InventoryItem).filter(models.InventoryItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
        
    if item_update.name is not None: item.name = item_update.name
    if item_update.description is not None: item.description = item_update.description
    if item_update.price is not None: item.price = item_update.price
    if item_update.requires_prescription is not None: item.requires_prescription = item_update.requires_prescription
    
    db.commit()
    db.refresh(item)
    return item

@router.delete("/inventory/{item_id}")
def delete_inventory_item(item_id: int, db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin)):
    """Delete an inventory item"""
    item = db.query(models.InventoryItem).filter(models.InventoryItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
        
    db.delete(item)
    db.commit()
    return {"message": "Item deleted successfully"}

@router.get("/ratings")
def get_recent_ratings(db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin)):
    """Get all recent ratings for desktop notification & dashboard view"""
    appointments = db.query(models.Appointment)\
        .filter(models.Appointment.rating != None)\
        .order_by(models.Appointment.created_at.desc())\
        .limit(50).all()
        
    return [{
        "id": a.id,
        "doctor_name": a.doctor.user.full_name,
        "patient_name": a.patient.full_name,
        "rating": a.rating,
        "review": a.review,
        "date": a.created_at
    } for a in appointments]
