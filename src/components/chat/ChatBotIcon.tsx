import React from 'react';
import './ChatBotIcon.css';

interface ChatBotIconProps {
  size?: number;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export const ChatBotIcon: React.FC<ChatBotIconProps> = ({ 
  size = 60, 
  isActive = false, 
  onClick, 
  className = '' 
}) => {
  return (
    <button
      onClick={onClick}
      className={`y7-chatbot-icon ${isActive ? 'active' : ''} ${className}`}
      style={{ width: size, height: size }}
      aria-label="Open Y7 AI Assistant"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="y7-icon-svg"
      >
        {/* Outer circle container */}
        <circle
          cx="30"
          cy="30"
          r="29"
          fill="#0A0A0A"
          stroke="#1A1A1A"
          strokeWidth="1"
          className="y7-icon-bg"
        />
        
        {/* Neural network dots (subtle animation) */}
        <g className="y7-neural-dots">
          <circle cx="20" cy="22" r="1" fill="#00D4FF" opacity="0.6" className="dot-1" />
          <circle cx="40" cy="25" r="1" fill="#00D4FF" opacity="0.4" className="dot-2" />
          <circle cx="35" cy="40" r="1" fill="#00D4FF" opacity="0.5" className="dot-3" />
        </g>
        
        {/* Main Y symbol merged with chat bubble */}
        <g className="y7-main-symbol">
          {/* Chat bubble base */}
          <path
            d="M18 20 C18 16, 22 12, 30 12 C38 12, 42 16, 42 20 L42 32 C42 36, 38 40, 30 40 L25 40 L20 44 L20 40 C18 40, 18 36, 18 32 Z"
            fill="none"
            stroke="#00D4FF"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="y7-bubble"
          />
          
          {/* Abstract Y7 symbol */}
          <g className="y7-letters">
            {/* Y letter */}
            <path
              d="M23 18 L26.5 25 L30 18"
              stroke="#FFFFFF"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M26.5 25 L26.5 32"
              stroke="#FFFFFF"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            
            {/* 7 number */}
            <path
              d="M32 18 L37 18 L34 32"
              stroke="#00D4FF"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>
        
        {/* Thinking indicator (minimal line morph) */}
        <g className="y7-thinking">
          <path
            d="M24 30 Q27 28, 30 30 Q33 32, 36 30"
            stroke="#00D4FF"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
            opacity="0.7"
            className="thinking-line"
          />
        </g>
      </svg>
      
      {/* Notification badge */}
      <div className="y7-notification-badge">
        <span>!</span>
      </div>
    </button>
  );
};

export default ChatBotIcon;