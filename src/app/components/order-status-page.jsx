import { Package, MapPin, Clock, CheckCircle, Truck, ChefHat } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Header } from './header';
import { Footer } from './footer';

export function OrderStatusPage() {
  const orderId = 'ORD' + Math.random().toString(36).substr(2, 9).toUpperCase();
  
  const orderDetails = {
    id: orderId,
    restaurant: 'Pizza Palace',
    items: [
      { name: 'Margherita Pizza', quantity: 2, price: 598 },
      { name: 'Garlic Bread', quantity: 1, price: 149 },
    ],
    totalAmount: 774,
    deliveryAddress: '123 Main Street, Mumbai, Maharashtra 400001',
    estimatedTime: '30-40 mins',
    currentStatus: 'preparing', // placed, preparing, out_for_delivery, delivered
  };

  const statusSteps = [
    {
      id: 'placed',
      title: 'Order Placed',
      description: 'We have received your order',
      icon: CheckCircle,
      time: '2:30 PM',
      completed: true,
    },
    {
      id: 'preparing',
      title: 'Preparing',
      description: 'Your food is being prepared',
      icon: ChefHat,
      time: '2:35 PM',
      completed: orderDetails.currentStatus !== 'placed',
      current: orderDetails.currentStatus === 'preparing',
    },
    {
      id: 'out_for_delivery',
      title: 'Out for Delivery',
      description: 'Your order is on the way',
      icon: Truck,
      time: '',
      completed: orderDetails.currentStatus === 'delivered' || orderDetails.currentStatus === 'out_for_delivery',
      current: orderDetails.currentStatus === 'out_for_delivery',
    },
    {
      id: 'delivered',
      title: 'Delivered',
      description: 'Order has been delivered',
      icon: Package,
      time: '',
      completed: orderDetails.currentStatus === 'delivered',
      current: orderDetails.currentStatus === 'delivered',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header cartItemCount={0} />

      <div className="max-w-4xl mx-auto px-4 py-8 flex-grow">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">Thank you for your order</p>
        </div>

        {/* Order ID and Time */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left">
            <div>
              <p className="text-sm text-gray-500 mb-1">Order ID</p>
              <p className="font-semibold text-gray-900">{orderDetails.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Restaurant</p>
              <p className="font-semibold text-gray-900">{orderDetails.restaurant}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Estimated Time</p>
              <div className="flex items-center justify-center md:justify-start gap-2 text-orange-600 font-semibold">
                <Clock className="w-4 h-4" />
                <span>{orderDetails.estimatedTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Status Timeline */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Status</h2>

          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

            <div className="space-y-8">
              {statusSteps.map((step, index) => (
                <div key={step.id} className="relative flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center ${
                      step.completed
                        ? 'bg-green-600 text-white'
                        : step.current
                        ? 'bg-orange-600 text-white animate-pulse'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    <step.icon className="w-6 h-6" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-2">
                    <div className="flex items-center justify-between mb-1">
                      <h3
                        className={`font-semibold ${
                          step.completed || step.current ? 'text-gray-900' : 'text-gray-400'
                        }`}
                      >
                        {step.title}
                      </h3>
                      {step.time && (
                        <span className="text-sm text-gray-500">{step.time}</span>
                      )}
                    </div>
                    <p
                      className={`text-sm ${
                        step.completed || step.current ? 'text-gray-600' : 'text-gray-400'
                      }`}
                    >
                      {step.description}
                    </p>
                    {step.current && (
                      <span className="inline-block mt-2 px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                        In Progress
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>

          <div className="space-y-3 mb-4 pb-4 border-b">
            {orderDetails.items.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-gray-600">
                  {item.name} x{item.quantity}
                </span>
                <span className="font-medium text-gray-900">₹{item.price}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between font-semibold text-lg text-gray-900">
            <span>Total Amount</span>
            <span>₹{orderDetails.totalAmount}</span>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-orange-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Delivery Address</h3>
              <p className="text-gray-600">{orderDetails.deliveryAddress}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
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

        {/* Help Section */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 mb-2">Need help with your order?</p>
          <a href="#" className="text-orange-600 font-medium hover:underline">
            Contact Support
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}
