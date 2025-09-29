import { Link, Outlet } from "react-router-dom";
import { Banknote, BlocksIcon, CalendarDaysIcon, ChartNoAxesColumnIcon, HeartIcon, MailIcon } from "lucide-react";

function Dashboard() {
    return (
        <div className="flex flex-col h-screen bg-[#151515]">
            <header className="mb-8 border-b-1 border-[#474E51]">
                <h1 className="p-4 font-bold">Dashboard</h1>
            </header>
            
            <main className="flex flex-1 flex gap-2">
                <aside className="flex flex-col bg-[#033D4F] w-[200px] text-lg font-light space- rounded-tr-4xl">
                    <span className="py-2 pl-4 space-y-12 font-medium">Title</span>
                    <Link className="flex gap-2 bg-red-500 py-2 pl-4" to="/dashboard"><BlocksIcon /> Manager</Link>
                    <Link className="flex gap-2 py-2 pl-4" to="/dashboard/calender"><CalendarDaysIcon /> Calender</Link>
                    <Link className="flex gap-2 py-2 pl-4" to="/dashboard/messaging"><MailIcon /> Messaging</Link>
                    <Link className="flex gap-2 py-2 pl-4"to="/dashboard/analytics"><ChartNoAxesColumnIcon /> Analytics</Link>
                    <Link className="flex gap-2 py-2 pl-4"to="/dashboard/favorites"><HeartIcon /> Favorites</Link>
                    <Link className="flex gap-2 py-2 pl-4"to="/dashboard/transactions"><Banknote /> Transations</Link>
                </aside>
                <Outlet />
            </main>
        </div>        
    )
}

export default Dashboard;