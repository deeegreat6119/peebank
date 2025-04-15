import React, { useState,} from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import bankLogo from "../assets/peebank-logo.svg";
import baseUrl from "../Constants";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
      .required("Phone is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(/[0-9]/, "Password requires a number")
      .matches(/[a-z]/, "Password requires a lowercase letter")
      .matches(/[A-Z]/, "Password requires an uppercase letter")
      .matches(/[^\w]/, "Password requires a symbol")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
    acceptTerms: Yup.boolean().oneOf([true], "You must accept the terms"),
  });

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      console.log('Submitting to:', `${baseUrl}/api/v1/auth/signup`);
      console.log('Request payload:', {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        password: values.password
      });
      const response = await fetch(`${baseUrl}/api/v1/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone,
          password: values.password
        }), // ← confirmPassword removed
      });
  
      const data = await response.json();
      console.log('Response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }
      
      if (data.status === "success") {
        console.log('Signup successful - Full response:', data);
        alert(`Signup successful! User ID: ${data.user?.id || 'unknown'}`);
        // Store verification token if available
        if (data.verificationToken) {
          localStorage.setItem('verifyToken', data.verificationToken);
        }
      } else {
        console.error('Signup response indicates failure:', data);
        alert(`Signup issue: ${data.message || 'Unknown error'}`);
      }
  
      // if (data.status === "success") {
      //   navigate("/verify-email");
      // }
    } catch (error) {
      console.error("Registration failed", error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <img src={bankLogo} alt="PeeBank Logo" className="auth-logo" />
          <h1>Create Your Account</h1>
          <p>Join PeeBank for secure digital banking</p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, values }) => (
            <Form className="auth-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <div className="input-container">
                    <FiUser className="input-icon" />
                    <Field
                      name="firstName"
                      type="text"
                      placeholder="mark"
                      className={`form-input ${
                        errors.firstName && touched.firstName ? "error" : ""
                      }`}
                      // ref={firstNameField}
                    />
                  </div>
                  <ErrorMessage
                    name="firstName"
                    component="div"
                    className="error-message"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <div className="input-container">
                    <FiUser className="input-icon" />
                    <Field
                      name="lastName"
                      type="text"
                      placeholder="zukuk"
                      className={`form-input ${
                        errors.lastName && touched.lastName ? "error" : ""
                      }`}
                      // ref={lastNameField}
                    />
                  </div>
                  <ErrorMessage
                    name="lastName"
                    component="div"
                    className="error-message"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-container">
                  <FiMail className="input-icon" />
                  <Field
                    name="email"
                    type="email"
                    placeholder="peter@example.com"
                    className={`form-input ${
                      errors.email && touched.email ? "error" : ""
                    }`}
                    // ref={emailField}
                  />
                </div>
                <ErrorMessage
                  name="email"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <div className="input-container">
                  <FiPhone className="input-icon" />
                  <Field
                    name="phone"
                    type="tel"
                    placeholder="1234567890"
                    className={`form-input ${
                      errors.phone && touched.phone ? "error" : ""
                    }`}
                    // ref={phoneField}
                  />
                </div>
                <ErrorMessage
                  name="phone"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-container">
                  <FiLock className="input-icon" />
                  <Field
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create password"
                    className={`form-input ${
                      errors.password && touched.password ? "error" : ""
                    }`}
                    // ref={passwordField}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="error-message"
                />
                <div className="password-hints">
                  <span
                    className={/^.{8,}$/.test(values.password) ? "valid" : ""}
                  >
                    8+ characters
                  </span>
                  <span
                    className={/[A-Z]/.test(values.password) ? "valid" : ""}
                  >
                    Uppercase
                  </span>
                  <span
                    className={/[0-9]/.test(values.password) ? "valid" : ""}
                  >
                    Number
                  </span>
                  <span
                    className={/[^\w]/.test(values.password) ? "valid" : ""}
                  >
                    Symbol
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-container">
                  <FiLock className="input-icon" />
                  <Field
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm password"
                    className={`form-input ${
                      errors.confirmPassword && touched.confirmPassword
                        ? "error"
                        : ""
                    }`}
                    // ref={confirmPasswordField}
                  />
                </div>
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="form-group checkbox-group">
                <Field type="checkbox" id="acceptTerms" name="acceptTerms" />
                <label htmlFor="acceptTerms">
                  I agree to the <Link to="/terms">Terms of Service</Link> and{" "}
                  <Link to="/privacy">Privacy Policy</Link>
                </label>
                <ErrorMessage
                  name="acceptTerms"
                  component="div"
                  className="error-message"
                />
              </div>

              <button
                type="submit"
                className="auth-button"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>
            </Form>
          )}
        </Formik>

        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/sign-in">Sign in</Link>
          </p>
        </div>
      </div>

      <div className="auth-banner">
        <div className="banner-content">
          <h2>Why Choose PeeBank?</h2>
          <ul className="benefits-list">
            <li>24/7 Digital Banking Access</li>
            <li>FDIC Insured Up To $250,000</li>
            <li>1.5% Higher Savings Rates</li>
            <li>Zero Fraud Liability</li>
            <li>Biometric Authentication</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
