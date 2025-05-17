import axios from "../config/axios";

const BASE = "/product";

export const PRODUCT_QUERY_KEY = "products";
export const PRODUCT_IMAGE_QUERY_KEY = "product-image";


export interface IProductPayload {
  title: string;
  content: string;
  userId: number;
  categoryId: number;
  quantity: number;
  price: number;
}

export interface IProductFormData {
  requestDto: IProductPayload;
  image: File;
}

// POST /api/product/add
export const addProduct = async (payload: IProductFormData) => {
  const formData = new FormData();
  formData.append("image", payload.image);
  formData.append("productDto", new Blob([JSON.stringify(payload.requestDto)], {
    type: "application/json"
  }));

  const response = await axios.post(`${BASE}/add`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// POST /api/product/update/:productId
export const updateProduct = async ({
  productId,
  payload,
}: {
  productId: number;
  payload: IProductFormData;
}) => {
  const formData = new FormData();
  formData.append("image", payload.image);
  formData.append("productDto", new Blob([JSON.stringify(payload.requestDto)], {
    type: "application/json"
  }));
  const response = await axios.post(`${BASE}/update/${productId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// POST /api/product/getProductByCategoryForAdmin/:categoryId?status=ACTIVE
export const getProductsByCategory = async ({
  categoryId,
  status,
}: {
  categoryId: number;
  status: "ACTIVE" | "INACTIVE" | "DELETED";
}) => {
  const response = await axios.post(
    `${BASE}/getProductByCategoryForAdmin/${categoryId}?status=${status}`
  );
  return response.data;
};

// GET /api/product/delete/:productId
export const deleteProduct = async (productId: number) => {
  const response = await axios.get(`${BASE}/delete/${productId}`);
  return response.data;
};


export const getProductImage = async (productName: string): Promise<string> => {
  const response = await axios.get(`/product/image/${productName}`, {
    responseType: "blob",
  });

  const imageUrl = URL.createObjectURL(response.data);
  return imageUrl;
};