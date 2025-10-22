import { Link } from "react-router-dom";
import allocatrLogoLight from "../assets/allocatr-neg-light.svg";
import allocatrLogoDark from "../assets/allocatr-dark.svg";
import { BellIcon, EllipsisVerticalIcon, UserCircleIcon } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Switch } from "./ui/switch";

type Props = {
    children?: ReactNode;
}

function DashboardMainNav({children}: Props) {       
    const [dark, setDark] = useState(false);
    const logo = dark ? allocatrLogoLight : allocatrLogoDark;

    
    function toggleDarkMode() {     
        const html = document.querySelector('html');    
        if (html?.classList.contains("dark")) {
            html?.classList.remove("dark");
            return false;
        } else {
            html?.classList.add("dark");
            return true;
        }            
    }

    return (
        <nav className="flex items-center justify-between bg-background border-b px-4 py-2">
            <Link to="/projects" className="flex items-center">
                <img src={logo} alt="Allocatr icon" className="w-24"/>
            </Link>
            <span>{children}</span>
            <span className="flex items-center space-x-4">
                <Switch onClick={() => setDark(toggleDarkMode())} />
                <EllipsisVerticalIcon />
                <BellIcon />
                <UserCircleIcon />
            </span>
        </nav>
    );

}

export default DashboardMainNav;