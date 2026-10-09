export interface PersonalInfo {
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone: string;
  photoUrl: string;
  website?: string;
}

export interface ExperienceEntry {
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface EducationEntry {
  degree: string;
  school: string;
  startDate: string;
  endDate: string;
}

export interface CertificationEntry {
  name: string;
  date: string;
}

export interface CvData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  certifications: CertificationEntry[];
  skills: string[];
  languages: string[];
  interests: string[];
}

export interface CvRecord {
  id: number;
  label: string;
  data: CvData;
  created_at: string;
  updated_at: string;
}

export type CvTemplate = "classic" | "ats";
