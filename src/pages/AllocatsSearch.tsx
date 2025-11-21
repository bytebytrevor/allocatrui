
import { allocats } from "@/data/allocats"
import { AllocatCardGrid } from "@/components/AllocatCard";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import MinimalNavMenu from "@/components/MinimalNavMenu";
import MainNav from "@/components/MainNav";

function AllocatsSearch() {
    const loggedIn = false;
    const menu = loggedIn ? <MinimalNavMenu /> : <MainNav />

    return (        
        <>
            <header className="border-b">
                <div className="container mx-auto">
                    {menu}
                </div>
            </header>
            <main className="container mx-auto">
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
                                        className="w-full rounded-full"
                                    />
                                    {/* <Link to="" ><Button variant="outline" className="rounded-full"><MapPinIcon />Choose on map</Button></Link> */}
                            </span>
                        </form>
                        <span>
                            <Label className="mt-8">Max hourly rate</Label>
                            <Slider defaultValue={[33]} max={100} step={1} className="py-4" />
                        </span>
                        <span className="flex items-center gap-4">
                            <Label htmlFor="min-experience">Min experience</Label>
                            <Input type="number" name="min-experience" id="min-experience" defaultValue={1} className="w-[100px] rounded-full"/>
                        </span>

                    </aside>
                    <section className="w-full">
                        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                            {allocats.map(allocat =>
                                <AllocatCardGrid key={allocat.id} allocat={allocat} />
                            )}
                        </div>
                    </section>
                </div>
            </main>
        </>                
    );
}

export default AllocatsSearch;