# Admin and Owner Dashboard API Guide

## Overview

This guide explains the new Admin and Owner dashboard APIs that have been implemented in the FoodHub backend.

---

## Admin Dashboard APIs

### Authentication

All admin endpoints require:

- **Route Protection**: Must be logged in
- **Role Authorization**: Must have `admin` role
- **Header**: `Authorization: Bearer <token>`

### Base URL

```
/api/admin
```

---

## Admin Endpoints

### 1. Dashboard Stats

**GET** `/api/admin/dashboard`

Returns comprehensive statistics about the platform.

**Response Includes:**

- totalOrders
- totalRestaurants
- activeRestaurants
- suspendedRestaurants
- totalUsers
- activeUsers
- blockedUsers
- pendingDisputes
- pendingApprovals
- todayOrders
- deliveredOrdersToday
- cancelledOrdersToday
- totalRevenue
- revenueToday
- topRestaurants

```bash
curl -X GET "http://localhost:5000/api/admin/dashboard" \
  -H "Authorization: Bearer <your-token>"
```

---

### 2. Manage Restaurants

#### Get All Restaurants

**GET** `/api/admin/restaurants`

Query Parameters:

- `status`: "pending", "approved", "rejected"
- `suspended`: "true" or "false"

#### Approve Restaurant

**PUT** `/api/admin/restaurants/:id/approve`

```bash
curl -X PUT "http://localhost:5000/api/admin/restaurants/123/approve" \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json"
```

#### Suspend Restaurant

**PUT** `/api/admin/restaurants/:id/suspend`

**Body:**

```json
{
  "reason": "Violation of health code"
}
```

#### Unsuspend Restaurant

**PUT** `/api/admin/restaurants/:id/unsuspend`

---

### 3. Manage Users

#### Get All Users

**GET** `/api/admin/users`

Query Parameters:

- `blocked`: "true", "false", or omit for all
- `role`: "user", "owner", "admin"

#### Block User

**PUT** `/api/admin/users/:id/block`

**Body:**

```json
{
  "reason": "Multiple complaints received"
}
```

#### Unblock User

**PUT** `/api/admin/users/:id/unblock`

---

### 4. Manage Disputes

#### Get Pending Disputes

**GET** `/api/admin/disputes`

Query Parameters:

- `status`: "open", "under_review", "resolved", "rejected"

#### Resolve Dispute

**PUT** `/api/admin/disputes/:id/resolve`

**Body:**

```json
{
  "resolution": "full_refund",
  "refundAmount": 500,
  "adminNotes": "User complaint verified"
}
```

**Resolution Options:**

- `full_refund`
- `partial_refund`
- `replacement`
- `no_action`

---

### 5. Manage Categories

#### Get All Categories

**GET** `/api/admin/categories`

#### Create Category

**POST** `/api/admin/categories`

**Body:**

```json
{
  "name": "Pizza",
  "description": "Italian pizzas",
  "parent": null,
  "displayOrder": 1
}
```

#### Update Category

**PUT** `/api/admin/categories/:id`

**Body:**

```json
{
  "name": "Fast Food",
  "description": "Updated description",
  "displayOrder": 2
}
```

#### Delete Category

**DELETE** `/api/admin/categories/:id`

---

### 6. Get Activity Logs

**GET** `/api/admin/activities`

Query Parameters:

- `actionType`: Specific action type
- `entityType`: "restaurant", "user", "order", "dispute", "category"
- `limit`: Number of records (default: 50)

---

### 7. Get All Orders

**GET** `/api/admin/orders`

Query Parameters:

- `status`: Order status filter

---

### 8. Discount / Coupon Management

#### Get All Coupons

**GET** `/api/admin/coupons`

Query Parameters:

- `status`: "active" or "inactive"
- `search`: by coupon code or description

#### Create Coupon

**POST** `/api/admin/coupons`

**Body:**

```json
{
  "code": "WELCOME20",
  "description": "20% off for first order",
  "discountType": "percentage",
  "discountValue": 20,
  "maxDiscount": 200,
  "minOrderAmount": 300,
  "usageLimit": 500,
  "userUsageLimit": 1,
  "startDate": "2026-03-20T00:00:00.000Z",
  "expirationDate": "2026-04-20T23:59:59.000Z",
  "applicableRestaurants": ["<restaurantId1>", "<restaurantId2>"],
  "applicableCategories": ["Pizza", "Burger"],
  "isActive": true
}
```

#### Update Coupon

**PUT** `/api/admin/coupons/:id`

