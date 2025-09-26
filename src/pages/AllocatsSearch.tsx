import { Link } from "react-router-dom";

function AllocatsSearch() {
    const allocats = [1, 2, 3, 4, 5];

    return (
        <div className="flex flex-col p-12">
            {allocats.map(allocat =>
                <Link key={allocat} className="py-2" to={`/allocats/${allocat}`}>Allocat {allocat}</Link>
            )}
        </div>                
    );
}

export default AllocatsSearch;