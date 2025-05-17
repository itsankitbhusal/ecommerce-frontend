import { Button, Form, Input, message } from "antd";
import { useState } from "react";
import { useForgetPassword, useVerifyOTP } from "../../hooks/authHooks";
import { ILoginDTO } from "../../services/authService";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const [form] = Form.useForm();
  const [otpCode, setOtpCode] = useState("");
  const [isOtpStage, setIsOtpStage] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const { mutateAsync: forget, isPending } = useForgetPassword();
  const { mutateAsync: verifyOtp, isPending: isVerifying } = useVerifyOTP();

  const handleForget = async (values: ILoginDTO) => {
    try {
      await forget(values);
      message.success("OTP sent to email.");
      setEmail(values.email);
      setIsOtpStage(true);
    } catch {
      message.error("Error updating password.");
    }
  };

  const handleVerify = async () => {
    if (!otpCode) return message.warning("Enter OTP");

    try {
      await verifyOtp(otpCode);
      message.success("Password updated.");
      navigate("/");
    } catch {
      message.error("Invalid OTP.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      {!isOtpStage ? (
        <Form form={form} layout="vertical" onFinish={handleForget} className="w-full max-w-md">
          <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="New Password" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isPending} block>
              Request OTP
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

export default ForgetPassword;
