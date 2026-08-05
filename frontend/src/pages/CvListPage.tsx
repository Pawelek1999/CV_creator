import { Link } from "react-router-dom";
import { useState } from "react";
import { useCvList } from "../hooks/useCvList";
import { deleteCv } from "../api/cvApi";

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function CvListPage() {
  const { cvs, loading, error, refresh } = useCvList();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function handleDelete(id: number) {
    if (!confirm("Delete this CV version?")) return;
    setDeletingId(id);
    try {
      await deleteCv(id);
      refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete CV.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-950">Saved CVs</h1>
        <Link
          to="/cvs/new"
          className="bg-blue-950 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-900"
        >
          + New CV
        </Link>
      </div>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && (
        <p className="text-red-600 text-sm">
          Backend connection error: {error}
        </p>
      )}
      {!loading && !error && cvs.length === 0 && (
        <p className="text-gray-500">No saved CV versions yet.</p>
      )}

      <ul className="divide-y divide-gray-200 bg-white rounded-md shadow-sm">
        {cvs.map((cv) => (
          <li key={cv.id} className="flex items-center justify-between px-4 py-3">
            <Link to={`/cvs/${cv.id}`} className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{cv.label}</p>
              <p className="text-xs text-gray-500">
                Updated: {formatTimestamp(cv.updated_at)}
              </p>
            </Link>
            <button
              type="button"
              onClick={() => handleDelete(cv.id)}
              disabled={deletingId === cv.id}
              className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50 ml-4"
            >
              {deletingId === cv.id ? "Deleting..." : "Delete"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
