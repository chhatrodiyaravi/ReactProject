import { CheckCircle, Clock } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { orderApi } from "../services/api";

export function OrderConfirmationPage() {
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId || !token) {
        return;
      }
      try {
        const res = await orderApi.getById({ id: orderId, token });
        setOrder(res.data);
      } catch {
        setOrder(null);
      }
    };

    fetchOrder();
  }, [orderId, token]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mb-6">
            <CheckCircle className="w-20 h-20 text-green-600 mx-auto" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600 mb-6">
            Thank you for your order. Your food is being prepared.
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Order ID</span>
                <span className="font-semibold text-gray-900">
                  {order?._id || orderId || "N/A"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Estimated Delivery</span>
                <div className="flex items-center gap-2 text-orange-600 font-semibold">
                  <Clock className="w-4 h-4" />
                  <span>30-40 mins</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Amount</span>
                <span className="font-semibold text-gray-900">
                  ₹{order?.totalPrice || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              to="/"
              className="block w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700"
            >
              Back to Home
            </Link>
            <Link
              to="/orders"
              className="block w-full border border-orange-600 text-orange-600 py-3 rounded-lg font-medium hover:bg-orange-50"
            >
              View Order History
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

