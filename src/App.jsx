import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, ThemeProvider } from "./context";
import { ProtectedRoute } from "./components";
import {
  HomePage,
  LoginPage,
  RegisterPage,
  RestaurantListPage,
  MenuPage,
  CartPage,
  OrderConfirmationPage,
  ProfilePage,
  FoodDetailsPage,
  CheckoutPage,
  OrderStatusPage,
  OrdersPage,
  AboutPage,
  ContactPage,
  ForgotPasswordPage,
  ResetPasswordPage,
} from "./pages";
import {
  OwnerLoginPage,
  OwnerRegisterPage,
  OwnerDashboardPage,
  AddFoodPage,
} from "./pages/restaurant-owner";
import { AdminLoginPage, NewAdminDashboard } from "./pages/admin";

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
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
      </ThemeProvider>
    </BrowserRouter>
  );
}
