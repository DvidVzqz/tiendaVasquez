// router.tsx
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import Search from "./pages/Search";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "search", element: <Search /> },
      { path: "settings", element: <h1>Configuración</h1> },
    ],
  },
]);

export default router;