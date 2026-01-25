# Y-Seven Backend API Documentation
**Complete Guide for Frontend Developers**

## 🚀 Quick Start

### Base Configuration
- **API Base URL**: `http://localhost:4000/api/v1`
- **Health Check**: `GET http://localhost:4000/health`
- **CORS Enabled**: `localhost:3000`, `localhost:8080`, `localhost:5173`
- **Authentication**: JWT tokens via HTTP-only cookies or Bearer headers

---

## 🔐 Authentication System

### Token Management
- **Access Token**: 15 minutes expiration
- **Refresh Token**: 7 days expiration
- **Storage**: HTTP-only cookies (`accessToken`, `refreshToken`)
- **Alternative**: `Authorization: Bearer <token>` header

### User Roles
- `customer` (default)
- `admin`

### Protected Routes
All routes marked with 🔒 require authentication
All routes marked with 👑 require admin role

---

## 📋 Complete API Routes

### Authentication Routes (`/api/v1/auth`)

#### Register User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com", 
  "phone": "9876543210",
  "password": "password123"
}
```

**Validation Rules:**
- `name`: minimum 2 characters
- `email`: valid email format
- `phone`: exactly 10 digits
- `password`: minimum 8 characters

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer",
      "isVerified": false
    }
  }
}
```

#### Login User
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Logout User
```http
POST /api/v1/auth/logout
```

#### Get Current User 🔒
```http
GET /api/v1/auth/me
Authorization: Bearer <token>
```

#### Send OTP
```http
POST /api/v1/auth/otp/send
Content-Type: application/json

{
  "phone": "9876543210"
}
```

#### Verify OTP
```http
POST /api/v1/auth/otp/verify
Content-Type: application/json

{
  "phone": "9876543210",
  "code": "123456"
}
```

---

### Product Routes (`/api/v1/products`)

#### Get All Products
```http
GET /api/v1/products
```

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "_id": "product_id",
        "name": "Premium BBQ Sauce",
        "slug": "premium-bbq-sauce",
        "sku": "SKU-ABC123",
        "description": "Rich and smoky BBQ sauce",
        "mrp": 299,
        "sellingPrice": 249,
        "stock": 50,
        "category": "Sauces",
        "image": "bbq-sauce.jpg",
        "isBestSeller": true,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

#### Get Best Sellers
```http
GET /api/v1/products/best-sellers
```

#### Get Product by Slug
```http
GET /api/v1/products/premium-bbq-sauce
```

---

### Cart Routes (`/api/v1/cart`) 🔒

#### Add to Cart
```http
POST /api/v1/cart
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "product_id",
  "quantity": 2
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "cart": {
      "items": [
        {
          "id": "cart_item_id",
          "productId": "product_id",
          "name": "Premium BBQ Sauce",
          "price": 249,
          "quantity": 2,
          "image": "bbq-sauce.jpg"
        }
      ],
      "subtotal": 498,
      "itemCount": 2
    }
  }
}
```

#### Get Cart
```http
GET /api/v1/cart
Authorization: Bearer <token>
```

#### Update Cart Item
```http
PUT /api/v1/cart/{cart_item_id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 3
}
```

#### Remove Cart Item
```http
DELETE /api/v1/cart/{cart_item_id}
Authorization: Bearer <token>
```

#### Clear Cart
```http
DELETE /api/v1/cart
Authorization: Bearer <token>
```

---

### Order Routes (`/api/v1/orders`) 🔒

#### Create Order
```http
POST /api/v1/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "addressId": "address_id",
  "paymentMethod": "cashfree"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "order": {
      "_id": "order_id",
      "orderId": "Y7-1704067200000-ABC123",
      "user": "user_id",
      "items": [
        {
          "product": "product_id",
          "name": "Premium BBQ Sauce",
          "price": 249,
          "quantity": 2,
          "image": "bbq-sauce.jpg"
        }
      ],
      "pricing": {
        "subtotal": 498,
        "tax": 89.64,
        "shipping": 0,
        "total": 587.64
      },
      "customer": {
        "email": "john@example.com",
        "phone": "9876543210"
      },
      "shippingAddress": {
        "name": "John Doe",
        "line1": "123 Main St",
        "city": "Mumbai",
        "state": "Maharashtra",
        "pincode": "400001",
        "country": "India"
      },
      "payment": {
        "provider": "cashfree",
        "status": "PENDING"
      },
      "status": "PENDING",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### Get User Orders
```http
GET /api/v1/orders
Authorization: Bearer <token>
```

**Alternative endpoint:**
```http
GET /api/v1/orders/my
Authorization: Bearer <token>
```

---

### Payment Routes (`/api/v1/payments`)

#### Start Razorpay Payment 🔒
```http
POST /api/v1/payments/razorpay/start
Authorization: Bearer <token>
Content-Type: application/json

