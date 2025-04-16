import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import RegisterImg from "../assets/registerImg.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import FlashMsg from "../utils/FlashMsg";
import "../styles/Login.css";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    reasonToJoin: "",
    otp: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [flashMessage, setFlashMessage] = useState("");
  const [flashType, setFlashType] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isOtpButtonDisabled, setIsOtpButtonDisabled] = useState(false);
  const [isResendOtpButtonDisabled, setIsResendOtpButtonDisabled] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendOtp = async () => {
    if (isOtpButtonDisabled) return;

    setFlashMessage("");

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsOtpSent(true);
        setIsOtpButtonDisabled(true);
        setFlashMessage("📩 OTP sent to your email. Please check your inbox.");
        setFlashType("success");
      } else {
        setFlashMessage(data.message || "❌ Failed to send OTP.");
        setFlashType("error");
      }
    } catch (error) {
      setFlashMessage("⚠️ Something went wrong. Please try again.");
      setFlashType("error");
    }
  };

  const resendOtp = async () => {
    if (isResendOtpButtonDisabled) return;
    setFlashMessage("");
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsResendOtpButtonDisabled(true);
        setFlashMessage("📩 OTP resent to your email. Please check your inbox.");
        setFlashType("success");
      } else {
        setFlashMessage(data.message || "❌ Failed to resend OTP.");
        setFlashType("error");
      }
    } catch (error) {
      setFlashMessage("⚠️ Something went wrong. Please try again.");
      setFlashType("error");
    }
  };

  const verifyOtp = async () => {
    setFlashMessage("");

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp: formData.otp }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsOtpVerified(true);
        setFlashMessage("✅ OTP verified successfully! You can now register.");
        setFlashType("success");
      } else {
        setFlashMessage(data.message || "❌ Invalid OTP.");
        setFlashType("error");
      }
    } catch (error) {
      setFlashMessage("⚠️ Something went wrong. Please try again.");
      setFlashType("error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFlashMessage("");

    if (!isOtpVerified) {
      setFlashMessage("❗ Please verify your OTP before proceeding.");
      setFlashType("error");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem(
          "flashMessage",
          JSON.stringify({ type: "success", message: "✅ Registration successful! You can Login Now..." })
        );
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        setFlashMessage(data.message || "❌ Registration failed.");
        setFlashType("error");
      }
    } catch (error) {
      setFlashMessage("⚠️ Something went wrong. Please try again.");
      setFlashType("error");
    }
  };

  const handleGoogleSignUp = () => {
    localStorage.setItem("isLoggedIn", "true"); 
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/auth/google`;
  };

  return (
    <div className="loginContainer signupcontainer" style={{ marginTop: "170px" }}>
      <div className="container-fluid">
        <div className="row align-items-center justify-content-center">
          <div className="col-md-5 d-none d-md-flex align-items-center justify-content-center">
            <img src={RegisterImg} alt="Illustration" style={{ maxWidth: "75%" }} />
          </div>

          <div className="col-md-6">
            {flashMessage && <FlashMsg message={flashMessage} type={flashType} />}

            <h3 className="fw-bold text-center mb-2">😊 Join Us Today!</h3>
            <p className="text-muted text-center mb-2">Become a Member</p>

            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  style={{ borderColor: "#ff8c00" }}
                  name="fullName"
                  placeholder="Enter full name"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-2">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  style={{ borderColor: "#ff8c00" }}
                  name="email"
                  placeholder="Enter email"
                  onChange={handleChange}
                  required
                />
              </div>

              {!isOtpSent && (
                <button
                  type="button"
                  className="btn btn-outline-orange w-100 mb-2"
                  onClick={sendOtp}
                  disabled={isOtpButtonDisabled}
                >
                  📩 Send OTP
                </button>
              )}

              {isOtpSent && !isOtpVerified && (
                <div className="mb-2">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      style={{ borderColor: "#ff8c00" }}
                      name="otp"
                      placeholder="Enter OTP"
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-orange"
                      onClick={verifyOtp}
                      style={{ borderColor: "#ff8c00" }}
                    >
                      ✅Verify
                    </button>
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline-orange w-100 mt-2"
                    onClick={resendOtp}
                    disabled={isResendOtpButtonDisabled}
                  >
                    🔄 Resend OTP
                  </button>
                </div>
              )}

              <div className="mb-2 position-relative">
                <label className="form-label">Create Password</label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    style={{ borderColor: "#ff8c00" }}
                    name="password"
                    placeholder="Enter password"
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary eyes"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ borderColor: "#ff8c00", color: "#ff8c00", backgroundColor: "transparent" }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = "lightyellow")}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
                  >
                    {showPassword ? <FaEyeSlash color="#ff8c00" /> : <FaEye color="#ff8c00" />}
                  </button>
                </div>
              </div>

              <div className="mb-2">
                <label className="form-label">Why do you want to join?</label>
                <select
                  className="form-control"
                  style={{ borderColor: "#ff8c00" }}
                  name="reasonToJoin"
                  value={formData.reasonToJoin || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>-- Select an Option --</option>
                  <option value="I need a project">I need a project</option>
                  <option value="I want to explore notes">I want to explore notes</option>
                  <option value="I want to start learning">I want to start learning</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <button type="submit" className="btn btn-orange w-100 mb-2" disabled={!isOtpVerified}>
                🔐 Sign Up
              </button>

              <button
                type="button"
                className="btn btn-outline-orange w-100 d-flex align-items-center justify-content-center"
                onClick={handleGoogleSignUp}
              >
                <img src="https://img.icons8.com/color/16/000000/google-logo.png" className="me-1" alt="Google" />
                Sign Up with Google
              </button>

              <p className="mt-2 text-center small">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-orange"
                  onClick={(e) => {
                    e.preventDefault();
                    localStorage.setItem(
                      "flashMessage",
                      JSON.stringify({ type: "success", message: "✅ You can sign in now!" })
                    );
                    window.location.href = "/login";
                  }}
                >
                  Login
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;