import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addCategory,
  deleteCategory,
  getCategoriesByStatus,
  updateCategory,
  ICategoryPayload
} from "../services/categoryService";

// Constants
const CATEGORY_QUERY_KEY = "categories";

export const useAddCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORY_QUERY_KEY] });
    },
  });
};

export const useUpdateCategory = (categoryId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ICategoryPayload) =>
      updateCategory(categoryId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORY_QUERY_KEY] });
    },
  });
};

export const useGetCategories = (status: string) =>
  useQuery({
    queryKey: [CATEGORY_QUERY_KEY, status],
    queryFn: () => getCategoriesByStatus(status).then(res => res.data),
  });

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORY_QUERY_KEY] });
    },
  });
};
