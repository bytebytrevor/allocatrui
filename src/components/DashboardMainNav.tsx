import { Link, useNavigate } from "react-router-dom";
import { BellIcon, EllipsisVerticalIcon, LogOutIcon, Moon, SettingsIcon, Sun, User2Icon, UserCircleIcon } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useEffect, } from "react";
import { useAuth } from "@/auth/useAuth";
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

    const { user, logout } = useAuth();
    console.log(user);

    const navigate = useNavigate(); 

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
                <AllocatrLogo theme={theme} className="w-20"/>
            </Link>
            <span>{children}</span>
            <span className="flex items-center space-x-2">
                <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="p-1  hover:bg-muted-foreground/20 border rounded-full cursor-pointer transition-colors delay-150 duration-300"
                    >
                    {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <BellIcon size={26} className="hover:bg-muted-foreground/20 border rounded-full cursor-pointer p-1 transition-colors delay-150 duration-300"/>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <EllipsisVerticalIcon
                            size={26}
                            className="hover:bg-muted-foreground/20 border rounded-full cursor-pointer p-1 transition-colors delay-150 duration-300"
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

                <DropdownMenu>
                    <DropdownMenuTrigger className="w-6 h-6 rounded-full border-2 border-muted-foreground/20">
                        <Avatar className="rounded-full transition-all duration-300">
                            <AvatarImage
                                src={user?.avatarUrl}
                                className="h-full w-full rounded-full object-cover transition-opacity data-[state=loading]:opacity-0"
                            />
            
                            <AvatarFallback
                                className="text-foreground font-medium border"
                            >
                                {user?.fullName?.charAt(0) ?? <UserCircleIcon />}
                            </AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel className="flex items-center gap-2 text-muted-foreground bg-muted rounded-sm p-2">
                            <Avatar className="w-12 h-12 rounded-full border border-muted-foreground/20 transition-all duration-300 ">                        
                                    <AvatarImage
                                        src={user?.avatarUrl}
                                        className="h-full w-full rounded-full object-cover transition-opacity data-[state=loading]:opacity-0"
                                    />
                                    <AvatarFallback
                                        className="text-foreground font-medium border"
                                    >
                                        {user?.fullName?.charAt(0).toUpperCase() ?? <UserCircleIcon />}
                                    </AvatarFallback>
                            
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="font-bold text-sm">{user?.fullName?.split(" ")[0]}</span>
                                <span className="text-xs font-normal">{user?.email}</span>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate("/profile")}><User2Icon/>Profile</DropdownMenuItem>
                        <DropdownMenuItem><SettingsIcon/>Settings</DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={async () => {
                                await logout();      // clear backend cookie & front-end state
                                navigate("/login");  // redirects to login page
                            }}
                            className="text-destructive font-medium focus:bg-destructive/90 focus:text-white transition-all duration-300"
                        >
                            <LogOutIcon className="focus:text-white"/>
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </span>
        </nav>
    );

}

export default DashboardMainNav;