import Home from "../pages/Home";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import Signup from "../pages/Signup";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/AdminDashboard";
import CategoryPage from "../pages/Category";
import ProductPage from "../pages/ProductPage";
import ProductDetails from "../pages/ProductDetailPage";

const routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/product/:id", // ✅ Product details route
    element: <ProductDetails />,
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
      {
        path: "product",
        element: <ProductPage />,
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
