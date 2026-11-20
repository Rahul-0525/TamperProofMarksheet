import os

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./verimark.db")

# Fix Heroku/Render postgres:// URI to postgresql://
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

CORS_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "*"
]
