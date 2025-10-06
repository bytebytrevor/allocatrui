import { Outlet, useLocation } from "react-router-dom";
import { Banknote, BlocksIcon, CalendarDaysIcon, ChartNoAxesColumnIcon, HeartIcon, MailIcon } from "lucide-react";
import DashboardNavLink from "@/components/DashboardNavLink";
import DashboardMainNav from "@/components/DashboardMainNav";

function Dashboard() {
    const location = useLocation();

    const hideSidebar = location.pathname === "/dashboard/projects";

    return (
        <div className="flex flex-col h-screen">
            <header className="mb-8 border-b px-4 py-2">
                <DashboardMainNav />
            </header>
            
            <main className="flex flex-1 gap-2 overflow-hidden">                
                {!hideSidebar && (
                    <aside className="flex flex-col bg-secondary min-w-[200px] text-lg font-light space- rounded-tr-4xl">
                        <span className="py-2 pl-4 space-y-12 font-medium">Title</span>
                        <DashboardNavLink href="/dashboard/projects/id" icon={BlocksIcon} label="Manager" />
                        <DashboardNavLink href="/dashboard/calendar" icon={CalendarDaysIcon} label="Calendar" />
                        <DashboardNavLink href="/dashboard/messaging" icon={MailIcon} label="Messaging" />
                        <DashboardNavLink href="/dashboard/analytics" icon={ChartNoAxesColumnIcon} label="Analytics" />
                        <DashboardNavLink href="/dashboard/favorites" icon={HeartIcon} label="Favorites" />
                        <DashboardNavLink href="/dashboard/transactions" icon={Banknote} label="Transactions" />
                    </aside>)}
                <div className="flex-1 pl-12 overflow-y-auto ">
                    <Outlet />
                </div>
            </main>
        </div>        
    )
}

export default Dashboard;

