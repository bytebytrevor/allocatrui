import { useParams } from "react-router-dom";

function AllocatProfile() {

    const params = useParams();
    console.log(params);

    return (
        <h1>Profile {params.profileId}</h1>
    );
}

export default AllocatProfile;