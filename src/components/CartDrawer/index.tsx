import React, { useState } from "react";
import { Drawer, List, Button, message, Select, Spin, Badge, Avatar, Typography, Divider } from "antd";
import { DeleteOutlined, MinusOutlined, PlusOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useCheckout, useGetCartByUserId, useRemoveFromCart, useUpdateCart } from "../../hooks/cartHooks";
import Checkout from "../Checkout";
import { ICheckoutItem } from "../../services/cartService";

const { Option } = Select;
const { Text } = Typography;

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  userId: number;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ open, onClose, userId }) => {
  const { data: cartItems = [], isLoading } = useGetCartByUserId(userId);
  const { mutateAsync: updateCartItem } = useUpdateCart();
  const { mutateAsync: removeCartItem } = useRemoveFromCart();
  const { mutateAsync: checkout } = useCheckout();
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "stripe">("cod");
  const [showStripeCheckout, setShowStripeCheckout] = useState(false);

  // Calculate cart totals
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  ).toFixed(2);

  const totalItems = cartItems.reduce(
    (count, item) => count + item.quantity, 
    0
  );

  const handleQuantityChange = async (cartId: string, newQty: number) => {
    try {
      await updateCartItem({ cartId, quantity: newQty });
      message.success("Quantity updated");
    } catch (err) {
      message.error("Failed to update quantity");
    }
  };

  const handleRemove = async (cartId: string) => {
    try {
      await removeCartItem(cartId);
      message.success("Item removed from cart");
    } catch (err) {
      message.error("Failed to remove item");
    }
  };

  const handlePaymentSuccess = async (paymentMethod: any) => {
    const paymentDetail = JSON.stringify(paymentMethod);

    console.log('paymentMethod', paymentMethod, "paymentDetail", paymentDetail);
  
    const checkoutData: ICheckoutItem[] = cartItems.map(item => ({
      userId: item.userId,
      name: item.name,
      quantity: item.quantity,
      imageName: item.imageName,
      price: item.price,
      productId: item.productId,
      paymentDetail,
    }));

    try {
      await checkout(checkoutData);
      message.success("Payment successful! Order placed.");
      onClose();
    } catch (err) {
      message.error("Checkout failed");
    }
  };

  const handleCheckout = () => {
    if (paymentMethod === "stripe") {
      setShowStripeCheckout(true);
    } else {
      // COD selected - Show success and close cart
      message.success("Order placed successfully with Cash on Delivery.");
      onClose();
      // In a real app, you would call your backend order API here for COD order
    }
  };

  let drawerTitle = "Your Cart";
  let drawerWidth = 360;
  
  if (showStripeCheckout) {
    drawerTitle = "Checkout with Stripe";
    drawerWidth = 450; // Wider for checkout form
  }

  const cartContent = (
    <>
      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8">
          <ShoppingCartOutlined style={{ fontSize: 48, color: '#bfbfbf', marginBottom: 16 }} />
          <Text type="secondary">Your cart is empty</Text>
        </div>
      ) : (
        <>
          <List
            itemLayout="horizontal"
            dataSource={cartItems}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <div className="flex items-center">
                    <Button 
                      icon={<MinusOutlined />} 
                      size="small"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)} 
                      disabled={item.quantity <= 1}
                    />
                    <span className="mx-2">{item.quantity}</span>
                    <Button 
                      icon={<PlusOutlined />} 
                      size="small"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    />
                  </div>,
                  <Button 
                    danger 
                    icon={<DeleteOutlined />}
                    size="small"
                    onClick={() => handleRemove(item.id)}
                  />
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar 
                      shape="square" 
                      size={50} 
                      src={`${import.meta.env.VITE_BASE_API_URL}/product/image/${item.imageName}`} 
                      alt={item.name} 
                    />
                  }
                  title={item.name}
                  description={
                    <div>
                      <Text>${item.price.toFixed(2)}</Text>
                      <br />
                      <Text type="secondary">Subtotal: ${(item.price * item.quantity).toFixed(2)}</Text>
                    </div>
                  }
                />
              </List.Item>
            )}
          />

          <Divider />
          
          <div className="px-4 mb-4">
            <div className="flex justify-between mb-2">
              <Text>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</Text>
              <Text strong>${cartTotal}</Text>
            </div>
          </div>
          
          <div className="px-4 mb-4">
            <Select
              value={paymentMethod}
              onChange={(val: "cod" | "stripe") => setPaymentMethod(val)}
              style={{ width: "100%", marginBottom: 12 }}
            >
              <Option value="cod">Cash On Delivery (COD)</Option>
              <Option value="stripe">Pay with Stripe</Option>
            </Select>
          </div>
          
          <div className="px-4">
            <Button 
              type="primary" 
              block 
              onClick={handleCheckout}
              disabled={cartItems.length === 0}
            >
              {paymentMethod === "cod" ? "Place Order" : "Proceed to Payment"}
            </Button>
          </div>
        </>
      )}
    </>
  );

  if (isLoading) {
    return (
      <Drawer title={drawerTitle} onClose={onClose} open={open} width={drawerWidth}>
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      </Drawer>
    );
  }

  return (
    <Drawer 
      title={drawerTitle} 
      onClose={showStripeCheckout ? () => setShowStripeCheckout(false) : onClose} 
      open={open} 
      width={drawerWidth}
    >
      {showStripeCheckout ? (
        <Checkout cartItems={cartItems} onPaymentSuccess={handlePaymentSuccess} />
      ) : (
        cartContent
      )}
    </Drawer>
  );
};

export default CartDrawer;