import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Chat.css"; // We'll move styles to a separate CSS file

const Chat = () => {
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState("en");
  const [voiceOutputEnabled, setVoiceOutputEnabled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [savedHistories, setSavedHistories] = useState([]);

  const navigate = useNavigate();
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || {};

  const languages = [
    { code: "en", name: "English" },
    { code: "te", name: "Telugu" },
    { code: "hi", name: "Hindi" },
  ];

  const chatHistoryRef = useRef(null);

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleTextChat = async (newSession = false) => {
    if (!question.trim()) return;

    setChatHistory((prev) => [
      ...prev,
      { type: "user", text: question, timestamp: Date.now() },
    ]);

    setLoading(true);
    setQuestion("");

    try {
      const textRes = await axios.post("http://localhost:8000/chat", {
        question,
        lang,
        new_session: newSession,
      });

      let audioUrl = null;
      if (voiceOutputEnabled) {
        const voiceRes = await axios.post(
          "http://localhost:8000/voice-output",
          { question, lang, new_session: newSession },
          { responseType: "blob" }
        );
        const audioBlob = new Blob([voiceRes.data], { type: "audio/mp3" });
        audioUrl = URL.createObjectURL(audioBlob);
      }

      setChatHistory((prev) => [
        ...prev,
        {
          type: "bot",
          text: textRes.data.response,
          audioUrl: audioUrl,
          timestamp: Date.now(),
        },
      ]);
    } catch (error) {
      setChatHistory((prev) => [
        ...prev,
        { type: "bot", text: "Error: Could not get a response.", timestamp: Date.now() },
      ]);
      console.error("Chat Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = lang;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuestion(transcript);
    };
    recognition.onerror = (event) => {
      setChatHistory((prev) => [
        ...prev,
        { type: "bot", text: "Error: Could not recognize speech.", timestamp: Date.now() },
      ]);
      console.error(event.error);
    };
    recognition.start();
  };

  const toggleVoiceOutput = () => {
    setVoiceOutputEnabled((prev) => !prev);
  };

  const saveChatHistory = () => {
    if (chatHistory.length === 0) return;

    const now = Date.now();
    const newSession = {
      id: `${loggedInUser?.email}-${now}`,
      userEmail: loggedInUser?.email,
      timestamp: now,
      history: [...chatHistory],
      question: chatHistory.find((item) => item.type === "user")?.text || "Untitled",
    };

    const existingHistories = JSON.parse(localStorage.getItem("chatHistories") || "[]");
    const sevenDaysAgo = now - 604800000;
    const filteredHistories = existingHistories.filter(
      (session) => session.timestamp > sevenDaysAgo
    );

    const updatedHistories = [...filteredHistories, newSession];
    localStorage.setItem("chatHistories", JSON.stringify(updatedHistories));
    setSavedHistories(updatedHistories);
  };

  const startNewChat = () => {
    if (chatHistory.length > 0) {
      saveChatHistory();
    }
    setChatHistory([]);
    setQuestion("");
  };

  const toggleProfileDropdown = () => {
    setIsProfileOpen((prev) => !prev);
    setIsHistoryOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  const toggleHistoryDropdown = () => {
    setIsHistoryOpen((prev) => !prev);
    setIsProfileOpen(false);

    if (!isHistoryOpen) {
      const existingHistories = JSON.parse(localStorage.getItem("chatHistories") || "[]");
      const sevenDaysAgo = Date.now() - 604800000;
      const userHistories = existingHistories
        .filter(
          (session) =>
            session.userEmail === loggedInUser?.email && session.timestamp > sevenDaysAgo
        )
        .sort((a, b) => b.timestamp - a.timestamp);
      setSavedHistories(userHistories);
    }
  };

  const loadChatSession = (session) => {
    setChatHistory(session.history);
    setIsHistoryOpen(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      handleTextChat(false);
    }
  };

  return (
    <div className="chat-page">
      <header className="chat-header">
        <div className="header-left">
        <img src="/elogo.png" alt="EduBot Logo" className="header-logo" />
          <h2>EduBot Assistant</h2>
        </div>
        <div className="header-right">
          <button
            onClick={startNewChat}
            className="header-btn new-chat-btn"
            disabled={loading}
            title="Start New Chat"
          >
            <i className="fas fa-plus"></i>
            <span>New Chat</span>
          </button>
          <button
            onClick={toggleHistoryDropdown}
            className="header-btn history-btn"
            disabled={loading}
            title="View Chat History"
          >
            <i className="fas fa-history"></i>
            <span>History</span>
          </button>
          {isHistoryOpen && (
            <div className="history-dropdown">
              {savedHistories.length === 0 ? (
                <div className="history-empty">No saved history</div>
              ) : (
                savedHistories.map((session) => (
                  <div
                    key={session.id}
                    className="history-item"
                    onClick={() => loadChatSession(session)}
                  >
                    <i className="fas fa-comment-dots"></i>
                    <div className="history-item-content">
                      <span className="history-item-text">{session.question}</span>
                      <span className="history-item-time">
                        {new Date(session.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
          <div className="profile-container">
            <button
              className="header-btn profile-btn"
              onClick={toggleProfileDropdown}
            >
              <i className="fas fa-user"></i>
              <span>{loggedInUser?.name?.split(' ')[0] || "User"}</span>
            </button>
            {isProfileOpen && (
              <div className="profile-dropdown">
                <div className="profile-header">
                  <div className="profile-avatar">
                    {loggedInUser?.name?.charAt(0) || "U"}
                  </div>
                  <div className="profile-info">
                    <h4>{loggedInUser?.name || "Guest"}</h4>
                    <p>{loggedInUser?.email || "N/A"}</p>
                  </div>
                </div>
                <div className="profile-divider"></div>
                <button className="logout-btn" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt"></i>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="chat-main">
        <div className="chat-container">
          <div className="controls-section">
            <div className="language-control">
              <label htmlFor="lang">
                <i className="fas fa-language"></i>
                Language
              </label>
              <select
                id="lang"
                value={lang}
                onChange={(e) => setLang(e.target.value)}
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="voice-control">
              <label htmlFor="voiceToggle">
                <i className="fas fa-volume-up"></i>
                
              </label>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  id="voiceToggle"
                  checked={voiceOutputEnabled}
                  onChange={toggleVoiceOutput}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div className="chat-messages">
            <div 
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "1rem",
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                marginBottom: "1rem",
                height: "calc(100% - 200px)",
                scrollbarWidth: "thin",
                scrollbarColor: "#4f46e5 #f1f1f1",
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "#f1f1f1",
                  borderRadius: "10px",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "#4f46e5",
                  borderRadius: "10px",
                },
              }}
              ref={chatHistoryRef}
            >
              {chatHistory.map((item, index) => (
                <div
                  key={index}
                  className={`message ${item.type === "user" ? "user" : "bot"}`}
                >
                  <div className="message-avatar">
                    {item.type === "user" ? (
                      <i className="fas fa-user"></i>
                    ) : (
                      <i className="fas fa-robot"></i>
                    )}
                  </div>
                  <div className="message-content">
                    <div className="message-header">
                      <span className="message-sender">
                        {item.type === "user" ? "You" : "EduBot"}
                      </span>
                      <span className="message-time">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="message-text">{item.text}</div>
                    {item.audioUrl && voiceOutputEnabled && (
                      <audio
                        controls
                        src={item.audioUrl}
                        className="message-audio"
                        autoPlay
                      >
                        Your browser does not support the audio element.
                      </audio>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="loading-indicator">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="input-section">
          <div className="input-container">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              disabled={loading}
            />
            <button
              className="voice-input-btn"
              onClick={handleVoiceInput}
              disabled={loading}
              title="Voice Input"
            >
              <i className="fas fa-microphone"></i>
            </button>
            <button
              className="send-btn"
              onClick={() => handleTextChat(false)}
              disabled={loading || !question.trim()}
              title="Send Message"
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;