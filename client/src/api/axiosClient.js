import axios from "axios";
import { store } from "../store";
import { logout } from "../store/uiSlice";

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";

    const isAuthPath = url.includes("/user/") || url.includes("/auth/");
    const isTokenError =
      error.response?.data?.message?.toLowerCase().includes("token") ||
      error.response?.data?.message?.toLowerCase().includes("jwt");

    if (
      status === 401 &&
      !url.includes("/auth/login") &&
      !url.includes("/auth/register") &&
      !url.includes("/user/getme") &&
      (isAuthPath || isTokenError)
    ) {
      store.dispatch(logout());
    }

    const customMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "An unexpected network error occurred";
    
    const normalizedError = new Error(customMessage);
    normalizedError.status = status;
    normalizedError.data = error.response?.data;
    return Promise.reject(normalizedError);
  }
);