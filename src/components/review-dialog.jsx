import { useState } from "react";
import { X, Star, Send, Loader, AlertCircle } from "lucide-react";
import { reviewApi } from "../services/api";

export function ReviewDialog({
  isOpen,
  onClose,
  orderItem,
  token,
  onReviewSubmitted,
}) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    if (!title.trim() || !comment.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    if (comment.length < 10) {
      setError("Review comment must be at least 10 characters");
      return;
    }

    setLoading(true);

    try {
      await reviewApi.create({
        body: {
          foodId: orderItem.food?._id || orderItem.food,
          restaurantId: orderItem.restaurant?._id || orderItem.restaurant,
          rating,
          title,
          comment,
        },
        token,
      });

      setSuccess(true);
      setRating(0);
      setTitle("");
      setComment("");

      setTimeout(() => {
        setSuccess(false);
        if (onReviewSubmitted) {
          onReviewSubmitted();
        }
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Rate & Review</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Food Item Info */}
          <div className="mb-6 pb-4 border-b">
            <h3 className="font-semibold text-gray-900">
              {orderItem.name || "Food Item"}
            </h3>
            <p className="text-sm text-gray-500">
              {orderItem.restaurant?.name || "Restaurant"}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-600 font-medium">
                ✓ Review submitted successfully!
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Rating Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating *
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    onMouseEnter={() => setHoverRating(value)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none transition-transform hover:scale-110"
                    disabled={loading}
                  >
                    <Star
                      className={`w-8 h-8 ${
                        value <= (hoverRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value.slice(0, 100))}
                placeholder="Great food!"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                disabled={loading}
                maxLength={100}
              />
              <p className="text-xs text-gray-500 mt-1">
                {title.length}/100 characters
              </p>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review *
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value.slice(0, 1000))}
                placeholder="Tell us about your experience..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent min-h-[120px]"
                disabled={loading}
                maxLength={1000}
              />
              <p className="text-xs text-gray-500 mt-1">
                {comment.length}/1000 characters (min 10)
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Submit Review</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

