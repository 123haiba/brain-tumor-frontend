import { AuthLayout } from "../../components/Layout/AuthLayout";
import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaCheck, FaTimes } from "react-icons/fa";
import InputWithLabel from "../../components/Shared/InputWithLabel";
import Button from "../../components/Shared/Button";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { resetUserPassword, reset } from "../../store/slices/authSlice";
import { useNavigate, useLocation } from "react-router-dom";

const ResetPassword2 = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasSpecial: false,
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";
  const code = location.state?.code || "";

  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (!email || !code) {
      navigate("/reset-password-email");
      return;
    }

    if (isSuccess) {
      setResetSuccess(true);
    }

    if (
      isError &&
      message &&
      (message.includes("Invalid or expired reset code") ||
        message.includes("invalid code"))
    ) {
      navigate("/otp", {
        state: {
          email,
          action: "reset-password",
          error: message,
        },
      });
    }

    return () => {
      if (isSuccess || isError) {
        dispatch(reset());
      }
    };
  }, [isSuccess, isError, navigate, dispatch, email, code, message]);

  // Check password strength as user types
  const checkPasswordStrength = (password) => {
    setPasswordValidation({
      minLength: password.length >= 6,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasSpecial: /[^a-zA-Z0-9]/.test(password),
    });
  };

  const formik = useFormik({
    initialValues: {
      email: email,
      code: code,
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      code: Yup.string().required("Verification code is required"),
      newPassword: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])/,
          "Password must contain at least one uppercase letter, one lowercase letter, and one non-alphanumeric character"
        )
        .required("New password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
        .required("Confirm password is required"),
    }),
    onSubmit: (values) => {
      const resetData = {
        Email: values.email,
        Code: values.code,
        NewPassword: values.newPassword,
      };
      dispatch(resetUserPassword(resetData));
    },
  });

  // Update password validation checks when password changes
  useEffect(() => {
    checkPasswordStrength(formik.values.newPassword);
  }, [formik.values.newPassword]);

  const handleGoToLogin = () => {
    navigate("/login");
  };

  const renderPasswordRequirements = () => {
    return (
      <div className="text-white text-xs mt-1 mb-4 flex flex-col gap-2">
        <div className="mb-1">Password requirements:</div>
        <div
          className={`flex  items-center ${
            passwordValidation.minLength ? "text-green-400" : "text-gray-400"
          }`}
        >
          {passwordValidation.minLength ? (
            <FaCheck className="mr-1" />
          ) : (
            <FaTimes className="mr-1" />
          )}
          At least 6 characters
        </div>
        <div
          className={`flex items-center ${
            passwordValidation.hasUppercase ? "text-green-400" : "text-gray-400"
          }`}
        >
          {passwordValidation.hasUppercase ? (
            <FaCheck className="mr-1" />
          ) : (
            <FaTimes className="mr-1" />
          )}
          One uppercase letter (A-Z)
        </div>
        <div
          className={`flex items-center ${
            passwordValidation.hasLowercase ? "text-green-400" : "text-gray-400"
          }`}
        >
          {passwordValidation.hasLowercase ? (
            <FaCheck className="mr-1" />
          ) : (
            <FaTimes className="mr-1" />
          )}
          One lowercase letter (a-z)
        </div>
        <div
          className={`flex items-center ${
            passwordValidation.hasSpecial ? "text-green-400" : "text-gray-400"
          }`}
        >
          {passwordValidation.hasSpecial ? (
            <FaCheck className="mr-1" />
          ) : (
            <FaTimes className="mr-1" />
          )}
          One special character (!@#$%^&* etc.)
        </div>
      </div>
    );
  };

  return (
    <AuthLayout>
      <div className="text-4xl font-bold text-white mb-6 text-left">
        Set New Password
      </div>

      {isError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
          {message}
        </div>
      )}

      {isSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-center">
          <div className="font-bold text-lg mb-2">Success!</div>
          <p>Password changed successfully</p>
          <Button className="mt-4" onClick={handleGoToLogin}>
            Go to Login
          </Button>
        </div>
      )}

      {!resetSuccess && (
        <form
          onSubmit={formik.handleSubmit}
          className="space-y-4 flex flex-col items-center"
        >
          <InputWithLabel
            label="New Password"
            type={showPassword ? "text" : "password"}
            name="newPassword"
            id="newPassword"
            placeholder="Enter Your New Password"
            className="relative"
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.newPassword && formik.errors.newPassword
                ? formik.errors.newPassword
                : null
            }
          >
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-700 cursor-pointer text-xl pointer-events-auto z-10"
              tabIndex={-1}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </InputWithLabel>

          <div className="w-full max-w-md mx-auto mb-4">
            {renderPasswordRequirements()}
          </div>

          <InputWithLabel
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            id="confirmPassword"
            placeholder="Confirm Your New Password"
            className="relative"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.confirmPassword && formik.errors.confirmPassword
                ? formik.errors.confirmPassword
                : null
            }
          >
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-gray-700 cursor-pointer text-xl pointer-events-auto z-10"
              tabIndex={-1}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </InputWithLabel>
          <Button type="submit" className="mt-2" disabled={isLoading}>
            {isLoading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
};

export default ResetPassword2;
