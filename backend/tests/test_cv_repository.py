from app.repositories import cv_repository
from app.schemas.cv_schema import CvUpdate


def test_create_and_get_by_id(db, sample_cv_create):
    created = cv_repository.create(db, sample_cv_create)

    fetched = cv_repository.get_by_id(db, created.id)

    assert fetched is not None
    assert fetched.label == "Wersja testowa"
    assert fetched.data["personalInfo"]["firstName"] == "Jan"


def test_get_by_id_missing_returns_none(db):
    assert cv_repository.get_by_id(db, 999) is None


def test_get_all_orders_by_updated_at_desc(db, sample_cv_create):
    first = cv_repository.create(db, sample_cv_create)
    second = cv_repository.create(db, sample_cv_create)

    result = cv_repository.get_all(db)

    assert [cv.id for cv in result] == [second.id, first.id]


def test_update_changes_label_and_data(db, sample_cv_create):
    created = cv_repository.create(db, sample_cv_create)

    updated = cv_repository.update(db, created, CvUpdate(label="Nowa etykieta"))

    assert updated.label == "Nowa etykieta"
    assert updated.data["personalInfo"]["firstName"] == "Jan"


def test_delete_removes_record(db, sample_cv_create):
    created = cv_repository.create(db, sample_cv_create)

    cv_repository.delete(db, created)

    assert cv_repository.get_by_id(db, created.id) is None
