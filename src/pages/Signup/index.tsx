import { Button, Form, Input, message } from "antd";
import { useState } from "react";
import { useSignUp, useVerifyOTP } from "../../hooks/authHooks";
import { ISignUpDTO } from "../../services/authService";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [form] = Form.useForm();
  const [otpCode, setOtpCode] = useState("");
  const [isOtpStage, setIsOtpStage] = useState(false);
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const { mutateAsync: signUp, isPending } = useSignUp();
  const { mutateAsync: verifyOtp, isPending: isVerifying } = useVerifyOTP();

  const handleSignUp = async (values: ISignUpDTO) => {
    try {
      await signUp(values);
      message.success("OTP sent to your email.");
      setEmail(values.email);
      setIsOtpStage(true);
    } catch (err) {
      message.error("Signup failed.");
    }
  };

  const handleVerify = async () => {
    if (!otpCode) return message.warning("Enter OTP");

    try {
      await verifyOtp(otpCode);
      message.success("Signup complete!");
      navigate("/auth/login");
    } catch {
      message.error("Invalid OTP");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      {!isOtpStage ? (
        <Form form={form} layout="vertical" onFinish={handleSignUp} className="w-full max-w-md">
          <Form.Item name="firstname" label="First Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="lastname" label="Last Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="contactNumber" label="Contact Number" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Address" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isPending} block>
              Sign Up
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <div className="w-full max-w-sm text-center space-y-4">
          <h2 className="text-lg font-semibold">Enter OTP sent to {email}</h2>
          <Input
            placeholder="Enter OTP code"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
          />
          <Button type="primary" onClick={handleVerify} loading={isVerifying} block>
            Verify OTP
          </Button>
        </div>
      )}
    </div>
  );
};

export default SignUp;
