import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { createPortal } from "react-dom";
import { Link, useParams } from "react-router-dom";

import {
  CalendarDaysIcon,
  CopyIcon,
  EyeIcon,
  FolderOpenIcon,
  PlusIcon,
  RefreshCwIcon,
  SearchIcon,
  SlidersHorizontalIcon,
  TriangleAlertIcon,
  XIcon,
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
import CreateTaskDialog from "./CreateTaskDialogue";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

import {
  BusyIcon,
  laneAppearance,
  primaryAction,
  ProjectStatus,
  quietAction,
  secondaryAction,
} from "./workspace-ui";

import {
  formatDate,
  formatStatus,
  getAssignedName,
  getWorkflowStatus,
  isTaskOverdue,
  isWorkflowStatus,
  projectCode,
  projectProgress,
  WORKFLOW_STATUSES,
  type WorkflowStatus,
} from "./workspace-utils";

/* =========================================================
   TYPES
========================================================= */

type ProjectPermissions = {
  isOwner: boolean;
  isAcceptedAllocat: boolean;
  canManageTasks: boolean;
};

type StatusResult = {
  task: Task;
  project: Project;
};

type DragSize = {
  width: number;
  height: number;
};

/* =========================================================
   PROJECT MANAGER
========================================================= */

export default function ProjectManager() {
  const { projectId } = useParams();

  const [project, setProject] = useState<Project>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [permissions, setPermissions] = useState<ProjectPermissions>();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadVersion, setLoadVersion] = useState(0);

  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const [dragSize, setDragSize] = useState<DragSize | null>(null);

  const [busyTaskIds, setBusyTaskIds] = useState<Set<string>>(new Set());

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [overdueOnly, setOverdueOnly] = useState(false);

  const [selectedLane, setSelectedLane] = useState<WorkflowStatus>("pending");

  const [wideBoard, setWideBoard] = useState(false);
  const [now, setNow] = useState(Date.now);

  const boardRef = useRef<HTMLDivElement>(null);
  const routeRef = useRef(projectId);
  const mountedRef = useRef(true);
  const scopeRef = useRef(0);
  const operationsRef = useRef(new Set<string>());
  const reconcileRef = useRef(false);
  const refreshRef = useRef(0);

  routeRef.current = projectId;

  const canManageTasks = permissions?.canManageTasks === true;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  /* =======================================================
     MOUNT STATE
  ======================================================= */

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      scopeRef.current += 1;
    };
  }, []);

  /* =======================================================
     OVERDUE CLOCK
  ======================================================= */

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60000);

    return () => window.clearInterval(timer);
  }, []);

  /* =======================================================
     LOAD PROJECT
  ======================================================= */

  useEffect(() => {
    const scope = ++scopeRef.current;
    let cancelled = false;

    setLoading(true);
    setRefreshing(false);
    setError(false);

    setPermissions(undefined);
    setProject(undefined);
    setTasks([]);

    setSearch("");
    setOverdueOnly(false);
    setSelectedLane("pending");

    setActiveTaskId(null);
    setDragSize(null);
    setDetailsOpen(false);

    operationsRef.current.clear();
    setBusyTaskIds(new Set());

    reconcileRef.current = false;
    refreshRef.current += 1;

    if (!projectId) {
      setLoading(false);
      setError(true);
      return;
    }

    void Promise.all([
      api.get<Project>(`/projects/${projectId}`, {
        withCredentials: true,
      }),

      api.get<Task[]>(`/projects/tasks/${projectId}`, {
        withCredentials: true,
      }),

      api.get<ProjectPermissions>(`/projects/${projectId}/permissions`, {
        withCredentials: true,
      }),
    ])
      .then(([projectResponse, tasksResponse, permissionsResponse]) => {
        if (cancelled || scope !== scopeRef.current) return;

        setProject(projectResponse.data);

        setTasks(Array.isArray(tasksResponse.data) ? tasksResponse.data : []);

        setPermissions(permissionsResponse.data);
      })
      .catch(() => {
        if (!cancelled && scope === scopeRef.current) {
          setError(true);
        }
      })
      .finally(() => {
        if (!cancelled && scope === scopeRef.current) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [projectId, loadVersion]);

  /* =======================================================
     RESPONSIVE BOARD
  ======================================================= */

  useEffect(() => {
    const board = boardRef.current;

    if (!board) return;

    const measure = () => {
      setWideBoard(board.getBoundingClientRect().width >= 900);
    };

    const observer = new ResizeObserver(measure);

    observer.observe(board);
    measure();

    return () => observer.disconnect();
  }, [loading, error]);

  /* =======================================================
     REFRESH WORKSPACE
  ======================================================= */

  const refreshWorkspace = useCallback(async () => {
    if (!projectId) return;

    if (operationsRef.current.size > 0) {
      reconcileRef.current = true;
      return;
    }

    const scope = scopeRef.current;
    const request = ++refreshRef.current;

    setRefreshing(true);

    try {
      const [projectResponse, taskResponse, permissionsResponse] =
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

      if (
        !mountedRef.current ||
        routeRef.current !== projectId ||
        scope !== scopeRef.current ||
        request !== refreshRef.current
      ) {
        return;
      }

      // A task mutation may have started during this read.
      if (operationsRef.current.size > 0) {
        reconcileRef.current = true;
        return;
      }

      setProject(projectResponse.data);

      setTasks(Array.isArray(taskResponse.data) ? taskResponse.data : []);

      setPermissions(permissionsResponse.data);
    } catch {
      if (
        mountedRef.current &&
        routeRef.current === projectId &&
        scope === scopeRef.current
      ) {
        toast.error(
          "The workspace could not be refreshed. Your current view has been kept.",
        );
      }
    } finally {
      if (
        mountedRef.current &&
        routeRef.current === projectId &&
        scope === scopeRef.current &&
        request === refreshRef.current
      ) {
        setRefreshing(false);
      }
    }
  }, [projectId]);

  /* =======================================================
     COMPLETE TASK OPERATION
  ======================================================= */

  async function finishOperation(taskId: string, scope: number) {
    if (
      !mountedRef.current ||
      routeRef.current !== projectId ||
      scope !== scopeRef.current
    ) {
      return;
    }

    operationsRef.current.delete(taskId);
    setBusyTaskIds(new Set(operationsRef.current));

    if (operationsRef.current.size === 0 && reconcileRef.current) {
      reconcileRef.current = false;
      await refreshWorkspace();
    }
  }

  /* =======================================================
     MOVE TASK
  ======================================================= */

  async function moveTask(taskId: string, status: WorkflowStatus) {
    if (
      !canManageTasks ||
      !isWorkflowStatus(status) ||
      operationsRef.current.has(taskId)
    ) {
      return;
    }

    const original = tasks.find((task) => String(task.id) === taskId);

    if (!original || getWorkflowStatus(original) === status) {
      return;
    }

    const scope = scopeRef.current;

    operationsRef.current.add(taskId);
    setBusyTaskIds(new Set(operationsRef.current));

    setTasks((current) =>
      current.map((task) =>
        String(task.id) === taskId ? { ...task, status } : task,
      ),
    );

    try {
      const response = await api.patch<StatusResult>(
        `/projects/tasks/task/${taskId}/status`,
        { status },
        { withCredentials: true },
      );

      if (
        !mountedRef.current ||
        routeRef.current !== projectId ||
        scope !== scopeRef.current
      ) {
        return;
      }

      setTasks((current) =>
        current.map((task) =>
          String(task.id) === taskId
            ? { ...task, ...response.data.task }
            : task,
        ),
      );

      setProject(response.data.project);
      reconcileRef.current = true;
    } catch {
      if (
        mountedRef.current &&
        routeRef.current === projectId &&
        scope === scopeRef.current
      ) {
        setTasks((current) =>
          current.map((task) => (String(task.id) === taskId ? original : task)),
        );

        toast.error("Task could not be moved.", {
          description:
            "Your permissions may have changed. Refresh the workspace and try again.",
        });
      }
    } finally {
      await finishOperation(taskId, scope);
    }
  }

  /* =======================================================
     DELETE TASK
  ======================================================= */

  async function deleteTask(task: Task) {
    const taskId = String(task.id);

    if (!canManageTasks || operationsRef.current.has(taskId)) {
      return;
    }

    const scope = scopeRef.current;

    const index = tasks.findIndex((item) => String(item.id) === taskId);

    if (index < 0) return;

    operationsRef.current.add(taskId);
    setBusyTaskIds(new Set(operationsRef.current));

    setTasks((current) => current.filter((item) => String(item.id) !== taskId));

    try {
      await api.delete(`/projects/tasks/task/${taskId}`, {
        withCredentials: true,
      });

      if (
        !mountedRef.current ||
        routeRef.current !== projectId ||
        scope !== scopeRef.current
      ) {
        return;
      }

      toast.success("Task deleted.", {
        id: `task-delete-${taskId}`,
      });

      reconcileRef.current = true;
    } catch (cause) {
      if (
        mountedRef.current &&
        routeRef.current === projectId &&
        scope === scopeRef.current
      ) {
        setTasks((current) =>
          current.some((item) => String(item.id) === taskId)
            ? current
            : [...current.slice(0, index), task, ...current.slice(index)],
        );

        toast.error("Task could not be deleted.", {
          id: `task-delete-${taskId}`,
        });
      }

      throw cause;
    } finally {
      await finishOperation(taskId, scope);
    }
  }

  /* =======================================================
     COPY PROJECT CODE
  ======================================================= */

  async function copyCode() {
    if (!project?.projectCode) return;

    try {
      await navigator.clipboard.writeText(project.projectCode);

      toast.success("Project code copied.");
    } catch {
      toast.error("Project code could not be copied.");
    }
  }

  /* =======================================================
     DRAG HANDLERS
  ======================================================= */

  function handleDragStart(event: DragStartEvent) {
    const taskId = String(event.active.id);

    if (!canManageTasks || operationsRef.current.has(taskId)) {
      return;
    }

    const rect = event.active.rect.current.initial;

    setDragSize(
      rect
        ? {
            width: rect.width,
            height: rect.height,
          }
        : null,
    );

    setActiveTaskId(taskId);
  }

  function handleDragCancel() {
    setActiveTaskId(null);
    setDragSize(null);
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveTaskId(null);
    setDragSize(null);

    if (!canManageTasks || !event.over || !isWorkflowStatus(event.over.id)) {
      return;
    }

    await moveTask(String(event.active.id), event.over.id);
  }

  /* =======================================================
     TASK GROUPS AND FILTERS
  ======================================================= */

  const activeTask = tasks.find((task) => String(task.id) === activeTaskId);

  const groups = useMemo(
    () =>
      Object.fromEntries(
        WORKFLOW_STATUSES.map((status) => [
          status,
          tasks.filter((task) => getWorkflowStatus(task) === status),
        ]),
      ) as Record<WorkflowStatus, Task[]>,
    [tasks],
  );

  const overdueCount = tasks.filter((task) => isTaskOverdue(task, now)).length;

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tasks.filter((task) => {
      const searchableText = [
        task.title,
        task.description ?? "",
        getAssignedName(task),
      ]
        .join(" ")
        .toLowerCase();

      const matches = searchableText.includes(query);

      return matches && (!overdueOnly || isTaskOverdue(task, now));
    });
  }, [tasks, search, overdueOnly, now]);

  const filtering = Boolean(search.trim() || overdueOnly);

  const progress = projectProgress(project?.progress);

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <LoadingState label="Loading your workspace" className="min-h-[420px]" />
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (error || !project || !permissions) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <div className="max-w-sm text-center">
          <FolderOpenIcon
            size={28}
            aria-hidden="true"
            className="mx-auto text-muted-foreground"
          />

          <h1 className="mt-5 text-lg font-medium">Could not load project</h1>

          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            Try loading the workspace again to confirm project details and
            permissions.
          </p>

          <div className="mt-5 flex justify-center gap-2">
            <button
              type="button"
              onClick={() => setLoadVersion((value) => value + 1)}
              className={secondaryAction}
            >
              <RefreshCwIcon size={14} aria-hidden="true" />
              Try again
            </button>

            <Link to="/projects" className={quietAction}>
              All projects
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-w-0 pb-4">
      {/* PROJECT HEADER */}

      <section
        aria-labelledby="project-title"
        className="border-b border-border/70 pb-6"
      >
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5 text-[11px] text-muted-foreground">
              <span>Project workspace</span>
              <span aria-hidden="true">/</span>

              {project.projectCode && (
                <button
                  type="button"
                  onClick={() => void copyCode()}
                  title={`Copy ${project.projectCode}`}
                  className="inline-flex items-center gap-1.5 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35"
                >
                  <span>{projectCode(project.projectCode)}</span>

                  <CopyIcon size={11} aria-hidden="true" />
                </button>
              )}

              <ProjectStatus status={project.status} />
            </div>

            <h1
              id="project-title"
              className="mt-3 max-w-4xl break-words text-2xl font-medium leading-tight tracking-[-0.035em] text-foreground sm:text-[1.85rem]"
            >
              {project.title}
            </h1>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setDetailsOpen(true)}
              className={secondaryAction}
            >
              <EyeIcon size={14} aria-hidden="true" />
              Details
            </button>

            {canManageTasks && (
              <CreateTaskDialog
                projectId={project.id}
                onCreated={refreshWorkspace}
                trigger={
                  <button type="button" className={primaryAction}>
                    <PlusIcon
                      size={14}
                      aria-hidden="true"
                      className="text-inherit"
                    />
                    Create task
                  </button>
                }
              />
            )}
          </div>
        </div>

        {/* PROJECT SUMMARY */}

        <div className="mt-5 grid gap-0 overflow-hidden rounded-xl border border-border/80 bg-card sm:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,0.65fr))]">
          <div className="min-w-0 px-4 py-4 sm:px-5">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[11px] font-medium text-muted-foreground">
                Project progress
              </span>

              <span className="text-sm font-medium tabular-nums text-brand-secondary-highlight dark:text-secondary">
                {progress}%
              </span>
            </div>

            <div
              role="progressbar"
              aria-label="Project progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
              className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-3"
            >
              <div
                className="h-full rounded-full bg-brand-secondary-highlight transition-[width] duration-300 dark:bg-secondary motion-reduce:transition-none"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="mt-2.5 text-[11px] text-muted-foreground">
              {groups.complete.length} of {tasks.length} tasks complete
            </p>
          </div>

          <SummaryItem
            label="Priority"
            value={formatStatus(project.priority || "Standard")}
          />

          <SummaryItem
            label="Due date"
            value={formatDate(project.dueDate)}
            icon
          />

          <SummaryItem
            label="Needs attention"
            value={
              overdueCount
                ? `${overdueCount} overdue ${
                    overdueCount === 1 ? "task" : "tasks"
                  }`
                : "No overdue tasks"
            }
            attention={overdueCount > 0}
          />
        </div>
      </section>

      {/* TASK BOARD */}

      <div ref={boardRef} className="min-w-0 pt-6">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-base font-medium tracking-[-0.02em]">
                Task board
              </h2>

              {!canManageTasks && (
                <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                  <EyeIcon size={11} aria-hidden="true" />
                  View &amp; comment
                </span>
              )}
            </div>

            <p className="mt-1.5 text-xs text-muted-foreground">
              {filtering
                ? `${filteredTasks.length} of ${tasks.length} tasks shown`
                : `${tasks.length} ${
                    tasks.length === 1 ? "task" : "tasks"
                  } across the workflow`}
            </p>
          </div>

          {/* BOARD CONTROLS */}

          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <div className="relative min-w-0 flex-1 sm:w-48 sm:flex-none">
              <SearchIcon
                size={14}
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search tasks"
                placeholder="Search tasks"
                className="h-10 w-full rounded-lg border border-input bg-card pl-9 pr-8 text-base outline-none focus-visible:border-ring/50 sm:text-xs"
              />

              {search && (
                <button
                  type="button"
                  aria-label="Clear task search"
                  onClick={() => setSearch("")}
                  className="absolute inset-y-0 right-1 flex w-7 items-center justify-center text-muted-foreground"
                >
                  <XIcon size={12} aria-hidden="true" />
                </button>
              )}
            </div>

            <button
              type="button"
              aria-pressed={overdueOnly}
              onClick={() => setOverdueOnly((value) => !value)}
              className={[
                secondaryAction,
                overdueOnly
                  ? "border-ring/45 text-brand-secondary-highlight dark:text-secondary"
                  : "",
              ].join(" ")}
            >
              <SlidersHorizontalIcon size={13} aria-hidden="true" />
              Overdue
            </button>

            <button
              type="button"
              aria-label="Refresh workspace"
              title="Refresh workspace"
              disabled={refreshing || busyTaskIds.size > 0}
              onClick={() => void refreshWorkspace()}
              className={`${secondaryAction} w-10 px-0`}
            >
              {refreshing ? (
                <BusyIcon />
              ) : (
                <RefreshCwIcon size={14} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* FILTER SUMMARY */}

        {filtering && (
          <div className="mb-4 flex items-center justify-between gap-3 text-[11px] text-muted-foreground">
            <span>
              {overdueOnly ? "Showing overdue work" : "Search applied"}
            </span>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setOverdueOnly(false);
              }}
              className="rounded text-brand-secondary-highlight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 dark:text-secondary"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* COMPACT STAGE TABS */}

        {!wideBoard && (
          <div className="mb-4">
            <div
              role="tablist"
              aria-label="Task stages"
              className="grid grid-cols-3 gap-1 rounded-lg border border-border/70 bg-surface-2 p-1"
            >
              {WORKFLOW_STATUSES.map((status) => (
                <button
                  key={status}
                  type="button"
                  role="tab"
                  aria-selected={selectedLane === status}
                  aria-controls={`lane-${status}`}
                  id={`tab-${status}`}
                  onClick={() => setSelectedLane(status)}
                  onKeyDown={(event) => {
                    const index = WORKFLOW_STATUSES.indexOf(status);

                    const next =
                      event.key === "ArrowRight"
                        ? (index + 1) % 3
                        : event.key === "ArrowLeft"
                          ? (index + 2) % 3
                          : event.key === "Home"
                            ? 0
                            : event.key === "End"
                              ? 2
                              : -1;

                    if (next < 0) return;

                    event.preventDefault();

                    const nextStatus = WORKFLOW_STATUSES[next];

                    setSelectedLane(nextStatus);

                    document.getElementById(`tab-${nextStatus}`)?.focus();
                  }}
                  tabIndex={selectedLane === status ? 0 : -1}
                  className={[
                    "flex min-h-10 items-center justify-center",
                    "gap-1.5 rounded-md px-1.5",
                    "text-[11px] font-medium",
                    "focus-visible:outline-none",
                    "focus-visible:ring-2",
                    "focus-visible:ring-ring/35",
                    selectedLane === status
                      ? "bg-card text-foreground"
                      : "text-muted-foreground",
                  ].join(" ")}
                >
                  {laneAppearance[status].label}

                  <span className="text-[10px] tabular-nums text-muted-foreground">
                    {groups[status].length}
                  </span>
                </button>
              ))}
            </div>

            {canManageTasks && (
              <p className="mt-2 text-[10px] leading-5 text-muted-foreground">
                Use a task’s menu to move it between stages.
              </p>
            )}
          </div>
        )}

        {/* DRAG CONTEXT */}

        <DndContext
          sensors={canManageTasks ? sensors : []}
          onDragStart={canManageTasks ? handleDragStart : undefined}
          onDragEnd={canManageTasks ? handleDragEnd : undefined}
          onDragCancel={handleDragCancel}
        >
          <div
            className={
              wideBoard
                ? "grid min-w-0 grid-cols-3 items-start gap-4"
                : "grid min-w-0 grid-cols-1"
            }
          >
            {WORKFLOW_STATUSES.filter(
              (status) => wideBoard || selectedLane === status,
            ).map((status) => (
              <div
                key={status}
                id={`lane-${status}`}
                role={wideBoard ? undefined : "tabpanel"}
                aria-labelledby={wideBoard ? undefined : `tab-${status}`}
                className="min-w-0"
              >
                <TaskStatusBoard
                  status={status}
                  title={laneAppearance[status].label}
                  description={
                    filtering
                      ? "No matching tasks"
                      : `No ${
                          status === "active"
                            ? "active"
                            : status === "complete"
                              ? "completed"
                              : "pending"
                        } tasks`
                  }
                  tasks={filteredTasks.filter(
                    (task) => getWorkflowStatus(task) === status,
                  )}
                  project={project}
                  onTaskCreated={refreshWorkspace}
                  canManageTasks={canManageTasks}
                  onTaskMove={moveTask}
                  onTaskDelete={deleteTask}
                  busyTaskIds={busyTaskIds}
                  filtering={filtering}
                  className={wideBoard ? "max-h-[680px]" : ""}
                />
              </div>
            ))}
          </div>

          {/* DRAG PREVIEW */}

          {canManageTasks &&
            typeof document !== "undefined" &&
            createPortal(
              <DragOverlay
                adjustScale={false}
                dropAnimation={null}
                zIndex={100}
                style={{ pointerEvents: "none" }}
              >
                {activeTask ? (
                  <div
                    className="h-full w-full"
                    style={{
                      width: dragSize?.width,
                      height: dragSize?.height,
                    }}
                  >
                    <TaskCard
                      task={activeTask}
                      isOverlay
                      dragHandle={
                        <span aria-hidden="true" className="block h-8 w-6" />
                      }
                    />
                  </div>
                ) : null}
              </DragOverlay>,
              document.body,
            )}
        </DndContext>
      </div>

      {/* PROJECT DETAILS */}

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-h-[85dvh] overflow-y-auto border-border bg-card text-card-foreground shadow-none sm:max-w-lg">
          <DialogHeader className="text-left">
            <DialogTitle className="break-words text-xl font-medium">
              {project.title}
            </DialogTitle>

            <DialogDescription>
              Project details and current delivery status.
            </DialogDescription>
          </DialogHeader>

          <dl className="mt-2 divide-y divide-border/70">
            {[
              ["Project code", project.projectCode || "Not set"],
              ["Status", formatStatus(project.status)],
              ["Priority", formatStatus(project.priority || "Standard")],
              ["Due date", formatDate(project.dueDate)],
              ["Progress", `${progress}%`],
            ].map(([label, value]) => (
              <div
                key={label}
                className="grid grid-cols-[100px_minmax(0,1fr)] gap-4 py-3 text-xs"
              >
                <dt className="text-muted-foreground">{label}</dt>

                <dd className="break-words font-medium">{value}</dd>
              </div>
            ))}
          </dl>

          <Link
            to="/projects/new"
            className={`${quietAction} mt-2 justify-start px-0`}
          >
            <PlusIcon size={13} aria-hidden="true" />
            Create another project
          </Link>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* =========================================================
   SUMMARY ITEM
========================================================= */

function SummaryItem({
  label,
  value,
  icon = false,
  attention = false,
}: {
  label: string;
  value: string;
  icon?: boolean;
  attention?: boolean;
}) {
  return (
    <div className="min-w-0 border-t border-border/70 px-4 py-4 sm:border-l sm:px-5 xl:border-t-0">
      <p className="text-[11px] text-muted-foreground">{label}</p>

      <p
        className={[
          "mt-2 flex items-center gap-1.5",
          "text-xs font-medium",
          attention ? "text-status-overdue-foreground" : "text-foreground",
        ].join(" ")}
      >
        {attention ? (
          <TriangleAlertIcon size={13} aria-hidden="true" />
        ) : icon ? (
          <CalendarDaysIcon
            size={13}
            aria-hidden="true"
            className="shrink-0 text-muted-foreground"
          />
        ) : null}

        <span className="break-words">{value}</span>
      </p>
    </div>
  );
}
