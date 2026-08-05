from sqlalchemy.orm import Session

from app.core.exceptions import CvNotFoundError
from app.models.cv_model import Cv
from app.repositories import cv_repository
from app.schemas.cv_schema import CvCreate, CvUpdate


def list_cvs(db: Session) -> list[Cv]:
    return cv_repository.get_all(db)


def get_cv(db: Session, cv_id: int) -> Cv:
    cv = cv_repository.get_by_id(db, cv_id)
    if cv is None:
        raise CvNotFoundError(cv_id)
    return cv


def create_cv(db: Session, cv_in: CvCreate) -> Cv:
    return cv_repository.create(db, cv_in)


def update_cv(db: Session, cv_id: int, cv_in: CvUpdate) -> Cv:
    cv = get_cv(db, cv_id)
    return cv_repository.update(db, cv, cv_in)


def delete_cv(db: Session, cv_id: int) -> None:
    cv = get_cv(db, cv_id)
    cv_repository.delete(db, cv)
