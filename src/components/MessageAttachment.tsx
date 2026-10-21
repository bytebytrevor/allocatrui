import { isAxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import { DownloadIcon, RefreshCwIcon } from "lucide-react";
import { attachmentBlob, messagingError } from "@/api/projectMessaging";
import { formatFileSize } from "@/api/projectFiles";
import type { ConversationFile } from "@/Types/conversation";
import FileTypeIcon from "./FileTypeIcon";
import { getPreviewKind } from "./FilePreview";
import { BusyIcon, quietAction, secondaryAction } from "./workspace-ui";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
export default function MessageAttachment({
  file,
  projectId,
  conversationId,
  onAccessDenied,
}: {
  file: ConversationFile;
  projectId: string;
  conversationId: string;
  onAccessDenied?: (all: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const lock = useRef(false);
  const request = useRef<AbortController | null>(null);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      request.current?.abort();
    };
  }, []);
  async function download() {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setError("");
    const controller = new AbortController();
    request.current = controller;
    try {
      const blob = await attachmentBlob(
        projectId,
        conversationId,
        file.id,
        controller.signal,
      );
      if (!mounted.current) return;
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = file.originalFileName;
      anchor.rel = "noopener";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (cause) {
      if (
        mounted.current &&
        !controller.signal.aborted &&
        isAxiosError(cause) &&
        [401, 403, 404].includes(cause.response?.status ?? 0)
      )
        onAccessDenied?.(cause.response?.status === 401);
      if (mounted.current && !controller.signal.aborted)
        setError(
          messagingError(
            cause,
            "The attachment could not be downloaded. Please try again.",
          ),
        );
    } finally {
      lock.current = false;
      if (mounted.current) setBusy(false);
    }
  }
  return (
    <div className="w-[240px] min-w-0 max-w-full">
      <div className="flex min-w-0 items-center gap-1 rounded-lg border border-border/65 bg-surface-2/35 p-1 transition-colors hover:border-border hover:bg-surface-2/60">
        <button
          type="button"
          aria-label={`Preview ${file.originalFileName}`}
          title={file.originalFileName}
          onClick={() => setOpen(true)}
          className="flex min-h-11 min-w-0 flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35"
        >
          <FileTypeIcon
            file={file}
            size={17}
            className="shrink-0 text-brand-secondary-highlight dark:text-secondary"
          />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[11px] font-medium leading-5">
              {file.originalFileName}
            </span>
            <span className="block text-[10px] leading-4 text-muted-foreground">
              {formatFileSize(file.sizeBytes)}
            </span>
          </span>
        </button>
        <button
          type="button"
          aria-label={`Download ${file.originalFileName}`}
          title="Download attachment"
          disabled={busy}
          onClick={() => void download()}
          className={`${quietAction} mr-0.5 h-8 min-h-8 w-8 shrink-0 px-0`}
        >
          {busy ? <BusyIcon /> : <DownloadIcon size={13} aria-hidden="true" />}
        </button>
      </div>
      {error && (
        <p role="alert" className="mt-2 text-xs text-status-overdue-foreground">
          {error}
        </p>
      )}
      {open && (
        <AttachmentPreview
          file={file}
          projectId={projectId}
          conversationId={conversationId}
          onAccessDenied={onAccessDenied}
          onClose={() => setOpen(false)}
          onDownload={() => void download()}
          downloadBusy={busy}
        />
      )}
    </div>
  );
}
function AttachmentPreview({
  file,
  projectId,
  conversationId,
  onClose,
  onDownload,
  downloadBusy,
  onAccessDenied,
}: {
  file: ConversationFile;
  projectId: string;
  conversationId: string;
  onClose: () => void;
  onDownload: () => void;
  downloadBusy: boolean;
  onAccessDenied?: (all: boolean) => void;
}) {
  const kind = getPreviewKind(file);
  const [data, setData] = useState<{
    url: string;
    text: string;
    truncated: boolean;
  } | null>(null);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    let objectUrl = "";
    setData(null);
    setError("");
    if (kind === "unsupported") return () => controller.abort();
    void attachmentBlob(projectId, conversationId, file.id, controller.signal)
      .then(async (blob) => {
        if (controller.signal.aborted) return;
        if (kind === "text") {
          const text = await blob.slice(0, 128 * 1024).text();
          if (!controller.signal.aborted)
            setData({ url: "", text, truncated: blob.size > 128 * 1024 });
        } else {
          objectUrl = URL.createObjectURL(
            new Blob([blob], { type: file.contentType }),
          );
          setData({ url: objectUrl, text: "", truncated: false });
        }
      })
      .catch((cause) => {
        if (
          !controller.signal.aborted &&
          isAxiosError(cause) &&
          [401, 403, 404].includes(cause.response?.status ?? 0)
        )
          onAccessDenied?.(cause.response?.status === 401);
        if (!controller.signal.aborted)
          setError(messagingError(cause, "The preview could not be loaded."));
      });
    return () => {
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [
    projectId,
    conversationId,
    file.id,
    file.contentType,
    kind,
    retry,
    onAccessDenied,
  ]);
  return (
    <Dialog
      open
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
    >
      <DialogContent className="flex max-h-[92dvh] w-[calc(100vw-24px)] flex-col overflow-hidden rounded-xl border-border bg-card p-0 text-card-foreground shadow-none sm:max-w-4xl">
        <DialogHeader className="shrink-0 border-b border-border/70 px-5 py-4 pr-12 text-left">
          <DialogTitle className="break-all text-base font-medium">
            {file.originalFileName}
          </DialogTitle>
          <DialogDescription className="text-xs">
            {formatFileSize(file.sizeBytes)} · Conversation attachment
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-0 overflow-y-auto p-4">
          {kind === "unsupported" ? (
            <p className="py-14 text-center text-sm text-muted-foreground">
              Download this file to open it in its application.
            </p>
          ) : error ? (
            <div role="alert" className="py-10 text-center">
              <p className="text-sm text-muted-foreground">{error}</p>
              <button
                type="button"
                onClick={() => setRetry((v) => v + 1)}
                className={`${quietAction} mt-3`}
              >
                <RefreshCwIcon size={14} />
                Try again
              </button>
            </div>
          ) : !data ? (
            <div
              role="status"
              className="flex min-h-48 items-center justify-center gap-2 text-xs text-muted-foreground"
            >
              <BusyIcon />
              Loading preview…
            </div>
          ) : (
            <>
              {kind === "image" && (
                <img
                  src={data.url}
                  alt={file.originalFileName}
                  className="mx-auto max-h-[65dvh] max-w-full rounded-lg object-contain"
                  onError={() =>
                    setError(
                      "This image could not be displayed. You can still download it.",
                    )
                  }
                />
              )}
              {kind === "video" && (
                <video
                  src={data.url}
                  controls
                  playsInline
                  preload="metadata"
                  className="mx-auto max-h-[65dvh] w-full rounded-lg"
                  onError={() =>
                    setError(
                      "This video could not be played. You can still download it.",
                    )
                  }
                />
              )}
              {kind === "pdf" && (
                <object
                  data={data.url}
                  type="application/pdf"
                  className="h-[60dvh] w-full rounded-lg"
                >
                  <p className="p-5 text-sm text-muted-foreground">
                    PDF preview is unavailable in this browser. Use Download to
                    open it.
                  </p>
                </object>
              )}
              {kind === "text" && (
                <>
                  <pre className="max-h-[60dvh] overflow-auto whitespace-pre-wrap break-words rounded-lg bg-surface-2 p-4 text-xs leading-6">
                    {data.text}
                  </pre>
                  {data.truncated && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Showing the first 128 KB. Download for the full file.
                    </p>
                  )}
                </>
              )}
            </>
          )}
        </div>
        <div className="shrink-0 border-t border-border/70 px-5 py-3">
          <button
            type="button"
            disabled={downloadBusy}
            onClick={onDownload}
            className={secondaryAction}
          >
            {downloadBusy ? <BusyIcon /> : <DownloadIcon size={14} />}Download
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
