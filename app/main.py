from core.database import Base
from fastapi import FastAPI
from routers import auth
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI(
    title="Pathwise Admin Setup",
    description="This is the docs for the Pathwise Admin Setup API.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins="http://localhost:5173",
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)






@app.get("/")
def read_root():
    return {"message": "Welcome to the Pathwise Admin API"}

app.include_router(auth.authRouter, prefix="/auth", tags=["auth"])