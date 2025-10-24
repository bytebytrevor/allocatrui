import { Link } from "react-router-dom";
import allocatrLogoLight from "../assets/allocatr-neg-light.svg";
import allocatrLogoDark from "../assets/allocatr-dark-02.svg";
import { BellIcon, EllipsisVerticalIcon, Moon, Sun, UserCircleIcon } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useEffect, } from "react";

type Props = {
    children?: ReactNode;
}

function DashboardMainNav({children}: Props) {      
    const [theme, setTheme] = useState(
        localStorage.getItem("theme") || "dark"
    );

    const logo = theme == "dark" ? allocatrLogoLight : allocatrLogoDark;

    useEffect(() => {
        const root = document.documentElement;
        if (theme === "light") {
        root.classList.add("light");
        root.classList.remove("dark");
        } else {
        root.classList.add("dark");
        root.classList.remove("light");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    return (
        <nav className="flex items-center justify-between bg-background border-b px-4 py-2">
            <Link to="/projects" className="flex items-center">
                <img src={logo} alt="Allocatr icon" className="w-24"/>
            </Link>
            <span>{children}</span>
            <span className="flex items-center space-x-4">
                <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="p-1 rounded-full hover:bg-accent/20 transition-colors"
                    >
                    {/* {theme === "dark" ? "🌞" : "🌙"} */}
                    {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <EllipsisVerticalIcon />
                <BellIcon />
                <UserCircleIcon />
            </span>
        </nav>
    );

}

export default DashboardMainNav;