import { CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export function OrderConfirmationPage() {
  const orderId = 'ORD' + Math.random().toString(36).substr(2, 9).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <CheckCircle className="w-20 h-20 text-green-600 mx-auto" />
          </div>

          {/* Success Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600 mb-6">
            Thank you for your order. Your food is being prepared.
          </p>

          {/* Order Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Order ID</span>
                <span className="font-semibold text-gray-900">{orderId}</span>
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
                <span className="font-semibold text-gray-900">₹746</span>
              </div>
            </div>
          </div>

          {/* Tracking Info */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">Order Placed</span>
              </div>
              <span className="text-xs text-gray-500">Just now</span>
            </div>

            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <span className="text-sm text-gray-500">Preparing</span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <span className="text-sm text-gray-500">Out for Delivery</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <span className="text-sm text-gray-500">Delivered</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              to="/"
              className="block w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700"
            >
              Back to Home
            </Link>
            <Link
              to="/profile"
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
