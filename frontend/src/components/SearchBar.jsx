import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/SearchBar.css";

const SearchBar = ({ onSearch, suggestions = [] }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      if (!isLoggedIn) {
        setUser(null);
        setIsAdmin(false);
        return;
      }

      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/user`,
          { withCredentials: true }
        );
        setUser(data.user);
        const adminIds = import.meta.env.VITE_ADMIN_IDS?.split(",") || [];
        if (data.user?.googleId && adminIds.includes(data.user.googleId)) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        if (error.response?.status === 401) {
          setUser(null);
          setIsAdmin(false);
        } else {
          console.error("Error fetching user:", error);
        }
      }
    };
    fetchUser();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    onSearch(suggestion);
    setIsFocused(false);
  };

  const handleAdminAction = () => {
    if (!user) {
      localStorage.setItem(
        "flashMessage",
        JSON.stringify({ 
          type: "error", 
          message: "🔒 Please login to access admin features" 
        })
      );
      navigate("/login");
      return;
    }
    navigate("/createpost");
  };

  const handleWantAction = () => {
    if (!user) {
      localStorage.setItem(
        "flashMessage",
        JSON.stringify({ type: "error", message: "🔒 Please login to access this feature" })
      );
      navigate("/login");
      window.location.reload();
      return;
    }
    navigate("/contactus");
  };

  return (
    <div className="search-bar-wrapper">
      <div className="search-bar-container">
        <input
          type="text"
          className={`search-input ${isFocused ? "focused" : ""}`}
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearch}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        />

        <div className="buttons-container">
          {isAdmin && (
            <button
              onClick={handleAdminAction}
              className="btn-create"
            >
              ADD
            </button>
          )}
          <button
            onClick={handleWantAction}
            className="btn-want"
          >
            I Want ...
          </button>
        </div>
      </div>

      {isFocused && searchQuery && (
        <div className="suggestions-box">
          {suggestions.length > 0 ? (
            suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </div>
            ))
          ) : (
            <div className="no-suggestions">No suggestions found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;