import { UserCircle } from "lucide-react";
import { useParams } from "react-router-dom";

function AllocatProfile() {

    const params = useParams();
    console.log(params);

    return (

        <main>
            <section className="container mx-auto flex items-center justify-items-center gap-4 bg-[#033D4F] p-4 rounded-2xl">
                <div>
                    <UserCircle size={164} strokeWidth={1}/>
                </div>
                <div>
                    <h1 className="text-4xl font-bold">Profile {params.profileId}</h1>
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam dicta
                    </p>
                </div>
            </section>
        </main>
    );
}

export default AllocatProfile;