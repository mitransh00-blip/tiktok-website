# MITRANSH - E-Commerce Platform Guide

## Overview
MITRANSH is a TikTok-style e-commerce web application designed for Cameroonians. It allows users to browse, like, favorite, and purchase products from vendors in a swipe-based interface similar to TikTok.

---

## Features

### 1. User Authentication
- **Registration**: Users must register with:
  - Unique username
  - Unique phone number (Cameroon format: +237)
  - Unique email
  - Password (bcrypt hashed for security)
  - Preferred language (English or French)
  
- **Login**: Users can login using:
  - Username
  - Phone number
  - Email
  - Password

### 2. Guest Access
- Guests can browse the app without logging in
- Guests CANNOT: like, favorite, comment, follow, request orders, or purchase

### 3. Home Page (TikTok-Style)
- **Market**: Main feed showing products sorted by viral score
- **Preference**: Products from followed vendors only
- **Explore**: Grid view of all products
- **Live Icon**: Top left (ready for future live streaming)
- **Search Icon**: Top right for searching products

### 4. Product Actions (Right Side)
- Profile button (view vendor)
- Like button
- Comment button
- Favorite (add to cart)
- Share button
- Request button (order)

### 5. Order System
1. Client clicks "Request" → Selects quantity, size, color
2. Vendor receives notification → Approves or rejects
3. If approved → Client receives notification to pay
4. Client selects payment method (MTN or Orange)
5. Money stays in system → Vendor delivers item
6. Client confirms receipt → 97% released to vendor
7. If no delivery in 7 days → Auto-refund

### 6. Payment
- **MTN Mobile Money**: Dial *126#
- **Orange Money**: Dial #123#
- Money held in system until delivery confirmed

### 7. Viral System
- Products go viral based on transaction count
- More transactions = higher in feed = more visibility

### 8. Bottom Navigation
- Home (Logo)
- Upload (for vendors)
- Inbox (notifications & messages)
- Profile

### 9. Profile Sections
- My Products (vendor's uploaded items)
- Cart (favorited items)
- Liked items

### 10. Admin Dashboard
- View all users
- View all products
- View all orders
- Ban/unban users
- Delete products

---

## Technical Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Bcrypt password hashing

### Frontend
- React + Vite
- Tailwind CSS
- Framer Motion (animations)
- React Router

---

## Setup Instructions

### Prerequisites
1. Node.js installed
2. MongoDB account (Atlas)
3. Cloudinary account (for media storage)

### Backend Setup
```bash
cd Backend
npm install
```

Create `.env` file in Backend:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Run backend:
```bash
npm start
```

### Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```

---

## API Endpoints

### Auth
- POST /auth/register
- POST /auth/login
- GET /auth/me

### Users
- GET /users/:id
- PUT /users/profile
- POST /users/follow/:id

### Products
- GET /products
- GET /products/search
- POST /products
- PUT /products/:id
- DELETE /products/:id
- POST /products/:id/like
- POST /products/:id/favorite

### Orders
- POST /orders
- GET /orders/buyer
- GET /orders/vendor
- PUT /orders/:id/approve
- PUT /orders/:id/pay
- PUT /orders/:id/deliver
- PUT /orders/:id/confirm

### Admin
- GET /admin/users
- GET /admin/products
- PUT /admin/users/:id/ban

---

## Color Scheme
- Primary: Calm Light Purple (#8B5CF6 - violet-500)
- Background: Slate-950
- Text: White/Gray

---

## License
MITRANSH - E-Commerce Platform

