const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, { method = "GET", body, token } = {}) {
  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;
  const headers = isFormData ? {} : { "Content-Type": "application/json" };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });

  let payload;
  try {
    payload = await response.json();
  } catch {
    payload = { success: false, message: "Invalid server response" };
  }

  // Log request details for debugging
  console.log(`[API] ${method} ${path}`, {
    status: response.status,
    success: payload?.success,
    message: payload?.message,
  });

  if (!response.ok || payload?.success === false) {
    throw new Error(
      payload?.message || `Request failed with ${response.status}`,
    );
  }

  return payload;
}

export const authApi = {
  register: (body) => request("/auth/register", { method: "POST", body }),
  login: (body) => request("/auth/login", { method: "POST", body }),
  me: (token) => request("/auth/me", { token }),
};

export const userApi = {
  list: (token) => request("/users", { token }),
  getById: ({ id, token }) => request(`/users/${id}`, { token }),
  update: ({ id, body, token }) =>
    request(`/users/${id}`, { method: "PUT", body, token }),
  remove: ({ id, token }) =>
    request(`/users/${id}`, { method: "DELETE", token }),
};

export const restaurantApi = {
  list: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        query.append(key, value);
      }
    });
    return request(
      `/restaurants${query.toString() ? `?${query.toString()}` : ""}`,
    );
  },
  getById: (id) => request(`/restaurants/${id}`),
  create: ({ body, token }) => {
    const formData = new FormData();

    // Add simple fields
    formData.append("name", body.name || "");
    formData.append("description", body.description || "");
    formData.append("phone", body.phone || "");
    formData.append("email", body.email || "");

    // Add nested address object
    if (body.address) {
      Object.entries(body.address).forEach(([key, value]) => {
        formData.append(`address[${key}]`, value || "");
      });
    }

    // Add cuisine array
    if (body.cuisine && Array.isArray(body.cuisine)) {
      body.cuisine.forEach((c, index) => {
        formData.append(`cuisine[${index}]`, c);
      });
    }

    // Add image if provided
    if (body.image instanceof File) {
      formData.append("image", body.image);
    }

    return request("/restaurants", {
      method: "POST",
      body: formData,
      token,
    });
  },
  update: ({ id, body, token }) => {
    // Handle file uploads with FormData
    if (body.image instanceof File) {
      const formData = new FormData();

      // Add all fields to FormData
      Object.entries(body).forEach(([key, value]) => {
        if (key === "image" && value instanceof File) {
          formData.append(key, value);
        } else if (key === "address" && typeof value === "object") {
          Object.entries(value).forEach(([addressKey, addressValue]) => {
            formData.append(`address[${addressKey}]`, addressValue || "");
          });
        } else if (key === "cuisine" && Array.isArray(value)) {
          value.forEach((c, index) => {
            formData.append(`cuisine[${index}]`, c);
          });
        } else if (key !== "image") {
          formData.append(key, value || "");
        }
      });

      return request(`/restaurants/${id}`, {
        method: "PUT",
        body: formData,
        token,
      });
    }

    return request(`/restaurants/${id}`, { method: "PUT", body, token });
  },
  remove: ({ id, token }) =>
    request(`/restaurants/${id}`, { method: "DELETE", token }),
};

export const foodApi = {
  list: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        query.append(key, value);
      }
    });
    return request(`/foods${query.toString() ? `?${query.toString()}` : ""}`);
  },
  getById: (id) => request(`/foods/${id}`),
  create: ({ body, token }) =>
    request("/foods", { method: "POST", body, token }),
  update: ({ id, body, token }) =>
    request(`/foods/${id}`, { method: "PUT", body, token }),
  remove: ({ id, token }) =>
    request(`/foods/${id}`, { method: "DELETE", token }),
};

export const cartApi = {
  get: (token) => request("/cart", { token }),
  add: ({ body, token }) => request("/cart", { method: "POST", body, token }),
  updateItem: ({ itemId, body, token }) =>
    request(`/cart/${itemId}`, { method: "PUT", body, token }),
  removeItem: ({ itemId, token }) =>
    request(`/cart/${itemId}`, { method: "DELETE", token }),
  clear: (token) => request("/cart", { method: "DELETE", token }),
};

export const orderApi = {
  create: ({ body, token }) =>
    request("/orders", { method: "POST", body, token }),
  getAll: (token) => request("/orders", { token }),
  getMine: (token) => request("/orders/myorders", { token }),
  getById: ({ id, token }) => request(`/orders/${id}`, { token }),
  updateStatus: ({ id, body, token }) =>
    request(`/orders/${id}/status`, { method: "PUT", body, token }),
};

