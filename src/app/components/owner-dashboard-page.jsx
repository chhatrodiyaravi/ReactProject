import {
  DollarSign,
  ShoppingBag,
  Plus,
  LogOut,
  Store,
  Edit,
  Trash2,
  Eye,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Menu as MenuIcon,
  Package,
  Users,
  Star,
  CreditCard,
  Calendar,
  LayoutDashboard,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export function OwnerDashboardPage() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [orderFilter, setOrderFilter] = useState("all");

  console.log("OwnerDashboardPage rendering, user:", user);

  const handleLogout = () => {
    logout();
    navigate("/owner-login");
  };

  // Enhanced dummy data
  const orders = [
    {
      id: 1,
      orderId: "ORD12345",
      customer: "John Doe",
      customerPhone: "+91 98765 43210",
      items: 3,
      total: 746,
      status: "Pending",
      time: "10:30 AM",
      date: "2026-02-23",
      paymentMethod: "Card",
      itemsList: ["Margherita Pizza", "Garlic Bread", "Coke"],
    },
    {
      id: 2,
      orderId: "ORD67890",
      customer: "Jane Smith",
      customerPhone: "+91 98765 43211",
      items: 2,
      total: 450,
      status: "Completed",
      time: "09:45 AM",
      date: "2026-02-23",
      paymentMethod: "UPI",
      itemsList: ["Pepperoni Pizza", "Caesar Salad"],
    },
    {
      id: 3,
      orderId: "ORD11223",
      customer: "Bob Wilson",
      customerPhone: "+91 98765 43212",
      items: 4,
      total: 890,
      status: "Preparing",
      time: "11:15 AM",
      date: "2026-02-23",
      paymentMethod: "Cash",
      itemsList: ["Veggie Supreme", "Chicken Wings", "Garlic Bread", "Pepsi"],
    },
    {
      id: 4,
      orderId: "ORD44556",
      customer: "Alice Brown",
      customerPhone: "+91 98765 43213",
      items: 1,
      total: 299,
      status: "Pending",
      time: "11:45 AM",
      date: "2026-02-23",
      paymentMethod: "Card",
      itemsList: ["Margherita Pizza"],
    },
    {
      id: 5,
      orderId: "ORD55667",
      customer: "Emma Davis",
      customerPhone: "+91 98765 43214",
      items: 5,
      total: 1250,
      status: "Delivered",
      time: "08:30 AM",
      date: "2026-02-23",
      paymentMethod: "UPI",
      itemsList: [
        "Pepperoni Pizza x2",
        "Chicken Wings",
        "Caesar Salad",
        "Garlic Bread",
      ],
    },
    {
      id: 6,
      orderId: "ORD66778",
      customer: "Michael Chen",
      customerPhone: "+91 98765 43215",
      items: 2,
      total: 550,
      status: "Cancelled",
      time: "07:20 AM",
      date: "2026-02-23",
      paymentMethod: "Card",
      itemsList: ["Veggie Supreme", "Coke"],
    },
  ];

  const stats = {
    totalOrders: 145,
    totalRevenue: 52340,
    pendingOrders: 8,
    menuItems: 24,
    todayOrders: 23,
    todayRevenue: 8450,
    avgOrderValue: 367,
    completionRate: 94,
    rating: 4.7,
    totalReviews: 328,
  };

  const menuItems = [
    {
      id: 1,
      name: "Margherita Pizza",
      category: "Pizza",
      price: 299,
      available: true,
      image: "🍕",
      orders: 156,
    },
    {
      id: 2,
      name: "Pepperoni Pizza",
      category: "Pizza",
      price: 399,
      available: true,
      image: "🍕",
      orders: 234,
    },
    {
      id: 3,
      name: "Veggie Supreme",
      category: "Pizza",
      price: 349,
      available: true,
      image: "🍕",
      orders: 189,
    },
    {
      id: 4,
      name: "Garlic Bread",
      category: "Sides",
      price: 149,
      available: true,
      image: "🥖",
      orders: 98,
    },
    {
      id: 5,
      name: "Chicken Wings",
      category: "Sides",
      price: 249,
      available: false,
      image: "🍗",
      orders: 67,
    },
    {
      id: 6,
      name: "Caesar Salad",
      category: "Salads",
      price: 199,
      available: true,
      image: "🥗",
      orders: 45,
    },
    {
      id: 7,
      name: "BBQ Chicken Pizza",
      category: "Pizza",
      price: 429,
      available: true,
      image: "🍕",
      orders: 123,
    },
    {
      id: 8,
      name: "Cheesy Breadsticks",
      category: "Sides",
      price: 179,
      available: true,
      image: "🥖",
      orders: 87,
    },
  ];

  const filteredOrders = orders.filter((order) => {
    if (orderFilter === "all") return true;
    return order.status.toLowerCase() === orderFilter.toLowerCase();
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                <Store className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {user?.restaurantName || "Pizza Palace"}
                </h1>
                <p className="text-sm text-gray-500">Restaurant Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link
                to="/add-food"
                className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Add Food Item</span>
                <span className="sm:hidden">Add Item</span>
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Tabs Navigation */}
        <div className="mb-6 sm:mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex gap-4 sm:gap-8 overflow-x-auto">
              <button
                onClick={() => setActiveTab("overview")}
                className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "overview"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <LayoutDashboard className="w-5 h-5 inline-block mr-2 mb-1" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "orders"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <ShoppingBag className="w-5 h-5 inline-block mr-2 mb-1" />
                Orders
              </button>
              <button
                onClick={() => setActiveTab("menu")}
                className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "menu"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <MenuIcon className="w-5 h-5 inline-block mr-2 mb-1" />
                Menu
              </button>
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <>
            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
              {/* Total Orders Card */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <TrendingUp className="w-5 h-5 opacity-80" />
                </div>
                <h3 className="text-sm font-medium opacity-90 mb-1">
                  Total Orders
                </h3>
                <p className="text-3xl font-bold mb-2">{stats.totalOrders}</p>
                <p className="text-xs opacity-80 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +12% from last month
                </p>
              </div>

              {/* Total Revenue Card */}
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <TrendingUp className="w-5 h-5 opacity-80" />
                </div>
                <h3 className="text-sm font-medium opacity-90 mb-1">
                  Total Revenue
                </h3>
                <p className="text-3xl font-bold mb-2">
                  ₹{stats.totalRevenue.toLocaleString()}
                </p>
                <p className="text-xs opacity-80 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +18% from last month
                </p>
              </div>

              {/* Menu Items Card */}
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <Package className="w-6 h-6" />
                  </div>
                  <MenuIcon className="w-5 h-5 opacity-80" />
                </div>
                <h3 className="text-sm font-medium opacity-90 mb-1">
                  Menu Items
                </h3>
                <p className="text-3xl font-bold mb-2">{stats.menuItems}</p>
                <p className="text-xs opacity-80">
                  {menuItems.filter((item) => item.available).length} available
                </p>
              </div>

              {/* Pending Orders Card */}
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <Clock className="w-6 h-6" />
                  </div>
                  <AlertCircle className="w-5 h-5 opacity-80" />
                </div>
                <h3 className="text-sm font-medium opacity-90 mb-1">
                  Pending Orders
                </h3>
                <p className="text-3xl font-bold mb-2">{stats.pendingOrders}</p>
                <p className="text-xs opacity-80">Need attention</p>
              </div>
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Today's Orders</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.todayOrders}
                    </p>
                  </div>
                  <Calendar className="w-8 h-8 text-blue-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      Today's Revenue
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      ₹{stats.todayRevenue}
                    </p>
                  </div>
                  <CreditCard className="w-8 h-8 text-green-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      Avg Order Value
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      ₹{stats.avgOrderValue}
                    </p>
                  </div>
                  <ShoppingBag className="w-8 h-8 text-purple-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-yellow-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Rating</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.rating} / 5
                    </p>
                  </div>
                  <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                </div>
              </div>
            </div>

            {/* Recent Orders Preview */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">
                  Recent Orders
                </h2>
                <button
                  onClick={() => setActiveTab("orders")}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View All
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">
                        Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.slice(0, 5).map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                          {order.orderId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.customer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                          {order.time}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          ₹{order.total}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              order.status === "Completed" ||
                              order.status === "Delivered"
                                ? "bg-green-100 text-green-800"
                                : order.status === "Preparing"
                                  ? "bg-blue-100 text-blue-800"
                                  : order.status === "Cancelled"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-orange-100 text-orange-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  All Orders
                </h2>
                <select
                  value={orderFilter}
                  onChange={(e) => setOrderFilter(e.target.value)}
                  className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Orders</option>
                  <option value="pending">Pending</option>
                  <option value="preparing">Preparing</option>
                  <option value="completed">Completed</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Order ID
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Customer
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">
                      Phone
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Items
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">
                      Time
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Total
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                        {order.orderId}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {order.customer}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                        {order.customerPhone}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.items}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                        {order.time}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        ₹{order.total}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            order.status === "Completed" ||
                            order.status === "Delivered"
                              ? "bg-green-100 text-green-800"
                              : order.status === "Preparing"
                                ? "bg-blue-100 text-blue-800"
                                : order.status === "Cancelled"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                        <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span className="hidden lg:inline">View</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredOrders.length === 0 && (
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No orders found</p>
              </div>
            )}
          </div>
        )}

        {/* Menu Items Tab */}
        {activeTab === "menu" && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                Menu Items
              </h2>
              <Link
                to="/add-food"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Item
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Category
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Price
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">
                      Orders
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {menuItems.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{item.image}</div>
                          <div className="text-sm font-medium text-gray-900">
                            {item.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.category}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        ₹{item.price}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                        {item.orders} orders
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <button
                          className={`px-3 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full transition-colors ${
                            item.available
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-red-100 text-red-800 hover:bg-red-200"
                          }`}
                        >
                          {item.available ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <XCircle className="w-3 h-3" />
                          )}
                          {item.available ? "Available" : "Unavailable"}
                        </button>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
                            <Edit className="w-4 h-4" />
                            <span className="hidden lg:inline">Edit</span>
                          </button>
                          <button className="text-red-600 hover:text-red-800 font-medium flex items-center gap-1">
                            <Trash2 className="w-4 h-4" />
                            <span className="hidden lg:inline">Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
