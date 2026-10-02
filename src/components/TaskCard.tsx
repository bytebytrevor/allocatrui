import {
  CalendarDaysIcon,
  CircleCheckBigIcon,
  CircleDashedIcon,
  CircleDotIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  PencilIcon,
  Trash2Icon,
  TriangleAlertIcon,
} from "lucide-react";

import {
  useState,
  type ComponentType,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from "react";

import type { Task } from "@/Types/task";

import TaskDialog from "@/components/TaskDialog";
import DeleteTaskDialog from "./DeleteTaskDialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/* =========================================================
   TYPES
========================================================= */

type WorkflowStatus = "pending" | "active" | "complete";

type Props = {
  task: Task;
  isOverlay?: boolean;
  canManageTasks?: boolean;
  onMoveTask?: (taskId: string, status: WorkflowStatus) => void | Promise<void>;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (task: Task) => void | Promise<void>;
};

type TaskStatusAppearance = {
  label: string;
  icon: ComponentType<{
    size?: number;
    className?: string;
  }>;
  iconClass: string;
  badgeClass: string;
  stroke: string;
  divider: string;
};

type TaskStatusOption = {
  value: WorkflowStatus;
  label: string;
  icon: ComponentType<{
    size?: number;
    className?: string;
  }>;
};

/* =========================================================
   SHARED CARD SURFACE
========================================================= */

const taskCardSurface = [
  "border-border/45",
  "bg-surface-3/40",

  "hover:border-border/65",
  "hover:bg-surface-3/60",

  "dark:border-border",
  "dark:bg-card",

  "dark:hover:border-border",
  "dark:hover:bg-surface-2",
].join(" ");

const taskMenuItemClass = [
  "rounded-lg px-2.5 py-2",

  "text-[0.7rem] font-medium",

  "focus:bg-surface-3/65",
  "focus:text-foreground",

  "dark:text-foreground/85",

  "dark:focus:bg-surface-3",
  "dark:focus:text-foreground",
].join(" ");

/* =========================================================
   STATUS APPEARANCE
========================================================= */

const taskStatusAppearance: Record<WorkflowStatus, TaskStatusAppearance> = {
  pending: {
    label: "Pending",
    icon: CircleDashedIcon,

    iconClass: "text-status-pending-foreground",

    badgeClass: [
      "bg-status-pending/[0.07]",
      "text-status-pending-foreground",

      "dark:bg-status-pending/[0.14]",
      "dark:text-status-pending-foreground",

      "dark:ring-1",
      "dark:ring-inset",
      "dark:ring-status-pending/15",
    ].join(" "),

    stroke: "bg-status-pending",

    divider: "border-status-pending/10 dark:border-status-pending/15",
  },

  active: {
    label: "In progress",
    icon: CircleDotIcon,

    iconClass: "text-status-active-foreground",

    badgeClass: [
      "bg-status-active/[0.06]",
      "text-status-active-foreground",

      "dark:bg-status-active/[0.14]",
      "dark:text-status-active-foreground",

      "dark:ring-1",
      "dark:ring-inset",
      "dark:ring-status-active/15",
    ].join(" "),

    stroke: "bg-status-active",

    divider: "border-status-active/10 dark:border-status-active/15",
  },

  complete: {
    label: "Complete",
    icon: CircleCheckBigIcon,

    iconClass: "text-status-complete-foreground",

    badgeClass: [
      "bg-status-complete/[0.07]",
      "text-status-complete-foreground",

      "dark:bg-status-complete/[0.14]",
      "dark:text-status-complete-foreground",

      "dark:ring-1",
      "dark:ring-inset",
      "dark:ring-status-complete/15",
    ].join(" "),

    stroke: "bg-status-complete",

    divider: "border-status-complete/10 dark:border-status-complete/15",
  },
};

const taskStatusOptions: TaskStatusOption[] = [
  {
    value: "pending",
    label: "Pending",
    icon: CircleDashedIcon,
  },
  {
    value: "active",
    label: "In progress",
    icon: CircleDotIcon,
  },
  {
    value: "complete",
    label: "Complete",
    icon: CircleCheckBigIcon,
  },
];

/* =========================================================
   TASK CARD
========================================================= */

function TaskCard({
  task,
  isOverlay = false,
  canManageTasks = false,
  onMoveTask,
  onEditTask,
  onDeleteTask,
}: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const currentStatus = getWorkflowStatus(task);

  const overdue = currentStatus !== "complete" && isTaskPastDue(task);

  const appearance = taskStatusAppearance[currentStatus];

  const displayTask: Task = {
    ...task,
    status: currentStatus,
  };

  function openTask() {
    if (!isOverlay) {
      setDialogOpen(true);
    }
  }

  function handleCardClick(event: MouseEvent<HTMLElement>) {
    if (isOverlay) return;

    const target = event.target as HTMLElement;

    if (
      target.closest("button, a, input, textarea, select, [role='menuitem']")
    ) {
      return;
    }

    openTask();
  }

  function handleCardKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (isOverlay || event.target !== event.currentTarget) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openTask();
    }
  }

  return (
    <>
      <article
        role={isOverlay ? undefined : "button"}
        tabIndex={isOverlay ? -1 : 0}
        onClick={handleCardClick}
        onKeyDown={handleCardKeyDown}
        aria-label={isOverlay ? undefined : `Open task ${task.title}`}
        className={[
          "group relative overflow-hidden rounded-xl border px-3.5 pb-3.5 pt-4",

          "transition-[background-color,border-color,opacity] duration-200",

          taskCardSurface,

          !isOverlay
            ? [
                "cursor-pointer",

                "focus-visible:outline-none",

                "focus-visible:ring-2",
                "focus-visible:ring-ring/20",

                "focus-visible:ring-offset-2",
                "focus-visible:ring-offset-background",
              ].join(" ")
            : "",

          isOverlay
            ? [
                "rotate-[1deg]",

                "border-ring/20",
                "bg-surface-2",

                "ring-1",
                "ring-ring/10",

                "dark:border-border",
                "dark:bg-surface-2",
              ].join(" ")
            : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {/* STATUS STROKE */}

        <span
          className={[
            "absolute left-3.5 top-0 h-[2px] w-8 rounded-full",

            "opacity-80",

            "dark:opacity-100",

            appearance.stroke,
          ].join(" ")}
        />

        {/* CONTENT */}

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h4 className="line-clamp-2 text-sm font-semibold leading-5 tracking-[-0.012em] text-foreground/85 dark:text-foreground">
              {task.title}
            </h4>

            {task.description && (
              <p className="mt-1.5 line-clamp-2 text-[0.69rem] leading-5 text-muted-foreground/90 dark:text-muted-foreground">
                {task.description}
              </p>
            )}
          </div>

          {!isOverlay && (
            <TaskMenu
              task={task}
              currentStatus={currentStatus}
              canManageTasks={canManageTasks}
              onOpenTask={openTask}
              onMoveTask={onMoveTask}
              onEditTask={onEditTask}
              onRequestDelete={
                onDeleteTask ? () => setDeleteDialogOpen(true) : undefined
              }
            />
          )}
        </div>

        {/* META */}

        <div
          className={[
            "mt-4 flex flex-wrap items-center justify-between gap-2 border-t pt-3",
            appearance.divider,
          ].join(" ")}
        >
          <DueDate dueDate={task.dueDate} isOverdue={overdue} />

          <div className="flex shrink-0 items-center gap-1.5">
            {overdue && <OverdueBadge />}

            <TaskStatus appearance={appearance} />
          </div>
        </div>
      </article>

      {!isOverlay && (
        <TaskDialog
          task={displayTask}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      )}

      {!isOverlay && onDeleteTask && (
        <DeleteTaskDialog
          task={task}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={onDeleteTask}
        />
      )}
    </>
  );
}

/* =========================================================
   TASK MENU
========================================================= */

function TaskMenu({
  task,
  currentStatus,
  canManageTasks,
  onOpenTask,
  onMoveTask,
  onEditTask,
  onRequestDelete,
}: {
  task: Task;
  currentStatus: WorkflowStatus;
  canManageTasks: boolean;
  onOpenTask: () => void;
  onMoveTask?: (taskId: string, status: WorkflowStatus) => void | Promise<void>;
  onEditTask?: (task: Task) => void;
  onRequestDelete?: () => void;
}) {
  const availableMoveStatuses = getAvailableMoveStatuses(currentStatus);

  const canMove =
    canManageTasks && Boolean(onMoveTask) && availableMoveStatuses.length > 0;

  const canEdit = canManageTasks && Boolean(onEditTask);

  const canDelete = canManageTasks && Boolean(onRequestDelete);

  const hasManagementActions = canMove || canEdit || canDelete;

  function stopPointer(event: PointerEvent<HTMLElement>) {
    event.stopPropagation();
  }

  function stopClick(event: MouseEvent<HTMLElement>) {
    event.stopPropagation();
  }

  return (
    <div
      onPointerDown={stopPointer}
      onClick={stopClick}
      className="relative z-10 shrink-0"
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={[
              "flex h-7 w-7 items-center justify-center rounded-md",

              "text-muted-foreground/55",
              "opacity-60",

              "transition-[background-color,color,opacity] duration-150",

              "hover:bg-surface-3/75",
              "hover:text-foreground/75",
              "hover:opacity-100",

              "group-hover:opacity-100",

              "focus-visible:outline-none",
              "focus-visible:ring-2",
              "focus-visible:ring-ring/20",

              "data-[state=open]:bg-surface-3/75",
              "data-[state=open]:text-foreground/80",
              "data-[state=open]:opacity-100",

              "dark:text-muted-foreground",
              "dark:opacity-80",

              "dark:hover:bg-surface-3",
              "dark:hover:text-foreground",

              "dark:data-[state=open]:bg-surface-3",
              "dark:data-[state=open]:text-foreground",
            ].join(" ")}
            aria-label={`Task options for ${task.title}`}
          >
            <EllipsisVerticalIcon size={14} />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={6}
          collisionPadding={12}
          className={[
            "w-48 rounded-xl",

            "border-border/60",
            "bg-popover",
            "p-1.5",

            "text-popover-foreground",

            "shadow-none",

            "dark:border-border",
          ].join(" ")}
        >
          <DropdownMenuItem
            className={taskMenuItemClass}
            onSelect={() => requestAnimationFrame(onOpenTask)}
          >
            <EyeIcon size={13} className="text-muted-foreground" />
            View task
          </DropdownMenuItem>

          {hasManagementActions && (
            <DropdownMenuSeparator className="bg-border/60 dark:bg-border" />
          )}

          {canEdit && (
            <DropdownMenuItem
              className={taskMenuItemClass}
              onSelect={() => onEditTask?.(task)}
            >
              <PencilIcon size={13} className="text-muted-foreground" />
              Edit task
            </DropdownMenuItem>
          )}

          {canMove && (
            <>
              <DropdownMenuLabel className="px-2.5 pb-1 pt-2 text-[0.52rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Move task
              </DropdownMenuLabel>

              {availableMoveStatuses.map((option) => {
                const Icon = option.icon;

                const optionAppearance = taskStatusAppearance[option.value];

                return (
                  <DropdownMenuItem
                    key={option.value}
                    className={taskMenuItemClass}
                    onSelect={() => void onMoveTask?.(task.id, option.value)}
                  >
                    <Icon size={13} className={optionAppearance.iconClass} />

                    {option.label}
                  </DropdownMenuItem>
                );
              })}
            </>
          )}

          {canDelete && (
            <>
              <DropdownMenuSeparator className="bg-border/60 dark:bg-border" />

              <DropdownMenuItem
                className={[
                  "rounded-lg px-2.5 py-2",

                  "text-[0.7rem] font-medium",

                  "text-destructive/85",

                  "focus:bg-destructive/[0.055]",
                  "focus:text-destructive",

                  "dark:text-status-overdue-foreground",

                  "dark:focus:bg-status-overdue/12",
                  "dark:focus:text-status-overdue-foreground",
                ].join(" ")}
                onSelect={() =>
                  requestAnimationFrame(() => onRequestDelete?.())
                }
              >
                <Trash2Icon size={13} />
                Delete task
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

/* =========================================================
   DUE DATE
========================================================= */

function DueDate({
  dueDate,
  isOverdue,
}: {
  dueDate?: string | Date | null;
  isOverdue: boolean;
}) {
  return (
    <span
      className={[
        "flex min-w-0 items-center gap-1.5",

        "text-[0.61rem] font-medium",

        isOverdue
          ? ["text-destructive/75", "dark:text-status-overdue-foreground"].join(
              " ",
            )
          : ["text-muted-foreground/85", "dark:text-muted-foreground"].join(
              " ",
            ),
      ].join(" ")}
    >
      <CalendarDaysIcon size={11} className="shrink-0" />

      <span className="truncate">
        {dueDate ? formatTaskDate(dueDate) : "No due date"}
      </span>
    </span>
  );
}

/* =========================================================
   STATUS
========================================================= */

function TaskStatus({ appearance }: { appearance: TaskStatusAppearance }) {
  const Icon = appearance.icon;

  return (
    <span
      className={[
        "inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1",

        "text-[0.57rem] font-semibold",

        appearance.badgeClass,
      ].join(" ")}
    >
      <Icon size={10} className={appearance.iconClass} />

      {appearance.label}
    </span>
  );
}

/* =========================================================
   OVERDUE
========================================================= */

function OverdueBadge() {
  return (
    <span
      className={[
        "inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1",

        "bg-destructive/[0.05]",

        "text-[0.57rem] font-semibold",
        "text-destructive/80",

        "dark:bg-status-overdue/[0.14]",
        "dark:text-status-overdue-foreground",

        "dark:ring-1",
        "dark:ring-inset",
        "dark:ring-status-overdue/15",
      ].join(" ")}
    >
      <TriangleAlertIcon size={10} />
      Overdue
    </span>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function getAvailableMoveStatuses(currentStatus: WorkflowStatus) {
  return taskStatusOptions.filter((option) => option.value !== currentStatus);
}

function getWorkflowStatus(task: Task): WorkflowStatus {
  const normalized = String(task.status ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]/g, "");

  if (normalized === "active") {
    return "active";
  }

  if (normalized === "complete" || normalized === "completed") {
    return "complete";
  }

  return "pending";
}

function isTaskPastDue(task: Task) {
  if (!task.dueDate) return false;

  const dueDate = new Date(task.dueDate);

  if (Number.isNaN(dueDate.getTime())) {
    return false;
  }

  return dueDate.getTime() < Date.now();
}

function formatTaskDate(value: string | Date) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "No due date";
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
  }).format(date);
}

export default TaskCard;
