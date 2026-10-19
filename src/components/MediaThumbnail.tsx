import { useEffect, useRef, useState } from "react";
import { PlayIcon } from "lucide-react";
import type { ProjectFile } from "@/Types/projectFile";
import { useAuth } from "@/auth/useAuth";
import { thumbnailCache } from "@/api/thumbnailCache";
import FileTypeIcon from "./FileTypeIcon";
import { getPreviewKind } from "./FilePreview";
export default function MediaThumbnail({ file }: {
    file: ProjectFile;
}) {
    const { user } = useAuth();
    return <Thumbnail key={`${user?.userId || "guest"}/${file.projectId}/${file.id}`} file={file} userId={user?.userId}/>;
}
function Thumbnail({ file, userId }: {
    file: ProjectFile;
    userId?: string;
}) {
    const kind = getPreviewKind(file);
    const media = kind === "image" || kind === "video";
    const host = useRef<HTMLSpanElement>(null);
    const [visible, setVisible] = useState(false);
    const [url, setUrl] = useState<string | null>(null);
    const [ready, setReady] = useState(false);
    const [failed, setFailed] = useState(false);
    useEffect(() => {
        if (!media || !host.current || !userId)
            return;
        if (typeof IntersectionObserver === "undefined") {
            setVisible(true);
            return;
        }
        const observer = new IntersectionObserver(entries => {
            if (entries.some(entry => entry.isIntersecting)) {
                setVisible(true);
                observer.disconnect();
            }
        }, { rootMargin: "128px" });
        observer.observe(host.current);
        return () => observer.disconnect();
    }, [media, userId]);
    useEffect(() => {
        if (!visible || !media || !userId)
            return;
        let canceled = false;
        setUrl(null);
        setReady(false);
        setFailed(false);
        void thumbnailCache.get(userId, file).then(value => {
            if (!canceled)
                setUrl(value);
        }).catch(() => {
            if (!canceled)
                setFailed(true);
        });
        // Leave the shared request/cache alive when a tab unmounts this card.
        return () => { canceled = true; };
    }, [visible, media, userId, file.id, file.projectId]);
    return <span ref={host} aria-hidden="true" className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <FileTypeIcon file={file} size={32} strokeWidth={1.5}/>
      {!failed && url && <img src={url} alt="" loading="lazy" decoding="async" onLoad={() => setReady(true)} onError={() => { thumbnailCache.invalidate(file.projectId, file.id); setFailed(true); setReady(false); }} className={`absolute inset-0 h-full w-full object-cover ${ready ? "opacity-100" : "opacity-0"}`}/>}
      {ready && !failed && kind === "video" && <span className="pointer-events-none absolute inset-0 flex items-center justify-center"><span className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card/90 text-foreground"><PlayIcon size={16} fill="currentColor"/></span></span>}
    </span>;
}
