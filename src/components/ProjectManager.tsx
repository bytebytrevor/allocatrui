import TaskStatusBoard from "./TaskStatusBoard";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import ManagerComboBox from "./ManagerComboBox";
import { useEffect, useState } from "react";
import type { Project, Task } from "@/Types";
import axios from "axios";

function ProjectManager() {
    const [project, setProject] = useState<Project>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    
    const [tasks, setTasks] = useState<Task[]>();

    const params = useParams();



    // Fetch project by id
    useEffect(() => {
        if (!params.projectId) return;

        async function fetchProject() {
            try {
                setLoading(true);

                const response = await axios.get<Project>(
                    `${import.meta.env.VITE_API_URL}/projects/${params.projectId}`,
                    { withCredentials: true }
                );

                setProject(response.data);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err);
                } else {
                    setError(new Error("Unknown error"));
                }
            } finally {
                setLoading(false);
            }
        }

        fetchProject();
    }, [params.projectId]);

    useEffect(() => {
        async function fetchTasks() {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/tasks`,
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
                setLoading(false);
            }
        }

        fetchTasks();
    }, []);

    // console.log(tasks);


    if (loading) return <p>Loading...</p>    
    if (error) return <p>Could not load project</p>


    const projectTasks = tasks?.filter(t => t.projectId === params.projectId);
    console.log(projectTasks);

    const completedTaskList = projectTasks?.filter(task => task.status == "complete");
    const activeTaskList = projectTasks?.filter(task => task.status == "active");
    const overdueTaskList = projectTasks?.filter(task => task.status == "overdue");
    const pendingTaskList = projectTasks?.filter(task => task.status == "pending");

    return (
        <>
            <div className="flex-1 flex flex-col h-full pb-4">
                <section className="flex justify-between pr-12 pb-4 shrink-0">
                    <div className="flex flex-col space-y-4">
                        {/* <ManagerComboBox project={project} projects={projects} /> */}
                        <span className="flex gap-4 items-center text-md">
                            <h2 className="font-semibold">{project?.title}</h2>
                            {/* <Link to="" className="flex items-center gap-2 text-xs text-background font-medium bg-muted-foreground py-1 px-4 rounded-sm">
                                Switch project<ChevronDownIcon size={12} />
                            </Link> */}
                        </span>
                        <Progress value={project?.progress} className="w-sm h-3"/>
                    </div>
                    <div>
                        <Link to="/projects/new"><Button className={"text-xs " }><PlusIcon />New project</Button></Link>
                    </div>
                </section>
                
                <section className="flex items-start gap-6 overflow-y-auto scrollbar-thin">                
                    <TaskStatusBoard
                        title="Completed"
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