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
  onMoveTask?: (
    taskId: string,
    status: WorkflowStatus,
  ) => void | Promise<void>;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (task: Task) => void | Promise<void>;
};

type TaskStatusAppearance = {
  label: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  iconClass: string;
  badgeClass: string;
  stroke: string;
  divider: string;
};

type TaskStatusOption = {
  value: WorkflowStatus;
  label: string;
  icon: ComponentType<{ size?: number; className?: string }>;
};

/* =========================================================
   SHARED CARD SURFACE
========================================================= */

const taskCardSurface = [
  "border-[#315E6C]/[0.09] bg-[#EDF3F1]",
  "hover:border-[#315E6C]/[0.13] hover:bg-[#EAF1EF]",
  "dark:border-white/[0.065] dark:bg-[#10262D]",
  "dark:hover:border-white/[0.095] dark:hover:bg-[#122A31]",
].join(" ");

/* =========================================================
   STATUS APPEARANCE
========================================================= */

const taskStatusAppearance: Record<WorkflowStatus, TaskStatusAppearance> = {
  pending: {
    label: "Pending",
    icon: CircleDashedIcon,
    iconClass: "text-[#956A34] dark:text-[#F0A23A]",
    badgeClass:
      "bg-[#E9DFD1] text-[#815C2E] dark:bg-[#F0A23A]/[0.10] dark:text-[#F0A23A]",
    stroke: "bg-[#B98645] dark:bg-[#F0A23A]",
    divider: "border-[#B98645]/[0.10] dark:border-[#F0A23A]/[0.08]",
  },

  active: {
    label: "In progress",
    icon: CircleDotIcon,
    iconClass: "text-[#315E6C] dark:text-[#DEDA00]",
    badgeClass:
      "bg-[#D7E5E1] text-[#315E6C] dark:bg-[#DEDA00]/[0.10] dark:text-[#DEDA00]",
    stroke: "bg-[#315E6C] dark:bg-[#DEDA00]",
    divider: "border-[#315E6C]/[0.09] dark:border-[#DEDA00]/[0.075]",
  },

  complete: {
    label: "Complete",
    icon: CircleCheckBigIcon,
    iconClass: "text-[#477A4F] dark:text-[#38D200]",
    badgeClass:
      "bg-[#DCE9DE] text-[#477A4F] dark:bg-[#38D200]/[0.10] dark:text-[#38D200]",
    stroke: "bg-[#568B5E] dark:bg-[#38D200]",
    divider: "border-[#568B5E]/[0.10] dark:border-[#38D200]/[0.075]",
  },
};

