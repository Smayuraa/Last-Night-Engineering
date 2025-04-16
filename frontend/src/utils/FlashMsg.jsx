import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

const FlashMsg = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message || !visible) return null;

  return (
    <div
      className="alert d-flex justify-content-between align-items-center"
      style={{
        backgroundColor: type === "success" ? "#28a745" : "#dc3545",
        color: "#fff",
        padding: "10px 15px",
        borderRadius: "5px",
        position: "fixed",
        top: "78px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "80%",
        maxWidth: "800px",
        zIndex: 1050,
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
        border: "2px solid #fff700",
      }}
    >
      <span>{message}</span>
      <button
        onClick={() => {
          setVisible(false);
          onClose();
        }}
        style={{
          background: "transparent",
          border: "none",
          color: "#fff",
          fontSize: "18px",
          cursor: "pointer",
          fontWeight: "bold",
          outline: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FaTimes size={20} color="white" />
      </button>
    </div>
  );
};

export default FlashMsg;