import { CalendarDaysIcon, EllipsisVerticalIcon } from "lucide-react";
import { Progress } from "./ui/progress";
import type { Project } from "@/Types";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getProjectIcon } from "@/utils/projectIcons";
import { allocats } from "@/data/allocats";

const MotionLink = motion.create(Link);

type ViewProps = {
    project: Project;
}

export function ListView({project}: ViewProps) {
    const allocat = allocats.find(a => a.id === project.allocatId);

    return (
        <div className="flex items-center w-full gap-4 bg-muted rounded-2xl py-4 px-6">
            {getProjectIcon(project?.type ?? "default")}  
            <div className="flex flex-col w-full">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm"><span className="font-light">{project.projectCode}</span> {project.title}</h3>
                    <EllipsisVerticalIcon size={20} className="text-foreground/50 hover:text-foreground hover:bg-background/40 rounded-full"/>
                </div> 
                <MotionLink
                    to={`${project.id}`}
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
                                <CalendarDaysIcon size={16} />Created { new Date(project.createdAt).toDateString()}
                            </span>       
                            <p className="text-[0.9rem] py-2">{project.description}</p>
                        </div>   
                    </div>
                    <div className="flex gap-12">
                        <div className="flex flex-col items-end max-w-60">
                            <span className="flex items-center font-semibold">Status: {project.status}</span>
                            <Progress value={project.progress} className="mt-1"/>
                            <p className="font-semibold text-sm pt-3">Allocat: <span className="font-normal">{allocat?.fullName}</span></p>
                        </div>                    
                    </div>
                </MotionLink>
            </div>
        </div>
)}  

export function GridView({project}: ViewProps) {
    const allocat = allocats.find(a => a.id === project.allocatId);

    return (
        <div className="flex flex-col items-start gap-4 bg-muted rounded-xl py-4 px-6">
            <div className="flex items-center w-full justify-between">
                {getProjectIcon(project?.type ?? "default")}
                <EllipsisVerticalIcon size={20} className="text-foreground/50 hover:text-foreground hover:bg-background/40 rounded-full"/>
            </div> 
            <h3 className="font-bold text-sm"><span className="font-light">{project.projectCode}</span> {project.title}</h3>

            
            <MotionLink
                to={`${project.id}`}
                className="flex flex-col justify-between mt-2 rounded-2xl"
                whileHover={{ opacity: 0.7 }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
            >                
                <span
                    className="flex items-center gap-1 font-light text-muted-foreground text-xs"
                >
                    <CalendarDaysIcon size={16} />Created { new Date(project.createdAt).toDateString() }
                </span>       
                <p className="text-[0.9rem] py-2">{project.description}</p>               
                <span className="font-semibold">
                    {project.status}
                    <Progress value={project.progress} className="mt-1"/>
                </span>
                <p className="font-semibold text-sm pt-3">Allocat: <span className="font-normal">{allocat?.fullName}</span></p>                    
            </MotionLink>
        </div>
    );
}