import { Button, Form, Input, Modal, message } from "antd";
import { ILoginDTO } from "../../services/authService";
import { useForgetPassword, useLogin, useVerifyOTP } from "../../hooks/authHooks";
import { useNavigate } from "react-router-dom";
import { Roles } from "../../constants";
import { useState } from "react";

const Login = () => {
  const [form] = Form.useForm();
  const [modalForm] = Form.useForm();
  const [otpCode, setOtpCode] = useState("");

  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [otpStage, setOtpStage] = useState(false);
  const [email, setEmail] = useState("");

  const { mutateAsync, isPending } = useLogin();
  const { mutateAsync: forgetPassword, isPending: isSending } = useForgetPassword();
  const { mutateAsync: verifyOtp, isPending: isVerifying } = useVerifyOTP();

  const onFinish = async (values: ILoginDTO) => {
    try {
      const res = await mutateAsync(values);
      localStorage.setItem("accessToken", res.token);
      localStorage.setItem("refreshToken", res.refreshToken);
      localStorage.setItem("userId", res.userId.toString());
      const userRole = res.roles;

      navigate(userRole === Roles.ADMIN ? "/admin" : "/");
    } catch {
      message.error("Invalid credentials");
    }
  };

  const handleForgetPasswordClick = () => {
    modalForm.resetFields();
    setIsModalOpen(true);
  };

  const handleVerifyOtpClick = () => {
    setOtpCode("");
    setIsVerifyModalOpen(true);
  };

  const handleSendOtp = async (values: any) => {
    if (values.password !== values.confirmPassword) {
      return message.error("Passwords do not match");
    }

    try {
      await forgetPassword({ email: values.email, password: values.password });
      message.success("OTP sent to email");
      setEmail(values.email);
      setOtpStage(true);
    } catch {
      message.error("Failed to send OTP");
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode) return message.warning("Please enter OTP");

    try {
      await verifyOtp(otpCode);
      message.success("OTP verified successfully");
      setOtpStage(false);
      setIsModalOpen(false);
      setIsVerifyModalOpen(false);
      modalForm.resetFields();
    } catch {
      message.error("Invalid OTP");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="password" label="Password" rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isPending}>
            Login
          </Button>
        </Form.Item>
        <Form.Item className="text-end">
          <div className="flex flex-col items-end gap-2">
            <Button type="link" onClick={handleForgetPasswordClick}>
              Forget Password?
            </Button>
            <Button type="link" onClick={handleVerifyOtpClick}>
              Verify OTP
            </Button>
          </div>
        </Form.Item>
      </Form>

      {/* Forget Password Modal */}
      <Modal
        title="Reset Password"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setOtpStage(false);
          modalForm.resetFields();
        }}
        footer={null}
      >
        {!otpStage ? (
          <Form form={modalForm} layout="vertical" onFinish={handleSendOtp}>
            <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
              <Input />
            </Form.Item>
            <Form.Item name="password" label="New Password" rules={[{ required: true, min: 6 }]}>
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              dependencies={["password"]}
              rules={[
                { required: true },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    return value === getFieldValue("password")
                      ? Promise.resolve()
                      : Promise.reject("Passwords do not match");
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={isSending} block>
                Send OTP
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <div className="space-y-4">
            <p>Enter OTP sent to <strong>{email}</strong></p>
            <Input
              placeholder="Enter OTP"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
            />
            <Button
              type="primary"
              onClick={handleVerifyOtp}
              loading={isVerifying}
              block
            >
              Verify OTP
            </Button>
          </div>
        )}
      </Modal>

      {/* Standalone OTP Verification Modal */}
      <Modal
        title="Verify OTP"
        open={isVerifyModalOpen}
        onCancel={() => setIsVerifyModalOpen(false)}
        footer={null}
      >
        <div className="space-y-4">
          <Input
            placeholder="Enter OTP"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
          />
          <Button
            type="primary"
            onClick={handleVerifyOtp}
            loading={isVerifying}
            block
          >
            Verify OTP
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Login;
