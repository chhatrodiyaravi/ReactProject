import { createContext, useContext, useState, useEffect } from "react";

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
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = (email, password, userType = "customer") => {
    // Mock authentication - in production, this would call an API
    const mockUsers = {
      customer: {
        email: "user@test.com",
        password: "user123",
        name: "John Doe",
        role: "customer",
      },
      admin: {
        email: "admin@foodhub.com",
        password: "admin123",
        name: "Admin User",
        role: "admin",
      },
      owner: {
        email: "owner@restaurant.com",
        password: "owner123",
        name: "Restaurant Owner",
        role: "owner",
        restaurantName: "Pizza Palace",
      },
    };

    const userData = mockUsers[userType];

    if (email === userData.email && password === userData.password) {
      const userInfo = {
        id: Math.random().toString(36).substr(2, 9),
        email: userData.email,
        name: userData.name,
        role: userData.role,
        ...(userType === "owner" && {
          restaurantName: userData.restaurantName,
        }),
      };

      setUser(userInfo);
      localStorage.setItem("user", JSON.stringify(userInfo));
      return { success: true, user: userInfo };
    }

    return { success: false, error: "Invalid email or password" };
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // Register function
  const register = (name, email, password, userType = "customer") => {
    // Mock registration - in production, this would call an API
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      role: userType,
    };

    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
    return { success: true, user: newUser };
  };

  const value = {
    user,
    login,
    logout,
    register,
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
