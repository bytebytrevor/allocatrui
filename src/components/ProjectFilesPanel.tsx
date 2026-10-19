import { projectFileListCache, type FileListSnapshot } from "@/api/projectFileListCache";
import { useAuth } from "@/auth/useAuth";
import { isAxiosError } from "axios";
import { thumbnailCache } from "@/api/thumbnailCache";
import { useEffect, useId, useRef, useState } from "react";
import { CheckIcon, ChevronDownIcon, DownloadIcon, EyeIcon, Grid2X2Icon, ListIcon, PaperclipIcon, RefreshCwIcon, SearchIcon, Trash2Icon, UploadIcon, BlocksIcon, FolderOpenIcon, ImageIcon, FilmIcon, FileTextIcon, SlidersHorizontalIcon, ArrowDownWideNarrowIcon, ListTodoIcon, type LucideIcon } from "lucide-react";
import { toast } from "sonner";
import type { ProjectFile } from "@/Types/projectFile";
import { deleteProjectFile, downloadProjectFile, FILE_ACCEPT, fileError, formatFileSize, isCleanupPending, uploadProjectFile, validateSelectedFile } from "@/api/projectFiles";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { BusyIcon, menuItem, menuSurface, primaryAction, quietAction, secondaryAction } from "./workspace-ui";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import type { FileSort, FileKind } from "@/api/projectFiles";
import { FilePreviewDialog } from "./FilePreview";
import MediaThumbnail from "./MediaThumbnail";
import { getFilePresentation } from "./FileTypeIcon";
import { Link } from "react-router-dom";
export function notifyProjectFilesChanged(projectId: string, fileId?: string) {
    projectFileListCache.invalidateProject(projectId);
    if (fileId)
        thumbnailCache.invalidate(projectId, fileId);
    window.dispatchEvent(new CustomEvent("allocatr:files-changed", { detail: { projectId, fileId } }));
}
async function retryCleanup(file: ProjectFile) {
    try {
        await deleteProjectFile(file.projectId, file.id);
        toast.success("File cleanup completed.");
    }
    catch (error) {
        toast.error(fileError(error, "Cleanup could not be completed. Please try again."));
    }
}
export function FileAttachment({ file, onRemoved, disabled = false, compact = false, onOpenTask, onPreview, viewMode = "list" }: {
    file: ProjectFile;
    onRemoved?: (id: string) => void;
    onPreview?: (file: ProjectFile) => void;
    disabled?: boolean;
    compact?: boolean;
    viewMode?: "grid" | "list";
    onOpenTask?: (taskId: string, commentId?: string | null) => void;
}) {
    const [busy, setBusy] = useState<"download" | "delete" | null>(null);
    const [confirm, setConfirm] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const lock = useRef(false);
    const mounted = useRef(false);
    const downloadController = useRef<AbortController | null>(null);
    useEffect(() => { mounted.current = true; return () => { mounted.current = false; downloadController.current?.abort(); }; }, []);
    async function download() {
        if (lock.current)
            return;
        lock.current = true;
        setBusy("download");
        const controller = new AbortController();
        downloadController.current = controller;
        try {
            await downloadProjectFile(file, controller.signal);
        }
        catch (error) {
            if (!controller.signal.aborted)
                toast.error(fileError(error, "This file could not be downloaded."));
        }
        finally {
            lock.current = false;
            if (mounted.current)
                setBusy(null);
        }
    }
    async function remove() {
        if (lock.current || !file.canDelete)
            return;
        lock.current = true;
        setBusy("delete");
        let removed = false;
        try {
            await deleteProjectFile(file.projectId, file.id);
            removed = true;
        }
        catch (error) {
            if (isCleanupPending(error)) {
                removed = true;
                toast.error("File removed from the workspace. Storage cleanup needs a retry.", {
                    action: { label: "Retry cleanup", onClick: () => void retryCleanup(file) },
                });
            }
            else
                toast.error(fileError(error, "This file could not be deleted."));
        }
        finally {
            lock.current = false;
            if (mounted.current) {
                setBusy(null);
                if (removed)
                    setConfirm(false);
            }
        }
        if (removed) {
            if (mounted.current)
                onRemoved?.(file.id);
            notifyProjectFilesChanged(file.projectId, file.id);
        }
    }
    function preview() {
        if (onPreview)
            onPreview(file);
        else
            setPreviewOpen(true);
    }
    const source = file.context === "comment" ? (file.commentId ? "Comment attachment" : "From a deleted comment")
        : file.context === "task" ? "Task attachment" : "Project file";
    return <>
    <article className={`flex min-w-0 gap-3 rounded-xl border border-border/70 bg-card p-3 ${viewMode === "grid" ? "h-full flex-col" : "items-start"}`}>
      {viewMode === "grid" ? <button type="button" disabled={disabled || !!busy} onClick={preview} aria-label={`Open preview of ${file.originalFileName}`} className="relative flex h-32 w-full shrink-0 flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border border-border/50 bg-surface-2/65 text-brand-secondary-highlight transition-colors hover:bg-surface-3/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 dark:text-secondary"><MediaThumbnail file={file}/><span className="absolute bottom-2 right-2 rounded-md border border-border/50 bg-card/95 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-foreground/75">{getFilePresentation(file).label}</span></button> : <span className="flex h-10 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface-3/70 text-brand-secondary-highlight dark:text-secondary"><MediaThumbnail file={file}/></span>}
      <div className="min-w-0 flex-1">
        <button type="button" disabled={disabled || !!busy} onClick={preview} title={`Preview ${file.originalFileName}`} className="max-w-full break-all text-left text-xs font-medium text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35">{file.originalFileName}</button>
        <p className="mt-1 text-[11px] leading-5 text-muted-foreground">{formatFileSize(file.sizeBytes)} · {file.uploadedByName || "Project member"} · {shortDate(file.createdAt)}</p>
        {!compact && <div className="mt-1 flex flex-wrap items-center gap-x-2 text-[10px] leading-5 text-muted-foreground"><span>{source}{file.taskTitle ? ` · ${file.taskTitle}${file.taskId ? "" : " (deleted task)"}` : ""}</span>{file.taskId && onOpenTask && <button type="button" onClick={() => onOpenTask(file.taskId!, file.commentId)} className="rounded text-brand-secondary-highlight underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 dark:text-secondary">{file.commentId ? "View comment" : "Open task"}</button>}</div>}
      </div>
      <div className={`flex shrink-0 items-center gap-0.5 ${viewMode === "grid" ? "mt-auto w-full justify-end border-t border-border/60 pt-2" : ""}`}>
        <button type="button" aria-label={`Preview ${file.originalFileName}`} title="Preview file" disabled={disabled || !!busy} onClick={preview} className={quietAction + " h-8 min-h-8 w-8 px-0"}><EyeIcon size={14} aria-hidden="true"/></button>
        <button type="button" aria-label={`Download ${file.originalFileName}`} title="Download" disabled={disabled || !!busy} onClick={() => void download()} className={quietAction + " h-8 min-h-8 w-8 px-0"}>{busy === "download" ? <BusyIcon /> : <DownloadIcon size={14} aria-hidden="true"/>}</button>
        {file.canDelete && <button type="button" aria-label={`Delete ${file.originalFileName}`} title="Delete file" disabled={disabled || !!busy} onClick={() => setConfirm(true)} className={quietAction + " h-8 min-h-8 w-8 px-0"}>{busy === "delete" ? <BusyIcon /> : <Trash2Icon size={13} aria-hidden="true"/>}</button>}
      </div>
    </article>
    {previewOpen && <FilePreviewDialog file={file} onClose={() => setPreviewOpen(false)}/>}
    <AlertDialog open={confirm} onOpenChange={(value) => {
            if (!lock.current)
                setConfirm(value);
        }}>
      <AlertDialogContent className="rounded-xl border-border bg-card text-card-foreground shadow-none sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-medium">Delete file?</AlertDialogTitle>
          <AlertDialogDescription className="text-sm leading-7 text-muted-foreground">
            This file will be removed from its comment, task and project file lists. This cannot be undone.
            <span className="mt-3 block break-all rounded-lg border border-border/70 bg-surface-2/50 px-3 py-2.5 text-xs font-medium text-foreground">{file.originalFileName}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={!!busy} className={secondaryAction}>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={!!busy} onClick={event => { event.preventDefault(); void remove(); }} style={{ backgroundColor: "var(--destructive)", color: "var(--destructive-foreground)" }} className="min-h-10 rounded-lg px-4 text-xs font-medium shadow-none transition-opacity hover:opacity-90">
            {busy ? <BusyIcon /> : <Trash2Icon size={13} aria-hidden="true" className="text-inherit"/>}{busy ? "Deleting…" : "Delete file"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </>;
}
export default function ProjectFilesPanel(props: {
    projectId: string;
    workspaceHeader?: {
        projectTitle: string;
        managerPath: string;
    };
    taskId?: string;
    tasks?: {
        id: string;
        title: string;
    }[];
    onRemoved?: (id: string) => void;
    onPreview?: (file: ProjectFile) => void;
    onBusyChange?: (busy: boolean) => void;
    onOpenTask?: (taskId: string, commentId?: string | null) => void;
}) {
    return <FileBrowser key={`${props.projectId}/${props.taskId || "project"}`} {...props}/>;
}
function FileBrowser({ projectId, workspaceHeader, taskId, tasks = [], onRemoved, onOpenTask, onBusyChange, onPreview }: {
    projectId: string;
    workspaceHeader?: {
        projectTitle: string;
        managerPath: string;
    };
    taskId?: string;
    tasks?: {
        id: string;
        title: string;
    }[];
    onRemoved?: (id: string) => void;
    onPreview?: (file: ProjectFile) => void;
    onBusyChange?: (busy: boolean) => void;
    onOpenTask?: (taskId: string, commentId?: string | null) => void;
}) {
    const { user } = useAuth();
    const userId = user?.userId || "";
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [kind, setKind] = useState<FileKind>("all");
    const tabId = useId();
    const [sort, setSort] = useState<FileSort>("newest");
    const [files, setFiles] = useState<ProjectFile[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [canUpload, setCanUpload] = useState(false);
    const [search, setSearch] = useState("");
    const [debounced, setDebounced] = useState("");
    const [source, setSource] = useState("");
    const [selectedTask, setSelectedTask] = useState("");
    const [revision, setRevision] = useState(0);
    const [uploading, setUploading] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const query = { projectId, taskId: taskId || selectedTask || undefined, search: debounced || undefined, source: source || undefined, sort, kind };
    const queryKey = `${userId}/${projectFileListCache.key(query)}`;
    const [displayKey, setDisplayKey] = useState(queryKey);
    const cachedView = displayKey === queryKey ? undefined : projectFileListCache.peek(userId, query);
    // Key rendered rows too: a newly selected tab never flashes another tab's data.
    const visibleFiles = displayKey === queryKey ? files : cachedView?.items || [];
    const visibleTotal = displayKey === queryKey ? total : cachedView?.totalCount || 0;
    const visibleLoading = displayKey === queryKey ? loading : !cachedView;
    const visibleCanUpload = Boolean(userId) && (displayKey === queryKey ? canUpload : Boolean(cachedView && projectFileListCache.isFresh(cachedView) && cachedView.canUpload));
    const inputRef = useRef<HTMLInputElement>(null);
    const generation = useRef(0);
    const mounted = useRef(false);
    const operation = useRef(false);
    const readLock = useRef(false);
    const uploadController = useRef<AbortController | null>(null);
    useEffect(() => { mounted.current = true; return () => { mounted.current = false; generation.current++; uploadController.current?.abort(); }; }, []);
    useEffect(() => { const timer = window.setTimeout(() => setDebounced(search.trim()), 250); return () => window.clearTimeout(timer); }, [search]);
    useEffect(() => {
        const refresh = (event: Event) => {
            if ((event as CustomEvent<{
                projectId: string;
            }>).detail?.projectId === projectId) {
                projectFileListCache.invalidateProject(projectId);
                setRevision((value) => value + 1);
            }
        };
        window.addEventListener("allocatr:files-changed", refresh);
        return () => window.removeEventListener("allocatr:files-changed", refresh);
    }, [projectId]);
    function applySnapshot(snapshot: FileListSnapshot) {
        setFiles(snapshot.items);
        setPage(snapshot.page);
        setTotal(snapshot.totalCount);
        setCanUpload(snapshot.canUpload);
        setDisplayKey(queryKey);
    }
    function refreshFiles() { projectFileListCache.invalidateProject(projectId); setRevision(value => value + 1); }
    useEffect(() => {
        const request = ++generation.current;
        let canceled = false;
        const cached = projectFileListCache.peek(userId, query);
        setError(null);
        setLoadingMore(false);
        setDisplayKey(queryKey);
        if (cached) {
            applySnapshot(cached);
            setLoading(false);
            if (projectFileListCache.isFresh(cached)) {
                readLock.current = false;
                setRefreshing(false);
                return;
            }
            setCanUpload(false);
            setRefreshing(true);
        }
        else {
            setFiles([]);
            setTotal(0);
            setPage(0);
            setCanUpload(false);
            setLoading(Boolean(userId));
            setRefreshing(false);
        }
        if (!userId) {
            readLock.current = false;
            return;
        }
        readLock.current = true;
        void projectFileListCache.read(userId, query, cached?.page || 1).then(snapshot => {
            if (!canceled && request === generation.current)
                applySnapshot(snapshot);
        }).catch(cause => {
            if (canceled || request !== generation.current || (cause instanceof Error && cause.name === "AbortError"))
                return;
            const status = isAxiosError(cause) ? cause.response?.status : undefined;
            if (status === 401 || status === 403 || status === 404) {
                setFiles([]);
                setTotal(0);
                setPage(0);
                setCanUpload(false);
            }
            setError(fileError(cause, cached ? "Files could not be refreshed. Your current view has been kept." : "Files could not be loaded."));
        }).finally(() => {
            if (!canceled && request === generation.current) {
                setLoading(false);
                setRefreshing(false);
                readLock.current = false;
            }
        });
        // Shared reads finish into the cache when a tab changes.
        return () => { canceled = true; };
    }, [queryKey, revision]);
    async function more() {
        if (readLock.current || loading || loadingMore || displayKey !== queryKey || !userId)
            return;
        const request = generation.current;
        readLock.current = true;
        setLoadingMore(true);
        setError(null);
        try {
            const snapshot = await projectFileListCache.read(userId, query, page + 1);
            if (mounted.current && request === generation.current)
                applySnapshot(snapshot);
        }
        catch (cause) {
            if (mounted.current && request === generation.current && !(cause instanceof Error && cause.name === "AbortError")) {
                const status = isAxiosError(cause) ? cause.response?.status : undefined;
                if (status === 401 || status === 403 || status === 404) {
                    setFiles([]);
                    setTotal(0);
                    setPage(0);
                    setCanUpload(false);
                }
                setError(fileError(cause, "More files could not be loaded."));
            }
        }
        finally {
            if (mounted.current && request === generation.current) {
                setLoadingMore(false);
                readLock.current = false;
            }
        }
    }
    async function upload(selected: File[]) {
        if (operation.current || !canUpload)
            return;
        operation.current = true;
        onBusyChange?.(true);
        const controller = new AbortController();
        uploadController.current = controller;
        try {
            for (const file of selected) {
                if (!mounted.current || controller.signal.aborted)
                    break;
                const validation = validateSelectedFile(file);
                if (validation) {
                    toast.error(`${file.name}: ${validation}`);
                    continue;
                }
                setUploading(file.name);
                setProgress(0);
                try {
                    await uploadProjectFile(projectId, file, { taskId: taskId || selectedTask || undefined, signal: controller.signal,
                        onProgress: (value) => {
                            if (mounted.current && !controller.signal.aborted)
                                setProgress(value);
                        } });
                    if (mounted.current && !controller.signal.aborted)
                        toast.success(`${file.name} uploaded.`);
                }
                catch (cause) {
                    if (!controller.signal.aborted)
                        toast.error(fileError(cause, `${file.name} could not be uploaded.`));
                }
            }
        }
        finally {
            operation.current = false;
            if (mounted.current)
                onBusyChange?.(false);
            if (mounted.current) {
                setUploading(null);
                notifyProjectFilesChanged(projectId);
            }
        }
    }
    return <section aria-label={taskId ? "Task files" : "Project files"} className="min-w-0">
    <header className={workspaceHeader ? "flex flex-col gap-4 border-b border-border/70 pb-5 sm:flex-row sm:items-start sm:justify-between" : "flex flex-wrap items-center justify-between gap-3"}>
      {workspaceHeader ? <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] text-muted-foreground" title={workspaceHeader.projectTitle}>{workspaceHeader.projectTitle}</p>
        <h1 className="mt-2 flex items-center gap-2.5 text-2xl font-medium tracking-[-0.03em]"><FolderOpenIcon size={21} aria-hidden="true" className="shrink-0 text-brand-secondary-highlight dark:text-secondary"/>Files</h1>
        <p className="mt-1.5 text-xs leading-6 text-muted-foreground">Documents, media and task attachments.</p>
      </div> : <div className="min-w-0"><h2 className="inline-flex items-center gap-2 text-sm font-medium"><PaperclipIcon size={15} className="text-brand-secondary-highlight dark:text-secondary" aria-hidden="true"/>{taskId ? "Task files" : "Project files"}</h2><p className="mt-1 text-xs leading-6 text-muted-foreground">{taskId ? "Files shared in this task and its discussion." : "All project, task and discussion files in one place."}</p></div>}
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        {workspaceHeader && <Link to={workspaceHeader.managerPath} className={secondaryAction}><BlocksIcon size={14} aria-hidden="true"/>Manager</Link>}
        <button type="button" aria-label="Refresh files" title="Refresh files" disabled={visibleLoading || refreshing || loadingMore || !!uploading} onClick={refreshFiles} className={`${secondaryAction} h-10 w-10 px-0`}>{refreshing || visibleLoading ? <BusyIcon /> : <RefreshCwIcon size={14} aria-hidden="true"/>}</button>
        {visibleCanUpload && <button type="button" disabled={!!uploading} onClick={() => inputRef.current?.click()} className={primaryAction}><UploadIcon size={14} aria-hidden="true"/>Upload files</button>}
      </div>
    </header>
    <input ref={inputRef} type="file" multiple accept={FILE_ACCEPT} className="hidden" aria-label="Upload project files" onChange={(event) => { const selected = Array.from(event.target.files || []); event.target.value = ""; void upload(selected); }}/>
    <div className="mt-4 flex min-w-0 items-center justify-between gap-3 border-b border-border/70">
    <div role="tablist" aria-label="File categories" className="grid min-w-0 flex-1 grid-cols-4 gap-1 sm:flex sm:flex-none">
      {FILE_TABS.map((tab, index) => <button key={tab.value} id={`${tabId}-${tab.value}`} type="button" role="tab" aria-label={tab.label} title={tab.label} aria-selected={kind === tab.value} aria-controls={`${tabId}-results`} tabIndex={kind === tab.value ? 0 : -1} onClick={() => setKind(tab.value)} onKeyDown={event => {
                const next = event.key === "ArrowRight" ? (index + 1) % FILE_TABS.length : event.key === "ArrowLeft" ? (index + FILE_TABS.length - 1) % FILE_TABS.length : event.key === "Home" ? 0 : event.key === "End" ? FILE_TABS.length - 1 : -1;
                if (next < 0)
                    return;
                event.preventDefault();
                setKind(FILE_TABS[next].value);
                document.getElementById(`${tabId}-${FILE_TABS[next].value}`)?.focus();
            }} className={`flex min-h-11 min-w-0 items-center justify-center gap-2 border-b-2 px-2 py-3 text-xs sm:shrink-0 sm:px-4 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/35 ${kind === tab.value ? "border-brand-secondary-highlight text-brand-secondary-highlight dark:border-secondary dark:text-secondary" : "border-transparent text-muted-foreground hover:bg-surface-2/60 hover:text-foreground"}`}><tab.icon size={16} aria-hidden="true" className="shrink-0"/><span className="sr-only sm:not-sr-only">{tab.label}</span></button>)}
    </div>
    <p className="shrink-0 text-[11px] tabular-nums text-muted-foreground">{visibleLoading ? "Loading…" : `${visibleTotal} ${visibleTotal === 1 ? "file" : "files"}`}</p>
    </div>
    <div className="mt-3 flex min-w-0 flex-col gap-2 md:flex-row md:items-center">
      <div className="relative w-full min-w-0 md:min-w-[160px] md:flex-1"><SearchIcon size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true"/><input value={search} maxLength={100} onChange={event => setSearch(event.target.value)} aria-label="Search files" placeholder="Search files or uploaders" className="h-11 w-full rounded-lg border border-input bg-card pl-9 pr-3 text-base outline-none focus-visible:border-ring/50 sm:h-10 sm:text-xs"/></div>
      <div className="flex min-w-0 items-center justify-end gap-2 md:shrink-0">
        {!taskId && <FileFilterMenu label="Filter files by task" icon={ListTodoIcon} active={Boolean(selectedTask)} value={selectedTask} onChange={setSelectedTask} options={[{ value: "", label: "All tasks" }, ...tasks.map(task => ({ value: task.id, label: task.title }))]}/>}
        <FileFilterMenu label="Filter files by source" icon={SlidersHorizontalIcon} active={Boolean(source)} value={source} onChange={setSource} options={[{ value: "", label: "All sources" }, ...(!taskId ? [{ value: "project", label: "Project" }] : []), { value: "task", label: "Task" }, { value: "comment", label: "Comment" }]}/>
        <FileFilterMenu label="Sort files" icon={ArrowDownWideNarrowIcon} active={sort !== "newest"} value={sort} onChange={value => setSort(value as FileSort)} options={[{ value: "newest", label: "Newest first" }, { value: "oldest", label: "Oldest first" }, { value: "name-asc", label: "Name A–Z" }, { value: "name-desc", label: "Name Z–A" }, { value: "size-desc", label: "Largest first" }, { value: "size-asc", label: "Smallest first" }, { value: "type-asc", label: "Type A–Z" }, { value: "type-desc", label: "Type Z–A" }]}/>
        <div role="group" aria-label="File view" className="flex h-10 shrink-0 items-center gap-1 rounded-lg border border-border/70 bg-surface-2/50 p-1">
          <button type="button" aria-label="Grid view" title="Grid view" aria-pressed={viewMode === "grid"} onClick={() => setViewMode("grid")} className={`flex h-8 w-8 items-center justify-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 ${viewMode === "grid" ? "bg-brand-secondary-highlight text-primary-foreground dark:bg-secondary dark:text-secondary-foreground" : "text-muted-foreground hover:bg-surface-3/70"}`}><Grid2X2Icon size={15} aria-hidden="true"/></button>
          <button type="button" aria-label="List view" title="List view" aria-pressed={viewMode === "list"} onClick={() => setViewMode("list")} className={`flex h-8 w-8 items-center justify-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 ${viewMode === "list" ? "bg-brand-secondary-highlight text-primary-foreground dark:bg-secondary dark:text-secondary-foreground" : "text-muted-foreground hover:bg-surface-3/70"}`}><ListIcon size={15} aria-hidden="true"/></button>
        </div>
      </div>
    </div>
    {uploading && <p className="mt-3 text-xs text-muted-foreground">Keep this page open until uploads finish.</p>}
    {uploading && <p role="status" className="mt-3 break-words text-xs text-muted-foreground"><BusyIcon />Uploading {uploading} · {progress}%</p>}
    {error && <div role="alert" className="mt-4 rounded-lg border border-border p-4 text-xs leading-6"><p>{error}</p><button type="button" onClick={refreshFiles} className={quietAction + " mt-2"}>Try again</button></div>}
    <div id={`${tabId}-results`} role="tabpanel" aria-labelledby={`${tabId}-${kind}`} aria-busy={visibleLoading || refreshing || loadingMore} className={viewMode === "grid" ? "mt-4 grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(min(100%,220px),1fr))]" : "mt-4 space-y-2"}>{visibleFiles.map((file) => <FileAttachment key={file.id} viewMode={viewMode} file={file} onPreview={onPreview} onOpenTask={onOpenTask} onRemoved={(id) => { setFiles((current) => current.filter((item) => item.id !== id)); onRemoved?.(id); }}/>)}</div>
    {visibleLoading && <p role="status" className="flex min-h-16 items-center justify-center gap-2 text-xs text-muted-foreground"><BusyIcon />Loading files…</p>}
    {!visibleLoading && !error && !visibleFiles.length && <p className="rounded-xl border border-dashed border-border px-4 py-7 text-center text-xs leading-6 text-muted-foreground">{search || source || selectedTask || kind !== "all" ? "No files match these filters." : "No files have been shared here yet."}</p>}
    {!visibleLoading && visibleFiles.length > 0 && visibleFiles.length < visibleTotal && <button type="button" disabled={loadingMore || refreshing} onClick={() => void more()} className={secondaryAction + " mt-4 w-full"}>{loadingMore ? "Loading more…" : `Load more files (${visibleFiles.length} of ${visibleTotal})`}</button>}
  </section>;
}
function shortDate(value: string) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "" : new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(date);
}
function FileFilterMenu({ label, value, options, onChange, icon: Icon, active = false }: {
    label: string;
    value: string;
    icon?: LucideIcon;
    active?: boolean;
    options: {
        value: string;
        label: string;
    }[];
    onChange: (value: string) => void;
}) {
    const selected = options.find(option => option.value === value) ?? options[0];
    return <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button type="button" aria-label={`${label}: ${selected?.label || "All"}`} title={`${label}: ${selected?.label || "All"}`} className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-surface-2/50 text-xs font-medium text-foreground/80 transition-colors hover:bg-surface-3/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 data-[state=open]:bg-surface-3/60 sm:w-auto sm:min-w-[110px] sm:max-w-[136px] sm:justify-between sm:gap-2 sm:px-3">
          {Icon && <Icon size={15} aria-hidden="true" className="shrink-0 sm:hidden"/>}
          <span className="hidden min-w-0 truncate sm:block">{selected?.label || "All"}</span>
          <ChevronDownIcon size={12} aria-hidden="true" className="hidden shrink-0 text-muted-foreground sm:block"/>
          {active && <span aria-hidden="true" className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-brand-secondary-highlight dark:bg-secondary sm:hidden"/>}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={6} className={`${menuSurface} max-h-[min(18rem,var(--radix-dropdown-menu-content-available-height))] w-64 max-w-[calc(100vw-3rem)] overflow-y-auto overscroll-contain p-1.5`}>
        {options.map(option => <DropdownMenuItem key={option.value} role="menuitemradio" aria-checked={value === option.value} onSelect={() => onChange(option.value)} className={`${menuItem} flex items-center justify-between gap-3 rounded-lg px-2.5 py-2 ${value === option.value ? "bg-brand-secondary-highlight/[0.07] text-brand-secondary-highlight dark:bg-secondary/[0.07] dark:text-secondary" : "text-foreground/75"}`}>
          <span className="min-w-0 break-words text-xs leading-5">{option.label}</span>
          {value === option.value && <CheckIcon size={13} aria-hidden="true" className="shrink-0 text-brand-secondary-highlight dark:text-secondary"/>}
        </DropdownMenuItem>)}
      </DropdownMenuContent>
    </DropdownMenu>;
}
const FILE_TABS: {
    value: FileKind;
    label: string;
    icon: LucideIcon;
}[] = [
    { value: "all", label: "All", icon: Grid2X2Icon }, { value: "images", label: "Images", icon: ImageIcon }, { value: "video", label: "Video", icon: FilmIcon }, { value: "documents", label: "Documents", icon: FileTextIcon },
];
