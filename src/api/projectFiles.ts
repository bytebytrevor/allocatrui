import { isAxiosError } from "axios";
import api from "@/api/axios";
import type { ProjectFile, ProjectFilePage } from "@/Types/projectFile";
export type FileSort =
  | "newest"
  | "oldest"
  | "name-asc"
  | "name-desc"
  | "size-desc"
  | "size-asc"
  | "type-asc"
  | "type-desc";
export type FileKind = "all" | "images" | "video" | "documents";
export const MAX_FILE_BYTES = 25 * 1024 * 1024;
export const FILE_ACCEPT =
  ".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,.xls,.xlsx,.csv,.txt,.zip,.mp4,.webm";
const allowedExtensions = new Set(FILE_ACCEPT.split(","));
const path = (projectId: string) =>
  `/projects/${encodeURIComponent(projectId)}/files`;
export function validateSelectedFile(
  file: File,
  limit = MAX_FILE_BYTES,
): string | null {
  if (!file.size) return "Empty files cannot be attached.";
  if (file.size > limit) return "Each file must be 25 MB or smaller.";
  const extension = "." + file.name.split(".").pop()?.toLowerCase();
  if (!allowedExtensions.has(extension))
    return "This file type is not supported.";
  return null;
}
// Never display server exception details or developer exception pages.
export function fileError(error: unknown, fallback: string): string {
  if (!isAxiosError(error)) return fallback;
  const status = error.response?.status;
  if (!status || status >= 500) return fallback;
  if (status === 401)
    return "Your session has expired. Sign in again to continue.";
  if (status === 403)
    return "You no longer have permission to access these files.";
  if (status === 404)
    return "This file or project is no longer available. Refresh and try again.";
  if (status === 413) return "Each file must be 25 MB or smaller.";
  if (status === 415) return "This file type is not supported.";
  if (status === 429) return "Too many requests. Wait a moment and try again.";
  // Only known business validation messages are safe to display verbatim.
  if (status === 400 || status === 409 || status === 422) {
    const data: unknown = error.response?.data;
    if (data && typeof data === "object") {
      const payload = data as Record<string, unknown>;
      for (const key of ["detail", "message"] as const) {
        const value = payload[key];
        if (typeof value === "string" && safeFileMessages.has(value))
          return value;
      }
    }
  }
  return fallback;
}
const safeFileMessages = new Set([
  "Files cannot be added or deleted while completion is awaiting confirmation or the project is completed.",
  "Choose a non-empty file to upload.",
  "The uploaded file size is invalid.",
  "The filename must contain between 1 and 255 characters.",
  "Use PDF, JPEG, PNG, WebP, DOC, DOCX, XLS, XLSX, CSV, TXT or ZIP with a matching content type.",
  "Only a ready file can be deleted.",
  "Search cannot exceed 100 characters.",
  "Invalid file source filter.",
  "Invalid file sort option.",
  "Invalid file type filter.",
  "The selected task does not belong to this project.",
  "Each file must be 25 MB or smaller.",
  "This file type is not supported.",
  "Empty files cannot be attached.",
]);
export async function listProjectFiles(
  projectId: string,
  options: {
    taskId?: string;
    search?: string;
    source?: string;
    sort?: FileSort;
    kind?: FileKind;
    page?: number;
    signal?: AbortSignal;
  } = {},
): Promise<ProjectFilePage> {
  const { signal, ...params } = options;
  const response = await api.get<ProjectFilePage>(path(projectId), {
    withCredentials: true,
    signal,
    params: { ...params, pageSize: 50 },
  });
  if (!Array.isArray(response.data.items))
    throw new Error("Invalid file list response.");
  return response.data;
}
export async function uploadProjectFile(
  projectId: string,
  file: File,
  options: {
    taskId?: string;
    signal?: AbortSignal;
    onProgress?: (percent: number) => void;
  } = {},
): Promise<ProjectFile> {
  const form = new FormData();
  form.append("file", file);
  if (options.taskId) form.append("taskId", options.taskId);
  const response = await api.post<ProjectFile>(path(projectId), form, {
    withCredentials: true,
    signal: options.signal,
    onUploadProgress: (event) => {
      if (event.total)
        options.onProgress?.(
          Math.min(99, Math.round((event.loaded * 100) / event.total)),
        );
    },
  });
  return response.data;
}
export async function deleteProjectFile(
  projectId: string,
  fileId: string,
): Promise<void> {
  await api.delete(`${path(projectId)}/${encodeURIComponent(fileId)}`, {
    withCredentials: true,
  });
}
export function isCleanupPending(error: unknown): boolean {
  if (!isAxiosError(error) || error.response?.status !== 503) return false;
  const data: unknown = error.response.data;
  if (!data || typeof data !== "object") return false;
  const payload = data as Record<string, unknown>;
  // This detects the existing cleanup protocol; its raw text is never rendered.
  return [payload.detail, payload.message].some(
    (value) =>
      typeof value === "string" && value.includes("storage cleanup is pending"),
  );
}
export async function getProjectFileUrl(
  file: Pick<ProjectFile, "id" | "projectId">,
  signal?: AbortSignal,
): Promise<string> {
  const { data } = await api.get<{
    url: string;
    expiresAt: string;
  }>(`${path(file.projectId)}/${encodeURIComponent(file.id)}/download`, {
    withCredentials: true,
    signal,
  });
  const url = new URL(data.url);
  if (url.protocol !== "https:" && url.protocol !== "http:")
    throw new Error("Invalid download URL.");
  return url.href;
}
export async function getProjectFileBlob(
  file: Pick<ProjectFile, "id" | "projectId">,
  signal?: AbortSignal,
): Promise<Blob> {
  const url = await getProjectFileUrl(file, signal);
  // Fetch the signed bearer URL without application cookies. A blob link forces
  // a download instead of embedding untrusted document content in the page.
  const response = await fetch(url, { credentials: "omit", signal });
  if (!response.ok)
    throw new Error("The file download could not be retrieved.");
  const blob = await response.blob();
  if (blob.size > MAX_FILE_BYTES)
    throw new Error("File exceeds the supported size.");
  return blob;
}
export async function downloadProjectFile(
  file: ProjectFile,
  signal?: AbortSignal,
): Promise<void> {
  const blob = await getProjectFileBlob(file, signal);
  if (signal?.aborted) return;
  const blobUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = blobUrl;
  anchor.download = file.originalFileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
}
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
export async function getOptimizedThumbnail(
  file: Pick<ProjectFile, "id" | "projectId">,
  signal?: AbortSignal,
): Promise<Blob> {
  const response = await api.get<Blob>(
    `${path(file.projectId)}/${encodeURIComponent(file.id)}/thumbnail`,
    { withCredentials: true, signal, timeout: 65000, responseType: "blob" },
  );
  return response.data;
}
