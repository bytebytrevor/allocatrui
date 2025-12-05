import { Link } from "react-router-dom";
import AllocatrLogo from "./AllocatrLogo";

function MainNav() {
    const theme = localStorage.getItem("theme") || "dark";
    return (
        <nav className="w-full flex items-center justify-between py-2">
            <Link to="/"><AllocatrLogo theme={theme} className="w-24"/></Link>
            <div className="flex items-center gap-6">
                <Link to="" className="text-sm">Explore</Link>
                <Link to="" className="text-sm">Post a task</Link>
                {/* <Link to="" className="text-xs border py-2 px-8 ">Log in</Link> */}
                <Link to="" className="text-xs text-background bg-primary px-8 py-2 rounded-full hover:bg-primary/90 transition-colors duration-300">Log in</Link>
            </div>
        </nav>
    );
}

export default MainNav;