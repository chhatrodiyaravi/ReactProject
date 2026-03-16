import { createContext, useContext, useState, useEffect } from "react";
import { authApi, userApi } from "../services/api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const normalizeRole = (role) => (role === "user" ? "customer" : role);

  const mapUser = (rawUser, authToken) => ({
    ...rawUser,
    role: normalizeRole(rawUser?.role),
    token: authToken,
  });

  useEffect(() => {
    const bootstrapUser = localStorage.getItem("user");
    const bootstrapToken = localStorage.getItem("token");

    if (bootstrapUser && !bootstrapToken) {
      localStorage.removeItem("user");
    }

    const initAuth = async () => {
      const storedToken = localStorage.getItem("token");

      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const meRes = await authApi.me(storedToken);
        const nextUser = mapUser(meRes.data, storedToken);
        setToken(storedToken);
        setUser(nextUser);
        localStorage.setItem("user", JSON.stringify(nextUser));
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password, loginType = "customer") => {
    try {
      const res = await authApi.login({ email, password });
      const role = normalizeRole(res.data.role);

      if (
        (loginType === "customer" && role !== "customer") ||
        (loginType === "owner" && role !== "owner") ||
        (loginType === "admin" && role !== "admin")
      ) {
        return {
          success: false,
          error: `This account is not a ${loginType} account`,
        };
      }

      const nextUser = mapUser(res.data, res.data.token);
      setToken(res.data.token);
      setUser(nextUser);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(nextUser));

      return { success: true, user: nextUser };
    } catch (error) {
      return { success: false, error: error.message || "Login failed" };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const register = async (name, email, password, role = "customer", phone) => {
    try {
      const backendRole = role === "customer" ? "user" : role;
      const res = await authApi.register({
        name,
        email,
        password,
        phone,
        role: backendRole,
      });

      const nextUser = mapUser(res.data, res.data.token);
      setToken(res.data.token);
      setUser(nextUser);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(nextUser));

      return { success: true, user: nextUser };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Registration failed",
      };
    }
  };

  const updateProfile = async (updates) => {
    if (!user?._id || !token) {
      return { success: false, error: "Not authenticated" };
    }

    try {
      const body =
        typeof FormData !== "undefined" && updates instanceof FormData
          ? updates
          : updates;

      const res = await userApi.update({
        id: user._id,
        body,
        token,
      });
      const merged = {
        ...user,
        ...res.data,
        role: normalizeRole(res.data.role),
        token,
      };
      setUser(merged);
      localStorage.setItem("user", JSON.stringify(merged));
      return { success: true, user: merged };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Profile update failed",
      };
    }
  };

  const value = {
    user,
    login,
    logout,
    register,
    updateProfile,
    token,
    loading,
    isAuthenticated: !!user,
    isCustomer: user?.role === "customer",
    isAdmin: user?.role === "admin",
    isOwner: user?.role === "owner",
  };

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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
