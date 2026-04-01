import {
  DollarSign,
  ShoppingBag,
  Plus,
  LogOut,
  Store,
  Edit,
  Trash2,
  Clock,
  AlertCircle,
  Menu as MenuIcon,
  Package,
  Star,
  LayoutDashboard,
  RefreshCw,
  Settings,
  TicketPercent,
  Upload,
  Save,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { foodApi, orderApi, ownerApi, restaurantApi } from "../../services/api";

// Helper function to get full image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http")) return imagePath;
  const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  return `${apiBaseUrl}${imagePath}`;
};

export function OwnerDashboardPage() {
  const navigate = useNavigate();
  const { logout, user, token } = useAuth();
  const maxImageSize = 5 * 1024 * 1024;
  const [activeTab, setActiveTab] = useState("overview");
  const [orderFilter, setOrderFilter] = useState("all");
  const [isEditingRestaurant, setIsEditingRestaurant] = useState(false);
  const [restaurantData, setRestaurantData] = useState(null);
  const [updatingRestaurant, setUpdatingRestaurant] = useState(false);
  const [restaurantImg, setRestaurantImg] = useState(null);
  const [restaurantFieldErrors, setRestaurantFieldErrors] = useState({});

  const [restaurants, setRestaurants] = useState([]);
  const [foods, setFoods] = useState([]);
  const [menuRestaurantFilter, setMenuRestaurantFilter] = useState("all");
  const [menuCategoryFilter, setMenuCategoryFilter] = useState("all");
  const [orders, setOrders] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [ownerOrderRows, setOwnerOrderRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submittingCoupon, setSubmittingCoupon] = useState(false);

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
    navigate("/owner-login");
  };

  const fetchOwnerData = async () => {
    try {
      setLoading(true);
      setError("");

      const [restaurantsRes, couponsRes] = await Promise.all([
        restaurantApi.list({
          owner: user?._id,
          includeInactive: true,
        }),
        ownerApi.coupons(token),
      ]);
      const ownerRestaurants = restaurantsRes.data || [];
      setRestaurants(ownerRestaurants);
      setCoupons(couponsRes.data || []);

      const restaurantIds = ownerRestaurants.map(
        (restaurant) => restaurant._id,
      );
      const restaurantIdSet = new Set(restaurantIds.map((id) => String(id)));

      const foodsResults = await Promise.all(
        restaurantIds.map((restaurantId) =>
          foodApi.list({ restaurant: restaurantId }),
        ),
      );
      setFoods(foodsResults.flatMap((res) => res.data || []));

      const ordersRes = await orderApi.getAll(token);
      const ownerOrders = (ordersRes.data || []).filter((order) => {
        return (order.orderItems || []).some((item) => {
          const restaurantId =
            typeof item.restaurant === "object"
              ? item.restaurant?._id
              : item.restaurant;
          return restaurantIdSet.has(String(restaurantId));
        });
      });

      const ownerRows = ownerOrders.map((order) => {
        const ownerItems = (order.orderItems || []).filter((item) => {
          const restaurantId =
            typeof item.restaurant === "object"
              ? item.restaurant?._id
              : item.restaurant;
          return restaurantIdSet.has(String(restaurantId));
        });

        const ownerAmount = ownerItems.reduce(
          (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
          0,
        );

        return {
          ...order,
          ownerItems,
          ownerAmount,
        };
      });
      setOrders(ownerOrders);
      setOwnerOrderRows(ownerRows);
    } catch (err) {
      setError(err.message || "Failed to load owner dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && user?._id) {
      fetchOwnerData();
    }
  }, [token, user?._id]);

  const stats = useMemo(() => {
    const pendingOrders = ownerOrderRows.filter(
      (order) => order.orderStatus === "Pending",
    ).length;
    const totalRevenue = ownerOrderRows
      .filter((order) => order.orderStatus === "Delivered")
      .reduce((sum, order) => sum + (order.ownerAmount || 0), 0);

    const today = new Date().toDateString();
    const todayOrders = ownerOrderRows.filter(
      (order) => new Date(order.createdAt).toDateString() === today,
    );
    const todayRevenue = todayOrders.reduce(
      (sum, order) => sum + (order.ownerAmount || 0),
      0,
    );

    const avgOrderValue = ownerOrderRows.length
      ? Math.round(totalRevenue / ownerOrderRows.length)
      : 0;
    const completedCount = ownerOrderRows.filter(
      (order) => order.orderStatus === "Delivered",
    ).length;
    const completionRate = ownerOrderRows.length
      ? Math.round((completedCount / ownerOrderRows.length) * 100)
      : 0;

    return {
      totalOrders: ownerOrderRows.length,
      totalRevenue,
      pendingOrders,
      menuItems: foods.length,
      todayOrders: todayOrders.length,
      todayRevenue,
      avgOrderValue,
      completionRate,
      rating: restaurants[0]?.rating || 0,
      totalReviews: restaurants[0]?.totalReviews || 0,
    };
  }, [ownerOrderRows, foods.length, restaurants]);

  const filteredOrders = useMemo(() => {
    if (orderFilter === "all") {
      return ownerOrderRows;
    }
    return ownerOrderRows.filter(
      (order) => order.orderStatus.toLowerCase() === orderFilter.toLowerCase(),
    );
  }, [ownerOrderRows, orderFilter]);

  const filteredMenuFoods = useMemo(() => {
    return foods.filter((food) => {
      const restaurantId =
        typeof food.restaurant === "object"
          ? food.restaurant?._id
          : food.restaurant;

      const matchesRestaurant =
        menuRestaurantFilter === "all" ||
        String(restaurantId) === String(menuRestaurantFilter);
      const matchesCategory =
        menuCategoryFilter === "all" || food.category === menuCategoryFilter;

      return matchesRestaurant && matchesCategory;
    });
  }, [foods, menuRestaurantFilter, menuCategoryFilter]);

  const menuCategoryOptions = useMemo(() => {
    const categorySet = new Set();

    foods.forEach((food) => {
      const restaurantId =
        typeof food.restaurant === "object"
          ? food.restaurant?._id
          : food.restaurant;
      const includeForSelectedRestaurant =
        menuRestaurantFilter === "all" ||
        String(restaurantId) === String(menuRestaurantFilter);

      if (includeForSelectedRestaurant && food.category) {
        categorySet.add(food.category);
      }
    });

    return [
      "all",
      ...Array.from(categorySet).sort((a, b) => a.localeCompare(b)),
    ];
  }, [foods, menuRestaurantFilter]);

  useEffect(() => {
    if (
      menuCategoryFilter !== "all" &&
      !menuCategoryOptions.includes(menuCategoryFilter)
    ) {
      setMenuCategoryFilter("all");
    }
  }, [menuCategoryFilter, menuCategoryOptions]);

  const changeOrderStatus = async (orderId, orderStatus) => {
    try {
      await orderApi.updateStatus({
        id: orderId,
        body: { orderStatus },
        token,
      });
      await fetchOwnerData();
    } catch (err) {
      setError(err.message || "Failed to update order status");
    }
  };

  const deleteFood = async (foodId) => {
    try {
      await foodApi.remove({ id: foodId, token });
      await fetchOwnerData();
    } catch (err) {
      setError(err.message || "Failed to delete food item");
    }
  };

  const addCoupon = async (e) => {
    e.preventDefault();
    try {
      setSubmittingCoupon(true);
      setError("");
      setSuccess("");

      await ownerApi.createCoupon({
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

      setSuccess("Coupon added successfully!");
      await fetchOwnerData();
    } catch (err) {
      setError(err.message || "Failed to create coupon");
    } finally {
      setSubmittingCoupon(false);
    }
  };

  const removeCoupon = async (couponId) => {
    try {
      setError("");
      await ownerApi.deleteCoupon({ id: couponId, token });
      setSuccess("Coupon deleted successfully!");
      await fetchOwnerData();
    } catch (err) {
      setError(err.message || "Failed to delete coupon");
    }
  };

  const toggleCouponStatus = async (coupon) => {
    try {
      setError("");
      await ownerApi.updateCoupon({
        id: coupon._id,
        token,
        body: { isActive: !coupon.isActive },
      });
      await fetchOwnerData();
    } catch (err) {
      setError(err.message || "Failed to update coupon");
    }
  };

  const handleEditRestaurant = () => {
    setRestaurantData({ ...restaurants[0] });
    setRestaurantImg(null);
    setRestaurantFieldErrors({});
    setIsEditingRestaurant(true);
  };

  const updateRestaurantField = (field, value) => {
    setRestaurantData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setRestaurantFieldErrors((prev) => {
      if (!prev[field]) {
        return prev;
      }

      const nextErrors = { ...prev };
      delete nextErrors[field];
      return nextErrors;
    });
  };

  const validateRestaurantData = () => {
    const nextErrors = {};
    const trimmedName = restaurantData?.name?.trim() || "";
    const trimmedEmail = restaurantData?.email?.trim() || "";
    const trimmedPhone = restaurantData?.phone?.trim() || "";
    const trimmedDescription = restaurantData?.description?.trim() || "";
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneDigits = trimmedPhone.replace(/\D/g, "");

    if (!trimmedName) {
      nextErrors.name = "Restaurant name is required.";
    } else if (trimmedName.length < 2) {
      nextErrors.name = "Restaurant name must be at least 2 characters.";
    } else if (trimmedName.length > 100) {
      nextErrors.name = "Restaurant name must be 100 characters or fewer.";
    }

    if (!trimmedEmail) {
      nextErrors.email = "Email is required.";
    } else if (!emailPattern.test(trimmedEmail)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!trimmedPhone) {
      nextErrors.phone = "Phone number is required.";
    } else if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      nextErrors.phone = "Phone number must contain 10 to 15 digits.";
    }

    if (!trimmedDescription) {
      nextErrors.description = "Description is required.";
    } else if (trimmedDescription.length < 10) {
      nextErrors.description = "Description must be at least 10 characters.";
    } else if (trimmedDescription.length > 500) {
      nextErrors.description = "Description must be 500 characters or fewer.";
    }

    if (restaurantImg) {
      if (!restaurantImg.type.startsWith("image/")) {
        nextErrors.image = "Please upload a valid image file.";
      } else if (restaurantImg.size > maxImageSize) {
        nextErrors.image = "Image size must be 5MB or less.";
      }
    }

    return nextErrors;
  };

  const handleSaveRestaurant = async () => {
    if (!restaurantData || !restaurants[0]) return;

    const nextErrors = validateRestaurantData();
    if (Object.keys(nextErrors).length > 0) {
      setRestaurantFieldErrors(nextErrors);
      setError("Please correct the restaurant details before saving.");
      return;
    }

    try {
      setUpdatingRestaurant(true);
      setError("");
      setSuccess("");
      setRestaurantFieldErrors({});

      const updateBody = {
        name: restaurantData.name.trim(),
        description: restaurantData.description.trim(),
        phone: restaurantData.phone.trim(),
        email: restaurantData.email.trim(),
        address: restaurantData.address || {},
        cuisine: restaurantData.cuisine || [],
      };

      if (restaurantImg) {
        updateBody.image = restaurantImg;
      }

      const response = await restaurantApi.update({
        id: restaurants[0]._id,
        body: updateBody,
        token,
      });

      // Update restaurants array with the response data
      setRestaurants([response.data, ...restaurants.slice(1)]);
      setIsEditingRestaurant(false);
      setRestaurantImg(null);
      setRestaurantData(null);
      setSuccess("Restaurant updated successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to update restaurant");
    } finally {
      setUpdatingRestaurant(false);
    }
  };

  const handleRestaurantImgChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setRestaurantImg(file);
      setRestaurantFieldErrors((prev) => {
        if (!prev.image) {
          return prev;
        }

        const nextErrors = { ...prev };
        delete nextErrors.image;
        return nextErrors;
      });
    }
  };

  const ownerRestaurantName = restaurants[0]?.name || "Your Restaurant";

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                <Store className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {ownerRestaurantName}
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
                onClick={fetchOwnerData}
                className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-6 h-6" />
              </button>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-600">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-600">
            {success}
          </div>
        )}
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
              <button
                onClick={() => setActiveTab("settings")}
                className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "settings"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Settings className="w-5 h-5 inline-block mr-2 mb-1" />
                Settings
              </button>
              <button
                onClick={() => setActiveTab("coupons")}
                className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "coupons"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <TicketPercent className="w-5 h-5 inline-block mr-2 mb-1" />
                Coupons
              </button>
            </nav>
          </div>
        </div>

        {loading ? (
          <div className="text-gray-600">Loading owner data...</div>
        ) : (
          <>
            {activeTab === "overview" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                  <StatCard
                    title="Total Orders"
                    value={stats.totalOrders}
                    icon={ShoppingBag}
                  />
                  <StatCard
                    title="Total Revenue"
                    value={`₹${stats.totalRevenue.toLocaleString()}`}
                    icon={DollarSign}
                  />
                  <StatCard
                    title="Menu Items"
                    value={stats.menuItems}
                    icon={Package}
                  />
                  <StatCard
                    title="Pending Orders"
                    value={stats.pendingOrders}
                    icon={Clock}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                  <SmallStat title="Today's Orders" value={stats.todayOrders} />
                  <SmallStat
                    title="Today's Revenue"
                    value={`₹${stats.todayRevenue}`}
                  />
                  <SmallStat
                    title="Avg Order Value"
                    value={`₹${stats.avgOrderValue}`}
                  />
                  <SmallStat
                    title="Completion Rate"
                    value={`${stats.completionRate}%`}
                  />
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    Restaurant Rating
                  </h3>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.rating}
                  </p>
                  <p className="text-gray-600">{stats.totalReviews} reviews</p>
                </div>
              </>
            )}

            {activeTab === "orders" && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b flex flex-col sm:flex-row justify-between gap-3">
                  <h3 className="text-lg font-semibold">Orders</h3>
                  <select
                    value={orderFilter}
                    onChange={(e) => setOrderFilter(e.target.value)}
                    className="px-3 py-2 border rounded-lg"
                  >
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="preparing">Preparing</option>
                    <option value="out for delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px]">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs uppercase text-gray-500">
                          Order
                        </th>
                        <th className="px-4 py-3 text-left text-xs uppercase text-gray-500">
                          Customer
                        </th>
                        <th className="px-4 py-3 text-left text-xs uppercase text-gray-500">
                          Items
                        </th>
                        <th className="px-4 py-3 text-left text-xs uppercase text-gray-500">
                          Total
                        </th>
                        <th className="px-4 py-3 text-left text-xs uppercase text-gray-500">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order) => (
                        <tr key={order._id} className="border-t">
                          <td className="px-4 py-3">
                            #{order._id.slice(-8).toUpperCase()}
                          </td>
                          <td className="px-4 py-3">
                            {order.user?.name || "N/A"}
                          </td>
                          <td className="px-4 py-3">
                            {(order.ownerItems || []).length}
                          </td>
                          <td className="px-4 py-3">
                            ₹{order.ownerAmount || 0}
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={order.orderStatus}
                              onChange={(e) =>
                                changeOrderStatus(order._id, e.target.value)
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
                    </tbody>
                  </table>
                </div>
                {filteredOrders.length === 0 && (
                  <div className="p-10 text-center text-gray-500">
                    No orders found
                  </div>
                )}
              </div>
            )}

            {activeTab === "menu" && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Menu Items</h3>
                  <Link
                    to="/add-food"
                    className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4" /> Add Item
                  </Link>
                </div>
                <div className="p-4 border-b bg-gray-50 flex flex-col sm:flex-row gap-3">
                  <select
                    value={menuRestaurantFilter}
                    onChange={(e) => setMenuRestaurantFilter(e.target.value)}
                    className="px-3 py-2 border rounded-lg bg-white"
                  >
                    <option value="all">All Restaurants</option>
                    {restaurants.map((restaurant) => (
                      <option key={restaurant._id} value={restaurant._id}>
                        {restaurant.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={menuCategoryFilter}
                    onChange={(e) => setMenuCategoryFilter(e.target.value)}
                    className="px-3 py-2 border rounded-lg bg-white"
                  >
                    <option value="all">All Categories</option>
                    {menuCategoryOptions
                      .filter((category) => category !== "all")
                      .map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[850px]">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs uppercase text-gray-500">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs uppercase text-gray-500">
                          Category
                        </th>
                        <th className="px-4 py-3 text-left text-xs uppercase text-gray-500">
                          Price
                        </th>
                        <th className="px-4 py-3 text-left text-xs uppercase text-gray-500">
                          Rating
                        </th>
                        <th className="px-4 py-3 text-left text-xs uppercase text-gray-500">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMenuFoods.map((food) => (
                        <tr key={food._id} className="border-t">
                          <td className="px-4 py-3">{food.name}</td>
                          <td className="px-4 py-3">{food.category}</td>
                          <td className="px-4 py-3">₹{food.price}</td>
                          <td className="px-4 py-3">{food.rating || 0}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Link
                                to={`/edit-food/${food._id}`}
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-blue-600 border border-blue-200 rounded hover:bg-blue-50"
                              >
                                <Edit className="w-4 h-4" /> Edit
                              </Link>
                              <button
                                onClick={() => deleteFood(food._id)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-red-600 border border-red-200 rounded hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" /> Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredMenuFoods.length === 0 && (
                  <div className="p-10 text-center text-gray-500 flex flex-col items-center gap-2">
                    <AlertCircle className="w-8 h-8 text-gray-400" />
                    No menu items found for selected filters.
                  </div>
                )}
              </div>
            )}

            {activeTab === "settings" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Restaurant Settings
                  </h3>
                  {!isEditingRestaurant && (
                    <button
                      onClick={handleEditRestaurant}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <Edit className="w-5 h-5" />
                      Edit Restaurant
                    </button>
                  )}
                </div>

                {isEditingRestaurant && restaurantData ? (
                  <div className="max-w-2xl space-y-6">
                    {/* Restaurant Image Section */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                      <div className="mb-4">
                        {restaurantImg ? (
                          <div className="relative w-48 h-48 mx-auto">
                            <img
                              src={URL.createObjectURL(restaurantImg)}
                              alt="Restaurant Preview"
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                        ) : restaurants[0]?.image ? (
                          <div className="relative w-48 h-48 mx-auto">
                            <img
                              src={getImageUrl(restaurants[0].image)}
                              alt="Restaurant"
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                        ) : (
                          <div className="w-48 h-48 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                            <Upload className="w-12 h-12 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleRestaurantImgChange}
                          className="hidden"
                        />
                        <div className="text-blue-600 hover:text-blue-700 font-medium">
                          Click to upload restaurant image
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                          JPG, PNG, GIF or WebP (max 5MB)
                        </p>
                      </label>
                      {restaurantFieldErrors.image && (
                        <p className="mt-3 text-sm text-red-600">
                          {restaurantFieldErrors.image}
                        </p>
                      )}
                    </div>

                    {/* Restaurant Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Restaurant Name
                        </label>
                        <input
                          type="text"
                          value={restaurantData.name || ""}
                          onChange={(e) =>
                            updateRestaurantField("name", e.target.value)
                          }
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            restaurantFieldErrors.name
                              ? "border-red-400"
                              : "border-gray-300"
                          }`}
                        />
                        {restaurantFieldErrors.name && (
                          <p className="mt-2 text-sm text-red-600">
                            {restaurantFieldErrors.name}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="text"
                          inputMode="email"
                          value={restaurantData.email || ""}
                          onChange={(e) =>
                            updateRestaurantField("email", e.target.value)
                          }
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            restaurantFieldErrors.email
                              ? "border-red-400"
                              : "border-gray-300"
                          }`}
                        />
                        {restaurantFieldErrors.email && (
                          <p className="mt-2 text-sm text-red-600">
                            {restaurantFieldErrors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={restaurantData.phone || ""}
                          onChange={(e) =>
                            updateRestaurantField("phone", e.target.value)
                          }
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            restaurantFieldErrors.phone
                              ? "border-red-400"
                              : "border-gray-300"
                          }`}
                        />
                        {restaurantFieldErrors.phone && (
                          <p className="mt-2 text-sm text-red-600">
                            {restaurantFieldErrors.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={restaurantData.description || ""}
                        onChange={(e) =>
                          updateRestaurantField("description", e.target.value)
                        }
                        rows={4}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          restaurantFieldErrors.description
                            ? "border-red-400"
                            : "border-gray-300"
                        }`}
                      />
                      {restaurantFieldErrors.description && (
                        <p className="mt-2 text-sm text-red-600">
                          {restaurantFieldErrors.description}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleSaveRestaurant}
                        disabled={updatingRestaurant}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <Save className="w-5 h-5" />
                        {updatingRestaurant ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingRestaurant(false);
                          setRestaurantData(null);
                          setRestaurantImg(null);
                          setRestaurantFieldErrors({});
                        }}
                        className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors flex items-center justify-center gap-2"
                      >
                        <X className="w-5 h-5" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : restaurants[0] ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Restaurant Image Display */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">
                          Restaurant Image
                        </h4>
                        {restaurants[0].image ? (
                          <img
                            src={getImageUrl(restaurants[0].image)}
                            alt={restaurants[0].name}
                            className="w-full h-64 object-cover rounded-lg shadow"
                          />
                        ) : (
                          <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-gray-500">No image set</span>
                          </div>
                        )}
                      </div>

                      {/* Restaurant Details Display */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700">
                            Name
                          </h4>
                          <p className="text-gray-900 mt-1">
                            {restaurants[0].name}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-700">
                            Email
                          </h4>
                          <p className="text-gray-900 mt-1">
                            {restaurants[0].email}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-700">
                            Phone
                          </h4>
                          <p className="text-gray-900 mt-1">
                            {restaurants[0].phone}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Description
                      </h4>
                      <p className="text-gray-900">
                        {restaurants[0].description}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    No restaurant data available
                  </div>
                )}
              </div>
            )}

            {activeTab === "coupons" && (
              <div className="space-y-5">
                <form
                  onSubmit={addCoupon}
                  noValidate
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Add Discount Coupon
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <input
                      value={couponForm.code}
                      onChange={(e) =>
                        setCouponForm((prev) => ({
                          ...prev,
                          code: e.target.value,
                        }))
                      }
                      placeholder="Code"
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
                      placeholder="Max discount"
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
                  </div>
                  <textarea
                    value={couponForm.description}
                    onChange={(e) =>
                      setCouponForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={2}
                    placeholder="Description (optional)"
                    className="mt-3 w-full px-3 py-2 border rounded-lg"
                  />
                  <label className="inline-flex items-center gap-2 mt-3 text-sm text-gray-700">
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
                  <div className="mt-4">
                    <button
                      type="submit"
                      disabled={submittingCoupon}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {submittingCoupon ? "Adding..." : "Add Coupon"}
                    </button>
                  </div>
                </form>

                <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                  <table className="w-full min-w-[860px]">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs uppercase text-gray-500">
                          Code
                        </th>
                        <th className="px-4 py-3 text-left text-xs uppercase text-gray-500">
                          Type
                        </th>
                        <th className="px-4 py-3 text-left text-xs uppercase text-gray-500">
                          Value
                        </th>
                        <th className="px-4 py-3 text-left text-xs uppercase text-gray-500">
                          Validity
                        </th>
                        <th className="px-4 py-3 text-left text-xs uppercase text-gray-500">
                          Usage
                        </th>
                        <th className="px-4 py-3 text-left text-xs uppercase text-gray-500">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs uppercase text-gray-500">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {coupons.map((coupon) => (
                        <tr key={coupon._id} className="border-t">
                          <td className="px-4 py-3 font-semibold">
                            {coupon.code}
                          </td>
                          <td className="px-4 py-3 capitalize">
                            {coupon.discountType}
                          </td>
                          <td className="px-4 py-3">
                            {coupon.discountType === "percentage"
                              ? `${coupon.discountValue}%`
                              : `₹${coupon.discountValue}`}
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-600">
                            {new Date(coupon.startDate).toLocaleDateString()} -{" "}
                            {new Date(
                              coupon.expirationDate,
                            ).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            {coupon.usedCount || 0}/{coupon.usageLimit || "∞"}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => toggleCouponStatus(coupon)}
                              className={`px-2 py-1 rounded text-xs ${
                                coupon.isActive
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {coupon.isActive ? "Active" : "Inactive"}
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => removeCoupon(coupon._id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-red-600 border border-red-200 rounded hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" /> Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {coupons.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                      No coupons created yet.
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm text-gray-600">{title}</h3>
        <Icon className="w-5 h-5 text-blue-500" />
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function SmallStat({ title, value }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
