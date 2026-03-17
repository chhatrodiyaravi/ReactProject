import { ArrowLeft, Upload, Save } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { foodApi, restaurantApi } from "../../services/api";

export function AddFoodPage() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const { foodId } = useParams();
  const isEditMode = Boolean(foodId);
  const maxImageSize = 5 * 1024 * 1024;

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [existingImage, setExistingImage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    foodType: "veg",
    restaurant: "",
    image: null,
  });

  const categoryOptions = useMemo(
    () => ["Appetizer", "Main Course", "Dessert", "Beverage", "Snack", "Other"],
    [],
  );

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const res = await restaurantApi.list({
          owner: user?._id,
          includeInactive: true,
        });
        const ownerRestaurants = res.data || [];
        setRestaurants(ownerRestaurants);
        setForm((prev) => ({
          ...prev,
          restaurant: ownerRestaurants[0]?._id || "",
        }));
      } catch (err) {
        setError(err.message || "Failed to load restaurants");
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchRestaurants();
    }
  }, [user?._id]);

  useEffect(() => {
    const fetchFoodForEdit = async () => {
      if (!foodId) {
        return;
      }

      try {
        const res = await foodApi.getById(foodId);
        const food = res.data;
        setForm((prev) => ({
          ...prev,
          name: food.name || "",
          price: food.price || "",
          category: food.category || "",
          description: food.description || "",
          foodType: food.isVegetarian ? "veg" : "non-veg",
          restaurant: food.restaurant?._id || food.restaurant || "",
          image: null,
        }));
        setExistingImage(food.image || "");
      } catch (err) {
        setError(err.message || "Failed to load food details for edit");
      }
    };

    fetchFoodForEdit();
  }, [foodId]);

  const onChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => {
      if (!prev[field]) {
        return prev;
      }

      const nextErrors = { ...prev };
      delete nextErrors[field];
      return nextErrors;
    });
  };

  const validateForm = () => {
    const nextErrors = {};
    const trimmedName = form.name.trim();
    const trimmedDescription = form.description.trim();
    const parsedPrice = Number(form.price);

    if (!form.restaurant) {
      nextErrors.restaurant = "Please select a restaurant.";
    }

    if (!trimmedName) {
      nextErrors.name = "Food name is required.";
    } else if (trimmedName.length < 2) {
      nextErrors.name = "Food name must be at least 2 characters.";
    } else if (trimmedName.length > 100) {
      nextErrors.name = "Food name must be 100 characters or fewer.";
    }

    if (form.price === "") {
      nextErrors.price = "Price is required.";
    } else if (!Number.isFinite(parsedPrice)) {
      nextErrors.price = "Price must be a valid number.";
    } else if (parsedPrice <= 0) {
      nextErrors.price = "Price must be greater than 0.";
    }

    if (!form.category) {
      nextErrors.category = "Please choose a category.";
    } else if (!categoryOptions.includes(form.category)) {
      nextErrors.category = "Please choose a valid category.";
    }

    if (!trimmedDescription) {
      nextErrors.description = "Description is required.";
    } else if (trimmedDescription.length < 10) {
      nextErrors.description = "Description must be at least 10 characters.";
    } else if (trimmedDescription.length > 500) {
      nextErrors.description = "Description must be 500 characters or fewer.";
    }

    if (form.image) {
      if (!form.image.type.startsWith("image/")) {
        nextErrors.image = "Please upload a valid image file.";
      } else if (form.image.size > maxImageSize) {
        nextErrors.image = "Image size must be 5MB or less.";
      }
    }

    return nextErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const nextErrors = validateForm();
    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setError("Please correct the highlighted fields.");
      return;
    }

    setFieldErrors({});

    try {
      setSaving(true);
      const payload = new FormData();
      payload.append("name", form.name.trim());
      payload.append("price", String(Number(form.price)));
      payload.append("category", form.category);
      payload.append("description", form.description.trim());
      payload.append("restaurant", form.restaurant);
      payload.append("isVegetarian", String(form.foodType === "veg"));
      if (form.image) {
        payload.append("image", form.image);
      }

      if (isEditMode) {
        await foodApi.update({ id: foodId, body: payload, token });
      } else {
        await foodApi.create({ body: payload, token });
      }
      navigate("/owner-dashboard");
    } catch (err) {
      setError(err.message || "Failed to save food item");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            to="/owner-dashboard"
            className="text-gray-700 hover:text-blue-600"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">
            {isEditMode ? "Edit Food Item" : "Add New Food Item"}
          </h1>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-600">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-gray-600">Loading restaurants...</div>
          ) : restaurants.length === 0 ? (
            <div className="text-center py-8">
              <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 font-medium mb-2">
                  No Restaurant Found
                </p>
                <p className="text-sm text-yellow-700 mb-4">
                  You need to create a restaurant before adding food items.
                </p>
                <Link
                  to="/owner-dashboard"
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Go to Dashboard to Add Restaurant
                </Link>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Restaurant *
                </label>
                <select
                  value={form.restaurant}
                  onChange={(e) => onChange("restaurant", e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white ${
                    fieldErrors.restaurant
                      ? "border-red-400"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">Select your restaurant</option>
                  {restaurants.map((restaurant) => (
                    <option key={restaurant._id} value={restaurant._id}>
                      {restaurant.name}
                    </option>
                  ))}
                </select>
                {restaurants.length > 0 && (
                  <p className="mt-1 text-sm text-gray-500">
                    {restaurants.length} restaurant
                    {restaurants.length > 1 ? "s" : ""} available
                  </p>
                )}
                {fieldErrors.restaurant && (
                  <p className="mt-2 text-sm text-red-600">
                    {fieldErrors.restaurant}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Food Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => onChange("name", e.target.value)}
                  placeholder="Enter food item name"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                    fieldErrors.name ? "border-red-400" : "border-gray-300"
                  }`}
                />
                {fieldErrors.name && (
                  <p className="mt-2 text-sm text-red-600">
                    {fieldErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => onChange("price", e.target.value)}
                  placeholder="Enter price"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                    fieldErrors.price ? "border-red-400" : "border-gray-300"
                  }`}
                />
                {fieldErrors.price && (
                  <p className="mt-2 text-sm text-red-600">
                    {fieldErrors.price}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={form.category}
                  onChange={(e) => onChange("category", e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                    fieldErrors.category ? "border-red-400" : "border-gray-300"
                  }`}
                >
                  <option value="">Select a category</option>
                  {categoryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {fieldErrors.category && (
                  <p className="mt-2 text-sm text-red-600">
                    {fieldErrors.category}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Food Type *
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="foodType"
                      value="veg"
                      checked={form.foodType === "veg"}
                      onChange={(e) => onChange("foodType", e.target.value)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">🟢 Veg</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="foodType"
                      value="non-veg"
                      checked={form.foodType === "non-veg"}
                      onChange={(e) => onChange("foodType", e.target.value)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">🔴 Non-Veg</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => onChange("description", e.target.value)}
                  placeholder="Enter food description"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none ${
                    fieldErrors.description
                      ? "border-red-400"
                      : "border-gray-300"
                  }`}
                ></textarea>
                {fieldErrors.description && (
                  <p className="mt-2 text-sm text-red-600">
                    {fieldErrors.description}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Image
                </label>
                <label
                  className={`border-2 border-dashed rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer block ${
                    fieldErrors.image ? "border-red-400" : "border-gray-300"
                  }`}
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      onChange("image", e.target.files?.[0] || null)
                    }
                  />
                  {form.image && (
                    <p className="mt-2 text-sm text-blue-600">
                      Selected: {form.image.name}
                    </p>
                  )}
                  {!form.image && existingImage && (
                    <p className="mt-2 text-sm text-gray-600">
                      Current image kept
                    </p>
                  )}
                </label>
                {fieldErrors.image && (
                  <p className="mt-2 text-sm text-red-600">
                    {fieldErrors.image}
                  </p>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <Save className="w-5 h-5" />
                  {saving
                    ? "Saving..."
                    : isEditMode
                      ? "Update Food Item"
                      : "Save Food Item"}
                </button>
                <Link
                  to="/owner-dashboard"
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 flex items-center justify-center"
                >
                  Cancel
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
