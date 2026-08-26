import { useState } from "react";
import {
  CalendarDaysIcon,
  CheckCircle2Icon,
  CircleDashedIcon,
  CircleDotIcon,
  Clock3Icon,
  MessageSquareIcon,
  SendIcon,
  TriangleAlertIcon,
  UserRoundIcon,
} from "lucide-react";

import type { Task } from "@/Types/task";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function TaskDialog({
  task,
  open,
  onOpenChange,
}: Props) {
  const [comment, setComment] = useState("");

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent
        className={[
          "flex max-h-[90vh] flex-col overflow-hidden p-0",
          "sm:max-w-3xl",
        ].join(" ")}
      >
        {/* ================================================
            HEADER
        ================================================ */}

        <DialogHeader className="shrink-0 border-b border-border px-6 py-6 text-left sm:px-7">
          <div className="pr-8">
            <div className="flex flex-wrap items-center gap-2">
              <TaskStatusBadge status={task.status} />

              {task.priority && (
                <Badge
                  variant="outline"
                  className="rounded-md font-medium capitalize shadow-none"
                >
                  {task.priority}
                </Badge>
              )}
            </div>

            <DialogTitle className="mt-4 text-xl font-bold tracking-[-0.02em] sm:text-2xl">
              {task.title}
            </DialogTitle>

            <DialogDescription className="mt-2">
              Task details and discussion
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* ================================================
            BODY
        ================================================ */}

        <div className="min-h-0 flex-1 overflow-y-auto">
          {/* ==============================================
              TASK DETAILS
          ============================================== */}

          <section className="px-6 py-6 sm:px-7">
            <div className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_220px]">
              {/* Description */}

              <div>
                <SectionLabel>
                  Description
                </SectionLabel>

                {task.description ? (
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-foreground">
                    {task.description}
                  </p>
                ) : (
                  <p className="mt-2 text-sm italic text-muted-foreground">
                    No description added.
                  </p>
                )}
              </div>

              {/* Metadata */}

              <div className="space-y-4">
                <TaskMeta
                  icon={
                    <CalendarDaysIcon size={15} />
                  }
                  label="Due date"
                  value={formatDate(task.dueDate)}
                />

                <TaskMeta
                  icon={
                    <UserRoundIcon size={15} />
                  }
                  label="Assigned to"
                  value={getAssignedTo(task)}
                />

                <TaskMeta
                  icon={<Clock3Icon size={15} />}
                  label="Status"
                  value={formatStatus(task.status)}
                />
              </div>
            </div>
          </section>

          {/* ==============================================
              DISCUSSION
          ============================================== */}

          <section className="border-t border-border">
            <div className="px-6 py-6 sm:px-7">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <MessageSquareIcon
                      size={16}
                      className="text-primary"
                    />

                    <h2 className="text-sm font-bold">
                      Discussion
                    </h2>
                  </div>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Share feedback, ideas and updates about this task.
                  </p>
                </div>

                <span className="text-xs font-medium text-muted-foreground">
                  0 comments
                </span>
              </div>

              {/* ==========================================
                  COMMENTS
              ========================================== */}

              <div className="mt-6">
                <EmptyDiscussion />
              </div>
            </div>
          </section>
        </div>

        {/* ================================================
            COMMENT COMPOSER
        ================================================ */}

        <div className="shrink-0 border-t border-border bg-background px-6 py-4 sm:px-7">
          <div className="flex items-end gap-3">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="bg-primary/10 text-[0.65rem] font-bold text-primary">
                YOU
              </AvatarFallback>
            </Avatar>

            <div className="relative min-w-0 flex-1">
              <Textarea
                value={comment}
                onChange={(event) =>
                  setComment(event.target.value)
                }
                placeholder="Write a comment..."
                rows={1}
                className="min-h-[42px] resize-none pr-12"
              />

              <Button
                type="button"
                size="icon"
                disabled={!comment.trim()}
                className={[
                  "absolute bottom-1.5 right-1.5",
                  "h-8 w-8 rounded-md shadow-none",
                ].join(" ")}
                aria-label="Send comment"
              >
                <SendIcon size={14} />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* =========================================================
   EMPTY DISCUSSION
========================================================= */

function EmptyDiscussion() {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center rounded-lg border border-dashed border-border px-5 py-8 text-center">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <MessageSquareIcon size={17} />
      </div>

      <p className="mt-3 text-sm font-semibold">
        No comments yet
      </p>

      <p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">
        Start the discussion by sharing an update,
        question or feedback about this task.
      </p>
    </div>
  );
}

/* =========================================================
   META
========================================================= */

function TaskMeta({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-muted-foreground">
        {icon}
      </span>

      <div className="min-w-0">
        <p className="text-[0.65rem] font-medium text-muted-foreground">
          {label}
        </p>

        <p className="mt-0.5 truncate text-xs font-semibold">
          {value}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   SECTION LABEL
========================================================= */

function SectionLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
      {children}
    </p>
  );
}

/* =========================================================
   STATUS
========================================================= */

function TaskStatusBadge({
  status,
}: {
  status: Task["status"];
}) {
  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={`rounded-md shadow-none ${config.className}`}
    >
      <Icon size={12} />
      {config.label}
    </Badge>
  );
}

function getStatusConfig(status: Task["status"]) {
  switch (status) {
    case "active":
      return {
        label: "In progress",
        icon: CircleDotIcon,
        className:
          "border-primary/20 bg-primary/5 text-primary",
      };

    case "complete":
      return {
        label: "Complete",
        icon: CheckCircle2Icon,
        className:
          "border-emerald-500/20 bg-emerald-500/5 text-emerald-600",
      };

    case "overdue":
      return {
        label: "Overdue",
        icon: TriangleAlertIcon,
        className:
          "border-destructive/20 bg-destructive/5 text-destructive",
      };

    default:
      return {
        label: "Pending",
        icon: CircleDashedIcon,
        className:
          "border-border bg-muted/40 text-muted-foreground",
      };
  }
}

/* =========================================================
   HELPERS
========================================================= */

function formatStatus(status?: string) {
  if (status === "active") return "In progress";
  if (status === "complete") return "Complete";
  if (status === "overdue") return "Overdue";

  return "Pending";
}

function formatDate(date?: string | Date | null) {
  if (!date) {
    return "No due date";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "No due date";
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

function getAssignedTo(task: Task) {
  /*
   * Replace this once we confirm the assignment
   * properties on your Task type.
   */
  const taskWithAssignment = task as Task & {
    assignedToName?: string;
  };

  return (
    taskWithAssignment.assignedToName ??
    "Unassigned"
  );
}

export default TaskDialog;