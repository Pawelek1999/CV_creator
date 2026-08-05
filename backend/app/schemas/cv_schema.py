from datetime import datetime

from pydantic import BaseModel, ConfigDict


class PersonalInfo(BaseModel):
    firstName: str
    lastName: str
    title: str
    email: str
    phone: str
    photoUrl: str = ""
    website: str | None = None


class ExperienceEntry(BaseModel):
    role: str
    company: str
    location: str
    startDate: str
    endDate: str
    bullets: list[str] = []


class EducationEntry(BaseModel):
    degree: str
    school: str
    startDate: str
    endDate: str


class CertificationEntry(BaseModel):
    name: str
    date: str


class CvData(BaseModel):
    personalInfo: PersonalInfo
    summary: str
    experience: list[ExperienceEntry] = []
    education: list[EducationEntry] = []
    certifications: list[CertificationEntry] = []
    skills: list[str] = []
    languages: list[str] = []
    interests: list[str] = []


class CvCreate(BaseModel):
    label: str
    data: CvData


class CvUpdate(BaseModel):
    label: str | None = None
    data: CvData | None = None


class CvRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    label: str
    data: CvData
    created_at: datetime
    updated_at: datetime
