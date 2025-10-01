import { CalendarDaysIcon, CalendarHeartIcon, CalendarIcon, CircleCheckBigIcon, CircleDotIcon, ListTodoIcon, TriangleAlertIcon } from "lucide-react";
import { Link } from "react-router-dom";
import type { Task } from "../Types"

// type Task = {
//     id: number;
//     title: string;
// }

type Props = {
    title: string;
    description: string;
    linkText: string;
    tasks?: Task[];
}

function TaskStatusBoard({title, description, linkText, tasks}: Props) {
    return (               
        <section className="flex flex-col mt-8 min-h-60 max-h-full min-w-86 max-w-96 bg-[#202020] rounded-[6px] p-4">
            <h3 className="font-semibold pb-2">{title}</h3> 
            {tasks == null || tasks?.length == 0 ? (  
                <div className="flex-1 flex gap-x-4 items-center justify-center text-[#A4A4A4]">
                    <ListTodoIcon />
                    <small className="flex flex-col">
                        {description}
                        <Link className="text-[#00B1EA]" to="">{linkText}</Link>
                    </small>
                </div>) : (
                <section className="flex-1 overflow-y-auto max-h-600 scrollbar-thin">
                    {tasks?.map(task => (
                        <div className="bg-[#151515] my-1 p-2 shadow-md border rounded-[6px]">
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col space-y-2">
                                    <h2 className="font-bold text-sm">{task.title}</h2>
                                    {/* <p className="text-xs">The description will go here. Go and add a description prop in Task type</p> */}
                                    <span className="flex gap-1 items-center text-xs text-[#A4A4A4]">
                                        <CalendarDaysIcon size={14}/>
                                        {new Date("12-17-2025").toDateString()}
                                    </span>
                                </div>
                                <div>
                                    {task.status == "complete" && <CircleCheckBigIcon size={16} className="text-[#38D200]"/>}
                                    {task.status == "active" && <CircleDotIcon size={16} className="text-[#DEDA00]"/>}
                                    {task.status == "overdue" && <TriangleAlertIcon size={16} className="text-red-500"/>}
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