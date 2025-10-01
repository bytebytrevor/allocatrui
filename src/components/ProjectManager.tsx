import { Link } from "react-router-dom";
import ComboBox from "./ComboBox";
import TaskStatusBoard from "./TaskStatusBoard";
import {tasks} from "../data/tasks";
import { Progress } from "./ui/progress";

function ProjectManager() {
    const completedTaskList = tasks.filter(task => task.status == "complete");
    const activeTaskList = tasks.filter(task => task.status == "active");
    const overdueTaskList = tasks.filter(task => task.status == "overdue");



    console.log(completedTaskList);

    return (
        <>
        <div className="flex-1 flex flex-col h-full pb-4">
            <section className="flex justify-between pr-12 pb-4 shrink-0">
                <div className="flex flex-col space-y-4">
                    <span className="font-light">Select job</span>
                    <ComboBox />
                    <h2 className="text-2xl font-bold"><span className="font-light">P06J</span> Braids Installation</h2>
                    <Progress value={68} className="h-4"/>
                </div>
                <div>
                    <Link to="" className="font-medium">+ Add new job</Link>
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
                    // tasks={overdueTaskList}
                />
            </section>
            
        </div>
        {/* <div className="h-40">

        </div> */}

        </>
    );
}

export default ProjectManager;