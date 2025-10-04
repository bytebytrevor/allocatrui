import ComboBox from "./ComboBox";
import TaskStatusBoard from "./TaskStatusBoard";
import {tasks} from "../data/tasks";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";

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
                        <Button className="rounded-full"><PlusIcon />Create new job</Button>
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
                </section>    
            </div> 
        </>
    );
}

export default ProjectManager;