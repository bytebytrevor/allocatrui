import { useEffect, useRef, useState } from "react";
import { DownloadIcon, RefreshCwIcon } from "lucide-react";
import { toast } from "sonner";
import type { ProjectFile } from "@/Types/projectFile";
import { downloadProjectFile, fileError, formatFileSize, getProjectFileBlob } from "@/api/projectFiles";
import { BusyIcon, quietAction, secondaryAction } from "./workspace-ui";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import FileTypeIcon from "./FileTypeIcon";
type PreviewKind = "image" | "video" | "pdf" | "text" | "unsupported";
export function getPreviewKind(file: Pick<ProjectFile, "contentType" | "originalFileName">): PreviewKind {
    const mime = file.contentType.split(";")[0].trim().toLowerCase();
    const extension = file.originalFileName.split(".").pop()?.toLowerCase();
    if ((mime === "image/jpeg" && (extension === "jpg" || extension === "jpeg")) ||
        (mime === "image/png" && extension === "png") || (mime === "image/webp" && extension === "webp"))
        return "image";
    if ((mime === "video/mp4" && extension === "mp4") || (mime === "video/webm" && extension === "webm"))
        return "video";
    if (mime === "application/pdf" && extension === "pdf")
        return "pdf";
    if ((extension === "txt" || extension === "csv") && ["text/plain", "text/csv", "application/csv", "application/vnd.ms-excel"].includes(mime))
        return "text";
    return "unsupported";
}
const TEXT_LIMIT = 128 * 1024;
type PreviewData = {
    url: string;
    text: string;
    truncated: boolean;
};
export default function FilePreview(props: {
    file: ProjectFile;
    onClose: () => void;
}) {
    return <PreviewBody key={`${props.file.projectId}/${props.file.id}`} {...props}/>;
}
function PreviewBody({ file }: {
    file: ProjectFile;
    onClose: () => void;
}) {
    const kind = getPreviewKind(file);
    const [data, setData] = useState<PreviewData | null>(null);
    const [loading, setLoading] = useState(kind !== "unsupported");
    const [error, setError] = useState<string | null>(null);
    const [retry, setRetry] = useState(0);
    const [downloading, setDownloading] = useState(false);
    const downloadRef = useRef<AbortController | null>(null);
    const fileId = file.id;
    const projectId = file.projectId;
    const contentType = file.contentType;
    const filename = file.originalFileName;
    useEffect(() => () => downloadRef.current?.abort(), []);
    useEffect(() => {
        const controller = new AbortController();
        let objectUrl: string | undefined;
        setData(null);
        setError(null);
        setLoading(kind !== "unsupported");
        if (kind === "unsupported")
            return () => controller.abort();
        void getProjectFileBlob({ id: fileId, projectId }, controller.signal).then(async (blob) => {
            if (controller.signal.aborted)
                return;
            if (kind === "text") {
                const text = await blob.slice(0, TEXT_LIMIT).text();
                if (!controller.signal.aborted)
                    setData({ url: "", text, truncated: blob.size > TEXT_LIMIT });
            }
            else {
                // Force an allowlisted media MIME. Never embed HTML, SVG, ZIP or Office files.
                const mime = kind === "pdf" ? "application/pdf" : contentType.split(";")[0].trim().toLowerCase();
                objectUrl = URL.createObjectURL(new Blob([blob], { type: mime }));
                if (controller.signal.aborted) {
                    URL.revokeObjectURL(objectUrl);
                    objectUrl = undefined;
                    return;
                }
                setData({ url: objectUrl, text: "", truncated: false });
            }
        }).catch(cause => {
            if (!controller.signal.aborted)
                setError(fileError(cause, "This preview could not be loaded. Please try again."));
        }).finally(() => {
            if (!controller.signal.aborted)
                setLoading(false);
        });
        return () => {
            controller.abort();
            if (objectUrl)
                URL.revokeObjectURL(objectUrl);
        };
    }, [fileId, projectId, filename, contentType, kind, retry]);
    async function download() {
        if (downloadRef.current)
            return;
        const controller = new AbortController();
        downloadRef.current = controller;
        setDownloading(true);
        try {
            await downloadProjectFile(file, controller.signal);
        }
        catch (cause) {
            if (!controller.signal.aborted)
                toast.error(fileError(cause, "This file could not be downloaded."));
        }
        finally {
            if (!controller.signal.aborted) {
                downloadRef.current = null;
                setDownloading(false);
            }
        }
    }
    return <section aria-label={`Preview of ${filename}`} className="overflow-hidden rounded-xl border border-border bg-card text-card-foreground">
      <header className="flex items-start justify-between gap-3 border-b border-border/70 bg-surface-2/40 p-4">
        <div className="min-w-0"><h2 className="flex items-start gap-2 text-sm font-medium"><FileTypeIcon file={file} size={17} aria-hidden="true" className="mt-0.5 shrink-0 text-brand-secondary-highlight dark:text-secondary"/><span className="min-w-0 break-all">{filename}</span></h2><p className="mt-1 text-xs text-muted-foreground">{formatFileSize(file.sizeBytes)} · {file.uploadedByName || "Project member"}</p></div>
        <div className="flex shrink-0 gap-1">
          <button type="button" aria-label="Download file" title="Download file" disabled={downloading} onClick={() => void download()} className={`${quietAction} h-9 w-9 px-0`}>{downloading ? <BusyIcon /> : <DownloadIcon size={15} aria-hidden="true"/>}</button>

        </div>
      </header>
      <div className="min-h-[320px] bg-surface-2/25">
        {loading && <p role="status" className="flex min-h-[320px] items-center justify-center gap-2 text-xs text-muted-foreground"><BusyIcon />Loading preview…</p>}
        {error && <div role="alert" className="p-6"><p className="text-sm text-muted-foreground">{error}</p><button type="button" onClick={() => setRetry(value => value + 1)} className={`${secondaryAction} mt-4`}><RefreshCwIcon size={14} aria-hidden="true"/>Try again</button></div>}
        {!loading && !error && kind === "unsupported" && <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center"><FileTypeIcon file={file} size={30} aria-hidden="true" className="text-muted-foreground"/><p className="mt-4 text-sm font-medium">Download to open this file</p><p className="mt-2 max-w-sm text-xs leading-6 text-muted-foreground">Office documents and archives can be opened in their desktop apps.</p><button type="button" disabled={downloading} onClick={() => void download()} className={`${secondaryAction} mt-4`}><DownloadIcon size={14} aria-hidden="true"/>Download file</button></div>}
        {!loading && !error && data && kind === "image" && <img src={data.url} alt={filename} onError={() => setError("This image could not be displayed. Try downloading the file instead.")} className="mx-auto max-h-[65dvh] max-w-full object-contain p-4"/>}
        {!loading && !error && data && kind === "video" && <video src={data.url} controls playsInline preload="metadata" onError={() => setError("This video could not be played in your browser. Download it to open in a video player.")} className="mx-auto max-h-[65dvh] w-full object-contain">Your browser cannot play this video. Use Download above.</video>}
        {!loading && !error && data && kind === "pdf" && <><p className="px-4 py-2 text-[11px] leading-5 text-muted-foreground">If your browser cannot display this PDF, use Download above.</p><object data={data.url} type="application/pdf" aria-label={`PDF preview of ${filename}`} className="h-[65dvh] w-full"><p className="p-6 text-sm text-muted-foreground">Your browser cannot preview this PDF. Use Download above to open it.</p></object></>}
        {!loading && !error && data && kind === "text" && <div className="max-h-[65dvh] overflow-auto p-4"><pre className="whitespace-pre-wrap break-words text-xs leading-6 text-foreground">{data.text}</pre>{data.truncated && <p className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">Showing the first 128 KB. Download to view the complete file.</p>}</div>}
      </div>
    </section>;
}
export function FilePreviewDialog({ file, onClose }: {
    file: ProjectFile;
    onClose: () => void;
}) {
    return <Dialog open onOpenChange={open => {
            if (!open)
                onClose();
        }}>
      <DialogContent className="max-h-[92dvh] w-[calc(100vw-24px)] overflow-y-auto rounded-xl border-border bg-card p-4 text-card-foreground shadow-none sm:max-w-5xl">
        <DialogHeader className="sr-only"><DialogTitle>File preview</DialogTitle><DialogDescription>{file.originalFileName}</DialogDescription></DialogHeader>
        <div className="pt-6"><FilePreview file={file} onClose={onClose}/></div>
      </DialogContent>
    </Dialog>;
}
