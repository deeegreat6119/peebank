import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import {
  FiLock,
  FiMail,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiArrowRight,
} from "react-icons/fi";
import bankLogo from "../assets/peebank-logo.svg";
import baseUrl from "../Constants";

const SignIn = () => {
  // const emailRef = useRef();
  // const passwordRef = useRef();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const initialValues = {
    email: "",
    password: "",
    remember: false,
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string()
      .min(8, "Must be at least 8 characters")
      .required("Required"),
  });

  const handleSubmit = async (values) => {
    setIsLoading(true);

    try {
      // const email = emailRef.current.value;
      // const password = passwordRef.current.value;

      // if (!email || !password) {
      //   alert("Please enter both email and password");
      //   setIsLoading(false);
      //   return;
      // }

      const response = await fetch(`${baseUrl}/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important for cookies
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle different error cases based on status code
        if (response.status === 401) {
          alert("Invalid email or password");
        } else if (response.status === 403) {
          alert("Account not verified. Please check your email");
        } else {
          alert(data.message || "Login failed");
        }
        return;
      }

      if (data.status === "success") {
        // You might want to store the token here before navigation
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login failed", error);
      alert("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="signin-container">
      <div className="main-signin-holder">
        <div className="signin-card">
          <div className="signin-header">
            <img src={bankLogo} alt="PeeBank Logo" className="signin-logo" />
            <h1>Welcome Back</h1>
            <p>Sign in to access your accounts</p>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form className="signin-form">
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <div className="input-container">
                    <FiMail className="input-icon" />
                    <Field
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      className={`form-input ${
                        errors.email && touched.email ? "error" : ""
                      }`}
                      // innerRef={emailRef}
                    />
                  </div>
                  <ErrorMessage
                    name="email"
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
                      placeholder="Enter your password"
                      className={`form-input ${
                        errors.password && touched.password ? "error" : ""
                      }`}
                      // innerRef={passwordRef}
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
                </div>

                <div className="form-options">
                  <div className="remember-me">
                    <Field type="checkbox" id="remember" name="remember" />
                    <label htmlFor="remember">Remember me</label>
                  </div>
                  <a href="/forgot-password" className="forgot-password">
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  className="signin-button"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </button>
              </Form>
            )}
          </Formik>

          <div className="signin-footer">
            <p>
              Don't have an account? <Link to="/sign-up"> Sign up</Link>
            </p>
            <div className="security-info">
              <span className="secure-badge">
                <FiLock size={14} /> Secure Login
              </span>
              <span className="encryption-badge">256-bit SSL Encryption</span>
            </div>
          </div>
        </div>
        <div className="promo-banner">
          <div className="promo-content">
            <div className="promo-badge">NEW</div>
            <h3 className="promo-title">
              Earn $300 When You Open an Eligible Checking Account
            </h3>
            <ul className="promo-benefits">
              <li>
                <FiCheckCircle className="benefit-icon" /> $300 bonus with
                qualifying direct deposits
              </li>
              <li>
                <FiCheckCircle className="benefit-icon" /> No monthly
                maintenance fees
              </li>
              <li>
                <FiCheckCircle className="benefit-icon" /> Early payroll with
                direct deposit
              </li>
            </ul>
            <Link to="/sign-up" className="promo-cta">
              Get Started <FiArrowRight className="cta-icon" />
            </Link>
          </div>
        </div>
      </div>

      <div className="signin-banner">
        <div className="banner-content">
          <h2>PeeBank Secure Banking</h2>
          <p>
            Your security is our top priority. We use industry-leading
            encryption to protect your data.
          </p>
          <ul className="security-features">
            <li>Two-Factor Authentication</li>
            <li>Real-Time Fraud Monitoring</li>
            <li>Biometric Login Options</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
