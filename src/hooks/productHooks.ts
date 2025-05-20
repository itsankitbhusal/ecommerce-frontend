import {
    useMutation,
    useQuery,
    useQueryClient,
  } from "@tanstack/react-query";
  import {
    addProduct,
    deleteProduct,
    getProductsByCategory,
    updateProduct,
    PRODUCT_QUERY_KEY,
    IProductFormData,
    getProductImage,
    PRODUCT_IMAGE_QUERY_KEY,
    getAllProducts,
    productById,
    productStats,
  } from "../services/productService";
  
  // 🟢 GET all products by category
  export const useGetProductsByCategory = (
    categoryId: number,
    status: "ACTIVE" | "INACTIVE" | "DELETED"
  ) => {
    return useQuery({
      queryKey: [PRODUCT_QUERY_KEY, categoryId, status],
      queryFn: () => getProductsByCategory({ categoryId, status }),
    });
  };

  // get all products
  export const useGetAllProducts = (
    status: "ACTIVE" | "INACTIVE" | "DELETED"
  ) => {
    return useQuery({
      queryKey: [PRODUCT_QUERY_KEY, status],
      queryFn: () => getAllProducts({ status }),
    });
  };
  
  // 🟢 ADD product
  export const useAddProduct = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: (payload: IProductFormData) => addProduct(payload),
      onSuccess: (_data, _variables, _context) => {
        queryClient.invalidateQueries({ queryKey: [PRODUCT_QUERY_KEY] });
      },
    });
  };
  
  // 🟢 UPDATE product
  export const useUpdateProduct = (productId: number) => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: (payload: IProductFormData) =>
        updateProduct({ productId, payload }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [PRODUCT_QUERY_KEY] });
      },
    });
  };
  
  // 🔴 DELETE product
  export const useDeleteProduct = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: (productId: number) => deleteProduct(productId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [PRODUCT_QUERY_KEY] });
      },
    });
  };

export const useGetProductImage = () => {
  return useMutation({
    mutationFn: getProductImage,
    mutationKey: [PRODUCT_IMAGE_QUERY_KEY],
  });
};

export const useGetProductById = (id: number) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productById(id),
    enabled: !!id, // ensures query runs only when id is truthy
  });
};

// productStats
export const useGetProductStats = () => {
  return useQuery({
    queryKey: ['product_stats'],
    queryFn: () => productStats(),
  });
}