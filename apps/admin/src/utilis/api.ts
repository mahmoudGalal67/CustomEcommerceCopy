import { axiosBaseApi } from "./axios";

// categories
export const categoriesAPi = {
  getCategories: () => axiosBaseApi.get("/categories"),
};

//UserInfo
export const userInfoAPi = {
  getUserInfoAPis: () => axiosBaseApi.get("/user"),
};
// products
export const productsAPi = {
  getProducts: (params = {}) => axiosBaseApi.get("/products", { params }),
  getProductDetials: (id: string) => axiosBaseApi.get(`/products/${id}`),
};
// checkout
export const checkoutAPi = {
  checkout: (params = {}, data: any) => axiosBaseApi.post("/checkout", data),
};
// checkout
export const ordersApi = {
  getOrders: () => axiosBaseApi.get("/orders/client"),
};

// token
export const refreshAccessToken = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/refresh`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Refresh failed");
  }

  const data = await res.json();
  return data.access_token;
};
