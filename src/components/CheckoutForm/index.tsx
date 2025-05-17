import {
    CardElement,
    useStripe,
    useElements,
  } from "@stripe/react-stripe-js";
  
  import { Button, message, Form, Input, Divider } from "antd";
  import { useState } from "react";
  
  interface CheckoutFormProps {
    cartItems: any[];
    onPaymentSuccess: () => void;
  }
  
  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };
  
  const CheckoutForm = ({ cartItems, onPaymentSuccess }: CheckoutFormProps) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
  
    // Calculate cart total
    const cartTotal = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    ).toFixed(2);
  
    const handleSubmit = async () => {
      if (!stripe || !elements) return;
  
      try {
        setLoading(true);
        const values = await form.validateFields();
        
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          message.error("Card element not found");
          setLoading(false);
          return;
        }
  
        // Create payment method
        const { error, paymentMethod } = await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
          billing_details: {
            name: values.name,
            email: values.email,
            address: {
              line1: values.address,
              city: values.city,
              postal_code: values.zip,
              country: "US", // Default to US, can be made dynamic
            },
          },
        });
  
        if (error) {
          message.error(error.message);
          setLoading(false);
          return;
        }
  
        // In a real app, you would send this to your backend
        console.log("Payment successful!", paymentMethod);
        console.log("Order details:", {
          items: cartItems,
          customer: values,
          payment: paymentMethod,
          total: cartTotal
        });
        
        message.success("Payment successful!");
        
        // In a client-side only demo, we simulate a successful API call
        setTimeout(() => {
          onPaymentSuccess();
          setLoading(false);
        }, 1000);
        
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
  
    return (
      <div className="max-w-md mx-auto mt-4 p-4 border rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Complete Your Purchase</h2>
        
        <div className="mb-4">
          <h3 className="font-medium mb-2">Order Summary</h3>
          <div className="bg-gray-50 p-3 rounded">
            {cartItems.map((item, index) => (
              <div key={index} className="flex justify-between mb-1">
                <span>{item.name} x {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <Divider className="my-2" />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>${cartTotal}</span>
            </div>
          </div>
        </div>
        
        <Form form={form} layout="vertical">
          <Form.Item 
            name="name" 
            label="Name on Card"
            rules={[{ required: true, message: 'Please enter the name on card' }]}
          >
            <Input placeholder="John Doe" />
          </Form.Item>
          
          <Form.Item 
            name="email" 
            label="Email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input placeholder="email@example.com" />
          </Form.Item>
          
          <Form.Item 
            name="address" 
            label="Address"
            rules={[{ required: true, message: 'Please enter your address' }]}
          >
            <Input placeholder="123 Main St" />
          </Form.Item>
          
          <div className="flex gap-4">
            <Form.Item 
              name="city" 
              label="City"
              className="flex-1"
              rules={[{ required: true, message: 'Required' }]}
            >
              <Input placeholder="City" />
            </Form.Item>
            
            <Form.Item 
              name="zip" 
              label="ZIP Code"
              className="w-1/3"
              rules={[{ required: true, message: 'Required' }]}
            >
              <Input placeholder="12345" />
            </Form.Item>
          </div>
          
          <Form.Item label="Card Details" required>
            <div className="border rounded p-3 bg-white">
              <CardElement options={CARD_ELEMENT_OPTIONS} />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              For testing: Use card number 4242 4242 4242 4242, any future date, any CVC
            </div>
          </Form.Item>
        </Form>
        
        <Button
          type="primary"
          className="mt-4 w-full"
          onClick={handleSubmit}
          disabled={!stripe}
          loading={loading}
        >
          Pay ${cartTotal}
        </Button>
      </div>
    );
  };
  
  export default CheckoutForm;