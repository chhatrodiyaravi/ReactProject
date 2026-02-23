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
import { Header } from "./header";
import { Footer } from "./footer";
import { useState, useEffect } from "react";

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [location, setLocation] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);

  const sliderData = [
    {
      id: 1,
      title: "Order Your Favorite Food",
      subtitle: "Delicious meals delivered to your doorstep",
      image:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=500&fit=crop",
      bgColor: "from-orange-500 to-orange-600",
    },
    {
      id: 2,
      title: "Fresh & Tasty Pizza",
      subtitle: "Authentic Italian pizza made with love",
      image:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&h=500&fit=crop",
      bgColor: "from-red-500 to-red-600",
    },
    {
      id: 3,
      title: "Burgers & More",
      subtitle: "Juicy burgers delivered hot & fresh",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&h=500&fit=crop",
      bgColor: "from-yellow-500 to-yellow-600",
    },
    {
      id: 4,
      title: "Authentic Indian Cuisine",
      subtitle: "Experience the flavors of India",
      image:
        "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=1200&h=500&fit=crop",
      bgColor: "from-green-500 to-green-600",
    },
  ];

  // Auto-play slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderData.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + sliderData.length) % sliderData.length,
    );
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const categories = [
    { id: "all", name: "All", icon: "🍽️" },
    { id: "pizza", name: "Pizza", icon: "🍕" },
    { id: "burger", name: "Burger", icon: "🍔" },
    { id: "biryani", name: "Biryani", icon: "🍛" },
    { id: "chinese", name: "Chinese", icon: "🥡" },
    { id: "desserts", name: "Desserts", icon: "🍰" },
  ];

  const restaurants = [
    {
      id: 1,
      name: "Pizza Palace",
      cuisine: "Italian, Pizza",
      rating: 4.5,
      reviews: 200,
      time: "30 mins",
      price: "₹300 for two",
      category: "pizza",
      image:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&h=300&fit=crop",
    },
    {
      id: 2,
      name: "Burger Kingdom",
      cuisine: "American, Fast Food",
      rating: 4.3,
      reviews: 150,
      time: "25 mins",
      price: "₹250 for two",
      category: "burger",
      image:
        "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&h=300&fit=crop",
    },
    {
      id: 3,
      name: "Biryani House",
      cuisine: "Indian, Biryani",
      rating: 4.7,
      reviews: 320,
      time: "40 mins",
      price: "₹400 for two",
      category: "biryani",
      image:
        "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&h=300&fit=crop",
    },
    {
      id: 4,
      name: "Chinese Wok",
      cuisine: "Chinese, Asian",
      rating: 4.2,
      reviews: 180,
      time: "35 mins",
      price: "₹350 for two",
      category: "chinese",
      image:
        "https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=500&h=300&fit=crop",
    },
    {
      id: 5,
      name: "Sweet Delights",
      cuisine: "Desserts, Bakery",
      rating: 4.6,
      reviews: 250,
      time: "20 mins",
      price: "₹200 for two",
      category: "desserts",
      image:
        "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&h=300&fit=crop",
    },
    {
      id: 6,
      name: "Pasta Paradise",
      cuisine: "Italian, Pasta",
      rating: 4.4,
      reviews: 140,
      time: "30 mins",
      price: "₹350 for two",
      category: "pizza",
      image:
        "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&h=300&fit=crop",
    },
  ];

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesCategory =
      selectedCategory === "all" || restaurant.category === selectedCategory;
    const matchesSearch =
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header cartItemCount={3} />

      {/* Hero Slider Section */}
      <div className="relative overflow-hidden">
        {/* Slider Container */}
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {sliderData.map((slide, index) => (
            <div key={slide.id} className="min-w-full relative">
              {/* Background Image */}
              <div className="relative h-[500px]">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                {/* Dark gradient at bottom for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>

              {/* Content */}
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

                  {/* Search Section - Only show on first slide */}
                  {index === 0 && (
                    <div className="max-w-3xl">
                      {/* Location Input */}
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

                      {/* Search Bar */}
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

        {/* Navigation Arrows */}
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

        {/* Dots Navigation */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {sliderData.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
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
        {/* Category Filters */}
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

        {/* Filter Bar */}
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

        {/* Restaurant Grid */}
        {filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <Link
                key={restaurant.id}
                to={`/restaurant/${restaurant.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Restaurant Image */}
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="h-48 w-full object-cover"
                />

                {/* Restaurant Info */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {restaurant.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {restaurant.cuisine}
                  </p>

                  <div className="flex items-center justify-between text-sm mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-orange-500 text-orange-500" />
                      <span className="font-medium">{restaurant.rating}</span>
                      <span className="text-gray-500">
                        ({restaurant.reviews})
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{restaurant.time}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500">{restaurant.price}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* No Results UI */
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
