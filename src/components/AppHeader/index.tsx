import { ShoppingCartOutlined } from "@ant-design/icons";
import { Menu, Button, Dropdown, message     } from "antd";
import { Header } from "antd/es/layout/layout";
import { Link, Outlet, useNavigate } from "react-router-dom";

const AppHeader = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
    const handleLogout = () => {
          message.success("Logged out successfully (placeholder)");
      // Implement real logout logic
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userId");
      window.location.href = "/";
    };
  
  const handleOrdersClick = () => {
    navigate("/orders");
  };
  
    const menu = (
      <Menu>
        <Menu.Item key="orders" onClick={handleOrdersClick}>My Orders</Menu.Item>
        <Menu.Item key="logout" onClick={handleLogout}>Logout</Menu.Item>
      </Menu>
    );
  
  return (
      <>
      <Header className="flex justify-between items-center bg-white shadow px-6 py-2">
        <Link to="/">
        <div className="text-xl font-bold">🛍️ Dilma</div>
        </Link>
        <div className="flex items-center gap-4">

          {/* if not logged in, show login button */}
          {!userId && (
            <Button type="primary" onClick={() => window.location.href = "/auth/login"}>Login</Button>
          )}

          {/* if logged in, show cart button */}
          {userId && (
            <>
       <Dropdown overlay={menu} placement="bottomRight">
            <Button>User {userId}</Button>
          </Dropdown>
            </>
          )}
        </div>
      </Header>
      <Outlet />
          </>
    );
};
  
export default AppHeader;