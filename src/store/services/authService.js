/**
 * Authentication service functions for API calls
 */
import api from "../../utils/api";
import { ENDPOINTS, STORAGE_KEYS } from "../../utils/constants";

/**
 * Register a new user
 */
export const register = async (userData) => {
  const response = await api.post(ENDPOINTS.AUTH.REGISTER, userData);
  return response.data;
};

/**
 * Login user with email and password
 */
export const login = async (credentials) => {
  const response = await api.post(ENDPOINTS.AUTH.LOGIN, credentials);

  if (response.data.token) {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
    localStorage.setItem(
      STORAGE_KEYS.REFRESH_TOKEN,
      response.data.refreshToken
    );
  }

  return response.data;
};

/**
 * Confirm user email with verification code
 */
export const confirmEmail = async (confirmData) => {
  const response = await api.post(ENDPOINTS.AUTH.CONFIRM_EMAIL, confirmData);
  return response.data;
};

/**
 * Resend email confirmation code
 */
export const resendConfirmation = async (emailData) => {
  const response = await api.post(
    ENDPOINTS.AUTH.RESEND_CONFIRMATION,
    emailData
  );
  return response.data;
};

/**
 * Request password reset for a user
 */
export const forgetPassword = async (emailData) => {
  const response = await api.post(ENDPOINTS.AUTH.FORGET_PASSWORD, emailData);
  return response.data;
};

/**
 * Reset user password with code
 */
export const resetPassword = async (resetData) => {
  const response = await api.post(ENDPOINTS.AUTH.RESET_PASSWORD, resetData);
  return response.data;
};

/**
 * Refresh authentication token
 */
export const refreshToken = async () => {
  const response = await api.post(ENDPOINTS.AUTH.REFRESH_TOKEN);

  if (response.data.token) {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
    if (response.data.refreshToken) {
      localStorage.setItem(
        STORAGE_KEYS.REFRESH_TOKEN,
        response.data.refreshToken
      );
    }
  }

  return response.data;
};

/**
 * Revoke/invalidate refresh token
 */
export const revokeToken = async (tokenData) => {
  const response = await api.post(ENDPOINTS.AUTH.REVOKE_TOKEN, tokenData);
  return response.data;
};

/**
 * Logout user - clear tokens from storage
 */
export const logout = () => {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER_INFO);
};

const authService = {
  register,
  login,
  confirmEmail,
  resendConfirmation,
  forgetPassword,
  resetPassword,
  refreshToken,
  revokeToken,
  logout,
};

export default authService;
