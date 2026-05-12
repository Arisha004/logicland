from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional
from database import User
from services import get_current_user
import os, random

router = APIRouter()


class HintRequest(BaseModel):
    module:             str
    puzzle_description: str
    student_attempt:    Optional[str] = None
    skill_level:        str = "Beginner"


class HintResponse(BaseModel):
    hint:        str
    encouragement: str


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    reply: str


FALLBACK_HINTS = [
    "Try breaking the problem into smaller steps — what's the very first thing you need to do? 🤔",
    "Think about what you already know! What similar puzzle have you solved before? 💡",
    "Read the puzzle slowly one more time. Sometimes the clue is hiding in the description! 🔍",
    "Remember: every big problem is just a bunch of small problems stacked together. Start small! 🧩",
]

FALLBACK_ENCOURAGEMENTS = [
    "You're doing amazing — keep going! 🌟",
    "Every expert was once a beginner. You've got this! 💪",
    "Mistakes are just learning in disguise! 🎯",
    "Your brain is growing stronger with every puzzle! 🧠",
]


def call_claude(system_prompt: str, user_message: str) -> str:
    """Call Claude via LangChain. Falls back gracefully if API key not set."""
    api_key = os.getenv("ANTHROPIC_API_KEY", "")
    if not api_key:
        return random.choice(FALLBACK_HINTS)

    try:
        from langchain_anthropic import ChatAnthropic
        from langchain_core.messages import HumanMessage, SystemMessage

        llm = ChatAnthropic(
            model="claude-sonnet-4-20250514",
            anthropic_api_key=api_key,
            max_tokens=300,
            temperature=0.7,
        )
        response = llm.invoke([
            SystemMessage(content=system_prompt),
            HumanMessage(content=user_message),
        ])
        return response.content
    except Exception:
        return random.choice(FALLBACK_HINTS)


@router.post("/hint", response_model=HintResponse)
def get_hint(req: HintRequest, current_user: User = Depends(get_current_user)):
    system = (
        f"You are Logi, a friendly AI tutor for LogicLand — a coding game for kids aged 8–16. "
        f"The student is {req.skill_level} level, working on {req.module}. "
        "Give a SHORT helpful hint (2–3 sentences) WITHOUT giving away the answer. "
        "Be warm, fun, and age-appropriate. Use 1 emoji."
    )
    hint = call_claude(system, f"Puzzle: {req.puzzle_description}\nAttempt: {req.student_attempt or 'none yet'}\nGive a hint.")
    return HintResponse(hint=hint, encouragement=random.choice(FALLBACK_ENCOURAGEMENTS))


@router.post("/chat", response_model=ChatResponse)
def ai_chat(req: ChatRequest, current_user: User = Depends(get_current_user)):
    system = (
        "You are Logi, LogicLand's friendly AI tutor for kids aged 8–16. "
        "Answer coding questions simply and encouragingly. Max 4 sentences. End with an emoji."
    )
    reply = call_claude(system, req.message)
    return ChatResponse(reply=reply)
