import axios from "../config/axios";

export interface IOrder {
  id: string;
  productName: string;
  quantity: number;
  amount: number;
  paymentDetail: string;
  userId: number;
  imageName: string;
}

export interface IDateFilter {
  from: string;
  to: string;
}

export const getUserOrders = async (userId: number) => {
  const res = await axios.get(`/order/getOrderOfUser/${userId}`);
  return res.data;
};

export const getAllOrders = async () => {
  const res = await axios.get(`/order/admin/getAllOrder`);
  return res.data;
};

export const filterOrdersByDate = async (data: IDateFilter) => {
  const res = await axios.post(`/order/admin/filterByDate`, data);
  return res.data;
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  const res = await axios.post(`/order/updateStatus/${orderId}`, status, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.data;
};