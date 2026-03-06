# Testing Mandatory Registration Before Purchase

## What Was Implemented

1. **Created `auth.js`** - Complete authentication system with:
   - User registration with name, email, password, phone, and address
   - Login/logout functionality
   - Session management using localStorage
   - User data stored in `bakery_users` localStorage key
   - Current user stored in `bakery_current_user` localStorage key

2. **Updated `script.js`** - Modified `addToCart()` function to:
   - Check if user is logged in before adding items to cart
   - Show login modal if user is not logged in
   - Display toast message: "Please login or register to add items to cart!"

3. **Updated All HTML Pages** - Added to index.html, menu.html, shop.html, about.html, contact.html:
   - User navigation dropdown (shows when logged in)
   - Guest navigation with Login button (shows when not logged in)
   - Auth modal with login and register forms
   - Loaded `auth.js` script before `script.js`

4. **Updated admin-panel.html** - Added `auth.js` script so admin panel can access registered users

## How to Test

### Test 1: Try to Add Item Without Login
1. Open `index.html` or `menu.html` in a browser
2. Try to click "Add to Cart" or "Order Now" on any product
3. **Expected Result**: 
   - Toast message appears: "Please login or register to add items to cart!"
   - Login modal opens automatically
   - Item is NOT added to cart

### Test 2: Register New User
1. Click the "Login" button in the navigation
2. Click "Register here" link in the modal
3. Fill in the registration form:
   - Full Name: Test User
   - Email: test@example.com
   - Phone: 1234567890
   - Address: 123 Test Street
   - Password: test123
   - Confirm Password: test123
4. Click "Register"
5. **Expected Result**:
   - Success message appears
   - Modal switches to login form
   - User data is saved to localStorage

### Test 3: Login
1. In the login form, enter:
   - Email: test@example.com
   - Password: test123
2. Click "Login"
3. **Expected Result**:
   - Success message appears
   - Modal closes
   - Navigation shows user dropdown with name "Test User"
   - Login button is hidden

### Test 4: Add Item After Login
1. After logging in, try to add an item to cart
2. **Expected Result**:
   - Item is successfully added to cart
   - Toast message: "[Item Name] added to cart!"
   - Cart badge shows item count

### Test 5: View User in Admin Panel
1. Open `admin-panel.html` in a browser
2. Click on "Registered Users" in the sidebar
3. **Expected Result**:
   - Your registered user appears in the table
   - Shows name, email, phone, address, registration date
   - Status shows "Online" (green badge)
   - Can view details, contact, or delete user

### Test 6: Logout
1. Click on the user dropdown in navigation
2. Click "Logout"
3. **Expected Result**:
   - Success message appears
   - Navigation switches back to Login button
   - Cart is cleared
   - User status in admin panel changes to "Offline"

## Technical Details

### localStorage Keys Used:
- `bakery_users` - Array of all registered users
- `bakery_current_user` - Currently logged-in user session (without password)

### User Object Structure:
```javascript
{
  id: 1234567890, // timestamp
  name: "Test User",
  email: "test@example.com",
  password: "test123", // stored in bakery_users only
  phone: "1234567890",
  address: "123 Test Street",
  registeredDate: "09/02/2026",
  isLoggedIn: true // updated on login/logout
}
```

## Files Modified:
- ✅ `auth.js` (NEW) - Authentication system
- ✅ `script.js` - Added login check to addToCart()
- ✅ `index.html` - Added user nav and auth modal
- ✅ `menu.html` - Added user nav and auth modal
- ✅ `shop.html` - Added user nav and auth modal
- ✅ `about.html` - Added user nav and auth modal
- ✅ `contact.html` - Added user nav and auth modal
- ✅ `admin-panel.html` - Added auth.js script

## Success Criteria:
✅ Users CANNOT add items to cart without logging in
✅ Login modal appears automatically when trying to add items
✅ Registration form saves user data to localStorage
✅ Login form authenticates users
✅ User navigation shows logged-in user's name
✅ Registered users appear in admin panel
✅ Logout clears session and cart
