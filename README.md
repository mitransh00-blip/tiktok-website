# MITRANSH - E-Commerce Platform

MITRANSH is a TikTok-like e-commerce web application designed specifically for the Cameroonian market. It combines social media features with e-commerce functionality, allowing vendors to showcase products and clients to discover, request, and purchase items seamlessly.

## Features

### ✅ Core Features
- **100% Bilingual**: Full English and French language support
- **User Authentication**: Secure registration and login with unique username, phone (Cameroon +237), and email
- **Password Security**: Bcrypt hashing with 12 salt rounds
- **TikTok-like UI**: Vertical scrolling product feed with horizontal auto-swipe for multiple images

### 🛒 E-Commerce
- **Market Tab**: Products sorted by viral score (more transactions = higher visibility)
- **Preference Tab**: Products from vendors you follow
- **Explore Tab**: Grid view of all products
- **Product Display**: Full-screen vertical swipe like TikTok

### 💳 Payment System
- **MTN Mobile Money**: Dial *126# automatically
- **Orange Money**: Dial #123# automatically
- **97% to Vendor**: Released when client confirms receipt
- **3% to System**: Platform fee
- **Auto-refund**: If vendor fails to deliver within 7 days

### 📊 Viral Algorithm
- Posts go viral based on transaction volume
- More transactions = Higher trending score
- Products sorted by viral score in Market feed

### 👤 User Features
- Follow/Unfollow vendors
- Like, comment, and favorite products
- Request products with quantity, size, color selection
- Share products

### 🔧 Admin Dashboard
- Monitor all users, products, and orders
- Ban/unban users
- Delete products
- View revenue statistics

---

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (Atlas or local)
- Cloudinary account for media storage

### Installation

1. **Install Backend Dependencies**
```bash
cd Backend
npm install
```

2. **Install Frontend Dependencies**
```bash
cd Frontend
npm install
```

### Configuration

Create a `.env` file in the Backend folder:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Running the Application

1. **Start Backend Server**
```bash
cd Backend
node index.js
```
Server runs on http://localhost:5000

2. **Start Frontend Development Server**
```bash
cd Frontend
npm run dev
```
App runs on http://localhost:5173

---

## How to Create an Admin User

### Method 1: Using MongoDB Compass

1. Open MongoDB Compass and connect to your database
2. Navigate to the `users` collection
3. Find your user account
4. Edit the document and set `isAdmin` to `true`

### Method 2: Using Mongo Shell

```javascript
use mitransh
db.users.updateOne(
  { username: "your_username" },
  { $set: { isAdmin: true } }
)
```

### Method 3: Using the API

You can create an admin directly in the database or modify a user via MongoDB Atlas console.

---

## Project Structure

```
tiktok-website/
├── Backend/
│   ├── auth/
│   │   └── authRoutes.js      # Authentication routes
│   ├── middleware/
│   │   └── auth.js            # JWT authentication middleware
│   ├── models/
│   │   ├── User.js            # User model
│   │   ├── Product.js         # Product model
│   │   ├── Order.js           # Order model
│   │   └── Notification.js    # Notification model
│   ├── routes/
│   │   ├── adminRoutes.js     # Admin routes
│   │   ├── productRoutes.js   # Product routes
│   │   ├── orderRoutes.js     # Order routes
│   │   └── notificationRoutes.js
│   ├── db.js                  # Database connection
│   └── index.js               # Server entry point
│
├── Frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── AnimatedLogo.jsx
│   │   │   ├── GuestModal.jsx
│   │   │   ├── OrderRequestModal.jsx
│   │   │   └── PaymentModal.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── LanguageContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── register.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Upload.jsx
│   │   │   ├── Inbox.jsx
│   │   │   ├── Search.jsx
│   │   │   └── Admin.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── cloudinary.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
│
├── TODO.md                    # Implementation plan
└── README.md                  # This file
```

---

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user

### Users
- `GET /users/:id` - Get user profile
- `PUT /users/profile` - Update profile
- `POST /users/follow/:id` - Follow/unfollow user

### Products
- `GET /products` - Get all products
- `GET /products/search` - Search products
- `POST /products` - Create product
- `POST /products/:id/like` - Like product
- `POST /products/:id/favorite` - Add to cart

### Orders
- `POST /orders` - Create order
- `GET /orders/buyer` - Get buyer's orders
- `GET /orders/vendor` - Get vendor's orders
- `PUT /orders/:id/approve` - Approve order
- `PUT /orders/:id/pay` - Mark as paid
- `PUT /orders/:id/deliver` - Mark as delivered
- `PUT /orders/:id/confirm` - Confirm receipt

### Admin
- `GET /admin/users` - Get all users
- `GET /admin/products` - Get all products
- `GET /admin/orders` - Get all orders
- `GET /admin/stats` - Get platform statistics
- `PUT /admin/users/:id/ban` - Ban user
- `PUT /admin/users/:id/unban` - Unban user
- `DELETE /admin/products/:id` - Delete product
- `DELETE /admin/users/:id` - Delete user

---

## User Flows

### Registration Flow
1. User opens app → Login/Register page
2. Clicks "Register"
3. Fills: username, email, phone (+237 auto), password, language
4. Submits → Account created → Redirected to Home

### Shopping Flow
1. Browse Market/Preference/Explore
2. Swipe vertically through products
3. Click Request on product
4. Select quantity, size, color
5. Submit order → Vendor notified
6. Vendor approves → Client notified
7. Client pays via MTN/Orange
8. Vendor delivers → Client confirms
9. 97% released to vendor

---

## Design

- **Main Color**: Calm Light Purple (#8b5cf6)
- **UI Style**: Glassmorphism with blur effects
- **Animations**: Smooth transitions and micro-interactions
- **Responsive**: Optimized for mobile-first experience

---

## License

MIT

---

**MITRANSH** - The TikTok of E-Commerce for Cameroon 🇨🇲

