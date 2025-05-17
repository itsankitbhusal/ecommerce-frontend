import { useParams } from "react-router-dom";
import { Card, Spin, Typography } from "antd";
import { useGetProductById } from "../../hooks/productHooks";
import { getProductImageUrl } from "../Home";

const { Title, Paragraph } = Typography;

const ProductDetails = () => {
  const { id } = useParams();
  const numericId = Number(id);
  const { data: product, isLoading } = useGetProductById(numericId);

  if (isLoading) return <Spin fullscreen />;
  if (!product) return <div className="text-center p-10">Product not found</div>;

  return (
    <div className="p-6 flex flex-col md:flex-row gap-10">
      <img
        src={getProductImageUrl(product.imageName)}
        alt={product.title}
        className="w-full md:w-1/3 rounded shadow"
      />
      <div className="flex-1">
        <Title level={2}>{product.title}</Title>
        <Paragraph className="text-lg text-gray-600">{product.content}</Paragraph>
        <Title level={4} className="text-blue-600">${product.price.toFixed(2)}</Title>
        <Paragraph className="mt-4">In stock: {product.quantity}</Paragraph>
      </div>
    </div>
  );
};

export default ProductDetails;
