import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../services/authService";
import { STORAGE_KEYS } from "../../utils/constants";

// Get user from localStorage
const userToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
const userInfo = localStorage.getItem(STORAGE_KEYS.USER_INFO)
  ? JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_INFO))
  : null;

const initialState = {
  user: userInfo,
  token: userToken || null,
  refreshToken: refreshToken || null,
  isAuthenticated: !!userToken,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

/**
 * Register user async thunk
 */
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      return await authService.register(userData);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Something went wrong";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

/**
 * Login user async thunk
 */
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      return await authService.login(credentials);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Invalid credentials";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

/**
 * Logout user async thunk
 */
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        await authService.revokeToken({ Token: refreshToken });
      }
      authService.logout();
      return null;
    } catch (error) {
      authService.logout();
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

/**
 * Confirm email async thunk
 */
export const confirmUserEmail = createAsyncThunk(
  "auth/confirmEmail",
  async (confirmData, thunkAPI) => {
    try {
      return await authService.confirmEmail(confirmData);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Email confirmation failed";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

/**
 * Resend confirmation code async thunk
 */
export const resendConfirmationCode = createAsyncThunk(
  "auth/resendConfirmation",
  async (emailData, thunkAPI) => {
    try {
      return await authService.resendConfirmation(emailData);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Failed to resend confirmation code";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

/**
 * Request password reset async thunk
 */
export const requestPasswordReset = createAsyncThunk(
  "auth/forgetPassword",
  async (emailData, thunkAPI) => {
    try {
      return await authService.forgetPassword(emailData);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Password reset request failed";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

/**
 * Reset password async thunk
 */
export const resetUserPassword = createAsyncThunk(
  "auth/resetPassword",
  async (resetData, thunkAPI) => {
    try {
      return await authService.resetPassword(resetData);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Password reset failed";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

/**
 * Refresh token async thunk
 */
export const refreshAuthToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, thunkAPI) => {
    try {
      return await authService.refreshToken();
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Token refresh failed";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create the auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload || "Registration successful";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.user = action.payload; // Contains user info, roles, etc.
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      })

      // Logout cases
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      })

      // Confirm email cases
      .addCase(confirmUserEmail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(confirmUserEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload;
      })
      .addCase(confirmUserEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Resend confirmation code cases
      .addCase(resendConfirmationCode.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resendConfirmationCode.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload;
      })
      .addCase(resendConfirmationCode.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Request password reset cases
      .addCase(requestPasswordReset.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(requestPasswordReset.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload?.message || "Password reset email sent";
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Reset password cases
      .addCase(resetUserPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resetUserPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload;
      })
      .addCase(resetUserPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Refresh token cases
      .addCase(refreshAuthToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(refreshAuthToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        if (action.payload.refreshToken) {
          state.refreshToken = action.payload.refreshToken;
        }
        state.isAuthenticated = true;
      })
      .addCase(refreshAuthToken.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
