import { Minus, Plus, Trash2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { useAuth } from "../context/AuthContext";
import { cartApi } from "../services/api";

// Helper function to get full image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http")) return imagePath;
  const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  return `${apiBaseUrl}${imagePath}`;
};

export function CartPage() {
  const { token } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await cartApi.get(token);
      setCart(res.data);
    } catch (err) {
      setError(err.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCart();
    }
  }, [token]);

  const updateQuantity = async (itemId, quantity) => {
    try {
      setError("");
      console.log(
        "Updating quantity for itemId:",
        itemId,
        "quantity:",
        quantity,
      );
      if (quantity <= 0) {
        const res = await cartApi.removeItem({ itemId, token });
        setCart(res.data);
      } else {
        const res = await cartApi.updateItem({
          itemId,
          body: { quantity },
          token,
        });
        setCart(res.data);
      }
    } catch (err) {
      console.error("Cart update error details:", {
        itemId,
        error: err.message,
        stack: err.stack,
      });
      setError(err.message || "Failed to update cart item");
      // Retry fetch to sync cart state
      setTimeout(() => fetchCart(), 1000);
    }
  };

  const clearCart = async () => {
    try {
      setError("");
      const res = await cartApi.clear(token);
      setCart(res.data);
    } catch (err) {
      console.error("Clear cart error:", err);
      setError(err.message || "Failed to clear cart");
    }
  };

  const cartItems = cart?.items || [];
  const itemCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  );

  const subtotal = cart?.totalPrice || 0;
  const deliveryFee = subtotal > 0 ? 40 : 0;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + tax;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header cartItemCount={itemCount} />

      <div className="max-w-7xl mx-auto px-4 py-8 flex-grow">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-600 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Continue Shopping</span>
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {loading ? (
          <div className="text-center py-16 text-gray-600">Loading cart...</div>
        ) : error ? (
          <div className="text-center py-16 text-red-600">{error}</div>
        ) : cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-5xl">🛒</span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Add some delicious items to get started!
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              Browse Restaurants
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-lg shadow-md p-4 flex items-center gap-4 hover:shadow-lg transition-shadow"
                >
                  <img
                    src={
                      item.food?.image
                        ? getImageUrl(item.food.image)
                        : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop"
                    }
                    alt={item.food?.name || "Food"}
                    className="w-24 h-24 object-cover rounded-lg flex-shrink-0 shadow-sm"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 text-lg">
                      {item.food?.name}
                    </h3>
                    <p className="text-xl font-bold text-orange-600">
                      ₹{item.price}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-2 py-1">
                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.quantity - 1)
                        }
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.quantity + 1)
                        }
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => updateQuantity(item._id, 0)}
                      className="text-red-600 hover:text-red-700 p-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Order Summary
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span>₹{deliveryFee}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (5%)</span>
                    <span>₹{tax}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-semibold text-gray-900 text-lg">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link
                    to="/checkout"
                    className="block w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 text-center"
                  >
                    Proceed to Checkout
                  </Link>
                  <button
                    onClick={clearCart}
                    className="block w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

