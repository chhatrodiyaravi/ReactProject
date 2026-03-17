import { Star, Plus, Minus, ShoppingCart, ArrowLeft } from "lucide-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { ReviewForm } from "../components/review-form";
import { ReviewsList } from "../components/reviews-list";
import { useEffect, useMemo, useState } from "react";
import { Toast } from "../components/toast";
import { useAuth } from "../context/AuthContext";
import { cartApi, foodApi } from "../services/api";

// Helper function to get full image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http")) return imagePath;
  const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  return `${apiBaseUrl}${imagePath}`;
};

export function FoodDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { token, isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [foodItem, setFoodItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewRefresh, setReviewRefresh] = useState(0);

  useEffect(() => {
    const fetchFood = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await foodApi.getById(id);
        setFoodItem(res.data);
      } catch (err) {
        setError(err.message || "Failed to load food details");
      } finally {
        setLoading(false);
      }
    };

    fetchFood();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated || !token || !foodItem?._id) {
      if (!isAuthenticated || !token) {
        navigate("/login", {
          state: {
            from: location.pathname,
            message: "Please login to add items to cart.",
          },
        });
      }
      return;
    }

    try {
      await cartApi.add({
        body: { foodId: foodItem._id, quantity },
        token,
      });
      setShowToast(true);
    } catch {
      setError("Failed to add item to cart");
    }
  };

  const totalPrice = useMemo(
    () => (foodItem?.price || 0) * quantity,
    [foodItem, quantity],
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      {showToast && (
        <Toast
          message="Item added to cart successfully!"
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 py-8 flex-grow">
        <Link
          to="/restaurants"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-600 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Restaurants</span>
        </Link>

        {loading ? (
          <div className="text-center py-16 text-gray-600">
            Loading food details...
          </div>
        ) : error || !foodItem ? (
          <div className="text-center py-16 text-red-600">
            {error || "Food item not found"}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={
                    foodItem.image
                      ? getImageUrl(foodItem.image)
                      : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop"
                  }
                  alt={foodItem.name}
                  className="w-full h-96 object-cover"
                />
              </div>

              <div className="bg-white rounded-lg shadow-md p-8">
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className={`w-5 h-5 border-2 ${
                      foodItem.isVegetarian
                        ? "border-green-600 bg-green-600"
                        : "border-red-600 bg-red-600"
                    }`}
                  ></span>
                  <span className="text-sm text-gray-600">
                    {foodItem.isVegetarian
                      ? "Pure Vegetarian"
                      : "Non-Vegetarian"}
                  </span>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {foodItem.name}
                </h1>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-orange-500 text-orange-500" />
                    <span className="font-semibold">
                      {foodItem.rating || 0}
                    </span>
                  </div>
                  <span className="text-gray-500">
                    ({foodItem.totalReviews || 0} reviews)
                  </span>
                </div>

                <div className="mb-6">
                  <span className="text-3xl font-bold text-orange-600">
                    ₹{foodItem.price}
                  </span>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Description
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {foodItem.description}
                  </p>
                </div>

                <div className="mb-6 flex items-center gap-2 text-gray-600">
                  <span className="font-medium">Preparation Time:</span>
                  <span>{foodItem.preparationTime || 30} mins</span>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-xl font-semibold w-12 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mb-6 p-4 bg-orange-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">
                      Total Price:
                    </span>
                    <span className="text-2xl font-bold text-orange-600">
                      ₹{totalPrice}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full bg-orange-600 text-white py-4 rounded-lg font-semibold hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <ReviewsList foodId={id} type="food" key={reviewRefresh} />
              </div>

              <div>
                {isAuthenticated && token ? (
                  <ReviewForm
                    foodId={id}
                    restaurantId={foodItem.restaurant}
                    token={token}
                    onReviewSubmitted={() =>
                      setReviewRefresh((prev) => prev + 1)
                    }
                  />
                ) : (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-700">
                      <Link
                        to="/login"
                        className="font-semibold hover:underline"
                      >
                        Sign in
                      </Link>{" "}
                      to write a review
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
