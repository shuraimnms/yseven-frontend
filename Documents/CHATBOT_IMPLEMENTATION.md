# Y7 Premium Chatbot Implementation

## Overview
A premium chatbot system for Y7 sauces with NLP capabilities, lead generation, and admin management. Built with React frontend and Node.js backend.

## Features

### 🤖 Smart Chatbot
- **NLP-powered intent recognition** with enhanced keyword matching
- **Premium UI/UX** with Y7 brand colors (Black #0B0B0F, Gold #D4AF37)
- **Floating Action Button** (bottom-right, non-intrusive)
- **Quick reply buttons** for common queries
- **Typing indicators** and smooth animations
- **Session management** for conversation continuity

### 🎯 Intent Recognition
The NLP service recognizes these intents:
- **Greeting** - Welcome messages
- **Products** - Product catalog and information
- **Bulk Orders** - B2B lead generation (high-value)
- **Shipping** - Delivery information
- **Order Tracking** - Order status queries
- **Pricing** - Cost and offers
- **Ingredients** - Product composition
- **Human Support** - Escalation to human agents
- **Quality** - Certifications and standards

### 📊 Lead Generation
- **Automatic lead capture** for bulk orders
- **Lead form modal** with company details
- **Lead scoring** based on intent and engagement
- **WhatsApp integration** for follow-up

### 🔧 Admin Dashboard
- **Lead management** with status tracking (New/Contacted/Closed)
- **Analytics dashboard** with metrics and charts
- **Export functionality** (CSV format)
- **Real-time chat monitoring**
- **Intent analysis** and performance metrics

## Technical Architecture

### Backend (`yseven-backend`)

#### Models
- **ChatLead** - Lead information storage
- **ChatMessage** - Conversation history
- **User sessions** - Anonymous chat support

#### Controllers
- **ChatController** - Public chat endpoints
- **AdminChatController** - Admin management endpoints

#### Services
- **NLPService** - Intent recognition and response generation
- **Enhanced pattern matching** with keyword scoring
- **Confidence scoring** for better accuracy

#### API Endpoints
```
Public Routes:
GET  /api/v1/chat/init           - Initialize chat session
POST /api/v1/chat/message        - Process chat message
POST /api/v1/chat/lead          - Submit lead form
GET  /api/v1/chat/history/:id   - Get chat history

Admin Routes (Auth Required):
GET  /api/v1/admin/chat/leads           - Get all leads
GET  /api/v1/admin/chat/leads/:id       - Get lead details
PUT  /api/v1/admin/chat/leads/:id/status - Update lead status
GET  /api/v1/admin/chat/analytics       - Get chat analytics
GET  /api/v1/admin/chat/export          - Export leads CSV
```

### Frontend (`yseven-frontend`)

#### Components
- **ChatBot** - Main chat interface
- **ChatLeads** - Admin dashboard page
- **LeadForm** - Bulk order inquiry form

#### Features
- **Responsive design** (desktop + mobile)
- **Dark theme** with gold accents
- **Smooth animations** and transitions
- **Real-time messaging** with typing indicators
- **Session persistence** across page reloads

## Installation & Setup

### Backend Setup
```bash
cd yseven-backend
npm install uuid @types/uuid
npm run dev
```

### Frontend Setup
```bash
cd yseven-frontend
npm install
npm run dev
```

### Database Models
The chatbot uses MongoDB with these collections:
- `chatleads` - Lead information
- `chatmessages` - Conversation history

## Usage Guide

### For Users
1. **Click the chat button** (bottom-right corner)
2. **Choose quick replies** or type messages
3. **Get instant responses** about products, shipping, etc.
4. **Submit lead forms** for bulk orders
5. **Escalate to human support** when needed

### For Admins
1. **Access Admin Panel** → Chat Leads
2. **View lead analytics** and metrics
3. **Manage lead status** (New/Contacted/Closed)
4. **Export leads** for CRM integration
5. **Monitor chat performance** and popular intents

## Customization

### Adding New Intents
Edit `yseven-backend/src/services/nlp.service.ts`:
```typescript
{
  name: 'new_intent',
  patterns: ['pattern1', 'pattern2'],
  keywords: ['keyword1', 'keyword2'],
  responses: ['Response message'],
  confidence: 0.8
}
```

### Styling Customization
Edit `yseven-frontend/src/components/chat/ChatBot.css` for animations and styles.

### Brand Colors
- **Primary**: Black (#0B0B0F)
- **Accent**: Gold (#D4AF37)
- **Background**: Charcoal (#1A1A1A)
- **Text**: Cream (#F5F5DC)

## Performance Optimizations

### Backend
- **Rate limiting** on chat endpoints
- **Session-based** message storage
- **Efficient MongoDB queries** with indexes
- **Response caching** for common queries

### Frontend
- **Lazy loading** of chat component
- **Message virtualization** for long conversations
- **Optimized animations** with CSS transforms
- **Debounced typing** indicators

## Security Features

### Data Protection
- **Input sanitization** for all user messages
- **Rate limiting** to prevent spam
- **Session isolation** for privacy
- **Admin authentication** required for management

### Privacy Compliance
- **Anonymous chat** support (no login required)
- **Data retention** policies configurable
- **GDPR-compliant** lead collection
- **Secure data export** for admins

## Analytics & Metrics

### Key Metrics Tracked
- **Total leads generated**
- **Intent distribution**
- **Response accuracy**
- **User engagement time**
- **Conversion rates** (chat to lead)

### Business Intelligence
- **Daily lead trends**
- **Popular product inquiries**
- **Bulk order conversion rates**
- **Support escalation patterns**

## Future Enhancements

### Phase 2 Features
- **AI-powered responses** with GPT integration
- **Multi-language support** (Hindi, regional languages)
- **Voice chat** capabilities
- **Product recommendations** based on chat history
- **Integration with CRM** systems

### Advanced NLP
- **Sentiment analysis** for customer satisfaction
- **Entity extraction** for product names, quantities
- **Context awareness** across conversation turns
- **Learning from admin corrections**

## Deployment

### Production Checklist
- [ ] Update WhatsApp number in responses
- [ ] Configure email settings for notifications
- [ ] Set up monitoring and logging
- [ ] Enable SSL/HTTPS for security
- [ ] Configure backup for chat data
- [ ] Set up analytics tracking

### Environment Variables
```env
# Backend
MONGODB_URI=mongodb://localhost:27017/y7sauces
JWT_SECRET=your-jwt-secret
WHATSAPP_NUMBER=+91XXXXXXXXXX
SUPPORT_EMAIL=support@y7sauces.com

# Frontend
VITE_API_URL=http://localhost:5000
VITE_CHAT_ENABLED=true
```

## Support & Maintenance

### Monitoring
- **Chat response times**
- **Lead conversion rates**
- **Error rates and debugging**
- **User satisfaction scores**

### Regular Updates
- **Intent accuracy** improvements
- **Response message** updates
- **UI/UX** enhancements based on feedback
- **Security patches** and updates

---

**Implementation Status**: ✅ Complete
**Last Updated**: January 2026
**Version**: 1.0.0

This chatbot system provides a premium, professional experience that captures leads 24/7 while maintaining Y7's brand identity and quality standards.