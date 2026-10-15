import { useId, useState, type MouseEvent, type ReactNode } from "react";

import {
  CalendarDaysIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  PencilIcon,
  Trash2Icon,
  TriangleAlertIcon,
  UserRoundIcon,
} from "lucide-react";

import type { Task } from "@/Types/task";

import TaskDialog from "./TaskDialog";
import DeleteTaskDialog from "./DeleteTaskDialog";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import {
  laneAppearance,
  menuItem,
  menuSurface,
  TaskPriority,
  TaskStatus,
} from "./workspace-ui";

import {
  formatDate,
  getAssignedName,
  getTaskPriority,
  getWorkflowStatus,
  initials,
  isTaskOverdue,
  WORKFLOW_STATUSES,
  type WorkflowStatus,
} from "./workspace-utils";

/* =========================================================
   TYPES
========================================================= */

type Props = {
  task: Task;
  isOverlay?: boolean;
  canManageTasks?: boolean;
  dragHandle?: ReactNode;

  onMoveTask?: (taskId: string, status: WorkflowStatus) => void | Promise<void>;

  onEditTask?: (task: Task) => void;

  onDeleteTask?: (task: Task) => void | Promise<void>;
};

/* =========================================================
   TASK CARD
========================================================= */

export default function TaskCard({
  task,
  isOverlay = false,
  canManageTasks = false,
  dragHandle,
  onMoveTask,
  onEditTask,
  onDeleteTask,
}: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const titleId = useId();

  const status = getWorkflowStatus(task);
  const overdue = isTaskOverdue(task);
  const assigned = getAssignedName(task);
  const priority = getTaskPriority(task);

  const hasAssignee = Boolean(task.assignedToId);

  const assigneeName =
    task.assignedToName?.trim() ||
    (task.assignedToId && task.assignedToId === task.createdByUserId
      ? task.createdByName?.trim()
      : "") ||
    "";

  const assigneeAvatarUrl = hasAssignee
    ? task.assignedToAvatarUrl?.trim() || undefined
    : undefined;

  const hasManagementActions =
    canManageTasks && Boolean(onMoveTask || onEditTask || onDeleteTask);

  /* =======================================================
     OPEN TASK
  ======================================================= */

  function openTask() {
    if (!isOverlay) {
      setDialogOpen(true);
    }
  }

  function handleCardClick(event: MouseEvent<HTMLElement>) {
    if (isOverlay) return;

    const target = event.target;

    if (!(target instanceof Element)) return;

    if (
      target.closest("button, a, input, textarea, select, [role='menuitem']")
    ) {
      return;
    }

    openTask();
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <>
      <article
        aria-labelledby={titleId}
        onClick={isOverlay ? undefined : handleCardClick}
        className={[
          "group relative min-w-0 rounded-lg border",
          "bg-card px-4 py-4 shadow-none",
          "transition-[border-color,opacity] duration-150",
          "motion-reduce:transition-none",
          isOverlay
            ? "h-full border-border/85"
            : "border-border/85 hover:border-ring/30",
        ].join(" ")}
      >
        {/* STATUS ACCENT */}

        <span
          aria-hidden="true"
          className={[
            "absolute left-4 top-0 h-0.5 w-7",
            "rounded-full opacity-70",
            laneAppearance[status].dot,
          ].join(" ")}
        />

        {/* TITLE AND CONTROLS */}

        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1">
            <h4
              id={titleId}
              className="break-words text-[13px] font-medium leading-6 tracking-[-0.01em] text-foreground"
            >
              <button
                type="button"
                tabIndex={isOverlay ? -1 : undefined}
                onClick={isOverlay ? undefined : openTask}
                className={[
                  "rounded text-left",
                  "focus-visible:outline-none",
                  "focus-visible:ring-2",
                  "focus-visible:ring-ring/35",
                ].join(" ")}
              >
                {task.title}
              </button>
            </h4>

            {task.description && (
              <p className="mt-1.5 line-clamp-2 break-words text-xs leading-6 text-muted-foreground">
                {task.description}
              </p>
            )}
          </div>

          {isOverlay ? (
            <div
              aria-hidden="true"
              className="flex shrink-0 items-center gap-0.5"
            >
              {dragHandle}

              <span className="flex h-8 w-8 items-center justify-center text-muted-foreground">
                <EllipsisVerticalIcon size={15} aria-hidden="true" />
              </span>
            </div>
          ) : (
            <div className="flex shrink-0 items-center gap-0.5">
              {dragHandle}

              <div
                onPointerDown={(event) => event.stopPropagation()}
                onClick={(event) => event.stopPropagation()}
              >
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      aria-label={`Task options for ${task.title}`}
                      className={[
                        "flex h-8 w-8 items-center justify-center",
                        "rounded-md text-muted-foreground",
                        "transition-colors",
                        "hover:bg-surface-3/70 hover:text-foreground",
                        "focus-visible:outline-none",
                        "focus-visible:ring-2",
                        "focus-visible:ring-ring/35",
                      ].join(" ")}
                    >
                      <EllipsisVerticalIcon size={15} aria-hidden="true" />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    sideOffset={6}
                    collisionPadding={12}
                    className={`${menuSurface} w-48`}
                  >
                    <DropdownMenuItem
                      className={menuItem}
                      onSelect={() => requestAnimationFrame(openTask)}
                    >
                      <EyeIcon size={13} aria-hidden="true" />
                      View task
                    </DropdownMenuItem>

                    {hasManagementActions && (
                      <DropdownMenuSeparator className="bg-border/70" />
                    )}

                    {canManageTasks && onEditTask && (
                      <DropdownMenuItem
                        className={menuItem}
                        onSelect={() => onEditTask(task)}
                      >
                        <PencilIcon size={13} aria-hidden="true" />
                        Edit task
                      </DropdownMenuItem>
                    )}

                    {canManageTasks && onMoveTask && (
                      <>
                        <DropdownMenuLabel className="px-3 pb-1 pt-2 text-[10px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
                          Move to
                        </DropdownMenuLabel>

                        {WORKFLOW_STATUSES.filter(
                          (value) => value !== status,
                        ).map((value) => {
                          const {
                            icon: Icon,
                            label,
                            text,
                          } = laneAppearance[value];

                          return (
                            <DropdownMenuItem
                              key={value}
                              className={menuItem}
                              onSelect={() => void onMoveTask(task.id, value)}
                            >
                              <Icon
                                size={13}
                                aria-hidden="true"
                                className={text}
                              />
                              {label}
                            </DropdownMenuItem>
                          );
                        })}
                      </>
                    )}

                    {canManageTasks && onDeleteTask && (
                      <>
                        <DropdownMenuSeparator className="bg-border/70" />

                        <DropdownMenuItem
                          className={[
                            "min-h-9 rounded-lg px-3 py-2",
                            "text-xs font-medium",
                            "text-status-overdue-foreground",
                            "focus:bg-destructive/[0.06]",
                            "focus:text-status-overdue-foreground",
                          ].join(" ")}
                          onSelect={() =>
                            requestAnimationFrame(() => setDeleteOpen(true))
                          }
                        >
                          <Trash2Icon size={13} aria-hidden="true" />
                          Delete task
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )}
        </div>

        {/* PRIORITY */}

        {priority && (
          <div className="mt-3">
            <TaskPriority priority={priority} />
          </div>
        )}

        {/* DUE DATE AND STATUS */}

        <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t border-border/65 pt-3">
          <span
            className={[
              "inline-flex min-w-0 items-center gap-1.5",
              "text-[11px]",
              overdue
                ? "text-status-overdue-foreground"
                : "text-muted-foreground",
            ].join(" ")}
          >
            <CalendarDaysIcon
              size={12}
              aria-hidden="true"
              className="shrink-0"
            />

            <span title={formatDate(task.dueDate)}>
              {task.dueDate ? formatDate(task.dueDate, false) : "No due date"}
            </span>
          </span>

          <TaskStatus status={status} />
        </div>

        {/* ASSIGNMENT AND OVERDUE */}

        <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 text-[11px] text-muted-foreground">
          <span
            className="inline-flex min-w-0 items-center gap-2"
            title={assigned}
          >
            <Avatar
              aria-hidden="true"
              className="h-6 w-6 shrink-0 border border-border/80"
            >
              <AvatarImage
                src={assigneeAvatarUrl}
                alt=""
                className="object-cover"
              />

              <AvatarFallback className="bg-surface-3 text-[9px] font-medium text-brand-secondary-highlight">
                {hasAssignee && assigneeName ? (
                  initials(assigneeName)
                ) : (
                  <UserRoundIcon size={12} aria-hidden="true" />
                )}
              </AvatarFallback>
            </Avatar>

            <span className="truncate">{assigned}</span>
          </span>

          {overdue && (
            <span className="inline-flex shrink-0 items-center gap-1 text-status-overdue-foreground">
              <TriangleAlertIcon size={11} aria-hidden="true" />
              Overdue
            </span>
          )}
        </div>
      </article>

      {/* TASK DETAILS */}

      {!isOverlay && (
        <TaskDialog
          task={{ ...task, status }}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      )}

      {/* DELETE CONFIRMATION */}

      {!isOverlay && canManageTasks && onDeleteTask && (
        <DeleteTaskDialog
          task={task}
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          onConfirm={onDeleteTask}
        />
      )}
    </>
  );
}
