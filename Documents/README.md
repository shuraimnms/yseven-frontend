# Y-Seven Frontend Documentation

## Project Overview
Y-Seven is a modern e-commerce platform for sauce and spice products built with React, TypeScript, and Vite.

## Tech Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Zustand
- **Routing**: React Router v6
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Axios
- **Testing**: Vitest + React Testing Library

## Quick Start
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test
```

## Project Structure
```
src/
├── components/     # Reusable UI components
├── pages/         # Route components
├── hooks/         # Custom React hooks
├── store/         # Zustand stores
├── lib/           # Utilities and API clients
├── types/         # TypeScript type definitions
└── assets/        # Static assets
```

## Environment Variables
Copy `.env.example` to `.env` and configure:
- `VITE_API_URL` - Backend API URL
- `VITE_RAZORPAY_KEY_ID` - Payment gateway key

## Key Features
- Product catalog with categories
- Shopping cart and checkout
- User authentication
- Admin dashboard
- AI-powered chatbot
- SEO optimization
- Responsive design