import { useEffect, useMemo, useState, type ComponentType } from "react";
import { Link, useParams } from "react-router-dom";

import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  CopyIcon,
  EyeIcon,
  FolderOpenIcon,
  PlusIcon,
  TriangleAlertIcon,
} from "lucide-react";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";

import { toast } from "sonner";

import api from "@/api/axios";

import type { Project } from "@/Types/project";
import type { Task } from "@/Types/task";

import LoadingState from "./LoadingState";
import TaskCard from "./TaskCard";
import TaskStatusBoard from "./TaskStatusBoard";

import { Button } from "./ui/button";

/* =========================================================
   TYPES
========================================================= */

const WORKFLOW_STATUSES = ["pending", "active", "complete"] as const;

type WorkflowStatus = (typeof WORKFLOW_STATUSES)[number];

type ProjectPermissions = {
  isOwner: boolean;
  isAcceptedAllocat: boolean;
  canManageTasks: boolean;
};

type UpdateTaskStatusResult = {
  task: Task;
  project: Project;
};

type ProjectStatusAppearance = {
  label: string;
  dot: string;
  text: string;
  surface: string;
};

/* =========================================================
   PROJECT STATUS
========================================================= */

const projectStatusAppearance: Record<string, ProjectStatusAppearance> = {
  pending: {
    label: "Pending",
    dot: "bg-status-pending",
    text: "text-status-pending-foreground",
    surface: "bg-status-pending/[0.08] dark:bg-status-pending/[0.11]",
  },

  active: {
    label: "Active",
    dot: "bg-status-active",
    text: "text-status-active-foreground",
    surface: "bg-status-active/[0.07] dark:bg-status-active/[0.09]",
  },

  completionrequested: {
    label: "Awaiting confirmation",
    dot: "bg-status-pending",
    text: "text-status-pending-foreground",
    surface: "bg-status-pending/[0.08] dark:bg-status-pending/[0.11]",
  },

  paused: {
    label: "Paused",
    dot: "bg-muted-foreground/65",
    text: "text-muted-foreground",
    surface: "bg-muted/60 dark:bg-surface-3/55",
  },

  onhold: {
    label: "On hold",
    dot: "bg-muted-foreground/65",
    text: "text-muted-foreground",
    surface: "bg-muted/60 dark:bg-surface-3/55",
  },

  complete: {
    label: "Completed",
    dot: "bg-status-complete",
    text: "text-status-complete-foreground",
    surface: "bg-status-complete/[0.07] dark:bg-status-complete/[0.10]",
  },

  completed: {
    label: "Completed",
    dot: "bg-status-complete",
    text: "text-status-complete-foreground",
    surface: "bg-status-complete/[0.07] dark:bg-status-complete/[0.10]",
  },

  closed: {
    label: "Completed",
    dot: "bg-status-complete",
    text: "text-status-complete-foreground",
    surface: "bg-status-complete/[0.07] dark:bg-status-complete/[0.10]",
  },

  cancelled: {
    label: "Cancelled",
    dot: "bg-status-overdue",
    text: "text-status-overdue-foreground",
    surface: "bg-status-overdue/[0.06] dark:bg-status-overdue/[0.10]",
  },

  canceled: {
    label: "Cancelled",
    dot: "bg-status-overdue",
    text: "text-status-overdue-foreground",
    surface: "bg-status-overdue/[0.06] dark:bg-status-overdue/[0.10]",
  },
};

/* =========================================================
   PROJECT MANAGER
========================================================= */

