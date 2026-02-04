# API Integration Guide

## Base Configuration
API client is configured in `src/lib/api.ts` with automatic token handling.

## Authentication Endpoints
```typescript
// Login
POST /api/auth/login
Body: { email: string, password: string }

// Register
POST /api/auth/register
Body: { name: string, email: string, password: string, phone: string }

// Logout
POST /api/auth/logout
```

## Product Endpoints
```typescript
// Get all products
GET /api/products

// Get product by ID
GET /api/products/:id

// Get products by category
GET /api/products/category/:category
```

## Cart Endpoints
```typescript
// Get user cart
GET /api/cart

// Add to cart
POST /api/cart/add
Body: { productId: string, quantity: number }

// Update cart item
PUT /api/cart/update/:itemId
Body: { quantity: number }

// Remove from cart
DELETE /api/cart/remove/:itemId
```

## Order Endpoints
```typescript
// Create order
POST /api/orders
Body: { items: CartItem[], shippingAddress: Address }

// Get user orders
GET /api/orders

// Get order by ID
GET /api/orders/:id
```

## Admin Endpoints
All admin endpoints require admin role authentication.

```typescript
// Dashboard stats
GET /api/admin/dashboard/stats

// Manage products
GET /api/admin/products
POST /api/admin/products
PUT /api/admin/products/:id
DELETE /api/admin/products/:id

// Manage orders
GET /api/admin/orders
PUT /api/admin/orders/:id/status
```

## Error Handling
API responses follow standard format:
```typescript
{
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}
```