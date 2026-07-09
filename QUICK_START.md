# Quick Start Guide - FoodHub

## 🎯 What's Been Fixed

✅ Complete authentication system with Context API  
✅ Three separate login pages (Customer, Restaurant Owner, Admin)  
✅ Protected routes based on user roles  
✅ Persistent login sessions (localStorage)  
✅ Dynamic header with login/logout functionality  
✅ Registration page with authentication  
✅ Error handling and loading states  
✅ Demo credentials displayed on each login page

## 🚀 How to Use

### 1. Start the Application

```bash
npm run dev
```

The app will open on `http://localhost:5174/`

### 2. Login as Different Users

#### **Customer Login**

- Go to: `/login` or click "Customer" on homepage
- Email: `user@test.com`
- Password: `user123`
- Access: Browse restaurants, cart, orders, profile

#### **Restaurant Owner Login**

- Go to: `/owner-login` or click "Restaurant Owner" on homepage
- Email: `owner@restaurant.com`
- Password: `owner123`
- Access: Restaurant dashboard, add food items

#### **Admin Login**

- Go to: `/admin-login` or click "Admin" on homepage
- Email: `admin@foodhub.com`
- Password: `admin123`
- Access: Admin dashboard, manage platform

## 📂 Files Created/Modified

### New Files:

- `src/app/context/AuthContext.jsx` - Authentication state management
- `src/app/components/ProtectedRoute.jsx` - Route protection component
- `SETUP_GUIDE.md` - Complete documentation
- `QUICK_START.md` - This file

### Modified Files:

- `src/app/App.jsx` - Added AuthProvider and protected routes
- `src/app/components/login-page.jsx` - Added authentication logic
- `src/app/components/admin-login-page.jsx` - Added authentication logic
- `src/app/components/owner-login-page.jsx` - Added authentication logic
- `src/app/components/register-page.jsx` - Added authentication logic
- `src/app/components/header.jsx` - Dynamic header based on user role
- `src/app/components/landing-page.jsx` - Added role selection

## 🔐 Authentication Features

### Login System

- ✅ Email/password validation
- ✅ Role-based authentication (customer/owner/admin)
- ✅ Error messages for invalid credentials
- ✅ Loading states during authentication
- ✅ Auto-redirect after successful login

### Session Management

- ✅ User data stored in localStorage
- ✅ Auto-login on page refresh
- ✅ Logout functionality
- ✅ Session persistence across tabs

### Protected Routes

- ✅ Customer-only routes (cart, checkout, orders)
- ✅ Owner-only routes (dashboard, add food)
- ✅ Admin-only routes (admin dashboard)
- ✅ Auto-redirect if unauthorized

## 🎨 User Interface

### Header (Dynamic)

- **Not Logged In**: Shows "Login" button
- **Logged In**: Shows user name, dropdown menu with:
  - Customer: Profile, My Orders, Logout
  - Owner: Dashboard, Logout
  - Admin: Admin Dashboard, Logout

### Login Pages

Each login page has:

- Role-specific color scheme
- Icon representing the role
- Demo credentials banner (for easy testing)
- Links to other login types
- Form validation
- Error handling

## 🛣️ Navigation Flow

### Customer Flow:

1. Login → Home → Browse Restaurants → Add to Cart → Checkout → Order

### Owner Flow:

1. Login → Owner Dashboard → Add Food → Manage Menu

### Admin Flow:

1. Login → Admin Dashboard → Manage Platform

## 🔍 Testing the App

1. **Test Customer Login:**
   - Login with customer credentials
   - Navigate to cart, orders, profile (should work)
   - Try accessing `/owner-dashboard` (should redirect)

2. **Test Owner Login:**
   - Login with owner credentials
   - Navigate to owner dashboard (should work)
   - Try accessing `/cart` (should redirect)

3. **Test Admin Login:**
   - Login with admin credentials
   - Navigate to admin dashboard (should work)
   - Try accessing customer/owner pages (should redirect)

4. **Test Logout:**
   - Click on user dropdown in header
   - Click "Logout"
   - You should be logged out and redirected to home

## 📱 Responsive Design

The app is fully responsive:

- ✅ Mobile (< 768px)
- ✅ Tablet (768px - 1024px)
- ✅ Desktop (> 1024px)

## ⚙️ How It Works

### Authentication Context (`AuthContext.jsx`)

```javascript
// Provides globally:
- user: Current user object
- login(email, password, role): Login function
- logout(): Logout function
- register(name, email, password): Register function
- isAuthenticated: Boolean for login status
- isCustomer, isAdmin, isOwner: Role checks
```

### Protected Route Component

```javascript
// Wraps routes that need authentication
<ProtectedRoute allowedRoles={["customer"]}>
  <CartPage />
</ProtectedRoute>
```

## 🚨 Important Notes

1. **Mock Authentication**: Currently using client-side mock authentication
2. **Production**: Replace with real backend API
3. **Security**: Add proper password hashing, JWT tokens
4. **Data**: All data is currently static/mock data

## 🎯 Next Steps

For a production-ready app:

1. ✅ Backend API integration
2. ✅ Database for users, restaurants, orders
3. ✅ Real authentication with JWT
4. ✅ Payment gateway integration
5. ✅ Order management system
6. ✅ Real-time updates with WebSockets

## 📞 Support

If you encounter issues:

1. Check browser console for errors
2. Verify you're using correct demo credentials
3. Clear localStorage if login issues persist
4. Restart dev server

## ✨ Summary

Your FoodHub app now has:

- ✅ Working login for 3 user types
- ✅ Protected routes based on roles
- ✅ Persistent sessions
- ✅ Professional UI/UX
- ✅ Complete authentication flow
- ✅ Ready for backend integration

**Enjoy your fully functional FoodHub application! 🎉**
