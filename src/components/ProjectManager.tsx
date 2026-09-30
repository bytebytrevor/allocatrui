import {
  useEffect,
  useMemo,
  useState,
  type ComponentType,
} from "react";

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

import TaskStatusBoard from "./TaskStatusBoard";
import TaskCard from "./TaskCard";
import LoadingState from "./LoadingState";

import { Button } from "./ui/button";

/* =========================================================
   TYPES
========================================================= */

const WORKFLOW_STATUSES = [
  "pending",
  "active",
  "complete",
] as const;

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

    if (status === "complete" || status === "completed") return "complete";
    if (status === "active") return "active";

    return "pending";
  }

  function isTaskOverdue(task: Task) {
    if (getWorkflowStatus(task) === "complete" || !task.dueDate) return false;

    const dueDate = new Date(task.dueDate);

    if (Number.isNaN(dueDate.getTime())) return false;

    return dueDate.getTime() < Date.now();
  }

  /* =======================================================
     REFRESH
  ======================================================= */

  async function refreshProject() {
    if (!projectId) return;

    const response = await api.get<Project>(
      `/projects/${projectId}`,
      { withCredentials: true },
    );

    setProject(response.data);
  }

  async function refreshTasks() {
    if (!projectId) return;

    const response = await api.get<Task[]>(
      `/projects/tasks/${projectId}`,
      { withCredentials: true },
    );

    setTasks(Array.isArray(response.data) ? response.data : []);
  }

  async function handleTaskCreated() {
    try {
      await Promise.all([
        refreshTasks(),
        refreshProject(),
      ]);
    } catch (error) {
      console.error(
        "Could not refresh workspace after creating task:",
        error,
      );

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

        const [
          projectResponse,
          tasksResponse,
          permissionsResponse,
        ] = await Promise.all([
          api.get<Project>(
            `/projects/${projectId}`,
            { withCredentials: true },
          ),

          api.get<Task[]>(
            `/projects/tasks/${projectId}`,
            { withCredentials: true },
          ),

          api.get<ProjectPermissions>(
            `/projects/${projectId}/permissions`,
            { withCredentials: true },
          ),
        ]);

        if (cancelled) return;

        setProject(projectResponse.data);

        setTasks(
          Array.isArray(tasksResponse.data)
            ? tasksResponse.data
            : [],
        );

        setPermissions(permissionsResponse.data);
      } catch (err: unknown) {
        if (cancelled) return;

        setError(
          err instanceof Error
            ? err
            : new Error("Could not load project workspace."),
        );
      } finally {
        if (!cancelled) setLoading(false);
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

  async function updateTaskStatus(
    taskId: string,
    status: WorkflowStatus,
  ) {
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

  async function moveTask(
    taskId: string,
    newStatus: WorkflowStatus,
  ) {
    if (!canManageTasks) return;

    const currentTask = tasks.find(task => task.id === taskId);

    if (!currentTask) return;

    const currentStatus = getWorkflowStatus(currentTask);

    if (currentStatus === newStatus) return;

    const previousTasks = tasks;

    setTasks(currentTasks =>
      currentTasks.map(task =>
        task.id === taskId
          ? { ...task, status: newStatus }
          : task,
      ),
    );

    try {
      const result = await updateTaskStatus(taskId, newStatus);

      setTasks(currentTasks =>
        currentTasks.map(task =>
          task.id === taskId
            ? { ...task, ...result.task }
            : task,
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

    setTasks(currentTasks =>
      currentTasks.filter(currentTask => currentTask.id !== task.id),
    );

    try {
      await api.delete(
        `/projects/tasks/task/${task.id}`,
        { withCredentials: true },
      );

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

    return tasks.find(task => task.id === activeTaskId) ?? null;
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

    await moveTask(
      String(event.active.id),
      event.over.id,
    );
  }

  /* =======================================================
     LOADING / ERROR
  ======================================================= */

  if (loading) {
    return (
      <LoadingState
        label="Loading your workspace"
        className="min-h-[420px]"
      />
    );
  }

  if (error || !project || !permissions) {
    return <ProjectManagerError />;
  }

  /* =======================================================
     TASK GROUPS
  ======================================================= */

  const pendingTaskList = tasks.filter(
    task => getWorkflowStatus(task) === "pending",
  );

  const activeTaskList = tasks.filter(
    task => getWorkflowStatus(task) === "active",
  );

  const completedTaskList = tasks.filter(
    task => getWorkflowStatus(task) === "complete",
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

      <section className="border-b border-[#315E6C]/[0.07] pb-6 dark:border-white/[0.06]">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0">
            <div className="flex items-start gap-4">
              <span
                className={[
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                  "bg-[#DCE7E3] text-[#315E6C]",
                  "dark:bg-[#DEDA00]/[0.08] dark:text-[#DEDA00]",
                ].join(" ")}
              >
                <FolderOpenIcon size={18} />
              </span>

              <div className="min-w-0 pt-0.5">
                <p className="text-[0.56rem] font-semibold uppercase tracking-[0.17em] text-[#758386] dark:text-[#94A3B8]">
                  Project workspace
                </p>

                <h1
                  className={[
                    "mt-1.5 max-w-4xl break-words",
                    "text-2xl font-semibold leading-[1.08] tracking-[-0.03em]",
                    "text-[#30383A] sm:text-3xl lg:text-[2rem]",
                    "dark:text-white",
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
                      "text-[0.64rem] font-medium text-[#718084]",
                      "transition-colors hover:text-[#315E6C]",
                      "dark:text-[#94A3B8] dark:hover:text-[#DEDA00]",
                    ].join(" ")}
                    title={`Copy ${project.projectCode}`}
                  >
                    <span>
                      {getProjectDisplayCode(project.projectCode)}
                    </span>

                    <CopyIcon
                      size={11}
                      className="opacity-50 transition-opacity group-hover:opacity-100"
                    />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              className={[
                "h-10 rounded-lg px-4 text-xs font-semibold shadow-none",
                "border-[#315E6C]/[0.10] bg-transparent text-[#566A6F]",
                "hover:border-[#315E6C]/[0.16] hover:bg-[#E7ECE9] hover:text-[#315E6C]",
                "dark:border-white/[0.09] dark:text-[#CBD5E1]",
                "dark:hover:border-white/[0.14] dark:hover:bg-white/[0.04] dark:hover:text-white",
              ].join(" ")}
            >
              <EyeIcon size={14} />
              View details
            </Button>

            <Button
              asChild
              className={[
                "h-10 rounded-lg px-4 text-xs font-semibold shadow-none",
                "bg-[#315E6C] text-white hover:bg-[#294F5B] hover:text-white",
                "dark:bg-[#DEDA00] dark:text-[#303030]",
                "dark:hover:bg-[#D4D000] dark:hover:text-[#303030]",
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
            "relative mt-6 overflow-hidden rounded-[1.25rem] border",
            "border-[#0D566D]/[0.10] bg-[#E6EEEB]",
            "shadow-[0_18px_48px_-40px_rgba(13,86,109,0.38)]",
            "dark:border-white/[0.065] dark:bg-[#0C1D22]",
            "dark:shadow-[0_18px_48px_-34px_rgba(0,0,0,0.50)]",
          ].join(" ")}
        >
          {/* TOP HIGHLIGHT */}

          <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#0D566D]/35 to-transparent dark:via-[#DEDA00]/45" />

          {/* AMBIENT DEPTH */}

          <span className="pointer-events-none absolute -right-20 -top-28 h-64 w-64 rounded-full bg-[#7DA6B1]/[0.10] blur-3xl dark:bg-[#0D566D]/20" />

          <div className="relative flex flex-col lg:flex-row lg:items-stretch">
            {/* =============================================
                PROGRESS
            ============================================= */}

            <div className="min-w-0 flex-1 px-4 py-4 sm:px-5 sm:py-5 lg:px-6">
              <div className="flex max-w-[390px] items-end justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[0.56rem] font-semibold uppercase tracking-[0.16em] text-[#607579] dark:text-[#94A3B8]">
                    Project progress
                  </p>

                  <div className="mt-1.5 flex items-center gap-2">
                    <p className="text-sm font-semibold tracking-[-0.01em] text-[#33484D] dark:text-[#F1F5F9]">
                      {completedTaskList.length}/{tasks.length} tasks complete
                    </p>
                  </div>
                </div>

                <span className="shrink-0 text-lg font-semibold tabular-nums tracking-[-0.02em] text-[#0D566D] dark:text-[#DEDA00]">
                  {progress}%
                </span>
              </div>

              <div
                className={[
                  "mt-3 h-1.5 max-w-[390px] overflow-hidden rounded-full",
                  "bg-[#0D566D]/[0.11]",
                  "dark:bg-white/[0.075]",
                ].join(" ")}
                role="progressbar"
                aria-label="Project progress"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
              >
                <div
                  className={[
                    "h-full rounded-full transition-[width] duration-500 ease-out",
                    "bg-gradient-to-r from-[#0A4658] via-[#0D566D] to-[#477785]",
                    "dark:from-[#A8A500] dark:via-[#DEDA00] dark:to-[#F0EC3C]",
                    "dark:shadow-[0_0_8px_rgba(222,218,0,0.18)]",
                  ].join(" ")}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* =============================================
                PROJECT META
            ============================================= */}

            <div
              className={[
                "relative grid grid-cols-2 gap-y-4 border-t px-4 py-4",
                "border-[#0D566D]/[0.075]",
                "sm:grid-cols-3 sm:px-5",
                "lg:w-auto lg:min-w-[390px] lg:border-l lg:border-t-0 lg:px-5 lg:py-5",
                "dark:border-white/[0.06]",
              ].join(" ")}
            >
              <ProjectMeta
                label="Status"
                value={project.status || "Pending"}
                tone="status"
              />

              <ProjectMeta
                label="Priority"
                value={project.priority || "Standard"}
              />

              <ProjectMeta
                label="Due"
                value={formatDate(project.dueDate)}
                icon={CalendarDaysIcon}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          TASK BOARD HEADER
      =================================================== */}

      <section className="flex flex-col gap-4 pb-5 pt-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <p className="text-[0.56rem] font-semibold uppercase tracking-[0.17em] text-[#315E6C] dark:text-[#DEDA00]">
              Task board
            </p>

            {!canManageTasks && (
              <span className="flex items-center gap-1 text-[0.6rem] font-medium text-[#7D898C] dark:text-[#94A3B8]">
                <EyeIcon size={10} />
                Client view
              </span>
            )}
          </div>

          <h2 className="mt-1.5 text-xl font-semibold tracking-[-0.025em] text-[#30383A] dark:text-white">
            Work in motion
          </h2>

          <p className="mt-1 text-[0.68rem] leading-5 text-[#758386] dark:text-[#94A3B8]">
            {canManageTasks
              ? "Move work from pending through completion."
              : "Track progress and comment on tasks."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-[0.65rem] text-[#718084] dark:text-[#94A3B8]">
          <span>{tasks.length} tasks</span>

          <span className="h-0.5 w-0.5 rounded-full bg-[#839093] dark:bg-white/25" />

          <span>{activeTaskList.length} in progress</span>

          {overdueTaskCount > 0 && (
            <>
              <span className="h-0.5 w-0.5 rounded-full bg-[#839093] dark:bg-white/25" />

              <span className="inline-flex items-center gap-1 font-semibold text-[#9F3C1A] dark:text-[#D27857]">
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
            className="min-w-0"
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
            className="min-w-0"
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
            className="min-w-0"
          />
        </section>

        {canManageTasks && (
          <DragOverlay>
            {activeTask ? (
              <div className="w-[280px] rotate-[1deg] opacity-95">
                <TaskCard
                  task={activeTask}
                  isOverlay
                />
              </div>
            ) : null}
          </DragOverlay>
        )}
      </DndContext>
    </div>
  );
}

/* =========================================================
   PROJECT META
========================================================= */

function ProjectMeta({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  icon?: ComponentType<{
    size?: number;
    className?: string;
  }>;
  tone?: "status";
}) {
  return (
    <div className="flex min-w-[92px] items-start gap-2 px-2 first:pl-0 last:pr-0 lg:px-4">
      {Icon && (
        <Icon
          size={12}
          className="mt-0.5 shrink-0 text-[#647A7F] dark:text-[#94A3B8]"
        />
      )}

      <div className="min-w-0">
        <p className="text-[0.54rem] font-semibold uppercase tracking-[0.13em] text-[#687C81] dark:text-[#94A3B8]">
          {label}
        </p>

        <div className="mt-1 flex min-w-0 items-center gap-1.5">
          {tone === "status" && (
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#0D566D] dark:bg-[#DEDA00]" />
          )}

          <p
            className={[
              "truncate text-xs font-semibold capitalize",
              tone === "status"
                ? "text-[#0D566D] dark:text-[#DEDA00]"
                : "text-[#33484D] dark:text-[#E2E8F0]",
            ].join(" ")}
          >
            {value}
          </p>
        </div>
      </div>
    </div>
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
            "bg-[#E1E8E5] text-[#687B80]",
            "dark:bg-white/[0.04] dark:text-[#DEDA00]",
          ].join(" ")}
        >
          <FolderOpenIcon size={18} />
        </span>

        <h2 className="mt-5 text-lg font-semibold tracking-[-0.02em]">
          Could not load project
        </h2>

        <p className="mt-2 text-sm leading-7 text-[#748185] dark:text-[#94A3B8]">
          Something interrupted the project workspace while it was loading.
        </p>

        <Button
          asChild
          variant="outline"
          className={[
            "mt-6 h-10 rounded-lg px-5 text-xs font-semibold shadow-none",
            "border-[#315E6C]/[0.11] bg-transparent text-[#315E6C]",
            "hover:bg-[#E7ECE9]",
            "dark:border-white/[0.09] dark:text-[#CBD5E1]",
            "dark:hover:bg-white/[0.04] dark:hover:text-white",
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

function getProjectDisplayCode(value: string) {
  const code = value.trim();

  if (!code) return "";

  const cleanCode = code.startsWith("#")
    ? code.slice(1)
    : code;

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

  if (Number.isNaN(date.getTime())) return "Not set";

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default ProjectManager;