import SpaceCat from "../assets/space-cat.svg";

function NotFoundErrorPage() {
    return (
        // <h1>Hello</h1>
        <div className="flex items-center justify-center">
            <img src={SpaceCat} alt="Space cat" className="w-120" />
        </div>
    );
}

export default NotFoundErrorPage;