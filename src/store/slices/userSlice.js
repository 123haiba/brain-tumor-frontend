/**
 * User Redux Slice
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from '../services/userService';

// Initial state
const initialState = {
  userProfile: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

/**
 * Get current user info async thunk
 */
export const fetchUserProfile = createAsyncThunk(
  'users/getUserInfo',
  async (_, thunkAPI) => {
    try {
      return await userService.getUserInfo();
    } catch (error) {
      const message = 
        error.response?.data?.message || 
        error.response?.data || 
        error.message || 
        'Failed to fetch user profile';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

/**
 * Update user profile async thunk
 */
export const updateUserProfile = createAsyncThunk(
  'users/updateUserInfo',
  async (userData, thunkAPI) => {
    try {
      return await userService.updateUserInfo(userData);
    } catch (error) {
      const message = 
        error.response?.data?.message || 
        error.response?.data || 
        error.message || 
        'Failed to update user profile';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

/**
 * Delete user account async thunk
 */
export const deleteUserAccount = createAsyncThunk(
  'users/deleteUser',
  async (_, thunkAPI) => {
    try {
      return await userService.deleteUser();
    } catch (error) {
      const message = 
        error.response?.data?.message || 
        error.response?.data || 
        error.message || 
        'Failed to delete user account';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create the user slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Reset state (useful after operations)
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Get user profile cases
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.userProfile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Update user profile cases
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.userProfile = action.payload;
        state.message = 'Profile updated successfully';
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Delete user account cases
      .addCase(deleteUserAccount.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteUserAccount.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.userProfile = null;
        state.message = 'Account deleted successfully';
      })
      .addCase(deleteUserAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = userSlice.actions;
export default userSlice.reducer;