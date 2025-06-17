import { AuthLayout } from "../../components/Layout/AuthLayout";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaCheck, FaTimes } from "react-icons/fa";
import InputWithLabel from "../../components/Shared/InputWithLabel";
import Button from "../../components/Shared/Button";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, reset } from "../../store/slices/authSlice";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasSpecial: false,
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const emailRef = useRef("");

  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

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
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      gender: "Male", // Default value
      birthDate: "", // Format YYYY-MM-DD
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])/,
          "Password must contain at least one uppercase letter, one lowercase letter, and one non-alphanumeric character"
        )
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm password is required"),
      gender: Yup.string()
        .required("Gender is required")
        .oneOf(["Male", "Female"], "Gender must be Male or Female"),
      birthDate: Yup.date()
        .required("Birth date is required")
        .max(new Date(), "Birth date cannot be in the future"),
    }),
    onSubmit: (values) => {
      emailRef.current = values.email;

      const userData = {
        Name: `${values.firstName} ${values.lastName}`,
        Email: values.email,
        Password: values.password,
        Gender: values.gender,
        BirthDate: new Date(values.birthDate).toISOString(),
        Roles: ["User"], // Default role
      };
      dispatch(registerUser(userData));
    },
    validateOnChange: true,
    validateOnBlur: true,
  });

  // Update password validation checks when password changes
  useEffect(() => {
    checkPasswordStrength(formik.values.password);
  }, [formik.values.password]);

  const getFieldError = (fieldName) => {
    return formik.touched[fieldName] && formik.errors[fieldName]
      ? formik.errors[fieldName]
      : null;
  };

  const renderPasswordRequirements = () => {
    return (
      <div className="text-white text-xs mt-1">
        <div className="mb-1">Password requirements:</div>
        <div
          className={`flex items-center ${
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

  useEffect(() => {
    if (isSuccess) {
      navigate("/verify-account", {
        state: { email: emailRef.current },
      });
    }

    return () => {
      if (isSuccess || isError) {
        dispatch(reset());
      }
    };
  }, [isSuccess, isError, navigate, dispatch]);

  return (
    <AuthLayout>
      <div className="text-3xl sm:text-4xl font-extrabold text-white text-left mb-8">
        Create Account
      </div>
      {isError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
          {message}
        </div>
      )}
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <InputWithLabel
            label="First Name"
            type="text"
            name="firstName"
            id="firstName"
            placeholder="Enter First Name.."
            className="w-full"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={getFieldError("firstName")}
          />
          <InputWithLabel
            label="Last Name"
            type="text"
            name="lastName"
            id="lastName"
            placeholder="Enter Last Name.."
            className="w-full"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={getFieldError("lastName")}
          />
        </div>
        <InputWithLabel
          label="Email"
          type="email"
          name="email"
          id="email"
          placeholder="Enter Your Email.."
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={getFieldError("email")}
        />
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full">
            <label
              htmlFor="gender"
              className="block text-white text-sm font-bold mb-2"
            >
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              className={`w-full bg-white p-2 rounded focus:outline-none ${
                getFieldError("gender")
                  ? "border-2 border-red-500 bg-red-50"
                  : ""
              }`}
              value={formik.values.gender}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            {getFieldError("gender") && (
              <div className="text-red-400 text-xs mt-1 font-medium">
                {formik.errors.gender}
              </div>
            )}
          </div>
          <div className="w-full">
            <label
              htmlFor="birthDate"
              className="block text-white text-sm font-bold mb-2"
            >
              Birth Date
            </label>
            <input
              id="birthDate"
              name="birthDate"
              type="date"
              className={`w-full p-2 bg-white rounded focus:outline-none ${
                getFieldError("birthDate")
                  ? "border-2 border-red-500 bg-red-50"
                  : ""
              }`}
              value={formik.values.birthDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              max={new Date().toISOString().split("T")[0]}
            />
            {getFieldError("birthDate") && (
              <div className="text-red-400 text-xs mt-1 font-medium">
                {formik.errors.birthDate}
              </div>
            )}
          </div>
        </div>
        <InputWithLabel
          label="Password"
          type={showPassword ? "text" : "password"}
          name="password"
          id="password"
          placeholder="Enter Your Password.."
          className="relative"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={getFieldError("password")}
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

        {renderPasswordRequirements()}

        <InputWithLabel
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          id="confirmPassword"
          placeholder="Enter Your Password.."
          className="relative"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={getFieldError("confirmPassword")}
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
          {isLoading ? "SIGNING UP..." : "Sign Up"}
        </Button>
      </form>
      <div className="mt-4 text-center text-white text-sm">
        Already Have an account?{" "}
        <Link to="/login" className="text-greentext font-bold">
          Sign In
        </Link>
      </div>
    </AuthLayout>
  );
};

export default Register;
