import { CalendarDaysIcon, EllipsisVerticalIcon } from "lucide-react";
import { Progress } from "./ui/progress";
import type { Project } from "@/Types";
import { Link } from "react-router-dom";

type Props = {
    props: Project
}

function ProjectCard({props}: Props) {
    return (
        <div className="bg-muted rounded-2xl p-2">
            <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm pl-2"><span className="font-light">{props.projectCode}</span> {props.title}</h3>
                <EllipsisVerticalIcon size={36} className="text-white/20 hover:text-white p-2 hover:bg-background/40 rounded-full"/>
            </div> 
            <Link to={`${props.id}`} className="flex justify-between bg-background p-4 mt-2 rounded-2xl">
                <div className="w-xl">
                    
                    <span
                        className="flex items-center gap-1 font-light text-muted-foreground text-xs py-1"
                    >
                        <CalendarDaysIcon size={16} />Created { new Date(props.createdAt).toDateString()}
                    </span>       
                    <p className="text-[0.9rem] py-2">{props.description}</p>
                </div>
                <div className="flex gap-12">
                    <div className="flex flex-col items-end max-w-60">
                        <span className="flex items-center font-semibold">Status: {props.status}</span>
                        <Progress value={props.progress} className="mt-1"/>
                        <p className="font-semibold text-sm pt-3">Allocat: <span className="font-normal">{props.projectCode}</span></p>
                        {/* <p className="flex items-center gap-1 text-muted-foreground font-light">
                            <CalendarDaysIcon size={16} />Due {new Date(props.dueDate ?? "").toDateString()}
                        </p> */}
                    </div>                    
                </div>
            </Link>
        </div>
    );
}

export default ProjectCard;