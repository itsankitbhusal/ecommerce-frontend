import axios from "../config/axios";

export interface ICartRequestDto {
  userId: number;
  name: string;
  quantity: number;
  imageName: string;
  price: number;
}

export const addToCart = async(cartData: ICartRequestDto) => {
  const res = await axios.post("/cart/add", cartData);
  return res.data;
};

// api/cart/getCartById/{cartId}
export const getCartItems = async(userId: number) => {
 const res = await axios.get(`/cart/getCartByUserId/${userId}`);
  return res.data;

};

export const updateCart = async (cartId: string, quantity: number) => {
  const res = await axios.post(`/cart/update/${cartId}`, {quantity});
  return res.data;
};


export const removeCartItem = async (cartId: string) => {
  const res = await axios.get(`/cart/delete/${cartId}`);
  return res.data;
};