import { Package, Eye, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Header } from './header';
import { Footer } from './footer';

export function OrdersPage() {
  const orders = [
    {
      id: 1,
      orderId: 'ORD12345ABC',
      restaurant: 'Pizza Palace',
      items: 3,
      total: 746,
      date: '2026-01-26',
      status: 'delivered',
      image: 'from-orange-200 to-orange-400',
    },
    {
      id: 2,
      orderId: 'ORD67890DEF',
      restaurant: 'Burger Kingdom',
      items: 2,
      total: 450,
      date: '2026-01-25',
      status: 'preparing',
      image: 'from-red-200 to-red-400',
    },
    {
      id: 3,
      orderId: 'ORD11223GHI',
      restaurant: 'Biryani House',
      items: 4,
      total: 890,
      date: '2026-01-24',
      status: 'cancelled',
      image: 'from-yellow-200 to-yellow-400',
    },
    {
      id: 4,
      orderId: 'ORD44556JKL',
      restaurant: 'Chinese Wok',
      items: 2,
      total: 550,
      date: '2026-01-23',
      status: 'out_for_delivery',
      image: 'from-green-200 to-green-400',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'preparing':
        return 'bg-blue-100 text-blue-700';
      case 'out_for_delivery':
        return 'bg-purple-100 text-purple-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered':
        return 'Delivered';
      case 'preparing':
        return 'Preparing';
      case 'out_for_delivery':
        return 'Out for Delivery';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header cartItemCount={3} />

      <div className="max-w-7xl mx-auto px-4 py-8 flex-grow">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-orange-600">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>

        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Restaurant Image */}
                  <div className={`w-full md:w-32 h-32 bg-gradient-to-br ${order.image} rounded-lg flex-shrink-0`}></div>

                  {/* Order Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {order.restaurant}
                        </h3>
                        <p className="text-sm text-gray-500">Order #{order.orderId}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusText(order.status)}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                      <span>{order.items} items</span>
                      <span>•</span>
                      <span>₹{order.total}</span>
                      <span>•</span>
                      <span>{order.date}</span>
                    </div>

                    <div className="flex gap-3">
                      <Link
                        to="/order-status"
                        className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        Track Order
                      </Link>
                      {order.status === 'delivered' && (
                        <button className="px-4 py-2 border border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 text-sm font-medium">
                          Reorder
                        </button>
                      )}
                      {order.status === 'delivered' && (
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium">
                          Rate Order
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-600 mb-6">
              You haven't placed any orders. Start exploring delicious food!
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

      <Footer />
    </div>
  );
}
