import type { TitleLang } from "../i18n/sectionTitles";

const LOCALES: Record<TitleLang, string> = {
  en: "en-US",
  pl: "pl-PL",
};

const PRESENT_LABELS: Record<TitleLang, string> = {
  en: "Present",
  pl: "Obecnie",
};

export function formatDate(value: string, lang: TitleLang = "en"): string {
  if (value.trim().toLowerCase() === "present") return PRESENT_LABELS[lang];
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (!match) return value;
  const [, year, month] = match;
  const date = new Date(Number(year), Number(month) - 1, 1);
  const monthAbbr = new Intl.DateTimeFormat(LOCALES[lang], { month: "short" })
    .format(date)
    .replace(/\.$/, "");
  return `${monthAbbr.charAt(0).toUpperCase()}${monthAbbr.slice(1)} ${year}`;
}

export function formatDateRange(start: string, end: string, lang: TitleLang = "en"): string {
  return `${formatDate(start, lang)} – ${formatDate(end, lang)}`;
}
