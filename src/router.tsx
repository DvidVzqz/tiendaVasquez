// router.tsx
import { createBrowserRouter } from "react-router-dom";
import App from "./App";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <h1>Dashboard</h1> },
      { path: "users", element: <h1>Usuarios</h1> },
      { path: "settings", element: <h1>Configuración</h1> },
    ],
  },
]);

export default router;