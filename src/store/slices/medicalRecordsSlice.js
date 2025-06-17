
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import medicalRecordsService from '../services/medicalRecordsService';

// Initial state
const initialState = {
  records: [],
  currentRecord: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

/**
 * Upload MRI image async thunk
 */
export const uploadMriImage = createAsyncThunk(
  'medicalRecords/uploadImage',
  async (imageData, thunkAPI) => {
    try {
      return await medicalRecordsService.uploadImage(imageData);
    } catch (error) {
      const message = 
        error.response?.data?.message || 
        error.response?.data || 
        error.message || 
        'Failed to upload MRI image';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

/**
 * Get medical record by ID async thunk
 */
export const getMedicalRecordById = createAsyncThunk(
  'medicalRecords/getById',
  async (recordId, thunkAPI) => {
    try {
      return await medicalRecordsService.getRecordById(recordId);
    } catch (error) {
      const message = 
        error.response?.data?.message || 
        error.response?.data || 
        error.message || 
        'Failed to fetch medical record';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

/**
 * Get current user's medical records async thunk
 */
export const getUserMedicalRecords = createAsyncThunk(
  'medicalRecords/getUserRecords',
  async (_, thunkAPI) => {
    try {
      return await medicalRecordsService.getCurrentUserMedicalRecords();
    } catch (error) {
      const message = 
        error.response?.data?.message || 
        error.response?.data || 
        error.message || 
        'Failed to fetch medical records';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create the medical records slice
const medicalRecordsSlice = createSlice({
  name: 'medicalRecords',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    clearCurrentRecord: (state) => {
      state.currentRecord = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload image cases
      .addCase(uploadMriImage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(uploadMriImage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentRecord = action.payload;
        if (!state.records.some(record => record.medicalRecordId === action.payload.medicalRecordId)) {
          state.records.push(action.payload);
        }
      })
      .addCase(uploadMriImage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Get record by ID cases
      .addCase(getMedicalRecordById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMedicalRecordById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentRecord = action.payload;
      })
      .addCase(getMedicalRecordById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Get user records cases
      .addCase(getUserMedicalRecords.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserMedicalRecords.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.records = action.payload;
      })
      .addCase(getUserMedicalRecords.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.records = [];
      });
  },
});

export const { reset, clearCurrentRecord } = medicalRecordsSlice.actions;
export default medicalRecordsSlice.reducer;