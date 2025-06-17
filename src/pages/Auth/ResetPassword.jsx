import { AuthLayout } from "../../components/Layout/AuthLayout";
import InputWithLabel from "../../components/Shared/InputWithLabel";
import Button from "../../components/Shared/Button";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { requestPasswordReset, reset } from "../../store/slices/authSlice";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [resetSuccess, setResetSuccess] = useState(false);


  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isSuccess) {
      setResetSuccess(true);
    }

    return () => {
      if (isSuccess || isError) {
        dispatch(reset());
      }
    };
  }, [isSuccess, isError, dispatch]);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    }),
    onSubmit: (values) => {
      dispatch(
        requestPasswordReset({
          Email: values.email,
        })
      );
    },
  });

  const handleContinue = () => {
    const emailToPass = formik.values.email;

    navigate("/otp", {
      state: {
        email: emailToPass,
        action: "reset-password",
      },
    });
  };

  return (
    <AuthLayout>
      <div className="text-4xl font-bold text-white mb-6 text-left">
        Reset Password
      </div>
      {isError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
          {message}
        </div>
      )}

      {isSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <div className="font-bold">Success!</div>
          <p>Reset password code has been sent to your email</p>
          <Button className="mt-3" onClick={handleContinue}>
            Continue to verification
          </Button>
        </div>
      )}

      {!resetSuccess && (
        <form
          onSubmit={formik.handleSubmit}
          className="space-y-6 flex flex-col items-center"
        >
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
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
};

export default ResetPassword;
