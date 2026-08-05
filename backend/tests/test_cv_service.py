import pytest

from app.core.exceptions import CvNotFoundError
from app.services import cv_service


def test_get_cv_raises_when_missing(db):
    with pytest.raises(CvNotFoundError):
        cv_service.get_cv(db, 999)


def test_create_then_get_cv(db, sample_cv_create):
    created = cv_service.create_cv(db, sample_cv_create)

    fetched = cv_service.get_cv(db, created.id)

    assert fetched.id == created.id
    assert fetched.label == "Wersja testowa"


def test_delete_cv_raises_when_missing(db):
    with pytest.raises(CvNotFoundError):
        cv_service.delete_cv(db, 999)


def test_delete_cv_removes_it(db, sample_cv_create):
    created = cv_service.create_cv(db, sample_cv_create)

    cv_service.delete_cv(db, created.id)

    with pytest.raises(CvNotFoundError):
        cv_service.get_cv(db, created.id)
