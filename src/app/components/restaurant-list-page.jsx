import { Search, Filter, Star, Clock } from "lucide-react";
import { Link } from "react-router-dom";

export function RestaurantListPage() {
  const restaurants = [
    {
      id: 1,
      name: "Pizza Palace",
      rating: 4.5,
      time: "30 mins",
      veg: true,
      image:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&h=300&fit=crop",
    },
    {
      id: 2,
      name: "Burger Kingdom",
      rating: 4.3,
      time: "25 mins",
      veg: false,
      image:
        "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&h=300&fit=crop",
    },
    {
      id: 3,
      name: "Biryani House",
      rating: 4.7,
      time: "40 mins",
      veg: false,
      image:
        "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&h=300&fit=crop",
    },
    {
      id: 4,
      name: "Chinese Wok",
      rating: 4.2,
      time: "35 mins",
      veg: true,
      image:
        "https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=500&h=300&fit=crop",
    },
    {
      id: 5,
      name: "Sushi Station",
      rating: 4.6,
      time: "45 mins",
      veg: false,
      image:
        "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500&h=300&fit=crop",
    },
    {
      id: 6,
      name: "Pasta Paradise",
      rating: 4.4,
      time: "30 mins",
      veg: true,
      image:
        "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&h=300&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-4">
            <Link to="/" className="text-2xl font-bold text-orange-600">
              FoodHub
            </Link>
            <Link
              to="/profile"
              className="px-4 py-2 text-gray-700 hover:text-orange-600"
            >
              Profile
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex items-center bg-gray-100 rounded-lg p-3">
            <Search className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search for restaurants..."
              className="flex-1 bg-transparent outline-none"
            />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Filters */}
        <div className="mb-6">
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            <button className="px-4 py-2 bg-white rounded-lg border border-gray-300 flex items-center gap-2 hover:border-orange-600 whitespace-nowrap">
              <Filter className="w-4 h-4" />
              Filters
            </button>
            <button className="px-4 py-2 bg-white rounded-lg border border-orange-600 text-orange-600 whitespace-nowrap">
              Veg Only
            </button>
            <button className="px-4 py-2 bg-white rounded-lg border border-gray-300 hover:border-orange-600 whitespace-nowrap">
              Rating 4.0+
            </button>
            <button className="px-4 py-2 bg-white rounded-lg border border-gray-300 hover:border-orange-600 whitespace-nowrap">
              Fast Delivery
            </button>
            <button className="px-4 py-2 bg-white rounded-lg border border-gray-300 hover:border-orange-600 whitespace-nowrap">
              Low Price
            </button>
          </div>
        </div>

        {/* Restaurant Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <Link
              key={restaurant.id}
              to={`/menu/${restaurant.id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Restaurant Image */}
              <div className="h-48 relative overflow-hidden">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
                {restaurant.veg && (
                  <div className="absolute top-3 left-3 bg-green-600 text-white text-xs px-2 py-1 rounded">
                    Pure Veg
                  </div>
                )}
              </div>

              {/* Restaurant Info */}
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  {restaurant.name}
                </h3>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-orange-500 text-orange-500" />
                    <span className="font-medium">{restaurant.rating}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{restaurant.time}</span>
                  </div>
                </div>

                <div className="mt-3 text-sm text-gray-500">
                  Italian, Pizza, Fast Food
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
