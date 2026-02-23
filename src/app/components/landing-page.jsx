import {
  Search,
  MapPin,
  Pizza,
  Coffee,
  Utensils,
  ChefHat,
  User,
  Shield,
  Store,
  Menu,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export function LandingPage() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const categories = [
    { name: "Pizza", icon: Pizza },
    { name: "Burger", icon: Coffee },
    { name: "Biryani", icon: Utensils },
    { name: "Chinese", icon: ChefHat },
  ];

  const popularRestaurants = [
    { id: 1, name: "Pizza Palace", rating: 4.5, time: "30 mins" },
    { id: 2, name: "Burger Kingdom", rating: 4.3, time: "25 mins" },
    { id: 3, name: "Biryani House", rating: 4.7, time: "40 mins" },
    { id: 4, name: "Chinese Wok", rating: 4.2, time: "35 mins" },
  ];

  const loginOptions = [
    {
      title: "Customer",
      description: "Order delicious food from restaurants",
      icon: User,
      color: "orange",
      link: "/login",
    },
    {
      title: "Restaurant Owner",
      description: "Manage your restaurant and menu",
      icon: Store,
      color: "blue",
      link: "/owner-login",
    },
    {
      title: "Admin",
      description: "Manage platform and users",
      icon: Shield,
      color: "green",
      link: "/admin-login",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                FoodHub
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/restaurants"
                className="text-gray-700 hover:text-orange-600 font-medium transition-colors"
              >
                Restaurants
              </Link>
              <Link
                to="/login"
                className="text-gray-700 hover:text-orange-600 font-medium transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-6 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors shadow-lg shadow-orange-600/30"
              >
                Sign Up
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {showMobileMenu ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
              <nav className="flex flex-col gap-2 mt-4">
                <Link
                  to="/restaurants"
                  className="px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Restaurants
                </Link>
                <Link
                  to="/login"
                  className="px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-center"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Sign Up
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Order Your Favorite Food
          </h2>
          <p className="text-gray-600 mb-8">
            Delicious meals delivered to your doorstep
          </p>

          {/* Location Input */}
          <div className="max-w-2xl mx-auto mb-4">
            <div className="flex items-center bg-white rounded-lg shadow-md p-3 mb-4">
              <MapPin className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Enter your location"
                className="flex-1 outline-none"
              />
            </div>

            {/* Search Bar */}
            <div className="flex items-center bg-white rounded-lg shadow-md p-3">
              <Search className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search for food or restaurant"
                className="flex-1 outline-none"
              />
              <Link
                to="/restaurants"
                className="ml-2 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                Search
              </Link>
            </div>
          </div>
        </div>

        {/* Login Options */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Choose Your Login Type
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {loginOptions.map((option) => (
              <Link
                key={option.title}
                to={option.link}
                className={`bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition-all transform hover:-translate-y-1`}
              >
                <div
                  className={`w-16 h-16 bg-${option.color}-100 rounded-full flex items-center justify-center mb-4`}
                >
                  <option.icon className={`w-8 h-8 text-${option.color}-600`} />
                </div>
                <h4
                  className={`text-xl font-semibold text-${option.color}-600 mb-2`}
                >
                  {option.title}
                </h4>
                <p className="text-gray-600 text-sm">{option.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">
            Browse by Category
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                to="/restaurants"
                className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center hover:shadow-lg transition-shadow cursor-pointer"
              >
                <category.icon className="w-12 h-12 text-orange-600 mb-3" />
                <span className="font-medium text-gray-800">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Popular Restaurants */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">
            Popular Restaurants
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularRestaurants.map((restaurant) => (
              <Link
                key={restaurant.id}
                to={`/menu/${restaurant.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-40 bg-gradient-to-br from-orange-200 to-orange-400"></div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {restaurant.name}
                  </h4>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>⭐ {restaurant.rating}</span>
                    <span>🕒 {restaurant.time}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
