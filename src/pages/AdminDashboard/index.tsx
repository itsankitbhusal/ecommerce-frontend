import { Card, Col, Row, Spin } from "antd";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useCountUsers, useGetAllUsers } from "../../hooks/userHooks";
import { useGetAllOrders } from "../../hooks/orderHooks";
import { useEffect, useState } from "react";
import { useGetProductStats } from "../../hooks/productHooks";

const COLORS = ["#0088FE", "#FFBB28", "#FF8042", "#00C49F"];

const AdminDashboard = () => {
  const { data: users = [], isLoading: usersLoading } = useGetAllUsers();
  const { data: userStats = {}, isLoading: statsLoading } = useCountUsers();
  const { data: orders = [], isLoading: ordersLoading } = useGetAllOrders();
  const { data: productStats = {}, isLoading: productsLoading } = useGetProductStats();


  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    if (orders && Array.isArray(orders)) {
      const revenue = orders.reduce((acc, order) => acc + order.amount, 0);
      setTotalRevenue(revenue);
    }
  }, [orders]);

  if (usersLoading || ordersLoading || statsLoading) {
    return <Spin size="large" />;
  }

  const pieData = [
    { name: "Active", value: userStats.Active || 0 },
    { name: "Inactive", value: userStats.Inactive || 0 },
    { name: "Unverified", value: userStats.Unverified || 0 },
    { name: "Deleted", value: userStats.Delete || 0 },
  ];

  const productPieData = [
    { name: "Active", value: productStats.ACTIVE || 0 },
    { name: "Inactive", value: productStats.INACTIVE || 0 },
    { name: "Deleted", value: productStats.DELETED || 0 },
  ];

  return (
    <div className="p-4">
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card title="Total Users" bordered>
            {userStats.Total}
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Total Orders" bordered>
            {orders.length}
          </Card>
        </Col>
        <Col span={6}>
          <Card title="Total Revenue" bordered>
            ${totalRevenue.toFixed(2)}
          </Card>
        </Col>
        <Col span={12}>
          <Card title="User Status Distribution" bordered style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Product Status Distribution" bordered style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={productPieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label
                >
                  {productPieData.map((entry, index) => (
                    <Cell key={`cell-prod-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
