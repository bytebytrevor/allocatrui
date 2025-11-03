import  { projects } from "../data/projects";
import TaskStatusBoard from "./TaskStatusBoard";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import ManagerComboBox from "./ManagerComboBox";

function ProjectManager() {
    // Fetch tasks for this project from database
    // useEffect(() => {
    //   fetch(`/api/projects/${projectId}/tasks`)
    //     .then(res => res.json())
    //     .then(data => setTasks(data));
    // }, [projectId]);

    const params = useParams();
    const currentProject = projects?.find(project => (
        project.id === params.projectId)
    );

    const projectTasks = currentProject?.tasks;

    const completedTaskList = projectTasks?.filter(task => task.status == "complete");
    const activeTaskList = projectTasks?.filter(task => task.status == "active");
    const overdueTaskList = projectTasks?.filter(task => task.status == "overdue");
    // const pendingTaskList = projectTasks?.filter(task => task.status == "pending");

    return (
        <>
            <div className="flex-1 flex flex-col h-full pb-4">
                <section className="flex justify-between pr-12 pb-4 shrink-0">
                    <div className="flex flex-col space-y-4">
                        <ManagerComboBox project={currentProject} projects={projects} />
                        <h2 className="flex gap-2 items-center text-xl font-medium">
                            <span className="font-light">{currentProject?.projectCode}</span>
                            {currentProject?.title}
                        </h2>
                        <Progress value={currentProject?.progress} className="h-3"/>
                    </div>
                    <div>
                        {/* <Link to="/projects/new"><Button variant="outline" className={"rounded-full" }><PlusIcon />New project</Button></Link> */}
                        <Link to="/projects/new"><Button className={"rounded-full" }><PlusIcon />New project</Button></Link>
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
                        // tasks={pendingTaskList}
                    />
                </section>    
            </div> 
        </>
    );
}

export default ProjectManager;