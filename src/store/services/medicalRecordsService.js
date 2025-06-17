/**
 * Medical Records service functions for API calls
 */
import api from "../../utils/api";
import { ENDPOINTS } from "../../utils/constants";

/**
 * Upload an MRI image for tumor detection
 */
export const uploadImage = async (imageData) => {
  try {
    const response = await api.post(
      ENDPOINTS.MEDICAL_RECORDS.UPLOAD,
      imageData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get a medical record by ID
 */
export const getRecordById = async (recordId) => {
  try {
    const response = await api.get(
      `${ENDPOINTS.MEDICAL_RECORDS.GET_BY_ID}/${recordId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all medical records for the current authenticated user
 */
export const getCurrentUserMedicalRecords = async () => {
  try {
    const response = await api.get(
      ENDPOINTS.MEDICAL_RECORDS.GET_CURRENT_USER_RECORDS
    );

    return response.data;
  } catch (error) {
    return error;
  }
};

const medicalRecordsService = {
  uploadImage,
  getRecordById,
  getCurrentUserMedicalRecords,
};

export default medicalRecordsService;
