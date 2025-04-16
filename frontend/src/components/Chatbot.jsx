import React, { useState, useEffect, useRef } from "react";
import "../styles/Chatbot.css";

const Chatbot = ({
  messages,
  setMessages,
  input,
  setInput,
  supportQuestions,
  setSupportQuestions
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (supportQuestions.length === 0) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/data/support`)
        .then((response) => response.json())
        .then((data) => {
          if (data.success) setSupportQuestions(data.data);
        })
        .catch(console.error);
    }
  }, [supportQuestions.length, setSupportQuestions]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage = { text: input, sender: "user" };
    const botMessage = { 
      text: generateResponse(input), 
      sender: "bot" 
    };
    
    setMessages([...messages, userMessage, botMessage]);
    setInput("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const generateResponse = (userInput) => {
    const matchedQuestion = supportQuestions.find(q =>
      q.question.toLowerCase().includes(userInput.toLowerCase())
    );
    return matchedQuestion?.answer || 
    <>
      I can't answer this question. For further queries, you can{" "}
      <a href="/contacts" className="contact-link">contact us</a>.
    </>
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);
    
    if (value.trim()) {
      const filtered = supportQuestions
        .filter(q => q.question.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 3);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (question) => {
    setInput(question);
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current.focus();
  };

  return (
    <div className="chatbotContainer">
      <div className="chatWindow">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.sender}Message`}>
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="inputArea">
        {showSuggestions && (
          <div className="suggestionsContainer">
            {suggestions.map((s, i) => (
              <div
                key={i}
                className="suggestion"
                onClick={() => handleSuggestionClick(s.question)}
              >
                {s.question}
              </div>
            ))}
          </div>
        )}
        
        <div className="inputContainer">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(suggestions.length > 0)}
            onKeyPress={e => e.key === "Enter" && handleSend()}
            className="input"
            placeholder={suggestions.length ? "Or select from suggestions above..." : "Ask me anything..."}
          />
          <button onClick={handleSend} className="button">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;