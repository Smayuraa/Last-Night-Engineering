import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Login.css";
import FlashMsg from "../utils/FlashMsg";
import forgotpassImg from '../assets/forgotpassImg.png';
import { FaLink } from "react-icons/fa";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [flashMessage, setFlashMessage] = useState("");
  const [flashType, setFlashType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setFlashMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to send reset link");

      setFlashMessage("✅ Reset link sent to your email.");
      setFlashType("success");
    } catch (error) {
      setFlashMessage(error.message || "⚠️ Something went wrong.");
      setFlashType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginContainer forgetcontainer">
      <div className="container-fluid ">
        <div className="row align-items-center justify-content-center">
          <div className="col-md-5 d-none d-md-flex align-items-center justify-content-center">
            <img src={forgotpassImg} alt="Illustration" style={{ maxWidth: "75%" }} />
          </div>

          <div className="col-md-6">
            {flashMessage && <FlashMsg message={flashMessage} type={flashType} />}

            <h3 className="fw-bold text-center mb-2">🔑 Forgot Password?</h3>
            <p className="text-muted text-center mb-2">Enter your email to reset your password.</p>

            <form onSubmit={handleForgotPassword}>
              <div className="mb-2">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  style={{ borderColor: "#ff8c00" }}
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-orange w-100 mb-2" disabled={loading}>
                <FaLink /> {loading ? "Sending..." : "Send Reset Link"}
              </button>

              <p className="mt-2 text-center small">
                Remembered your password?{" "}
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

export default ForgetPassword;