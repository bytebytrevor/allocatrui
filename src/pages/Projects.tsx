import DashboardMainNav from "@/components/DashboardMainNav";
import ProjectCard from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import {
    ArrowDownNarrowWideIcon,
    CircleCheckBigIcon,
    CircleDotIcon,
    ClockIcon,
    HeartIcon,
    History,
    LightbulbIcon,
    LoaderCircleIcon,
    Megaphone,
    MessagesSquareIcon,
    PlusIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { projects } from "@/data/projects";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

function Projects() {
    return (
        <>
            <header className="sticky top-0 z-10">
                <DashboardMainNav />
            </header>
            <main className="container mt-8 mx-auto">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <h1 className="font-bold">Hi Thelly!</h1>
                        <span className="">You have 5 active projects</span>                        
                    </div>
                    <div className="flex items-center">
                        <Link to="/projects/new"><Button variant="outline" className="rounded-full"><PlusIcon />New project</Button></Link>
                    </div>
                </div>
                  
                <section className="flex gap-12 justify-between w-full mt-8">                    
                    <section className="w-full">
                        <form action="" className="focus:outline-none focus:border-none focus:ring-0 mb-4">
                            <Input
                                name="searchProject"
                                placeholder="Search project..."
                                id="searchProject"
                                className="search border-none rounded-full"
                            />
                        </form>                     
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Badge className="rounded-full bg-muted-foreground text-background"><CircleDotIcon /> Active</Badge>
                                <Badge className="rounded-full bg-muted text-foreground"><LoaderCircleIcon />Pending</Badge>
                                <Badge className="rounded-full bg-muted text-foreground"><CircleCheckBigIcon /> Closed</Badge>
                            </div>
                            <div className="flex">
                                <Button variant="link" className="flex items-center gap-1 text-foreground"><History />History</Button>
                                <Button variant="link" className="flex items-center gap-1 text-foreground"><ArrowDownNarrowWideIcon />Title</Button>
                            </div>
                        </div>
                        <div className="flex flex-col  gap-4 mb-6 mt-2">
                            {projects.map(project =>
                                <ProjectCard key={project.id} props={project} />
                            )}                            
                        </div>                        
                    </section>
                    <aside className="flex flex-col space-y-4 w-lg">
                        <article className="flex items-start gap-2 bg-muted px-6 py-10 rounded-2xl">
                            <span className=""><Megaphone size={40} /></span>
                            <div className="flex flex-col space-y-4">
                                <h3 className="font-bold">Advert Heading</h3>
                                <p className="text-[0.9rem]">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vero fugit doloremque eius placeat voluptatum, aliquam porro vitae repellat aperiam.</p>

                                <Button className="text-background rounded-full mt-4"><HeartIcon />Add to favorites</Button>
                            </div>                            
                        </article>
                        <article className="bg-muted p-6 rounded-2xl">
                            <div className="flex gap-2">
                            <span><LightbulbIcon /></span>
                            <div className="flex flex-col space-y-2">
                                <h3 className="font-bold">
                                    Tip of the day
                                </h3>
                                <p className="text-[0.9rem]">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus, nulla natus corporis.</p>
                                <Link className="text-accent-3" to="">Learn more</Link>
                            </div>
                            </div>
                        </article>
                        <article className="">
                            <div className="flex gap-2">
                            <span><MessagesSquareIcon /></span>
                            <div className="flex flex-col space-y-2">
                                <h3 className="font-bold">Jean sent you a message</h3>
                                <small className="flex items-center gap-1 text-muted-foreground"><ClockIcon size={14} />3 hrs ago</small>
                                <p className="text-[0.9rem]">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus, nulla natus corporis.</p>
                                <Link className="text-accent-3" to="">View chat</Link>
                            </div>
                            </div>
                        </article>
                    </aside>
                </section>
            </main>
        </>
    )
}

export default Projects;