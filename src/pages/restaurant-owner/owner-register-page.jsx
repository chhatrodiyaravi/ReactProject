import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  Phone,
  Store,
  MapPin,
  FileText,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { restaurantApi } from "../../services/api";
import {
  isValidCity,
  isValidEmail,
  isValidName,
  isValidPassword,
  isValidPhone,
} from "../../utils/validation";

export function OwnerRegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantDescription, setRestaurantDescription] = useState("");
  const [restaurantCity, setRestaurantCity] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const payload = {
      restaurantName: restaurantName.trim(),
      restaurantDescription: restaurantDescription.trim(),
      restaurantCity: restaurantCity.trim(),
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password: password.trim(),
    };

    if (Object.values(payload).some((value) => !value)) {
      setError("All fields are required");
      return;
    }

    if (!isValidName(payload.name)) {
      setError(
        "Full name must be at least 3 characters and contain only valid letters",
      );
      return;
    }

    if (!isValidName(payload.restaurantName, 2)) {
      setError(
        "Restaurant name must be at least 2 characters and contain only valid letters",
      );
      return;
    }

    if (payload.restaurantDescription.length < 10) {
      setError("Restaurant description must be at least 10 characters long");
      return;
    }

    if (!isValidCity(payload.restaurantCity)) {
      setError("Please enter a valid city name");
      return;
    }

    if (!isValidEmail(payload.email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!isValidPhone(payload.phone)) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    if (!isValidPassword(payload.password)) {
      setError(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
      );
      return;
    }

    setLoading(true);

    try {
      const result = await register(
        payload.name,
        payload.email,
        payload.password,
        "owner",
        payload.phone,
      );
      if (result.success) {
        try {
          const restaurantRes = await restaurantApi.create({
            token: result.user.token,
            body: {
              name: payload.restaurantName,
              description: payload.restaurantDescription,
              phone: payload.phone,
              email: payload.email,
              address: {
                city: payload.restaurantCity,
                country: "India",
              },
              cuisine: ["Other"],
            },
          });

          if (restaurantRes.success) {
            navigate("/owner-dashboard");
          } else {
            setError(restaurantRes.message || "Failed to create restaurant");
          }
        } catch (restaurantError) {
          setError(
            restaurantError.message ||
              "Failed to create restaurant. Please try again.",
          );
        }
      } else {
        setError(result.error || "Owner registration failed");
      }
    } catch (error) {
      setError(error.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Store className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-blue-600 mb-2">
            Restaurant Owner
          </h1>
          <h2 className="text-2xl font-semibold text-gray-900">Register</h2>
          <p className="text-gray-600 mt-2">
            Create your owner account to manage your restaurant
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Restaurant Name
              </label>
              <div className="relative">
                <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  placeholder="Enter restaurant name"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Restaurant Description
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
                <textarea
                  value={restaurantDescription}
                  onChange={(e) => setRestaurantDescription(e.target.value)}
                  placeholder="Tell us about your restaurant"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none min-h-[90px]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={restaurantCity}
                  onChange={(e) => setRestaurantCity(e.target.value)}
                  placeholder="Enter city"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Restaurant Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  inputMode="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter restaurant email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter 10-digit phone number"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Owner Account..." : "Register as Owner"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an owner account?{" "}
              <Link
                to="/owner-login"
                className="text-blue-600 font-medium hover:underline"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-gray-600 hover:text-blue-600">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
