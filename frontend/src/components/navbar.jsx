import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/navbar.css";
import Logo from "../assets/Logo.png";
import FlashMsg from "../utils/FlashMsg";
import { FaBars, FaKey, FaSignOutAlt, FaCrown } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [flashMessage, setFlashMessage] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('');

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/projects')) setActiveTab('projects');
    else if (path.includes('/teaching')) setActiveTab('teaching');
    else if (path.includes('/notes')) setActiveTab('notes');
    else if (path.includes('/admin')) setActiveTab('admin');
  }, [location]);

  useEffect(() => {
    const fetchUser = async () => {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      if (!isLoggedIn) {
        setUser(null);
        setIsAdmin(false);
        return;
      }
    
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/user`, {
          withCredentials: true,
        });
        setUser(data.user);
        const adminIds = import.meta.env.VITE_ADMIN_IDS?.split(',') || [];
        if (data.user?.googleId && adminIds.includes(data.user.googleId)) {
          setIsAdmin(true);
        }
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem("isLoggedIn");
          setUser(null);
          setIsAdmin(false);
        } else {
          console.error("Error fetching user:", error);
        }
      }
    };
    
    fetchUser();
  }, []);

  useEffect(() => {
    const storedMessage = localStorage.getItem("flashMessage");
    if (storedMessage) {
      const { type, message } = JSON.parse(storedMessage);
      setFlashMessage({ type, message });
      localStorage.removeItem("flashMessage");
      setTimeout(() => setFlashMessage(null), 3000);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`, {
        method: "GET",
        credentials: "include",
      });
  
      localStorage.removeItem("isLoggedIn");
      setUser(null);
      setIsAdmin(false);
  
      if (response.ok) {
        localStorage.setItem(
          "flashMessage", 
          JSON.stringify({ type: "success", message: "😊Logged out successfully" })
        );
        window.location.reload();
      } else {
        const errorData = await response.json();
        console.error("Logout failed:", errorData);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleChangePassword = () => {
    navigate("/forgot-password");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-black px-3">
      <div className="container-fluid">
        <a className="navbar-brand text-white fw-bold" href="/">
          <img src={Logo} alt="Logo" width="100" />
        </a>

        <span 
          className="navbar-toggler" 
          type="button" 
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation"
        >
          <FaBars />
        </span>

        <div className={`collapse navbar-collapse ${mobileMenuOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <a 
                className={`nav-link text-white ${activeTab === 'projects' ? 'active' : ''}`} 
                href="/projects"
                onClick={() => setActiveTab('projects')}
              >
                💡 Projects
              </a>
            </li>
            <li className="nav-item">
              <a 
                className={`nav-link text-white ${activeTab === 'teaching' ? 'active' : ''}`} 
                href="/teaching"
                onClick={() => setActiveTab('teaching')}
              >
                🧑‍🏫 Teaching
              </a>
            </li>
            <li className="nav-item">
              <a 
                className={`nav-link text-white ${activeTab === 'notes' ? 'active' : ''}`} 
                href="/notes"
                onClick={() => setActiveTab('notes')}
              >
                📂 Notes
              </a>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-3">
            {user ? (
              <>
                {isAdmin && (
                  <ul className="navbar-nav me-auto admin-btn">
                    <li className="nav-item">
                      <a 
                        className={`nav-link text-white ${activeTab === 'admin' ? 'active' : ''}`} 
                        href="/admin"
                        onClick={() => setActiveTab('admin')}
                      >
                        <FaCrown className="me-1" /> Admin
                      </a>
                    </li>
                  </ul>
                )}
                
                <div className="desktop-user-dropdown">
                  <div className="position-relative user-dropdown">
                    <span
                      className="user-name"
                      onClick={(e) => {
                        e.stopPropagation(); 
                        setShowDropdown(!showDropdown);
                      }}
                    >
                      {user.fullName.split(" ")[0]}
                    </span>
                    {showDropdown && (
                      <div
                        className="dropdown-menu show"
                        onMouseEnter={() => setShowDropdown(true)}
                        onMouseLeave={() => setShowDropdown(false)}
                      >
                        <button
                          className="dropdown-item change-password"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleChangePassword();
                            setShowDropdown(false);
                          }}
                        >
                          <FaKey className="me-2" /> Change Password
                        </button>
                        <button
                          className="dropdown-item logout"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLogout();
                            setShowDropdown(false);
                          }}
                        >
                          <FaSignOutAlt className="me-2" /> Logout
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mobile-user-actions">
                  <button
                    className="mobile-action-btn change-password"
                    onClick={handleChangePassword}
                  >
                    <FaKey className="me-2" /> Change Password
                  </button>
                  <button
                    className="mobile-action-btn logout"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt className="me-2" /> Logout
                  </button>
                </div>
              </>
            ) : (
              <a href="/login" className="login">Login</a>
            )}
          </div>
        </div>
      </div>

      {flashMessage && (
        <FlashMsg 
          message={flashMessage.message} 
          type={flashMessage.type} 
          onClose={() => setFlashMessage(null)} 
        />
      )}
    </nav>
  );
};

export default Navbar;