import { AuthLayout } from "../../components/Layout/AuthLayout";
import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import InputWithLabel from "../../components/Shared/InputWithLabel";
import Button from "../../components/Shared/Button";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, reset } from "../../store/slices/authSlice";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, isError, isSuccess, message, isAuthenticated } =
    useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }

    return () => {
      if (isSuccess || isError) {
        dispatch(reset());
      }
    };
  }, [isAuthenticated, isSuccess, isError, navigate, dispatch]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: (values) => {
      dispatch(
        loginUser({
          Email: values.email,
          Password: values.password,
        })
      );
    },
  });

  const renderErrorMessage = (message) => {
    if (message === "Please confirm your email first") {
      return (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded mb-4">
          {message}
          <button
            onClick={() =>
              navigate("/verify-account", {
                state: { email: formik.values.email },
              })
            }
            className="ml-2 underline"
          >
            Verify now
          </button>
        </div>
      );
    }

    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
        {message}
      </div>
    );
  };

  return (
    <AuthLayout>
      <div className="text-3xl sm:text-4xl font-extrabold text-white text-left mb-8">
        LOGIN
      </div>
      {isError && renderErrorMessage(message)}
      <form onSubmit={formik.handleSubmit} className="space-y-5">
        <InputWithLabel
          label="Email"
          type="email"
          name="email"
          id="email"
          placeholder="Enter Your Email.."
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.email && formik.errors.email
              ? formik.errors.email
              : null
          }
        />
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
          error={
            formik.touched.password && formik.errors.password
              ? formik.errors.password
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
        <div className="text-sm">
          <Link to="/reset-password-email" className="text-white">
            Forget <span className="text-greentext font-bold">Password</span>?
          </Link>
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "LOGGING IN..." : "LOGIN"}
        </Button>
      </form>
      <div className="mt-4 text-center text-white text-sm">
        Don't have an account?{" "}
        <Link to="/register" className="text-greentext font-bold">
          Sign Up
        </Link>
      </div>
    </AuthLayout>
  );
};

export default Login;
