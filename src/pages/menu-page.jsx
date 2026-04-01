import {
  Star,
  Clock,
  Plus,
  Minus,
  ShoppingCart,
  ArrowLeft,
  Search,
} from "lucide-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { cartApi, foodApi, restaurantApi } from "../services/api";

// Helper function to get full image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http")) return imagePath;
  const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  return `${apiBaseUrl}${imagePath}`;
};

export function MenuPage() {
  const { id: restaurantId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { token, isAuthenticated } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [allRestaurantItems, setAllRestaurantItems] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRestaurantAndCart = async () => {
      try {
        setLoading(true);
        setError("");

        const restaurantRes = await restaurantApi.getById(restaurantId);
        setRestaurant(restaurantRes.data);

        if (isAuthenticated && token) {
          const cartRes = await cartApi.get(token);
          const cartMap = {};
          (cartRes.data?.items || []).forEach((item) => {
            if (item?.food?._id) {
              cartMap[item.food._id] = {
                quantity: item.quantity,
                itemId: item._id,
              };
            }
          });
          setCart(cartMap);
        }
      } catch (err) {
        setError(err.message || "Failed to load menu");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantAndCart();
  }, [restaurantId, isAuthenticated, token]);

  useEffect(() => {
    const fetchAllRestaurantItems = async () => {
      try {
        const foodsRes = await foodApi.list({
          restaurant: restaurantId,
        });
        setAllRestaurantItems(foodsRes.data || []);
      } catch {
        setAllRestaurantItems([]);
      }
    };

    fetchAllRestaurantItems();
  }, [restaurantId]);

  const categoryOptions = useMemo(() => {
    const categories = [
      ...new Set(
        (allRestaurantItems || [])
          .map((item) => item?.category?.toString().trim())
          .filter(Boolean),
      ),
    ].sort((a, b) => a.localeCompare(b));

    return ["all", ...categories];
  }, [allRestaurantItems]);

  useEffect(() => {
    if (
      selectedCategory !== "all" &&
      !categoryOptions.includes(selectedCategory)
    ) {
      setSelectedCategory("all");
    }
  }, [selectedCategory, categoryOptions]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const foodsRes = await foodApi.list({
          restaurant: restaurantId,
          search: search.trim(),
          category: selectedCategory === "all" ? "" : selectedCategory,
        });
        setMenuItems(foodsRes.data || []);
      } catch (err) {
        setError(err.message || "Failed to load menu items");
      }
    };

    const timer = setTimeout(fetchMenuItems, 250);
    return () => clearTimeout(timer);
  }, [restaurantId, search, selectedCategory]);

  const refreshCart = async () => {
    if (!isAuthenticated || !token) {
      return;
    }
    const cartRes = await cartApi.get(token);
    const cartMap = {};
    (cartRes.data?.items || []).forEach((item) => {
      if (item?.food?._id) {
        cartMap[item.food._id] = {
          quantity: item.quantity,
          itemId: item._id,
        };
      }
    });
    setCart(cartMap);
  };

  const addToCart = async (itemId) => {
    if (!isAuthenticated || !token) {
      navigate("/login", {
        state: {
          from: location.pathname,
          message: "Please login to add items to cart.",
        },
      });
      return;
    }

    try {
      await cartApi.add({ body: { foodId: itemId, quantity: 1 }, token });
      await refreshCart();
    } catch {
      setError("Failed to add item to cart");
    }
  };

  const removeFromCart = async (itemId) => {
    if (!isAuthenticated || !token || !cart[itemId]) {
      return;
    }

    try {
      const nextQuantity = cart[itemId].quantity - 1;
      if (nextQuantity <= 0) {
        await cartApi.removeItem({ itemId: cart[itemId].itemId, token });
      } else {
        await cartApi.updateItem({
          itemId: cart[itemId].itemId,
          body: { quantity: nextQuantity },
          token,
        });
      }
      await refreshCart();
    } catch {
      setError("Failed to update cart");
    }
  };

  const totalItems = useMemo(
    () =>
      Object.values(cart).reduce((sum, item) => sum + (item?.quantity || 0), 0),
    [cart],
  );

  const totalPrice = useMemo(
    () =>
      menuItems.reduce(
        (sum, item) => sum + (cart[item._id]?.quantity || 0) * item.price,
        0,
      ),
    [menuItems, cart],
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            to="/restaurants"
            className="text-gray-700 hover:text-orange-600"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">
            {restaurant?.name || "Menu"}
          </h1>
          <Link to="/cart" className="relative">
            <ShoppingCart className="w-6 h-6 text-gray-700" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </header>

      {loading ? (
        <div className="text-center py-20 text-gray-600">Loading menu...</div>
      ) : error ? (
        <div className="text-center py-20 text-red-600">{error}</div>
      ) : (
        <>
          <img
            src={
              restaurant?.image
                ? getImageUrl(restaurant.image)
                : "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=300&fit=crop"
            }
            alt={restaurant?.name || "Restaurant"}
            className="w-full h-48 object-cover"
          />

          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="bg-white rounded-lg shadow-md p-6 -mt-24 mb-6 relative z-0">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {restaurant?.name}
              </h2>
              <p className="text-gray-600 mb-4">
                {(restaurant?.cuisine || []).join(", ") || "Various cuisines"}
              </p>

              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-orange-500 text-orange-500" />
                  <span className="font-medium">{restaurant?.rating || 0}</span>
                  <span className="text-gray-500">
                    ({restaurant?.totalReviews || 0} ratings)
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <span>30-40 mins</span>
                </div>
              </div>
            </div>

            <div className="mb-6 flex items-center bg-white rounded-lg shadow-sm p-4">
              <Search className="w-5 h-5 text-gray-400 mr-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search dishes by name, category or description..."
                className="flex-1 outline-none text-gray-900 placeholder-gray-500"
              />
            </div>

            <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
              {categoryOptions.map((category) => {
                const isActive = selectedCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-colors ${
                      isActive
                        ? "border-orange-600 bg-orange-50 text-orange-600"
                        : "border-gray-300 bg-white text-gray-700 hover:border-orange-400"
                    }`}
                  >
                    {category === "all" ? "All" : category}
                  </button>
                );
              })}
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Menu</h3>

              <div className="space-y-4">
                {menuItems.length === 0 && (
                  <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-600">
                    No menu items found.
                  </div>
                )}
                {menuItems.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white rounded-lg shadow-md p-4 flex items-start gap-4"
                  >
                    <img
                      src={
                        item.image
                          ? getImageUrl(item.image)
                          : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop"
                      }
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg flex-shrink-0 shadow-sm"
                    />

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`w-3 h-3 border-2 ${
                                item.isVegetarian
                                  ? "border-green-600 bg-green-600"
                                  : "border-red-600 bg-red-600"
                              }`}
                            ></span>
                            <h4 className="font-semibold text-gray-900">
                              {item.name}
                            </h4>
                          </div>
                          <p className="text-lg font-semibold text-orange-600">
                            ₹{item.price}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {item.description || "Freshly prepared food item"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      {cart[item._id] ? (
                        <div className="flex items-center gap-2 bg-orange-600 text-white rounded-lg px-2 py-1">
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="w-6 h-6 flex items-center justify-center hover:bg-orange-700 rounded"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-6 text-center font-medium">
                            {cart[item._id].quantity}
                          </span>
                          <button
                            onClick={() => addToCart(item._id)}
                            className="w-6 h-6 flex items-center justify-center hover:bg-orange-700 rounded"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(item._id)}
                          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Add
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {totalItems > 0 && (
            <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-4">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">
                    {totalItems} items in cart
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    ₹{totalPrice.toFixed(0)}
                  </p>
                </div>
                <Link
                  to="/cart"
                  className="px-8 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700"
                >
                  View Cart
                </Link>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
