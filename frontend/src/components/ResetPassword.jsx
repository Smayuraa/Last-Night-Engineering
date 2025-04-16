import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import FlashMsg from "../utils/FlashMsg";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/Login.css";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [flashMessage, setFlashMessage] = useState("");
  const [flashType, setFlashType] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await response.json();

      if (response.ok) {
        setFlashMessage("✅ Password reset successfully! You can now login.");
        setFlashType("success");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        setFlashMessage(data.message || "❌ Failed to reset password.");
        setFlashType("error");
      }
    } catch (error) {
      setFlashMessage("⚠️ Something went wrong. Please try again.");
      setFlashType("error");
    }
  };

  return (
    <div className="loginContainer resetcontainer" style={{ marginTop: "170px" }}>
      <div className="container-fluid">
        <div className="row align-items-center justify-content-center">
          <div className="col-md-5 d-none d-md-flex align-items-center justify-content-center">
            <img
              src="https://img.icons8.com/fluency/96/password.png"
              alt="Reset Password"
              style={{ maxWidth: "75%" }}
            />
          </div>

          <div className="col-md-6">
            {flashMessage && <FlashMsg message={flashMessage} type={flashType} />}

            <h3 className="fw-bold text-center mb-2">🔒 Reset Your Password</h3>
            <p className="text-muted text-center mb-2">Enter a new strong password</p>

            <form onSubmit={handleResetPassword}>
              <div className="mb-2 position-relative">
                <label className="form-label">New Password</label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    style={{ borderColor: "#ff8c00" }}
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              <button type="submit" className="btn btn-orange w-100 mb-2">
                🔐 Reset Password
              </button>

              <p className="mt-2 text-center small">
                Remember your password?{" "}
                <a
                  href="/login"
                  className="text-orange"
                  onClick={(e) => {
                    e.preventDefault();
                    localStorage.setItem(
                      "flashMessage",
                      JSON.stringify({ type: "success", message: "✅ You can Login now!" })
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

export default ResetPassword;