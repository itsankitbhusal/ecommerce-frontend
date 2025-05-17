import { ShoppingCartOutlined } from "@ant-design/icons";
import { Menu, Button, Dropdown, message     } from "antd";
import { Header } from "antd/es/layout/layout";

const AppHeader = ({ onOpenCart }: { onOpenCart: () => void }) => {
  const userId = localStorage.getItem("userId");
    const handleLogout = () => {
          message.success("Logged out successfully (placeholder)");
      // Implement real logout logic
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userId");
      window.location.href = "/";
    };
  
    const menu = (
      <Menu>
        <Menu.Item key="logout" onClick={handleLogout}>Logout</Menu.Item>
      </Menu>
    );
  
    return (
      <Header className="flex justify-between items-center bg-white shadow px-6 py-2">
        <div className="text-xl font-bold">🛍️ Dilma</div>
        <div className="flex items-center gap-4">

          {/* if not logged in, show login button */}
          {!userId && (
            <Button type="primary" onClick={() => window.location.href = "/auth/login"}>Login</Button>
          )}

          {/* if logged in, show cart button */}
          {userId && (
            <>
        <Button type="primary" icon={<ShoppingCartOutlined />} onClick={() => onOpenCart()}>
          Cart  
        </Button>          <Dropdown overlay={menu} placement="bottomRight">
            <Button>User {userId}</Button>
          </Dropdown>
            </>
          )}
        </div>
      </Header>
    );
};
  
export default AppHeader;