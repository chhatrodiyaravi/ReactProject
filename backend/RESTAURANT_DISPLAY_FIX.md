# Restaurant Not Showing on Admin Dashboard - Troubleshooting Guide

## 🔍 The Problem

When you add a restaurant, it doesn't appear on the admin dashboard.

---

## ✅ Root Cause Analysis

### Issue 1: Default Filter Not Set

When a restaurant is created:

- **Default Status**: `approvalStatus = "pending"`
- **Admin Endpoint**: `GET /api/admin/restaurants`

**Problem**: Without a query parameter, the endpoint returns ALL restaurants (including approved, rejected, pending).

### Issue 2: Frontend Not Using Correct Filter

The frontend might be:

- Not passing any status filter (shows all)
- Showing only "approved" restaurants by default
- Not refreshing data after restaurant creation

---

## 🛠️ Solution

### **Step 1: Update Admin Restaurant Endpoint**

Edit: `backend/controllers/adminController.js`

Find this function (around line 148):

```javascript
export const getAllRestaurants = async (req, res) => {
  try {
    const { status, suspended } = req.query;
    const query = {};

    if (status) {
      query.approvalStatus = status;
    }
```

Replace with:

```javascript
export const getAllRestaurants = async (req, res) => {
  try {
    // Default to showing pending restaurants if no status specified
    const { status = "pending", suspended } = req.query;
    const query = {};

    query.approvalStatus = status;

    if (suspended === "true") {
      query.isSuspended = true;
    }
```

**What Changed:**

- Added default value: `status = "pending"`
- This shows pending restaurants by default
- Admin sees new restaurants immediately

---

### **Step 2: Add New Endpoint to Get All Restaurants Without Filter**

Add this new function to `backend/controllers/adminController.js`:

```javascript
// @desc    Get all restaurants (unfiltered)
// @route   GET /api/admin/restaurants/all/unfiltered
// @access  Private/Admin
export const getAllRestaurantsUnfiltered = async (req, res) => {
  try {
    const restaurants = await Restaurant.find()
      .populate("owner", "name email phone")
      .populate("approvedBy", "name email")
      .sort({ createdAt: -1 });

    // Group by status
    const grouped = {
      pending: restaurants.filter((r) => r.approvalStatus === "pending"),
      approved: restaurants.filter((r) => r.approvalStatus === "approved"),
      rejected: restaurants.filter((r) => r.approvalStatus === "rejected"),
      suspended: restaurants.filter((r) => r.isSuspended === true),
      total: restaurants.length,
    };

    res.status(200).json({
      success: true,
      data: grouped,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
```

---

### **Step 3: Update Admin Routes**

Edit: `backend/routes/adminRoutes.js`

Add this line after the existing routes:

```javascript
router.get("/restaurants/all/unfiltered", getAllRestaurantsUnfiltered);
router.get("/restaurants", getAllRestaurants);
```

**Important**: Place the unfiltered route BEFORE the existing getAllRestaurants route!

---

### **Step 4: Test the Endpoint**

Test with cURL or Postman:

```bash
# Get pending restaurants (default)
GET http://localhost:5000/api/admin/restaurants
Authorization: Bearer <admin-token>

# OR explicitly get pending
GET http://localhost:5000/api/admin/restaurants?status=pending
Authorization: Bearer <admin-token>

# Get approved restaurants
GET http://localhost:5000/api/admin/restaurants?status=approved
Authorization: Bearer <admin-token>

# Get all restaurants grouped
GET http://localhost:5000/api/admin/restaurants/all/unfiltered
Authorization: Bearer <admin-token>
```

---

## 📋 Complete Troubleshooting Checklist

### ✓ Restaurant Creation

- [ ] Owner logged in with role = "owner"
- [ ] Filled all required fields (name, description, phone, email)
- [ ] Submitted form successfully
- [ ] Received success response from backend

### ✓ Database Check

```javascript
// Check if restaurant exists in MongoDB
db.restaurants.find({ name: "Your Restaurant Name" });
// Output: Should show approvalStatus: "pending"
```

### ✓ Admin Dashboard Access

- [ ] Admin logged in with role = "admin"
- [ ] Has valid JWT token
- [ ] Token includes correct role
- [ ] Calling correct endpoint: `/api/admin/restaurants`

### ✓ Frontend Check

- [ ] Frontend passes correct status filter: `?status=pending`
- [ ] Or uses new unfiltered endpoint: `/all/unfiltered`
- [ ] Refreshes data after page load
- [ ] No client-side filtering that hides pending restaurants

### ✓ API Response

- [ ] Status code = 200
- [ ] Response has success = true
- [ ] Response includes restaurant data with:
  - [ ] \_id
  - [ ] name
  - [ ] owner (populated with name/email)
  - [ ] approvalStatus = "pending"
  - [ ] createdAt timestamp

---

## 🔄 Complete Data Flow for Restaurant Creation

