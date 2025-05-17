import { Drawer, List, Button, message, Typography } from "antd";
import { useGetCartByUserId } from "../../hooks/cartHooks";

const { Text } = Typography;

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  userId: number;
}

const CartDrawer = ({ open, onClose, userId }: CartDrawerProps) => {
  const { data: cartItems, isLoading, refetch } = useGetCartByUserId(userId);
//   const { mutateAsync: checkout, isPending } = useCheckout();

//   const handleCheckout = async () => {
//     try {
//       await checkout(userId);
//       message.success("Checkout successful!");
//       onClose();
//       refetch();
//     } catch {
//       message.error("Checkout failed.");
//     }
//   };

  return (
    <Drawer title="Your Cart" onClose={onClose} open={open} width={400}>
      {isLoading ? (
        <p>Loading cart...</p>
      ) : (
        <>
          <List
            itemLayout="horizontal"
            dataSource={cartItems}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={item.name}
                  description={
                    <>
                      <Text>Quantity: {item.quantity}</Text>
                      <br />
                      <Text>Price: ${item.price}</Text>
                    </>
                  }
                />
              </List.Item>
            )}
          />
          <Button
            type="primary"
            block
            // loading={isPending}
            // onClick={handleCheckout}
          >
            Checkout
          </Button>
        </>
      )}
    </Drawer>
  );
};

export default CartDrawer;
