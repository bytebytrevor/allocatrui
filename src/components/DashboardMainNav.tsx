import { Link } from "react-router-dom";
import { BellIcon, EllipsisVerticalIcon, Moon, PlusIcon, Sun } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useEffect, } from "react";
import AllocatrLogo from "./AllocatrLogo";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "./ui/avatar";
import drill from "@/assets/drill-square.svg"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "./ui/switch";

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
                    className="p-1 rounded-full hover:bg-muted-foreground/10 cursor-pointer transition-colors"
                    >
                    {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <BellIcon size={28} className="hover:bg-muted-foreground/10 rounded-full cursor-pointer p-1 transition-colors"/>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <EllipsisVerticalIcon
                            size={28}
                            className="hover:bg-muted-foreground/10 rounded-full cursor-pointer p-1 transition-colors"
                        />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Switch Mode</DropdownMenuItem>
                        <DropdownMenuItem>New project</DropdownMenuItem>
                        <DropdownMenuItem></DropdownMenuItem>
                        <DropdownMenuItem>Help and support</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Avatar className="w-8 h-8 border-4 rounded-full" >
                    <AvatarImage src="https://github.com/shadcn.png" className="rounded-full" />
                    {/* <AvatarImage src={drill} className="rounded-full"/> */}
                    <AvatarFallback className={`text-background bg-muted-foreground`}>
                        A
                    </AvatarFallback>
                </Avatar>
            </span>
        </nav>
    );

}

export default DashboardMainNav;