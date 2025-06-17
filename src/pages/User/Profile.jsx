import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchUserProfile,
  updateUserProfile,
  reset as resetUser,
  deleteUserAccount,
} from "../../store/slices/userSlice";
import {
  getUserMedicalRecords,
  reset as resetRecords,
} from "../../store/slices/medicalRecordsSlice";
import { logoutUser } from "../../store/slices/authSlice";
import {
  FaUserCircle,
  FaCalendarAlt,
  FaVenusMars,
  FaEnvelope,
  FaMedkit,
  FaImage,
  FaEdit,
  FaSave,
  FaSignOutAlt,
  FaBug,
  FaTrash,
} from "react-icons/fa";
import Button from "../../components/Shared/Button";
import InputWithLabel from "../../components/Shared/InputWithLabel";
import * as Yup from "yup";
import { useFormik } from "formik";

const Profile = () => {
  const [editMode, setEditMode] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    userProfile,
    isLoading: userLoading,
    isError: userError,
    message: userMessage,
  } = useSelector((state) => state.user);
  const {
    records,
    isLoading: recordsLoading,
    isError: recordsError,
    message: recordsMessage,
  } = useSelector((state) => state.medicalRecords);

  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    dispatch(fetchUserProfile());
    dispatch(getUserMedicalRecords());

    return () => {
      dispatch(resetUser());
      dispatch(resetRecords());
    };
  }, [dispatch, navigate, isAuthenticated]);

  const formik = useFormik({
    initialValues: {
      name: userProfile?.name || "",
      gender: userProfile?.gender || "Male",
      birthDate: userProfile?.birthDate
        ? new Date(userProfile.birthDate).toISOString().split("T")[0]
        : "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      gender: Yup.string()
        .required("Gender is required")
        .oneOf(["Male", "Female"], "Gender must be Male or Female"),
      birthDate: Yup.date()
        .required("Birth date is required")
        .max(new Date(), "Birth date cannot be in the future"),
    }),
    onSubmit: (values) => {
      const userData = {
        name: values.name,
        gender: values.gender,
        birthDate: new Date(values.birthDate).toISOString(),
      };

      console.log("Submitting user update:", userData);
      dispatch(updateUserProfile(userData))
        .unwrap()
        .then(() => {
          setEditMode(false);
        })
        .catch((error) => {
          console.error("Failed to update profile:", error);
        });
    },
  });

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      dispatch(deleteUserAccount());
      dispatch(logoutUser());
      navigate("/login");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="bg-[#091447]/80 rounded-2xl shadow-xl overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-900 py-8 px-6 flex flex-col items-center sm:items-start sm:flex-row gap-6">
          <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center">
            <FaUserCircle size={96} className="text-white" />
          </div>
          <div className="flex flex-col items-center sm:items-start">
            <h1 className="text-3xl font-bold text-white">
              {editMode
                ? formik.values.name
                : userProfile?.name || "Loading profile..."}
            </h1>
            <p className="flex items-center gap-2 text-white/80 mt-2">
              <FaEnvelope /> {userProfile?.email || "Email not loaded"}
            </p>
            <div className="flex flex-wrap gap-4 mt-4">
              <button
                onClick={() => {
                  if (editMode) {
                    formik.handleSubmit();
                  } else {
                    setEditMode(true);
                  }
                }}
                className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
              >
                {editMode ? (
                  <>
                    <FaSave /> Save
                  </>
                ) : (
                  <>
                    <FaEdit /> Edit Profile
                  </>
                )}
              </button>
              <button
                onClick={handleLogout}
                className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
              >
                <FaSignOutAlt /> Sign Out
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
              >
                <FaTrash /> Delete Account
              </button>
            </div>
          </div>
        </div>

        {/* Error Messages */}
        {userError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded m-4">
            <p className="font-bold">Error loading profile:</p>
            <p>{userMessage || "Unknown error occurred"}</p>
          </div>
        )}

        {recordsError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded m-4">
            <p className="font-bold">Error loading medical records:</p>
            <p>{recordsMessage || "Unknown error occurred"}</p>
          </div>
        )}

        {/* Profile Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* User Info */}
            <div className="md:col-span-1 bg-white/5 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">
                Personal Information
              </h2>

              {editMode ? (
                <form onSubmit={formik.handleSubmit} className="space-y-4">
                  <InputWithLabel
                    label="Full Name"
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Enter your full name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.name && formik.errors.name
                        ? formik.errors.name
                        : null
                    }
                  />

                  <div className="w-full">
                    <label
                      htmlFor="gender"
                      className="block text-white font-semibold mb-1"
                    >
                      Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      className={`w-full p-2 rounded focus:outline-none ${
                        formik.touched.gender && formik.errors.gender
                          ? "border-2 border-red-500 bg-red-50"
                          : "bg-white"
                      }`}
                      value={formik.values.gender}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                    {formik.touched.gender && formik.errors.gender && (
                      <div className="text-red-400 text-xs mt-1 font-medium">
                        {formik.errors.gender}
                      </div>
                    )}
                  </div>

                  <div className="w-full">
                    <label
                      htmlFor="birthDate"
                      className="block text-white font-semibold mb-1"
                    >
                      Birth Date
                    </label>
                    <input
                      id="birthDate"
                      name="birthDate"
                      type="date"
                      className={`w-full p-2 rounded focus:outline-none ${
                        formik.touched.birthDate && formik.errors.birthDate
                          ? "border-2 border-red-500 bg-red-50"
                          : "bg-white"
                      }`}
                      value={formik.values.birthDate}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      max={new Date().toISOString().split("T")[0]}
                    />
                    {formik.touched.birthDate && formik.errors.birthDate && (
                      <div className="text-red-400 text-xs mt-1 font-medium">
                        {formik.errors.birthDate}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" disabled={userLoading}>
                      {userLoading ? "Saving..." : "Save Changes"}
                    </Button>
                    <button
                      type="button"
                      onClick={() => setEditMode(false)}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : userLoading ? (
                <div className="text-center py-8">
                  <div className="text-white">
                    Loading profile information...
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="text-blue-400 mt-1">
                      <FaUserCircle size={24} />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Full Name</p>
                      <p className="text-white text-lg">
                        {userProfile?.name || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="text-blue-400 mt-1">
                      <FaVenusMars size={24} />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Gender</p>
                      <p className="text-white text-lg">
                        {userProfile?.gender || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="text-blue-400 mt-1">
                      <FaCalendarAlt size={24} />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Birth Date</p>
                      <p className="text-white text-lg">
                        {userProfile?.birthDate
                          ? formatDate(userProfile.birthDate)
                          : "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Medical Records */}
            <div className="md:col-span-2 bg-white/5 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">
                <span className="flex items-center gap-2">
                  <FaMedkit /> Medical Records
                </span>
              </h2>

              {recordsLoading ? (
                <div className="text-center py-8">
                  <div className="text-white">Loading medical records...</div>
                </div>
              ) : records && records.length > 0 ? (
                <div className="space-y-4">
                  {records.map((record) => (
                    <div
                      key={record.medicalRecordId}
                      className="bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="w-full sm:w-40 h-40 bg-gray-800 rounded-lg overflow-hidden">
                          {record.imageURL && (
                            <img
                              src={record.imageURL}
                              alt="MRI Scan"
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white">
                            {record.tumorType === "no_tumor"
                              ? "No Tumor Detected"
                              : `${
                                  record.tumorType.charAt(0).toUpperCase() +
                                  record.tumorType.slice(1)
                                } Tumor`}
                          </h3>
                          <div className="mt-2 space-y-2">
                            <p className="text-white/70">
                              <strong>Record ID:</strong>{" "}
                              {record.medicalRecordId}
                            </p>
                            <p
                              className={`text-lg font-semibold ${
                                record.hasTumor
                                  ? "text-red-400"
                                  : "text-green-400"
                              }`}
                            >
                              {record.hasTumor
                                ? "Tumor Detected"
                                : "No Tumor Detected"}
                            </p>
                            <button
                              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                              onClick={() =>
                                navigate(`/record/${record.medicalRecordId}`)
                              }
                            >
                              <FaImage /> View Full Results
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white/10 rounded-lg p-8 text-center">
                  <h3 className="text-xl text-white mb-4">
                    No Medical Records Found
                  </h3>
                  <p className="text-white/70 mb-6">
                    You haven't uploaded any MRI scans for analysis yet.
                  </p>
                  <Button onClick={() => navigate("/brain-tumor-ai")}>
                    Upload MRI Scan
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
