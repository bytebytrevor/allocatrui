import { CalendarDaysIcon, EllipsisVerticalIcon } from "lucide-react";
import { Progress } from "./ui/progress";
import type { Project } from "@/Types";

type Props = {
    props: Project
}

function ProjectCard({props}: Props) {
    return (
        <div className="flex justify-between bg-accent p-4 border rounded-[6px]">
            <div className="w-xl">
                <h3 className="font-bold text-xl"><span className="font-light">{props.projectCode}</span> {props.title}</h3> 
                <span
                    className="flex items-center gap-1 font-light text-muted-foreground py-1"
                >
                    <CalendarDaysIcon size={16} />Created { new Date(props.createdAt).toDateString()}
                </span>       
                <p className="text-sm py-2">{props.description}</p>
            </div>
            <div className="flex gap-12">
                <div className="flex flex-col items-end max-w-60">
                    <span className="flex items-center font-semibold">Status: {props.status}</span>
                    <Progress value={props.progress} className="mt-1"/>
                    <p className="font-semibold pt-3">Allocat: <span className="font-normal">{props.allocatId}</span></p>
                    <p className="flex items-center gap-1 text-muted-foreground font-light">
                        <CalendarDaysIcon size={16} />Due {new Date(props.dueDate).toDateString()}
                    </p>
                </div>
                <EllipsisVerticalIcon size={42} className="text-white/20 hover:text-white p-2 hover:bg-background/40 rounded-full"/>
            </div>
        </div>
    );
}

export default ProjectCard;