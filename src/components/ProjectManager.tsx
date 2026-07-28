import TaskStatusBoard from "./TaskStatusBoard";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { ArrowLeftIcon, EyeIcon, FolderIcon, FolderOpenIcon, FolderSymlinkIcon, PlusIcon, SendToBack, SendToBackIcon } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import type { Project } from "@/Types/project";
import type { Task } from "@/Types/task";
import api from "@/api/axios";
import { DndContext, DragOverlay, type DragStartEvent, type DragEndEvent } from "@dnd-kit/core";
import TaskCard from "./TaskCard";
import { Toaster } from "sonner";

function ProjectManager() {
  const [project, setProject] = useState<Project>();
  const [projectLoading, setProjectLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [tasks, setTasks] = useState<Task[]>();
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const params = useParams();

  const STATUSES = ["pending", "active", "complete", "overdue"] as const;
  type Status = typeof STATUSES[number];

  function isStatus(v: unknown): v is Status {
    return typeof v === "string" && (STATUSES as readonly string[]).includes(v);
  }

  function canMoveToOverdue(task: Task): boolean {
    if (!task.dueDate) return false;
    return new Date(task.dueDate).getTime() < Date.now();
  }

  async function refetchProject() {
    if (!params.projectId) return;
    const response = await api.get<Project>(`/projects/${params.projectId}`, {
      withCredentials: true
    });
    setProject(response.data);
  }

  // Fetch project by id
  useEffect(() => {
    if (!params.projectId) return;

    async function fetchProject() {
      try {
        setProjectLoading(true);

        const response = await api.get<Project>(`/projects/${params.projectId}`, {
          withCredentials: true
        });

        setProject(response.data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setProjectLoading(false);
      }
    }

    fetchProject();
  }, [params.projectId]);

  useEffect(() => {
    if (!params.projectId) return;

    async function fetchTasks() {
      try {
        setTasksLoading(true);

        const response = await api.get<Task[]>(`/projects/tasks/${params.projectId}`, {
          withCredentials: true
        });

        setTasks(response.data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err : new Error("Unknown"));
      } finally {
        setTasksLoading(false);
      }
    }

    fetchTasks();
  }, [params.projectId]);

  async function updateTaskStatus(taskId: string, status: Status) {
    await api.patch(
      `/projects/tasks/task/${taskId}/status`,
      { status },
      { withCredentials: true }
    );
  }

  async function refreshTasks() {
    if (!params.projectId) return;

    const response = await api.get<Task[]>(
        `/projects/tasks/${params.projectId}`,
        { withCredentials: true }
    );
    setTasks(response.data);
  }

  const activeTask = useMemo(() => {
    if (!activeTaskId) return null;
    // avoid crash if tasks ever contains undefined
    return (tasks ?? []).find((t): t is Task => !!t && t.id === activeTaskId) ?? null;
  }, [activeTaskId, tasks]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveTaskId(String(event.active.id));
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveTaskId(null);

    const { active, over } = event;
    if (!over) return;

    const taskId = String(active.id);
    const newStatusRaw = over.id;

    if (!isStatus(newStatusRaw)) return;
    const newStatus = newStatusRaw;

    const current = tasks?.find(t => t.id === taskId);
    if (!current) return;
    if (current.status === newStatus) return;

    // block moving to overdue unless dueDate has passed
    if (newStatus === "overdue" && !canMoveToOverdue(current)) {
      return;
    }

    // optimistic update
    const previousTasks = tasks ?? [];
    setTasks(prev =>
      (prev ?? []).map(t => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      await updateTaskStatus(taskId, newStatus);

      // refresh project to get backend-computed progress
      await refetchProject();
    } catch (e) {
      // revert
      setTasks(previousTasks);
      console.error(e);
    }
  };

  if (projectLoading || tasksLoading) return <p>Loading...</p>;
  if (error) return <p>Could not load project</p>;

  const pendingTaskList = tasks?.filter(task => task.status === "pending");
  const activeTaskList = tasks?.filter(task => task.status === "active");
  const completedTaskList = tasks?.filter(task => task.status === "complete");
  const overdueTaskList = tasks?.filter(task => task.status === "overdue");

  return (
    <>
        <Toaster />
        <div className="flex-1 flex flex-col h-full pb-4">        
          <section className="flex flex-col gap-5 pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <div>
                <Link
                  to="/projects"
                  className="flex items-center text-[0.7rem] text-primary/60 pb-3 gap-1 "
                >
                  <ArrowLeftIcon size="10" />
                  Back to projects
                </Link>
                <p className="flex text-xs font-medium uppercase tracking-wider text-muted-foreground gap-1">
                  {/* <FolderOpenIcon size="12" /> */}
                  <FolderOpenIcon size="12" />
                  Project workspace
                </p>

                <h1 className="text-2xl font-bold tracking-tight">
                  {project?.title}
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <Progress value={project?.progress ?? 0} className="h-2 w-72" />

                <span className="text-xs font-semibold text-muted-foreground">
                  {Math.round(project?.progress ?? 0)}%
                </span>
              </div>
            </div>

            <span className="space-x-2">
              <Button
                className="shadow-none"
                variant="outline"
              >
                  <EyeIcon size={16} />
                  View details
              </Button>

              <Link to="/projects/new">
                <Button className="shadow-none">
                  <PlusIcon size={16} />
                  New project
                </Button>
              </Link>
            </span>
            
          </section>

          <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <section className="mt-6 grid min-h-0 gap-12 items-start pb-4 md:grid-cols-2 xl:grid-cols-4 2xl:gap-4 ">
            
              <TaskStatusBoard
                status="pending"
                title="Pending"
                description="No pending tasks"
                tasks={pendingTaskList}
                project={project}
                onTaskCreated={refreshTasks}
                className="border-t-4 border-t-accent-3"
              />

              <TaskStatusBoard
                status="active"
                title="In progress"
                description="No active tasks"
                tasks={activeTaskList}
                project={project}
                onTaskCreated={refreshTasks}
                className="border-t-4 border-t-primary"
              />

              <TaskStatusBoard
                status="complete"
                title="Complete"
                description="No completed tasks"
                tasks={completedTaskList}
                project={project}
                onTaskCreated={refreshTasks}
                className="border-t-4 border-t-accent-2"
              />

              <TaskStatusBoard
                status="overdue"
                title="Overdue"
                description="No overdue tasks"
                tasks={overdueTaskList}
                project={project}
                onTaskCreated={refreshTasks}
                className="border-t-4 border-t-destructive"
              />
            </section>

            <DragOverlay>
            {activeTask ? (
                <div className="w-64">
                <TaskCard task={activeTask} isOverlay />
                </div>
            ) : null}
            </DragOverlay>
        </DndContext>
        </div>
    </>
  );
}

export default ProjectManager;