import { Card, List, Spin, Typography } from "antd";
import { useGetUserOrders } from "../../hooks/orderHooks";

const { Title, Text } = Typography;

const getProductImageUrl = (imageName: string) => {
  return `${import.meta.env.VITE_BASE_API_URL}/product/image/${imageName}`;
};

const UserOrders = () => {
    const userId = Number(localStorage.getItem("userId"));
  const { data = [], isLoading } = useGetUserOrders(userId);

  if (isLoading) return <Spin fullscreen />;

  return (
    <div className="p-6">
      <Title level={3}>My Orders</Title>
      <List
        grid={{ gutter: 16, column: 1 }}
        dataSource={data}
        renderItem={(order) => (
          <List.Item>
            <Card>
              <div className="flex gap-4 items-center">
                <img
                  src={getProductImageUrl(order.imageName)}
                  alt={order.productName}
                  style={{ width: 80, height: 80, objectFit: "cover" }}
                />
                <div>
                  <Title level={5}>{order.productName}</Title>
                  <Text>Quantity: {order.quantity}</Text><br />
                  <Text>Total: ${order.amount}</Text>
                </div>
              </div>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default UserOrders;