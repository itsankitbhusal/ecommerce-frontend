import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addToCart, checkoutCart, getCartItems, ICartRequestDto, ICheckoutItem, removeCartItem, updateCart } from '../services/cartService';

const GET_CART = "get_cart";

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ICartRequestDto) => addToCart(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_CART] });
    },
  });
};

export const useGetCartByUserId = (userId:number) => {
  return useQuery({
    queryKey: [GET_CART, userId],
    queryFn: () => getCartItems(userId),
    enabled: !!userId
  })
}

export const useCheckout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (checkoutData: ICheckoutItem[]) => checkoutCart(checkoutData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_CART]});
    }
  });
};

export const useUpdateCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cartId, quantity }: { cartId: string; quantity: number }) =>
      updateCart(cartId, quantity),
    onSuccess: (_data, _vars, _context) => {
      queryClient.invalidateQueries({ queryKey: [GET_CART]});
    },
  });
};


export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cartId: string) => removeCartItem(cartId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_CART] });
    }
  });
};