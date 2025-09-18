import { Button } from "./ui/button";

function HomeNav() {
    return (
        <nav className="container w-full flex items-center justify-between mx-auto px-4 py-6">
            <h1 className="text-4xl font-bold">allocatr</h1>
            <div className="flex items-center gap-6">
                <a href="">Explore</a>
                <a href="">Post a task</a>
                <Button className="rounded-full bg-[#DEDA00] text-[#033D4F]">Get started</Button>
            </div>
        </nav>
    );
}

export default HomeNav;