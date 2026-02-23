import {
  CreditCard,
  Smartphone,
  Wallet,
  CheckCircle,
  AlertCircle,
  Lock,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function PaymentPage({ amount = 774, onSuccess }) {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Form states
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [walletProvider, setWalletProvider] = useState("paytm");

  const formatCardNumber = (value) => {
    const numbers = value.replace(/\s/g, "");
    const groups = numbers.match(/.{1,4}/g);
    return groups ? groups.join(" ") : numbers;
  };

  const formatExpiryDate = (value) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length >= 2) {
      return numbers.slice(0, 2) + "/" + numbers.slice(2, 4);
    }
    return numbers;
  };

  const validateUPI = (upi) => {
    const upiRegex = /^[\w.-]+@[\w.-]+$/;
    return upiRegex.test(upi);
  };

  const validateCard = () => {
    const cardNumberClean = cardNumber.replace(/\s/g, "");
    return (
      cardNumberClean.length === 16 &&
      cardName.length > 0 &&
      expiryDate.length === 5 &&
      cvv.length === 3
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate based on payment method
    if (paymentMethod === "upi" && !validateUPI(upiId)) {
      setError("Please enter a valid UPI ID");
      return;
    }

    if (paymentMethod === "card" && !validateCard()) {
      setError("Please fill all card details correctly");
      return;
    }

    setLoading(true);

    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);

      // Call success callback or navigate
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          navigate("/order-confirmation");
        }
      }, 2000);
    }, 2000);
  };

  if (success) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center py-6">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">
            Payment Successful!
          </h3>
          <p className="text-gray-600 mb-2">
            Transaction ID: TXN
            {Math.random().toString(36).substr(2, 9).toUpperCase()}
          </p>
          <p className="text-lg font-semibold text-orange-600">
            Amount Paid: ₹{amount}
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Redirecting to order confirmation...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <Lock className="w-5 h-5 text-green-600" />
        <h2 className="text-xl font-semibold text-gray-900">Secure Payment</h2>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Amount Display */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">Total Amount</span>
          <span className="text-2xl font-bold text-orange-600">₹{amount}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Payment Methods */}
        <div className="space-y-3">
          {/* UPI */}
          <label
            className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
              paymentMethod === "upi"
                ? "border-orange-600 bg-orange-50"
                : "border-gray-200 hover:border-orange-300"
            }`}
          >
            <input
              type="radio"
              name="payment"
              value="upi"
              checked={paymentMethod === "upi"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-4 h-4 text-orange-600"
            />
            <Smartphone className="w-6 h-6 ml-3 mr-3 text-orange-600" />
            <div className="flex-1">
              <div className="font-medium text-gray-900">UPI Payment</div>
              <div className="text-sm text-gray-500">
                Google Pay, PhonePe, Paytm, etc.
              </div>
            </div>
          </label>

          {/* Card */}
          <label
            className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
              paymentMethod === "card"
                ? "border-orange-600 bg-orange-50"
                : "border-gray-200 hover:border-orange-300"
            }`}
          >
            <input
              type="radio"
              name="payment"
              value="card"
              checked={paymentMethod === "card"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-4 h-4 text-orange-600"
            />
            <CreditCard className="w-6 h-6 ml-3 mr-3 text-orange-600" />
            <div className="flex-1">
              <div className="font-medium text-gray-900">
                Credit / Debit Card
              </div>
              <div className="text-sm text-gray-500">
                Visa, Mastercard, Rupay, Amex
              </div>
            </div>
          </label>

          {/* Wallet */}
          <label
            className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
              paymentMethod === "wallet"
                ? "border-orange-600 bg-orange-50"
                : "border-gray-200 hover:border-orange-300"
            }`}
          >
            <input
              type="radio"
              name="payment"
              value="wallet"
              checked={paymentMethod === "wallet"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-4 h-4 text-orange-600"
            />
            <Wallet className="w-6 h-6 ml-3 mr-3 text-orange-600" />
            <div className="flex-1">
              <div className="font-medium text-gray-900">Digital Wallets</div>
              <div className="text-sm text-gray-500">
                Paytm, Amazon Pay, MobiKwik
              </div>
            </div>
          </label>
        </div>

        {/* UPI Details */}
        {paymentMethod === "upi" && (
          <div className="p-4 bg-gray-50 rounded-lg space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter UPI ID
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="yourname@upi"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Example: yourname@paytm, yourname@googlepay
              </p>
            </div>
          </div>
        )}

        {/* Card Details */}
        {paymentMethod === "card" && (
          <div className="p-4 bg-gray-50 rounded-lg space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number
              </label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => {
                  const formatted = formatCardNumber(e.target.value);
                  if (formatted.replace(/\s/g, "").length <= 16) {
                    setCardNumber(formatted);
                  }
                }}
                placeholder="1234 5678 9012 3456"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cardholder Name
              </label>
              <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value.toUpperCase())}
                placeholder="JOHN DOE"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  value={expiryDate}
                  onChange={(e) =>
                    setExpiryDate(formatExpiryDate(e.target.value))
                  }
                  placeholder="MM/YY"
                  maxLength={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV
                </label>
                <input
                  type="password"
                  value={cvv}
                  onChange={(e) => {
                    if (e.target.value.length <= 3) {
                      setCvv(e.target.value.replace(/\D/g, ""));
                    }
                  }}
                  placeholder="123"
                  maxLength={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Wallet Details */}
        {paymentMethod === "wallet" && (
          <div className="p-4 bg-gray-50 rounded-lg space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Wallet
              </label>
              <select
                value={walletProvider}
                onChange={(e) => setWalletProvider(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                required
              >
                <option value="paytm">Paytm Wallet</option>
                <option value="amazonpay">Amazon Pay</option>
                <option value="mobikwik">MobiKwik</option>
                <option value="freecharge">FreeCharge</option>
              </select>
              <p className="text-xs text-gray-500 mt-2">
                You will be redirected to complete the payment
              </p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-600 text-white py-4 rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing Payment...
            </>
          ) : (
            <>
              <Lock className="w-5 h-5" />
              Pay ₹{amount}
            </>
          )}
        </button>

        <p className="text-xs text-gray-500 text-center">
          🔒 Your payment information is secure and encrypted
        </p>
      </form>
    </div>
  );
}
