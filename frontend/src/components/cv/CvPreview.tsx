import type { CvData } from "../../types/cv.types";
import { CvSidebar } from "./CvSidebar";
import { CvMainContent } from "./CvMainContent";
import { useAutoFitPage, A4_HEIGHT_PX } from "../../hooks/useAutoFitPage";

interface CvPreviewProps {
  data: CvData;
}

export function CvPreview({ data }: CvPreviewProps) {
  const { pageRef, fontSizePx, overflowing, overflowPercent, longestSection } =
    useAutoFitPage([data]);

  return (
    <div className="w-[210mm] mx-auto">
      {overflowing && (
        <div className="print:hidden mb-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          Content exceeds one page by about {overflowPercent}%
          {longestSection && (
            <>
              {" "}
              — consider shortening the <strong>"{longestSection}"</strong> section.
            </>
          )}
        </div>
      )}
      <div
        ref={pageRef}
        style={{
          fontSize: `${fontSizePx}px`,
          fontFamily: "Inter, Arial, sans-serif",
        }}
        className="relative w-full min-h-[297mm] flex shadow-lg print:shadow-none"
      >
        <CvSidebar data={data} />
        <CvMainContent data={data} />
        {overflowing && (
          <div
            className="print:hidden absolute left-0 right-0 border-t-2 border-dashed border-red-500"
            style={{ top: `${A4_HEIGHT_PX}px` }}
          >
            <span className="absolute right-0 -top-5 text-[11px] font-sans text-red-600 bg-white px-1">
              end of A4 page
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
