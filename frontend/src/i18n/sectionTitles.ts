export type TitleLang = "en" | "pl";

export const sectionTitles = {
  aboutMe: { en: "About Me", pl: "O mnie" },
  experience: { en: "Experience", pl: "Doświadczenie" },
  education: { en: "Education", pl: "Wykształcenie" },
  certifications: { en: "Courses & Certifications", pl: "Kursy i certyfikaty" },
  contact: { en: "Contact", pl: "Kontakt" },
  skills: { en: "Skills", pl: "Umiejętności" },
  languages: { en: "Languages", pl: "Języki" },
  interests: { en: "Interests", pl: "Zainteresowania" },
} satisfies Record<string, Record<TitleLang, string>>;

export type SectionKey = keyof typeof sectionTitles;

// Section headings for the single-column ATS template (rendered uppercase).
export const atsSectionTitles = {
  summary: { en: "Professional Summary", pl: "Podsumowanie" },
  experience: { en: "Experience", pl: "Doświadczenie" },
  skills: { en: "Skills", pl: "Umiejętności" },
  education: { en: "Education", pl: "Edukacja" },
  certifications: { en: "Certifications", pl: "Certyfikaty" },
  languages: { en: "Languages", pl: "Języki" },
  interests: { en: "Interests", pl: "Zainteresowania" },
} satisfies Record<string, Record<TitleLang, string>>;
