import { Link } from "react-router-dom";
import AllocatrLogo from "./AllocatrLogo";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ChevronRightIcon, UserCircleIcon } from "lucide-react";
import { useAuth } from "@/auth/useAuth";

function MinimalNavMenu() {
    const theme = localStorage.getItem("theme") || "dark";

    const { user } = useAuth();

    return (
        <nav className="flex items-center justify-between mx-auto py-2">
            <AllocatrLogo theme={theme} className="w-24"/>
            <span className="flex items-center gap-8">
                <Link to="/projects" className="flex items-center text-sm font-semibold">
                    Go to dashboard<ChevronRightIcon size={14} />
                </Link>
                <Avatar className="w-6 h-6 rounded-full ring-0 ring-muted-foreground/20 transition-all duration-300">
                    {user?.avatarUrl ? (
                        <AvatarImage src={user.avatarUrl} />
                    ) : (
                        <AvatarFallback
                            className="text-foreground font-medium border "
                        >
                            {user?.avatarUrl || user?.fullName?.toString()[0] || <UserCircleIcon />}
                        </AvatarFallback>
                    )}
                </Avatar>
            </span>
        </nav>
    );              
}

export default MinimalNavMenu;