import { useLayoutEffect, useRef, useState } from "react";

const MM_TO_PX = 96 / 25.4;
const A4_HEIGHT_PX = 297 * MM_TO_PX;
// Browsers round `min-height: 297mm` to whole device pixels, so scrollHeight
// can land a couple of px above the raw mm->px conversion even when content
// visually fits. Tolerate that rounding noise instead of flagging it.
const TOLERANCE_PX = 4;

const BASE_FONT_PX = 16;
const BASELINE_PT = 11;
const MIN_PT = 9;
const STEP_PT = 0.5;
const MIN_SCALE = MIN_PT / BASELINE_PT;
const STEP = STEP_PT / BASELINE_PT;

interface AutoFitResult {
  pageRef: React.RefObject<HTMLDivElement | null>;
  fontSizePx: number;
  overflowing: boolean;
  overflowPercent: number;
  longestSection: string | null;
}

export function useAutoFitPage(deps: unknown[]): AutoFitResult {
  const pageRef = useRef<HTMLDivElement>(null);
  const [fontSizePx, setFontSizePx] = useState(BASE_FONT_PX);
  const [overflowing, setOverflowing] = useState(false);
  const [overflowPercent, setOverflowPercent] = useState(0);
  const [longestSection, setLongestSection] = useState<string | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    const el = pageRef.current;
    if (!el) return;

    let scale = 1;
    el.style.fontSize = `${scale * BASE_FONT_PX}px`;
    let height = el.scrollHeight;

    while (height > A4_HEIGHT_PX + TOLERANCE_PX && scale > MIN_SCALE) {
      scale = Math.max(MIN_SCALE, scale - STEP);
      el.style.fontSize = `${scale * BASE_FONT_PX}px`;
      height = el.scrollHeight;
    }

    const stillOverflowing = height > A4_HEIGHT_PX + TOLERANCE_PX;
    let worstSection: string | null = null;

    if (stillOverflowing) {
      let maxHeight = 0;
      el.querySelectorAll<HTMLElement>("[data-section-name]").forEach((section) => {
        if (section.scrollHeight > maxHeight) {
          maxHeight = section.scrollHeight;
          worstSection = section.dataset.sectionName ?? null;
        }
      });
    }

    setFontSizePx(scale * BASE_FONT_PX);
    setOverflowing(stillOverflowing);
    setOverflowPercent(
      stillOverflowing ? Math.round(((height - A4_HEIGHT_PX) / A4_HEIGHT_PX) * 100) : 0,
    );
    setLongestSection(worstSection);
  }, deps);

  return { pageRef, fontSizePx, overflowing, overflowPercent, longestSection };
}

export { A4_HEIGHT_PX };