Use the same fields as create (all optional for update).

#### Delete Coupon

**DELETE** `/api/admin/coupons/:id`

---

## Owner Dashboard APIs

### Authentication

All owner endpoints require:

- **Route Protection**: Must be logged in
- **Role Authorization**: Must have `owner` role
- **Header**: `Authorization: Bearer <token>`

### Base URL

```
/api/owner
```

---

## Owner Endpoints

### 1. Restaurant Management

#### Get Your Restaurant

**GET** `/api/owner/restaurant`

Returns your restaurant details, including address, opening hours, etc.

#### Update Restaurant Info

**PUT** `/api/owner/restaurant`

**Body:**

```json
{
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "openingHours": {
    "monday": { "open": "09:00", "close": "22:00" },
    "tuesday": { "open": "09:00", "close": "22:00" },
    "wednesday": { "open": "09:00", "close": "22:00" },
    "thursday": { "open": "09:00", "close": "22:00" },
    "friday": { "open": "09:00", "close": "23:00" },
    "saturday": { "open": "10:00", "close": "23:00" },
    "sunday": { "open": "10:00", "close": "22:00" }
  },
  "deliveryTime": {
    "min": 20,
    "max": 45
  },
  "phone": "555-0123",
  "email": "contact@restaurant.com",
  "description": "Best restaurant in town"
}
```

---

### 2. Menu Management

#### Get Your Menu

**GET** `/api/owner/menu`

Returns all food items in your restaurant.

#### Add Food Item

**POST** `/api/owner/menu`

**Form Data:**

- `name` (required): Food name
- `description` (required): Food description
- `price` (required): Price
- `category`: Appetizer, Main Course, Dessert, Beverage, Snack, Other
- `isVegetarian`: true/false
- `isVegan`: true/false
- `spicyLevel`: None, Mild, Medium, Hot, Extra Hot
- `ingredients`: Array of ingredients
- `allergens`: Array of allergens
- `calories`: Calorie count
- `preparationTime`: Time in minutes
- `image`: Food image file

```bash
curl -X POST "http://localhost:5000/api/owner/menu" \
  -H "Authorization: Bearer <your-token>" \
  -F "name=Margherita Pizza" \
  -F "description=Classic Italian pizza" \
  -F "price=12.99" \
  -F "category=Main Course" \
  -F "isVegetarian=true" \
  -F "image=@pizza.jpg"
```

#### Edit Food Item

**PUT** `/api/owner/menu/:id`

**Body:**

```json
{
  "name": "Updated Name",
  "description": "Updated Description",
  "price": 13.99,
  "isAvailable": true,
  "preparationTime": 20
}
```

#### Delete Food Item

**DELETE** `/api/owner/menu/:id`

---

### 3. Order Management

#### Get Your Orders

**GET** `/api/owner/orders`

Query Parameters:

- `status`: Filter by order status

Returns all orders for your restaurant.

#### Accept Order

**PUT** `/api/owner/orders/:id/accept`

**Body:**

```json
{
  "estimatedDeliveryTime": 30
}
```

#### Reject Order

**PUT** `/api/owner/orders/:id/reject`

**Body:**

```json
{
  "reason": "Out of ingredients"
}
```

#### Update Order Status

**PUT** `/api/owner/orders/:id/status`

**Body:**

```json
{
  "orderStatus": "Preparing",
  "notes": "Food is being prepared"
}
```

**Order Status Options:**

- `Pending` → `Confirmed` → `Preparing` → `Out for Delivery` → `Delivered`
- `Cancelled` (can be set anytime)

---

### 4. Analytics

#### Get Analytics

**GET** `/api/owner/analytics`

Query Parameters:

- `type`: "today" (default), "week", "cumulative"

**Response Includes:**

- totalOrders
- acceptedOrders
- rejectedOrders
- cancelledOrders
- deliveredOrders
- totalRevenue
- totalItemsSold
- averageOrderValue
- averageRating
- orderAcceptanceRate
- orderCompletionRate
- topSellingFoods
- peakHours
- newCustomers
- returningCustomers
- averageDeliveryTime

```bash
curl -X GET "http://localhost:5000/api/owner/analytics?type=week" \
  -H "Authorization: Bearer <your-token>"
```

---

### 5. Activity Logs

#### Get Your Activities

**GET** `/api/owner/activities`

Returns all your activities (menu changes, order updates, info changes).

---

### 6. Discount / Coupon Management

Owners can manage coupons only for their own restaurant.

#### Get Your Coupons

