import { Link } from "react-router-dom";
import SpaceCat from "../assets/space-cat.svg";
import MainNav from "./MainNav";
import { Button } from "./ui/button";

function NotFoundErrorPage() {
    return (
        <div className="flex flex-col h-screen mx-0">
            <header className="border-b">            
                <div className="container mx-auto">
                    <MainNav />
                </div>
            </header>
            <main className="flex-1 flex h-full items-center justify-center content-center">
                <div className="container flex items-center gap-12 w-4xl">
                    <img src={SpaceCat} alt="Space cat" className="w-90 content-center" />
                    <div className="space-y-4">
                        <h2 className="text-6xl font-bold uppercase">Oops! Page not found.</h2>
                        <p className="">Looks like Schrödinger's cat fell off the map.. but don't worry, you haven't hit your 9th life just yet.</p>
                        <Button
                            asChild
                            className=""
                        >
                            <Link to="/"> Respawn to Earth</Link>
                        </Button>                        
                    </div>
                </div>
            </main>
        </div>
    );
}

export default NotFoundErrorPage;