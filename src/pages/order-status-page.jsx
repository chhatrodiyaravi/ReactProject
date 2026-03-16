import {
  Package,
  MapPin,
  Clock,
  CheckCircle,
  Truck,
  ChefHat,
  Star,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { useAuth } from "../context/AuthContext";
import { useEffect, useMemo, useState } from "react";
import { orderApi } from "../services/api";
import { ReviewDialog } from "../components/review-dialog";

export function OrderStatusPage() {
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedOrderItem, setSelectedOrderItem] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId || !token) {
        setError("Order ID is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await orderApi.getById({ id: orderId, token });
        setOrder(res.data);
      } catch (err) {
        setError(err.message || "Failed to load order status");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, token]);

  const currentStatus = order?.orderStatus || "Pending";

  const statusSteps = [
    {
      id: "Pending",
      title: "Order Placed",
      description: "We have received your order",
      icon: CheckCircle,
    },
    {
      id: "Preparing",
      title: "Preparing",
      description: "Your food is being prepared",
      icon: ChefHat,
    },
    {
      id: "Out for Delivery",
      title: "Out for Delivery",
      description: "Your order is on the way",
      icon: Truck,
    },
    {
      id: "Delivered",
      title: "Delivered",
      description: "Order has been delivered",
      icon: Package,
    },
  ];

  const statusIndex = statusSteps.findIndex(
    (step) => step.id === currentStatus,
  );

  const cartCount = useMemo(
    () =>
      (order?.orderItems || []).reduce(
        (sum, item) => sum + (item.quantity || 0),
        0,
      ),
    [order],
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        Loading order status...
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-red-600">
        {error || "Order not found"}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header cartItemCount={cartCount} />

      <div className="max-w-4xl mx-auto px-4 py-8 flex-grow">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-gray-600">Thank you for your order</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left">
            <div>
              <p className="text-sm text-gray-500 mb-1">Order ID</p>
              <p className="font-semibold text-gray-900">{order._id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Restaurant</p>
              <p className="font-semibold text-gray-900">
                {order.orderItems?.[0]?.restaurant?.name || "Restaurant"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Estimated Time</p>
              <div className="flex items-center justify-center md:justify-start gap-2 text-orange-600 font-semibold">
                <Clock className="w-4 h-4" />
                <span>30-40 mins</span>
              </div>
            </div>
          </div>
        </div>

        {currentStatus !== "Delivered" && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Order Status
            </h2>

            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

              <div className="space-y-8">
                {statusSteps.map((step, index) => {
                  const completed = index <= statusIndex;
                  const current = index === statusIndex;
                  return (
                    <div
                      key={step.id}
                      className="relative flex items-start gap-4"
                    >
                      <div
                        className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center ${
                          completed
                            ? "bg-green-600 text-white"
                            : current
                              ? "bg-orange-600 text-white animate-pulse"
                              : "bg-gray-200 text-gray-400"
                        }`}
                      >
                        <step.icon className="w-6 h-6" />
                      </div>

                      <div className="flex-1 pt-2">
                        <h3
                          className={`font-semibold ${completed || current ? "text-gray-900" : "text-gray-400"}`}
                        >
                          {step.title}
                        </h3>
                        <p
                          className={`text-sm ${completed || current ? "text-gray-600" : "text-gray-400"}`}
                        >
                          {step.description}
                        </p>
                        {current && (
                          <span className="inline-block mt-2 px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                            In Progress
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {currentStatus === "Delivered" && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Order Delivered!
              </h2>
              <p className="text-gray-600 mb-6">Hope you enjoyed your meal!</p>
              <button
                onClick={() => {
                  setSelectedOrderItem({
                    ...order.orderItems[0],
                    restaurant: order.orderItems[0]?.restaurant,
                  });
                  setReviewDialogOpen(true);
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium"
              >
                <Star className="w-5 h-5" />
                Rate & Review Your Order
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Order Summary
          </h2>

          <div className="space-y-3 mb-4 pb-4 border-b">
            {(order.orderItems || []).map((item, index) => (
              <div
                key={`${item.food?._id || index}`}
                className="flex justify-between"
              >
                <span className="text-gray-600">
                  {item.name} x{item.quantity}
                </span>
                <span className="font-medium text-gray-900">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between font-semibold text-lg text-gray-900">
            <span>Total Amount</span>
            <span>₹{order.totalPrice}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-orange-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Delivery Address
              </h3>
              <p className="text-gray-600">
                {[
                  order.deliveryAddress?.street,
                  order.deliveryAddress?.city,
                  order.deliveryAddress?.state,
                  order.deliveryAddress?.zipCode,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Link
            to="/"
            className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 text-center"
          >
            Order More Food
          </Link>
          <Link
            to="/orders"
            className="flex-1 px-6 py-3 border border-orange-600 text-orange-600 rounded-lg font-medium hover:bg-orange-50 text-center"
          >
            View All Orders
          </Link>
        </div>
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

