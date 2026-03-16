# FoodHub Backend API

Backend API for FoodHub - A food delivery application built with Node.js, Express, and MongoDB.

## Features

- User authentication with JWT
- Role-based access control (User, Owner, Admin)
- Restaurant management
- Food menu management
- Shopping cart functionality
- Order management
- File upload for images (restaurants and food items)
- RESTful API design

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads

## Installation

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables in `.env`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret_key
```

3. Install additional dependencies (if not already installed):

```bash
npm install mongoose bcryptjs jsonwebtoken multer
```

## Running the Server

### Development mode (with nodemon):

```bash
npm run dev
```

### Production mode:

```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Users

- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID (Protected)
- `PUT /api/users/:id` - Update user (Protected)
- `DELETE /api/users/:id` - Delete user (Admin only)

### Restaurants

- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/:id` - Get restaurant by ID
- `POST /api/restaurants` - Create restaurant (Owner/Admin)
- `PUT /api/restaurants/:id` - Update restaurant (Owner/Admin)
- `DELETE /api/restaurants/:id` - Delete restaurant (Owner/Admin)

### Foods

- `GET /api/foods` - Get all foods
- `GET /api/foods/:id` - Get food by ID
- `POST /api/foods` - Create food item (Owner/Admin)
- `PUT /api/foods/:id` - Update food item (Owner/Admin)
- `DELETE /api/foods/:id` - Delete food item (Owner/Admin)

### Orders

- `POST /api/orders` - Create order (Protected)
- `GET /api/orders` - Get all orders (Admin/Owner)
- `GET /api/orders/myorders` - Get user's orders (Protected)
- `GET /api/orders/:id` - Get order by ID (Protected)
- `PUT /api/orders/:id/status` - Update order status (Admin/Owner)
- `PUT /api/orders/:id/payment` - Update payment status (Protected)

### Cart

- `GET /api/cart` - Get user's cart (Protected)
- `POST /api/cart` - Add item to cart (Protected)
- `PUT /api/cart/:itemId` - Update cart item (Protected)
- `DELETE /api/cart/:itemId` - Remove item from cart (Protected)
- `DELETE /api/cart` - Clear cart (Protected)

## Project Structure

```
backend/
├── config/
│   ├── database.js      # MongoDB connection
│   └── multer.js        # File upload configuration
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── restaurantController.js
│   ├── foodController.js
│   ├── orderController.js
│   └── cartController.js
├── middleware/
│   ├── auth.js          # Authentication & authorization
│   └── error.js         # Error handling
├── models/
│   ├── User.js
│   ├── Restaurant.js
│   ├── Food.js
│   ├── Order.js
│   └── Cart.js
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── restaurantRoutes.js
│   ├── foodRoutes.js
│   ├── orderRoutes.js
│   └── cartRoutes.js
├── uploads/             # Uploaded files directory
├── .env                 # Environment variables
├── .gitignore
├── index.js             # Entry point
└── package.json
```

## User Roles

- **user** - Can browse restaurants, order food, manage cart
- **owner** - Can manage their restaurants and food items
- **admin** - Full access to all resources

## License

ISC
