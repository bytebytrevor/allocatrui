import { useEffect, useMemo, useState } from "react";
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

import { Toaster } from "sonner";

import api from "@/api/axios";

import type { Project } from "@/Types/project";
import type { Task } from "@/Types/task";

import TaskStatusBoard from "./TaskStatusBoard";
import TaskCard from "./TaskCard";
import LoadingState from "./LoadingState";

import { Progress } from "./ui/progress";
import { Button } from "./ui/button";

/* =========================================================
   TASK STATUS
========================================================= */

const STATUSES = [
  "pending",
  "active",
  "complete",
  "overdue",
] as const;

type Status = (typeof STATUSES)[number];

/* =========================================================
   PROJECT MANAGER
========================================================= */

function ProjectManager() {
  const { projectId } = useParams();

  const [project, setProject] = useState<Project>();
  const [tasks, setTasks] = useState<Task[]>([]);

  const [projectLoading, setProjectLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(true);

  const [error, setError] = useState<Error | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  /* =======================================================
     DRAG SENSORS

     A click should remain a click.
     Dragging only begins after the pointer moves 8px.
  ======================================================= */

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  /* =======================================================
     HELPERS
  ======================================================= */

  function isStatus(value: unknown): value is Status {
    return (
      typeof value === "string" &&
      (STATUSES as readonly string[]).includes(value)
    );
  }

  function canMoveToOverdue(task: Task) {
    if (!task.dueDate) {
      return false;
    }

    return new Date(task.dueDate).getTime() < Date.now();
  }

  /* =======================================================
     LOAD PROJECT
  ======================================================= */

  async function refetchProject() {
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

  useEffect(() => {
    if (!projectId) {
      return;
    }

    async function fetchProject() {
      try {
        setProjectLoading(true);

        const response = await api.get<Project>(
          `/projects/${projectId}`,
          {
            withCredentials: true,
          },
        );

        setProject(response.data);
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err
            : new Error("Could not load project."),
        );
      } finally {
        setProjectLoading(false);
      }
    }

    void fetchProject();
  }, [projectId]);

  /* =======================================================
     LOAD TASKS
  ======================================================= */

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

  useEffect(() => {
    if (!projectId) {
      return;
    }

    async function fetchTasks() {
      try {
        setTasksLoading(true);

        const response = await api.get<Task[]>(
          `/projects/tasks/${projectId}`,
          {
            withCredentials: true,
          },
        );

        setTasks(response.data);
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err
            : new Error("Could not load project tasks."),
        );
      } finally {
        setTasksLoading(false);
      }
    }

    void fetchTasks();
  }, [projectId]);

  /* =======================================================
     UPDATE STATUS
  ======================================================= */

  async function updateTaskStatus(taskId: string, status: Status) {
    await api.patch(
      `/projects/tasks/task/${taskId}/status`,
      {
        status,
      },
      {
        withCredentials: true,
      },
    );
  }

  /* =======================================================
     ACTIVE DRAGGED TASK
  ======================================================= */

  const activeTask = useMemo(() => {
    if (!activeTaskId) {
      return null;
    }

    return tasks.find((task) => task.id === activeTaskId) ?? null;
  }, [activeTaskId, tasks]);

  /* =======================================================
     DRAG EVENTS
  ======================================================= */

  function handleDragStart(event: DragStartEvent) {
    setActiveTaskId(String(event.active.id));
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveTaskId(null);

    const { active, over } = event;

    if (!over) {
      return;
    }

    const taskId = String(active.id);
    const newStatusRaw = over.id;

    if (!isStatus(newStatusRaw)) {
      return;
    }

    const newStatus = newStatusRaw;

    const current = tasks.find((task) => task.id === taskId);

    if (!current) {
      return;
    }

    if (current.status === newStatus) {
      return;
    }

    if (
      newStatus === "overdue" &&
      !canMoveToOverdue(current)
    ) {
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
      await updateTaskStatus(taskId, newStatus);
      await refetchProject();
    } catch (error) {
      setTasks(previousTasks);
      console.error(error);
    }
  }

  /* =======================================================
     LOADING / ERROR

     Keep the same workspace loading message as Dashboard.
     The user should experience one continuous loading state.
  ======================================================= */

  if (projectLoading || tasksLoading) {
    return (
      <LoadingState
        label="Loading your workspace"
        className="min-h-[420px]"
      />
    );
  }

  if (error) {
    return <ProjectManagerError />;
  }

  /* =======================================================
     TASK GROUPS
  ======================================================= */

  const pendingTaskList = tasks.filter(
    (task) => task.status === "pending",
  );

  const activeTaskList = tasks.filter(
    (task) => task.status === "active",
  );

  const completedTaskList = tasks.filter(
    (task) => task.status === "complete",
  );

  const overdueTaskList = tasks.filter(
    (task) => task.status === "overdue",
  );

  const progress = Math.round(project?.progress ?? 0);

  return (
    <>
      <Toaster />

      <div className="flex min-h-0 flex-1 flex-col pb-5">
        {/* ===================================================
            PROJECT HEADER
        =================================================== */}

        <section className="border-b border-border pb-7">
          <div className="flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between">
            {/* Project information */}

            <div className="min-w-0">
              {/* <Link
                to="/projects"
                className={[
                  "group inline-flex items-center gap-1.5",
                  "text-xs font-medium text-muted-foreground",
                  "transition-colors hover:text-foreground",
                ].join(" ")}
              >
                <ArrowLeftIcon
                  size={13}
                  className="transition-transform group-hover:-translate-x-0.5"
                />

                All projects
              </Link> */}

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
                    {project?.title}
                  </h1>

                  {project?.projectCode && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      {project.projectCode}
                    </p>
                  )}
                </div>
              </div>

              {/* Progress */}

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

            {/* Actions */}

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

          {/* Small project meta strip */}

          <div className="mt-7 flex flex-wrap gap-x-7 gap-y-3 border-t border-border/70 pt-5">
            <ProjectMeta
              label="Status"
              value={project?.status || "Pending"}
            />

            <ProjectMeta
              label="Priority"
              value={project?.priority || "Standard"}
            />

            <ProjectMeta
              label="Due"
              value={formatDate(project?.dueDate)}
              icon={CalendarDaysIcon}
            />
          </div>
        </section>

        {/* ===================================================
            BOARD HEADER
        =================================================== */}

        <section className="flex flex-col gap-4 pb-5 pt-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.17em] text-primary">
              Task board
            </p>

            <h2 className="mt-1.5 text-xl font-black tracking-[-0.025em]">
              Work in motion
            </h2>

            <p className="mt-1.5 text-sm text-muted-foreground">
              Move tasks through the project as work progresses.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{tasks.length} tasks</span>

            <span className="h-1 w-1 rounded-full bg-border" />

            <span>{activeTaskList.length} active</span>
          </div>
        </section>

        {/* ===================================================
            TASK BOARD
        =================================================== */}

        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
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
              onTaskCreated={refreshTasks}
              className="min-w-0"
            />

            <TaskStatusBoard
              status="active"
              title="In progress"
              description="No active tasks"
              tasks={activeTaskList}
              project={project}
              onTaskCreated={refreshTasks}
              className="min-w-0"
            />

            <TaskStatusBoard
              status="complete"
              title="Complete"
              description="No completed tasks"
              tasks={completedTaskList}
              project={project}
              onTaskCreated={refreshTasks}
              className="min-w-0"
            />

            <TaskStatusBoard
              status="overdue"
              title="Overdue"
              description="No overdue tasks"
              tasks={overdueTaskList}
              project={project}
              onTaskCreated={refreshTasks}
              className="min-w-0"
            />
          </section>

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
        </DndContext>
      </div>
    </>
  );
}

/* =========================================================
   PROJECT META
========================================================= */

function ProjectMeta({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: React.ComponentType<{
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

/* =========================================================
   ERROR
========================================================= */

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

/* =========================================================
   DATE
========================================================= */

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