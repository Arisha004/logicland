from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.models import create_tables
from routers import auth, dashboard, profile, ai_tutor

app = FastAPI(title="LogicLand API", version="1.0.0", description="AI-powered learning platform for kids")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create DB tables on startup
@app.on_event("startup")
def startup():
    create_tables()

app.include_router(auth.router,      prefix="/api/auth",      tags=["auth"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])
app.include_router(profile.router,   prefix="/api/profile",   tags=["profile"])
app.include_router(ai_tutor.router,  prefix="/api/ai",        tags=["ai"])

@app.get("/")
def root():
    return {"status": "ok", "message": "LogicLand API 🚀"}

@app.get("/health")
def health():
    return {"status": "healthy"}
