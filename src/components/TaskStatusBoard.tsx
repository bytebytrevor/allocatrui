import { CalendarDaysIcon, CircleCheckBigIcon, CircleDashedIcon, CircleDotIcon, EllipsisVerticalIcon, ListTodoIcon, TriangleAlertIcon } from "lucide-react";
import { Link } from "react-router-dom";
import type { Task } from "../Types"

type Props = {
    title: string;
    description: string;
    linkText: string;
    tasks?: Task[];
}

function TaskStatusBoard({title, description, linkText, tasks}: Props) {
    return (               
        <section className="flex flex-col mt-8 min-h-60 max-h-full min-w-86 max-w-96 bg-muted rounded-md p-4">
            <h3 className="font-semibold text-xs text-foreground/80 pb-2">{title}</h3> 
            {tasks == null || tasks?.length == 0 ? (  
                <div className="flex-1 flex gap-x-4 items-center justify-center text-muted-foreground">
                    <ListTodoIcon />
                    <small className="flex flex-col">
                        {description}
                        <Link className="text-accent-3" to="">{linkText}</Link>
                    </small>
                </div>) : (
                <section className="flex-1 overflow-y-auto max-h-full scrollbar-thin">
                    {tasks?.map(task => (
                        // <div key={task.id} className="bg-background my-2 p-2 shadow-sm rounded-[6px]">
                        <div key={task.id} className="bg-linear-to-bl from-dark-gray/10 to-muted/20 my-2 p-2 shadow-sm border rounded-[6px]">
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col space-y-2">
                                    <h4 className="font-medium text-xs">{task.title}</h4>
                                    <span className="flex gap-1 items-center text-xs text-muted-foreground">
                                    {/* <span className="flex gap-1 items-center text-xs text-muted"> */}
                                        <CalendarDaysIcon size={14}/>
                                        Due {task.dueDate
                                            ? (` ${new Date(task.dueDate).toDateString()}`)
                                            : <span className="italic">Not specified</span>}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-4">
                                    {task.status == "complete" && <CircleCheckBigIcon size={16} className="text-accent-2"/>}
                                    {task.status == "active" && <CircleDotIcon size={16} className="text-primary"/>}
                                    {task.status == "overdue" && <TriangleAlertIcon size={16} className="text-destructive"/>}
                                    {task.status == "pending" && <CircleDashedIcon size={16} className="text-accent-3"/>}
                                    <EllipsisVerticalIcon size={16} className="text-muted-foreground hover:text-foreground"/>
                                </div>
                            </div>
                        </div>           
                    ))}     
                </section>
            )}              
        </section>    
    );
}

export default TaskStatusBoard;