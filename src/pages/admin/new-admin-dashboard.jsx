import {
  LayoutDashboard,
  Users,
  Store,
  ShoppingBag,
  LogOut,
  TrendingUp,
  Menu,
  Search,
  Trash2,
  RefreshCw,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { adminApi, orderApi, userApi } from "../../services/api";

export function NewAdminDashboard() {
  const navigate = useNavigate();
  const { logout, user, token } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [restaurantStatusFilter, setRestaurantStatusFilter] =
    useState("pending");

  const [users, setUsers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/admin-login");
  };

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError("");

      const [usersRes, restaurantsRes, ordersRes] = await Promise.all([
        userApi.list(token),
        adminApi.restaurants({ token, status: restaurantStatusFilter }),
        orderApi.getAll(token),
      ]);

      setUsers(usersRes.data || []);
      setRestaurants(restaurantsRes.data || []);
      setOrders(ordersRes.data || []);
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

  const navItems = [
    { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
    { id: "users", name: "Users", icon: Users },
    { id: "restaurants", name: "Restaurants", icon: Store },
    { id: "orders", name: "Orders", icon: ShoppingBag },
  ];

  const removeUser = async (id) => {
    try {
      await userApi.remove({ id, token });
      await fetchAll();
    } catch (err) {
      setError(err.message || "Failed to delete user");
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside
        className={`bg-gray-900 text-white fixed lg:sticky top-0 h-screen transition-all duration-300 z-40 ${
          sidebarOpen ? "w-64" : "w-0 lg:w-20"
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
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-600 hover:text-gray-900"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
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

        <main className="flex-1 p-6 overflow-y-auto">
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
              )}

              {activeTab === "restaurants" && (
                <>
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

