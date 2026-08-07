import type { CvData } from "../../types/cv.types";
import profilePhoto from "../../assets/profile-photo.jpg";
import { sectionTitles, type TitleLang } from "../../i18n/sectionTitles";


interface CvSidebarProps {
  data: CvData;
  titleLang: TitleLang;
}

function SidebarSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section data-section-name={title}>
      <h2 className="mx-[-1.5em] px-[1.5em] py-[0.4em] mb-[0.75em] bg-blue-900 text-white">
        <span className="text-[1em] font-semibold uppercase tracking-widest">{title}</span>
      </h2>
      {children}
    </section>
  );
}

export function CvSidebar({ data, titleLang }: CvSidebarProps) {
  const { personalInfo, skills, languages, interests } = data;

  return (
    <aside className="w-[34%] shrink-0 bg-blue-950 text-blue-50 px-[1.5em] py-[2em] flex flex-col gap-[1.75em]">
      <img
        src={personalInfo.photoUrl || profilePhoto}
        alt={`${personalInfo.firstName} ${personalInfo.lastName}`}
        className="w-[14.5em] h-[14.5em] rounded-full object-cover mx-auto ring-4 ring-blue-800"
      />

      <SidebarSection title={sectionTitles.contact[titleLang]}>
        <ul className="space-y-[0.375em] text-[0.875em] break-words">
          <li>{personalInfo.email}</li>
          <li>{personalInfo.phone}</li>
          {personalInfo.website && (
            <li className="break-all">{personalInfo.website}</li>
          )}
        </ul>
      </SidebarSection>

      {skills.length > 0 && (
        <SidebarSection title={sectionTitles.skills[titleLang]}>
          <ul className="space-y-[0.375em] text-[0.875em]">
            {skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </SidebarSection>
      )}

      {languages.length > 0 && (
        <SidebarSection title={sectionTitles.languages[titleLang]}>
          <ul className="space-y-[0.375em] text-[0.875em]">
            {languages.map((lang) => (
              <li key={lang}>{lang}</li>
            ))}
          </ul>
        </SidebarSection>
      )}

      {interests.length > 0 && (
        <SidebarSection title={sectionTitles.interests[titleLang]}>
          <ul className="space-y-[0.375em] text-[0.875em]">
            {interests.map((interest) => (
              <li key={interest}>{interest}</li>
            ))}
          </ul>
        </SidebarSection>
      )}
    </aside>
  );
}
