// Base URL
export const API_URL = "http://braintumordetectiontest.runasp.net/api";

// API endpoints
export const ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    CONFIRM_EMAIL: "/auth/confirmEmail",
    RESEND_CONFIRMATION: "/auth/resend-confirmation",
    FORGET_PASSWORD: "/auth/forgetPassword",
    RESET_PASSWORD: "/auth/resetPassword",
    REFRESH_TOKEN: "/auth/refreshToken",
    REVOKE_TOKEN: "/auth/revokeToken",
  },

  // Medical records endpoints
  MEDICAL_RECORDS: {
    UPLOAD: "/MedicalRecords/upload",
    GET_BY_ID: "/MedicalRecords/getById",
    GET_CURRENT_USER_RECORDS: "/MedicalRecords/GetCurrentUserMedicalRecords",
  },

  // User endpoints
  USERS: {
    GET_USER_INFO: "/Users",
    UPDATE_USER_INFO: "/Users",
    DELETE_USER: "/Users",
  },
};

// Enum for Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  REFRESH_TOKEN: "refresh_token",
  USER_INFO: "user_info",
};

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
};
