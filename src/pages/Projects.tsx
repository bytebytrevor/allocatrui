import DashboardMainNav from "@/components/DashboardMainNav";
import {GridView, ListView} from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import Electricians from "@/assets/electrician-wide.svg";
import AllocatrIcon from "@/assets/icon-variant-02.svg";
import { useState, useEffect } from "react";
import type { Project } from "@/Types/project";
import { useAuth } from "@/auth/AuthContext";
import {
    ArrowDownNarrowWideIcon,
    CircleCheckBigIcon,
    CircleDotIcon,
    ClockIcon,
    FolderOpenDot,
    History,
    LayoutGrid,
    LightbulbIcon,
    ListIcon,
    LoaderCircleIcon,
    Megaphone,
    MessagesSquareIcon,
    NotepadText,
    PlusIcon,
} from "lucide-react";
import api from "@/api/axios";

function Projects() {
    const [view, setView] = useState("grid");    

    function switchView() {
        view === "grid" ? setView("list") : setView("grid");
    }

    const { user } = useAuth();

    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchProjects() {
            try {
                const response = await api.get(
                    "/projects/mine",
                    { withCredentials: true, }
                );
                setProjects(response.data);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err);
                } else {
                    setError(new Error("Unknown"));
                }
            } finally {
                setLoading(false);
            }
        }

        fetchProjects();
    }, []);


    if (loading) return <p>Loading...</p>    
    if (error) return <p>Could not load projects</p>

    console.log(projects);

    return (
        <div className="min-h-screen flex flex-col">
            <header className="sticky top-0 z-10 border-b">
                <div className="container mx-auto px-4">
                    <DashboardMainNav />
                </div>
            </header>

            <main className={projects.length === 0 ? (
                "flex-1 h-screen flex flex-col container px-4 mx-auto") : (
                "container mt-6 px-4 mx-auto"

            )}>                  
                {projects.length === 0 ? (
                    <div className="h-full w-lg flex-1 flex flex-col items-center justify-center mx-auto">                        
                            <FolderOpenDot className="w-24 h-24" />
                            {/* <img src={AllocatrIcon} alt="Allocatr icon" className="w-20 rounded-full"/> */}
                            <div>Hi <span className="font-semibold">{user?.fullName?.split(" " )[0]}!</span></div>
                            <h3 className="flex items-center gap-1 text-2xl font-bold">
                                <CircleCheckBigIcon size={15} strokeWidth={3} />
                                Your workspace is ready
                            </h3>
                            <span
                                className="flex items-center gap-1 text-xs text-muted-foreground font-medium"
                            >
                                {/* Your workspace is ready <CircleCheckBigIcon size={12} strokeWidth={3} /> */}
                            </span>
                            <p className="text-sm text-center text-muted-foreground py-4">
                                Your dashboard is empty because you haven't created a project. Start one now and begin working with skilled experts
                            </p>
                            <Link to="/projects/new">
                                <Button className="h-12 text-xs font-medium px-12 mt-4">Create new project</Button>
                            </Link>   
                                         
                    </div>) : (
                        <section className="flex-1 flex gap-12 justify-between w-full">              
                        <section className="w-full">
                            <div className="flex items-center justify-between border-b py-4">
                                <div className="flex items-center gap-2">
                                    <NotepadText size={60} className="text-primary" />
                                    <div>
                                        <h1 className="text-xl font-medium">Hi {user?.fullName?.split(" ")[0]} 👋</h1>
                                        <p className="text-sm text-muted-foreground">You have 5 active projects in progress.</p> 
                                    </div>              
                                </div>
                                <div className="flex items-center">
                                    <Link to="/projects/new">
                                        <Button variant="outline" className="text-xs shadow-none">
                                            <PlusIcon />Create new project
                                        </Button>
                                    </Link>
                                </div>
                            </div>                       
                            
                            <div className="flex items-center justify-between mt-8">
                                <div className="flex items-center gap-2">
                                    <Badge className=" bg-muted-foreground text-background"><CircleDotIcon /> Active</Badge>
                                    <Badge className=" bg-muted text-foreground"><LoaderCircleIcon />Pending</Badge>
                                    <Badge className=" bg-muted text-foreground"><CircleCheckBigIcon /> Closed</Badge>
                                </div>
                                <div className="flex">
                                    <Button variant="link" className="flex items-center gap-1 text-foreground"><History />History</Button>
                                    <Button variant="link" className="flex items-center gap-1 text-foreground"><ArrowDownNarrowWideIcon />Title</Button>
                                    <Button
                                        variant="link"
                                        className="flex items-center gap-1 text-foreground"
                                        onClick={() => switchView()}
                                    >
                                        {view === "grid" ? <ListIcon /> : <LayoutGrid />}
                                    </Button>
                                </div>
                            </div>
                            <div className={`flex gap-2 w-full mt-2 mb-6 ${view ==="grid"
                                ?
                                    "grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3"
                                :
                                    "flex-col"}`}
                                >
                                    {projects.map(project => view === "grid"
                                        ?
                                            <GridView key={project.id} project={project} />
                                        :
                                            <ListView key={project.id} project={project} />
                                    )}                            
                            </div>                        
                        </section>
                        <aside className="hidden flex flex-col space-y-4 w-lg xl:block">
                            <div>
                                <img src={Electricians} alt="" className="rounded-t-2xl"/>
                                <article className="flex items-start gap-2 bg-muted px-6 py-10 rounded-b-2xl">
                                    <span className=""><Megaphone size={40} /></span>
                                    <div className="flex flex-col space-y-4">
                                        <h3 className="font-bold">Advert Heading</h3>
                                        <p className="text-[0.9rem]">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vero fugit doloremque eius placeat voluptatum, aliquam porro vitae repellat aperiam.</p>
                                        <span><Button className="text-xs font-semibold  mt-4 px-6">View profile</Button></span>
                                    </div>                        
                                </article>
                            </div>
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
                )}
            </main>
        </div>
    )
}

export default Projects;