{
  "orderId": "Y7-1704067200000-ABC123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "razorpayOrderId": "order_razorpay_id",
    "amount": 58764,
    "currency": "INR",
    "key": "rzp_test_key"
  }
}
```

#### Start Cashfree Payment 🔒
```http
POST /api/v1/payments/cashfree/start
Authorization: Bearer <token>
Content-Type: application/json

{
  "orderId": "Y7-1704067200000-ABC123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "paymentSessionId": "session_id",
    "orderId": "Y7-1704067200000-ABC123"
  }
}
```

#### Get Payment Status 🔒
```http
GET /api/v1/payments/{orderId}/status
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "success"
  }
}
```

#### Webhooks (Public - No Auth Required)
```http
POST /api/v1/payments/razorpay/webhook
POST /api/v1/payments/cashfree/webhook
```

---

### User Routes (`/api/v1/user`) 🔒

#### Get Profile
```http
GET /api/v1/user/profile
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /api/v1/user/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "phone": "9876543211"
}
```

#### Get Addresses
```http
GET /api/v1/user/addresses
Authorization: Bearer <token>
```

#### Add Address
```http
POST /api/v1/user/addresses
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe",
  "phone": "9876543210",
  "line1": "123 Main Street",
  "line2": "Apartment 4B",
  "city": "Mumbai",
  "state": "Maharashtra", 
  "pincode": "400001",
  "country": "India",
  "isDefault": true
}
```

#### Update Address
```http
PUT /api/v1/user/addresses/{address_id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "phone": "9876543211"
}
```

#### Delete Address
```http
DELETE /api/v1/user/addresses/{address_id}
Authorization: Bearer <token>
```

#### Get Wishlist
```http
GET /api/v1/user/wishlist
Authorization: Bearer <token>
```

#### Add to Wishlist
```http
POST /api/v1/user/wishlist
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "product_id"
}
```

#### Remove from Wishlist
```http
DELETE /api/v1/user/wishlist/{product_id}
Authorization: Bearer <token>
```

---

### Admin Product Routes (`/api/v1/admin/products`) 👑

#### Get All Products (Admin View)
```http
GET /api/v1/admin/products
Authorization: Bearer <admin_token>
```

#### Create Product
```http
POST /api/v1/admin/products
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "New Product",
  "description": "Product description",
  "mrp": 299,
  "sellingPrice": 249,
  "stock": 100,
  "category": "Sauces",
  "image": "product-image.jpg"
}
```

**Validation Rules:**
- `sellingPrice` must be ≤ `mrp`
- `name`, `mrp`, `sellingPrice`, `stock`, `category` are required

#### Update Product
```http
PUT /api/v1/admin/products/{product_id}
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Updated Product Name",
  "stock": 150
}
```

#### Delete Product (Soft Delete)
```http
DELETE /api/v1/admin/products/{product_id}
Authorization: Bearer <admin_token>
```

#### Toggle Best Seller Status
```http
PATCH /api/v1/admin/products/{product_id}/best-seller
Authorization: Bearer <admin_token>
```

---

### Admin Order Routes (`/api/v1/admin/orders`) 👑

```http
GET /api/v1/admin/orders
Authorization: Bearer <admin_token>
```

---

## 📊 Data Models

### User Model
```typescript
interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: "customer" | "admin";
  emailVerified: boolean;
  phoneVerified: boolean;
  addresses: Address[];
  wishlist: string[]; // Product IDs
  createdAt: Date;
  updatedAt: Date;
}

interface Address {
  _id: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}
