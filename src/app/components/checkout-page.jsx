import { MapPin, ArrowLeft, Package } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "./header";
import { Footer } from "./footer";
import { PaymentPage } from "./payment-page";
import { useState } from "react";

export function CheckoutPage() {
  const navigate = useNavigate();
  const [showPayment, setShowPayment] = useState(false);

  const orderSummary = {
    items: [
      { name: "Margherita Pizza", quantity: 2, price: 598 },
      { name: "Garlic Bread", quantity: 1, price: 149 },
    ],
    subtotal: 747,
    deliveryFee: 40,
    tax: 37,
    discount: 50,
    total: 774,
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    navigate("/order-confirmation");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header cartItemCount={3} />

      <div className="max-w-7xl mx-auto px-4 py-8 flex-grow">
        {/* Back Button */}
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-600 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Cart</span>
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {showPayment ? "Payment" : "Checkout"}
        </h1>

        {showPayment ? (
          <div className="max-w-2xl mx-auto">
            <PaymentPage
              amount={orderSummary.total}
              onSuccess={handlePaymentSuccess}
            />
          </div>
        ) : (
          <form onSubmit={handleProceedToPayment}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Delivery Address */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-orange-600" />
                    <h2 className="text-xl font-semibold text-gray-900">
                      Delivery Address
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          defaultValue="John Doe"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          defaultValue="+91 9876543210"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        required
                        defaultValue="123 Main Street"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          required
                          defaultValue="Mumbai"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          required
                          defaultValue="Maharashtra"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          PIN Code *
                        </label>
                        <input
                          type="text"
                          required
                          defaultValue="400001"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Instructions (Optional)
                      </label>
                      <textarea
                        rows={3}
                        placeholder="E.g., Ring the doorbell twice, Leave at the door, etc."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Order Items
                  </h2>
                  <div className="space-y-3">
                    {orderSummary.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-2 border-b last:border-0"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold text-gray-900">
                          ₹{item.price}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Order Summary
                  </h3>

                  {/* Items */}
                  <div className="space-y-3 mb-4 pb-4 border-b">
                    {orderSummary.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {item.name} x{item.quantity}
                        </span>
                        <span className="text-gray-900 font-medium">
                          ₹{item.price}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>₹{orderSummary.subtotal}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Delivery Fee</span>
                      <span>₹{orderSummary.deliveryFee}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Tax</span>
                      <span>₹{orderSummary.tax}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{orderSummary.discount}</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between font-semibold text-gray-900 text-lg">
                      <span>Total Amount</span>
                      <span>₹{orderSummary.total}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-orange-600 text-white py-4 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                  >
                    Proceed to Payment
                  </button>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    By placing this order, you agree to our Terms & Conditions
                  </p>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>

      <Footer />
    </div>
  );
}
