# Y-Seven Admin Panel Documentation

## Overview
The Y-Seven backend implements a comprehensive admin panel system with real-time capabilities, advanced analytics, and secure role-based access control. This documentation covers the complete admin implementation in the `yseven-backend` directory.

## Table of Contents
1. [Authentication & Authorization](#authentication--authorization)
2. [Admin Routes & Endpoints](#admin-routes--endpoints)
3. [Real-Time WebSocket System](#real-time-websocket-system)
4. [Dashboard Analytics](#dashboard-analytics)
5. [Security Implementation](#security-implementation)
6. [Database Models](#database-models)
7. [API Reference](#api-reference)
8. [Setup & Configuration](#setup--configuration)

---

## Authentication & Authorization

### Admin User Model
```typescript
interface IUser {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: "customer" | "admin";  // Admin role required
  emailVerified: boolean;
  phoneVerified: boolean;
  addresses?: IAddress[];
  wishlist?: string[];
  createdAt: Date;
}
```

### Authentication Flow
1. **JWT Token Verification**: All admin routes protected by JWT middleware
2. **Role Validation**: `requireAdmin` middleware ensures only admin users can access
3. **Token Sources**: Supports tokens from cookies (`accessToken`) or Authorization header
4. **WebSocket Auth**: Real-time connections require JWT authentication

### Middleware Stack
```typescript
// Authentication middleware
app.use(protect);        // JWT verification
app.use(requireAdmin);   // Admin role check
```

---

## Admin Routes & Endpoints

### Route Structure
```
/api/v1/admin/
├── analytics/          # Dashboard analytics
├── customers/          # Customer management
├── inventory/          # Stock management
├── orders/            # Order management
├── payments/          # Payment analytics
├── products/          # Product CRUD
├── system/            # System health & stats
└── payment-settings/  # Payment configuration
```

### Core Admin Controllers
- **Analytics Controller**: Revenue, order, customer metrics
- **Order Controller**: Order management and status updates
- **Product Controller**: Product CRUD with category management
- **Payment Settings Controller**: Payment gateway configuration

---

## Real-Time WebSocket System

### AdminWebSocketServer Implementation
```typescript
class AdminWebSocketServer {
  private io: SocketIOServer;
  private adminClients: Map<string, any>;
  
  // JWT authentication for WebSocket connections
  // Admin-only access verification
  // Real-time event broadcasting
}
```

### WebSocket Events
- **dashboard_update**: Real-time dashboard statistics
- **new_order**: Order notifications
- **low_stock_alert**: Inventory alerts
- **payment_received**: Payment confirmations
- **connected**: Connection confirmation
- **subscribed**: Subscription confirmation

### Connection Flow
1. Client connects with JWT token
2. Server verifies admin role
3. Auto-subscription to `admin_dashboard` room
4. Periodic updates every 60 seconds
5. Manual update triggers available

---

## Dashboard Analytics

### Key Metrics Tracked
```typescript
interface DashboardStats {
  revenue: {
    today: number;
    thisMonth: number;
    allTime: number;
    growth: number;        // Percentage growth
  };
  orders: {
    total: number;
    pending: number;
    delivered: number;
    growth: number;
  };
  customers: {
    total: number;
    growth: number;
    newThisMonth: number;
  };
  inventory: {
    totalProducts: number;
    lowStock: number;      // < 10 items
    outOfStock: number;    // 0 items
  };
}
```

### Analytics Features
- **Revenue Tracking**: Daily, monthly, all-time revenue with growth percentages
- **Order Analytics**: Status-based order counts and trends
- **Customer Growth**: New customer acquisition tracking
- **Inventory Monitoring**: Stock level alerts and out-of-stock tracking
- **Payment Analytics**: Provider-wise payment statistics

### Periodic Updates
- **Dashboard Service**: Calculates stats every 60 seconds
- **WebSocket Broadcast**: Real-time updates to connected admins
- **Manual Triggers**: On-demand stat recalculation

---

## Security Implementation

### Access Control
```typescript
// All admin routes protected
router.use(protect);        // JWT verification
router.use(requireAdmin);   // Admin role check
```

### Security Features
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access**: Admin-only route protection
- **CORS Configuration**: Restricted to localhost origins
- **Helmet Security**: HTTP security headers
- **Cookie Security**: Secure token handling
- **Input Validation**: Request body validation
- **Error Handling**: Secure error responses

### WebSocket Security
- **JWT Authentication**: Required for WebSocket connections
- **Admin Verification**: Role check before connection acceptance
- **Origin Validation**: CORS protection for WebSocket connections

---

## Database Models

### User Model (Admin)
```typescript
const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, lowercase: true },
  phone: { type: String, sparse: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ["customer", "admin"], default: "customer" },
  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false },
  addresses: [AddressSchema],
  wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }]
}, { timestamps: true });
```

### Related Models
- **Order Model**: Order management and tracking
- **Product Model**: Product catalog with stock management
- **Category Model**: Product categorization
- **PaymentSettings Model**: Payment gateway configuration

---

## API Reference

### Analytics Endpoints
```http
GET /api/v1/admin/analytics/dashboard
GET /api/v1/admin/analytics/revenue
GET /api/v1/admin/analytics/orders
GET /api/v1/admin/analytics/customers
```

### Customer Management
```http
GET /api/v1/admin/customers?page=1&limit=50&search=query
GET /api/v1/admin/customers/:id
PATCH /api/v1/admin/customers/:id/block
PATCH /api/v1/admin/customers/:id/unblock
```

### Inventory Management
```http
GET /api/v1/admin/inventory/low-stock?threshold=10
PATCH /api/v1/admin/inventory/:productId/stock
GET /api/v1/admin/inventory/alerts
```

### Order Management
```http
GET /api/v1/admin/orders?page=1&limit=10
GET /api/v1/admin/orders/:id
PATCH /api/v1/admin/orders/:id/status
```

### Payment Analytics
```http
GET /api/v1/admin/payments?page=1&limit=50&status=success
GET /api/v1/admin/payments/stats
GET /api/v1/admin/payments/providers
```

### System Monitoring
```http
GET /api/v1/admin/system/health
GET /api/v1/admin/system/stats
GET /api/v1/admin/system/logs
```

---

## Setup & Configuration

### Environment Variables
```env
JWT_ACCESS_SECRET=your_jwt_secret
MONGODB_URI=mongodb://localhost:27017/yseven
REDIS_URL=redis://localhost:6379
NODE_ENV=development
PORT=4000
```

### Server Initialization
```typescript
// HTTP server with WebSocket support
const httpServer = createServer(app);
const adminWS = new AdminWebSocketServer(httpServer);

// Global WebSocket access
global.adminWebSocket = adminWS;

// Start periodic dashboard updates
dashboardService.startPeriodicUpdates();
```

### WebSocket Client Connection
```javascript
// Frontend WebSocket connection
const socket = io('ws://localhost:4000', {
  auth: {
    token: 'your_jwt_token'
  }
});

// Subscribe to dashboard updates
socket.emit('subscribe_dashboard');

// Listen for real-time updates
socket.on('dashboard_update', (data) => {
  // Update dashboard UI
});
```

---

## Admin Panel Features Summary

### ✅ Implemented Features
- **Authentication & Authorization**: JWT-based admin authentication
- **Real-Time Dashboard**: WebSocket-powered live updates
- **Analytics System**: Comprehensive business metrics
- **Order Management**: Full order lifecycle management
- **Customer Management**: User administration with search
- **Inventory Tracking**: Stock monitoring with alerts
- **Payment Analytics**: Payment provider statistics
- **System Monitoring**: Health checks and system stats
- **Security**: Role-based access control and input validation

### 🔧 Technical Stack
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Real-Time**: Socket.IO WebSocket implementation
- **Authentication**: JWT tokens with role-based access
- **Security**: Helmet, CORS, input validation
- **Monitoring**: Health checks and system statistics

### 📊 Dashboard Capabilities
- Real-time revenue tracking
- Order status monitoring
- Customer growth analytics
- Inventory level alerts
- Payment provider statistics
- System health monitoring
- Automated periodic updates

This admin panel provides a complete, production-ready solution for managing the Y-Seven e-commerce platform with real-time capabilities and comprehensive analytics.