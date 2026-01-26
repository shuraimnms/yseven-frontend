import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Minimize2, Mic } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { chatAPI } from '../../lib/api';
import './ChatBot.css';

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
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [showLeadForm, setShowLeadForm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
          text: "For this request, please contact our team at support@y7foods.com.",
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
        text: 'For this request, please contact our team at support@y7foods.com.',
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
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

  if (!isOpen) {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <div className="relative group">
          <Button
            onClick={() => setIsOpen(true)}
            className="luxury-chat-fab"
            title="Chat with Y7 Assistant"
          >
            <div className="y7-monogram">Y7</div>
          </Button>
          {/* Tooltip */}
          <div className="luxury-tooltip">
            Chat with Y7 Assistant
            <div className="tooltip-arrow"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <Card className={`luxury-chat-window ${
        isMinimized ? 'minimized' : 'expanded'
      }`}>
        {/* Header */}
        <div className="luxury-header">
          <div className="flex items-center space-x-3">
            <div className="y7-icon">Y7</div>
            <div>
              <h3 className="luxury-title">Y7 Assistant</h3>
              <div className="luxury-status">
                <div className="status-dot"></div>
                <span>Always Online</span>
              </div>
            </div>
          </div>
          <div className="header-controls">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="luxury-control-btn"
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="luxury-control-btn"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <ScrollArea className="luxury-messages-area">
              <div className="messages-container">
                {messages.map((message) => (
                  <div key={message.id} className="message-wrapper">
                    <div className={`message-bubble ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}>
                      <div className="message-content">
                        {message.text}
                      </div>
                    </div>
                    
                    {/* Quick Replies */}
                    {message.quickReplies && message.quickReplies.length > 0 && (
                      <div className="quick-replies">
                        {message.quickReplies.map((reply, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            className="luxury-quick-reply"
                            onClick={() => handleQuickReply(reply)}
                            style={{ animationDelay: `${index * 0.1}s` }}
                          >
                            {reply}
                          </Button>
                        ))}
                      </div>
                    )}

                    {/* Product Card */}
                    {message.productCard && (
                      <div className="luxury-product-card">
                        <img 
                          src={message.productCard.image} 
                          alt={message.productCard.name}
                          className="product-image"
                        />
                        <div className="product-info">
                          <h4 className="product-name">{message.productCard.name}</h4>
                          <div className="product-price">{message.productCard.price}</div>
                          <Badge className="stock-badge">{message.productCard.stock}</Badge>
                          <div className="product-actions">
                            <Button className="luxury-btn-secondary">View Product</Button>
                            <Button className="luxury-btn-primary">Add to Cart</Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {isLoading && (
                  <div className="message-wrapper">
                    <div className="bot-message typing-message">
                      <div className="luxury-typing-indicator">
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>

            {/* Input */}
            <div className="luxury-input-bar">
              <div className="input-container">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about Y7 products, orders, or recipes…"
                  className="luxury-input"
                  disabled={isLoading}
                />
                <Button
                  onClick={() => sendMessage(inputValue)}
                  disabled={isLoading || !inputValue.trim()}
                  className="luxury-send-btn"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>

      {/* Lead Form Modal */}
      {showLeadForm && (
        <LeadForm
          sessionId={sessionId}
          onClose={() => setShowLeadForm(false)}
          onSubmit={handleLeadSubmit}
        />
      )}
    </div>
  );
};

// Lead Form Component
interface LeadFormProps {
  sessionId: string;
  onClose: () => void;
  onSubmit: (data: LeadFormData) => void;
}

const LeadForm: React.FC<LeadFormProps> = ({ sessionId, onClose, onSubmit }) => {
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await chatAPI.submitLead({ ...formData, sessionId });
      onSubmit(formData);
    } catch (error) {
      console.error('Failed to submit lead:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="luxury-modal-backdrop">
      <Card className="luxury-lead-form">
        <div className="form-header">
          <div>
            <h3 className="form-title">Business Inquiry</h3>
            <p className="form-subtitle">Connect with our B2B team</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="luxury-close-btn"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="form-content">
          <Input
            placeholder="Your Name *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="luxury-form-input"
            required
          />
          <Input
            placeholder="Business/Company Name"
            value={formData.businessName}
            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
            className="luxury-form-input"
          />
          <Input
            placeholder="Designation"
            value={formData.designation}
            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
            className="luxury-form-input"
          />
          <Input
            placeholder="Phone Number *"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="luxury-form-input"
            required
          />
          <Input
            placeholder="Email Address *"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="luxury-form-input"
            required
          />
          <Input
            placeholder="Location/City"
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            className="luxury-form-input"
          />
          <Input
            placeholder="Estimated Quantity (e.g., 100 units)"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            className="luxury-form-input"
          />
          <textarea
            placeholder="Product Requirements & Details *"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="luxury-form-textarea"
            required
          />
          <Button
            type="submit"
            disabled={isSubmitting || !formData.name || !formData.phone || !formData.email || !formData.message}
            className="luxury-submit-btn"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Business Inquiry'}
          </Button>
          <p className="form-disclaimer">
            Our team will contact you within 24 hours with customized pricing and solutions.
          </p>
        </form>
      </Card>
    </div>
  );
};