'use client'
import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RegisterPayload } from "../types/payload";
import { useAuthStore } from "../store/useAuthStore";
import Loading from "../loading";
import ErrorModal from "../components/Modals/ErrorModalAuth";
import EditUserSuccessModal from "../components/Modals/EditUserSuccess";

// Define validation schema
const SignupSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "First name is too short")
    .max(50, "First name is too long")
    .required("First name is required"),
  lastName: Yup.string()
    .min(2, "Last name is too short")
    .max(50, "Last name is too long")
    .required("Last name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/,
      "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, 1 symbol, and be at least 8 characters"
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password")
});

const TribeSignupForm = () => {
  const { registerUser, loading, message, error, success, showErrorModal, clearError } = useAuthStore();
  const router = useRouter();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showModal, setShowModal] = useState(false)
  
  // Reset loading state and errors on page load/refresh
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Monitor changes in success/error state
  useEffect(() => {
    if (formSubmitted) {
      if (success) {
        // Show success message
        setShowModal(true);
        // Reset form state
        setFormSubmitted(false);
        // Optionally redirect to login
        // router.push('/login');
      } else if (error && !showErrorModal) {
        // Show error message from API if not showing in modal
        setApiError(message || error);
        setFormSubmitted(false);
      }
    }
  }, [success, message, error, formSubmitted, router, showErrorModal]);

  const handleSubmit = async (
    values: RegisterPayload,
    { setSubmitting, resetForm }: any
  ) => {
    try {
      setApiError("");
      setFormSubmitted(true);

      // Remove confirmPassword before sending to API
      const { confirmPassword, ...signupData } = values;

      // Call your API endpoint
      await registerUser(signupData);
      
      // If registration is successful, resetForm
      if (success) {
        resetForm();
      }
    } catch (err) {
      console.error(err);
      // This catch block handles client-side errors like network issues
      setApiError("Registration failed. Please try again later.");
      setFormSubmitted(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mx-[20%] p-4">
      {/* Include ErrorModal component */}
      <ErrorModal />
      
      {/* Show loading overlay when loading is true */}
      <Loading isVisible={loading} text="Creating your account..." />
     <EditUserSuccessModal title="Message" isOpen={showModal} onClose={() => setShowModal(false)} text={message}/>
      
      <h1 className="text-4xl font-bold text-center mb-2">Triber Admin</h1>
      <p className="text-xl text-green-500 text-center mb-8">
        Get started by signing up
      </p>

      {/* Display API error message in a more prominent way */}
      {apiError && (
        <div className="w-full mb-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded-md">
          <p className="font-medium">Registration Error</p>
          <p>{apiError}</p>
        </div>
      )}

      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: ""
        }}
        validationSchema={SignupSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className="w-full space-y-4">
            <div className="flex flex-wrap -mx-2">
              <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
                <label htmlFor="firstName" className="block mb-1">
                  First Name
                </label>
                <Field
                  type="text"
                  name="firstName"
                  id="firstName"
                  placeholder="Enter Your First Name"
                  className={`w-full p-3 border rounded-md ${
                    errors.firstName && touched.firstName
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <ErrorMessage
                  name="firstName"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="w-full md:w-1/2 px-2">
                <label htmlFor="lastName" className="block mb-1">
                  Last Name
                </label>
                <Field
                  type="text"
                  name="lastName"
                  id="lastName"
                  placeholder="Enter Your Last Name"
                  className={`w-full p-3 border rounded-md ${
                    errors.lastName && touched.lastName
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <ErrorMessage
                  name="lastName"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
            </div>

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
              <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
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

              <div className="w-full md:w-1/2 px-2">
                <label htmlFor="confirmPassword" className="block mb-1">
                  Confirm Password
                </label>
                <Field
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="********"
                  className={`w-full p-3 border rounded-md ${
                    errors.confirmPassword && touched.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
            </div>

            <div className="text-sm text-gray-600">
              At least 1 uppercase letter, 1 lowercase letter, 1 number, 1
              symbol, and must be at least 8 characters.
            </div>

            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-md transition duration-150 ease-in-out disabled:opacity-50"
            >
              {(isSubmitting || loading) ? "Signing Up..." : "Sign Up"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default TribeSignupForm;