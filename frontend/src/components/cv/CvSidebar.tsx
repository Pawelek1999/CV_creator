import type { CvData } from "../../types/cv.types";
import photoPlaceholder from "../../assets/photo-placeholder.svg";

interface CvSidebarProps {
  data: CvData;
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

export function CvSidebar({ data }: CvSidebarProps) {
  const { personalInfo, skills, languages, interests } = data;

  return (
    <aside className="w-[34%] shrink-0 bg-blue-950 text-blue-50 px-[1.5em] py-[2em] flex flex-col gap-[1.75em]">
      <img
        src={personalInfo.photoUrl || photoPlaceholder}
        alt={`${personalInfo.firstName} ${personalInfo.lastName}`}
        className="w-[14.5em] h-[14.5em] rounded-full object-cover mx-auto ring-4 ring-blue-800"
      />

      <SidebarSection title="Contact">
        <ul className="space-y-[0.375em] text-[0.875em] break-words">
          <li>{personalInfo.email}</li>
          <li>{personalInfo.phone}</li>
          {personalInfo.website && (
            <li className="break-all">{personalInfo.website}</li>
          )}
        </ul>
      </SidebarSection>

      {skills.length > 0 && (
        <SidebarSection title="Skills">
          <ul className="space-y-[0.375em] text-[0.875em]">
            {skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </SidebarSection>
      )}

      {languages.length > 0 && (
        <SidebarSection title="Languages">
          <ul className="space-y-[0.375em] text-[0.875em]">
            {languages.map((lang) => (
              <li key={lang}>{lang}</li>
            ))}
          </ul>
        </SidebarSection>
      )}

      {interests.length > 0 && (
        <SidebarSection title="Interests">
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
