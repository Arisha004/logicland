from sqlalchemy import (
    create_engine, Column, Integer, String, Float,
    Boolean, DateTime, ForeignKey
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import os

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:password@localhost:5432/logicland"
)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id             = Column(Integer, primary_key=True, index=True)
    username       = Column(String, unique=True, index=True, nullable=False)
    email          = Column(String, unique=True, index=True, nullable=False)
    hashed_password= Column(String, nullable=False)
    full_name      = Column(String, default="")
    age            = Column(Integer, default=10)
    avatar         = Column(String, default="🦊")
    skill_level    = Column(String, default="Beginner")
    xp_points      = Column(Integer, default=0)
    streak_days    = Column(Integer, default=0)
    created_at     = Column(DateTime, default=datetime.utcnow)

    badges   = relationship("Badge", back_populates="user", cascade="all, delete")
    progress = relationship("ModuleProgress", back_populates="user", cascade="all, delete")
    sessions = relationship("PuzzleSession", back_populates="user", cascade="all, delete")


class Badge(Base):
    __tablename__ = "badges"

    id         = Column(Integer, primary_key=True, index=True)
    user_id    = Column(Integer, ForeignKey("users.id"))
    name       = Column(String, nullable=False)
    icon       = Column(String, default="🏆")
    earned_at  = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="badges")


class ModuleProgress(Base):
    __tablename__ = "module_progress"

    id                = Column(Integer, primary_key=True, index=True)
    user_id           = Column(Integer, ForeignKey("users.id"))
    module_name       = Column(String, nullable=False)
    module_icon       = Column(String, default="📦")
    module_color      = Column(String, default="#4a8c5c")
    difficulty_tier   = Column(Integer, default=1)
    accuracy_rate     = Column(Float, default=0.0)
    puzzles_completed = Column(Integer, default=0)
    total_puzzles     = Column(Integer, default=30)
    is_mastered       = Column(Boolean, default=False)

    user = relationship("User", back_populates="progress")


class PuzzleSession(Base):
    __tablename__ = "puzzle_sessions"

    id                 = Column(Integer, primary_key=True, index=True)
    user_id            = Column(Integer, ForeignKey("users.id"))
    module_name        = Column(String)
    puzzle_type        = Column(String)
    difficulty_tier    = Column(Integer)
    is_correct         = Column(Boolean)
    time_taken_seconds = Column(Integer)
    hints_used         = Column(Integer, default=0)
    created_at         = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="sessions")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables():
    Base.metadata.create_all(bind=engine)
