import { Link } from "react-router-dom";
import { allocats } from "@/data/allocats"
import { AllocatCardGrid } from "@/components/AllocatCard";

function AllocatsSearch() {

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {allocats.map(allocat =>
                <AllocatCardGrid key={allocat.id} allocat={allocat} />
            )}
        </div>                
    );
}

export default AllocatsSearch;