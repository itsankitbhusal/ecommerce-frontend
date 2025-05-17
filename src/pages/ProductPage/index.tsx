import {
    Button,
    Drawer,
    Form,
    Input,
    InputNumber,
    Space,
    Table,
    Upload,
    Select,
    message,
    Popconfirm,
    Modal,
  } from "antd";
  import { useEffect, useState } from "react";
  import {
    useAddProduct,
    useDeleteProduct,
    useGetProductsByCategory,
    useUpdateProduct,
    useGetProductImage,
  } from "../../hooks/productHooks";
  import { UploadOutlined } from "@ant-design/icons";
  import { RcFile } from "antd/es/upload";
  import { IProductPayload } from "../../services/productService";
  import { Status } from "../../constants";
  import { useGetCategories } from "../../hooks/categoryHooks";
  
  const dummyUserId = 1; // Replace with auth context later
  
  const ProductPage = ({ categoryId }: { categoryId: number }) => {
    const [form] = Form.useForm();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [imageFile, setImageFile] = useState<RcFile | null>(null);
    const [status, setStatus] = useState<"ACTIVE" | "INACTIVE" | "DELETED">(
      "ACTIVE"
    );
    const [viewImageId, setViewImageId] = useState<number | null>(null);
    const [viewImageUrl, setViewImageUrl] = useState<string | null>(null);
  
    const { data: categories } = useGetCategories("ACTIVE");
    const { data: products, isLoading } = useGetProductsByCategory(
      categoryId,
      status
    );
    
    const { mutateAsync: addMutate } = useAddProduct();
    const { mutateAsync: deleteMutate } = useDeleteProduct();
    const { mutateAsync: updateMutate } = useUpdateProduct(
      selectedProduct?.id || 0
    );
    const { mutateAsync: fetchImage } = useGetProductImage();
  
    useEffect(() => {
      if (selectedProduct) {
        form.setFieldsValue({
          title: selectedProduct.title,
          content: selectedProduct.content,
          quantity: selectedProduct.quantity,
          price: selectedProduct.price,
          categoryId: selectedProduct.categoryId,
        });
      } else {
        form.resetFields();
        setImageFile(null);
      }
    }, [selectedProduct, form]);
  
    const handleSubmit = async (values: any) => {
      if (!imageFile && !selectedProduct) {
        message.warning("Please upload a product image.");
        return;
      }
  
      const payload = {
        requestDto: {
          ...values,
          userId: dummyUserId,
        },
        image: imageFile!,
      };
  
      try {
        if (selectedProduct) {
          await updateMutate(payload);
          message.success("Product updated successfully.");
        } else {
          await addMutate(payload);
          message.success("Product added successfully.");
        }
        form.resetFields();
        setImageFile(null);
        setDrawerOpen(false);
        setSelectedProduct(null);
      } catch (error) {
        message.error("Something went wrong.");
      }
    };
  
    const handleDelete = async (productId: number) => {
      try {
        await deleteMutate(productId);
        message.success("Product deleted successfully.");
      } catch {
        message.error("Delete failed.");
      }
    };
  
    const handleViewImage = async (productName: string, productId: number) => {
      try {
        const url = await fetchImage(productName);
        setViewImageUrl(url);
        setViewImageId(productId);
      } catch {
        message.error("Failed to fetch image.");
      }
    };
  
    return (
      <div className="p-4">
        <Space style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={() => setDrawerOpen(true)}>
            Add Product
          </Button>
        </Space>
  
        <Table
          loading={isLoading}
          rowKey="id"
          dataSource={products || []}
          columns={[
            { title: "Title", dataIndex: "title" },
            { title: "Content", dataIndex: "content" },
            { title: "Quantity", dataIndex: "quantity" },
            { title: "Price", dataIndex: "price" },
            {
              title: "Action",
              render: (_, record) => (
                <Space>
                  <Button
                    onClick={() => {
                      setSelectedProduct(record);
                      setDrawerOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button onClick={() => handleViewImage(record.imageName, record.id)}>
                    View Image
                  </Button>
                  <Popconfirm
                    title="Are you sure to delete this product?"
                    onConfirm={() => handleDelete(record.id)}
                  >
                    <Button danger>Delete</Button>
                  </Popconfirm>
                </Space>
              ),
            },
          ]}
        />
  
        <Drawer
          title={selectedProduct ? "Edit Product" : "Add Product"}
          open={drawerOpen}
          onClose={() => {
            setDrawerOpen(false);
            setSelectedProduct(null);
            form.resetFields();
            setImageFile(null);
          }}
        >
          <Form layout="vertical" form={form} onFinish={handleSubmit}>
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: "Enter product title" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Content"
              name="content"
              rules={[{ required: true, message: "Enter product content" }]}
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item
              label="Quantity"
              name="quantity"
              rules={[{ required: true, message: "Enter quantity" }]}
            >
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              label="Price"
              name="price"
              rules={[{ required: true, message: "Enter price" }]}
            >
              <InputNumber min={0.01} step={0.01} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              label="Category"
              name="categoryId"
              rules={[{ required: true, message: "Select category" }]}
            >
              <Select placeholder="Select category">
                {categories?.map((cat) => (
                  <Select.Option key={cat.id} value={cat.id}>
                    {cat.categoryTitle}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Product Image">
              <Upload
                beforeUpload={(file) => {
                  setImageFile(file);
                  return false;
                }}
                showUploadList={imageFile ? [{ name: imageFile.name }] : false}
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </Form.Item>
            <Button type="primary" htmlType="submit" block>
              {selectedProduct ? "Update" : "Create"}
            </Button>
          </Form>
        </Drawer>
  
        <Modal
          open={!!viewImageId}
          title="Product Image"
          footer={null}
          onCancel={() => {
            setViewImageId(null);
            setViewImageUrl(null);
          }}
        >
          {viewImageUrl ? (
            <img src={viewImageUrl} alt="Product" style={{ width: "100%" }} />
          ) : (
            <p>Loading...</p>
          )}
        </Modal>
      </div>
    );
  };
  
  export default ProductPage;
  