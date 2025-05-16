import { Button, Form, Input, Select } from "antd";
import { useNavigate } from "react-router-dom";

interface ISignupDTO {
  name: string;
  email: string;
  password: string;
}

const Signup = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

//   const { mutateAsync, isPending } = useSignup();

  const onFinish = async (values: ISignupDTO) => {
    // try {
    //   const res = await mutateAsync(values);

    //   // Store tokens
    //   localStorage.setItem("accessToken", res.token);
    //   localStorage.setItem("refreshToken", res.refreshToken);

    // //   if (res.roles === Roles.ADMIN) {
    // //     navigate("/admin");
    // //   } else {
    // //     navigate("/");
    // //   }
    // } catch (error) {
    //   console.error("Signup error: ", error);
    // }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Form form={form} layout="vertical" onFinish={onFinish} className="w-full max-w-sm">
        <Form.Item
          name="name"
          label="Full Name"
          rules={[{ required: true, message: "Please enter your name" }]}
        >
          <Input />
        </Form.Item>

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
          rules={[{ required: true, min: 6, message: "Minimum 6 characters" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            // disabled={isPending}
            // loading={isPending}
            className="w-full"
          >
            Signup
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Signup;
