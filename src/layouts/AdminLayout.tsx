import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
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
        <Header className="bg-white shadow-md px-4">Admin Panel</Header>
        <Content className="m-4 p-4 bg-white rounded shadow">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
