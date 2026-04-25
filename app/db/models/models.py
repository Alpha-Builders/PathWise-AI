from core.database import Base
from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime




class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String(250), nullable=False)
    profile_image = Column(String(255), nullable=True)

    phone = Column(String(20), nullable=True)
    school = Column(String(150), nullable=True)
    grade = Column(String(50), nullable=True)

    major = Column(String(150), nullable=True)
    gpa = Column(String(10), nullable=True)
    sat = Column(String(10), nullable=True)
    grad_year = Column(String(10), nullable=True)

    interests = Column(String(255), nullable=True)
    activities = Column(String(255), nullable=True)

    path = Column(String(50), nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)