import {
  ShoppingCart,
  User,
  Home,
  Package,
  LogOut,
  LogIn,
  Menu,
  X,
  Store,
  Utensils,
  Search,
  Shield,
  ChevronDown,
  Info,
  Phone,
  Sun,
  Moon,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export function Header({ cartItemCount = 0 }) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    setShowMobileMenu(false);
    navigate("/");
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setShowMobileMenu(false);
    setShowUserMenu(false);
  }, [location]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest(".user-menu-container")) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showUserMenu]);

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
      isActive(path)
        ? "bg-orange-100 text-orange-600 font-medium"
        : "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
    }`;

  return (
    <header className="bg-white dark:bg-slate-900 shadow-md sticky top-0 z-50 border-b border-transparent dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent truncate max-w-[140px] sm:max-w-none">
              FoodHub
            </span>
          </Link>

          {/* Right Side - Navigation and Actions */}
          <div className="flex items-center gap-1">
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              <Link to="/" className={navLinkClass("/")}>
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>

              <Link to="/restaurants" className={navLinkClass("/restaurants")}>
                <Utensils className="w-4 h-4" />
                <span>Restaurants</span>
              </Link>

              <Link to="/about" className={navLinkClass("/about")}>
                <Info className="w-4 h-4" />
                <span>About</span>
              </Link>

              <Link to="/contact" className={navLinkClass("/contact")}>
                <Phone className="w-4 h-4" />
                <span>Contact</span>
              </Link>
            </nav>
            <button
              onClick={toggleTheme}
              className="hidden md:inline-flex p-2 mr-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              aria-label={
                isDark ? "Switch to light mode" : "Switch to dark mode"
              }
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700" />
              )}
            </button>

            {/* Cart Icon - Only for logged-in customers */}
            {isAuthenticated && user?.role === "customer" && (
              <Link
                to="/cart"
                className="relative p-2 hover:bg-orange-50 rounded-lg transition-colors ml-2"
              >
                <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-orange-600" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium shadow-lg">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            )}

            {/* Login and Signup Buttons OR User Menu - Desktop */}
            <div className="hidden md:block ml-4">
              {isAuthenticated ? (
                <div className="relative user-menu-container">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700 font-medium">
                      {user?.name || "Account"}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 transition-transform ${
                        showUserMenu ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                        <p className="text-sm font-semibold text-gray-900">
                          {user?.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user?.email}
                        </p>
                        <p className="text-xs text-orange-600 font-medium mt-1 capitalize">
                          {user?.role}
                        </p>
                      </div>

                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>My Profile</span>
                      </Link>

                      {user?.role === "customer" && (
                        <>
                          <Link
                            to="/orders"
                            className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <Package className="w-4 h-4" />
                            <span>My Orders</span>
                          </Link>
                          <Link
                            to="/cart"
                            className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <ShoppingCart className="w-4 h-4" />
                            <span>My Cart</span>
                          </Link>
                        </>
                      )}

                      {user?.role === "owner" && (
                        <>
                          <Link
                            to="/owner-dashboard"
                            className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <Store className="w-4 h-4" />
                            <span>Dashboard</span>
                          </Link>
                          <Link
                            to="/add-food"
                            className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <Utensils className="w-4 h-4" />
                            <span>Add Food</span>
                          </Link>
                        </>
                      )}

                      {user?.role === "admin" && (
                        <Link
                          to="/admin-dashboard"
                          className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Shield className="w-4 h-4" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}

                      <hr className="my-2" />
                      <button
                        className="flex items-center gap-3 w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/register"
                    className="px-4 py-2 text-gray-700 hover:text-orange-600 font-medium transition-colors"
                  >
                    Sign Up
                  </Link>
                  <Link
                    to="/login"
                    className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors shadow-lg shadow-orange-600/30"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {showMobileMenu ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-200 animate-in slide-in-from-top duration-200">
            <nav className="flex flex-col gap-2 mt-4">
              <Link
                to="/"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                  isActive("/")
                    ? "bg-orange-100 text-orange-600 font-medium"
                    : "text-gray-700 hover:bg-orange-50"
                }`}
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </Link>

              <Link
                to="/restaurants"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                  isActive("/restaurants")
                    ? "bg-orange-100 text-orange-600 font-medium"
                    : "text-gray-700 hover:bg-orange-50"
                }`}
              >
                <Utensils className="w-5 h-5" />
                <span>Restaurants</span>
              </Link>

              <Link
                to="/about"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                  isActive("/about")
                    ? "bg-orange-100 text-orange-600 font-medium"
                    : "text-gray-700 hover:bg-orange-50"
                }`}
              >
                <Info className="w-5 h-5" />
                <span>About</span>
              </Link>

              <Link
                to="/contact"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                  isActive("/contact")
                    ? "bg-orange-100 text-orange-600 font-medium"
                    : "text-gray-700 hover:bg-orange-50"
                }`}
              >
                <Phone className="w-5 h-5" />
                <span>Contact</span>
              </Link>

              <div className="border-t border-gray-200 mt-2 pt-2">
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-orange-50 rounded-lg"
                >
                  {isDark ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                  <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
                </button>

                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-3 bg-gray-50 rounded-lg mb-2">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">
                            {user?.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-orange-600 font-medium capitalize">
                        {user?.role}
                      </p>
                    </div>

                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-orange-50 rounded-lg"
                    >
                      <User className="w-5 h-5" />
                      <span>My Profile</span>
                    </Link>

                    {user?.role === "customer" && (
                      <>
                        <Link
                          to="/orders"
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-orange-50 rounded-lg"
                        >
                          <Package className="w-5 h-5" />
                          <span>My Orders</span>
                        </Link>
                        <Link
                          to="/cart"
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-orange-50 rounded-lg"
                        >
                          <ShoppingCart className="w-5 h-5" />
                          <span>My Cart</span>
                        </Link>
                      </>
                    )}

                    {user?.role === "owner" && (
                      <>
                        <Link
                          to="/owner-dashboard"
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-orange-50 rounded-lg"
                        >
                          <Store className="w-5 h-5" />
                          <span>Dashboard</span>
                        </Link>
                        <Link
                          to="/add-food"
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-orange-50 rounded-lg"
                        >
                          <Utensils className="w-5 h-5" />
                          <span>Add Food</span>
                        </Link>
                      </>
                    )}

                    {user?.role === "admin" && (
                      <Link
                        to="/admin-dashboard"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-orange-50 rounded-lg"
                      >
                        <Shield className="w-5 h-5" />
                        <span>Admin Panel</span>
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg mt-2"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link
                      to="/register"
                      className="flex items-center justify-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-300"
                    >
                      Sign Up
                    </Link>
                    <Link
                      to="/login"
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                    >
                      <LogIn className="w-5 h-5" />
                      <span>Login</span>
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
