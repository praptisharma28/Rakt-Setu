import React, { useState, useRef, useEffect } from 'react';
import API from '../../services/API';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: 'Hi! 👋 I\'m your blood donation assistant. Ask me anything about donating blood!',
      suggestions: ['Can I donate blood?', 'Donation process', 'Blood types']
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (messageText) => {
    const userMessage = messageText || input;
    if (!userMessage.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const response = await API.post('/ai/chatbot', { message: userMessage });
      const data = response.data;

      if (data.success) {
        setMessages(prev => [...prev, {
          type: 'bot',
          text: data.data.botResponse,
          suggestions: data.data.suggestions
        }]);
      } else {
        setMessages(prev => [...prev, {
          type: 'bot',
          text: 'Sorry, I encountered an error. Please try again.'
        }]);
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages(prev => [...prev, {
        type: 'bot',
        text: 'Sorry, I\'m having trouble connecting. Please try again later.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <div className={`chatbot-toggle ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕' : '💬'}
      </div>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-content">
              <div className="chatbot-avatar">🤖</div>
              <div>
                <h3>Blood Donation Assistant</h3>
                <p className="chatbot-status">Online • Always here to help</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.type}`}>
                {msg.type === 'bot' && <div className="message-avatar">🤖</div>}
                <div className="message-content">
                  <div className="message-bubble">
                    {msg.text}
                  </div>
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="suggestions">
                      {msg.suggestions.map((sug, i) => (
                        <button
                          key={i}
                          className="suggestion-btn"
                          onClick={() => sendMessage(sug)}
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {msg.type === 'user' && <div className="message-avatar user">You</div>}
              </div>
            ))}
            {loading && (
              <div className="message bot">
                <div className="message-avatar">🤖</div>
                <div className="message-content">
                  <div className="message-bubble typing">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="chatbot-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about blood donation..."
              disabled={loading}
            />
            <button onClick={() => sendMessage()} disabled={loading || !input.trim()}>
              Send ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
