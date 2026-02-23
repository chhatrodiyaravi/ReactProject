# Debug Owner Dashboard - Not Displaying

## Steps to Access Owner Dashboard:

### 1. Clear localStorage and start fresh

Open browser console (F12) and run:

```javascript
localStorage.clear();
window.location.reload();
```

### 2. Navigate to Owner Login

Go to: `http://localhost:5175/owner-login`

### 3. Login with Owner Credentials

- Email: `owner@restaurant.com`
- Password: `owner123`

### 4. You should be redirected to `/owner-dashboard`

## If Still Not Working:

### Check Console for Errors

Open F12 Console and look for any red error messages.

### Check if you're logged in

In console, run:

```javascript
JSON.parse(localStorage.getItem("user"));
```

You should see an object with `role: "owner"`

### Check current URL

Make sure you're at: `http://localhost:5175/owner-dashboard`

### Check if component is rendering

In console, run:

```javascript
document.querySelector(".min-h-screen");
```

Should return an HTML element, not null
