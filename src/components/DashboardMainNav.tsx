import { Link } from "react-router-dom";
import allocatrLogoLight from "../assets/allocatr-neg-light.svg";
import { BellIcon, EllipsisVerticalIcon, UserCircleIcon } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
    children?: ReactNode;
}

function DashboardMainNav({children}: Props) {
    return (
        <nav className="flex items-center justify-between bg-background border-b px-4 py-2">
            <Link to="/projects" className="flex items-center">
                <img src={allocatrLogoLight} alt="Allocatr icon" className="w-24"/>
            </Link>
            <span>{children}</span>
            <span className="flex items-center space-x-4">
                <EllipsisVerticalIcon />
                <BellIcon />
                <UserCircleIcon />
            </span>
        </nav>
    );

}

export default DashboardMainNav;