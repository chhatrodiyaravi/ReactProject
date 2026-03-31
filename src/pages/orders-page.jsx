import { Package, Eye, RefreshCw, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { useAuth } from "../context/AuthContext";
import { orderApi } from "../services/api";
import { useEffect, useMemo, useState } from "react";
import { ReviewDialog } from "../components/review-dialog";

export function OrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedOrderItem, setSelectedOrderItem] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await orderApi.getMine(token);
      setOrders(res.data || []);
    } catch (err) {
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  const cartCount = useMemo(
    () =>
      orders
        .flatMap((order) => order.orderItems || [])
        .reduce((sum, item) => sum + (item.quantity || 0), 0),
    [orders],
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Preparing":
        return "bg-blue-100 text-blue-700";
      case "Out for Delivery":
        return "bg-purple-100 text-purple-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header cartItemCount={cartCount} />

      <div className="max-w-7xl mx-auto px-4 py-8 flex-grow">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-orange-600"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-600">
            Loading orders...
          </div>
        ) : error ? (
          <div className="text-center py-16 text-red-600">{error}</div>
        ) : orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="w-full md:w-32 h-32 bg-gradient-to-br from-orange-200 to-orange-400 rounded-lg flex-shrink-0"></div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {order.orderItems?.[0]?.restaurant?.name ||
                            "Restaurant"}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          order.orderStatus,
                        )}`}
                      >
                        {order.orderStatus}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                      <span>{(order.orderItems || []).length} items</span>
                      <span>•</span>
                      <div className="flex gap-2">
                        {order.discountAmount > 0 && (
                          <>
                            <span className="line-through text-gray-400">
                              ₹
                              {order.itemsPrice +
                                order.taxPrice +
                                order.deliveryPrice}
                            </span>
                            <span className="text-green-600 font-medium">
                              ₹{order.totalPrice}
                            </span>
                          </>
                        )}
                        {order.discountAmount === 0 && (
                          <span>₹{order.totalPrice}</span>
                        )}
                      </div>
                      <span>•</span>
                      <span>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex gap-3">
                      {order.orderStatus === "Delivered" ? (
                        <button
                          onClick={() => {
                            setSelectedOrderItem({
                              ...order.orderItems[0],
                              restaurant: order.orderItems[0]?.restaurant,
                            });
                            setReviewDialogOpen(true);
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-medium"
                        >
                          <Star className="w-4 h-4" />
                          Rate & Review
                        </button>
                      ) : (
                        <Link
                          to={`/order-status?orderId=${order._id}`}
                          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          Track Order
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              No orders yet
            </h2>
            <p className="text-gray-600 mb-6">
              You haven&apos;t placed any orders. Start exploring delicious
              food!
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium"
            >
              Browse Restaurants
            </Link>
          </div>
        )}
      </div>

      <ReviewDialog
        isOpen={reviewDialogOpen}
        onClose={() => setReviewDialogOpen(false)}
        orderItem={selectedOrderItem}
        token={token}
        onReviewSubmitted={() => {
          setReviewDialogOpen(false);
        }}
      />

      <Footer />
    </div>
  );
}
