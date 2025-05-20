import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getUserOrders,
  getAllOrders,
  filterOrdersByDate,
  updateOrderStatus,
  IDateFilter
} from '../services/orderService';

const GET_USER_ORDERS = 'get_user_orders';
const GET_ALL_ORDERS = 'get_all_orders';

export const useGetUserOrders = (userId: number) => {
  return useQuery({
    queryKey: [GET_USER_ORDERS, userId],
    queryFn: () => getUserOrders(userId),
    enabled: !!userId,
  });
};

export const useGetAllOrders = () => {
  return useQuery({
    queryKey: [GET_ALL_ORDERS],
    queryFn: getAllOrders,
  });
};

export const useFilterOrdersByDate = () => {
  return useMutation({
    mutationFn: (data: IDateFilter) => filterOrdersByDate(data),
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_ALL_ORDERS] });
    }
  });
};
