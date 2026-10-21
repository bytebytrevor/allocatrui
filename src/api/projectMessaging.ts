import api from "@/api/axios";
import { isAxiosError } from "axios";
import { validateSelectedFile } from "@/api/projectFiles";
import type {
  ConversationDetail,
  ConversationList,
  ConversationMember,
  MessageDraft,
  SendResult,
  ForwardDraft,
} from "@/Types/conversation";
export const base = (projectId: string) =>
  `/projects/${encodeURIComponent(projectId)}/conversations`;
export const getMembers = async (id: string, signal?: AbortSignal) =>
  (
    await api.get<ConversationMember[]>(`${base(id)}/members`, {
      withCredentials: true,
      signal,
    })
  ).data;
export const getConversations = async (
  id: string,
  search: string,
  filter: string,
  page: number,
  signal?: AbortSignal,
) =>
  (
    await api.get<ConversationList>(base(id), {
      withCredentials: true,
      signal,
      params: { search, filter, page },
    })
  ).data;
export const getConversation = async (
  projectId: string,
  id: string,
  before?: number,
  signal?: AbortSignal,
) =>
  (
    await api.get<ConversationDetail>(
      `${base(projectId)}/${encodeURIComponent(id)}`,
      { withCredentials: true, signal, params: { before } },
    )
  ).data;
export const markRead = async (
  projectId: string,
  id: string,
  throughSequence: number,
) =>
  api.post(
    `${base(projectId)}/${encodeURIComponent(id)}/read`,
    { throughSequence },
    { withCredentials: true },
  );
export const archiveConversation = async (
  projectId: string,
  id: string,
  archived: boolean,
) =>
  api.patch(
    `${base(projectId)}/${encodeURIComponent(id)}/archive`,
    { archived },
    { withCredentials: true },
  );
export function validateMessageFiles(files: File[]): string | null {
  if (files.length > 8) return "Attach up to 8 files per message.";
  if (files.reduce((sum, file) => sum + file.size, 0) > 50 * 1024 * 1024)
    return "Attachments cannot exceed 50 MB combined.";
  for (const file of files) {
    const error = validateSelectedFile(file);
    if (error) return `${file.name}: ${error}`;
  }
  return null;
}
// Files stay local until this function is called by an explicit Send action.
export function messageForm(
  draft: MessageDraft,
  requestId: string,
  create: boolean,
): FormData {
  const form = new FormData();
  form.append("Body", draft.body.trim());
  form.append("ClientRequestId", requestId);
  if (create) {
    form.append("Subject", draft.subject?.trim() ?? "");
    form.append("IsProjectWide", String(draft.isProjectWide === true));
    for (const id of draft.recipientIds ?? []) form.append("RecipientIds", id);
    if (draft.taskId) form.append("TaskId", draft.taskId);
  }
  for (const file of draft.files) form.append("Files", file, file.name);
  return form;
}
export async function sendMessage(
  projectId: string,
  conversationId: string | null,
  draft: MessageDraft,
  requestId: string,
  signal: AbortSignal,
  progress: (percent: number) => void,
): Promise<SendResult> {
  const error = validateMessageFiles(draft.files);
  if (error) throw new Error(error);
  const response = await api.post<SendResult>(
    conversationId
      ? `${base(projectId)}/${encodeURIComponent(conversationId)}/messages`
      : base(projectId),
    messageForm(draft, requestId, !conversationId),
    {
      withCredentials: true,
      signal,
      timeout: 180000,
      onUploadProgress: (e) => {
        if (e.total)
          progress(Math.min(100, Math.round((e.loaded * 100) / e.total)));
      },
    },
  );
  return response.data;
}
// Never expose server exception text or stack traces in the interface.
export function messagingError(error: unknown, fallback: string): string {
  if (isAxiosError(error)) {
    switch (error.response?.status) {
      case 401:
        return "Your session has expired. Sign in again to continue.";
      case 403:
      case 404:
        return "This conversation or project is no longer available to your account.";
      case 409:
        return "The conversation changed while sending. Your draft is safe; press Send to retry.";
      case 413:
        return "Files are too large. Use up to 25 MB per file and 50 MB combined.";
      case 415:
        return "One of these file types is not supported.";
      case 429:
        return "Please wait a moment before trying again.";
    }
  }
  return fallback;
}
export async function attachmentBlob(
  projectId: string,
  conversationId: string,
  fileId: string,
  signal: AbortSignal,
): Promise<Blob> {
  return (
    await api.get<Blob>(
      `${base(projectId)}/${encodeURIComponent(conversationId)}/files/${encodeURIComponent(fileId)}/download`,
      {
        withCredentials: true,
        signal,
        responseType: "blob",
        timeout: 60000,
      },
    )
  ).data;
}
export async function pinConversation(
  projectId: string,
  conversationId: string,
  pinned: boolean,
): Promise<void> {
  await api.patch(
    `${base(projectId)}/${encodeURIComponent(conversationId)}/pin`,
    { pinned },
    { withCredentials: true },
  );
}
const messagePath = (
  projectId: string,
  conversationId: string,
  messageId: string,
) =>
  `${base(projectId)}/${encodeURIComponent(conversationId)}/messages/${encodeURIComponent(messageId)}`;
export async function editMessage(
  projectId: string,
  conversationId: string,
  messageId: string,
  body: string,
  version: number,
): Promise<void> {
  await api.patch(
    messagePath(projectId, conversationId, messageId),
    { body, version },
    { withCredentials: true },
  );
}
export async function deleteMessage(
  projectId: string,
  conversationId: string,
  messageId: string,
  version: number,
): Promise<void> {
  await api.post(
    `${messagePath(projectId, conversationId, messageId)}/delete`,
    { version },
    { withCredentials: true },
  );
}
export async function forwardMessage(
  projectId: string,
  conversationId: string,
  messageId: string,
  draft: ForwardDraft,
): Promise<SendResult> {
  return (
    await api.post<SendResult>(
      `${messagePath(projectId, conversationId, messageId)}/forward`,
      draft,
      { withCredentials: true },
    )
  ).data;
}
export function messageActionError(error: unknown, fallback: string): string {
  if (isAxiosError(error)) {
    if (error.response?.status === 409)
      return "This message changed or its action window expired. Close this dialog and refresh before trying again.";
    if (error.response?.status === 400)
      return "Check the subject, recipients and message length before trying again.";
  }
  return messagingError(error, fallback);
}