```
1. OWNER REGISTRATION
   ├─ POST /api/restaurants
   ├─ Body: { name, description, phone, email, address, image, etc }
   ├─ Middleware: protect (verify token), authorize("owner")
   └─ Controller: createRestaurant()
      ├─ Sets: req.body.owner = req.user.id
      ├─ Saves image if provided
      ├─ Creates Restaurant document
      ├─ approvalStatus defaults to "pending"
      └─ Returns 201 created

2. RESTAURANT SAVED TO DATABASE
   Restaurant Collection:
   {
     "_id": "507f1f77bcf86cd799439011",
     "name": "Pizza Palace",
     "owner": "507f1f77bcf86cd799439012",
     "approvalStatus": "pending",      ← KEY FIELD
     "isActive": true,
     "isSuspended": false,
     "createdAt": "2024-03-04T10:30:00Z"
   }

3. ADMIN CHECKS DASHBOARD
   ├─ GET /api/admin/restaurants?status=pending
   ├─ Middleware: protect, authorize("admin")
   └─ Controller: getAllRestaurants()
      ├─ Query: { approvalStatus: "pending" }
      ├─ Find all matching restaurants
      ├─ Populate owner & approvedBy data
      ├─ Sort by createdAt descending
      └─ Return response with restaurant list

4. ADMIN SEES NEW RESTAURANT
   Response:
   {
     "success": true,
     "count": 1,
     "data": [
       {
         "_id": "507f1f77bcf86cd799439011",
         "name": "Pizza Palace",
         "owner": {
           "_id": "507f1f77bcf86cd799439012",
           "name": "John Doe",
           "email": "john@restaurant.com"
         },
         "approvalStatus": "pending",
         "createdAt": "2024-03-04T10:30:00Z"
       }
     ]
   }

5. ADMIN APPROVES RESTAURANT
   ├─ PUT /api/admin/restaurants/507f1f77bcf86cd799439011/approve
   └─ Restaurant updated:
      ├─ approvalStatus = "approved"
      ├─ approvedBy = admin user ID
      └─ approvedAt = current timestamp

6. OWNER CAN NOW USE RESTAURANT
   ├─ Add menu items
   ├─ Accept orders
   └─ View analytics
```

---

## 🐛 Common Issues & Fixes

### Issue: Restaurant shows but with owner field as just ID

**Solution**: Frontend needs to populate owner data:

```javascript
// In frontend fetch
const response = await fetch("/api/admin/restaurants");
// Response will have owner with name & email populated
```

### Issue: Restaurant created but not in admin list

**Solutions**:

1. Check approvalStatus is "pending" (not "rejected")
2. Check restaurant owner is correctly set
3. Check admin has correct role in token
4. Try endpoint without filters: `/all/unfiltered`

### Issue: Admin see list but can't approve

**Check**:

- Admin has 'admin' role
- Token is valid and not expired
- Restaurant ID is correct
- Using PUT method, not GET

### Issue: After approval, restaurant disappears from admin list

**Reason**: Endpoint defaults to `status=pending`, approved restaurants won't show
**Solution**:

- Change filter to `?status=approved`
- Or use unfiltered endpoint: `/all/unfiltered`

---

## 📱 Example Frontend Implementation

```javascript
// React Component for Admin Dashboard
import { useState, useEffect } from "react";

export function AdminRestaurant() {
  const [restaurants, setRestaurants] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRestaurants();
  }, [filter]);

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      // Key: Include status filter in URL
      const response = await fetch(`/api/admin/restaurants?status=${filter}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();
      setRestaurants(data.data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const approveRestaurant = async (restaurantId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `/api/admin/restaurants/${restaurantId}/approve`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) throw new Error("Failed to approve");

      // Refresh list
      fetchRestaurants();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h1>Restaurant Management</h1>

      <div>
        <button onClick={() => setFilter("pending")}>Pending</button>
        <button onClick={() => setFilter("approved")}>Approved</button>
        <button onClick={() => setFilter("rejected")}>Rejected</button>
      </div>

      {loading && <p>Loading...</p>}

      <div>
        {restaurants.length === 0 ? (
          <p>No restaurants found.</p>
        ) : (
          restaurants.map((restaurant) => (
            <div
              key={restaurant._id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                margin: "10px 0",
              }}
            >
              <h3>{restaurant.name}</h3>
              <p>Owner: {restaurant.owner.name}</p>
              <p>Email: {restaurant.owner.email}</p>
              <p>
                Status: <strong>{restaurant.approvalStatus}</strong>
              </p>
              <p>
                Created: {new Date(restaurant.createdAt).toLocaleDateString()}
              </p>

              {restaurant.approvalStatus === "pending" && (
                <button onClick={() => approveRestaurant(restaurant._id)}>
                  Approve
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
```

---

## ✅ Verification Checklist After Fix

After implementing the fix:

- [ ] Restaurant created by owner
- [ ] Admin accesses `/api/admin/restaurants` (no params)
- [ ] Restaurant appears in list with status "pending"
- [ ] Admin clicks approve button
- [ ] Restaurant status changes to "approved"
- [ ] Restaurant disappears from "pending" tab
- [ ] Restaurant appears in "approved" tab
- [ ] Owner can now add menu items
- [ ] Owner can accept orders

---

## 📞 Need More Help?

If restaurants still don't show:

1. **Check MongoDB directly**:

   ```javascript
   // In MongoDB console
   db.restaurants.find().pretty();
   // Look for your restaurant and its approvalStatus field
   ```

2. **Check Backend Logs**:
   - Look for any errors when calling `/api/admin/restaurants`
   - Check request/response in browser DevTools Network tab

3. **Verify Auth**:

   ```javascript
   // Decode token to verify role
   const token = localStorage.getItem("token");
   const decoded = JSON.parse(atob(token.split(".")[1]));
   console.log(decoded.role); // Should be "admin"
   ```

4. **Test Endpoint Directly**:
   Use Postman or cURL to test endpoint manually to isolate frontend issues

---

This guide should resolve the issue! Let me know if you need help implementing any of these solutions. 🚀
