import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { createCv, getCv, updateCv } from "../api/cvApi";
import { JsonEditor } from "../components/editor/JsonEditor";
import { CvPreview } from "../components/cv/CvPreview";
import type { CvData } from "../types/cv.types";
import masterCvData from "../data/cv-data.json";

function parseCvData(raw: string): { data: CvData | null; error: string | null } {
  try {
    const parsed = JSON.parse(raw);
    return { data: parsed as CvData, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : "Nieprawidłowy JSON" };
  }
}

export function CvEditorPage() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === "new" || id === undefined;
  const navigate = useNavigate();

  const [label, setLabel] = useState("");
  const [jsonText, setJsonText] = useState("");
  const [loading, setLoading] = useState(!isNew);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (isNew) {
      setLabel("Nowe CV");
      setJsonText(JSON.stringify(masterCvData, null, 2));
      return;
    }

    setLoading(true);
    getCv(Number(id))
      .then((cv) => {
        setLabel(cv.label);
        setJsonText(JSON.stringify(cv.data, null, 2));
      })
      .catch((err: Error) => setLoadError(err.message))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const { data: parsedData, error: parseError } = parseCvData(jsonText);

  useEffect(() => {
    if (!parsedData) return;
    const { firstName, lastName } = parsedData.personalInfo;
    const fullName = [firstName, lastName].filter(Boolean).join(" ");
    document.title = [fullName, "CV", label].filter(Boolean).join(" - ");
    return () => {
      document.title = "Generator CV";
    };
  }, [parsedData, label]);

  async function handleSave() {
    if (!parsedData) return;
    setSaving(true);
    setSaveError(null);
    try {
      if (isNew) {
        const created = await createCv(label, parsedData);
        navigate(`/cvs/${created.id}`);
      } else {
        await updateCv(Number(id), { label, data: parsedData });
      }
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Nie udało się zapisać CV.");
    } finally {
      setSaving(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  if (loading) return <p className="text-center py-10 text-gray-500">Ładowanie...</p>;
  if (loadError)
    return <p className="text-center py-10 text-red-600">Błąd: {loadError}</p>;

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 print:p-0 print:max-w-none">
      <div className="flex items-center justify-between mb-4 print:hidden">
        <Link to="/" className="text-sm text-blue-700 hover:underline">
          ← Wróć do listy
        </Link>
        <div className="flex items-center gap-3">
          {saveError && <p className="text-sm text-red-600">{saveError}</p>}
          <button
            type="button"
            onClick={handlePrint}
            disabled={!parsedData}
            className="border border-blue-950 text-blue-950 text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-50 disabled:opacity-50"
          >
            Pobierz PDF
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !parsedData}
            className="bg-blue-950 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-900 disabled:opacity-50"
          >
            {saving ? "Zapisywanie..." : "Zapisz"}
          </button>
        </div>
      </div>

      <input
        type="text"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="Nazwa wersji (np. 'Pod ogłoszenie X')"
        className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 print:hidden"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:block">
        <div className="print:hidden">
          <JsonEditor value={jsonText} onChange={setJsonText} error={parseError} />
        </div>
        <div className="overflow-auto max-h-[80vh] bg-gray-200 rounded-md p-4 print:overflow-visible print:max-h-none print:bg-transparent print:p-0">
          {parsedData ? (
            <div className="relative w-109.25 h-154.5 mx-auto print:w-auto print:h-auto print:mx-0">
              <div className="absolute top-0 left-0 origin-top-left scale-[0.55] print:static print:scale-100 print:transform-none">
                <CvPreview data={parsedData} />
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              Podgląd pojawi się, gdy JSON będzie poprawny.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
