import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.database import Base
from app.schemas.cv_schema import CvCreate, CvData, PersonalInfo


@pytest.fixture
def db() -> Session:
    engine = create_engine(
        "sqlite:///:memory:", connect_args={"check_same_thread": False}
    )
    Base.metadata.create_all(engine)
    session = sessionmaker(bind=engine)()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture
def sample_cv_create() -> CvCreate:
    return CvCreate(
        label="Wersja testowa",
        data=CvData(
            personalInfo=PersonalInfo(
                firstName="Jan",
                lastName="Kowalski",
                title="Inżynier",
                email="jan@example.com",
                phone="123456789",
            ),
            summary="Testowe podsumowanie.",
        ),
    )