const taskStatusOptions: TaskStatusOption[] = [
  { value: "pending", label: "Pending", icon: CircleDashedIcon },
  { value: "active", label: "In progress", icon: CircleDotIcon },
  { value: "complete", label: "Complete", icon: CircleCheckBigIcon },
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
    if (!isOverlay) setDialogOpen(true);
  }

  function handleCardClick(event: MouseEvent<HTMLElement>) {
    if (isOverlay) return;

    const target = event.target as HTMLElement;

    if (
      target.closest(
        "button, a, input, textarea, select, [role='menuitem']",
      )
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
          "transition-[background-color,border-color,opacity,box-shadow] duration-200",
          taskCardSurface,

          !isOverlay
            ? [
                "cursor-pointer",
                "hover:shadow-[0_12px_30px_-28px_rgba(25,54,61,0.28)]",
                "focus-visible:outline-none",
                "focus-visible:ring-2 focus-visible:ring-[#315E6C]/20",
                "dark:hover:shadow-[0_14px_34px_-28px_rgba(0,0,0,0.65)]",
                "dark:focus-visible:ring-[#DEDA00]/20",
              ].join(" ")
            : "",

          isOverlay
            ? [
                "rotate-[1deg]",
                "border-[#315E6C]/20",
                "shadow-[0_20px_46px_-24px_rgba(19,44,51,0.38)]",
                "dark:border-[#DEDA00]/15",
                "dark:shadow-[0_20px_46px_-22px_rgba(0,0,0,0.72)]",
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
            appearance.stroke,
          ].join(" ")}
        />

        {/* CONTENT */}

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h4 className="line-clamp-2 text-sm font-semibold leading-5 tracking-[-0.012em] text-[#30383A] dark:text-[#F8FAFC]">
              {task.title}
            </h4>

            {task.description && (
              <p className="mt-1.5 line-clamp-2 text-[0.69rem] leading-5 text-[#647579] dark:text-[#94A3B8]">
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
                onDeleteTask
                  ? () => setDeleteDialogOpen(true)
                  : undefined
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
          <DueDate
            dueDate={task.dueDate}
            isOverdue={overdue}
          />

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
  onMoveTask?: (
    taskId: string,
    status: WorkflowStatus,
  ) => void | Promise<void>;
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
              "flex h-7 w-7 items-center justify-center rounded-md",
              "text-[#748286] opacity-55",
              "transition-[background-color,color,opacity] duration-150",
              "hover:bg-[#315E6C]/[0.07] hover:text-[#315E6C] hover:opacity-100",
              "group-hover:opacity-100",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315E6C]/20",
              "data-[state=open]:bg-[#315E6C]/[0.07] data-[state=open]:text-[#315E6C] data-[state=open]:opacity-100",
              "dark:text-[#94A3B8]/70 dark:hover:bg-white/[0.055] dark:hover:text-[#E2E8F0]",
              "dark:data-[state=open]:bg-white/[0.055] dark:data-[state=open]:text-white",
              "dark:focus-visible:ring-[#DEDA00]/20",
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
            "w-52 rounded-xl p-1.5",
            "border-[#315E6C]/[0.09] bg-[#F7F9F7] text-[#30383A]",
            "shadow-[0_16px_40px_-24px_rgba(25,52,59,0.30)]",
            "dark:border-white/[0.08] dark:bg-[#10262D] dark:text-[#E2E8F0]",
            "dark:shadow-[0_16px_40px_-22px_rgba(0,0,0,0.68)]",
          ].join(" ")}
        >
          <DropdownMenuItem
            className="rounded-lg focus:bg-[#E4ECE9] dark:focus:bg-white/[0.05]"
            onSelect={() => requestAnimationFrame(onOpenTask)}
          >
            <EyeIcon size={14} />
            View task
          </DropdownMenuItem>

          {hasManagementActions && (
            <DropdownMenuSeparator className="bg-[#315E6C]/[0.07] dark:bg-white/[0.07]" />
          )}

          {canEdit && (
            <DropdownMenuItem
              className="rounded-lg focus:bg-[#E4ECE9] dark:focus:bg-white/[0.05]"
              onSelect={() => onEditTask?.(task)}
            >
              <PencilIcon size={14} />
              Edit task
            </DropdownMenuItem>
          )}

          {canMove && (
            <>
              <DropdownMenuLabel className="px-2 py-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-[#748286] dark:text-[#94A3B8]">
                Move task
              </DropdownMenuLabel>

              {availableMoveStatuses.map(option => {
                const Icon = option.icon;
                const optionAppearance = taskStatusAppearance[option.value];

                return (
                  <DropdownMenuItem
                    key={option.value}
                    className="rounded-lg focus:bg-[#E4ECE9] dark:focus:bg-white/[0.05]"
                    onSelect={() =>
                      void onMoveTask?.(task.id, option.value)
                    }
                  >
                    <Icon
                      size={14}
                      className={optionAppearance.iconClass}
                    />

                    {option.label}
                  </DropdownMenuItem>
                );
              })}
            </>
          )}

          {canDelete && (
            <>
              <DropdownMenuSeparator className="bg-[#315E6C]/[0.07] dark:bg-white/[0.07]" />

              <DropdownMenuItem
                className={[
                  "rounded-lg text-[#9F3C1A]",
                  "focus:bg-[#AD3A12]/[0.07] focus:text-[#9F3C1A]",
                  "dark:text-[#D98A6D]",
                  "dark:focus:bg-[#AD3A12]/[0.12] dark:focus:text-[#E69B80]",
                ].join(" ")}
                onSelect={() =>
                  requestAnimationFrame(() => onRequestDelete?.())
                }
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
        "flex min-w-0 items-center gap-1.5 text-[0.61rem] font-medium",
        isOverdue
          ? "text-[#9F3C1A] dark:text-[#D98A6D]"
          : "text-[#748286] dark:text-[#94A3B8]",
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

function TaskStatus({
  appearance,
}: {
  appearance: TaskStatusAppearance;
}) {
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
        "bg-[#EFE0DA] text-[0.57rem] font-semibold text-[#9F3C1A]",
        "dark:bg-[#AD3A12]/[0.14] dark:text-[#D98A6D]",
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
  return taskStatusOptions.filter(
    option => option.value !== currentStatus,
  );
}

function getWorkflowStatus(task: Task): WorkflowStatus {
  const normalized = String(task.status ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]/g, "");

  if (normalized === "active") return "active";

  if (normalized === "complete" || normalized === "completed") {
    return "complete";
  }

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