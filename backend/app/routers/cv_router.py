from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.cv_schema import CvCreate, CvRead, CvUpdate
from app.services import cv_service

router = APIRouter(prefix="/cvs", tags=["cvs"])


@router.get("", response_model=list[CvRead])
def list_cvs(db: Session = Depends(get_db)):
    return cv_service.list_cvs(db)


@router.get("/{cv_id}", response_model=CvRead)
def get_cv(cv_id: int, db: Session = Depends(get_db)):
    return cv_service.get_cv(db, cv_id)


@router.post("", response_model=CvRead, status_code=status.HTTP_201_CREATED)
def create_cv(cv_in: CvCreate, db: Session = Depends(get_db)):
    return cv_service.create_cv(db, cv_in)


@router.put("/{cv_id}", response_model=CvRead)
def update_cv(cv_id: int, cv_in: CvUpdate, db: Session = Depends(get_db)):
    return cv_service.update_cv(db, cv_id, cv_in)


@router.delete("/{cv_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_cv(cv_id: int, db: Session = Depends(get_db)):
    cv_service.delete_cv(db, cv_id)
