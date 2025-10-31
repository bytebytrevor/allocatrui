import { CalendarDaysIcon, EllipsisVerticalIcon } from "lucide-react";
import { Progress } from "./ui/progress";
import type { Project } from "@/Types";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const MotionLink = motion.create(Link);

type Props = {
    props: Project
}

function ProjectCard({props}: Props) {
    return (
        <div className="bg-muted rounded-2xl p-2 shadow-sm/25">
            <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm pl-2"><span className="font-light">{props.projectCode}</span> {props.title}</h3>
                <EllipsisVerticalIcon size={36} className="text-foreground/50 hover:text-foreground p-2 hover:bg-background/40 rounded-full"/>
            </div> 
            <MotionLink
                to={`${props.id}`}
                className="flex justify-between  p-4 mt-2 rounded-2xl"
                whileHover={{ opacity: 0.7 }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
            >
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
                    </div>                    
                </div>
            </MotionLink>
        </div>
    );
}

export default ProjectCard;