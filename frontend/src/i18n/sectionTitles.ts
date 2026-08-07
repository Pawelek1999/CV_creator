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
