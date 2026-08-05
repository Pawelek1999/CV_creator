from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.middleware.error_handler import register_error_handlers
from app.routers import cv_router

app = FastAPI(title="CV Generator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

register_error_handlers(app)

app.include_router(cv_router.router)


@app.get("/health")
def health_check():
    return {"status": "ok"}
