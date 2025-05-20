import { Table, Button, Popconfirm } from "antd";
import { useDeleteUser, useGetAllUsers } from "../../hooks/userHooks";
import { IUser } from "../../services/userService";

const UserList = () => {
  const { data: users = [], isLoading } = useGetAllUsers();
  const { mutate: deleteUser } = useDeleteUser();

  const columns = [
    {
      title: "First Name",
      dataIndex: "firstname",
      key: "firstname",
    },
    {
      title: "Last Name",
      dataIndex: "lastname",
      key: "lastname",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Contact",
      dataIndex: "contactNumber",
      key: "contactNumber",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: IUser) => (
        <Popconfirm
          title="Are you sure to delete this user?"
          onConfirm={() => deleteUser(record.id)}
        >
          <Button danger size="small">Delete</Button>
        </Popconfirm>
      ),
    },
  ];

  return <Table dataSource={users} columns={columns} rowKey="id" loading={isLoading} />;
};

export default UserList;
