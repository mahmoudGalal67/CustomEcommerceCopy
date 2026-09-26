import api from "./axios";
import axios from "axios";

// categories
export const categoriesAPi = {
  getCategories: ({ locale }: { locale: string }) =>
    api.get(`/categories?locale=${locale}`),
};

//UserInfo
export const userInfoAPi = {
  getUserInfoAPis: () => api.get("/user"),
};
//UserInfo
export const siteInfoApi = {
  getSettingsInfoAPis: () => api.get("/settings"),
};
// products
export const productsAPi = {
  getProducts: (params = {}) => api.get("/products", { params }),
  getProductDetials: ({ id, locale }: { id: string; locale: "en" | "ar" }) =>
    api.get(`/products/${id}?locale=${locale}`),
};
// checkout
export const checkoutAPi = {
  checkout: (params = {}, data: any) => api.post("/checkout", data),
};
// checkout
export const ordersApi = {
  getOrders: () => api.get("/orders/client"),
};
export const PagesApi = {
  showPage: ({ id }: { id: string }) => api.get(`/pages/${id}`),
};

// token
export const refreshAccessToken = async () => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/refresh`,
    {},
    { withCredentials: true },
  );

  return response.data.access_token;
};
