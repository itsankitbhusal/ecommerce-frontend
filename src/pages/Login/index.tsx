import { Button, Form, Input } from "antd";
import { ILoginDTO, loginUser } from "../../services/authService";
import toast from "react-hot-toast";

const Login = () => {
  // create login form with email and password with antd and with form validation
  const [form] = Form.useForm();

  const onFinish = async (values: ILoginDTO) => {
    try {
      const res = await loginUser(values);

      console.log('res: ', res);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, type: "email" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
