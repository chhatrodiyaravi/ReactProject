import {
  LayoutDashboard,
  Users,
  Store,
  ShoppingBag,
  TicketPercent,
  LogOut,
  TrendingUp,
  Menu,
  Search,
  Trash2,
  RefreshCw,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { adminApi, orderApi, userApi } from "../../services/api";

export function NewAdminDashboard() {
  const navigate = useNavigate();
  const { logout, user, token } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window === "undefined") {
      return true;
    }
    return window.innerWidth >= 1024;
  });
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [restaurantStatusFilter, setRestaurantStatusFilter] =
    useState("pending");

  const [users, setUsers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submittingUser, setSubmittingUser] = useState(false);
  const [submittingRestaurant, setSubmittingRestaurant] = useState(false);
  const [submittingCoupon, setSubmittingCoupon] = useState(false);
  const [showUserPassword, setShowUserPassword] = useState(false);

  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "user",
  });

  const [restaurantForm, setRestaurantForm] = useState({
    name: "",
    description: "",
    ownerId: "",
    phone: "",
    email: "",
    cuisine: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const [couponForm, setCouponForm] = useState({
    code: "",
    description: "",
    discountType: "percentage",
    discountValue: "",
    maxDiscount: "",
    minOrderAmount: "",
    usageLimit: "",
    userUsageLimit: "1",
    startDate: "",
    expirationDate: "",
    isActive: true,
  });

  const handleLogout = () => {
    logout();
    navigate("/admin-login");
  };

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError("");

      const [usersRes, restaurantsRes, ordersRes, couponsRes] =
        await Promise.all([
          userApi.list(token),
          adminApi.restaurants({ token, status: restaurantStatusFilter }),
          orderApi.getAll(token),
          adminApi.coupons({ token }),
        ]);

      setUsers(usersRes.data || []);
      setRestaurants(restaurantsRes.data || []);
      setOrders(ordersRes.data || []);
      setCoupons(couponsRes.data || []);
    } catch (err) {
      setError(err.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAll();
    }
  }, [token, restaurantStatusFilter]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const stats = useMemo(() => {
    const today = new Date().toDateString();
    const todayOrders = orders.filter(
      (order) => new Date(order.createdAt).toDateString() === today,
    );
    const todayRevenue = todayOrders.reduce(
      (sum, order) => sum + (order.totalPrice || 0),
      0,
    );

    return {
      totalUsers: users.length,
      totalRestaurants: restaurants.length,
      totalOrders: orders.length,
      todayRevenue,
      activeOrders: orders.filter(
        (order) => !["Delivered", "Cancelled"].includes(order.orderStatus),
      ).length,
      pendingApprovals: restaurants.filter(
        (restaurant) => restaurant.approvalStatus === "pending",
      ).length,
    };
  }, [users, restaurants, orders]);

  const filteredUsers = useMemo(() => {
    return users.filter((item) => {
      const term = searchQuery.toLowerCase();
      return (
        item.name?.toLowerCase().includes(term) ||
        item.email?.toLowerCase().includes(term)
      );
    });
  }, [users, searchQuery]);

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((item) => {
      const term = searchQuery.toLowerCase();
      return (
        item.name?.toLowerCase().includes(term) ||
        (item.owner?.name || "").toLowerCase().includes(term)
      );
    });
  }, [restaurants, searchQuery]);

  const filteredOrders = useMemo(() => {
    return orders.filter((item) => {
      const term = searchQuery.toLowerCase();
      return (
        item._id?.toLowerCase().includes(term) ||
        (item.user?.name || "").toLowerCase().includes(term)
      );
    });
  }, [orders, searchQuery]);

  const filteredCoupons = useMemo(() => {
    return coupons.filter((item) => {
      const term = searchQuery.toLowerCase();
      return (
        item.code?.toLowerCase().includes(term) ||
        item.description?.toLowerCase().includes(term)
      );
    });
  }, [coupons, searchQuery]);

  const navItems = [
    { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
    { id: "users", name: "Users", icon: Users },
    { id: "restaurants", name: "Restaurants", icon: Store },
    { id: "orders", name: "Orders", icon: ShoppingBag },
    { id: "coupons", name: "Coupons", icon: TicketPercent },
  ];

  const removeUser = async (id) => {
    try {
      await userApi.remove({ id, token });
      await fetchAll();
    } catch (err) {
      setError(err.message || "Failed to delete user");
    }
  };

  const addUser = async (e) => {
    e.preventDefault();
    try {
      setSubmittingUser(true);
      setError("");
      await adminApi.createUser({
        body: userForm,
        token,
      });
      setUserForm({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "user",
      });
      await fetchAll();
    } catch (err) {
      setError(err.message || "Failed to create user");
    } finally {
      setSubmittingUser(false);
    }
  };

  const addRestaurant = async (e) => {
    e.preventDefault();
    try {
      setSubmittingRestaurant(true);
      setError("");

      await adminApi.createRestaurant({
        token,
        body: {
          name: restaurantForm.name,
          description: restaurantForm.description,
          ownerId: restaurantForm.ownerId,
          phone: restaurantForm.phone,
          email: restaurantForm.email,
          cuisine: restaurantForm.cuisine,
          address: {
            street: restaurantForm.street,
            city: restaurantForm.city,
            state: restaurantForm.state,
            zipCode: restaurantForm.zipCode,
            country: restaurantForm.country,
          },
        },
      });

      setRestaurantForm({
        name: "",
        description: "",
        ownerId: "",
        phone: "",
        email: "",
        cuisine: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      });

      if (restaurantStatusFilter !== "approved") {
        setRestaurantStatusFilter("approved");
      }
      await fetchAll();
    } catch (err) {
      setError(err.message || "Failed to create restaurant");
    } finally {
      setSubmittingRestaurant(false);
    }
  };

  const ownerUsers = useMemo(
    () => users.filter((item) => item.role === "owner" && !item.isBlocked),
    [users],
  );

  const approveRestaurant = async (id) => {
    try {
      await adminApi.approveRestaurant({ id, token });
      await fetchAll();
    } catch (err) {
      setError(err.message || "Failed to approve restaurant");
    }
  };

  const rejectRestaurant = async (id) => {
    try {
      await adminApi.rejectRestaurant({
        id,
        reason: "Rejected by admin",
        token,
      });
      await fetchAll();
    } catch (err) {
      setError(err.message || "Failed to reject restaurant");
    }
  };

  const changeOrderStatus = async (id, orderStatus) => {
    try {
      await orderApi.updateStatus({
        id,
        body: { orderStatus },
        token,
      });
      await fetchAll();
    } catch (err) {
      setError(err.message || "Failed to update order status");
    }
  };

  const addCoupon = async (e) => {
    e.preventDefault();
    try {
      setSubmittingCoupon(true);
      setError("");

      await adminApi.createCoupon({
        token,
        body: {
          ...couponForm,
          code: couponForm.code.trim().toUpperCase(),
        },
      });

      setCouponForm({
        code: "",
        description: "",
        discountType: "percentage",
        discountValue: "",
        maxDiscount: "",
        minOrderAmount: "",
        usageLimit: "",
        userUsageLimit: "1",
        startDate: "",
        expirationDate: "",
        isActive: true,
      });

      await fetchAll();
    } catch (err) {
      setError(err.message || "Failed to create coupon");
    } finally {
      setSubmittingCoupon(false);
    }
  };

  const removeCoupon = async (id) => {
    try {
      await adminApi.deleteCoupon({ id, token });
      await fetchAll();
    } catch (err) {
      setError(err.message || "Failed to delete coupon");
    }
  };

  const toggleCouponStatus = async (coupon) => {
    try {
      await adminApi.updateCoupon({
        id: coupon._id,
        body: { isActive: !coupon.isActive },
        token,
      });
      await fetchAll();
    } catch (err) {
      setError(err.message || "Failed to update coupon status");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
        />
      )}

      <aside
        className={`bg-gray-900 text-white fixed lg:sticky left-0 top-0 h-screen transition-all duration-300 z-40 overflow-hidden ${
          sidebarOpen
            ? "w-64 translate-x-0"
            : "w-64 -translate-x-full lg:translate-x-0 lg:w-20"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <div
                className={`flex items-center gap-2 ${!sidebarOpen && "lg:hidden"}`}
              >
                <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                  <span className="font-bold">A</span>
                </div>
                {sidebarOpen && (
                  <span className="font-semibold">Admin Panel</span>
                )}
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? "bg-orange-600 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span>{item.name}</span>}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-800">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-600 hover:text-gray-900"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name || "Admin"}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0) || "A"}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-600">
              {error}
            </div>
          )}

          <div className="mb-6 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <button
              onClick={fetchAll}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-orange-500"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="text-gray-600">Loading admin data...</div>
          ) : (
            <>
              {activeTab === "dashboard" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <StatCard title="Total Users" value={stats.totalUsers} />
                  <StatCard
                    title="Total Restaurants"
                    value={stats.totalRestaurants}
                  />
                  <StatCard title="Total Orders" value={stats.totalOrders} />
                  <StatCard
                    title="Pending Approvals"
                    value={stats.pendingApprovals}
                  />
                  <StatCard
                    title="Today Revenue"
                    value={`₹${stats.todayRevenue}`}
                  />
                  <StatCard title="Active Orders" value={stats.activeOrders} />
                </div>
              )}

              {activeTab === "users" && (
                <>
                  <form
                    onSubmit={addUser}
                    noValidate
                    className="mb-5 bg-white rounded-lg border border-gray-200 p-4"
                  >
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">
                      Add User
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      <input
                        value={userForm.name}
                        onChange={(e) =>
                          setUserForm((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="Full name"
                        className="px-3 py-2 border rounded-lg"
                      />
                      <input
                        type="email"
                        value={userForm.email}
                        onChange={(e) =>
                          setUserForm((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        placeholder="Email"
                        className="px-3 py-2 border rounded-lg"
                      />
                      <div className="relative">
                        <input
                          type={showUserPassword ? "text" : "password"}
                          value={userForm.password}
                          onChange={(e) =>
                            setUserForm((prev) => ({
                              ...prev,
                              password: e.target.value,
                            }))
                          }
                          placeholder="Password"
                          className="w-full px-3 py-2 pr-10 border rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => setShowUserPassword((prev) => !prev)}
                          className="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-gray-700"
                          aria-label={
                            showUserPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showUserPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <input
                        value={userForm.phone}
                        onChange={(e) =>
                          setUserForm((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        placeholder="Phone"
                        className="px-3 py-2 border rounded-lg"
                      />
                      <select
                        value={userForm.role}
                        onChange={(e) =>
                          setUserForm((prev) => ({
                            ...prev,
                            role: e.target.value,
                          }))
                        }
                        className="px-3 py-2 border rounded-lg"
                      >
                        <option value="user">Customer</option>
                        <option value="owner">Owner</option>
                        <option value="admin">Admin</option>
                      </select>
                      <button
                        type="submit"
                        disabled={submittingUser}
                        className="px-4 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-60"
                      >
                        {submittingUser ? "Adding..." : "Add User"}
                      </button>
                    </div>
                  </form>

                  <DataTable
                    columns={["Name", "Email", "Role", "Joined", "Actions"]}
                    rows={filteredUsers.map((item) => (
                      <tr key={item._id} className="border-t">
                        <td className="px-4 py-3">{item.name}</td>
                        <td className="px-4 py-3">{item.email}</td>
                        <td className="px-4 py-3 capitalize">
                          {item.role === "user" ? "customer" : item.role}
                        </td>
                        <td className="px-4 py-3">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => removeUser(item._id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-red-600 border border-red-200 rounded hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  />
                </>
              )}

              {activeTab === "restaurants" && (
                <>
                  <form
                    onSubmit={addRestaurant}
                    noValidate
                    className="mb-5 bg-white rounded-lg border border-gray-200 p-4"
                  >
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">
                      Add Restaurant
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      <input
                        value={restaurantForm.name}
                        onChange={(e) =>
                          setRestaurantForm((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="Restaurant name"
                        className="px-3 py-2 border rounded-lg"
                      />
                      <input
                        type="email"
                        value={restaurantForm.email}
                        onChange={(e) =>
                          setRestaurantForm((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        placeholder="Restaurant email"
                        className="px-3 py-2 border rounded-lg"
                      />
                      <input
                        value={restaurantForm.phone}
                        onChange={(e) =>
                          setRestaurantForm((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        placeholder="Phone"
                        className="px-3 py-2 border rounded-lg"
                      />
                      <select
                        value={restaurantForm.ownerId}
                        onChange={(e) =>
                          setRestaurantForm((prev) => ({
                            ...prev,
                            ownerId: e.target.value,
                          }))
                        }
                        className="px-3 py-2 border rounded-lg"
                      >
                        <option value="">Select owner</option>
                        {ownerUsers.map((item) => (
                          <option key={item._id} value={item._id}>
                            {item.name} ({item.email})
                          </option>
                        ))}
                      </select>
                      <input
                        value={restaurantForm.cuisine}
                        onChange={(e) =>
                          setRestaurantForm((prev) => ({
                            ...prev,
                            cuisine: e.target.value,
                          }))
                        }
                        placeholder="Cuisine (comma separated)"
                        className="px-3 py-2 border rounded-lg"
                      />
                      <input
                        value={restaurantForm.street}
                        onChange={(e) =>
                          setRestaurantForm((prev) => ({
                            ...prev,
                            street: e.target.value,
                          }))
                        }
                        placeholder="Street"
                        className="px-3 py-2 border rounded-lg"
                      />
                      <input
                        value={restaurantForm.city}
                        onChange={(e) =>
                          setRestaurantForm((prev) => ({
                            ...prev,
                            city: e.target.value,
                          }))
                        }
                        placeholder="City"
                        className="px-3 py-2 border rounded-lg"
                      />
                      <input
                        value={restaurantForm.state}
                        onChange={(e) =>
                          setRestaurantForm((prev) => ({
                            ...prev,
                            state: e.target.value,
                          }))
                        }
                        placeholder="State"
                        className="px-3 py-2 border rounded-lg"
                      />
                      <input
                        value={restaurantForm.zipCode}
                        onChange={(e) =>
                          setRestaurantForm((prev) => ({
                            ...prev,
                            zipCode: e.target.value,
                          }))
                        }
                        placeholder="Zip Code"
                        className="px-3 py-2 border rounded-lg"
                      />
                      <input
                        value={restaurantForm.country}
                        onChange={(e) =>
                          setRestaurantForm((prev) => ({
                            ...prev,
                            country: e.target.value,
                          }))
                        }
                        placeholder="Country"
                        className="px-3 py-2 border rounded-lg"
                      />
                    </div>
                    <textarea
                      value={restaurantForm.description}
                      onChange={(e) =>
                        setRestaurantForm((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Restaurant description"
                      className="mt-3 w-full px-3 py-2 border rounded-lg"
                      rows={3}
                    />
                    <div className="mt-3">
                      <button
                        type="submit"
                        disabled={submittingRestaurant}
                        className="px-4 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-60"
                      >
                        {submittingRestaurant ? "Adding..." : "Add Restaurant"}
                      </button>
                    </div>
                  </form>

                  <div className="mb-4 flex items-center gap-3">
                    <label className="text-sm text-gray-600">Status</label>
                    <select
                      value={restaurantStatusFilter}
                      onChange={(e) =>
                        setRestaurantStatusFilter(e.target.value)
                      }
                      className="px-3 py-2 border rounded-lg"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  <DataTable
                    columns={[
                      "Name",
                      "Owner",
                      "Cuisine",
                      "Status",
                      "Rating",
                      "Actions",
                    ]}
                    rows={filteredRestaurants.map((item) => (
                      <tr key={item._id} className="border-t">
                        <td className="px-4 py-3">{item.name}</td>
                        <td className="px-4 py-3">
                          {item.owner?.name || "N/A"}
                        </td>
                        <td className="px-4 py-3">
                          {(item.cuisine || []).join(", ") || "N/A"}
                        </td>
                        <td className="px-4 py-3 capitalize">
                          {item.approvalStatus || "pending"}
                        </td>
                        <td className="px-4 py-3">{item.rating || 0}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {item.approvalStatus === "pending" && (
                              <>
                                <button
                                  onClick={() => approveRestaurant(item._id)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 text-green-700 border border-green-200 rounded hover:bg-green-50"
                                >
                                  <CheckCircle className="w-4 h-4" /> Approve
                                </button>
                                <button
                                  onClick={() => rejectRestaurant(item._id)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 text-red-600 border border-red-200 rounded hover:bg-red-50"
                                >
                                  <XCircle className="w-4 h-4" /> Reject
                                </button>
                              </>
                            )}
                            {item.approvalStatus !== "pending" && (
                              <span className="text-xs text-gray-500">
                                No action
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  />
                </>
              )}

              {activeTab === "orders" && (
                <DataTable
                  columns={["Order", "Customer", "Amount", "Status", "Actions"]}
                  rows={filteredOrders.map((item) => (
                    <tr key={item._id} className="border-t">
                      <td className="px-4 py-3">
                        #{item._id.slice(-8).toUpperCase()}
                      </td>
                      <td className="px-4 py-3">{item.user?.name || "N/A"}</td>
                      <td className="px-4 py-3">₹{item.totalPrice || 0}</td>
                      <td className="px-4 py-3">{item.orderStatus}</td>
                      <td className="px-4 py-3">
                        <select
                          value={item.orderStatus}
                          onChange={(e) =>
                            changeOrderStatus(item._id, e.target.value)
                          }
                          className="px-2 py-1 border rounded"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Preparing">Preparing</option>
                          <option value="Out for Delivery">
                            Out for Delivery
                          </option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                />
              )}

              {activeTab === "coupons" && (
                <>
                  <form
                    onSubmit={addCoupon}
                    noValidate
                    className="mb-5 bg-white rounded-lg border border-gray-200 p-4"
                  >
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">
                      Add Coupon / Discount
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      <input
                        value={couponForm.code}
                        onChange={(e) =>
                          setCouponForm((prev) => ({
                            ...prev,
                            code: e.target.value,
                          }))
                        }
                        placeholder="Code (e.g. WELCOME20)"
                        className="px-3 py-2 border rounded-lg"
                      />
                      <select
                        value={couponForm.discountType}
                        onChange={(e) =>
                          setCouponForm((prev) => ({
                            ...prev,
                            discountType: e.target.value,
                          }))
                        }
                        className="px-3 py-2 border rounded-lg"
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed (₹)</option>
                      </select>
                      <input
                        type="number"
                        value={couponForm.discountValue}
                        onChange={(e) =>
                          setCouponForm((prev) => ({
                            ...prev,
                            discountValue: e.target.value,
                          }))
                        }
                        placeholder="Discount value"
                        className="px-3 py-2 border rounded-lg"
                      />
                      <input
                        type="number"
                        value={couponForm.maxDiscount}
                        onChange={(e) =>
                          setCouponForm((prev) => ({
                            ...prev,
                            maxDiscount: e.target.value,
                          }))
                        }
                        placeholder="Max discount (optional)"
                        className="px-3 py-2 border rounded-lg"
                      />
                      <input
                        type="number"
                        value={couponForm.minOrderAmount}
                        onChange={(e) =>
                          setCouponForm((prev) => ({
                            ...prev,
                            minOrderAmount: e.target.value,
                          }))
                        }
                        placeholder="Min order amount"
                        className="px-3 py-2 border rounded-lg"
                      />
                      <input
                        type="number"
                        value={couponForm.usageLimit}
                        onChange={(e) =>
                          setCouponForm((prev) => ({
                            ...prev,
                            usageLimit: e.target.value,
                          }))
                        }
                        placeholder="Usage limit"
                        className="px-3 py-2 border rounded-lg"
                      />
                      <input
                        type="number"
                        value={couponForm.userUsageLimit}
                        onChange={(e) =>
                          setCouponForm((prev) => ({
                            ...prev,
                            userUsageLimit: e.target.value,
                          }))
                        }
                        placeholder="Per-user limit"
                        className="px-3 py-2 border rounded-lg"
                      />
                      <input
                        type="date"
                        value={couponForm.startDate}
                        onChange={(e) =>
                          setCouponForm((prev) => ({
                            ...prev,
                            startDate: e.target.value,
                          }))
                        }
                        className="px-3 py-2 border rounded-lg"
                      />
                      <input
                        type="date"
                        value={couponForm.expirationDate}
                        onChange={(e) =>
                          setCouponForm((prev) => ({
                            ...prev,
                            expirationDate: e.target.value,
                          }))
                        }
                        className="px-3 py-2 border rounded-lg"
                      />
                      <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                        <input
                          type="checkbox"
                          checked={couponForm.isActive}
                          onChange={(e) =>
                            setCouponForm((prev) => ({
                              ...prev,
                              isActive: e.target.checked,
                            }))
                          }
                        />
                        Active
                      </label>
                    </div>
                    <textarea
                      value={couponForm.description}
                      onChange={(e) =>
                        setCouponForm((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Description (optional)"
                      className="mt-3 w-full px-3 py-2 border rounded-lg"
                      rows={2}
                    />
                    <div className="mt-3">
                      <button
                        type="submit"
                        disabled={submittingCoupon}
                        className="px-4 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-60"
                      >
                        {submittingCoupon ? "Adding..." : "Add Coupon"}
                      </button>
                    </div>
                  </form>

                  <DataTable
                    columns={[
                      "Code",
                      "Type",
                      "Value",
                      "Validity",
                      "Usage",
                      "Status",
                      "Actions",
                    ]}
                    rows={filteredCoupons.map((item) => (
                      <tr key={item._id} className="border-t">
                        <td className="px-4 py-3 font-semibold">{item.code}</td>
                        <td className="px-4 py-3 capitalize">
                          {item.discountType}
                        </td>
                        <td className="px-4 py-3">
                          {item.discountType === "percentage"
                            ? `${item.discountValue}%`
                            : `₹${item.discountValue}`}
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-600">
                          {new Date(item.startDate).toLocaleDateString()} -{" "}
                          {new Date(item.expirationDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          {item.usedCount || 0}/{item.usageLimit || "∞"}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => toggleCouponStatus(item)}
                            className={`px-2 py-1 rounded text-xs ${
                              item.isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {item.isActive ? "Active" : "Inactive"}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => removeCoupon(item._id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-red-600 border border-red-200 rounded hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  />
                </>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-gray-600">{title}</h3>
        <TrendingUp className="w-5 h-5 text-green-600" />
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function DataTable({ columns, rows }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-x-auto">
      <table className="w-full min-w-[700px]">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}
