import { MapPin, ArrowLeft, Package, Gift, Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { PaymentPage } from "./payment-page";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { cartApi, orderApi } from "../services/api";
import { isValidName, isValidPhone, isValidPinCode } from "../utils/validation";

export function CheckoutPage() {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [orderId, setOrderId] = useState("");
  const [cart, setCart] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  // Coupon states
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const [addressForm, setAddressForm] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    zipCode: user?.address?.zipCode || "",
  });

  const updateAddressField = (field, value) => {
    setAddressForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    setFieldErrors((prev) => {
      if (!prev[field]) {
        return prev;
      }

      const nextErrors = { ...prev };
      delete nextErrors[field];
      return nextErrors;
    });
  };

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

  const orderSummary = useMemo(() => {
    const items = (cart?.items || []).map((item) => ({
      food: item.food?._id,
      name: item.food?.name,
      quantity: item.quantity,
      price: item.price,
      restaurant: item.restaurant?._id,
      lineTotal: item.quantity * item.price,
    }));

    const subtotal = cart?.totalPrice || 0;
    const deliveryFee = subtotal > 0 ? 40 : 0;
    const tax = Math.round(subtotal * 0.05);

    // Calculate discount from coupon
    let discountAmount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.discountType === "percentage") {
        discountAmount = Math.round(
          (subtotal * appliedCoupon.discountValue) / 100,
        );
        if (appliedCoupon.maxDiscount) {
          discountAmount = Math.min(discountAmount, appliedCoupon.maxDiscount);
        }
      } else {
        discountAmount = appliedCoupon.discountValue;
      }
    }

    const total = subtotal + deliveryFee + tax - discountAmount;

    return {
      items,
      subtotal,
      deliveryFee,
      tax,
      discountAmount,
      total: Math.max(0, total),
    };
  }, [cart, appliedCoupon]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    setCouponLoading(true);
    setCouponError("");

    try {
      // Simulate coupon validation - in real app, validate against backend
      // For now, we'll accept common demo coupons
      const demoCodeMappings = {
        WELCOME20: {
          code: "WELCOME20",
          discountType: "percentage",
          discountValue: 20,
          maxDiscount: 100,
          description: "20% off on first order",
        },
        FLAT50: {
          code: "FLAT50",
          discountType: "fixed",
          discountValue: 50,
          description: "Flat ₹50 off",
        },
        VEG100: {
          code: "VEG100",
          discountType: "fixed",
          discountValue: 100,
          description: "₹100 off on veg orders",
        },
      };

      const coupon = demoCodeMappings[couponCode.toUpperCase()];

      if (!coupon) {
        setCouponError("Invalid coupon code. Try WELCOME20, FLAT50, or VEG100");
        setAppliedCoupon(null);
        setCouponCode("");
        return;
      }

      if (coupon.discountType === "percentage" && orderSummary.subtotal < 100) {
        setCouponError("Coupon not applicable for this order");
        setAppliedCoupon(null);
        return;
      }

      setAppliedCoupon(coupon);
      setCouponError("");
    } catch (err) {
      setCouponError("Failed to validate coupon");
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  const handleProceedToPayment = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    if (!orderSummary.items.length) {
      setError("Your cart is empty");
      return;
    }

    const isBlank = (value) => !String(value || "").trim();
    const nextErrors = {};
    if (isBlank(addressForm.fullName)) {
      nextErrors.fullName = "Full name is required.";
    } else if (!isValidName(addressForm.fullName)) {
      nextErrors.fullName = "Please enter a valid full name.";
    }
    if (isBlank(addressForm.phone)) {
      nextErrors.phone = "Phone number is required.";
    } else if (!isValidPhone(addressForm.phone)) {
      nextErrors.phone = "Please enter a valid 10-digit phone number.";
    }
    if (isBlank(addressForm.street)) {
      nextErrors.street = "Street address is required.";
    }
    if (isBlank(addressForm.city)) {
      nextErrors.city = "City is required.";
    }
    if (isBlank(addressForm.state)) {
      nextErrors.state = "State is required.";
    }
    if (isBlank(addressForm.zipCode)) {
      nextErrors.zipCode = "PIN code is required.";
    } else if (!isValidPinCode(addressForm.zipCode)) {
      nextErrors.zipCode = "Please enter a valid 6-digit PIN code.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setError("Please correct the delivery details before proceeding.");
      return;
    }

    try {
      // Map payment method for order
      const paymentMethodMap = {
        cod: "Cash on Delivery",
        upi: "UPI",
        card: "Credit Card",
        wallet: "Wallet",
      };

      const res = await orderApi.create({
        token,
        body: {
          orderItems: orderSummary.items,
          deliveryAddress: {
            street: addressForm.street.trim(),
            city: addressForm.city.trim(),
            state: addressForm.state.trim(),
            zipCode: addressForm.zipCode.trim(),
            country: "India",
          },
          paymentMethod: paymentMethodMap[paymentMethod] || "Cash on Delivery",
          itemsPrice: orderSummary.subtotal,
          taxPrice: orderSummary.tax,
          deliveryPrice: orderSummary.deliveryFee,
          totalPrice: orderSummary.total,
          ...(appliedCoupon && { discountAmount: orderSummary.discountAmount }),
        },
      });

      setOrderId(res.data._id);
      setShowPayment(true);
    } catch (err) {
      setError(err.message || "Failed to place order");
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      await cartApi.clear(token);
      setCart((prev) =>
        prev
          ? {
              ...prev,
              items: [],
              totalPrice: 0,
            }
          : prev,
      );
    } catch (err) {
      console.error("Failed to clear cart after order:", err);
    }

    navigate(`/order-confirmation?orderId=${orderId}`);
  };

  const cartCount = (cart?.items || []).reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header cartItemCount={cartCount} />

      <div className="max-w-7xl mx-auto px-4 py-8 flex-grow">
        {showPayment ? (
          <button
            type="button"
            onClick={() => {
              setShowPayment(false);
              setError("");
            }}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-600 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Delivery Details</span>
          </button>
        ) : (
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-600 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Cart</span>
          </Link>
        )}

        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {showPayment ? "Payment" : "Checkout"}
        </h1>

        {loading ? (
          <div className="text-center py-16 text-gray-600">
            Loading checkout...
          </div>
        ) : showPayment ? (
          <div className="max-w-2xl mx-auto">
            <PaymentPage
              amount={orderSummary.total}
              paymentMethod={paymentMethod}
              onBack={() => {
                setShowPayment(false);
                setError("");
              }}
              onSuccess={(selectedPayment) => {
                if (selectedPayment) {
                  setPaymentMethod(selectedPayment);
                }
                handlePaymentSuccess();
              }}
            />
          </div>
        ) : (
          <form onSubmit={handleProceedToPayment} noValidate>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  {error && (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-600">
                      {error}
                    </div>
                  )}

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
                          value={addressForm.fullName}
                          onChange={(e) =>
                            updateAddressField("fullName", e.target.value)
                          }
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${
                            fieldErrors.fullName
                              ? "border-red-400"
                              : "border-gray-300"
                          }`}
                        />
                        {fieldErrors.fullName && (
                          <p className="mt-2 text-sm text-red-600">
                            {fieldErrors.fullName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          value={addressForm.phone}
                          onChange={(e) =>
                            updateAddressField("phone", e.target.value)
                          }
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${
                            fieldErrors.phone
                              ? "border-red-400"
                              : "border-gray-300"
                          }`}
                        />
                        {fieldErrors.phone && (
                          <p className="mt-2 text-sm text-red-600">
                            {fieldErrors.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        value={addressForm.street}
                        onChange={(e) =>
                          updateAddressField("street", e.target.value)
                        }
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${
                          fieldErrors.street
                            ? "border-red-400"
                            : "border-gray-300"
                        }`}
                      />
                      {fieldErrors.street && (
                        <p className="mt-2 text-sm text-red-600">
                          {fieldErrors.street}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          value={addressForm.city}
                          onChange={(e) =>
                            updateAddressField("city", e.target.value)
                          }
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${
                            fieldErrors.city
                              ? "border-red-400"
                              : "border-gray-300"
                          }`}
                        />
                        {fieldErrors.city && (
                          <p className="mt-2 text-sm text-red-600">
                            {fieldErrors.city}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          value={addressForm.state}
                          onChange={(e) =>
                            updateAddressField("state", e.target.value)
                          }
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${
                            fieldErrors.state
                              ? "border-red-400"
                              : "border-gray-300"
                          }`}
                        />
                        {fieldErrors.state && (
                          <p className="mt-2 text-sm text-red-600">
                            {fieldErrors.state}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          PIN Code *
                        </label>
                        <input
                          type="text"
                          value={addressForm.zipCode}
                          onChange={(e) =>
                            updateAddressField("zipCode", e.target.value)
                          }
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${
                            fieldErrors.zipCode
                              ? "border-red-400"
                              : "border-gray-300"
                          }`}
                        />
                        {fieldErrors.zipCode && (
                          <p className="mt-2 text-sm text-red-600">
                            {fieldErrors.zipCode}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Order Items
                  </h2>
                  <div className="space-y-3">
                    {orderSummary.items.map((item) => (
                      <div
                        key={`${item.food}-${item.name}`}
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
                          ₹{item.lineTotal}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Order Summary
                  </h3>

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
                      <span>Tax (5%)</span>
                      <span>₹{orderSummary.tax}</span>
                    </div>
                    {orderSummary.discountAmount > 0 && (
                      <div className="flex justify-between text-green-600 font-medium">
                        <span>Discount ({appliedCoupon.code})</span>
                        <span>-₹{orderSummary.discountAmount}</span>
                      </div>
                    )}
                    <div className="border-t pt-3 flex justify-between font-semibold text-gray-900 text-lg">
                      <span>Total Amount</span>
                      <span>₹{orderSummary.total}</span>
                    </div>
                  </div>

                  {/* Coupon Section */}
                  <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Gift className="w-4 h-4 text-orange-600" />
                      Apply Coupon
                    </h4>

                    {appliedCoupon ? (
                      <div className="bg-white p-3 rounded-lg border border-green-300 flex justify-between items-center">
                        <div>
                          <p className="font-medium text-green-700">
                            {appliedCoupon.code}
                          </p>
                          <p className="text-sm text-gray-600">
                            {appliedCoupon.description}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveCoupon}
                          className="text-sm text-red-600 hover:text-red-700 font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => {
                              setCouponCode(e.target.value.toUpperCase());
                              setCouponError("");
                            }}
                            placeholder="Enter coupon code"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm"
                          />
                          <button
                            type="button"
                            onClick={handleApplyCoupon}
                            disabled={couponLoading}
                            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center gap-2 text-sm font-medium"
                          >
                            {couponLoading && (
                              <Loader className="w-4 h-4 animate-spin" />
                            )}
                            Apply
                          </button>
                        </div>
                        {couponError && (
                          <p className="text-sm text-red-600">{couponError}</p>
                        )}
                        <p className="text-xs text-gray-600">
                          Try: WELCOME20, FLAT50, VEG100
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Payment Method Selection */}
                  <div className="mb-6 space-y-3">
                    <h4 className="font-semibold text-gray-900">
                      Payment Method
                    </h4>
                    <div className="space-y-2">
                      {[
                        { id: "cod", label: "Cash on Delivery" },
                        { id: "upi", label: "UPI" },
                        { id: "card", label: "Credit/Debit Card" },
                        { id: "wallet", label: "Digital Wallet" },
                      ].map((method) => (
                        <label
                          key={method.id}
                          className="flex items-center p-2 border rounded-lg cursor-pointer hover:bg-gray-50"
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method.id}
                            checked={paymentMethod === method.id}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-4 h-4 text-orange-600"
                          />
                          <span className="ml-3 text-sm font-medium text-gray-700">
                            {method.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-orange-600 text-white py-4 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                  >
                    Proceed to Payment
                  </button>
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