export const adminApi = {
  dashboard: (token) => request("/admin/dashboard", { token }),
  createUser: ({ body, token }) =>
    request("/admin/users", {
      method: "POST",
      body,
      token,
    }),
  restaurants: ({ token, status, suspended } = {}) => {
    const query = new URLSearchParams();
    if (status) {
      query.append("status", status);
    }
    if (suspended !== undefined) {
      query.append("suspended", String(suspended));
    }
    return request(
      `/admin/restaurants${query.toString() ? `?${query.toString()}` : ""}`,
      {
        token,
      },
    );
  },
  createRestaurant: ({ body, token }) =>
    request("/admin/restaurants", {
      method: "POST",
      body,
      token,
    }),
  approveRestaurant: ({ id, token }) =>
    request(`/admin/restaurants/${id}/approve`, {
      method: "PUT",
      token,
    }),
  rejectRestaurant: ({ id, reason, token }) =>
    request(`/admin/restaurants/${id}/reject`, {
      method: "PUT",
      body: { reason },
      token,
    }),
  coupons: ({ token, status, search } = {}) => {
    const query = new URLSearchParams();
    if (status) {
      query.append("status", status);
    }
    if (search) {
      query.append("search", search);
    }
    return request(
      `/admin/coupons${query.toString() ? `?${query.toString()}` : ""}`,
      {
        token,
      },
    );
  },
  createCoupon: ({ body, token }) =>
    request("/admin/coupons", {
      method: "POST",
      body,
      token,
    }),
  updateCoupon: ({ id, body, token }) =>
    request(`/admin/coupons/${id}`, {
      method: "PUT",
      body,
      token,
    }),
  deleteCoupon: ({ id, token }) =>
    request(`/admin/coupons/${id}`, {
      method: "DELETE",
      token,
    }),
};

export const ownerApi = {
  coupons: (token) => request("/owner/coupons", { token }),
  createCoupon: ({ body, token }) =>
    request("/owner/coupons", {
      method: "POST",
      body,
      token,
    }),
  updateCoupon: ({ id, body, token }) =>
    request(`/owner/coupons/${id}`, {
      method: "PUT",
      body,
      token,
    }),
  deleteCoupon: ({ id, token }) =>
    request(`/owner/coupons/${id}`, {
      method: "DELETE",
      token,
    }),
};

export const contactApi = {
  submit: (body) => request("/contact", { method: "POST", body }),
  getAll: ({ token, status, page, limit } = {}) => {
    const query = new URLSearchParams();
    if (status) query.append("status", status);
    if (page) query.append("page", page);
    if (limit) query.append("limit", limit);
    return request(
      `/contact${query.toString() ? `?${query.toString()}` : ""}`,
      { token },
    );
  },
  getById: ({ id, token }) => request(`/contact/${id}`, { token }),
  reply: ({ id, body, token }) =>
    request(`/contact/${id}/reply`, {
      method: "PUT",
      body,
      token,
    }),
  updateStatus: ({ id, body, token }) =>
    request(`/contact/${id}/status`, {
      method: "PUT",
      body,
      token,
    }),
  delete: ({ id, token }) =>
    request(`/contact/${id}`, { method: "DELETE", token }),
};

export const reviewApi = {
  create: ({ body, token }) =>
    request("/reviews", { method: "POST", body, token }),
  getFoodReviews: ({
    foodId,
    page = 1,
    limit = 10,
    sortBy = "newest",
  } = {}) => {
    const query = new URLSearchParams();
    query.append("page", page);
    query.append("limit", limit);
    query.append("sortBy", sortBy);
    return request(`/reviews/food/${foodId}?${query.toString()}`);
  },
  getRestaurantReviews: ({ restaurantId, page = 1, limit = 10 } = {}) => {
    const query = new URLSearchParams();
    query.append("page", page);
    query.append("limit", limit);
    return request(`/reviews/restaurant/${restaurantId}?${query.toString()}`);
  },
  getUserReviews: ({ token, page = 1, limit = 10 } = {}) => {
    const query = new URLSearchParams();
    query.append("page", page);
    query.append("limit", limit);
    return request(`/reviews/my?${query.toString()}`, { token });
  },
  update: ({ id, body, token }) =>
    request(`/reviews/${id}`, { method: "PUT", body, token }),
  delete: ({ id, token }) =>
    request(`/reviews/${id}`, { method: "DELETE", token }),
  markHelpful: ({ id, token }) =>
    request(`/reviews/${id}/helpful`, { method: "PUT", token }),
};
