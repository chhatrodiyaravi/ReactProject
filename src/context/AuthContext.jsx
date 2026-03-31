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

  const AUTH_TOKEN_KEY = "auth_token";
  const AUTH_ROLE_KEY = "auth_role";
  const AUTH_USER_KEY = "auth_user";

  const normalizeRole = (role) => (role === "user" ? "customer" : role);

  const mapUser = (rawUser, authToken) => ({
    ...rawUser,
    role: normalizeRole(rawUser?.role),
    token: authToken,
  });

  const saveSessionAuth = (nextUser, authToken) => {
    sessionStorage.setItem(AUTH_TOKEN_KEY, authToken);
    sessionStorage.setItem(AUTH_ROLE_KEY, nextUser.role || "");
    sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(nextUser));
  };

  const clearSessionAuth = () => {
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    sessionStorage.removeItem(AUTH_ROLE_KEY);
    sessionStorage.removeItem(AUTH_USER_KEY);
  };

  useEffect(() => {
    const bootstrapUser = sessionStorage.getItem(AUTH_USER_KEY);
    const bootstrapToken = sessionStorage.getItem(AUTH_TOKEN_KEY);

    if (bootstrapUser && !bootstrapToken) {
      sessionStorage.removeItem(AUTH_USER_KEY);
      sessionStorage.removeItem(AUTH_ROLE_KEY);
    }

    const initAuth = async () => {
      const storedToken = sessionStorage.getItem(AUTH_TOKEN_KEY);

      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const meRes = await authApi.me(storedToken);
        const nextUser = mapUser(meRes.data, storedToken);
        setToken(storedToken);
        setUser(nextUser);
        saveSessionAuth(nextUser, storedToken);
      } catch {
        clearSessionAuth();
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
      saveSessionAuth(nextUser, res.data.token);

      return { success: true, user: nextUser };
    } catch (error) {
      return { success: false, error: error.message || "Login failed" };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    clearSessionAuth();
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
      saveSessionAuth(nextUser, res.data.token);

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
      sessionStorage.setItem(AUTH_ROLE_KEY, merged.role || "");
      sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(merged));
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
