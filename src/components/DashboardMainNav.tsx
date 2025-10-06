import { Link } from "react-router-dom";
import allocatrLogoLight from "../assets/allocatr-neg-light.svg";
import { BellIcon, EllipsisVerticalIcon, UserCircleIcon } from "lucide-react";

function DashboardMainNav() {
    return (
        <nav className="flex items-center justify-between">
            <Link to="/dashboard/projects" className="flex items-center">
                <img src={allocatrLogoLight} alt="Allocatr icon" className="w-24"/>
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