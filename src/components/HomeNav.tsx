import { Button } from "./ui/button";
import assets from "@/assets/assets";

function HomeNav() {
    return (
        <nav className="container w-full flex items-center justify-between mx-auto px-4 py-2">
            <a href="/">
                <img src={assets.allocatrNegLightLogo} alt="Allocatr logo" className="w-32" />
            </a>
            <div className="flex items-center gap-6">
                <a href="">Explore</a>
                <a href="">Post a task</a>
                <Button className="rounded-full bg-[#DEDA00] text-[#033D4F]">Get started</Button>
            </div>
        </nav>
    );
}

export default HomeNav;