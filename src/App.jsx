import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { HomePage } from "./pages/home-page";
import { LoginPage } from "./pages/login-page";
import { RegisterPage } from "./pages/register-page";
import { RestaurantListPage } from "./pages/restaurant-list-page";
import { MenuPage } from "./pages/menu-page";
import { CartPage } from "./pages/cart-page";
import { OrderConfirmationPage } from "./pages/order-confirmation-page";
import { ProfilePage } from "./pages/profile-page";
import { OwnerLoginPage } from "./pages/restaurant-owner/owner-login-page";
import { OwnerRegisterPage } from "./pages/restaurant-owner/owner-register-page";
import { OwnerDashboardPage } from "./pages/restaurant-owner/owner-dashboard-page";
import { AddFoodPage } from "./pages/restaurant-owner/add-food-page";
import { AdminLoginPage } from "./pages/admin/admin-login-page";
import { FoodDetailsPage } from "./pages/food-details-page";
import { CheckoutPage } from "./pages/checkout-page";
import { OrderStatusPage } from "./pages/order-status-page";
import { OrdersPage } from "./pages/orders-page";
import { NewAdminDashboard } from "./pages/admin/new-admin-dashboard";
import { AboutPage } from "./pages/about-page";
import { ContactPage } from "./pages/contact-page";
import { ForgotPasswordPage } from "./pages/forgot-password-page";
import { ResetPasswordPage } from "./pages/reset-password-page";

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
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordPage />}
          />
          <Route path="/owner-login" element={<OwnerLoginPage />} />
          <Route path="/owner-register" element={<OwnerRegisterPage />} />
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
              <ProtectedRoute>
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
          <Route
            path="/edit-food/:foodId"
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
