from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.cv_model import Cv
from app.schemas.cv_schema import CvCreate, CvUpdate


def get_all(db: Session) -> list[Cv]:
    return list(db.scalars(select(Cv).order_by(Cv.updated_at.desc())))


def get_by_id(db: Session, cv_id: int) -> Cv | None:
    return db.get(Cv, cv_id)


def create(db: Session, cv_in: CvCreate) -> Cv:
    cv = Cv(label=cv_in.label, data=cv_in.data.model_dump())
    db.add(cv)
    db.commit()
    db.refresh(cv)
    return cv


def update(db: Session, cv: Cv, cv_in: CvUpdate) -> Cv:
    if cv_in.label is not None:
        cv.label = cv_in.label
    if cv_in.data is not None:
        cv.data = cv_in.data.model_dump()
    db.commit()
    db.refresh(cv)
    return cv


def delete(db: Session, cv: Cv) -> None:
    db.delete(cv)
    db.commit()
