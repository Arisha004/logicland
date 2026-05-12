from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from database import get_db, User, ModuleProgress, Badge
from services import get_current_user
import random

router = APIRouter()

# ── Pydantic Schemas ───────────────────────────────────────────────────────────
class ModuleCard(BaseModel):
    name:              str
    icon:              str
    difficulty_tier:   int
    accuracy_rate:     float
    puzzles_completed: int
    total_puzzles:     int
    is_mastered:       bool
    color:             str

class BadgeItem(BaseModel):
    name:      str
    icon:      str
    earned_at: str

class ActivityItem(BaseModel):
    action:   str
    module:   str
    xp:       int
    time_ago: str
    icon:     str

class WeeklyXP(BaseModel):
    day: str
    xp:  int

class Stats(BaseModel):
    xp_points:        int
    streak_days:      int
    skill_level:      str
    accuracy_overall: float
    puzzles_today:    int
    modules_mastered: int
    total_modules:    int
    rank:             int

class DashboardResponse(BaseModel):
    user:            dict
    stats:           Stats
    modules:         List[ModuleCard]
    recent_activity: List[ActivityItem]
    badges:          List[BadgeItem]
    weekly_xp:       List[WeeklyXP]
    ai_tip:          str

# ── Static mock fallback data ──────────────────────────────────────────────────
MOCK_ACTIVITY = [
    ActivityItem(action="Puzzle solved",  module="Variables",   xp=50,  time_ago="2 min ago",   icon="✅"),
    ActivityItem(action="Level Up! ⬆️",   module="Loops",       xp=100, time_ago="18 min ago",  icon="⬆️"),
    ActivityItem(action="Badge earned",   module="Variables",   xp=200, time_ago="1 hr ago",    icon="🏅"),
    ActivityItem(action="Hint used",      module="Conditionals",xp=10,  time_ago="2 hrs ago",   icon="💡"),
    ActivityItem(action="Puzzle solved",  module="Functions",   xp=30,  time_ago="Yesterday",   icon="🎯"),
    ActivityItem(action="Streak bonus",   module="Daily",       xp=75,  time_ago="Yesterday",   icon="🔥"),
]

MOCK_WEEKLY_XP = [
    WeeklyXP(day="Mon", xp=120),
    WeeklyXP(day="Tue", xp=200),
    WeeklyXP(day="Wed", xp=80),
    WeeklyXP(day="Thu", xp=310),
    WeeklyXP(day="Fri", xp=150),
    WeeklyXP(day="Sat", xp=420),
    WeeklyXP(day="Sun", xp=90),
]

AI_TIPS = [
    "You're crushing it with Variables! 🎯 Try 3 Loops puzzles today to keep your streak alive.",
    "Your Conditionals accuracy dipped a bit — the 'If-Else Adventure' mini-module can help you bounce back! 💪",
    "You learn best in the evenings. Schedule 20-minute sessions after 6 PM for maximum XP gain! 🌙",
    "You've mastered Variables — unlock Functions next to level up your superpowers! ⚙️",
    "Almost at rank 40 on the leaderboard! One strong session could push you up. 🏆",
]

@router.get("/", response_model=DashboardResponse)
def get_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Pull real DB modules, fall back to empty
    db_modules = (
        db.query(ModuleProgress)
        .filter(ModuleProgress.user_id == current_user.id)
        .all()
    )
    db_badges = (
        db.query(Badge)
        .filter(Badge.user_id == current_user.id)
        .order_by(Badge.earned_at.desc())
        .all()
    )

    # Build module cards
    modules = [
        ModuleCard(
            name=m.module_name,
            icon=m.module_icon or "📦",
            difficulty_tier=m.difficulty_tier,
            accuracy_rate=round(m.accuracy_rate, 1),
            puzzles_completed=m.puzzles_completed,
            total_puzzles=m.total_puzzles,
            is_mastered=m.is_mastered,
            color=m.module_color or "#4a8c5c",
        )
        for m in db_modules
    ] if db_modules else []

    # Build badge items
    badges = [
        BadgeItem(
            name=b.name,
            icon=b.icon,
            earned_at=b.earned_at.strftime("%d %b %Y") if b.earned_at else "—",
        )
        for b in db_badges
    ] if db_badges else []

    mastered_count  = sum(1 for m in modules if m.is_mastered)
    avg_accuracy    = (
        round(sum(m.accuracy_rate for m in modules) / len(modules), 1)
        if modules else 72.3
    )

    stats = Stats(
        xp_points        = current_user.xp_points or 1340,
        streak_days      = current_user.streak_days or 7,
        skill_level      = current_user.skill_level or "Intermediate",
        accuracy_overall = avg_accuracy,
        puzzles_today    = 8,
        modules_mastered = mastered_count,
        total_modules    = 6,
        rank             = 42,
    )

    return DashboardResponse(
        user={
            "id":        current_user.id,
            "username":  current_user.username,
            "full_name": current_user.full_name or current_user.username,
            "avatar":    current_user.avatar or "🦊",
            "age":       current_user.age or 12,
        },
        stats           = stats,
        modules         = modules,
        recent_activity = MOCK_ACTIVITY,
        badges          = badges,
        weekly_xp       = MOCK_WEEKLY_XP,
        ai_tip          = random.choice(AI_TIPS),
    )
