import { useState, useEffect } from "react";
import { Star, ThumbsUp, Loader, AlertCircle } from "lucide-react";
import { reviewApi } from "../services/api";

export function ReviewsList({ foodId, restaurantId, type = "food" }) {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const [totalPages, setTotalPages] = useState(1);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError("");

      let response;
      if (type === "food") {
        response = await reviewApi.getFoodReviews({
          foodId,
          page,
          limit: 5,
          sortBy,
        });
      } else {
        response = await reviewApi.getRestaurantReviews({
          restaurantId,
          page,
          limit: 5,
        });
      }

      setReviews(response.data);
      setStats(response.stats);
      setTotalPages(response.pagination?.pages || 1);
    } catch (err) {
      setError(err.message || "Failed to load reviews");
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [foodId, restaurantId, page, sortBy, type]);

  const handleHelpful = async (reviewId) => {
    try {
      await reviewApi.markHelpful({ id: reviewId, token: "" });
      // Refetch reviews to update helpful count
      fetchReviews();
    } catch (err) {
      console.error("Failed to mark helpful:", err);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <Loader className="w-8 h-8 animate-spin text-orange-600 mx-auto" />
        <p className="text-gray-600 mt-2">Loading reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      {stats && reviews.length > 0 && (
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-orange-600">
                {stats.averageRating?.toFixed(1) || "0"}
              </div>
              <div className="flex gap-1 mt-2">
                {renderStars(Math.round(stats.averageRating || 0))}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Based on {stats.totalReviews || 0} reviews
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sort Options */}
      {type === "food" && reviews.length > 0 && (
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Reviews</h3>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
          >
            <option value="newest">Newest</option>
            <option value="helpful">Most Helpful</option>
            <option value="rating_high">Highest Rating</option>
            <option value="rating_low">Lowest Rating</option>
          </select>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              {/* Review Header */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex gap-2 items-center mb-1">
                    <div className="flex gap-1">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {review.rating}.0
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-900">
                    {review.title}
                  </h4>
                </div>
              </div>

              {/* Review Body */}
              <p className="text-gray-700 mb-3">{review.comment}</p>

              {/* Review Metadata */}
              <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-4">
                  <span>By {review.user?.name || "Anonymous"}</span>
                  <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                  {review.isVerifiedPurchase && (
                    <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">
                      Verified Purchase
                    </span>
                  )}
                </div>

                {/* Helpful Button */}
                <button
                  onClick={() => handleHelpful(review._id)}
                  className="flex items-center gap-1 text-gray-500 hover:text-orange-600 transition-colors"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-xs">{review.helpful || 0}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">
            No reviews yet. Be the first to share your experience!
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-10 h-10 rounded-lg transition-colors ${
                  p === page
                    ? "bg-orange-600 text-white"
                    : "border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

