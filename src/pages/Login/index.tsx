import { Button, Form, Input } from "antd";
import { ILoginDTO } from "../../services/authService";
import { useLogin } from "../../hooks/authHooks";

const Login = () => {
  const [form] = Form.useForm();

  const { mutateAsync, isPending } = useLogin();

  const onFinish = async (values: ILoginDTO) => {
    try {
      const res = await mutateAsync(values);

      console.log("res: ", res);
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
          <Button
            type="primary"
            htmlType="submit"
            disabled={isPending}
            loading={isPending}
          >
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