function ProjectManager() {
  const { projectId } = useParams();

  const [project, setProject] = useState<Project>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [permissions, setPermissions] = useState<ProjectPermissions>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  const canManageTasks = permissions?.canManageTasks === true;

  /* =======================================================
     TASK HELPERS
  ======================================================= */

  function isWorkflowStatus(value: unknown): value is WorkflowStatus {
    return (
      typeof value === "string" &&
      (WORKFLOW_STATUSES as readonly string[]).includes(value)
    );
  }

  function getWorkflowStatus(task: Task): WorkflowStatus {
    const status = String(task.status ?? "")
      .trim()
      .toLowerCase()
      .replace(/[\s_-]/g, "");

    if (status === "complete" || status === "completed") {
      return "complete";
    }

    if (status === "active") {
      return "active";
    }

    return "pending";
  }

  function isTaskOverdue(task: Task) {
    if (getWorkflowStatus(task) === "complete" || !task.dueDate) {
      return false;
    }

    const dueDate = new Date(task.dueDate);

    if (Number.isNaN(dueDate.getTime())) {
      return false;
    }

    return dueDate.getTime() < Date.now();
  }

  /* =======================================================
     REFRESH
  ======================================================= */

  async function refreshProject() {
    if (!projectId) return;

    const response = await api.get<Project>(`/projects/${projectId}`, {
      withCredentials: true,
    });

    setProject(response.data);
  }

  async function refreshTasks() {
    if (!projectId) return;

    const response = await api.get<Task[]>(`/projects/tasks/${projectId}`, {
      withCredentials: true,
    });

    setTasks(Array.isArray(response.data) ? response.data : []);
  }

  async function handleTaskCreated() {
    try {
      await Promise.all([refreshTasks(), refreshProject()]);
    } catch (error) {
      console.error("Could not refresh workspace after creating task:", error);

      toast.error(
        "The task was created, but the workspace could not be refreshed.",
      );
    }
  }

  /* =======================================================
     LOAD WORKSPACE
  ======================================================= */

  useEffect(() => {
    if (!projectId) return;

    let cancelled = false;

    async function loadWorkspace() {
      try {
        setLoading(true);
        setError(null);

        const [projectResponse, tasksResponse, permissionsResponse] =
          await Promise.all([
            api.get<Project>(`/projects/${projectId}`, {
              withCredentials: true,
            }),
            api.get<Task[]>(`/projects/tasks/${projectId}`, {
              withCredentials: true,
            }),
            api.get<ProjectPermissions>(`/projects/${projectId}/permissions`, {
              withCredentials: true,
            }),
          ]);

        if (cancelled) return;

        setProject(projectResponse.data);
        setTasks(Array.isArray(tasksResponse.data) ? tasksResponse.data : []);
        setPermissions(permissionsResponse.data);
      } catch (err: unknown) {
        if (cancelled) return;

        setError(
          err instanceof Error
            ? err
            : new Error("Could not load project workspace."),
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadWorkspace();

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  /* =======================================================
     UPDATE TASK STATUS
  ======================================================= */

  async function updateTaskStatus(taskId: string, status: WorkflowStatus) {
    const response = await api.patch<UpdateTaskStatusResult>(
      `/projects/tasks/task/${taskId}/status`,
      { status },
      { withCredentials: true },
    );

    return response.data;
  }

  /* =======================================================
     MOVE TASK
  ======================================================= */

  async function moveTask(taskId: string, newStatus: WorkflowStatus) {
    if (!canManageTasks) return;

    const currentTask = tasks.find((task) => task.id === taskId);

    if (!currentTask) return;

    const currentStatus = getWorkflowStatus(currentTask);

    if (currentStatus === newStatus) return;

    const previousTasks = tasks;

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task,
      ),
    );

    try {
      const result = await updateTaskStatus(taskId, newStatus);

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === taskId ? { ...task, ...result.task } : task,
        ),
      );

      setProject(result.project);
    } catch (error) {
      setTasks(previousTasks);

      console.error("Could not move task:", error);

      toast.error("Task could not be moved.", {
        description:
          "Your task permissions may have changed. Refresh the workspace and try again.",
      });
    }
  }

  /* =======================================================
     DELETE TASK
  ======================================================= */

  async function deleteTask(task: Task) {
    if (!canManageTasks) return;

    const previousTasks = tasks;

    setTasks((currentTasks) =>
      currentTasks.filter((currentTask) => currentTask.id !== task.id),
    );

    try {
      await api.delete(`/projects/tasks/task/${task.id}`, {
        withCredentials: true,
      });

      toast.success("Task deleted.", {
        id: `task-delete-${task.id}`,
      });

      await refreshProject();
    } catch (error) {
      setTasks(previousTasks);

      console.error("Could not delete task:", error);

      toast.error("Task could not be deleted.", {
        id: `task-delete-${task.id}`,
      });

      throw error;
    }
  }

  /* =======================================================
     COPY PROJECT ID
  ======================================================= */

  async function copyProjectCode() {
    if (!project?.projectCode) return;

    try {
      await navigator.clipboard.writeText(project.projectCode);

      toast.success("Project ID copied.");
    } catch (error) {
      console.error("Could not copy project ID:", error);

      toast.error("Project ID could not be copied.");
    }
  }

  /* =======================================================
     ACTIVE TASK
  ======================================================= */

  const activeTask = useMemo(() => {
    if (!activeTaskId || !canManageTasks) return null;

    return tasks.find((task) => task.id === activeTaskId) ?? null;
  }, [activeTaskId, canManageTasks, tasks]);

  /* =======================================================
     DRAG
  ======================================================= */

  function handleDragStart(event: DragStartEvent) {
    if (!canManageTasks) return;

    setActiveTaskId(String(event.active.id));
  }

  function handleDragCancel() {
    setActiveTaskId(null);
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveTaskId(null);

    if (!canManageTasks || !event.over) return;
    if (!isWorkflowStatus(event.over.id)) return;

    await moveTask(String(event.active.id), event.over.id);
  }

  /* =======================================================
     LOADING / ERROR
  ======================================================= */

  if (loading) {
    return (
      <LoadingState label="Loading your workspace" className="min-h-[420px]" />
    );
  }

  if (error || !project || !permissions) {
    return <ProjectManagerError />;
  }

  /* =======================================================
     TASK GROUPS
  ======================================================= */

  const pendingTaskList = tasks.filter(
    (task) => getWorkflowStatus(task) === "pending",
  );

  const activeTaskList = tasks.filter(
    (task) => getWorkflowStatus(task) === "active",
  );

  const completedTaskList = tasks.filter(
    (task) => getWorkflowStatus(task) === "complete",
  );

  const overdueTaskCount = tasks.filter(isTaskOverdue).length;

  const progress = Math.min(
    100,
    Math.max(0, Math.round(project.progress ?? 0)),
  );

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="flex min-h-0 flex-1 flex-col pb-5">
      {/* ===================================================
          PROJECT HEADER
      =================================================== */}

      <section className="border-b border-border/50 pb-5 dark:border-border">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0">
            <div className="flex items-start gap-4">
              <span
                className={[
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",

                  "bg-surface-3/80",
                  "text-brand-secondary-highlight",

                  "dark:bg-surface-2",
                  "dark:text-brand-secondary-highlight",

                  "dark:ring-1",
                  "dark:ring-inset",
                  "dark:ring-border",
                ].join(" ")}
              >
                <FolderOpenIcon size={18} />
              </span>

              <div className="min-w-0 pt-0.5">
                <p className="text-[0.56rem] font-semibold uppercase tracking-[0.17em] text-muted-foreground">
                  Project workspace
                </p>

                <h1
                  className={[
                    "mt-1.5 max-w-4xl break-words",
                    "text-2xl font-semibold leading-[1.08] tracking-[-0.03em]",
                    "text-foreground/90 sm:text-3xl lg:text-[2rem]",
                    "dark:text-foreground",
                  ].join(" ")}
                >
                  {project.title}
                </h1>

                {project.projectCode && (
                  <button
                    type="button"
                    onClick={() => void copyProjectCode()}
                    className={[
                      "group mt-2 inline-flex items-center gap-1.5 rounded-md",

                      "text-[0.64rem] font-medium",
                      "text-muted-foreground",

                      "transition-colors",

                      "hover:text-foreground/80",
                      "dark:hover:text-foreground",
                    ].join(" ")}
                    title={`Copy ${project.projectCode}`}
                  >
                    <span>{getProjectDisplayCode(project.projectCode)}</span>

                    <CopyIcon
                      size={11}
                      className="opacity-50 transition-opacity group-hover:opacity-90"
                    />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ACTIONS */}

          <div className="flex shrink-0 flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              className={[
                "h-10 rounded-lg px-4 text-xs font-semibold shadow-none",

                "border-border/70",
                "bg-surface-2/35",
                "text-muted-foreground",

                "hover:border-border",
                "hover:bg-surface-3/70",
                "hover:text-foreground/85",

                "dark:border-border",
                "dark:bg-surface-2",
                "dark:text-foreground/80",

                "dark:hover:bg-surface-3",
                "dark:hover:text-foreground",
              ].join(" ")}
            >
              <EyeIcon size={14} />
              View details
            </Button>

            <Button
              asChild
              className={[
                "h-10 rounded-lg px-4 text-xs font-semibold shadow-none",

                "bg-brand-secondary-highlight",
                "text-primary-foreground",

                "hover:bg-brand-secondary-highlight/90",

                "dark:bg-secondary",
                "dark:text-secondary-foreground",

                "dark:hover:bg-secondary/90",
                "dark:hover:text-secondary-foreground",
              ].join(" ")}
            >
              <Link to="/projects/new">
                <PlusIcon size={14} />
                New project
              </Link>
            </Button>
          </div>
        </div>

        {/* =================================================
            PROJECT SUMMARY
        ================================================= */}

        <div
          className={[
            "mt-6 overflow-hidden rounded-xl border",

            "border-border/55",
            "bg-surface-2/65",

            "dark:border-border",
            "dark:bg-card",
          ].join(" ")}
        >
          <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(430px,0.78fr)] xl:grid-cols-[minmax(0,1fr)_470px]">
            {/* =============================================
                PROGRESS
            ============================================= */}

            <div className="min-w-0 px-5 py-5 sm:px-6">
              <div className="max-w-[420px]">
                <div className="flex items-end justify-between gap-5">
                  <div className="min-w-0">
                    <p className="text-[0.55rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                      Project progress
                    </p>

                    <p className="mt-1.5 text-sm font-semibold tracking-[-0.015em] text-foreground/80 dark:text-foreground/90">
                      {completedTaskList.length}/{tasks.length} tasks complete
                    </p>
                  </div>

                  <span className="shrink-0 text-lg font-semibold tabular-nums tracking-[-0.03em] text-brand-secondary-highlight/90 dark:text-secondary">
                    {progress}%
                  </span>
                </div>

                <div
                  className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted/80 dark:bg-surface-3"
                  role="progressbar"
                  aria-label="Project progress"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={progress}
                >
                  <div
                    className="h-full rounded-full bg-brand-secondary-highlight/85 transition-[width] duration-500 ease-out dark:bg-secondary"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* =============================================
                PROJECT META
            ============================================= */}

            <div
              className={[
                "grid grid-cols-1 border-t border-border/55",

                "bg-surface-3/30",

                "sm:grid-cols-3",

                "lg:border-l lg:border-t-0",

                "dark:border-border",
                "dark:bg-surface-2",
              ].join(" ")}
            >
              <ProjectSummaryItem
                label="Status"
                value={project.status || "Pending"}
                tone="status"
              />

              <ProjectSummaryItem
                label="Priority"
                value={project.priority || "Standard"}
              />

              <ProjectSummaryItem
                label="Due"
                value={formatDate(project.dueDate)}
                icon={CalendarDaysIcon}
                preserveValue
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          TASK BOARD HEADER
      =================================================== */}

      <section className="flex flex-col gap-4 pb-4 pt-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <p className="text-[0.56rem] font-semibold uppercase tracking-[0.17em] text-brand-secondary-highlight dark:text-secondary/90">
              Task board
            </p>

            {!canManageTasks && (
              <span className="flex items-center gap-1 text-[0.6rem] font-medium text-muted-foreground">
                <EyeIcon size={10} />
                Client view
              </span>
            )}
          </div>

          <h2 className="mt-1.5 text-xl font-semibold tracking-[-0.025em] text-foreground/90 dark:text-foreground">
            Work in motion
          </h2>

          <p className="mt-1 text-[0.68rem] leading-5 text-muted-foreground">
            {canManageTasks
              ? "Move work from pending through completion."
              : "Track progress and comment on tasks."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-[0.65rem] text-muted-foreground">
          <span>{tasks.length} tasks</span>

          <SummaryDivider />

          <span>{activeTaskList.length} in progress</span>

          {overdueTaskCount > 0 && (
            <>
              <SummaryDivider />

              <span className="inline-flex items-center gap-1 font-semibold text-destructive dark:text-status-overdue-foreground">
                <TriangleAlertIcon size={11} />
                {overdueTaskCount} overdue
              </span>
            </>
          )}
        </div>
      </section>

      {/* ===================================================
          TASK BOARD
      =================================================== */}

      <DndContext
        sensors={canManageTasks ? sensors : []}
        onDragStart={canManageTasks ? handleDragStart : undefined}
        onDragEnd={canManageTasks ? handleDragEnd : undefined}
        onDragCancel={handleDragCancel}
      >
        <section
          className={[
            "grid min-h-0 grid-flow-col items-start gap-4 overflow-x-auto pb-4",
            "auto-cols-[minmax(280px,1fr)]",
            "lg:grid-flow-row lg:auto-cols-auto lg:grid-cols-3 lg:overflow-visible",
          ].join(" ")}
        >
          <TaskStatusBoard
            status="pending"
            title="Pending"
            description="No pending tasks"
            tasks={pendingTaskList}
            project={project}
            onTaskCreated={handleTaskCreated}
            canManageTasks={canManageTasks}
            onTaskMove={moveTask}
            onTaskDelete={deleteTask}
            className={getTaskBoardClassName(pendingTaskList.length)}
          />

          <TaskStatusBoard
            status="active"
            title="In progress"
            description="No active tasks"
            tasks={activeTaskList}
            project={project}
            onTaskCreated={handleTaskCreated}
            canManageTasks={canManageTasks}
            onTaskMove={moveTask}
            onTaskDelete={deleteTask}
            className={getTaskBoardClassName(activeTaskList.length)}
          />

          <TaskStatusBoard
            status="complete"
            title="Complete"
            description="No completed tasks"
            tasks={completedTaskList}
            project={project}
            onTaskCreated={handleTaskCreated}
            canManageTasks={canManageTasks}
            onTaskMove={moveTask}
            onTaskDelete={deleteTask}
            className={getTaskBoardClassName(completedTaskList.length)}
          />
        </section>

        {canManageTasks && (
          <DragOverlay>
            {activeTask ? (
              <div className="w-[280px] rotate-[1deg] opacity-95">
                <TaskCard task={activeTask} isOverlay />
              </div>
            ) : null}
          </DragOverlay>
        )}
      </DndContext>
    </div>
  );
}

