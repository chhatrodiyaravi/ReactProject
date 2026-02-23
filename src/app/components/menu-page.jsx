import {
  Star,
  Clock,
  Plus,
  Minus,
  ShoppingCart,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export function MenuPage() {
  const [cart, setCart] = useState({});

  const menuItems = [
    {
      id: 1,
      name: "Margherita Pizza",
      price: 299,
      category: "Pizza",
      veg: true,
      image:
        "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=400&fit=crop",
    },
    {
      id: 2,
      name: "Pepperoni Pizza",
      price: 399,
      category: "Pizza",
      veg: false,
      image:
        "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=400&fit=crop",
    },
    {
      id: 3,
      name: "Veggie Supreme",
      price: 349,
      category: "Pizza",
      veg: true,
      image:
        "https://images.unsplash.com/photo-1511689660979-10d2b1aada49?w=400&h=400&fit=crop",
    },
    {
      id: 4,
      name: "Garlic Bread",
      price: 149,
      category: "Sides",
      veg: true,
      image:
        "https://images.unsplash.com/photo-1573140401552-3fab0b24306f?w=400&h=400&fit=crop",
    },
    {
      id: 5,
      name: "Caesar Salad",
      price: 199,
      category: "Salads",
      veg: true,
      image:
        "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=400&fit=crop",
    },
    {
      id: 6,
      name: "Chicken Wings",
      price: 279,
      category: "Sides",
      veg: false,
      image:
        "https://images.unsplash.com/photo-1608039755401-742074f0548d?w=400&h=400&fit=crop",
    },
  ];

  const addToCart = (itemId) => {
    setCart((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => {
      const newCart = { ...prev };
      if (newCart[itemId] > 1) {
        newCart[itemId]--;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
  };

  const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            to="/restaurants"
            className="text-gray-700 hover:text-orange-600"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Pizza Palace</h1>
          <Link to="/cart" className="relative">
            <ShoppingCart className="w-6 h-6 text-gray-700" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* Restaurant Banner */}
      <img
        src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=300&fit=crop"
        alt="Pizza Palace Restaurant"
        className="w-full h-48 object-cover"
      />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Restaurant Info */}
        <div className="bg-white rounded-lg shadow-md p-6 -mt-24 mb-6 relative z-0">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Pizza Palace
          </h2>
          <p className="text-gray-600 mb-4">Italian, Pizza, Fast Food</p>

          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 fill-orange-500 text-orange-500" />
              <span className="font-medium">4.5</span>
              <span className="text-gray-500">(200+ ratings)</span>
            </div>

            <div className="flex items-center gap-1">
              <Clock className="w-5 h-5 text-gray-500" />
              <span>30 mins</span>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Menu</h3>

          <div className="space-y-4">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md p-4 flex items-start gap-4"
              >
                {/* Item Image */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg flex-shrink-0 shadow-sm"
                />

                {/* Item Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`w-3 h-3 border-2 ${
                            item.veg
                              ? "border-green-600 bg-green-600"
                              : "border-red-600 bg-red-600"
                          }`}
                        ></span>
                        <h4 className="font-semibold text-gray-900">
                          {item.name}
                        </h4>
                      </div>
                      <p className="text-lg font-semibold text-orange-600">
                        ₹{item.price}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Delicious {item.name.toLowerCase()} with fresh
                        ingredients
                      </p>
                    </div>
                  </div>
                </div>

                {/* Add to Cart */}
                <div className="flex-shrink-0">
                  {cart[item.id] ? (
                    <div className="flex items-center gap-2 bg-orange-600 text-white rounded-lg px-2 py-1">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-6 h-6 flex items-center justify-center hover:bg-orange-700 rounded"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-6 text-center font-medium">
                        {cart[item.id]}
                      </span>
                      <button
                        onClick={() => addToCart(item.id)}
                        className="w-6 h-6 flex items-center justify-center hover:bg-orange-700 rounded"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(item.id)}
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cart Footer */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                {totalItems} items in cart
              </p>
              <p className="text-lg font-semibold text-gray-900">
                ₹
                {menuItems
                  .reduce(
                    (sum, item) => sum + (cart[item.id] || 0) * item.price,
                    0,
                  )
                  .toFixed(0)}
              </p>
            </div>
            <Link
              to="/cart"
              className="px-8 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700"
            >
              View Cart
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
