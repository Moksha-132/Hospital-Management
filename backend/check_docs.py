import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal
from app.models import Doctor

db = SessionLocal()
docs = db.query(Doctor).all()
for d in docs:
    print(f"Doc {d.id} profile_picture_url: {d.profile_picture_url}")
