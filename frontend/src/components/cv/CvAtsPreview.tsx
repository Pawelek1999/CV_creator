import { Fragment, useLayoutEffect, useRef, useState } from "react";
import type { CvData, ExperienceEntry } from "../../types/cv.types";
import { formatDate, formatDateRange } from "../../utils/formatDate";
import { atsSectionTitles, type TitleLang } from "../../i18n/sectionTitles";
import { A4_HEIGHT_PX } from "../../hooks/useAutoFitPage";

// Single-column, ATS-friendly layout: real text only, no tables, columns,
// icons or graphics. Dates are pushed right with flexbox.

const ACCENT = "#2B5BA8";
const PAGE_MARGIN_MM = 16;
const MM_TO_PX = 96 / 25.4;
// Bottom edge of the printable area on page 1 (A4 minus the bottom margin).
const PAGE_ONE_CONTENT_END_PX = (297 - PAGE_MARGIN_MM) * MM_TO_PX;

const TECH_STACK_PREFIX = /^\s*tech stack\s*:/i;

interface CvAtsPreviewProps {
  data: CvData;
  titleLang?: TitleLang;
}

function splitLabel(text: string): [string, string] | null {
  const i = text.indexOf(":");
  if (i <= 0) return null;
  return [text.slice(0, i + 1), text.slice(i + 1)];
}

function LabeledLine({ text, className }: { text: string; className?: string }) {
  const parts = splitLabel(text);
  return (
    <p className={className}>
      {parts ? (
        <>
          <strong className="font-bold">{parts[0]}</strong>
          {parts[1]}
        </>
      ) : (
        text
      )}
    </p>
  );
}

function AtsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section data-section-name={title} className="mt-[11pt]">
      <h2
        className="text-[9.5pt] font-bold uppercase tracking-[0.08em] leading-tight pb-[2pt] mb-[6pt] border-b border-[#C8D3E6] break-after-avoid"
        style={{ color: ACCENT }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function DatedHeading({ title, dates }: { title: string; dates: string }) {
  return (
    <div className="flex justify-between items-baseline gap-[12pt]">
      <h3 className="text-[10pt] font-bold text-black">{title}</h3>
      <span className="text-[8.5pt] text-[#666] whitespace-nowrap">{dates}</span>
    </div>
  );
}

function ExperienceItem({ entry, lang }: { entry: ExperienceEntry; lang: TitleLang }) {
  const bullets = entry.bullets.filter((b) => !TECH_STACK_PREFIX.test(b));
  const techStack = entry.bullets.filter((b) => TECH_STACK_PREFIX.test(b));
  const companyLine = [entry.company, entry.location].filter(Boolean).join(" · ");

  return (
    <div className="mb-[7pt] last:mb-0 break-inside-avoid">
      <DatedHeading
        title={entry.role}
        dates={formatDateRange(entry.startDate, entry.endDate, lang)}
      />
      {companyLine && <p className="text-[8.5pt] text-[#666]">{companyLine}</p>}
      {bullets.length > 0 && (
        <ul className="list-disc list-outside pl-[12pt] mt-[2pt] space-y-[1pt] text-[9pt] leading-[1.35]">
          {bullets.map((bullet, i) => (
            <li key={i}>{bullet}</li>
          ))}
        </ul>
      )}
      {techStack.map((line, i) => {
        const [label, rest] = splitLabel(line.trim())!;
        return (
          <p key={i} className="mt-[2pt] text-[9pt] leading-[1.35]">
            <strong className="font-bold">{label}</strong>
            {rest}
          </p>
        );
      })}
    </div>
  );
}

function SkillsList({ skills }: { skills: string[] }) {
  // Lines with a "Category:" prefix are standalone; consecutive plain skills
  // are grouped into one bulleted list.
  const groups: (string | string[])[] = [];
  for (const skill of skills) {
    if (splitLabel(skill)) groups.push(skill);
    else if (Array.isArray(groups.at(-1))) (groups.at(-1) as string[]).push(skill);
    else groups.push([skill]);
  }

  return (
    <div className="space-y-[1.5pt] text-[9pt] leading-[1.35]">
      {groups.map((group, i) =>
        Array.isArray(group) ? (
          <ul key={i} className="list-disc list-outside pl-[12pt] space-y-[1.5pt]">
            {group.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        ) : (
          <LabeledLine key={i} text={group} />
        ),
      )}
    </div>
  );
}

function displayUrl(url: string): string {
  return url.replace(/^https?:\/\//i, "").replace(/\/$/, "");
}

export function CvAtsPreview({ data, titleLang = "en" }: CvAtsPreviewProps) {
  const { personalInfo, summary, experience, education, certifications, skills, languages } =
    data;
  const interests = data.interests ?? [];
  const t = (key: keyof typeof atsSectionTitles) => atsSectionTitles[key][titleLang];

  const pageRef = useRef<HTMLDivElement>(null);
  const [overflowing, setOverflowing] = useState(false);

  useLayoutEffect(() => {
    const el = pageRef.current;
    // min-height is 297mm, so scrollHeight only grows past A4 (plus rounding
    // noise) once content spills onto page 2.
    if (el) setOverflowing(el.scrollHeight > A4_HEIGHT_PX + 4);
  }, [data, titleLang]);

  const contacts = [
    personalInfo.email && { text: personalInfo.email, href: `mailto:${personalInfo.email}` },
    personalInfo.phone && {
      text: personalInfo.phone,
      href: `tel:${personalInfo.phone.replace(/[^\d+]/g, "")}`,
    },
    personalInfo.website && { text: displayUrl(personalInfo.website), href: personalInfo.website },
  ].filter((c): c is { text: string; href: string } => Boolean(c));

  return (
    <div className="w-[210mm] mx-auto print:w-auto">
      <div
        ref={pageRef}
        // Margins are padding, not @page margins: the global @page margin stays 0
        // so the browser has no room for its date/URL header and footer, and
        // box-decoration-break repeats the padding on every printed page.
        style={{ fontFamily: "Inter, Arial, sans-serif" }}
        className="relative w-full min-h-[297mm] px-[16mm] py-[16mm] bg-white text-[#222] text-left shadow-lg print:min-h-0 print:shadow-none [box-decoration-break:clone] [-webkit-box-decoration-break:clone]"
      >
        <header>
          <h1 className="text-[23pt] font-bold text-black leading-tight">
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          {personalInfo.title && (
            <p className="text-[11pt] mt-[1pt]" style={{ color: ACCENT }}>
              {personalInfo.title}
            </p>
          )}
          {contacts.length > 0 && (
            <p className="text-[8.5pt] text-[#666] mt-[3pt]">
              {contacts.map((c, i) => (
                <Fragment key={c.href}>
                  {i > 0 && " · "}
                  <a href={c.href}>{c.text}</a>
                </Fragment>
              ))}
            </p>
          )}
        </header>

        {summary && (
          <AtsSection title={t("summary")}>
            <p className="text-[9.5pt] leading-[1.35]">{summary}</p>
          </AtsSection>
        )}

        {experience.length > 0 && (
          <AtsSection title={t("experience")}>
            {experience.map((entry) => (
              <ExperienceItem
                key={`${entry.company}-${entry.role}-${entry.startDate}`}
                entry={entry}
                lang={titleLang}
              />
            ))}
          </AtsSection>
        )}

        {skills.length > 0 && (
          <AtsSection title={t("skills")}>
            <SkillsList skills={skills} />
          </AtsSection>
        )}

        {education.length > 0 && (
          <AtsSection title={t("education")}>
            {education.map((entry) => (
              <div
                key={`${entry.school}-${entry.degree}`}
                className="mb-[5pt] last:mb-0 break-inside-avoid"
              >
                <DatedHeading
                  title={entry.degree}
                  dates={formatDateRange(entry.startDate, entry.endDate, titleLang)}
                />
                <p className="text-[8.5pt] text-[#666]">{entry.school}</p>
              </div>
            ))}
          </AtsSection>
        )}

        {certifications.length > 0 && (
          <AtsSection title={t("certifications")}>
            <div className="space-y-[1.5pt]">
              {certifications.map((cert) => (
                <div
                  key={cert.name}
                  className="flex justify-between items-baseline gap-[12pt] break-inside-avoid"
                >
                  <p className="text-[9pt]">{cert.name}</p>
                  <span className="text-[8.5pt] text-[#666] whitespace-nowrap">
                    {formatDate(cert.date, titleLang)}
                  </span>
                </div>
              ))}
            </div>
          </AtsSection>
        )}

        {languages.length > 0 && (
          <AtsSection title={t("languages")}>
            <div className="space-y-[1.5pt] text-[9pt] leading-[1.35]">
              {languages.map((lang) => (
                <LabeledLine key={lang} text={lang} />
              ))}
            </div>
          </AtsSection>
        )}

        {interests.length > 0 && (
          <AtsSection title={t("interests")}>
            <p className="text-[9pt] leading-[1.35]">{interests.join(", ")}</p>
          </AtsSection>
        )}

        {overflowing && (
          <div
            className="print:hidden absolute left-0 right-0 border-t-2 border-dashed border-red-500"
            style={{ top: `${PAGE_ONE_CONTENT_END_PX}px` }}
          >
            <span className="absolute right-0 -top-5 text-[11px] text-red-600 bg-white px-1">
              end of page 1
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
