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
    Image,
  } from "antd";
  import { useEffect, useState } from "react";
  import {
    useAddProduct,
    useDeleteProduct,
    useUpdateProduct,
    useGetProductImage,
    useGetAllProducts,
  } from "../../hooks/productHooks";
  import { UploadOutlined } from "@ant-design/icons";
  import { RcFile } from "antd/es/upload";
  import { IProductPayload } from "../../services/productService";
  import { Status } from "../../constants";
  import { useGetCategories } from "../../hooks/categoryHooks";
import { getProductImageUrl } from "../Home";
  
  const dummyUserId = Number(localStorage.getItem("userId"));
  
  const ProductPage = () => {
    const [form] = Form.useForm();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [imageFile, setImageFile] = useState<RcFile | null>(null);
    const [status, setStatus] = useState<"ACTIVE" | "INACTIVE" | "DELETED">(
      "ACTIVE"
    );  
    const { data: categories } = useGetCategories("ACTIVE");
    const { data: products, isLoading } = useGetAllProducts(
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

    const handleViewImage = async (imageName: string) => {
      try {
        const url = await fetchImage(imageName);
        setViewImageUrl(url);
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
              title: "Image",
              dataIndex: "imageName",
              render: (imageName: string) => (
                <Image
                  width={40}
                  height={40}
                  src={getProductImageUrl(imageName) || ''}
                  preview={true} // Enables click-to-preview modal with zoom
                  style={{ objectFit: 'cover', borderRadius: 4 }}
                />
              )
            },
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
      </div>
    );
  };
  
  export default ProductPage;
  