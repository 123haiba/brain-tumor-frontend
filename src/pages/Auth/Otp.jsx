import { AuthLayout } from "../../components/Layout/AuthLayout";
import { createRef, useRef, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resendConfirmationCode } from "../../store/slices/authSlice";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "../../components/Shared/Button";

const Otp = () => {
  const inputs = useRef([...Array(6)].map(() => createRef()));
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";
  const action = location.state?.action || "verify";
  const initialError = location.state?.error || "";

  const [errorFromReset, setErrorFromReset] = useState(initialError);

  console.log("OTP component - received state:", {
    email,
    action,
    state: location.state,
  });

  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  // Initialize formik
  const formik = useFormik({
    initialValues: {
      email: email,
      code: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      code: Yup.string()
        .matches(/^[0-9]{6}$/, "Must be exactly 6 digits")
        .required("OTP code is required"),
    }),
    onSubmit: (values) => {
      if (action === "reset-password") {
        navigate("/reset-password", {
          state: {
            email: values.email,
            code: values.code,
          },
        });
      } else {
        navigate("/login");
      }
    },
  });

  useEffect(() => {
    if (!email && action === "reset-password") {
      navigate("/reset-password-email");
    }
  }, [email, action, navigate]);

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(
        () => setResendCountdown(resendCountdown - 1),
        1000
      );
      return () => clearTimeout(timer);
    } else if (resendCountdown === 0) {
      setResendDisabled(false);
    }
  }, [resendCountdown]);

  useEffect(() => {
    if (otpCode.some((digit) => digit !== "")) {
      setErrorFromReset("");
    }
  }, [otpCode]);

  const handleInput = (e, idx) => {
    const newValue = e.target.value.replace(/[^0-9]/g, "");
    if (newValue.length <= 1) {
      const newCode = [...otpCode];
      newCode[idx] = newValue;
      setOtpCode(newCode);

      if (newValue.length === 1 && idx < 5) {
        inputs.current[idx + 1].current.focus();
      } else if (newValue.length === 1 && idx === 5) {
        if (newCode.filter(Boolean).length === 6) {
          setTimeout(() => {
            formik.setFieldValue("code", newCode.join(""));
            formik.submitForm();
          }, 300);
        }
      }

      formik.setFieldValue("code", newCode.join(""));
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !otpCode[idx] && idx > 0) {
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
      setOtpCode(newCode);

      if (newCode.filter(Boolean).length < 6) {
        const focusIndex = newCode.findIndex((digit) => !digit);
        if (focusIndex >= 0) {
          inputs.current[focusIndex].current.focus();
        }
      } else {
        inputs.current[5].current.focus();

        setTimeout(() => {
          formik.setFieldValue("code", newCode.join(""));
          formik.submitForm();
        }, 300);
      }

      formik.setFieldValue("code", newCode.join(""));
    }
  };

  const handleResendCode = () => {
    if (formik.values.email && !resendDisabled) {
      setResendDisabled(true);
      setResendCountdown(60);

      dispatch(
        resendConfirmationCode({
          Email: formik.values.email,
        })
      );
    }
  };

  return (
    <AuthLayout>
      <div className="text-4xl font-bold text-white mb-6 text-center">
        {action === "reset-password"
          ? "Password Reset Verification"
          : "OTP Verification"}
      </div>
      <div className="text-lg text-white text-center mb-4 font-semibold italic">
        Enter The code Sent To your Email Id:
        {email && <div className="text-blue-300 mt-1">{email}</div>}
      </div>
      {!email && (
        <div className="w-full max-w-md mx-auto mb-4">
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="w-full p-2 rounded focus:outline-none"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="text-red-400 text-sm mt-1">
              {formik.errors.email}
            </div>
          )}
        </div>
      )}
      {isError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
          {message}
          {action === "reset-password" && (
            <div className="mt-2">
              The verification code you entered may be invalid or expired.
              Please try again or request a new code.
            </div>
          )}
        </div>
      )}
      {errorFromReset && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
          {errorFromReset}
          <div className="mt-2">
            The reset code was invalid or has expired. Please enter a new code
            or request another reset code.
          </div>
        </div>
      )}
      {isSuccess && action !== "reset-password" && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">
          Code sent successfully!
        </div>
      )}
      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col items-center gap-6"
      >
        <div className="flex gap-4 mb-4">
          {otpCode.map((digit, idx) => (
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
              autoFocus={idx === 0}
            />
          ))}
        </div>
        {formik.touched.code && formik.errors.code && (
          <div className="text-red-400 text-sm">{formik.errors.code}</div>
        )}
        <Button
          type="submit"
          disabled={isLoading || formik.values.code.length !== 6}
        >
          {isLoading ? "Verifying..." : "Verify"}
        </Button>
      </form>
      <div className="text-center mt-6 text-white text-lg">
        Didn't Get Code?{" "}
        <button
          type="button"
          onClick={handleResendCode}
          className={`text-blue-400 font-bold ${
            resendDisabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={resendDisabled || isLoading}
        >
          {resendDisabled ? `Resend in ${resendCountdown}s` : "Resend it"}
        </button>
      </div>
    </AuthLayout>
  );
};

export default Otp;
