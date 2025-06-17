/**
 * User service functions for API calls
 */
import api from "../../utils/api";
import { ENDPOINTS, STORAGE_KEYS } from "../../utils/constants";

/**
 * Get current authenticated user information
 */
export const getUserInfo = async () => {
  try {
    console.log("Fetching user info from:", ENDPOINTS.USERS.GET_USER_INFO);
    const response = await api.get(ENDPOINTS.USERS.GET_USER_INFO);
    console.log("User API response:", response);

    if (response.data) {
      localStorage.setItem(
        STORAGE_KEYS.USER_INFO,
        JSON.stringify(response.data)
      );
      console.log("User data stored in localStorage");
      return response.data;
    } else {
      console.warn("API returned empty user data");

      // Check if there's cached user data in localStorage
      const cachedUserData = localStorage.getItem(STORAGE_KEYS.USER_INFO);
      if (cachedUserData) {
        console.log("Using cached user data");
        return JSON.parse(cachedUserData);
      } else {
        console.warn("No cached user data available");
      }

      // Return fallback/demo data if API returns empty
      return {
        name: "Demo User",
        email: "demo@example.com",
        gender: "Male",
        birthDate: "1995-06-15T00:00:00",
      };
    }
  } catch (error) {
    console.error("Error fetching user info:", error);

    // Check if there's cached user data in localStorage
    const cachedUserData = localStorage.getItem(STORAGE_KEYS.USER_INFO);
    if (cachedUserData) {
      console.log("Using cached user data after error");
      return JSON.parse(cachedUserData);
    }

    // Rethrow the error to be handled by the thunk
    throw error;
  }
};

/**
 * Update current user information
 */
export const updateUserInfo = async (userData) => {
  try {
    console.log("Updating user info with data:", userData);
    const response = await api.put(ENDPOINTS.USERS.UPDATE_USER_INFO, userData);
    console.log("Update user API response:", response);

    if (response.data) {
      const currentUser = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.USER_INFO) || "{}"
      );
      const updatedUser = { ...currentUser, ...response.data };
      localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(updatedUser));
      console.log("Updated user data stored in localStorage");
      return updatedUser;
    }

    return response.data;
  } catch (error) {
    console.error("Error updating user info:", error);
    throw error;
  }
};

/**
 * Delete current user account
 */
export const deleteUser = async () => {
  try {
    console.log("Deleting user account");
    const response = await api.delete(ENDPOINTS.USERS.DELETE_USER);

    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_INFO);

    return response.data;
  } catch (error) {
    throw error;
  }
};

const userService = {
  getUserInfo,
  updateUserInfo,
  deleteUser,
};

export default userService;
