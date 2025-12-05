import { Link } from "react-router-dom";
import { BellIcon, EllipsisVerticalIcon, Moon, Sun } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useEffect, } from "react";
import AllocatrLogo from "./AllocatrLogo";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
    children?: ReactNode;
}

function DashboardMainNav({children}: Props) {      
    const [theme, setTheme] = useState(
        localStorage.getItem("theme") || "dark"
    );

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
        <nav className="flex items-center justify-between bg-background py-2">
            <Link to="/projects" className="flex items-center">
                <AllocatrLogo theme={theme} className="w-24"/>
            </Link>
            <span>{children}</span>
            <span className="flex items-center space-x-2">
                <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="p-1  hover:bg-muted-foreground/20 cursor-pointer transition-colors delay-150 duration-300"
                    >
                    {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <BellIcon size={28} className="hover:bg-muted-foreground/20  cursor-pointer p-1 transition-colors delay-150 duration-300"/>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <EllipsisVerticalIcon
                            size={28}
                            className="hover:bg-muted-foreground/20  cursor-pointer p-1 transition-colors delay-150 duration-300"
                        />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Switch Mode</DropdownMenuItem>
                        <DropdownMenuItem>New project</DropdownMenuItem>
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuItem>Help and support</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Avatar className="w-6 h-6 rounded-full ring-0 hover:ring-3 ring-muted-foreground/20 transition-all duration-300">
                    <AvatarImage src="https://github.com/shadcn.png" className="rounded-full"/>
                    {/* <AvatarImage src={drill} /> */}
                    <AvatarFallback className={`text-background bg-muted-foreground`}>
                        A
                    </AvatarFallback>
                </Avatar>
            </span>
        </nav>
    );

}

export default DashboardMainNav;