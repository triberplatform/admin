"use client";
import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "./store/useAuthStore";
import { signinPayLoad } from "./types/payload";
import Loading from "./loading";
import ErrorModal from "./components/Modals/ErrorModalAuth";

// Define validation schema
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const TribeLoginForm: React.FC = () => {
  const {
    signin,
    loading,
    error,
    success,
    message,
    showErrorModal,
    clearError,
    resetAuthState,
    isAuthenticated,
  } = useAuthStore();

  const router = useRouter();
  const [submitError, setSubmitError] = useState<string>("");

  // Reset loading state and errors on page load/refresh and clear any potentially invalid auth state
  useEffect(() => {
    clearError();
    resetAuthState(); // Reset auth state to prevent auto-redirect if token is invalid
  }, [clearError, resetAuthState]);

  // Monitor authentication state changes instead of token
  useEffect(() => {
    if (isAuthenticated) {
      console.log("User authenticated, redirecting to dashboard");
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  // Monitor error changes to display them
  useEffect(() => {
    if (error && !showErrorModal) {
      setSubmitError(message || error);
    }
  }, [error, message, showErrorModal]);

// Modified handleSubmit method for your TribeLoginForm component

const handleSubmit = async (
  values: signinPayLoad,
  { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
) => {
  try {
    setSubmitError("");

    console.log("Submitting login form with:", values);

    // Call signin method from auth store and wait for it to complete
    const loginSuccess = await signin(values);

    console.log("Signin completed, success:", loginSuccess);

    // Only redirect if signin returned true, which means API returned 200 and a valid token
    if (loginSuccess) {
      console.log("Login successful, redirecting to dashboard");
      router.push("/dashboard");
    } else {
      // We have an error but we DO NOT want to reset the form or refresh the page
      console.log("Login failed, keeping form values and showing error modal");
      
      // The error modal will be shown by the store automatically
      // No need to reset the form or redirect, just stay on the page
    }
  } catch (err: any) {
    console.error("Login client error:", err);
    setSubmitError(err?.message || "Login failed. Please try again later.");
  } finally {
    setSubmitting(false);
  }
};
  return (
    <div className="flex flex-col items-center justify-center mt-10 mx-[20%] p-4">
      {/* Include ErrorModal component */}
      <ErrorModal />

      {/* Show loading overlay when loading is true */}
      <Loading isVisible={loading} text="Signing in..." />

      <h1 className="text-4xl font-bold text-center mb-2">Triber Admin</h1>
      <p className="text-xl text-green-500 text-center mb-8">
        Input Details to login
      </p>


      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={LoginSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className="w-full space-y-4">
            <div>
              <label htmlFor="email" className="block mb-1">
                Email Address
              </label>
              <Field
                type="email"
                name="email"
                id="email"
                placeholder="Enter Your Email Address"
                className={`w-full p-3 border rounded-md ${
                  errors.email && touched.email
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div className="flex flex-wrap -mx-2">
              <div className="w-full px-2 mb-4 md:mb-0">
                <label htmlFor="password" className="block mb-1">
                  Password
                </label>
                <Field
                  type="password"
                  name="password"
                  id="password"
                  placeholder="********"
                  className={`w-full p-3 border rounded-md ${
                    errors.password && touched.password
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-md transition duration-150 ease-in-out disabled:opacity-50"
            >
              {isSubmitting || loading ? "Logging in..." : "Login"}
            </button>

            <div className="mt-4 text-center">
              <Link
                href="/register"
                className="text-green-500 hover:text-green-700 font-medium"
              >
                Need an account? Register here
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default TribeLoginForm;
