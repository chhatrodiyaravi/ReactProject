import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth();
  const sessionRole = sessionStorage.getItem("auth_role");
  const effectiveRole = user?.role || sessionRole;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(effectiveRole)) {
    // Redirect based on user role
    if (effectiveRole === "admin")
      return <Navigate to="/admin-dashboard" replace />;
    if (effectiveRole === "owner")
      return <Navigate to="/owner-dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
}
