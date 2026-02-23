import TaskStatusBoard from "./TaskStatusBoard";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Project } from "@/Types/project";
import type { Task } from "@/Types/task";
import api from "@/api/axios";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";

function ProjectManager() {
    const [project, setProject] = useState<Project>();
    const [projectLoading, setProjectLoading] = useState(true);
    const [tasksLoading, setTasksLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    
    const [tasks, setTasks] = useState<Task[]>();

    const params = useParams();

    const STATUSES = ["pending", "active", "complete", "overdue"] as const;
    type Status = typeof STATUSES[number];

    function isStatus(v: unknown): v is Status {
    return typeof v === "string" && (STATUSES as readonly string[]).includes(v);
    }

    // Fetch project by id
    useEffect(() => {
        if (!params.projectId) return;

        async function fetchProject() {
            try {
                setProjectLoading(true);

                const response = await api.get<Project>(
                    `/projects/${params.projectId}`,
                    { withCredentials: true }
                );

                console.log(response.data);

                setProject(response.data);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err);
                } else {
                    setError(new Error("Unknown error"));
                }
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

                const response = await api.get<Task[]>(
                    `/projects/tasks/${params.projectId}`,
                    { withCredentials: true, }
                );
                setTasks(response.data);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err);
                } else {
                    setError(new Error("Unknown"));
                }
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

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        const taskId = String(active.id);
        const newStatusRaw = over.id;

        if (!isStatus(newStatusRaw)) return;
        const newStatus = newStatusRaw;

        const current = tasks?.find(t => t.id === taskId);
        if (!current) return;
        if (current.status === newStatus) return;

        // optimistic update
        const previousTasks = tasks ?? [];
        setTasks(prev =>
        (prev ?? []).map(t => (t.id === taskId ? { ...t, status: newStatus } : t))
        );

        try {
        await updateTaskStatus(taskId, newStatus);
        } catch (e) {
        // revert
        setTasks(previousTasks);
        console.error(e);
        }
    };


    // console.log(tasks);


    {if (projectLoading || tasksLoading) return <p>Loading...</p>} 
    if (error) return <p>Could not load project</p>

    console.log(tasks);

    const pendingTaskList = tasks?.filter(task => task.status == "pending");
    const activeTaskList = tasks?.filter(task => task.status == "active");
    const completedTaskList = tasks?.filter(task => task.status == "complete");    
    const overdueTaskList = tasks?.filter(task => task.status == "overdue");    

    return (
        <>
            <div className="flex-1 flex flex-col h-full pb-4">
                <section className="flex justify-between pr-12 pb-4 shrink-0">
                    <div className="flex flex-col space-y-4">
                        <span className="flex gap-4 items-center text-md">
                            <h2 className="font-semibold">{project?.title}</h2>
                        </span>
                        <Progress value={project?.progress} className="w-sm h-3"/>
                    </div>
                    <div>
                        <Link
                            to="/projects/new"
                        >
                            <Button variant="outline" className={"text-xs shadow-none" }>
                            <PlusIcon />Create new project</Button>
                        </Link>
                        {/* <Link
                            to="/projects/new"
                            className="flex items-center gap-1 text-foreground/80 text-sm font-medium"
                        >
                                <PlusIcon size={16} />
                                New project
                        </Link> */}
                    </div>
                </section>
                
                <DndContext onDragEnd={handleDragEnd}>
                    <section className="flex items-start gap-6 overflow-y-auto scrollbar-thin">                
                        <TaskStatusBoard
                        status="pending"
                            title="Pending"
                            description="No pending tasks"
                            linkText="+ Click here to add"
                            tasks={pendingTaskList}
                            project = {project}
                            className = "border-t-accent-3/80"
                        />
                        <TaskStatusBoard
                            status="active"
                            title="In progress"
                            description="You don't have any tasks"
                            linkText="+ Click here to add"
                            tasks={activeTaskList}
                            project={project}
                            className = "border-t-primary/80"
                        />                    
                        <TaskStatusBoard
                            status="complete"
                            title="Complete"
                            description="No completed tasks"
                            linkText="+ Click here to add"
                            tasks={completedTaskList}
                            project={project}
                            className = "border-t-accent-2/80"
                        />                    
                        <TaskStatusBoard
                            status="overdue"
                            title="Overdue"
                            description="No overdue tasks"
                            linkText="+ Click here to add"
                            tasks={overdueTaskList}
                            project={project}
                            className = "border-t-destructive/80"
                        />
                        
                    </section>
                </DndContext>    
            </div> 
        </>
    );
}

export default ProjectManager;