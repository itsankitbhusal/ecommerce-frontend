import axios from "../config/axios";

export interface ICategoryPayload {
  categoryTitle: string;
  categoryDescription: string;
}

// ⬇️ Constants
const ADD_CATEGORY_URL = "/category/add";
const UPDATE_CATEGORY_URL = "/category/update";
const GET_CATEGORY_BY_STATUS_URL = "/category/getCategoryByStatus";
const DELETE_CATEGORY_URL = "/category/delete";

export const addCategory = (data: ICategoryPayload) =>
  axios.post(ADD_CATEGORY_URL, data);

export const updateCategory = (categoryId: string, data: ICategoryPayload) =>
  axios.post(`${UPDATE_CATEGORY_URL}/${categoryId}`, data);

export const getCategoriesByStatus = (status: string) =>
  axios.get(`${GET_CATEGORY_BY_STATUS_URL}/${status}`);

export const deleteCategory = (categoryId: string) =>
  axios.get(`${DELETE_CATEGORY_URL}/${categoryId}`);
