import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Minimize2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { chatAPI } from '../../lib/api';
import { useFormSubmission } from '../../hooks/useFormSubmission';
import { ChatBotIcon } from './ChatBotIcon';
import { useGlobalSettings } from '@/hooks/useGlobalSettings';
import './ChatBot.css';
import logoBotImage from '../../assets/logo-bot.png';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  quickReplies?: string[];
  productCard?: {
    id: string;
    name: string;
    price: string;
    image: string;
    stock: string;
  };
}

interface ChatBotProps {
  className?: string;
}

interface LeadFormData {
  name: string;
  phone: string;
  email: string;
  country: string;
  businessName: string;
  designation: string;
  interest: string;
  message: string;
  quantity: string;
}

export const ChatBot: React.FC<ChatBotProps> = ({ className = '' }) => {
  const { supportEmail } = useGlobalSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Prevent body scroll when chat is open on mobile - REMOVED for better UX
  // Chat now stays in content area and doesn't need body scroll lock
  useEffect(() => {
    // No body scroll manipulation needed
    return () => {
      // Cleanup any existing styles
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isMobile, isOpen, isMinimized]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !sessionId) {
      initializeChat();
    }
  }, [isOpen]);

  // Auto-focus input on desktop, avoid on mobile to prevent keyboard issues
  useEffect(() => {
    if (isOpen && !isMinimized && !isMobile && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen, isMinimized, isMobile]);

  const initializeChat = async () => {
    try {
      const response = await chatAPI.initialize();
      setSessionId(response.data.data.sessionId);
      
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: "Welcome to Y7. I can help you with products, orders, recipes, and partnerships.",
        sender: 'bot',
        timestamp: new Date(),
        quickReplies: ['Browse Sauces', 'Track Order', 'Bulk Orders', 'Best Sellers', 'Contact Support']
      };
      
      setMessages([welcomeMessage]);
    } catch (error) {
      console.error('Failed to initialize chat:', error);
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || !sessionId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Blur input on mobile to hide keyboard
    if (isMobile && inputRef.current) {
      inputRef.current.blur();
    }

    try {
      const response = await chatAPI.sendMessage(sessionId, text);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.data.data.response,
        sender: 'bot',
        timestamp: new Date(),
        quickReplies: response.data.data.quickReplies
      };

      setMessages(prev => [...prev, botMessage]);

      // Show lead form for business inquiries
      if (response.data.data.requiresLead) {
        setShowLeadForm(true);
      }

      // Show human support options if needed
      if (response.data.data.fallbackToHuman) {
        const supportMessage: Message = {
          id: (Date.now() + 2).toString(),
          text: `For this request, please contact our team at ${supportEmail}.`,
          sender: 'bot',
          timestamp: new Date(),
          quickReplies: ['Contact Support', 'Browse Products']
        };
        setTimeout(() => {
          setMessages(prev => [...prev, supportMessage]);
        }, 1000);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `For this request, please contact our team at ${supportEmail}.`,
        sender: 'bot',
        timestamp: new Date(),
        quickReplies: ['Contact Support', 'Try Again']
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickReply = (reply: string) => {
    if (reply === 'Browse Sauces') {
      sendMessage('show me your sauces');
    } else if (reply === 'Track Order') {
      sendMessage('track my order');
    } else if (reply === 'Bulk Orders') {
      sendMessage('bulk orders');
    } else if (reply === 'Best Sellers') {
      sendMessage('best sellers');
    } else if (reply === 'Contact Support') {
      sendMessage('contact support');
    } else {
      sendMessage(reply.toLowerCase());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const handleLeadSubmit = (data: LeadFormData) => {
    setShowLeadForm(false);
    const confirmationMessage: Message = {
      id: Date.now().toString(),
      text: `Thank you ${data.name}! Your business inquiry has been submitted successfully. Our team will contact you within 24 hours with customized pricing and solutions.`,
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, confirmationMessage]);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
    // On mobile, minimizing should close the chat
    if (isMobile) {
      setIsOpen(false);
    }
  };

  if (!isOpen) {
    return (
      <div
        style={{
          position: 'fixed',
          bottom: isMobile ? '20px' : '24px',
          right: '24px',
          zIndex: 1000
        }}
      >
        <ChatBotIcon
          size={isMobile ? 56 : 60}
          onClick={() => setIsOpen(true)}
          className="y7-chat-toggle"
        />
      </div>
    );
  }

  return (
    <div 
      className={`discord-chat-container ${isMinimized ? 'minimized' : ''}`}
      style={{
        position: 'fixed',
        bottom: isMobile ? '20px' : '24px',
        right: isMobile ? '20px' : '24px',
        left: isMobile && !isMinimized ? '20px' : 'auto',
        width: isMobile && !isMinimized ? 'auto' : '380px',
        height: isMinimized ? '60px' : (isMobile ? '70vh' : '600px'),
        maxHeight: isMobile ? '600px' : '600px',
        zIndex: 1000
      }}
    >
      {/* Header */}
      <div className="discord-chat-header">
        <div className="discord-header-left">
          <div className="discord-bot-avatar">
            <img 
              src={logoBotImage} 
              alt="Y7 Bot" 
              style={{ 
                width: '24px', 
                height: '24px', 
                objectFit: 'cover',
                borderRadius: '50%'
              }} 
            />
          </div>
          <div className="discord-header-info">
            <h3 className="discord-header-title">Y7 Assistant</h3>
            <div className="discord-status">
              <div className="discord-status-dot online"></div>
              <span className="discord-status-text">Always Online</span>
            </div>
          </div>
        </div>
        <div className="discord-header-controls">
          {!isMobile && (
            <button
              onClick={handleMinimize}
              className="discord-control-btn"
              title="Minimize"
            >
              <Minimize2 className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={handleClose}
            className="discord-control-btn close"
            title="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="discord-messages-container">
            <div className="discord-messages">
              {messages.map((message) => (
                <div key={message.id} className={`discord-message ${message.sender}`}>
                  <div className="discord-message-avatar">
                    {message.sender === 'bot' ? (
                      <div className="discord-bot-avatar">
                        <img 
                          src={logoBotImage} 
                          alt="Y7 Bot" 
                          style={{ 
                            width: '24px', 
                            height: '24px', 
                            objectFit: 'cover',
                            borderRadius: '50%'
                          }} 
                        />
                      </div>
                    ) : (
                      <div className="discord-user-avatar">U</div>
                    )}
                  </div>
                  <div className="discord-message-content">
                    <div className="discord-message-header">
                      <span className="discord-message-author">
                        {message.sender === 'bot' ? 'Y7 Assistant' : 'You'}
                      </span>
                      {message.sender === 'bot' && (
                        <span className="discord-bot-tag">BOT</span>
                      )}
                      <span className="discord-message-timestamp">
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                    <div className="discord-message-text">
                      {message.text}
                    </div>
                    
                    {/* Quick Replies */}
                    {message.quickReplies && message.quickReplies.length > 0 && (
                      <div className="quick-replies" style={{ marginTop: '8px' }}>
                        {message.quickReplies.map((reply, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuickReply(reply)}
                            style={{ 
                              marginRight: '8px', 
                              marginBottom: '4px',
                              background: '#5865f2',
                              color: 'white',
                              border: 'none',
                              borderRadius: '16px',
                              fontSize: '12px'
                            }}
                          >
                            {reply}
                          </Button>
                        ))}
                      </div>
                    )}

                    {/* Product Card */}
                    {message.productCard && (
                      <div style={{
                        background: '#2f3136',
                        border: '1px solid #40444b',
                        borderRadius: '8px',
                        padding: '12px',
                        marginTop: '8px',
                        maxWidth: '280px'
                      }}>
                        <img 
                          src={message.productCard.image} 
                          alt={message.productCard.name}
                          style={{
                            width: '100%',
                            height: '120px',
                            objectFit: 'cover',
                            borderRadius: '4px',
                            marginBottom: '8px'
                          }}
                        />
                        <div>
                          <h4 style={{ color: '#ffffff', fontSize: '14px', margin: '0 0 4px 0' }}>
                            {message.productCard.name}
                          </h4>
                          <div style={{ color: '#43b883', fontSize: '16px', fontWeight: 'bold', margin: '4px 0' }}>
                            {message.productCard.price}
                          </div>
                          <Badge style={{ background: '#43b883', color: 'white', fontSize: '10px' }}>
                            {message.productCard.stock}
                          </Badge>
                          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                            <Button size="sm" variant="outline" style={{ fontSize: '12px' }}>
                              View Product
                            </Button>
                            <Button size="sm" style={{ background: '#5865f2', fontSize: '12px' }}>
                              Add to Cart
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="discord-message bot">
                  <div className="discord-message-avatar">
                    <div className="discord-bot-avatar">
                      <img 
                        src={logoBotImage} 
                        alt="Y7 Bot" 
                        style={{ 
                          width: '24px', 
                          height: '24px', 
                          objectFit: 'cover',
                          borderRadius: '50%'
                        }} 
                      />
                    </div>
                  </div>
                  <div className="discord-message-content">
                    <div className="discord-message-header">
                      <span className="discord-message-author">Y7 Assistant</span>
                      <span className="discord-bot-tag">BOT</span>
                    </div>
                    <div className="discord-typing-indicator">
                      <span>Y7 is typing</span>
                      <div className="discord-typing-dots">
                        <div className="discord-typing-dot"></div>
                        <div className="discord-typing-dot"></div>
                        <div className="discord-typing-dot"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Input */}
          <div className="discord-input-container">
            <div className="discord-input-wrapper">
              <input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message Y7 Assistant"
                className="discord-input"
                disabled={isLoading}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
              />
              <button
                onClick={() => sendMessage(inputValue)}
                disabled={isLoading || !inputValue.trim()}
                className="discord-send-btn"
                title="Send message"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
            <div className="discord-input-hint">
              Press Enter to send • Shift+Enter for new line
            </div>
          </div>
        </>
      )}

      {/* Lead Form Modal */}
      {showLeadForm && (
        <div className="fixed inset-0 z-50" style={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <LeadForm
            sessionId={sessionId}
            onClose={() => setShowLeadForm(false)}
            onSubmit={handleLeadSubmit}
            isMobile={isMobile}
          />
        </div>
      )}
    </div>
  );
};

// Lead Form Component
interface LeadFormProps {
  sessionId: string;
  onClose: () => void;
  onSubmit: (data: LeadFormData) => void;
  isMobile?: boolean;
}

const LeadForm: React.FC<LeadFormProps> = ({ sessionId, onClose, onSubmit, isMobile = false }) => {
  const [formData, setFormData] = useState<LeadFormData>({
    name: '',
    phone: '',
    email: '',
    country: '',
    businessName: '',
    designation: '',
    interest: 'bulk_orders',
    message: '',
    quantity: ''
  });
  const { submitForm, isSubmitting } = useFormSubmission();

  // No body scroll manipulation needed - form stays in content area
  useEffect(() => {
    // Cleanup any existing styles
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isMobile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Submit to chat API first
      await chatAPI.submitLead({ ...formData, sessionId });
      
      // Then submit through the form submission system
      const result = await submitForm({
        fullName: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: `Business Inquiry - ${formData.businessName || 'Chat Lead'}`,
        message: `Business Name: ${formData.businessName}\nDesignation: ${formData.designation}\nCountry: ${formData.country}\nQuantity: ${formData.quantity}\nInterest: ${formData.interest}\n\nMessage:\n${formData.message}`,
        type: 'chat'
      });

      if (result.success) {
        onSubmit(formData);
      }
    } catch (error) {
      console.error('Failed to submit lead:', error);
    }
  };

  const handleClose = () => {
    // No body scroll restoration needed
    onClose();
  };

  return (
    <div 
      style={{
        position: 'relative',
        zIndex: 1001,
        background: '#36393f',
        border: '1px solid #40444b',
        borderRadius: '12px',
        width: isMobile ? '90vw' : '400px',
        maxWidth: '400px',
        maxHeight: '80vh',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)'
      }}
      onClick={(e) => e.stopPropagation()}
    >
        <div style={{
          background: '#2f3136',
          padding: '16px',
          borderBottom: '1px solid #40444b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h3 style={{ 
              color: '#ffffff', 
              fontSize: '18px', 
              fontWeight: '600', 
              margin: '0 0 4px 0' 
            }}>
              Business Inquiry
            </h3>
            <p style={{ 
              color: '#b9bbbe', 
              fontSize: '14px', 
              margin: '0' 
            }}>
              Connect with our B2B team
            </p>
          </div>
          <button
            onClick={handleClose}
            className="discord-control-btn close"
            title="Close"
            style={{
              width: '32px',
              height: '32px',
              background: 'transparent',
              border: 'none',
              borderRadius: '4px',
              color: '#b9bbbe',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          maxHeight: 'calc(80vh - 80px)',
          overflowY: 'auto'
        }}>
          <input
            placeholder="Your Name *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={{
              background: '#40444b',
              border: '1px solid #484c52',
              borderRadius: '8px',
              padding: '12px 16px',
              color: '#ffffff',
              fontSize: '14px',
              outline: 'none'
            }}
            required
            autoComplete="name"
            autoCorrect="off"
            autoCapitalize="words"
          />
          <input
            placeholder="Business/Company Name"
            value={formData.businessName}
            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
            style={{
              background: '#40444b',
              border: '1px solid #484c52',
              borderRadius: '8px',
              padding: '12px 16px',
              color: '#ffffff',
              fontSize: '14px',
              outline: 'none'
            }}
            autoComplete="organization"
            autoCorrect="off"
            autoCapitalize="words"
          />
          <input
            placeholder="Designation"
            value={formData.designation}
            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
            style={{
              background: '#40444b',
              border: '1px solid #484c52',
              borderRadius: '8px',
              padding: '12px 16px',
              color: '#ffffff',
              fontSize: '14px',
              outline: 'none'
            }}
            autoComplete="organization-title"
            autoCorrect="off"
            autoCapitalize="words"
          />
          <input
            placeholder="Phone Number *"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            style={{
              background: '#40444b',
              border: '1px solid #484c52',
              borderRadius: '8px',
              padding: '12px 16px',
              color: '#ffffff',
              fontSize: '14px',
              outline: 'none'
            }}
            required
            type="tel"
            autoComplete="tel"
          />
          <input
            placeholder="Email Address *"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            style={{
              background: '#40444b',
              border: '1px solid #484c52',
              borderRadius: '8px',
              padding: '12px 16px',
              color: '#ffffff',
              fontSize: '14px',
              outline: 'none'
            }}
            required
            autoComplete="email"
            autoCorrect="off"
            autoCapitalize="off"
          />
          <input
            placeholder="Location/City"
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            style={{
              background: '#40444b',
              border: '1px solid #484c52',
              borderRadius: '8px',
              padding: '12px 16px',
              color: '#ffffff',
              fontSize: '14px',
              outline: 'none'
            }}
            autoComplete="address-level2"
            autoCorrect="off"
            autoCapitalize="words"
          />
          <input
            placeholder="Estimated Quantity (e.g., 100 units)"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            style={{
              background: '#40444b',
              border: '1px solid #484c52',
              borderRadius: '8px',
              padding: '12px 16px',
              color: '#ffffff',
              fontSize: '14px',
              outline: 'none'
            }}
            autoCorrect="off"
          />
          <textarea
            placeholder="Product Requirements & Details *"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            style={{
              background: '#40444b',
              border: '1px solid #484c52',
              borderRadius: '8px',
              padding: '12px 16px',
              color: '#ffffff',
              fontSize: '14px',
              outline: 'none',
              minHeight: '80px',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
            required
            autoCorrect="on"
            autoCapitalize="sentences"
          />
          <button
            type="submit"
            disabled={isSubmitting || !formData.name || !formData.phone || !formData.email || !formData.message}
            style={{
              background: isSubmitting || !formData.name || !formData.phone || !formData.email || !formData.message 
                ? '#72767d' : '#5865f2',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 20px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: isSubmitting || !formData.name || !formData.phone || !formData.email || !formData.message 
                ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s ease'
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Business Inquiry'}
          </button>
          <p style={{
            color: '#72767d',
            fontSize: '12px',
            textAlign: 'center',
            margin: '0',
            lineHeight: '1.4'
          }}>
            Our team will contact you within 24 hours with customized pricing and solutions.
          </p>
        </form>
      </div>
  );
};
export default ChatBot;