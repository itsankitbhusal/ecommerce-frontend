import Home from "../pages/Home";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import Signup from "../pages/Signup";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/AdminDashboard";
import CategoryPage from "../pages/Category";

const routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/auth",
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "",
        element: <AdminDashboard />,
      },
      {
        path: "category",
        element: <CategoryPage />,
      },
      // Add more admin routes here
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
