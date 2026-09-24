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

type TaskStatus = "pending" | "active" | "complete" | "overdue";

type Props = {
  task: Task;
  isOverlay?: boolean;
  canManageTasks?: boolean;
  onMoveTask?: (taskId: string, status: TaskStatus) => void | Promise<void>;
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
};

type TaskStatusOption = {
  value: TaskStatus;
  label: string;
  icon: ComponentType<{
    size?: number;
    className?: string;
  }>;
};

const taskStatusAppearance: Record<TaskStatus, TaskStatusAppearance> = {
  pending: {
    label: "Pending",
    icon: CircleDashedIcon,
    iconClass: "text-chart-3",
    badgeClass: "bg-chart-3/[0.09] text-chart-3",
  },

  active: {
    label: "In progress",
    icon: CircleDotIcon,
    iconClass: "text-primary",
    badgeClass: "bg-primary/[0.08] text-primary",
  },

  complete: {
    label: "Complete",
    icon: CircleCheckBigIcon,
    iconClass: "text-chart-2",
    badgeClass: "bg-chart-2/[0.09] text-chart-2",
  },

  overdue: {
    label: "Overdue",
    icon: TriangleAlertIcon,
    iconClass: "text-destructive",
    badgeClass: "bg-destructive/[0.08] text-destructive",
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

  const currentStatus = getEffectiveTaskStatus(task);
  const statusAppearance = taskStatusAppearance[currentStatus];

  const displayTask: Task = {
    ...task,
    status: currentStatus,
  };

  function openTask() {
    if (!isOverlay) setDialogOpen(true);
  }

  function handleCardClick(event: MouseEvent<HTMLElement>) {
    if (isOverlay) return;

    const target = event.target as HTMLElement;

    if (target.closest("button, a, input, textarea, select, [role='menuitem']")) {
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
          "group relative overflow-hidden",
          "rounded-xl border border-border/80",
          "bg-background px-3.5 py-3.5",
          "transition-all duration-200",

          !isOverlay
            ? [
                "cursor-pointer",
                "focus-visible:outline-none",
                "focus-visible:ring-2",
                "focus-visible:ring-primary/30",
              ].join(" ")
            : "",

          isOverlay
            ? [
                "rotate-[1deg]",
                "border-primary/30",
                "shadow-xl shadow-black/[0.08]",
                "dark:shadow-black/30",
              ].join(" ")
            : [
                "hover:border-foreground/15",
                "hover:bg-muted/20",
                "hover:shadow-sm",
              ].join(" "),
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h4 className="line-clamp-2 text-sm font-semibold leading-5 tracking-[-0.01em]">
              {task.title}
            </h4>

            {task.description && (
              <p className="mt-1.5 line-clamp-2 text-[0.72rem] leading-5 text-muted-foreground">
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
              onRequestDelete={onDeleteTask ? () => setDeleteDialogOpen(true) : undefined}
            />
          )}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-border/70 pt-3">
          <DueDate
            dueDate={task.dueDate}
            isOverdue={currentStatus === "overdue"}
          />

          <TaskStatus appearance={statusAppearance} />
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
  currentStatus: TaskStatus;
  canManageTasks: boolean;
  onOpenTask: () => void;
  onMoveTask?: (taskId: string, status: TaskStatus) => void | Promise<void>;
  onEditTask?: (task: Task) => void;
  onRequestDelete?: () => void;
}) {
  const availableMoveStatuses = getAvailableMoveStatuses(currentStatus);

  const canMove =
    canManageTasks &&
    Boolean(onMoveTask) &&
    availableMoveStatuses.length > 0;

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
              "flex h-7 w-7 items-center justify-center",
              "rounded-md text-muted-foreground",
              "opacity-60 transition-all",
              "hover:bg-muted hover:text-foreground",
              "hover:opacity-100 group-hover:opacity-100",
              "focus-visible:outline-none",
              "focus-visible:ring-2",
              "focus-visible:ring-primary/30",
            ].join(" ")}
            aria-label={`Task options for ${task.title}`}
          >
            <EllipsisVerticalIcon size={15} />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={6}
          collisionPadding={12}
          className="w-52 rounded-xl p-1.5"
        >
          <DropdownMenuItem
            className="rounded-lg"
            onSelect={() => requestAnimationFrame(onOpenTask)}
          >
            <EyeIcon size={14} />
            View task
          </DropdownMenuItem>

          {hasManagementActions && <DropdownMenuSeparator />}

          {canEdit && (
            <DropdownMenuItem
              className="rounded-lg"
              onSelect={() => onEditTask?.(task)}
            >
              <PencilIcon size={14} />
              Edit task
            </DropdownMenuItem>
          )}

          {canMove && (
            <>
              <DropdownMenuLabel className="px-2 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Move task
              </DropdownMenuLabel>

              {availableMoveStatuses.map(option => {
                const Icon = option.icon;

                return (
                  <DropdownMenuItem
                    key={option.value}
                    className="rounded-lg"
                    onSelect={() => void onMoveTask?.(task.id, option.value)}
                  >
                    <Icon size={14} />
                    {option.label}
                  </DropdownMenuItem>
                );
              })}
            </>
          )}

          {canDelete && (
            <>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="rounded-lg text-destructive focus:bg-destructive/10 focus:text-destructive"
                onSelect={() => {
                  requestAnimationFrame(() => onRequestDelete?.());
                }}
              >
                <Trash2Icon size={14} />
                Delete task
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

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
        "text-[0.66rem] font-medium",
        isOverdue ? "text-destructive" : "text-muted-foreground",
      ].join(" ")}
    >
      <CalendarDaysIcon size={12} className="shrink-0" />

      <span className="truncate">
        {dueDate ? formatTaskDate(dueDate) : "No due date"}
      </span>
    </span>
  );
}

function TaskStatus({
  appearance,
}: {
  appearance: TaskStatusAppearance;
}) {
  const Icon = appearance.icon;

  return (
    <span
      className={[
        "inline-flex shrink-0 items-center gap-1.5",
        "rounded-md px-2 py-1",
        "text-[0.62rem] font-semibold",
        appearance.badgeClass,
      ].join(" ")}
    >
      <Icon size={11} className={appearance.iconClass} />
      {appearance.label}
    </span>
  );
}

function getAvailableMoveStatuses(currentStatus: TaskStatus) {
  if (currentStatus === "overdue") {
    return taskStatusOptions.filter(option => option.value === "complete");
  }

  return taskStatusOptions.filter(option => option.value !== currentStatus);
}

function getEffectiveTaskStatus(task: Task): TaskStatus {
  const status = normalizeTaskStatus(task.status);

  if (status === "complete") return "complete";
  if (isTaskPastDue(task)) return "overdue";

  return status;
}

function normalizeTaskStatus(status?: string): TaskStatus {
  const normalized = String(status ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]/g, "");

  if (normalized === "active") return "active";

  if (
    normalized === "complete" ||
    normalized === "completed"
  ) {
    return "complete";
  }

  if (normalized === "overdue") return "overdue";

  return "pending";
}

function isTaskPastDue(task: Task) {
  if (!task.dueDate) return false;

  const dueDate = new Date(task.dueDate);

  if (Number.isNaN(dueDate.getTime())) return false;

  return dueDate.getTime() < Date.now();
}

function formatTaskDate(value: string | Date) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "No due date";

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
  }).format(date);
}

export default TaskCard;