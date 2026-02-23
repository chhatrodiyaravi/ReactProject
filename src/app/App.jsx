import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { HomePage } from "./components/home-page";
import { LoginPage } from "./components/login-page";
import { RegisterPage } from "./components/register-page";
import { RestaurantListPage } from "./components/restaurant-list-page";
import { MenuPage } from "./components/menu-page";
import { CartPage } from "./components/cart-page";
import { OrderConfirmationPage } from "./components/order-confirmation-page";
import { ProfilePage } from "./components/profile-page";
import { OwnerLoginPage } from "./components/owner-login-page";
import { OwnerDashboardPage } from "./components/owner-dashboard-page";
import { AddFoodPage } from "./components/add-food-page";
import { AdminLoginPage } from "./components/admin-login-page";
import { FoodDetailsPage } from "./components/food-details-page";
import { CheckoutPage } from "./components/checkout-page";
import { OrderStatusPage } from "./components/order-status-page";
import { OrdersPage } from "./components/orders-page";
import { NewAdminDashboard } from "./components/new-admin-dashboard";
import { AboutPage } from "./components/about-page";
import { ContactPage } from "./components/contact-page";
import { ForgotPasswordPage } from "./components/forgot-password-page";
import { ResetPasswordPage } from "./components/reset-password-page";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/owner-login" element={<OwnerLoginPage />} />
          <Route path="/admin-login" element={<AdminLoginPage />} />

          {/* Customer Routes - Available to all authenticated users */}
          <Route path="/restaurants" element={<RestaurantListPage />} />
          <Route path="/restaurant/:id" element={<FoodDetailsPage />} />
          <Route path="/menu/:id" element={<MenuPage />} />

          {/* Protected Customer Routes */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-confirmation"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <OrderConfirmationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-status"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <OrderStatusPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Restaurant Owner Routes */}
          <Route
            path="/owner-dashboard"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <OwnerDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-food"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <AddFoodPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <NewAdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
