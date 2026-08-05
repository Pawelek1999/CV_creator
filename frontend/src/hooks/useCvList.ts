import { useCallback, useEffect, useState } from "react";
import { listCvs } from "../api/cvApi";
import type { CvRecord } from "../types/cv.types";

interface UseCvListResult {
  cvs: CvRecord[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useCvList(): UseCvListResult {
  const [cvs, setCvs] = useState<CvRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    listCvs()
      .then((data) => {
        if (!cancelled) setCvs(data);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [reloadToken]);

  const refresh = useCallback(() => setReloadToken((token) => token + 1), []);

  return { cvs, loading, error, refresh };
}
