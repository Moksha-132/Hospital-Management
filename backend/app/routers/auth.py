from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app import models, schemas
from app.database import get_db
from app.utils.security import verify_password, get_password_hash, create_access_token
from app.utils.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

from pydantic import BaseModel

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    email: str
    otp: str
    new_password: str

@router.post("/register", response_model=schemas.UserResponse)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    hashed_pwd = get_password_hash(user.password)
    
    new_user = models.User(
        email=user.email,
        hashed_password=hashed_pwd,
        full_name=user.full_name,
        phone=user.phone,
        role=user.role
    )
    
    db.add(new_user)
    db.flush()
    if user.role == models.UserRole.DOCTOR:
        doctor_profile = models.Doctor(
            user_id=new_user.id,
            specialty="General",
            consultation_fee=0.0
        )
        db.add(doctor_profile)
    db.commit()
    db.refresh(new_user)
        
    return new_user

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token = create_access_token(data={"sub": str(user.id), "role": user.role.value})
    return {"access_token": access_token, "token_type": "bearer", "role": user.role.value, "name": user.full_name}

@router.get("/me", response_model=schemas.UserResponse)
def get_current_user_profile(current_user: models.User = Depends(get_current_user)):
    return current_user

@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == req.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Email not found in our records")
    
    # Generate 6-digit OTP
    import random
    otp = str(random.randint(100000, 999999))
    
    # Save OTP to DB
    # Clean up old OTPs for this email
    db.query(models.PasswordResetOTP).filter(models.PasswordResetOTP.email == req.email).delete()
    
    new_otp = models.PasswordResetOTP(email=req.email, otp=otp)
    db.add(new_otp)
    db.commit()
    
    # Send email
    from app.utils.email import send_password_reset_otp_email
    background_tasks.add_task(
        send_password_reset_otp_email,
        user.email,
        user.full_name,
        otp
    )
    
    return {"message": "An OTP has been sent to your email address."}

@router.post("/reset-password")
def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == req.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Email not found")
        
    otp_record = db.query(models.PasswordResetOTP).filter(
        models.PasswordResetOTP.email == req.email,
        models.PasswordResetOTP.otp == req.otp
    ).first()
    
    if not otp_record:
        raise HTTPException(status_code=400, detail="Invalid OTP")
        
    user.hashed_password = get_password_hash(req.new_password)
    db.delete(otp_record)
    db.commit()
    
    return {"message": "Password has been successfully reset. You can now login."}
