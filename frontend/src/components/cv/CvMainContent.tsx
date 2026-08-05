import type { CvData } from "../../types/cv.types";
import { formatDate, formatDateRange } from "../../utils/formatDate";

interface CvMainContentProps {
  data: CvData;
}

function MainSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section data-section-name={title}>
      <h2 className="mx-[-2em] px-[2em] py-[0.4em] mb-[1em] bg-blue-950 text-white">
        <span className="text-[1em] font-semibold uppercase tracking-widest">{title}</span>
      </h2>
      {children}
    </section>
  );
}

export function CvMainContent({ data }: CvMainContentProps) {
  const { personalInfo, summary, experience, education, certifications } = data;

  return (
    <div className="flex-1 bg-white text-gray-800 px-[2em] py-[2em] flex flex-col gap-[1.5em]">
      <header>
        <h1 className="text-[1.875em] font-bold text-blue-950 leading-tight">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <p className="text-[1.125em] text-blue-700">{personalInfo.title}</p>
      </header>

      {summary && (
        <MainSection title="About Me">
          <p className="text-[0.875em] leading-relaxed text-justify [hyphens:auto]">{summary}</p>
        </MainSection>
      )}

      {experience.length > 0 && (
        <MainSection title="Experience">
          <div className="space-y-[1em]">
            {experience.map((entry) => (
              <div key={`${entry.company}-${entry.role}-${entry.startDate}`}>
                <div className="flex justify-between items-baseline gap-[1em]">
                  <h3 className="font-semibold text-[1.05em]">{entry.role}</h3>
                  <span className="text-[0.75em] text-gray-500 whitespace-nowrap">
                    {formatDateRange(entry.startDate, entry.endDate)}
                  </span>
                </div>
                <p className="text-[0.875em] text-blue-700">
                  {entry.company} · {entry.location}
                </p>
                {entry.bullets.length > 0 && (
                  <ul className="list-disc list-outside ml-[1em] mt-[0.375em] space-y-[0.25em] text-[0.875em] text-gray-700 text-justify [hyphens:auto]">
                    {entry.bullets.map((bullet, i) => (
                      <li key={i}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </MainSection>
      )}

      {education.length > 0 && (
        <MainSection title="Education">
          <div className="space-y-[0.75em]">
            {education.map((entry) => (
              <div key={`${entry.school}-${entry.degree}`}>
                <div className="flex justify-between items-baseline gap-[1em]">
                  <h3 className="font-semibold text-[1.05em]">{entry.degree}</h3>
                  <span className="text-[0.75em] text-gray-500 whitespace-nowrap">
                    {formatDateRange(entry.startDate, entry.endDate)}
                  </span>
                </div>
                <p className="text-[0.875em] text-blue-700">{entry.school}</p>
              </div>
            ))}
          </div>
        </MainSection>
      )}

      {certifications.length > 0 && (
        <MainSection title="Courses & Certifications">
          <div className="space-y-[0.5em]">
            {certifications.map((cert) => (
              <div key={cert.name} className="flex justify-between items-baseline gap-[1em]">
                <h3 className="font-semibold text-[1.05em]">{cert.name}</h3>
                <span className="text-[0.75em] text-gray-500 whitespace-nowrap">
                  {formatDate(cert.date)}
                </span>
              </div>
            ))}
          </div>
        </MainSection>
      )}
    </div>
  );
}
