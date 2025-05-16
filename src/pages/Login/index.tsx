import { Button, Form, Input } from "antd";
import { ILoginDTO } from "../../services/authService";
import { useLogin } from "../../hooks/authHooks";
import { useNavigate } from "react-router-dom";
import { Roles } from "../../constants";

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { mutateAsync, isPending } = useLogin();

  const onFinish = async (values: ILoginDTO) => {
    try {
      const res = await mutateAsync(values);

      // handle access and refresh token
      localStorage.setItem("accessToken", res.token);
      localStorage.setItem("refreshToken", res.refreshToken)

      const userRole = res.roles;

      if (userRole===Roles.ADMIN) {
        navigate("/admin");
      } else {
        navigate("/");
      }

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
