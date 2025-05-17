import { useEffect, useState } from "react";
import { Card, Col, Row, Input, Select, Spin, message, Button, Drawer, List } from "antd";
import { useGetAllProducts } from "../../hooks/productHooks";
import { useGetCategories } from "../../hooks/categoryHooks";
import { useAddToCart, useGetCartByUserId, useRemoveFromCart, useUpdateCart } from "../../hooks/cartHooks";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { IProductPayload } from "../../services/productService";


const { Search } = Input;
const { Option } = Select;

export const getProductImageUrl = (imageName: string) => {
  return `${import.meta.env.VITE_BASE_API_URL}/product/image/${imageName}`;
};

const CartDrawer = ({ open, onClose, userId }: { open: boolean; onClose: () => void; userId: number }) => {
  const { data: cartItems = [], isLoading } = useGetCartByUserId(userId);
  const { mutateAsync: updateCartItem } = useUpdateCart();
  const { mutateAsync: removeCartItem } = useRemoveFromCart();


  const handleCheckout = () => {
    message.success("Checkout successful (placeholder)");
    onClose();
  };

  const handleQuantityChange = async (cartId: string, newQty: number) => {
    try {
      await updateCartItem({ cartId, quantity: newQty });
      message.success("Quantity updated");
    } catch (err) {
      message.error("Failed to update quantity");
    }
  };

  const handleRemove = async (cartId: string) => {
    try {
      await removeCartItem(cartId);
      message.success("Item removed from cart");
    } catch (err) {
      message.error("Failed to remove item");
    }
  };

  return (
    <Drawer title="Your Cart" onClose={onClose} open={open} width={360}>
      {isLoading ? (
        <Spin />
      ) : cartItems?.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <List
            itemLayout="horizontal"
            dataSource={cartItems}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button onClick={() => handleQuantityChange(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</Button>,
                  <span>{item.quantity}</span>,
                  <Button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</Button>,
                  <Button danger onClick={() => handleRemove(item.id)}>Remove</Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={<img src={getProductImageUrl(item.imageName)} alt={item.name} style={{ width: 50 }} />}
                  title={item.name}
                  description={`Price: $${item.price}`}
                />
              </List.Item>
            )}
          />
          <Button type="primary" block onClick={handleCheckout} className="mt-4">
            Checkout
          </Button>
        </>
      )}
    </Drawer>
  );
};


const Home = () => {
  const userId = Number(localStorage.getItem("userId"));  
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState<number | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  const { data: categories = [] } = useGetCategories("ACTIVE");
  const { mutate: addToCart } = useAddToCart();
  const { data: allProducts = [], isLoading } = useGetAllProducts("ACTIVE");
  const { data: cartItems = [], isLoading: cartLoading } = useGetCartByUserId(userId);
  useEffect(() => {
    if (!keyword && !category) {
      setProducts(allProducts);
    } else {
      const filtered = allProducts.filter((p) => {
        const matchesKeyword = keyword
          ? p.title.toLowerCase().includes(keyword.toLowerCase())
          : true;
        const matchesCategory = category ? p.categoryId === category : true;
        return matchesKeyword && matchesCategory;
      });
      setProducts(filtered);
    }
  }, [keyword, category, allProducts]);

  if (isLoading) return <Spin fullscreen />;

  const handleAddToCart = async(product: IProductPayload) => {
     console.log("product", product);
    if (!product) return;

    // if product is already in cart, update the quantity
    const isProductInCart = cartItems.some((item) => item.productId === product.id);
    if (isProductInCart) {
      message.error("Product already in cart");
      return;
    }

    try {
      await addToCart({
        userId: userId,
        name: product.title,
        quantity: 1,
        imageName: product.imageName,
        price: product.price,
        productId: product.id,
      });
      message.success("Added to cart!");
      setCartOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap items-center gap-4 justify-between">
        <div className="flex gap-4 flex-wrap">
          <Search
            placeholder="Search products"
            onSearch={(val) => setKeyword(val)}
            allowClear
            style={{ width: 300 }}
          />
          <Select
            placeholder="Filter by Category"
            onChange={(val) => setCategory(val)}
            allowClear
            style={{ width: 200 }}
          >
            {categories?.map((cat) => (
              <Option key={cat.id} value={cat.id}>
                {cat.categoryTitle}
              </Option>
            ))}
          </Select>
        </div>
        <Button type="primary" icon={<ShoppingCartOutlined />} onClick={() => setCartOpen(true)}>
          Cart
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        {products?.map((product) => (
          <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              cover={
                <div style={{ height: 200, overflow: "hidden" }}>
                  <img alt={product.title} src={getProductImageUrl(product.imageName)} />
                </div>
              }
              className="cursor-pointer object-cover"
            >
              <div className="flex justify-between items-center">
                <Link to={`/product/${product.id}`}>
                <Card.Meta
                  title={product.title}
                  description={`Price: $${product.price.toFixed(2)}`}
                />
                </Link>
                <Button type="primary" icon={<ShoppingCartOutlined />} onClick={()=>handleAddToCart(product)}></Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} userId={userId} />
    </div>
  );
};

export default Home;
