import axios from "axios";
import { API_URL, STORAGE_KEYS, ENDPOINTS } from "./constants";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // Set a 10-second timeout
});

/**
 * Request interceptor to attach auth token to requests
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`Request to ${config.url} with Authorization header`);
    } else {
      console.warn(`Request to ${config.url} without Authorization token!`);
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor to handle token refresh on 401 errors
 */
api.interceptors.response.use(
  (response) => {
    console.log(
      `Response from ${response.config.url} - Status: ${response.status}`
    );
    return response;
  },
  async (error) => {
    console.error(`API Error:`, {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
    });

    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log("Attempting token refresh after 401 error");

      try {
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        if (refreshToken) {
          console.log("Using refresh token to get new access token");
          // Call refresh token endpoint
          const response = await axios.post(
            `${API_URL}${ENDPOINTS.AUTH.REFRESH_TOKEN}`,
            {},
            {
              withCredentials: true,
            }
          );

          if (response.data?.token) {
            console.log("Refresh successful, updating tokens");
            localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
            if (response.data.refreshToken) {
              localStorage.setItem(
                STORAGE_KEYS.REFRESH_TOKEN,
                response.data.refreshToken
              );
            }

            api.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${response.data.token}`;
            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${response.data.token}`;

            console.log("Retrying original request with new token");
            return api(originalRequest);
          } else {
            console.error("Refresh token response missing token");
          }
        } else {
          console.error("No refresh token available");
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);

        console.log("Redirecting to login page due to authentication failure");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