**GET** `/api/owner/coupons`

#### Create Coupon

**POST** `/api/owner/coupons`

**Body:**

```json
{
  "code": "OWNER10",
  "description": "Flat discount",
  "discountType": "fixed",
  "discountValue": 100,
  "minOrderAmount": 500,
  "usageLimit": 200,
  "userUsageLimit": 1,
  "startDate": "2026-03-20T00:00:00.000Z",
  "expirationDate": "2026-04-20T23:59:59.000Z",
  "isActive": true
}
```

Note: `applicableRestaurants` is auto-set to the owner's restaurant.

#### Update Coupon

**PUT** `/api/owner/coupons/:id`

Owner can update only coupons created by that owner.

#### Delete Coupon

**DELETE** `/api/owner/coupons/:id`

---

## Example Workflow

### For Restaurant Owner:

1. **Login**

   ```bash
   POST /api/auth/login
   {
     "email": "owner@restaurant.com",
     "password": "password"
   }
   ```

2. **Get Restaurant Details**

   ```bash
   GET /api/owner/restaurant
   ```

3. **Add Food Items**

   ```bash
   POST /api/owner/menu (with food details)
   ```

4. **Get Pending Orders**

   ```bash
   GET /api/owner/orders?status=Pending
   ```

5. **Accept Order**

   ```bash
   PUT /api/owner/orders/:orderId/accept
   ```

6. **Update Order Status**

   ```bash
   PUT /api/owner/orders/:orderId/status
   {
     "orderStatus": "Delivering"
   }
   ```

7. **View Analytics**
   ```bash
   GET /api/owner/analytics?type=today
   ```

---

### For Admin:

1. **Login**

   ```bash
   POST /api/auth/login
   {
     "email": "admin@foodhub.com",
     "password": "password"
   }
   ```

2. **View Dashboard**

   ```bash
   GET /api/admin/dashboard
   ```

3. **View Pending Restaurant Approvals**

   ```bash
   GET /api/admin/restaurants?status=pending
   ```

4. **Approve Restaurant**

   ```bash
   PUT /api/admin/restaurants/:restaurantId/approve
   ```

5. **View All Users**

   ```bash
   GET /api/admin/users
   ```

6. **Block Problematic User**
   ```bash
   PUT /api/admin/users/:userId/block
   {
     "reason": "Inappropriate behavior"
   }
   ```

---

## Error Handling

All endpoints return errors in this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

---

## Important Notes

1. **Authorization**: Always include Bearer token in Authorization header
2. **Data Validation**: All required fields must be provided
3. **File Uploads**: Use multipart/form-data for image uploads
4. **Activity Logging**: All admin and owner actions are logged automatically
5. **Role-based Access**: Ensure your user has the correct role (admin/owner)
6. **Restaurant Ownership**: Owners can only manage their own restaurant
7. **Timestamps**: All timestamps are stored in UTC

---

## Testing with Postman

You can import the following collection structure:

### Admin Collection

- GET /api/admin/dashboard
- GET /api/admin/restaurants
- PUT /api/admin/restaurants/:id/approve
- GET /api/admin/users
- PUT /api/admin/users/:id/block
- GET /api/admin/disputes
- PUT /api/admin/disputes/:id/resolve
- GET /api/admin/coupons
- POST /api/admin/coupons
- PUT /api/admin/coupons/:id
- DELETE /api/admin/coupons/:id

### Owner Collection

- GET /api/owner/restaurant
- PUT /api/owner/restaurant
- GET /api/owner/menu
- POST /api/owner/menu
- PUT /api/owner/menu/:id
- DELETE /api/owner/menu/:id
- GET /api/owner/orders
- PUT /api/owner/orders/:id/accept
- PUT /api/owner/orders/:id/reject
- PUT /api/owner/orders/:id/status
- GET /api/owner/analytics
- GET /api/owner/activities
- GET /api/owner/coupons
- POST /api/owner/coupons
- PUT /api/owner/coupons/:id
- DELETE /api/owner/coupons/:id

---

## Troubleshooting

### "Not authorized" error

- Ensure token is valid and not expired
- Check that token is in correct format: `Bearer <token>`

### "User role not authorized" error

- Your user doesn't have the required role (admin/owner)
- Contact administrator to change your role

### Orders not showing

- Ensure restaurant is approved by admin
- Check that orders exist for your restaurant

### Cannot add menu items

- Restaurant must be approved first
- Ensure you're logged in as restaurant owner

---

For more help, contact support or check the GitHub repository.
