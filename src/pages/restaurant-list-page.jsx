import { Search, Filter, Star, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { restaurantApi } from "../services/api";

// Helper function to get full image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http")) return imagePath;
  const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  return `${apiBaseUrl}${imagePath}`;
};

export function RestaurantListPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState("");
  const [vegOnly, setVegOnly] = useState(false);
  const [sortBy, setSortBy] = useState("rating");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await restaurantApi.list({ search: search.trim() });
        setRestaurants(res.data || []);
      } catch (err) {
        setError(err.message || "Failed to load restaurants");
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchRestaurants, 250);
    return () => clearTimeout(timer);
  }, [search]);

  const filteredRestaurants = useMemo(() => {
    let filtered = restaurants.filter((restaurant) => {
      // Veg only filter
      const isVeg = (restaurant.cuisine || []).some((cuisine) =>
        ["veg", "vegetarian", "pure veg"].includes(cuisine?.toLowerCase()),
      );
      const matchesVeg = !vegOnly || isVeg;

      return matchesVeg;
    });

    // Sort restaurants
    if (sortBy === "rating") {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "name") {
      filtered.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    }

    return filtered;
  }, [restaurants, search, vegOnly, sortBy]);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Browse Restaurants
            </h1>

            {/* Search Bar */}
            <div className="flex items-center bg-white rounded-lg shadow-sm p-4 mb-4">
              <Search className="w-5 h-5 text-gray-400 mr-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search restaurants by name or cuisine..."
                className="flex-1 outline-none text-gray-900 placeholder-gray-500"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 flex-wrap">
              <button
                onClick={() => setVegOnly(!vegOnly)}
                className={`px-4 py-2 rounded-lg border font-medium whitespace-nowrap transition-colors ${
                  vegOnly
                    ? "border-orange-600 bg-orange-50 text-orange-600"
                    : "border-gray-300 bg-white text-gray-700 hover:border-orange-600"
                }`}
              >
                {vegOnly ? "✓ Veg Only" : "Veg Only"}
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:border-orange-600 cursor-pointer font-medium"
              >
                <option value="rating">Sort by Rating</option>
                <option value="name">Sort by Name</option>
              </select>

              {(search || vegOnly) && (
                <button
                  onClick={() => {
                    setSearch("");
                    setVegOnly(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 font-medium whitespace-nowrap"
                >
                  Clear Filters
                </button>
              )}
            </div>

            {/* Results Count */}
            {!loading && !error && (
              <p className="text-sm text-gray-600 mt-4">
                Found {filteredRestaurants.length} restaurant
                {filteredRestaurants.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          {loading ? (
            <div className="text-center py-16 text-gray-600">
              <div className="animate-spin w-12 h-12 border-4 border-gray-300 border-t-orange-600 rounded-full mx-auto mb-4"></div>
              Loading restaurants...
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 inline-block">
                <p className="text-red-600 font-medium">{error}</p>
              </div>
            </div>
          ) : filteredRestaurants.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 inline-block">
                <p className="text-blue-600 font-medium">
                  No restaurants found matching your filters.
                </p>
                {(search || vegOnly) && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setVegOnly(false);
                    }}
                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map((restaurant) => (
                <Link
                  key={restaurant._id}
                  to={`/menu/${restaurant._id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="h-48 relative overflow-hidden">
                    <img
                      src={
                        restaurant.image
                          ? getImageUrl(restaurant.image)
                          : "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&h=300&fit=crop"
                      }
                      alt={restaurant.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      {restaurant.name}
                    </h3>

                    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-orange-500 text-orange-500" />
                        <span className="font-medium">
                          {restaurant.rating || 0}
                        </span>
                        <span className="text-gray-500">
                          ({restaurant.totalReviews || 0})
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>
                          {restaurant.deliveryTime?.min || 30}-
                          {restaurant.deliveryTime?.max || 40} mins
                        </span>
                      </div>
                    </div>

                    <div className="text-sm text-gray-500">
                      {(restaurant.cuisine || []).join(", ") ||
                        "Various cuisines"}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
