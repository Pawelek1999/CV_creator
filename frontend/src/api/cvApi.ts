import type { CvData, CvRecord } from "../types/cv.types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.detail ?? `Żądanie nie powiodło się (HTTP ${response.status})`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function listCvs(): Promise<CvRecord[]> {
  return request<CvRecord[]>("/cvs");
}

export function getCv(id: number): Promise<CvRecord> {
  return request<CvRecord>(`/cvs/${id}`);
}

export function createCv(label: string, data: CvData): Promise<CvRecord> {
  return request<CvRecord>("/cvs", {
    method: "POST",
    body: JSON.stringify({ label, data }),
  });
}

export function updateCv(
  id: number,
  updates: { label?: string; data?: CvData },
): Promise<CvRecord> {
  return request<CvRecord>(`/cvs/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

export function deleteCv(id: number): Promise<void> {
  return request<void>(`/cvs/${id}`, { method: "DELETE" });
}
