import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  clearCurrentRecord,
  uploadMriImage,
} from "../../store/slices/medicalRecordsSlice";
import upload from "../../assets/images/upload.png";

import {
  FaUpload,
  FaSpinner,
  FaSearch,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import Button from "../../components/Shared/Button";

export default function Upload() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((state) => state.auth);
  const { currentRecord, isLoading, isError, message } = useSelector(
    (state) => state.medicalRecords
  );

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setErrorMessage("");

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file");
      return;
    }

    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUploadClick = () => {
    if (!isAuthenticated) {
      setErrorMessage("Please log in to upload images");
      return;
    }

    fileInputRef.current.click();
  };

  const handleGetResults = async () => {
    if (!selectedImage) {
      setErrorMessage("Please upload an image first");
      return;
    }

    if (!isAuthenticated) {
      setErrorMessage("Please log in to process images");
      return;
    }

    setErrorMessage("");

    const formData = new FormData();
    formData.append("MRIImage", selectedImage);

    try {
      await dispatch(uploadMriImage(formData)).unwrap();
    } catch (error) {
      console.error("Upload failed:", error);
      setErrorMessage(
        typeof error === "string"
          ? error
          : "Failed to process image. Please try again."
      );
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setErrorMessage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    dispatch(clearCurrentRecord());
  };

  const getTumorTypeDisplay = (type) => {
    switch (type) {
      case "no_tumor":
        return "No Tumor Detected";
      default:
        return type ? type.charAt(0).toUpperCase() + type.slice(1) : "Unknown";
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] py-8 px-4 max-w-4xl mx-auto">
      {/* Authentication Error Message */}
      {!isAuthenticated && errorMessage && (
        <div className=" border border-white text-white px-4 py-3 rounded mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <FaExclamationTriangle className="mr-2" />
            <span>{errorMessage}</span>
          </div>
          <Link
            to="/login"
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded ml-4"
          >
            Login Now
          </Link>
        </div>
      )}

      {/* Upload Container */}
      <div className="overflow-hidden p-6">
        <div className="flex flex-col items-center justify-center">
          {/* Hidden file input */}
          <input
            type="file"
            className="hidden"
            onChange={handleFileSelect}
            accept="image/*"
            ref={fileInputRef}
          />

          {/* Display area for image upload or results */}
          <div className="mb-8 w-full max-w-md">
            {currentRecord ? (
              <div className="bg-white/5 rounded-xl p-4 flex flex-col items-center">
                <img
                  src={currentRecord.imageURL}
                  alt="MRI Scan Result"
                  className="max-w-full h-auto max-h-80 rounded-lg mb-6"
                />

                <div className="w-full bg-white/10 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white">
                      Scan Results
                    </h2>
                    <div
                      className={`px-3 py-1 rounded-full ${
                        currentRecord.hasTumor
                          ? "bg-red-600/30 text-red-400"
                          : "bg-green-600/30 text-green-400"
                      } text-sm font-semibold flex items-center`}
                    >
                      {currentRecord.hasTumor ? (
                        <>
                          <FaTimesCircle className="mr-1" /> Tumor Detected
                        </>
                      ) : (
                        <>
                          <FaCheckCircle className="mr-1" /> No Tumor
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 text-white">
                    <div className="flex justify-between border-b border-white/20 pb-2">
                      <span className="text-gray-400">Diagnosis:</span>
                      <span className="font-semibold">
                        {getTumorTypeDisplay(currentRecord.tumorType)}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-center mt-6">
                    <button
                      className="bg-gray-600 cursor-pointer hover:bg-gray-700 text-white px-4 py-2 rounded"
                      onClick={handleReset}
                    >
                      Scan New Image
                    </button>
                  </div>
                </div>
              </div>
            ) : previewUrl ? (
              <div className="flex flex-col items-center">
                <img
                  src={previewUrl}
                  alt="Selected MRI"
                  className="max-w-full h-auto max-h-80 rounded-lg border-2 border-blue-500/50 mb-4"
                />
              </div>
            ) : (
              <div
                className="border-2 border-dashed border-gray-400 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
                onClick={handleUploadClick}
              >
                <img
                  src={upload}
                  alt="Upload"
                  className="w-64 h-64 object-contain mb-4"
                />
                <p className="text-white text-lg mb-2">
                  Click to upload an MRI scan image
                </p>
                <p className="text-gray-400 text-sm">
                  Supported formats: JPG, PNG, JPEG
                </p>
              </div>
            )}
          </div>

          {errorMessage && isAuthenticated && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 w-full max-w-xs text-center">
              {errorMessage}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col gap-4 w-full max-w-xs">
            {!currentRecord && (
              <>
                <Button
                  className="text-white text-xl font-bold py-3 rounded-xl w-full shadow-md transition flex items-center justify-center"
                  onClick={handleUploadClick}
                  disabled={isLoading}
                >
                  <FaUpload className="mr-2" /> Upload Image
                </Button>

                <Button
                  className={`${
                    selectedImage
                      ? "bg-greenback hover:bg-greenbackhover"
                      : "bg-gray-600"
                  } text-white text-xl font-bold py-3 rounded-xl w-full shadow-md transition flex items-center justify-center`}
                  onClick={handleGetResults}
                  disabled={!selectedImage || isLoading}
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="mr-2 animate-spin" /> Processing...
                    </>
                  ) : (
                    <>
                      <FaSearch className="mr-2" /> Get Result
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
