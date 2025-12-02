import { AllocatCardGrid } from "@/components/AllocatCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { allocats } from "@/data/allocats";
import { Slider } from "@/components/ui/slider";
import MinimalNavMenu from "@/components/MinimalNavMenu";
import { projects } from "@/data/projects";
import { useParams } from "react-router-dom";

function FindAllocats() {
    const params = useParams();
    params.projectId;
    const project = projects.find(p => p.id == params.projectId);

    return (        
        <>
            <header className="sticky top-0 border-b px-2 z-10">
                <div className="container mx-auto">
                    <MinimalNavMenu />
                </div>             
            </header>
            <main className="container mx-auto px-2 py-8">
                <h1 className="text-2xl font-bold mb-4">Fix electrical wiring</h1>
                <div className="w-full border-b">
                    <p className="max-w-3xl text-xs text-muted-foreground py-4 md:text-sm">
                        We've listed the most suitable allocats based on your project details and location. You can adjust your location or refine your search filters to find the best match for your project.
                    </p>                            
                </div>
                <div className="flex flex-col items-start gap-4 mt-8 lg:flex-row">
                    <aside className="w-full border rounded-2xl p-4 lg:w-sm">
                        <form>
                            <span className="">
                                    <Label htmlFor="location" className="py-2">Location</Label>
                                    <Input
                                        type="text"
                                        name="location"
                                        id="location"
                                        defaultValue="Zimbabwe, Harare"
                                        placeholder="Location"
                                        className="w-full "
                                    />
                                    {/* <Link to="" ><Button variant="outline" className=""><MapPinIcon />Choose on map</Button></Link> */}
                            </span>
                        </form>
                        <span>
                            <Label className="mt-8">Max hourly rate</Label>
                            <Slider defaultValue={[33]} max={100} step={1} className="py-4" />
                        </span>
                        <span className="flex items-center gap-4">
                            <Label htmlFor="min-experience">Min experience</Label>
                            <Input type="number" name="min-experience" id="min-experience" defaultValue={1} className="w-[100px] "/>
                        </span>

                    </aside>
                    <section className="w-full">
                        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                            {allocats.map(allocat =>
                                <span key={allocat.id}className="max-w-sm"><AllocatCardGrid allocat={allocat} project={project} /></span>
                            )}        
                        </div>
                    </section>
                </div> 
            </main>
        </>
    );
}

export default FindAllocats;