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
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { useAuth } from "../context/AuthContext";
import { useEffect, useMemo, useState } from "react";
import { orderApi } from "../services/api";

const getImageUrl = (imagePath) => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http")) return imagePath;
  const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  return `${apiBaseUrl}${imagePath}`;
};

function getAddressText(address) {
  if (!address) {
    return "";
  }

  if (typeof address === "string") {
    return address;
  }

  if (typeof address === "object") {
    return address.street || "";
  }

  return "";
}

export function ProfilePage() {
  const { user, logout, token, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [orders, setOrders] = useState([]);
  const [saveError, setSaveError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  const [editedUser, setEditedUser] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: getAddressText(user?.address),
  });

  useEffect(() => {
    setEditedUser({
      name: user?.name || "",
      phone: user?.phone || "",
      address: getAddressText(user?.address),
    });
  }, [user]);

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) {
        return;
      }
      try {
        const res = await orderApi.getMine(token);
        const normalizedOrders = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.data?.orders)
            ? res.data.orders
            : Array.isArray(res?.orders)
              ? res.orders
              : [];
        setOrders(normalizedOrders);
      } catch {
        setOrders([]);
      }
    };

    fetchOrders();
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSave = async () => {
    setSaveError("");
    setIsSaving(true);

    const payload = new FormData();
    payload.append("name", editedUser.name);
    payload.append("phone", editedUser.phone);
    payload.append("address[street]", editedUser.address);

    if (avatarFile) {
      payload.append("avatar", avatarFile);
    }

    const result = await updateProfile(payload);

    if (!result.success) {
      setSaveError(result.error || "Failed to update profile");
    } else {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
      setAvatarFile(null);
      setAvatarPreview("");
      setIsEditing(false);
    }

    setIsSaving(false);
  };

  const handleCancel = () => {
    setEditedUser({
      name: user?.name || "",
      phone: user?.phone || "",
      address: getAddressText(user?.address),
    });
    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
    }
    setAvatarFile(null);
    setAvatarPreview("");
    setSaveError("");
    setIsEditing(false);
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0] || null;
    if (!file) {
      return;
    }

    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const addressText = getAddressText(user?.address);
  const avatarSrc = avatarPreview || getImageUrl(user?.avatar);

  const orderList = useMemo(
    () => (Array.isArray(orders) ? orders : []),
    [orders],
  );

  const cartCount = useMemo(
    () =>
      orderList
        .flatMap((order) => order?.orderItems || [])
        .reduce((sum, item) => sum + (item?.quantity || 0), 0),
    [orderList],
  );

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Header cartItemCount={cartCount} />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600">
              Manage your account and view your orders
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="text-center flex-1">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-orange-200 flex items-center justify-center mx-auto mb-3">
                      {avatarSrc ? (
                        <img
                          src={avatarSrc}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-10 h-10 text-orange-600" />
                      )}
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
                    {saveError && (
                      <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                        {saveError}
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Profile Photo (Optional)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      {avatarFile && (
                        <p className="mt-1 text-xs text-gray-500">
                          Selected: {avatarFile.name}
                        </p>
                      )}
                    </div>
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
                        disabled={isSaving}
                        className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center justify-center gap-2 disabled:opacity-60"
                      >
                        <Save className="w-4 h-4" />
                        {isSaving ? "Saving..." : "Save"}
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
                          <p className="text-gray-900">
                            {user?.phone || "Not set"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Address</p>
                          <p className="text-gray-900">
                            {addressText || "Not set"}
                          </p>
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

            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Order History
                </h3>

                <div className="space-y-4">
                  {orderList.map((order, index) => {
                    const orderId = order?._id || order?.id || "";
                    const orderCode = orderId
                      ? orderId.slice(-8).toUpperCase()
                      : `ITEM-${index + 1}`;
                    const createdAtText = order?.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : "Date unavailable";

                    return (
                      <div
                        key={orderId || `order-${index}`}
                        className="border border-gray-200 rounded-lg p-4 hover:border-orange-600 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {order.orderItems?.[0]?.restaurant?.name ||
                                "Restaurant"}
                            </h4>
                            <p className="text-sm text-gray-500">
                              Order #{orderCode}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${
                              order.orderStatus === "Delivered"
                                ? "bg-green-100 text-green-700"
                                : order.orderStatus === "Cancelled"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {order.orderStatus}
                          </span>
                        </div>

                        <div className="flex justify-between items-center text-sm text-gray-600">
                          <span>{(order.orderItems || []).length} items</span>
                          <span className="text-gray-400">•</span>
                          <span>₹{order.totalPrice}</span>
                          <span className="text-gray-400">•</span>
                          <span>{createdAtText}</span>
                        </div>

                        <div className="mt-3 flex gap-2">
                          <Link
                            to={`/order-status?orderId=${orderId}`}
                            className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700 text-center"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {orderList.length === 0 && (
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
