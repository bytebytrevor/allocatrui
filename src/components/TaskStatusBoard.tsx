import {
  CircleDotIcon,
  ListTodoIcon,
  PlusIcon,
} from "lucide-react";

import { useDroppable } from "@dnd-kit/core";

import type { Project } from "@/Types/project";
import type { Task } from "@/Types/task";

import CreateTaskDialog from "./CreateTaskDialogue";
import { DraggableTask } from "./DraggableTask";

type Status = "pending" | "active" | "complete" | "overdue";

type Props = {
  status: Status;
  title: string;
  description: string;
  tasks?: Task[];
  project?: Project;
  onTaskCreated?: () => void;
  canManageTasks?: boolean;
  className?: string;
  onTaskMove?: (taskId: string, status: Status) => void | Promise<void>;
  onTaskEdit?: (task: Task) => void;
  onTaskDelete?: (task: Task) => void;
};

type StatusAppearance = {
  dot: string;
  text: string;
  line: string;
  surface: string;
};

const statusAppearance: Record<Status, StatusAppearance> = {
  pending: {
    dot: "bg-[#B98645] dark:bg-[#F0A23A]",
    text: "text-[#8A632F] dark:text-[#F0A23A]",
    line: "bg-[#B98645] dark:bg-[#F0A23A]",
    surface: "bg-[#B98645]/[0.035] dark:bg-[#F0A23A]/[0.025]",
  },

  active: {
    dot: "bg-[#315E6C] dark:bg-[#DEDA00]",
    text: "text-[#315E6C] dark:text-[#DEDA00]",
    line: "bg-[#315E6C] dark:bg-[#DEDA00]",
    surface: "bg-[#315E6C]/[0.025] dark:bg-[#DEDA00]/[0.02]",
  },

  complete: {
    dot: "bg-[#568B5E] dark:bg-[#38D200]",
    text: "text-[#477A4F] dark:text-[#38D200]",
    line: "bg-[#568B5E] dark:bg-[#38D200]",
    surface: "bg-[#568B5E]/[0.035] dark:bg-[#38D200]/[0.02]",
  },

  overdue: {
    dot: "bg-[#AD3A12]",
    text: "text-[#9F3C1A] dark:text-[#D27857]",
    line: "bg-[#AD3A12]",
    surface: "bg-[#AD3A12]/[0.025]",
  },
};

const emptyLaneMessages: Record<
  Status,
  {
    manage: string;
    view: string;
  }
> = {
  pending: {
    manage: "Create a task or move one here.",
    view: "Pending tasks will appear here.",
  },

  active: {
    manage: "Move tasks in progress here.",
    view: "Tasks in progress will appear here.",
  },

  complete: {
    manage: "Move completed tasks here.",
    view: "Completed tasks will appear here.",
  },

  overdue: {
    manage: "Overdue tasks will appear here.",
    view: "Overdue tasks will appear here.",
  },
};

function TaskStatusBoard({
  status,
  title,
  description,
  tasks = [],
  project,
  onTaskCreated,
  canManageTasks = false,
  className,
  onTaskMove,
  onTaskEdit,
  onTaskDelete,
}: Props) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    disabled: !canManageTasks,
  });

  const appearance = statusAppearance[status];
  const canCreateTask = canManageTasks && Boolean(project?.id);

  return (
    <section
      ref={setNodeRef}
      className={[
        "group relative flex min-h-[240px] w-full min-w-[236px] flex-col overflow-hidden",
        "max-h-[calc(100vh-250px)] rounded-[1.2rem] border",
        "border-border/80 bg-background",
        "transition-[background-color,border-color,box-shadow] duration-200",
        canManageTasks && isOver
          ? [
              "border-[#315E6C]/20 bg-[#315E6C]/[0.015]",
              "ring-2 ring-[#315E6C]/[0.05]",
              "dark:border-[#DEDA00]/15 dark:bg-[#DEDA00]/[0.012]",
              "dark:ring-[#DEDA00]/[0.045]",
            ].join(" ")
          : "",
        className ?? "",
      ].join(" ")}
    >
      <span
        className={[
          "absolute left-4 top-0 h-[2px] w-10 rounded-full",
          appearance.line,
        ].join(" ")}
      />

      <div className="shrink-0 px-4 pb-3 pt-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <span
              className={[
                "h-1.5 w-1.5 shrink-0 rounded-full",
                appearance.dot,
              ].join(" ")}
            />

            <h3 className="truncate text-sm font-semibold tracking-[-0.01em] text-foreground">
              {title}
            </h3>

            <span
              className={[
                "inline-flex h-5 min-w-5 items-center justify-center rounded-md",
                "bg-muted px-1.5",
                "text-[0.6rem] font-semibold text-muted-foreground",
              ].join(" ")}
            >
              {tasks.length}
            </span>
          </div>

          {canCreateTask && project?.id && (
            <CreateTaskDialog
              projectId={project.id}
              onCreated={onTaskCreated}
              trigger={
                <button
                  type="button"
                  className={[
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                    "text-muted-foreground transition-colors",
                    "hover:bg-muted hover:text-[#315E6C]",
                    "dark:hover:text-[#DEDA00]",
                  ].join(" ")}
                  aria-label={`Add task to ${title}`}
                >
                  <PlusIcon size={14} />
                </button>
              }
            />
          )}
        </div>

        <div className="mt-3 h-px overflow-hidden bg-border/70">
          <div
            className={[
              "h-px w-10",
              appearance.line,
            ].join(" ")}
          />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-3 pb-3">
        {tasks.length === 0 ? (
          <EmptyLane
            status={status}
            emptyTitle={description}
            canManageTasks={canManageTasks}
          />
        ) : (
          <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto pr-1 scrollbar-thin">
            {tasks.map(task => (
              <DraggableTask
                key={task.id}
                task={task}
                disabled={!canManageTasks}
                onMoveTask={onTaskMove}
                onEditTask={onTaskEdit}
                onDeleteTask={onTaskDelete}
              />
            ))}

            {canManageTasks && (
              <div
                className={[
                  "min-h-10 rounded-xl border border-dashed border-transparent",
                  "transition-[background-color,border-color] duration-200",
                  isOver
                    ? "border-[#315E6C]/15 bg-[#315E6C]/[0.02] dark:border-[#DEDA00]/15 dark:bg-[#DEDA00]/[0.015]"
                    : "",
                ].join(" ")}
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/* =========================================================
   EMPTY LANE
========================================================= */

function EmptyLane({
  status,
  emptyTitle,
  canManageTasks,
}: {
  status: Status;
  emptyTitle: string;
  canManageTasks: boolean;
}) {
  const appearance = statusAppearance[status];

  const message = canManageTasks
    ? emptyLaneMessages[status].manage
    : emptyLaneMessages[status].view;

  return (
    <div
      className={[
        "flex min-h-[170px] flex-1 flex-col items-center justify-center",
        "rounded-xl border border-dashed border-border/70",
        "px-5 py-8 text-center",
        appearance.surface,
      ].join(" ")}
    >
      <span
        className={[
          "flex h-9 w-9 items-center justify-center rounded-lg",
          "bg-background/75",
          appearance.text,
        ].join(" ")}
      >
        {status === "active" ? (
          <CircleDotIcon size={16} />
        ) : (
          <ListTodoIcon size={16} />
        )}
      </span>

      <p className="mt-3 text-xs font-semibold text-foreground">
        {emptyTitle}
      </p>

      <p className="mt-1 max-w-[190px] text-[0.66rem] leading-5 text-muted-foreground">
        {message}
      </p>
    </div>
  );
}

export default TaskStatusBoard;