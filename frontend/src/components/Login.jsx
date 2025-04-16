import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Login.css";
import LoginImg from "../assets/loginIn.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.removeItem("flashMessage");
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
        email,
        password,
      });
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      if (response.ok) {
        localStorage.setItem("isLoggedIn", "true"); 
        localStorage.setItem(
          "flashMessage",
          JSON.stringify({ type: "success", message: "🎉 Welcome back to Last Night Engineering!" })
        );
        setTimeout(() => {
          window.location.href = `${import.meta.env.VITE_FRONTEND_URL}`;
        }, 1000);
      } else {
        localStorage.setItem(
          "flashMessage",
          JSON.stringify({ type: "error", message: `❌ ${result.message || "Invalid email or password. Please try again."}` })
        );
        window.location.reload();
      }
    } catch (error) {
      localStorage.setItem(
        "flashMessage",
        JSON.stringify({ type: "error", message: "⚠️ Something went wrong. Please try again later." })
      );
      window.location.reload();
    }
  };
  
  const handleGoogleSignIn = () => {
    localStorage.setItem("isLoggedIn", "true"); 
    localStorage.setItem(
      "flashMessage",
      JSON.stringify({ type: "success", message: "🎉 Welcome back to Last Night Engineering!" })
    );
    setTimeout(() => {
      window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/auth/google`;
    }, 1000);
    localStorage.setItem("isLoggedIn", "true"); 
  };

  return (
    <div className="loginContainer" style={{ marginTop: "170px" }}>
      <div className="container-fluid">
        <div className="row align-items-center justify-content-center">
          <div className="col-md-5 d-none d-md-flex align-items-center justify-content-center">
            <img src={LoginImg} alt="Illustration" style={{ maxWidth: "75%" }} />
          </div>

          <div className="col-md-6">
            <h3 className="fw-bold text-center mb-2">👋 Hey, welcome back!</h3>
            <p className="text-muted text-center mb-2">Enter your details to continue.</p>

            <form onSubmit={handleSubmit}>
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

              <div className="mb-2 position-relative">
                <label className="form-label">Password</label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    style={{ borderColor: "#ff8c00" }}
                    placeholder="Enter your password"
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

              <div className="text-end mb-2">
                <a href="/forgot-password" className="text-orange small">
                  Forgot password?
                </a>
              </div>

              <button type="submit" className="btn btn-orange w-100 mb-2">
                🔓 Sign in
              </button>
              <button
                type="button"
                className="btn btn-outline-orange w-100 d-flex align-items-center justify-content-center"
                onClick={handleGoogleSignIn}
              >
                <img src="https://img.icons8.com/color/16/000000/google-logo.png" className="me-1" alt="Google" />
                Sign in with Google
              </button>

              <p className="mt-2 text-center small">
                Don't have an account?{" "}
                <a
                  href="/register"
                  className="text-orange"
                  onClick={(e) => {
                    e.preventDefault();
                    localStorage.setItem(
                      "flashMessage",
                      JSON.stringify({ type: "success", message: "✅ You can sign up now!" })
                    );
                    window.location.href = "/register";
                  }}
                >
                  Sign up
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
