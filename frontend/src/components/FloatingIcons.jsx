import React, { useRef, useEffect, useState } from "react";
import { FaWhatsapp, FaPhoneAlt, FaRobot } from "react-icons/fa";
import "../styles/FloatingIcons.css";
import ChatBot from "./Chatbot";

const FloatingIcons = () => {
  const whatsappLink = import.meta.env.VITE_WhatsappGroup_Link;
  const phoneNumber = import.meta.env.VITE_PhoneNumber;
  const [showChatbot, setShowChatbot] = useState(false);
  const chatbotRef = useRef(null);
  const iconRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [supportQuestions, setSupportQuestions] = useState([]);
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    const startPulsing = () => {
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 2000); 
    };
    const initialTimer = setTimeout(startPulsing, 10000);
    const interval = setInterval(startPulsing, 12000);
    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  const handlePhoneClick = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(phoneNumber);
    localStorage.setItem(
      "flashMessage",
      JSON.stringify({ 
        type: "success", 
        message: "✅ Phone number copied to clipboard!" 
      })
    );
    window.location.reload(); 
  };

  const toggleChatbot = () => {
    setShowChatbot(prev => !prev);
  };

  useEffect(() => {
    const flashMessage = localStorage.getItem("flashMessage");
    if (flashMessage) {
      const parsedMessage = JSON.parse(flashMessage);
      localStorage.removeItem("flashMessage");
    }

    const handleClickOutside = (event) => {
      if (showChatbot && 
          chatbotRef.current && 
          !chatbotRef.current.contains(event.target) &&
          !iconRef.current.contains(event.target)) {
        setShowChatbot(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showChatbot]);

  return (
    <>
      <div className="floating-icons">
        <a
          href={whatsappLink}
          className={`whatsapp-icon ${isPulsing ? "pulse-active" : ""}`}
          target="_blank"
          rel="noopener noreferrer"
          data-tooltip="Chat on WhatsApp"
        >
          <FaWhatsapp size={30} color="#25D366" />
        </a>
        <a 
          href={`tel:${phoneNumber}`} 
          className={`phone-icon ${isPulsing ? "pulse-active" : ""}`}
          onClick={handlePhoneClick}
          data-tooltip="Call Us"
        >
          <FaPhoneAlt size={20} color="#007BFF" />
        </a>
        <button 
          ref={iconRef}
          className={`chatbot-icon ${isPulsing ? "pulse-active" : ""}`}
          onClick={toggleChatbot}
          aria-label={showChatbot ? "Close chatbot" : "Open chatbot"}
          data-tooltip="Need help?"
        >
          <FaRobot size={25} color="#6c5ce7" />
        </button>
      </div>

      {showChatbot && (
        <div ref={chatbotRef} className="chatbot-modal">
          <ChatBot 
            messages={messages}
            setMessages={setMessages}
            input={input}
            setInput={setInput}
            supportQuestions={supportQuestions}
            setSupportQuestions={setSupportQuestions}
          />
        </div>
      )}
    </>
  );
};

export default FloatingIcons;