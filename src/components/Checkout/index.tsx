import React, { useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Result, Button } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import CheckoutForm from "../CheckoutForm";

// Replace with your publishable key from Stripe Dashboard
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!);

interface CheckoutProps {
  cartItems: any[];
  onPaymentSuccess?: (paymentMethod: any) => void;  
}

const Checkout: React.FC<CheckoutProps> = ({ cartItems, onPaymentSuccess }) => {
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const navigate = useNavigate();

  const handlePaymentSuccess = (paymentMethod: any) => {
    setPaymentCompleted(true);
    // Call the parent callback if provided
    if (onPaymentSuccess) {
      onPaymentSuccess(paymentMethod);
    }
  };

  const goToHome = () => {
    window.location.href = "/";
  };

  // Define appearance options for Stripe Elements
  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#1677ff', // Match Ant Design primary color
      borderRadius: '4px',
    },
  };

  const options = {
    appearance,
    // We're not using a specific payment mode, so we don't set the amount here
  };

  if (paymentCompleted) {
    return (
      <Result
        icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
        status="success"
        title="Payment Successful!"
        subTitle="Thank you for your order. We've received your payment."
        extra={[
          <Button type="primary" key="home" onClick={goToHome}>
            Continue Shopping
          </Button>,
        ]}
      />
    );
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm cartItems={cartItems} onPaymentSuccess={handlePaymentSuccess} />
    </Elements>
  );
};

export default Checkout;