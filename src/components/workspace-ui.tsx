import {
  CircleCheckBigIcon,
  CircleDashedIcon,
  CircleDotIcon,
  FlagIcon,
  LoaderCircleIcon,
  type LucideIcon,
} from "lucide-react";
import {
  formatStatus,
  normalizeStatus,
  type WorkflowStatus,
} from "./workspace-utils";

export const primaryAction =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-brand-secondary-highlight/20 bg-brand-secondary-highlight px-4 py-2 text-xs font-medium text-primary-foreground shadow-none transition-opacity duration-150 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-60 dark:border-secondary/20 dark:bg-secondary dark:text-secondary-foreground dark:focus-visible:ring-secondary/35 motion-reduce:transition-none";
export const secondaryAction =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-medium text-foreground shadow-none transition-opacity duration-150 hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 disabled:pointer-events-none disabled:opacity-55 motion-reduce:transition-none";
export const quietAction =
  "inline-flex min-h-9 items-center justify-center gap-2 rounded-lg px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-surface-3/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 disabled:pointer-events-none disabled:opacity-55 motion-reduce:transition-none";
export const menuSurface =
  "z-[80] rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-none";
export const menuItem =
  "min-h-9 rounded-lg px-3 py-2 text-xs font-medium text-foreground focus:bg-surface-3/65 focus:text-foreground data-[highlighted]:bg-surface-3/65";
export const laneAppearance: Record<
  WorkflowStatus,
  { label: string; icon: LucideIcon; text: string; dot: string }
> = {
  pending: {
    label: "Pending",
    icon: CircleDashedIcon,
    text: "text-status-pending-foreground",
    dot: "bg-status-pending",
  },
  active: {
    label: "In progress",
    icon: CircleDotIcon,
    text: "text-status-active-foreground",
    dot: "bg-status-active",
  },
  complete: {
    label: "Complete",
    icon: CircleCheckBigIcon,
    text: "text-status-complete-foreground",
    dot: "bg-status-complete",
  },
};
export function TaskStatus({ status }: { status: WorkflowStatus }) {
  const { label, icon: Icon, text } = laneAppearance[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-medium ${text}`}
    >
      <Icon size={12} aria-hidden="true" />
      {label}
    </span>
  );
}
export function ProjectStatus({
  status,
  className = "",
}: {
  status?: string;
  className?: string;
}) {
  const normalized = normalizeStatus(status);
  const pending = ["pending", "completionrequested"].includes(normalized);
  const completed = ["complete", "completed", "closed"].includes(normalized);
  const cancelled = ["cancelled", "canceled"].includes(normalized);
  const label =
    normalized === "completionrequested"
      ? "Awaiting confirmation"
      : completed
        ? "Completed"
        : normalized === "onhold"
          ? "On hold"
          : formatStatus(status);
  const color = pending
    ? "bg-status-pending"
    : completed
      ? "bg-status-complete"
      : cancelled
        ? "bg-status-overdue"
        : normalized === "active"
          ? "bg-status-active"
          : "bg-muted-foreground";
  return (
    <span
      className={`inline-flex max-w-full items-center gap-2 text-[11px] font-medium text-muted-foreground ${className}`}
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${color}`}
      />
      <span>{label}</span>
    </span>
  );
}
export function BusyIcon() {
  return (
    <LoaderCircleIcon
      size={14}
      aria-hidden="true"
      className="animate-spin motion-reduce:animate-none"
    />
  );
}

export function TaskPriority({ priority }: { priority: string }) {
  const value = normalizeStatus(priority);

  const color =
    value === "urgent"
      ? "text-status-overdue-foreground"
      : value === "high"
        ? "text-status-pending-foreground"
        : value === "standard"
          ? "text-brand-secondary-highlight"
          : "text-muted-foreground";

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-medium ${color}`}
    >
      <FlagIcon
        size={11}
        aria-hidden="true"
        className="shrink-0 text-inherit"
      />
      {formatStatus(priority)} priority
    </span>
  );
}