/* =========================================================
   PROJECT SUMMARY ITEM
========================================================= */

function ProjectSummaryItem({
  label,
  value,
  icon: Icon,
  tone,
  preserveValue = false,
}: {
  label: string;
  value: string;
  icon?: ComponentType<{
    size?: number;
    className?: string;
  }>;
  tone?: "status";
  preserveValue?: boolean;
}) {
  const statusAppearance =
    tone === "status" ? getProjectStatusAppearance(value) : null;

  return (
    <div
      className={[
        "min-w-0 px-4 py-4 sm:px-4 sm:py-5",

        "border-t border-border/50 first:border-t-0",

        "sm:border-l sm:border-t-0 sm:first:border-l-0",

        "dark:border-border",
      ].join(" ")}
    >
      <p className="text-[0.53rem] font-semibold uppercase tracking-[0.13em] text-muted-foreground">
        {label}
      </p>

      {statusAppearance ? (
        <div
          className={[
            "mt-1.5 inline-flex max-w-full items-center gap-1.5 rounded-md",
            "px-2 py-1",

            statusAppearance.surface,
          ].join(" ")}
        >
          <span
            className={[
              "h-1.5 w-1.5 shrink-0 rounded-full",
              statusAppearance.dot,
            ].join(" ")}
          />

          <span
            className={[
              "min-w-0 text-[0.68rem] font-semibold leading-4",
              statusAppearance.text,
            ].join(" ")}
          >
            {statusAppearance.label}
          </span>
        </div>
      ) : (
        <div className="mt-1.5 flex min-w-0 items-start gap-1.5">
          {Icon && (
            <Icon size={11} className="mt-0.5 shrink-0 text-muted-foreground" />
          )}

          <p
            className={[
              "min-w-0 text-xs font-semibold capitalize leading-5",
              "text-foreground/75 dark:text-foreground/90",

              preserveValue ? "whitespace-nowrap" : "break-words",
            ].join(" ")}
          >
            {value}
          </p>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   SUMMARY DIVIDER
========================================================= */

function SummaryDivider() {
  return (
    <span className="h-0.5 w-0.5 rounded-full bg-muted-foreground/40 dark:bg-muted-foreground/65" />
  );
}

/* =========================================================
   ERROR
========================================================= */

function ProjectManagerError() {
  return (
    <div className="flex min-h-[420px] items-center justify-center">
      <div className="max-w-md text-center">
        <span
          className={[
            "mx-auto flex h-11 w-11 items-center justify-center rounded-xl",

            "bg-surface-3/80",
            "text-muted-foreground",

            "dark:bg-surface-2",
            "dark:text-brand-secondary-highlight",

            "dark:ring-1",
            "dark:ring-inset",
            "dark:ring-border",
          ].join(" ")}
        >
          <FolderOpenIcon size={18} />
        </span>

        <h2 className="mt-5 text-lg font-semibold tracking-[-0.02em] text-foreground/90 dark:text-foreground">
          Could not load project
        </h2>

        <p className="mt-2 text-sm leading-7 text-muted-foreground">
          Something interrupted the project workspace while it was loading.
        </p>

        <Button
          asChild
          variant="outline"
          className={[
            "mt-6 h-10 rounded-lg px-5 text-xs font-semibold shadow-none",

            "border-border/70",
            "bg-surface-2/30",
            "text-foreground/75",

            "hover:bg-surface-3/60",
            "hover:text-foreground",

            "dark:border-border",
            "dark:bg-surface-2",
            "dark:text-foreground/85",

            "dark:hover:bg-surface-3",
            "dark:hover:text-foreground",
          ].join(" ")}
        >
          <Link to="/projects">
            <ArrowLeftIcon size={13} />
            Back to projects
          </Link>
        </Button>
      </div>
    </div>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function getProjectStatusAppearance(status?: string) {
  const normalized = normalizeProjectStatus(status);

  return (
    projectStatusAppearance[normalized] ?? {
      label: formatProjectStatus(status),
      dot: "bg-muted-foreground/65",
      text: "text-muted-foreground",
      surface: "bg-muted/60 dark:bg-surface-3/55",
    }
  );
}

function normalizeProjectStatus(status?: string) {
  return String(status ?? "")
    .toLowerCase()
    .replace(/[\s_-]/g, "");
}

function formatProjectStatus(status?: string) {
  if (!status?.trim()) return "Unknown";

  return status
    .trim()
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getTaskBoardClassName(taskCount: number) {
  return ["min-w-0", taskCount === 0 ? "h-auto! min-h-0! self-start" : ""].join(
    " ",
  );
}

function getProjectDisplayCode(value: string) {
  const code = value.trim();

  if (!code) return "";

  const cleanCode = code.startsWith("#") ? code.slice(1) : code;

  if (cleanCode.length <= 10) {
    return `#${cleanCode}`;
  }

  if (cleanCode.toUpperCase().startsWith("PRJ-")) {
    return `#${cleanCode.slice(0, 9)}`;
  }

  return `#${cleanCode.slice(0, 8)}`;
}

function formatDate(value?: string | Date | null) {
  if (!value) return "Not set";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default ProjectManager;
