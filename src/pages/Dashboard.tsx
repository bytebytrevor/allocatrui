import { Outlet, useParams } from "react-router-dom";
import { Banknote, BlocksIcon, CalendarDaysIcon, ChartNoAxesColumnIcon, HeartIcon, MailIcon } from "lucide-react";
import DashboardNavLink from "@/components/DashboardNavLink";
import DashboardMainNav from "@/components/DashboardMainNav";

function Dashboard() {

    const params = useParams();

    return (
        <div className="flex flex-col h-screen">
            <header className="mb-8 border-b">
                <div className="px-4">
                    <DashboardMainNav />
                </div>
            </header>
            
            <main className="flex flex-1 gap-2 overflow-hidden"> 
                    <aside className="flex flex-col bg-brand-secondary text-white min-w-[200px] text-lg font-light space- rounded-tr-4xl">
                        <span className="py-2 pl-4 space-y-12 font-medium">Title</span>
                        <DashboardNavLink href={`/projects/${params.projectId}`} icon={BlocksIcon} label="Manager" />
                        <DashboardNavLink href={`/projects/${params.projectId}/calendar`} icon={CalendarDaysIcon} label="Calendar" />
                        <DashboardNavLink href={`/projects/${params.projectId}/messaging`} icon={MailIcon} label="Messaging" />
                        <DashboardNavLink href={`/projects/${params.projectId}/analytics`} icon={ChartNoAxesColumnIcon} label="Analytics" />
                        <DashboardNavLink href={`/projects/${params.projectId}/favorites`} icon={HeartIcon} label="Favorites" />
                        <DashboardNavLink href={`/projects/${params.projectId}/transactions`} icon={Banknote} label="Transactions" />
                    </aside>
                <div className="flex-1 pl-12 overflow-y-auto ">
                    <Outlet />
                </div>
            </main>
        </div>        
    )
}

export default Dashboard;

