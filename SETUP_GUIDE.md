# FoodHub - Food Delivery & Restaurant Ordering Platform

A modern, full-featured food delivery and restaurant ordering platform built with React, Vite, and Tailwind CSS.

## 🚀 Features

### Multi-Role Authentication System

- **Customer Login**: Order food from restaurants
- **Restaurant Owner Login**: Manage restaurant and menu items
- **Admin Login**: Manage platform, users, and restaurants

### Customer Features

- Browse restaurants by category
- Search for food and restaurants
- Add items to cart
- Place orders
- Track order status
- View order history
- Manage profile

### Restaurant Owner Features

- Dashboard for managing restaurant
- Add/edit/delete menu items
- View incoming orders
- Manage restaurant details

### Admin Features

- Admin dashboard
- Manage all restaurants
- View all orders
- User management

## 🔐 Demo Login Credentials

### Customer Account

- **Email**: `user@test.com`
- **Password**: `user123`

### Restaurant Owner Account

- **Email**: `owner@restaurant.com`
- **Password**: `owner123`

### Admin Account

- **Email**: `admin@foodhub.com`
- **Password**: `admin123`

## 📦 Installation

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Start Development Server**

   ```bash
   npm run dev
   ```

3. **Build for Production**

   ```bash
   npm run build
   ```

4. **Preview Production Build**
   ```bash
   npm run preview
   ```

## 🌐 Application Routes

### Public Routes

- `/` - Home page
- `/login` - Customer login
- `/register` - Customer registration
- `/owner-login` - Restaurant owner login
- `/admin-login` - Admin login
- `/restaurants` - Browse all restaurants
- `/restaurant/:id` - Restaurant details
- `/menu/:id` - Restaurant menu

### Protected Customer Routes

- `/cart` - Shopping cart
- `/checkout` - Checkout page
- `/order-confirmation` - Order confirmation
- `/order-status` - Track order
- `/orders` - Order history
- `/profile` - User profile

### Protected Restaurant Owner Routes

- `/owner-dashboard` - Restaurant dashboard
- `/add-food` - Add menu items

### Protected Admin Routes

- `/admin-dashboard` - Admin dashboard

## 🛠️ Tech Stack

- **Frontend Framework**: React 18.3.1
- **Build Tool**: Vite 6.3.5
- **Styling**: Tailwind CSS 4.1.12
- **Routing**: React Router DOM 7.13.0
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **State Management**: React Context API

## 🏗️ Project Structure

```
FoodHub/
├── src/
│   ├── app/
│   │   ├── components/        # React components
│   │   │   ├── ui/           # Reusable UI components
│   │   │   ├── login-page.jsx
│   │   │   ├── admin-login-page.jsx
│   │   │   ├── owner-login-page.jsx
│   │   │   ├── register-page.jsx
│   │   │   ├── header.jsx
│   │   │   ├── footer.jsx
│   │   │   ├── home-page.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── ...other components
│   │   ├── context/          # React Context
│   │   │   └── AuthContext.jsx
│   │   └── App.jsx           # Main app component
│   ├── styles/               # CSS files
│   │   ├── index.css
│   │   ├── tailwind.css
│   │   ├── fonts.css
│   │   └── theme.css
│   └── main.jsx             # Entry point
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🔑 Key Features Implemented

### Authentication System

- **AuthContext**: Centralized authentication state management
- **Login Functions**: Separate login flows for customers, owners, and admins
- **Protected Routes**: Role-based access control
- **Persistent Sessions**: LocalStorage-based session management
- **Logout Functionality**: Clear user session

### UI/UX Enhancements

- **Responsive Design**: Mobile-first responsive layout
- **Interactive Headers**: Dynamic header based on user role
- **Error Handling**: User-friendly error messages
- **Loading States**: Loading indicators during authentication
- **Demo Credentials**: Displayed on login pages for easy testing

## 🎨 Color Scheme

- **Customer**: Orange (#EA580C)
- **Restaurant Owner**: Blue (#2563EB)
- **Admin**: Green (#16A34A)

## 📱 Pages Overview

### Login Pages

Each login page includes:

- Role-specific branding and colors
- Email and password fields
- Form validation
- Error message display
- Demo credentials banner
- Links to other login types
- Back to home link

### Dashboard Pages

- **Customer**: Browse restaurants, manage cart, track orders
- **Owner**: Manage restaurant, add menu items, view orders
- **Admin**: Manage platform, users, and restaurants

## 🔄 Authentication Flow

1. User selects role type (Customer/Owner/Admin)
2. Enters credentials on respective login page
3. System validates credentials
4. On success, user data stored in Context and LocalStorage
5. User redirected to appropriate dashboard
6. Protected routes check user role before rendering
7. Header updates to show user-specific options

## 🚧 Future Enhancements

- Real backend API integration
- Payment gateway integration
- Real-time order tracking
- Push notifications
- Email verification
- Password reset functionality
- Social media login
- Advanced search and filters
- Reviews and ratings
- Restaurant analytics

## 📝 Development Notes

- Authentication is currently mock-based (client-side only)
- In production, implement proper backend authentication
- Add JWT tokens for secure API communication
- Implement proper password hashing
- Add rate limiting for login attempts
- Implement HTTPS in production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙋 Support

For support, email support@foodhub.com or open an issue in the repository.

---

**Built with ❤️ using React and Tailwind CSS**
