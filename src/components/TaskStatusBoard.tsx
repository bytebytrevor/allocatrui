import { CalendarIcon, ListTodoIcon } from "lucide-react";
import { Link } from "react-router-dom";

type Task = {
    id: number;
    title: string;
}

type Props = {
    title: string;
    description: string;
    linkText: string;
    tasks?: Task[];
}

function TaskStatusBoard({title, description, linkText, tasks}: Props) {
    return (               
        <section className="flex flex-col mt-8 min-h-60 min-w-86 max-w-96 bg-[#202020] rounded-[6px] p-4">
            <h3 className="font-semibold pb-2">{title}</h3> 
            {tasks == null || tasks?.length == 0 ? (  
                <div className="flex-1 flex gap-x-4 items-center justify-center text-[#A4A4A4]">
                    <ListTodoIcon />
                    <small className="flex flex-col">
                        {description}
                        <Link className="text-[#00B1EA]" to="">{linkText}</Link>
                    </small>
                </div>) : (
                <section className="flex-1 overflow-y-auto scrollbar-thin">
                    {tasks?.map(task => (
                        <div className=" bg-[#151515] my-2 p-2 shadow-md border rounded-[6px] space-y-2">
                            <h2 className="font-bold text-sm">{task.title}</h2>
                            <p className="text-xs">The description will go here. Go and add a description prop in Task type</p>
                            <span className="flex gap-1 items-center text-xs text-[#A4A4A4]">
                                <CalendarIcon size={14}/>
                                {new Date("2025-03-25").toLocaleString()}
                            </span>
                        </div>
                        ))}     
                </section>
            )}              
        </section>    
    );
}

export default TaskStatusBoard;