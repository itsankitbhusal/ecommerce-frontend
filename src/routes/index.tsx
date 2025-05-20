import Home from "../pages/Home";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import Signup from "../pages/Signup";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/AdminDashboard";
import CategoryPage from "../pages/Category";
import ProductPage from "../pages/ProductPage";
import ProductDetails from "../pages/ProductDetailPage";
import UserOrders from "../components/UserOrders";
import AppHeader from "../components/AppHeader";
import AdminOrders from "../components/AdminOrders";
import UserList from "../components/UserList";

const routes = [
  {
    path: "/",
    element: <AppHeader />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "/product/:id",
        element: <ProductDetails />,
      },
      {
        path: "/orders",
        element: <UserOrders />,
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
      {
        path: "orders",
        element: <AdminOrders />,
      },
      {
        path: "users",
        element: <UserList />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
