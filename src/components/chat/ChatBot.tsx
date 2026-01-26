import React, { useState, useEffect, useRef } from 'react';
import { X, Send, MessageCircle, Minimize2 } from 'lucide-react';
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
}

interface ChatBotProps {
  className?: string;
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
        text: response.data.data.welcomeMessage,
        sender: 'bot',
        timestamp: new Date(),
        quickReplies: response.data.data.quickReplies
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

      // Show lead form for bulk orders
      if (response.data.data.requiresData && response.data.data.intent === 'bulk_orders') {
        setShowLeadForm(true);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again or contact our support team.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickReply = (reply: string) => {
    if (reply === '🔥 Best Sellers') {
      sendMessage('best sellers');
    } else if (reply === '🛒 Browse Products') {
      sendMessage('products');
    } else if (reply === '📦 Bulk Orders') {
      sendMessage('bulk orders');
    } else if (reply === '🚚 Shipping Info') {
      sendMessage('shipping');
    } else if (reply === '💬 Talk to Human') {
      sendMessage('talk to human');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  if (!isOpen) {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-black border-2 border-yellow-500 hover:bg-gray-900 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-yellow-500/20 chat-fab-pulse"
          title="Chat with Y7"
        >
          <MessageCircle className="h-6 w-6 text-yellow-500" />
        </Button>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <Card className={`w-80 bg-black border-yellow-500/30 shadow-2xl transition-all duration-300 ${
        isMinimized ? 'h-16' : 'h-96'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-yellow-500/20">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-sm">Y7</span>
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">Y7 Support</h3>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-400 text-xs">Online</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-gray-400 hover:text-white h-8 w-8 p-0"
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <ScrollArea className="flex-1 p-4 h-64 chat-scrollbar">
              <div className="space-y-4 chat-messages-container">
                {messages.map((message) => (
                  <div key={message.id} className="chat-bubble-enter">
                    <div
                      className={`flex ${
                        message.sender === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg text-sm ${
                          message.sender === 'user'
                            ? 'bg-yellow-500 text-black'
                            : 'bg-gray-800 text-white border border-gray-700'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{message.text}</div>
                      </div>
                    </div>
                    
                    {/* Quick Replies */}
                    {message.quickReplies && message.quickReplies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {message.quickReplies.map((reply, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="cursor-pointer hover:bg-yellow-500 hover:text-black border-yellow-500/50 text-yellow-500 text-xs chat-quick-reply-enter"
                            onClick={() => handleQuickReply(reply)}
                            style={{ animationDelay: `${index * 0.1}s` }}
                          >
                            {reply}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-800 text-white p-3 rounded-lg border border-gray-700">
                      <div className="chat-typing-indicator">
                        <div className="chat-typing-dot"></div>
                        <div className="chat-typing-dot"></div>
                        <div className="chat-typing-dot"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-yellow-500/20">
              <div className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-yellow-500"
                  disabled={isLoading}
                />
                <Button
                  onClick={() => sendMessage(inputValue)}
                  disabled={isLoading || !inputValue.trim()}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black h-10 w-10 p-0"
                >
                  <Send className="h-4 w-4" />
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
          onSubmit={(leadData) => {
            // Handle lead submission
            setShowLeadForm(false);
            const confirmMessage: Message = {
              id: Date.now().toString(),
              text: 'Thank you! Your details have been submitted. Our team will contact you within 24 hours.',
              sender: 'bot',
              timestamp: new Date()
            };
            setMessages(prev => [...prev, confirmMessage]);
          }}
        />
      )}
    </div>
  );
};

// Lead Form Component
interface LeadFormProps {
  sessionId: string;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const LeadForm: React.FC<LeadFormProps> = ({ sessionId, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    country: '',
    interest: 'bulk_orders',
    message: ''
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-96 bg-black border-yellow-500/30 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Bulk Order Inquiry</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Your Name *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
            required
          />
          <Input
            placeholder="Phone Number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
          />
          <Input
            placeholder="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
          />
          <Input
            placeholder="Country"
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
          />
          <textarea
            placeholder="Tell us about your requirements *"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full p-3 bg-gray-800 border border-gray-700 text-white placeholder-gray-400 rounded-md resize-none h-20"
            required
          />
          <Button
            type="submit"
            disabled={isSubmitting || !formData.name || !formData.message}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
          </Button>
        </form>
      </Card>
    </div>
  );
};