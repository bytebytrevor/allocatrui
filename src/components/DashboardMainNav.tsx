import { Link } from "react-router-dom";
import allocatrIcon from "../assets/icon-variant-02.svg";
import { BellIcon, EllipsisVerticalIcon, UserCircleIcon } from "lucide-react";

function DashboardMainNav() {
    return (
        <nav className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center">
                <img src={allocatrIcon} alt="Allocatr icon" className="w-8"/>
                <h1 className="font-bold">Dashboard</h1>
            </Link>
            <span className="flex items-center space-x-4">
                <EllipsisVerticalIcon />
                <BellIcon />
                <UserCircleIcon />
            </span>
        </nav>
    );

}

export default DashboardMainNav;