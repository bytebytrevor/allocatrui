import { Link, Outlet, useParams } from "react-router-dom";
import { ArrowRightLeftIcon, Banknote, BlocksIcon, CalendarDaysIcon, ChartNoAxesColumnIcon, EllipsisVerticalIcon, HeartIcon, MailIcon } from "lucide-react";
import DashboardNavLink from "@/components/DashboardNavLink";
import DashboardMainNav from "@/components/DashboardMainNav";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import type { Project } from "@/Types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

function Dashboard() {
    const [projects, setProjects] = useState<Project[]>([]);
    
    
    // Fetch all projects
    useEffect(() => {
        async function fetchProjects() {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/projects`,
                {
                    withCredentials: true,
                }
            );
            setProjects(response.data);
        }

        fetchProjects();
    }, []);

    const params = useParams();

    return (
        <div className="flex flex-col h-screen">
            <header className="mb-8 border-b">
                <div className="px-4">
                    <DashboardMainNav />
                </div>
            </header>


            
            <main className="flex flex-1 gap-2 overflow-hidden"> 
                    <aside className="flex flex-col justify-between bg-brand-secondary text-white min-w-[200px] text-lg font-light rounded-tr-4xl">
                        <div className="flex flex-col">
                            <Link to="" className="pt-4 pl-4 space-y-12 font-medium">Title</Link>
                            <DashboardNavLink href={`/projects/${params.projectId}`} icon={BlocksIcon} label="Manager" />
                            <DashboardNavLink href={`/projects/${params.projectId}/calendar`} icon={CalendarDaysIcon} label="Calendar" />
                            <DashboardNavLink href={`/projects/${params.projectId}/messaging`} icon={MailIcon} label="Messaging" />
                            <DashboardNavLink href={`/projects/${params.projectId}/analytics`} icon={ChartNoAxesColumnIcon} label="Analytics" />
                            <DashboardNavLink href={`/projects/${params.projectId}/favorites`} icon={HeartIcon} label="Favorites" />
                            <DashboardNavLink href={`/projects/${params.projectId}/transactions`} icon={Banknote} label="Transactions" />
                        </div>
                        <span className="py-6">
                            <DropdownMenu>
                                <DropdownMenuTrigger className="flex items-center gap-2 text-sm text-white bg-transparent hover:bg-transparent rounded-md px-4 font-medium focus:outline-none">
                                    Switch project
                                    <ArrowRightLeftIcon className="w-8 h-8 bg-brand-primary text-secondary p-2 rounded-sm" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-background">
                                    {projects.map(p => <DropdownMenuItem key={p.id}><Link to={`/projects/${p.id}`}>{p.title}</Link></DropdownMenuItem>)}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            
                        </span>
                    </aside>
                <div className="flex-1 pl-12 overflow-y-auto ">
                    <Outlet />
                </div>
            </main>
        </div>        
    )
}

export default Dashboard;

