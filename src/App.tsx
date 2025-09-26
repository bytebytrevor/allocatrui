import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AllocatsSearch from "./pages/AllocatsSearch";
import AllocatProfile from "./pages/AllocatProfile";

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />
    },
    {
      path: "/allocats/:profileId",
      element: <AllocatProfile />
    },
    {
      path: "/allocats",
      element: <AllocatsSearch />
    }
  ])

  return (
    <>
      <RouterProvider router={router}/>
    </>
  );
}

export default App;
