import {
  LayoutDashboard,
  Users,
  Store,
  ShoppingBag,
  Settings,
  LogOut,
  CheckCircle,
  XCircle,
  TrendingUp,
  Menu,
  X,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Ban,
  UserCheck,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function NewAdminDashboard() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const handleLogout = () => {
    logout();
    navigate("/admin-login");
  };

  const stats = {
    totalUsers: 1245,
    totalRestaurants: 89,
    totalOrders: 5678,
    pendingApprovals: 3,
    todayRevenue: 45230,
    activeOrders: 45,
  };

  const pendingRestaurants = [
    {
      id: 1,
      name: "Tandoori Nights",
      owner: "Raj Kumar",
      location: "Delhi",
      date: "2026-01-26",
    },
    {
      id: 2,
      name: "Sushi Bar",
      owner: "Yuki Tanaka",
      location: "Mumbai",
      date: "2026-01-25",
    },
    {
      id: 3,
      name: "Mexican Fiesta",
      owner: "Carlos Rodriguez",
      location: "Bangalore",
      date: "2026-01-24",
    },
  ];

  const recentOrders = [
    {
      id: 1,
      orderId: "ORD123",
      customer: "John Doe",
      amount: 450,
      status: "Completed",
    },
    {
      id: 2,
      orderId: "ORD124",
      customer: "Jane Smith",
      amount: 680,
      status: "Processing",
    },
    {
      id: 3,
      orderId: "ORD125",
      customer: "Bob Wilson",
      amount: 320,
      status: "Completed",
    },
  ];

  // Users data
  const allUsers = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "+91 98765 43210",
      joinDate: "2025-11-15",
      orders: 24,
      totalSpent: 5430,
      status: "Active",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+91 98765 43211",
      joinDate: "2025-10-20",
      orders: 18,
      totalSpent: 4120,
      status: "Active",
    },
    {
      id: 3,
      name: "Bob Wilson",
      email: "bob@example.com",
      phone: "+91 98765 43212",
      joinDate: "2025-12-01",
      orders: 32,
      totalSpent: 8900,
      status: "Active",
    },
    {
      id: 4,
      name: "Alice Brown",
      email: "alice@example.com",
      phone: "+91 98765 43213",
      joinDate: "2025-09-10",
      orders: 45,
      totalSpent: 12340,
      status: "Active",
    },
    {
      id: 5,
      name: "Charlie Davis",
      email: "charlie@example.com",
      phone: "+91 98765 43214",
      joinDate: "2026-01-05",
      orders: 8,
      totalSpent: 2100,
      status: "Inactive",
    },
    {
      id: 6,
      name: "Emma Garcia",
      email: "emma@example.com",
      phone: "+91 98765 43215",
      joinDate: "2025-11-28",
      orders: 28,
      totalSpent: 6780,
      status: "Active",
    },
    {
      id: 7,
      name: "Frank Miller",
      email: "frank@example.com",
      phone: "+91 98765 43216",
      joinDate: "2025-12-15",
      orders: 12,
      totalSpent: 3450,
      status: "Banned",
    },
    {
      id: 8,
      name: "Grace Lee",
      email: "grace@example.com",
      phone: "+91 98765 43217",
      joinDate: "2025-10-05",
      orders: 56,
      totalSpent: 15600,
      status: "Active",
    },
  ];

  // Restaurants data
  const allRestaurants = [
    {
      id: 1,
      name: "Pizza Palace",
      owner: "Mike Johnson",
      location: "Mumbai",
      cuisine: "Italian",
      rating: 4.5,
      orders: 234,
      revenue: 45600,
      status: "Active",
      joinDate: "2024-05-10",
    },
    {
      id: 2,
      name: "Burger Hub",
      owner: "Sarah Williams",
      location: "Delhi",
      cuisine: "American",
      rating: 4.2,
      orders: 189,
      revenue: 38900,
      status: "Active",
      joinDate: "2024-06-15",
    },
    {
      id: 3,
      name: "Biryani House",
      owner: "Arun Kumar",
      location: "Hyderabad",
      cuisine: "Indian",
      rating: 4.8,
      orders: 456,
      revenue: 89000,
      status: "Active",
      joinDate: "2024-03-20",
    },
    {
      id: 4,
      name: "Sushi World",
      owner: "Kenji Tanaka",
      location: "Bangalore",
      cuisine: "Japanese",
      rating: 4.6,
      orders: 178,
      revenue: 42300,
      status: "Active",
      joinDate: "2024-07-01",
    },
    {
      id: 5,
      name: "Taco Fiesta",
      owner: "Carlos Rodriguez",
      location: "Pune",
      cuisine: "Mexican",
      rating: 4.3,
      orders: 145,
      revenue: 34500,
      status: "Inactive",
      joinDate: "2024-08-12",
    },
    {
      id: 6,
      name: "Noodle Paradise",
      owner: "Li Wei",
      location: "Chennai",
      cuisine: "Chinese",
      rating: 4.4,
      orders: 223,
      revenue: 51200,
      status: "Active",
      joinDate: "2024-04-18",
    },
    {
      id: 7,
      name: "Cafe Mocha",
      owner: "Emma Watson",
      location: "Mumbai",
      cuisine: "Cafe",
      rating: 4.1,
      orders: 98,
      revenue: 23400,
      status: "Suspended",
      joinDate: "2024-09-05",
    },
    {
      id: 8,
      name: "Dosa Corner",
      owner: "Priya Sharma",
      location: "Bangalore",
      cuisine: "South Indian",
      rating: 4.7,
      orders: 567,
      revenue: 78900,
      status: "Active",
      joinDate: "2024-02-28",
    },
  ];

  // Orders data
  const allOrders = [
    {
      id: 1,
      orderId: "ORD12345",
      customer: "John Doe",
      restaurant: "Pizza Palace",
      items: 3,
      amount: 745,
      date: "2026-02-11",
      time: "14:30",
      status: "Delivered",
      paymentMethod: "Card",
    },
    {
      id: 2,
      orderId: "ORD12346",
      customer: "Jane Smith",
      restaurant: "Burger Hub",
      items: 2,
      amount: 450,
      date: "2026-02-11",
      time: "13:15",
      status: "Processing",
      paymentMethod: "UPI",
    },
    {
      id: 3,
      orderId: "ORD12347",
      customer: "Bob Wilson",
      restaurant: "Biryani House",
      items: 4,
      amount: 890,
      date: "2026-02-11",
      time: "12:45",
      status: "Preparing",
      paymentMethod: "Cash",
    },
    {
      id: 4,
      orderId: "ORD12348",
      customer: "Alice Brown",
      restaurant: "Sushi World",
      items: 5,
      amount: 1200,
      date: "2026-02-11",
      time: "11:20",
      status: "Delivered",
      paymentMethod: "Card",
    },
    {
      id: 5,
      orderId: "ORD12349",
      customer: "Charlie Davis",
      restaurant: "Taco Fiesta",
      items: 2,
      amount: 380,
      date: "2026-02-10",
      time: "19:50",
      status: "Cancelled",
      paymentMethod: "UPI",
    },
    {
      id: 6,
      orderId: "ORD12350",
      customer: "Emma Garcia",
      restaurant: "Noodle Paradise",
      items: 3,
      amount: 620,
      date: "2026-02-10",
      time: "18:30",
      status: "Delivered",
      paymentMethod: "Card",
    },
    {
      id: 7,
      orderId: "ORD12351",
      customer: "Frank Miller",
      restaurant: "Cafe Mocha",
      items: 1,
      amount: 250,
      date: "2026-02-10",
      time: "16:15",
      status: "Delivered",
      paymentMethod: "Cash",
    },
    {
      id: 8,
      orderId: "ORD12352",
      customer: "Grace Lee",
      restaurant: "Dosa Corner",
      items: 6,
      amount: 780,
      date: "2026-02-10",
      time: "15:00",
      status: "Processing",
      paymentMethod: "UPI",
    },
  ];

  const navItems = [
    { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
    { id: "users", name: "Users", icon: Users },
    { id: "restaurants", name: "Restaurants", icon: Store },
    { id: "orders", name: "Orders", icon: ShoppingBag },
    { id: "settings", name: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`bg-gray-900 text-white fixed lg:sticky top-0 h-screen transition-all duration-300 z-40 ${
          sidebarOpen ? "w-64" : "w-0 lg:w-20"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
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
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Navigation */}
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

          {/* Logout */}
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
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
                  {user?.name || "Admin User"}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.email || "admin@foodhub.com"}
                </p>
              </div>
              <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0) || "A"}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-y-auto">
          {activeTab === "dashboard" && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-600">Total Users</h3>
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-2">
                    {stats.totalUsers}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span>+12% from last month</span>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-600">Total Restaurants</h3>
                    <Store className="w-8 h-8 text-orange-600" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-2">
                    {stats.totalRestaurants}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span>+5 this week</span>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-600">Total Orders</h3>
                    <ShoppingBag className="w-8 h-8 text-purple-600" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-2">
                    {stats.totalOrders}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span>+156 today</span>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-600">Pending Approvals</h3>
                    <CheckCircle className="w-8 h-8 text-yellow-600" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-2">
                    {stats.pendingApprovals}
                  </p>
                  <p className="text-sm text-gray-500">Need attention</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-600">Today's Revenue</h3>
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-2">
                    ₹{stats.todayRevenue}
                  </p>
                  <p className="text-sm text-gray-500">
                    From {stats.activeOrders} orders
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-600">Active Orders</h3>
                    <ShoppingBag className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-2">
                    {stats.activeOrders}
                  </p>
                  <p className="text-sm text-gray-500">Currently processing</p>
                </div>
              </div>

              {/* Pending Restaurants */}
              <div className="bg-white rounded-lg shadow-md mb-8">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Pending Restaurant Approvals
                  </h2>
                  <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                    {pendingRestaurants.length} Pending
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Restaurant
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Owner
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Location
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Applied On
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {pendingRestaurants.map((restaurant) => (
                        <tr key={restaurant.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-orange-200 to-orange-400 rounded-lg flex-shrink-0"></div>
                              <span className="font-medium text-gray-900">
                                {restaurant.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-900">
                            {restaurant.owner}
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {restaurant.location}
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {restaurant.date}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center gap-1">
                                <CheckCircle className="w-4 h-4" />
                                Approve
                              </button>
                              <button className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm flex items-center gap-1">
                                <XCircle className="w-4 h-4" />
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-lg shadow-md">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Recent Orders
                  </h2>
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-900">
                            {order.orderId}
                          </td>
                          <td className="px-6 py-4 text-gray-900">
                            {order.customer}
                          </td>
                          <td className="px-6 py-4 text-gray-900">
                            ₹{order.amount}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                order.status === "Completed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-blue-100 text-blue-800"
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

          {activeTab === "users" && (
            <>
              {/* Users Table */}
              <div className="bg-white rounded-lg shadow-md">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">Users</h2>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    <button className="px-3 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300">
                      <Search className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Phone
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Join Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Orders
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Total Spent
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {allUsers
                        .filter((user) =>
                          user.name
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()),
                        )
                        .filter((user) => {
                          if (filterStatus === "all") return true;
                          return (
                            user.status.toLowerCase() ===
                            filterStatus.toLowerCase()
                          );
                        })
                        .slice(
                          (currentPage - 1) * itemsPerPage,
                          currentPage * itemsPerPage,
                        )
                        .map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900">
                              {user.name}
                            </td>
                            <td className="px-6 py-4 text-gray-900">
                              {user.email}
                            </td>
                            <td className="px-6 py-4 text-gray-900">
                              {user.phone}
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              {user.joinDate}
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              {user.orders}
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              ₹{user.totalSpent}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  user.status === "Active"
                                    ? "bg-green-100 text-green-800"
                                    : user.status === "Inactive"
                                      ? "bg-gray-100 text-gray-800"
                                      : "bg-red-100 text-red-800"
                                }`}
                              >
                                {user.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <button className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center gap-1">
                                  <Edit className="w-4 h-4" />
                                  Edit
                                </button>
                                <button className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm flex items-center gap-1">
                                  <Trash2 className="w-4 h-4" />
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-gray-500">
                      Page {currentPage} of{" "}
                      {Math.ceil(allUsers.length / itemsPerPage)}
                    </span>
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={
                        currentPage ===
                        Math.ceil(allUsers.length / itemsPerPage)
                      }
                      className="px-3 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-gray-500">Filter by Status:</label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    >
                      <option value="all">All</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="banned">Banned</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "restaurants" && (
            <>
              {/* Restaurants Table */}
              <div className="bg-white rounded-lg shadow-md">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Restaurants
                  </h2>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Search restaurants..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    <button className="px-3 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300">
                      <Search className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Owner
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Location
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Cuisine
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Rating
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Orders
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Revenue
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {allRestaurants
                        .filter((restaurant) =>
                          restaurant.name
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()),
                        )
                        .filter((restaurant) => {
                          if (filterStatus === "all") return true;
                          return (
                            restaurant.status.toLowerCase() ===
                            filterStatus.toLowerCase()
                          );
                        })
                        .slice(
                          (currentPage - 1) * itemsPerPage,
                          currentPage * itemsPerPage,
                        )
                        .map((restaurant) => (
                          <tr key={restaurant.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900">
                              {restaurant.name}
                            </td>
                            <td className="px-6 py-4 text-gray-900">
                              {restaurant.owner}
                            </td>
                            <td className="px-6 py-4 text-gray-900">
                              {restaurant.location}
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              {restaurant.cuisine}
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              {restaurant.rating}
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              {restaurant.orders}
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              ₹{restaurant.revenue}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  restaurant.status === "Active"
                                    ? "bg-green-100 text-green-800"
                                    : restaurant.status === "Inactive"
                                      ? "bg-gray-100 text-gray-800"
                                      : "bg-red-100 text-red-800"
                                }`}
                              >
                                {restaurant.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <button className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center gap-1">
                                  <Edit className="w-4 h-4" />
                                  Edit
                                </button>
                                <button className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm flex items-center gap-1">
                                  <Trash2 className="w-4 h-4" />
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-gray-500">
                      Page {currentPage} of{" "}
                      {Math.ceil(allRestaurants.length / itemsPerPage)}
                    </span>
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={
                        currentPage ===
                        Math.ceil(allRestaurants.length / itemsPerPage)
                      }
                      className="px-3 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-gray-500">Filter by Status:</label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    >
                      <option value="all">All</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="banned">Banned</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "orders" && (
            <>
              {/* Orders Table */}
              <div className="bg-white rounded-lg shadow-md">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Orders
                  </h2>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Search orders..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    <button className="px-3 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300">
                      <Search className="w-4 h-4" />
                    </button>
                  </div>
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Restaurant
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Items
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Payment Method
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {allOrders
                        .filter((order) =>
                          order.orderId
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()),
                        )
                        .filter((order) => {
                          if (filterStatus === "all") return true;
                          return (
                            order.status.toLowerCase() ===
                            filterStatus.toLowerCase()
                          );
                        })
                        .slice(
                          (currentPage - 1) * itemsPerPage,
                          currentPage * itemsPerPage,
                        )
                        .map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900">
                              {order.orderId}
                            </td>
                            <td className="px-6 py-4 text-gray-900">
                              {order.customer}
                            </td>
                            <td className="px-6 py-4 text-gray-900">
                              {order.restaurant}
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              {order.items}
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              ₹{order.amount}
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              {order.date}
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              {order.time}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  order.status === "Delivered"
                                    ? "bg-green-100 text-green-800"
                                    : order.status === "Processing"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-red-100 text-red-800"
                                }`}
                              >
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              {order.paymentMethod}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <button className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center gap-1">
                                  <Edit className="w-4 h-4" />
                                  Edit
                                </button>
                                <button className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm flex items-center gap-1">
                                  <Trash2 className="w-4 h-4" />
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-gray-500">
                      Page {currentPage} of{" "}
                      {Math.ceil(allOrders.length / itemsPerPage)}
                    </span>
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={
                        currentPage ===
                        Math.ceil(allOrders.length / itemsPerPage)
                      }
                      className="px-3 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-gray-500">Filter by Status:</label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    >
                      <option value="all">All</option>
                      <option value="delivered">Delivered</option>
                      <option value="processing">Processing</option>
                      <option value="preparing">Preparing</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "settings" && (
            <>
              {/* Settings Section */}
              <div className="max-w-4xl space-y-6">
                {/* General Settings */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    General Settings
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Platform Name
                      </label>
                      <input
                        type="text"
                        defaultValue="FoodHub"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Support Email
                      </label>
                      <input
                        type="email"
                        defaultValue="support@foodhub.com"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Support Phone
                      </label>
                      <input
                        type="tel"
                        defaultValue="+91 1800 123 4567"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Save Changes
                    </button>
                  </div>
                </div>

                {/* Commission Settings */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Commission Settings
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Platform Commission (%)
                      </label>
                      <input
                        type="number"
                        defaultValue="15"
                        min="0"
                        max="100"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Fee (₹)
                      </label>
                      <input
                        type="number"
                        defaultValue="40"
                        min="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Order Value (₹)
                      </label>
                      <input
                        type="number"
                        defaultValue="100"
                        min="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Save Changes
                    </button>
                  </div>
                </div>

                {/* Notification Settings */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Notification Settings
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Email Notifications
                        </h3>
                        <p className="text-sm text-gray-500">
                          Receive email notifications for new orders
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          defaultChecked
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          SMS Notifications
                        </h3>
                        <p className="text-sm text-gray-500">
                          Receive SMS notifications for critical alerts
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          defaultChecked
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Push Notifications
                        </h3>
                        <p className="text-sm text-gray-500">
                          Receive push notifications on mobile app
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Security Settings */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Security Settings
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        placeholder="Enter current password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        placeholder="Enter new password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Update Password
                    </button>
                  </div>
                </div>

                {/* System Maintenance */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    System Maintenance
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Maintenance Mode
                        </h3>
                        <p className="text-sm text-gray-500">
                          Put the platform in maintenance mode
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Accept New Orders
                        </h3>
                        <p className="text-sm text-gray-500">
                          Allow restaurants to accept new orders
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          defaultChecked
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          New Restaurant Registrations
                        </h3>
                        <p className="text-sm text-gray-500">
                          Allow new restaurants to register
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          defaultChecked
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-white rounded-lg shadow-md p-6 border-2 border-red-200">
                  <h2 className="text-lg font-semibold text-red-600 mb-4">
                    Danger Zone
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Clear All Cache
                        </h3>
                        <p className="text-sm text-gray-500">
                          Clear all cached data from the system
                        </p>
                      </div>
                      <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
                        Clear Cache
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Export All Data
                        </h3>
                        <p className="text-sm text-gray-500">
                          Download all platform data
                        </p>
                      </div>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Export Data
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Reset All Settings
                        </h3>
                        <p className="text-sm text-gray-500">
                          Reset all settings to default values
                        </p>
                      </div>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                        Reset Settings
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
