import {
  CircleDotIcon,
  ListTodoIcon,
  PlusIcon,
} from "lucide-react";

import {
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";

import type {
  Project,
} from "@/Types/project";

import type {
  Task,
} from "@/Types/task";

import CreateTaskDialog from "./CreateTaskDialogue";
import TaskCard from "./TaskCard";

type Status =
  | "pending"
  | "active"
  | "complete"
  | "overdue";

type Props = {
  status: Status;
  title: string;
  description: string;
  tasks?: Task[];
  project?: Project;
  onTaskCreated?: () => void;
  className?: string;
};

const statusAppearance: Record<
  Status,
  {
    dot: string;
    text: string;
    surface: string;
  }
> = {
  pending: {
    dot: "bg-amber-500",
    text:
      "text-amber-700 dark:text-amber-300",
    surface:
      "bg-amber-400/[0.045]",
  },

  active: {
    dot: "bg-primary",
    text: "text-primary",
    surface:
      "bg-primary/[0.04]",
  },

  complete: {
    dot: "bg-emerald-500",
    text:
      "text-emerald-700 dark:text-emerald-300",
    surface:
      "bg-emerald-400/[0.04]",
  },

  overdue: {
    dot: "bg-destructive",
    text: "text-destructive",
    surface:
      "bg-destructive/[0.035]",
  },
};

/* =========================================================
   DRAGGABLE TASK
========================================================= */

function DraggableTaskCard({
  task,
}: {
  task: Task;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } =
    useDraggable({
      id: task.id,

      data: {
        task,
      },
    });

  const style: React.CSSProperties =
    {
      transform: transform
        ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
        : undefined,

      opacity:
        isDragging
          ? 0
          : 1,
    };

  return (
    <div
      ref={
        setNodeRef
      }
      style={
        style
      }
      {...listeners}
      {...attributes}
      className={[
        "cursor-grab touch-none",
        "transition-opacity",
        "active:cursor-grabbing",
      ].join(" ")}
    >
      <TaskCard
        task={
          task
        }
      />
    </div>
  );
}

/* =========================================================
   STATUS BOARD
========================================================= */

function TaskStatusBoard({
  status,
  title,
  description,
  tasks = [],
  project,
  onTaskCreated,
  className,
}: Props) {
  const {
    setNodeRef,
    isOver,
  } =
    useDroppable({
      id: status,
    });

  const appearance =
    statusAppearance[
      status
    ];

  return (
    <section
      ref={
        setNodeRef
      }
      className={[
        "group flex w-full min-w-[236px] flex-col",
        "min-h-[240px]",
        "max-h-[calc(100vh-250px)]",
        "overflow-hidden rounded-[1.25rem]",
        "border border-border/80",
        "bg-background",
        "transition-all duration-200",

        isOver
          ? [
              "border-primary/35",
              "bg-primary/[0.025]",
              "ring-2 ring-primary/10",
            ].join(
              " ",
            )
          : "",

        className ??
          "",
      ].join(" ")}
    >
      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="shrink-0 px-4 pb-3 pt-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <span
              className={[
                "h-2 w-2 shrink-0 rounded-full",
                appearance.dot,
              ].join(
                " ",
              )}
            />

            <h3 className="truncate text-sm font-bold tracking-[-0.01em]">
              {title}
            </h3>

            <span
              className={[
                "inline-flex h-5 min-w-5 items-center justify-center rounded-md",
                "bg-muted px-1.5",
                "text-[0.62rem] font-semibold",
                "text-muted-foreground",
              ].join(
                " ",
              )}
            >
              {
                tasks.length
              }
            </span>
          </div>

          {project?.id && (
            <CreateTaskDialog
              projectId={
                project.id
              }
              onCreated={
                onTaskCreated
              }
              trigger={
                <button
                  type="button"
                  className={[
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                    "text-muted-foreground",
                    "transition-colors",
                    "hover:bg-muted hover:text-foreground",
                  ].join(
                    " ",
                  )}
                  aria-label={`Add task to ${title}`}
                >
                  <PlusIcon
                    size={
                      15
                    }
                  />
                </button>
              }
            />
          )}
        </div>

        {/* subtle lane identifier */}

        <div className="mt-3 h-px overflow-hidden bg-border/70">
          <div
            className={[
              "h-px w-10",
              appearance.dot,
            ].join(
              " ",
            )}
          />
        </div>
      </div>

      {/* ===================================================
          BODY
      =================================================== */}

      <div className="flex min-h-0 flex-1 flex-col px-3 pb-3">
        {tasks.length ===
        0 ? (
          <EmptyLane
            status={
              status
            }
            title={
              description
            }
            canCreate={
              Boolean(
                project?.id,
              )
            }
          />
        ) : (
          <div
            className={[
              "flex min-h-0 flex-1 flex-col gap-2.5",
              "overflow-y-auto pr-1",
              "scrollbar-thin",
            ].join(
              " ",
            )}
          >
            {tasks.map(
              (
                task,
              ) => (
                <DraggableTaskCard
                  key={
                    task.id
                  }
                  task={
                    task
                  }
                />
              ),
            )}

            {/* drop space */}

            <div
              className={[
                "min-h-10 rounded-xl",
                "border border-dashed border-transparent",
                "transition-all duration-200",

                isOver
                  ? "border-primary/20 bg-primary/[0.035]"
                  : "",
              ].join(
                " ",
              )}
            />
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
  title,
  canCreate,
}: {
  status: Status;
  title: string;
  canCreate: boolean;
}) {
  const appearance =
    statusAppearance[
      status
    ];

  return (
    <div
      className={[
        "flex min-h-[170px] flex-1 flex-col",
        "items-center justify-center",
        "rounded-xl border border-dashed border-border/70",
        "px-5 py-8 text-center",
        appearance.surface,
      ].join(" ")}
    >
      <span
        className={[
          "flex h-9 w-9 items-center justify-center rounded-lg",
          "bg-background/70",
          appearance.text,
        ].join(
          " ",
        )}
      >
        {status ===
        "active" ? (
          <CircleDotIcon
            size={
              17
            }
          />
        ) : (
          <ListTodoIcon
            size={
              17
            }
          />
        )}
      </span>

      <p className="mt-3 text-xs font-semibold">
        {title}
      </p>

      <p className="mt-1 max-w-[180px] text-[0.68rem] leading-5 text-muted-foreground">
        {canCreate
          ? "Create a task or move one here when its status changes."
          : "Tasks will appear here as the project progresses."}
      </p>
    </div>
  );
}

export default TaskStatusBoard;