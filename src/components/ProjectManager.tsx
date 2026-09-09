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
  EyeIcon,
  FolderOpenIcon,
  PlusIcon,
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

import { Progress } from "./ui/progress";
import { Button } from "./ui/button";

const STATUSES = [
  "pending",
  "active",
  "complete",
  "overdue",
] as const;

type Status = (typeof STATUSES)[number];

type ProjectPermissions = {
  isOwner: boolean;
  isAcceptedAllocat: boolean;
  canManageTasks: boolean;
};

type UpdateTaskStatusResult = {
  task: Task;
  project: Project;
};

function ProjectManager() {
  const { projectId } = useParams();

  const [project, setProject] = useState<Project>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [permissions, setPermissions] =
    useState<ProjectPermissions>();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [activeTaskId, setActiveTaskId] =
    useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const canManageTasks =
    permissions?.canManageTasks === true;

  function isStatus(value: unknown): value is Status {
    return (
      typeof value === "string" &&
      (STATUSES as readonly string[]).includes(value)
    );
  }

  function isTaskPastDue(task: Task) {
    if (!task.dueDate) {
      return false;
    }

    const dueDate = new Date(task.dueDate);

    if (Number.isNaN(dueDate.getTime())) {
      return false;
    }

    return dueDate.getTime() < Date.now();
  }

  function getEffectiveTaskStatus(task: Task): Status {
    if (task.status === "complete") {
      return "complete";
    }

    if (isTaskPastDue(task)) {
      return "overdue";
    }

    if (task.status === "active") {
      return "active";
    }

    return "pending";
  }

  async function refreshProject() {
    if (!projectId) {
      return;
    }

    const response = await api.get<Project>(
      `/projects/${projectId}`,
      {
        withCredentials: true,
      },
    );

    setProject(response.data);
  }

  async function refreshTasks() {
    if (!projectId) {
      return;
    }

    const response = await api.get<Task[]>(
      `/projects/tasks/${projectId}`,
      {
        withCredentials: true,
      },
    );

    setTasks(response.data);
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

  useEffect(() => {
    if (!projectId) {
      return;
    }

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
            {
              withCredentials: true,
            },
          ),
          api.get<Task[]>(
            `/projects/tasks/${projectId}`,
            {
              withCredentials: true,
            },
          ),
          api.get<ProjectPermissions>(
            `/projects/${projectId}/permissions`,
            {
              withCredentials: true,
            },
          ),
        ]);

        if (cancelled) {
          return;
        }

        setProject(projectResponse.data);
        setTasks(tasksResponse.data);
        setPermissions(permissionsResponse.data);
      } catch (err: unknown) {
        if (cancelled) {
          return;
        }

        setError(
          err instanceof Error
            ? err
            : new Error(
                "Could not load project workspace.",
              ),
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

  async function updateTaskStatus(
    taskId: string,
    status: Status,
  ) {
    const response =
      await api.patch<UpdateTaskStatusResult>(
        `/projects/tasks/task/${taskId}/status`,
        { status },
        {
          withCredentials: true,
        },
      );

    return response.data;
  }

  async function moveTask(
    taskId: string,
    newStatus: Status,
  ) {
    if (!canManageTasks) {
      return;
    }

    const currentTask = tasks.find(
      (task) => task.id === taskId,
    );

    if (!currentTask) {
      return;
    }

    const currentStatus =
      getEffectiveTaskStatus(currentTask);

    if (newStatus === "overdue") {
      toast.info(
        "Overdue status is set automatically from the due date.",
      );

      return;
    }

    if (currentStatus === newStatus) {
      return;
    }

    if (
      currentStatus === "overdue" &&
      newStatus !== "complete"
    ) {
      toast.info(
        "An overdue task can only be marked complete.",
      );

      return;
    }

    const previousTasks = tasks;

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: newStatus,
            }
          : task,
      ),
    );

    try {
      const result = await updateTaskStatus(
        taskId,
        newStatus,
      );

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                ...result.task,
              }
            : task,
        ),
      );

      setProject(result.project);
    } catch (error) {
      setTasks(previousTasks);

      console.error(
        "Could not move task:",
        error,
      );

      toast.error(
        "Task could not be moved.",
        {
          description:
            "Your task permissions may have changed. Refresh the workspace and try again.",
        },
      );
    }
  }

  async function deleteTask(task: Task) {
    if (!canManageTasks) {
      return;
    }

    const confirmed = window.confirm(
      `Delete "${task.title}"? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    const previousTasks = tasks;

    setTasks((currentTasks) =>
      currentTasks.filter(
        (currentTask) => currentTask.id !== task.id,
      ),
    );

    try {
      await api.delete(
        `/projects/tasks/task/${task.id}`,
        {
          withCredentials: true,
        },
      );

      toast.success("Task deleted.");
    } catch (error) {
      setTasks(previousTasks);

      console.error(
        "Could not delete task:",
        error,
      );

      toast.error("Task could not be deleted.");
      return;
    }

    try {
      await refreshProject();
    } catch (error) {
      console.error(
        "Could not refresh project after deleting task:",
        error,
      );
    }
  }

  const activeTask = useMemo(() => {
    if (!activeTaskId || !canManageTasks) {
      return null;
    }

    return (
      tasks.find(
        (task) => task.id === activeTaskId,
      ) ?? null
    );
  }, [activeTaskId, canManageTasks, tasks]);

  function handleDragStart(event: DragStartEvent) {
    if (!canManageTasks) {
      return;
    }

    setActiveTaskId(String(event.active.id));
  }

  function handleDragCancel() {
    setActiveTaskId(null);
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveTaskId(null);

    if (!canManageTasks || !event.over) {
      return;
    }

    if (!isStatus(event.over.id)) {
      return;
    }

    await moveTask(
      String(event.active.id),
      event.over.id,
    );
  }

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

  const pendingTaskList = tasks.filter(
    (task) =>
      getEffectiveTaskStatus(task) === "pending",
  );

  const activeTaskList = tasks.filter(
    (task) =>
      getEffectiveTaskStatus(task) === "active",
  );

  const completedTaskList = tasks.filter(
    (task) =>
      getEffectiveTaskStatus(task) === "complete",
  );

  const overdueTaskList = tasks.filter(
    (task) =>
      getEffectiveTaskStatus(task) === "overdue",
  );

  const progress = Math.round(project.progress ?? 0);

  return (
    <div className="flex min-h-0 flex-1 flex-col pb-5">
      <section className="border-b border-border pb-7">
        <div className="flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between">
          <div className="min-w-0">
            <div className="mt-6 flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/[0.075] text-primary">
                <FolderOpenIcon size={19} />
              </span>

              <div className="min-w-0">
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.17em] text-muted-foreground">
                  Project workspace
                </p>

                <h1
                  className={[
                    "mt-1.5 max-w-4xl break-words",
                    "text-2xl font-black leading-[1.08]",
                    "tracking-[-0.03em]",
                    "sm:text-3xl lg:text-[2rem]",
                  ].join(" ")}
                >
                  {project.title}
                </h1>

                {project.projectCode && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    {project.projectCode}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-7 max-w-xl">
              <div className="mb-2.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold">
                    Project progress
                  </span>

                  <span className="text-[0.65rem] text-muted-foreground">
                    {completedTaskList.length}/{tasks.length} tasks complete
                  </span>
                </div>

                <span className="text-xs font-black tabular-nums">
                  {progress}%
                </span>
              </div>

              <Progress
                value={progress}
                className="h-1.5"
              />
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-lg px-4 text-xs shadow-none"
            >
              <EyeIcon size={15} />
              View details
            </Button>

            <Button
              asChild
              className="h-10 rounded-lg px-4 text-xs shadow-none"
            >
              <Link to="/projects/new">
                <PlusIcon size={15} />
                New project
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-7 flex flex-wrap gap-x-7 gap-y-3 border-t border-border/70 pt-5">
          <ProjectMeta
            label="Status"
            value={project.status || "Pending"}
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
      </section>

      <section className="flex flex-col gap-4 pb-5 pt-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.17em] text-primary">
              Task board
            </p>

            {!canManageTasks && (
              <span className="flex items-center gap-1 text-[0.62rem] font-medium text-muted-foreground">
                <EyeIcon size={11} />
                Client view
              </span>
            )}
          </div>

          <h2 className="mt-1.5 text-xl font-black tracking-[-0.025em]">
            Work in motion
          </h2>

          <p className="mt-1 text-[0.7rem] leading-5 text-muted-foreground">
            {canManageTasks
              ? "Move tasks as work progresses."
              : "Track progress and comment on tasks."}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{tasks.length} tasks</span>

          <span className="h-1 w-1 rounded-full bg-border" />

          <span>{activeTaskList.length} active</span>
        </div>
      </section>

      <DndContext
        sensors={canManageTasks ? sensors : []}
        onDragStart={
          canManageTasks
            ? handleDragStart
            : undefined
        }
        onDragEnd={
          canManageTasks
            ? handleDragEnd
            : undefined
        }
        onDragCancel={handleDragCancel}
      >
        <section
          className={[
            "grid min-h-0 items-start gap-4 pb-4",
            "md:grid-cols-2",
            "2xl:grid-cols-4",
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

          <TaskStatusBoard
            status="overdue"
            title="Overdue"
            description="No overdue tasks"
            tasks={overdueTaskList}
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

function ProjectMeta({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: ComponentType<{
    size?: number;
    className?: string;
  }>;
}) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      {Icon && (
        <Icon
          size={13}
          className="shrink-0 text-muted-foreground"
        />
      )}

      <div className="flex items-center gap-1.5">
        <span className="text-[0.62rem] font-medium text-muted-foreground">
          {label}
        </span>

        <span className="text-xs font-semibold capitalize">
          {value}
        </span>
      </div>
    </div>
  );
}

function ProjectManagerError() {
  return (
    <div className="flex min-h-[420px] items-center justify-center">
      <div className="max-w-md text-center">
        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-muted text-muted-foreground">
          <FolderOpenIcon size={19} />
        </span>

        <h2 className="mt-5 text-lg font-black">
          Could not load project
        </h2>

        <p className="mt-2 text-sm leading-7 text-muted-foreground">
          Something interrupted the project workspace while it was loading.
        </p>

        <Button
          asChild
          variant="outline"
          className="mt-6 h-10 rounded-lg px-5 shadow-none"
        >
          <Link to="/projects">
            <ArrowLeftIcon size={14} />
            Back to projects
          </Link>
        </Button>
      </div>
    </div>
  );
}

function formatDate(value?: string | Date | null) {
  if (!value) {
    return "Not set";
  }

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