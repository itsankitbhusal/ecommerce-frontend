import {
  Button,
  Drawer,
  Form,
  Input,
  Space,
  Table,
  Tag,
  Popconfirm,
  message,
} from "antd";
import { useEffect, useState } from "react";
import {
  useAddCategory,
  useDeleteCategory,
  useGetCategories,
  useUpdateCategory,
} from "../../hooks/categoryHooks";
import { ICategoryPayload } from "../../services/categoryService";
import { Status } from "../../constants";

const CategoryPage = () => {
  const [status, setStatus] = useState(Status.ACTIVE); // could be dynamic in future
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [form] = Form.useForm();

  const { data, isLoading } = useGetCategories(status);
  const { mutateAsync: addMutate } = useAddCategory();
  const { mutateAsync: deleteMutate } = useDeleteCategory();

  // Always call hook unconditionally
  const updateCategoryId = selectedCategory?.id || "";
  const { mutateAsync: updateMutate } = useUpdateCategory(updateCategoryId);

  useEffect(() => {
    if (selectedCategory) {
      form.setFieldsValue({
        categoryTitle: selectedCategory.categoryTitle,
        categoryDescription: selectedCategory.categoryDescription,
      });
    } else {
      form.resetFields();
    }
  }, [selectedCategory, form]);

  const handleSubmit = async (values: ICategoryPayload) => {
    try {
      if (selectedCategory?.id) {
        await updateMutate(values);
        message.success("Category updated");
      } else {
        await addMutate(values);
        message.success("Category added");
      }
      setDrawerOpen(false);
      setSelectedCategory(null);
    } catch {
      message.error("Something went wrong");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutate(id);
      message.success("Category deleted");
    } catch {
      message.error("Delete failed");
    }
  };

  return (
    <div className="p-4">
      <Space style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          onClick={() => {
            setDrawerOpen(true);
            setSelectedCategory(null);
          }}
        >
          Add Category
        </Button>
      </Space>

      <Table
        loading={isLoading}
        rowKey="id"
        columns={[
          {
            title: "Title",
            dataIndex: "categoryTitle",
          },
          {
            title: "Description",
            dataIndex: "categoryDescription",
          },
          {
            title: "Status",
            dataIndex: "status",
            render: (status) => <Tag color="blue">{status}</Tag>,
          },
          {
            title: "Action",
            render: (_, record) => (
              <Space>
                <Button
                  onClick={() => {
                    setSelectedCategory(record);
                    setDrawerOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Popconfirm
                  title="Are you sure to delete this?"
                  onConfirm={() => handleDelete(record.id)}
                >
                  <Button danger>Delete</Button>
                </Popconfirm>
              </Space>
            ),
          },
        ]}
        dataSource={data || []}
      />

      <Drawer
        title={selectedCategory ? "Edit Category" : "Add Category"}
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedCategory(null);
        }}
      >
        <Form layout="vertical" onFinish={handleSubmit} form={form}>
          <Form.Item
            label="Title"
            name="categoryTitle"
            rules={[{ required: true, message: "Enter title" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="categoryDescription"
            rules={[{ required: true, message: "Enter description" }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Button htmlType="submit" type="primary" block>
            {selectedCategory ? "Update" : "Create"}
          </Button>
        </Form>
      </Drawer>
    </div>
  );
};

export default CategoryPage;
