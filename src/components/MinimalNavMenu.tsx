import { Link } from "react-router-dom";
import AllocatrLogo from "./AllocatrLogo";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ChevronRightIcon } from "lucide-react";
import drill from "@/assets/drill-square.svg"

function MinimalNavMenu() {
    const theme = localStorage.getItem("theme") || "dark";

    return (
        <nav className="flex items-center justify-between mx-auto py-2">
            <AllocatrLogo theme={theme} className="w-24"/>
            <span className="flex items-center gap-8">
                <Link to="/projects" className="flex items-center text-sm font-semibold">
                    Go to dashboard<ChevronRightIcon size={14} />
                </Link>
                <Avatar className="w-6 h-6 ring-0 hover:ring-3 ring-muted-foreground/20 transition-all duration-300">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    {/* <AvatarImage src={drill} /> */}
                    <AvatarFallback className={`text-background bg-muted-foreground`}>
                        A
                    </AvatarFallback>
                </Avatar>
            </span>
        </nav>
    );              
}

export default MinimalNavMenu;