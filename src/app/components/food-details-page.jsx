import { Star, Plus, Minus, ShoppingCart, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "./header";
import { Footer } from "./footer";
import { useState } from "react";
import { Toast } from "./toast";

export function FoodDetailsPage() {
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [showToast, setShowToast] = useState(false);

  const foodItem = {
    id: 1,
    name: "Margherita Pizza",
    restaurant: "Pizza Palace",
    price: 299,
    description:
      "Classic Italian pizza topped with fresh tomatoes, mozzarella cheese, and basil leaves. Made with hand-tossed dough and baked to perfection in a wood-fired oven.",
    rating: 4.5,
    reviews: 156,
    veg: true,
    preparationTime: "20-25 mins",
  };

  const reviewsList = [
    {
      id: 1,
      user: "John Doe",
      rating: 5,
      comment: "Absolutely delicious! Best pizza in town.",
      date: "2026-01-25",
    },
    {
      id: 2,
      user: "Jane Smith",
      rating: 4,
      comment: "Great taste, but delivery was a bit slow.",
      date: "2026-01-24",
    },
    {
      id: 3,
      user: "Mike Johnson",
      rating: 5,
      comment: "Perfect cheese blend, highly recommended!",
      date: "2026-01-23",
    },
  ];

  const handleAddToCart = () => {
    setShowToast(true);
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }
    // Handle review submission
    setRating(0);
    setReview("");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header cartItemCount={3} />

      {showToast && (
        <Toast
          message="Item added to cart successfully!"
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 py-8 flex-grow">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-600 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Restaurants</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Food Image */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop"
              alt="Margherita Pizza"
              className="w-full h-96 object-cover"
            />
          </div>

          {/* Food Details */}
          <div className="bg-white rounded-lg shadow-md p-8">
            {/* Veg/Non-Veg Indicator */}
            <div className="flex items-center gap-2 mb-4">
              <span
                className={`w-5 h-5 border-2 ${
                  foodItem.veg
                    ? "border-green-600 bg-green-600"
                    : "border-red-600 bg-red-600"
                }`}
              ></span>
              <span className="text-sm text-gray-600">
                {foodItem.veg ? "Pure Vegetarian" : "Non-Vegetarian"}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {foodItem.name}
            </h1>
            <Link
              to="/restaurant/1"
              className="text-orange-600 hover:underline mb-4 inline-block"
            >
              {foodItem.restaurant}
            </Link>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-orange-500 text-orange-500" />
                <span className="font-semibold">{foodItem.rating}</span>
              </div>
              <span className="text-gray-500">
                ({foodItem.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <span className="text-3xl font-bold text-orange-600">
                ₹{foodItem.price}
              </span>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {foodItem.description}
              </p>
            </div>

            {/* Preparation Time */}
            <div className="mb-6 flex items-center gap-2 text-gray-600">
              <span className="font-medium">Preparation Time:</span>
              <span>{foodItem.preparationTime}</span>
            </div>

            {/* Quantity Selector */}
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

            {/* Total Price */}
            <div className="mb-6 p-4 bg-orange-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">
                  Total Price:
                </span>
                <span className="text-2xl font-bold text-orange-600">
                  ₹{foodItem.price * quantity}
                </span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-orange-600 text-white py-4 rounded-lg font-semibold hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>
          </div>
        </div>

        {/* Ratings & Reviews Section */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Ratings & Reviews
          </h2>

          {/* Average Rating */}
          <div className="flex items-center gap-8 mb-8 pb-8 border-b">
            <div className="text-center">
              <div className="text-5xl font-bold text-orange-600 mb-2">
                {foodItem.rating}
              </div>
              <div className="flex gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.floor(foodItem.rating)
                        ? "fill-orange-500 text-orange-500"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm text-gray-600">
                {foodItem.reviews} ratings
              </div>
            </div>

            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-3">
                Rating Distribution
              </h3>
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center gap-3 mb-2">
                  <span className="text-sm w-6">{stars}★</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500"
                      style={{
                        width: `${stars === 5 ? 60 : stars === 4 ? 30 : 10}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12">
                    {stars === 5 ? "94" : stars === 4 ? "47" : "15"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Add Review Form */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Write a Review
            </h3>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 cursor-pointer transition-colors ${
                          star <= rating
                            ? "fill-orange-500 text-orange-500"
                            : "text-gray-300 hover:text-orange-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review
                </label>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  placeholder="Share your experience..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700"
              >
                Submit Review
              </button>
            </form>
          </div>

          {/* Review List */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Customer Reviews
            </h3>
            <div className="space-y-6">
              {reviewsList.map((review) => (
                <div
                  key={review.id}
                  className="border-b border-gray-200 pb-6 last:border-0"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-semibold text-gray-900">
                        {review.user}
                      </div>
                      <div className="flex gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating
                                ? "fill-orange-500 text-orange-500"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
