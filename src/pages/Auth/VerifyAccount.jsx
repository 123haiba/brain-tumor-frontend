import { AuthLayout } from "../../components/Layout/AuthLayout";
import { createRef, useRef, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  confirmUserEmail,
  resendConfirmationCode,
  reset,
} from "../../store/slices/authSlice";
import { useFormik } from "formik";
import * as Yup from "yup";

const VerifyAccount = () => {
  const inputs = useRef([...Array(6)].map(() => createRef()));
  const [verificationCode, setVerificationCode] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isSuccess) {
      navigate("/login");
    }

    return () => {
      if (isSuccess || isError) {
        dispatch(reset());
      }
    };
  }, [isSuccess, isError, navigate, dispatch]);

  const handleInput = (e, idx) => {
    const newValue = e.target.value.replace(/[^0-9]/g, "");
    if (newValue.length <= 1) {
      const newCode = [...verificationCode];
      newCode[idx] = newValue;
      setVerificationCode(newCode);

      if (newValue.length === 1 && idx < 5) {
        inputs.current[idx + 1].current.focus();
      }

      formik.setFieldValue("code", newCode.join(""));
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !verificationCode[idx] && idx > 0) {
      inputs.current[idx - 1].current.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData
      .getData("text")
      .replace(/[^0-9]/g, "")
      .slice(0, 6);

    if (pasteData) {
      const newCode = [...Array(6)].map((_, index) => pasteData[index] || "");
      setVerificationCode(newCode);

      if (newCode.filter(Boolean).length < 6) {
        const focusIndex = newCode.findIndex((digit) => !digit);
        if (focusIndex >= 0) {
          inputs.current[focusIndex].current.focus();
        }
      } else {
        inputs.current[5].current.focus();
      }

      formik.setFieldValue("code", newCode.join(""));
    }
  };

  const formik = useFormik({
    initialValues: {
      userEmail: email,
      code: "",
    },
    validationSchema: Yup.object({
      userEmail: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      code: Yup.string()
        .matches(/^[0-9]{6}$/, "Must be exactly 6 digits")
        .required("Verification code is required"),
    }),
    onSubmit: (values) => {
      dispatch(confirmUserEmail(values));
    },
  });

  const handleResendCode = () => {
    if (formik.values.email) {
      dispatch(resendConfirmationCode({ email: formik.values.email }));
    }
  };

  return (
    <AuthLayout>
      <div className="text-4xl font-bold text-white mb-6 text-center">
        Account Verification
      </div>
      <div className="text-lg text-white text-center mb-4 font-semibold italic">
        Enter The code Sent To your Email Id:
        <span className="text-blue-400 font-bold">{` ${formik.values.userEmail}`}</span>
      </div>
      {!email && (
        <div className="w-full max-w-md mx-auto mb-4">
          <input
            type="email"
            name="userEmail"
            placeholder="Enter your email"
            className="w-full p-2 rounded focus:outline-none"
            value={formik.values.userEmail}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.userEmail && formik.errors.userEmail && (
            <div className="text-red-400 text-sm mt-1">
              {formik.errors.userEmail}
            </div>
          )}
        </div>
      )}
      {isError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
          {message}
        </div>
      )}
      {isSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">
          {message}
        </div>
      )}
      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col items-center gap-6"
      >
        <div className="flex gap-4 mb-4">
          {verificationCode.map((digit, idx) => (
            <input
              key={idx}
              ref={inputs.current[idx]}
              maxLength={1}
              inputMode="numeric"
              className="w-14 h-14 text-3xl text-center rounded bg-white/90 focus:outline-none"
              value={digit}
              onChange={(e) => handleInput(e, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              onPaste={idx === 0 ? handlePaste : undefined}
            />
          ))}
        </div>
        {formik.touched.code && formik.errors.code && (
          <div className="text-red-400 text-sm">{formik.errors.code}</div>
        )}
        <button
          type="submit"
          className="w-60 bg-blue-700 text-white py-2 rounded-full font-bold text-lg"
          disabled={isLoading}
        >
          {isLoading ? "Verifying..." : "Submit"}
        </button>
      </form>
      <div className="text-center mt-6 text-white text-lg">
        Didn't Get Code?{" "}
        <button
          type="button"
          onClick={handleResendCode}
          className="text-blue-400 font-bold"
          disabled={isLoading}
        >
          Resend it
        </button>
      </div>
    </AuthLayout>
  );
};

export default VerifyAccount;