```

### Product Model
```typescript
interface Product {
  _id: string;
  name: string;
  slug: string; // Auto-generated from name
  sku: string; // Auto-generated (SKU-XXXXXXXX)
  description?: string;
  mrp: number;
  sellingPrice: number;
  stock: number;
  category: string;
  image?: string;
  isBestSeller: boolean;
  deletedAt?: Date; // Soft delete
  createdAt: Date;
  updatedAt: Date;
}
```

### Order Model
```typescript
interface Order {
  _id: string;
  orderId: string; // Format: Y7-{timestamp}-{random}
  user: string; // User ID
  items: OrderItem[];
  pricing: OrderPricing;
  customer: CustomerInfo;
  shippingAddress: Address;
  payment: PaymentInfo;
  status: "PENDING" | "created" | "confirmed" | "shipped" | "delivered" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

interface OrderItem {
  product: string; // Product ID
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface OrderPricing {
  subtotal: number;
  tax: number; // 18% GST
  shipping: number; // Free if subtotal > ₹499, else ₹49
  total: number;
}

interface PaymentInfo {
  provider: "cashfree" | "razorpay" | null;
  status: "PENDING" | "pending" | "paid" | "failed";
  providerOrderId?: string;
}
```

### Cart Model (Redis-based)
```typescript
interface Cart {
  userId: string;
  items: CartItem[];
  updatedAt: number;
}

interface CartItem {
  id: string; // Unique cart item ID
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}
```

---

## ⚠️ Error Handling

### HTTP Status Codes
- `200` - Success
- `400` - Bad Request (validation errors, missing fields)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate email, phone, etc.)
- `500` - Internal Server Error

### Error Response Format
```json
{
  "message": "Error description",
  "success": false
}
```

### Common Error Messages
- `"All fields are required"`
- `"User already exists"`
- `"Invalid credentials"`
- `"Unauthorized"`
- `"Forbidden"`
- `"Product not found"`
- `"Insufficient stock"`
- `"Invalid token"`

---

## 🔧 Environment Setup

### Required Environment Variables
```env
NODE_ENV=development
PORT=4000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
REDIS_URL=redis://localhost:6379

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Cashfree
CASHFREE_APP_ID=TEST10682002d45f237ea76f10e92cd620028601
CASHFREE_SECRET_KEY=cfsk_ma_test_xxxxxxxxx
CASHFREE_ENV=SANDBOX
CASHFREE_WEBHOOK_SECRET=your_webhook_secret
```

---

## 💡 Key Features & Business Logic

### Pricing Calculation
- **Tax**: 18% GST on subtotal
- **Shipping**: Free for orders > ₹499, otherwise ₹49
- **Total**: subtotal + tax + shipping

### Order ID Format
- Pattern: `Y7-{timestamp}-{random}`
- Example: `Y7-1704067200000-ABC123`

### Product Features
- **Slug**: Auto-generated from product name (lowercase, hyphenated)
- **SKU**: Auto-generated with format `SKU-XXXXXXXX`
- **Soft Delete**: Products use `deletedAt` field instead of hard deletion

### Cart Management
- **Storage**: Redis (not database)
- **Session**: Tied to user ID
- **Persistence**: Cart persists across sessions

### OTP System
- **Length**: 6 digits
- **Expiration**: 5 minutes
- **Storage**: Redis
- **Purpose**: Phone verification

---

## 🚀 Frontend Integration Tips

### Authentication Flow
1. Login/Register → Get tokens in cookies
2. Store user data in frontend state
3. Include cookies in requests (automatic) or use Bearer token
4. Handle 401 responses by redirecting to login

### Cart Integration
1. Add items → Update local cart state
2. Sync with backend on each action
3. Handle stock validation errors
4. Clear cart after successful order

### Order Flow
1. Select address → Validate address exists
2. Create order → Get order ID
3. Initiate payment → Use order ID
4. Handle payment callbacks → Update order status
5. Show success/failure page

### Error Handling
```javascript
// Example error handling
try {
  const response = await fetch('/api/v1/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Include cookies
    body: JSON.stringify({ productId, quantity })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  
  const data = await response.json();
  // Handle success
} catch (error) {
  // Handle error
  console.error('Cart error:', error.message);
}
```

### Payment Integration
```javascript
// Razorpay Integration
const options = {
  key: data.key,
  amount: data.amount,
  currency: data.currency,
  order_id: data.razorpayOrderId,
  handler: function(response) {
    // Payment success - verify on backend
  },
  modal: {
    ondismiss: function() {
      // Payment cancelled
    }
  }
};

const rzp = new Razorpay(options);
rzp.open();
```

---

## 📞 Support & Contact

For any questions about the API integration, please contact the backend development team.

**Happy Coding! 🎉**