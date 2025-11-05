import { CalendarDaysIcon, EllipsisVerticalIcon } from "lucide-react";
import { Progress } from "./ui/progress";
import type { Project } from "@/Types";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getProjectIcon } from "@/utils/projectIcons";

const MotionLink = motion.create(Link);

type Props = {
    props: Project
}

function ProjectCard({props}: Props) {
    const view: "grid" | "list" = "grid"; 

    return (
        <>
        {view === "grid" ? <Grid props={props}/> : 
        <div className="flex items-center w-full gap-4 bg-muted rounded-2xl py-4 px-6">
            {getProjectIcon(props?.type ?? "default")}  
            <div className="flex flex-col w-full">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm"><span className="font-light">{props.projectCode}</span> {props.title}</h3>
                    <EllipsisVerticalIcon size={20} className="text-foreground/50 hover:text-foreground hover:bg-background/40 rounded-full"/>
                </div> 
                <MotionLink
                    to={`${props.id}`}
                    className="flex justify-between mt-2 rounded-2xl"
                    whileHover={{ opacity: 0.7 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                    <div className="flex items-center gap-4 w-xl">                        
                        <div>                 
                            <span
                                className="flex items-center gap-1 font-light text-muted-foreground text-xs py-1"
                            >
                                <CalendarDaysIcon size={16} />Created { new Date(props.createdAt).toDateString()}
                            </span>       
                            <p className="text-[0.9rem] py-2">{props.description}</p>
                        </div>   
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
        </div>
        }
    </>
    );
}

export default ProjectCard;

function Grid({props}: Props) {

    return (
        <div className="flex flex-col items-start min-w-[300px] max-w-[360px] gap-4 bg-muted rounded-2xl py-4 px-6">
            <div className="flex items-center w-full justify-between">
                {getProjectIcon(props?.type ?? "default")}
                <EllipsisVerticalIcon size={20} className="text-foreground/50 hover:text-foreground hover:bg-background/40 rounded-full"/>
            </div> 
            <h3 className="font-bold text-sm"><span className="font-light">{props.projectCode}</span> {props.title}</h3>

            
            <MotionLink
                to={`${props.id}`}
                className="flex flex-col justify-between mt-2 rounded-2xl"
                whileHover={{ opacity: 0.7 }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
            >                
                <span
                    className="flex items-center gap-1 font-light text-muted-foreground text-xs"
                >
                    <CalendarDaysIcon size={16} />Created { new Date(props.createdAt).toDateString() }
                </span>       
                <p className="text-[0.9rem] py-2">{props.description}</p>               
                <span className="font-semibold">
                    {props.status}
                    <Progress value={props.progress} className="mt-1"/>
                </span>
                <p className="font-semibold text-sm pt-3">Allocat: <span className="font-normal">{props.projectCode}</span></p>
                    
            </MotionLink>
        </div>
    );
}