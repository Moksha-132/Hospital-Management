import os
from app.database import SessionLocal, engine
from app.models import User, UserRole
from app.utils.security import get_password_hash

def create_admin():
    db = SessionLocal()
    admin_email = "admin@medicare.com"
    existing_admin = db.query(User).filter(User.email == admin_email).first()
    if existing_admin:
        print("Admin user already exists")
    else:
        new_admin = User(
            email=admin_email,
            hashed_password=get_password_hash("admin"),
            role=UserRole.ADMIN,
            full_name="Admin User"
        )
        db.add(new_admin)
        db.commit()
        print("Admin user created successfully")
    db.close()

if __name__ == "__main__":
    create_admin()
