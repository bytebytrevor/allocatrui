import TaskStatusBoard from "./TaskStatusBoard";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Project, Task } from "@/Types";
import axios from "axios";

function ProjectManager() {
    const [project, setProject] = useState<Project>();
    const [projectLoading, setProjectLoading] = useState(true);
    const [tasksLoading, setTasksLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    
    const [tasks, setTasks] = useState<Task[]>();

    const params = useParams();



    // Fetch project by id
    useEffect(() => {
        if (!params.projectId) return;

        async function fetchProject() {
            try {
                setProjectLoading(true);

                const response = await axios.get<Project>(
                    `${import.meta.env.VITE_API_URL}/projects/${params.projectId}`,
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

                const response = await axios.get<Task[]>(
                    `${import.meta.env.VITE_API_URL}/projects/${params.projectId}/tasks`,
                    {
                        withCredentials: true,
                    }
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

    // console.log(tasks);


    {if (projectLoading || tasksLoading) return <p>Loading...</p>} 
    if (error) return <p>Could not load project</p>

    console.log(tasks);


    const completedTaskList = tasks?.filter(task => task.status == "complete");
    const activeTaskList = tasks?.filter(task => task.status == "active");
    const overdueTaskList = tasks?.filter(task => task.status == "overdue");
    const pendingTaskList = tasks?.filter(task => task.status == "pending");

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
                
                <section className="flex items-start gap-6 overflow-y-auto scrollbar-thin">                
                    <TaskStatusBoard
                        title="Completedo"
                        description="No completed tasks"
                        linkText="+ Click here to add"
                        tasks={completedTaskList}
                    />
                    <TaskStatusBoard
                        title="In progress"
                        description="You don't have any tasks"
                        linkText="+ Click here to add"
                        tasks={activeTaskList}
                    />
                    <TaskStatusBoard
                        title="Overdue"
                        description="No overdue tasks"
                        linkText="+ Click here to add"
                        tasks={overdueTaskList}
                    />
                    <TaskStatusBoard
                        title="Pending"
                        description="No pending tasks"
                        linkText="+ Click here to add"
                        tasks={pendingTaskList}
                    />
                </section>    
            </div> 
        </>
    );
}

export default ProjectManager;