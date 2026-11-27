import { BanIcon } from "lucide-react";
import type { Project } from "@/Types/project";

export default function ProjectCancellationNotice({
    project,
    compact = false,
}: {
    project: Project;
    compact?: boolean;
}) {
    if (
        !["cancelled", "canceled"].includes(
            String(project.status).toLowerCase(),
        )
    )
        return null;
    if (compact)
        return (
            <p className="mt-3 text-[11px] leading-5 text-muted-foreground">
                Cancelled · Project history is available.
            </p>
        );
    return (
        <div
            role="status"
            className="mt-5 flex items-start gap-3 rounded-lg border border-border/70 bg-surface-2/50 px-4 py-4"
        >
            <BanIcon
                size={16}
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-muted-foreground"
            />
            <div className="min-w-0">
                <p className="text-sm font-medium">
                    This project has been cancelled
                </p>
                <p className="mt-1 text-xs leading-6 text-muted-foreground">
                    Project work is read-only. You can still view its history
                    and use discussion to resolve outstanding questions.
                </p>
                {project.cancellationReason && (
                    <p className="mt-2 whitespace-pre-wrap break-words text-xs leading-6">
                        <span className="font-medium">Reason: </span>
                        {project.cancellationReason}
                    </p>
                )}
            </div>
        </div>
    );
}
