import {
  User,
  MapPin,
  Phone,
  Mail,
  LogOut,
  Package,
  Edit2,
  Save,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "./header";
import { Footer } from "./footer";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: user?.name || "",
    phone: user?.phone || "+91 9876543210",
    address: user?.address || "123 Main Street, Mumbai, Maharashtra",
  });

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSave = () => {
    // Here you would typically save to backend
    console.log("Saving user data:", editedUser);
    setIsEditing(false);
    // You can update the user context here if needed
  };

  const handleCancel = () => {
    setEditedUser({
      name: user?.name || "",
      phone: user?.phone || "+91 9876543210",
      address: user?.address || "123 Main Street, Mumbai, Maharashtra",
    });
    setIsEditing(false);
  };
  const orderHistory = [
    {
      id: 1,
      orderId: "ORD12345ABC",
      restaurant: "Pizza Palace",
      items: 3,
      total: 746,
      date: "2026-01-26",
      status: "Delivered",
    },
    {
      id: 2,
      orderId: "ORD67890DEF",
      restaurant: "Burger Kingdom",
      items: 2,
      total: 450,
      date: "2026-01-25",
      status: "Delivered",
    },
    {
      id: 3,
      orderId: "ORD11223GHI",
      restaurant: "Biryani House",
      items: 4,
      total: 890,
      date: "2026-01-24",
      status: "Cancelled",
    },
  ];

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600">
              Manage your account and view your orders
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="text-center flex-1">
                    <div className="w-20 h-20 bg-orange-200 rounded-full flex items-center justify-center mx-auto mb-3">
                      <User className="w-10 h-10 text-orange-600" />
                    </div>
                  </div>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-orange-600 hover:text-orange-700"
                  >
                    {isEditing ? (
                      <X className="w-5 h-5" />
                    ) : (
                      <Edit2 className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={editedUser.name}
                        onChange={(e) =>
                          setEditedUser({ ...editedUser, name: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={user?.email}
                        disabled
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={editedUser.phone}
                        onChange={(e) =>
                          setEditedUser({
                            ...editedUser,
                            phone: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <textarea
                        value={editedUser.address}
                        onChange={(e) =>
                          setEditedUser({
                            ...editedUser,
                            address: e.target.value,
                          })
                        }
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center justify-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-center mb-6">
                      <h2 className="text-xl font-semibold text-gray-900">
                        {user?.name}
                      </h2>
                      <p className="text-gray-500 capitalize">
                        {user?.role || "Customer"}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="text-gray-900">{user?.email}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="text-gray-900">{editedUser.phone}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Address</p>
                          <p className="text-gray-900">{editedUser.address}</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full mt-6 px-4 py-3 border border-red-600 text-red-600 rounded-lg font-medium hover:bg-red-50 flex items-center justify-center gap-2"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </div>

            {/* Order History */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Order History
                </h3>

                <div className="space-y-4">
                  {orderHistory.map((order) => (
                    <div
                      key={order.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-orange-600 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {order.restaurant}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Order #{order.orderId}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            order.status === "Delivered"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-sm text-gray-600">
                        <span>{order.items} items</span>
                        <span className="text-gray-400">•</span>
                        <span>₹{order.total}</span>
                        <span className="text-gray-400">•</span>
                        <span>{order.date}</span>
                      </div>

                      <div className="mt-3 flex gap-2">
                        <button className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700">
                          Reorder
                        </button>
                        <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {orderHistory.length === 0 && (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No orders yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
