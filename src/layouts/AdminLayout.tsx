import { Button, Layout, Menu, Popconfirm } from "antd";
import {
  DashboardOutlined,
  LogoutOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import { Link, Outlet, useLocation } from "react-router-dom";

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const location = useLocation();

  const selectedKey = location.pathname.split("/")[2] || "dashboard";

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible>
        <div className="text-white text-xl text-center py-4 font-bold">
          Admin
        </div>
        <Menu theme="dark" mode="inline" selectedKeys={[selectedKey]}>
          <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
            <Link to="/admin">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="category" icon={<TagsOutlined />}>
            <Link to="/admin/category">Categories</Link>
          </Menu.Item>
          <Menu.Item key="product" icon={<TagsOutlined />}>
            <Link to="/admin/product">Products</Link>
          </Menu.Item>
          {/* Add more menu items here */}
        </Menu>
      </Sider>

      <Layout>
        <Header className="bg-white shadow-md px-4 py-2">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            {/* popup confirm logout */}
            <Popconfirm
              title="Are you sure you want to logout?"
              onConfirm={() => {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                window.location.href = "/auth/login";
              }}
            >
              <Button type="primary" danger>
                <LogoutOutlined />
              </Button>
            </Popconfirm>
          </div>
        </Header>
        <Content className="m-4 p-4 bg-white rounded shadow">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
