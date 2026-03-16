import {
  Search,
  MapPin,
  Star,
  Clock,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { useState, useEffect } from "react";
import { restaurantApi } from "../services/api";

// Helper function to get full image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http")) return imagePath;
  const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  return `${apiBaseUrl}${imagePath}`;
};

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [location, setLocation] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [restaurants, setRestaurants] = useState([]);
  const [loadingRestaurants, setLoadingRestaurants] = useState(true);
  const [loadError, setLoadError] = useState("");

  const sliderData = [
    {
      id: 1,
      title: "Order Your Favorite Food",
      subtitle: "Delicious meals delivered to your doorstep",
      image:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=500&fit=crop",
    },
    {
      id: 2,
      title: "Fresh & Tasty Pizza",
      subtitle: "Authentic Italian pizza made with love",
      image:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&h=500&fit=crop",
    },
    {
      id: 3,
      title: "Burgers & More",
      subtitle: "Juicy burgers delivered hot & fresh",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&h=500&fit=crop",
    },
    {
      id: 4,
      title: "Authentic Indian Cuisine",
      subtitle: "Experience the flavors of India",
      image:
        "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=1200&h=500&fit=crop",
    },
  ];

  useEffect(() => {
    if (searchQuery) {
      return;
    }

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [searchQuery, sliderData.length]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoadingRestaurants(true);
        setLoadError("");
        const res = await restaurantApi.list();
        setRestaurants(res.data || []);
      } catch (error) {
        setLoadError(error.message || "Failed to load restaurants");
      } finally {
        setLoadingRestaurants(false);
      }
    };

    fetchRestaurants();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderData.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + sliderData.length) % sliderData.length,
    );
  };

  const categoryIcons = {
    all: "🍽️",
    pizza: "🍕",
    burger: "🍔",
    biryani: "🍛",
    chinese: "🥡",
    desserts: "🍰",
  };

  const uniqueCuisineCategories = [
    ...new Set(
      restaurants
        .flatMap((restaurant) => restaurant.cuisine || [])
        .map((item) => item?.toString().toLowerCase().trim())
        .filter(Boolean),
    ),
  ];

  const categories = [
    { id: "all", name: "All", icon: categoryIcons.all },
    ...uniqueCuisineCategories.map((category) => ({
      id: category,
      name: category.charAt(0).toUpperCase() + category.slice(1),
      icon: categoryIcons[category] || "🍴",
    })),
  ];

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const cuisines = restaurant.cuisine || [];
    const cuisineText = cuisines.join(", ").toLowerCase();
    const matchesCategory =
      selectedCategory === "all" ||
      cuisines.some((item) => item?.toLowerCase() === selectedCategory);
    const matchesSearch =
      restaurant.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cuisineText.includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {sliderData.map((slide, index) => (
            <div key={slide.id} className="min-w-full relative">
              <div className="relative h-[500px]">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>

              <div className="absolute inset-0 flex items-center">
                <div className="max-w-7xl mx-auto px-4 py-12 w-full">
                  <h1
                    className="text-4xl md:text-6xl font-bold mb-4 text-white drop-shadow-2xl"
                    style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.8)" }}
                  >
                    {slide.title}
                  </h1>
                  <p
                    className="text-xl md:text-2xl mb-8 text-white drop-shadow-xl"
                    style={{ textShadow: "1px 1px 6px rgba(0,0,0,0.8)" }}
                  >
                    {slide.subtitle}
                  </p>

                  {index === 0 && (
                    <div className="max-w-3xl">
                      <div className="bg-white rounded-lg shadow-lg p-2 mb-4">
                        <div className="flex items-center">
                          <MapPin className="w-5 h-5 text-gray-400 mx-3" />
                          <input
                            type="text"
                            placeholder="Enter your delivery location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="flex-1 py-3 px-2 outline-none text-gray-800"
                          />
                        </div>
                      </div>

                      <div className="bg-white rounded-lg shadow-lg p-2">
                        <div className="flex items-center">
                          <Search className="w-5 h-5 text-gray-400 mx-3" />
                          <input
                            type="text"
                            placeholder="Search for restaurants or cuisines"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 py-3 px-2 outline-none text-gray-800"
                          />
                          <button className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors">
                            Search
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all z-10"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all z-10"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {sliderData.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                currentSlide === index
                  ? "bg-white w-8"
                  : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 flex-grow">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Browse by Category
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg border-2 transition-all whitespace-nowrap ${
                  selectedCategory === category.id
                    ? "border-orange-600 bg-orange-50 text-orange-600"
                    : "border-gray-200 bg-white text-gray-700 hover:border-orange-300"
                }`}
              >
                <span className="text-2xl">{category.icon}</span>
                <span className="font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            {selectedCategory === "all"
              ? "All Restaurants"
              : categories.find((c) => c.id === selectedCategory)?.name}
            <span className="text-gray-500 text-lg ml-2">
              ({filteredRestaurants.length})
            </span>
          </h2>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-orange-600">
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>

        {loadingRestaurants ? (
          <div className="text-center py-16 text-gray-600">
            Loading restaurants...
          </div>
        ) : loadError ? (
          <div className="text-center py-16 text-red-600">{loadError}</div>
        ) : filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <Link
                key={restaurant._id}
                to={`/menu/${restaurant._id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                <img
                  src={
                    restaurant.image
                      ? getImageUrl(restaurant.image)
                      : "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&h=300&fit=crop"
                  }
                  alt={restaurant.name}
                  className="h-48 w-full object-cover"
                />

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {restaurant.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {(restaurant.cuisine || []).join(", ") ||
                      "Various cuisines"}
                  </p>

                  <div className="flex items-center justify-between text-sm mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-orange-500 text-orange-500" />
                      <span className="font-medium">
                        {restaurant.rating || 0}
                      </span>
                      <span className="text-gray-500">
                        ({restaurant.totalReviews || 0})
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>30-40 mins</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500">
                    {restaurant.address?.city || "Location not available"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No restaurants found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

