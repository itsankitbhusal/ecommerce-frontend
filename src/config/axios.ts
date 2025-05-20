import Axios from "axios";

const serverUrl = import.meta.env.VITE_BASE_API_URL;
export const baseURL = `${serverUrl}`;

const axios = Axios.create({
  baseURL,
  timeout: 120000,
});

// Flag to prevent multiple refresh requests
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

axios.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    // config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error?.response?.status === 403 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return axios(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await axios.post("/user/token/refreshToken", {
          token: refreshToken,
        });

        const newToken = response.data?.token;
        if (newToken) {
          localStorage.setItem("accessToken", newToken);
          axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
          processQueue(null, newToken);
          return axios(originalRequest);
        } else {
          throw new Error("No token in refresh response");
        }
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // if (error?.response?.status === 401) {
    //   localStorage.removeItem("accessToken");
    //   localStorage.removeItem("refreshToken");
    //   window.location.href = "/auth/login";
    // }

    return Promise.reject(error);
  }
);

export default axios;
