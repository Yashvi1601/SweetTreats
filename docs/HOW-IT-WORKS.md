# How the Registration & Login System Works

## ✅ Current Behavior (Already Implemented)

### When User is NOT Logged In:
1. **Navigation shows**: "Login" button
2. **When clicking "Add to Cart"**: Login modal appears
3. **User cannot purchase** until they register/login

### When User Registers:
1. User fills registration form with:
   - Full Name
   - Email
   - Phone
   - Address
   - Password
2. Clicks "Register" button
3. **System saves user data** to localStorage (`bakery_users`)
4. **User data appears in Admin Panel** under "Registered Users"
5. Modal switches to login form
6. User logs in with email and password

### After User Logs In:
1. **Login button disappears** ✅
2. **User's name appears** in navigation dropdown ✅
3. **User can now add items to cart** ✅
4. **User can make purchases** ✅
5. **All purchases are saved** to admin panel ✅

### User Navigation Changes:

**BEFORE Login:**
```
[Home] [About] [Menu] [Shop] [Contact] [Cart] [🌙] [Login Button]
```

**AFTER Login:**
```
[Home] [About] [Menu] [Shop] [Contact] [Cart] [🌙] [👤 John Doe ▼]
                                                      └─ Logout
```

## How Data is Stored in Admin Panel

### 1. User Registration Data
When user registers, their data is saved to:
- **localStorage key**: `bakery_users`
- **Visible in**: Admin Panel → "Registered Users" section

**Data includes:**
- Name
- Email
- Phone
- Address
- Registration Date
- Online/Offline Status

### 2. Purchase/Order Data
When user makes a purchase, order data is saved to:
- **localStorage key**: `bakery_orders` (via DataManager)
- **Visible in**: Admin Panel → "Orders" section

**Data includes:**
- Order ID
- Customer Name
- Customer Email
- Items Ordered
- Total Amount
- Order Status
- Order Date

### 3. Customer Tracking
Admin panel automatically links:
- User registration data
- All orders made by that user
- Total spending
- Order history

## Step-by-Step User Journey

### First Time User:

1. **Visits website** → Sees "Login" button
2. **Tries to add item** → Login modal appears
3. **Clicks "Register here"** → Registration form appears
4. **Fills form and submits** → Data saved to admin panel
5. **Logs in** → Login button disappears, name appears
6. **Adds items to cart** → Works normally
7. **Makes purchase** → Order saved to admin panel

### Returning User:

1. **Visits website** → Sees "Login" button
2. **Clicks "Login"** → Login modal appears
3. **Enters email/password** → Logs in
4. **Login button disappears** → Name appears in navigation
5. **Can shop freely** → No more login prompts
6. **All purchases tracked** → Visible in admin panel

## Admin Panel View

### Registered Users Section:
```
┌─────────────────────────────────────────────────────────────┐
│ REGISTERED USERS                              [24 Users]     │
├─────────────────────────────────────────────────────────────┤
│ Name          Email              Phone        Status         │
├─────────────────────────────────────────────────────────────┤
│ 👤 John Doe   john@email.com    1234567890   🟢 Online      │
│ 👤 Jane Smith jane@email.com    0987654321   ⚪ Offline     │
└─────────────────────────────────────────────────────────────┘
```

### Orders Section:
```
┌─────────────────────────────────────────────────────────────┐
│ ORDERS                                                       │
├─────────────────────────────────────────────────────────────┤
│ Order ID    Customer      Items           Total    Status   │
├─────────────────────────────────────────────────────────────┤
│ ORD-1234    John Doe      Choco Cake     ₹900    Completed │
│ ORD-1235    Jane Smith    Croissant x3   ₹750    Pending   │
└─────────────────────────────────────────────────────────────┘
```

## Testing Instructions

### Test 1: Register New User
1. Open `index.html`
2. Click any "Add to Cart" button
3. Click "Register here" in the modal
4. Fill in:
   - Name: Test User
   - Email: test@example.com
   - Phone: 1234567890
   - Address: 123 Test St
   - Password: test123
   - Confirm: test123
5. Click "Register"
6. ✅ **Expected**: Success message, switches to login form

### Test 2: Login
1. Enter email: test@example.com
2. Enter password: test123
3. Click "Login"
4. ✅ **Expected**: 
   - Modal closes
   - "Login" button disappears
   - "Test User" appears in navigation

### Test 3: Purchase Items
1. Click "Add to Cart" on any item
2. ✅ **Expected**: Item added successfully (no login prompt)
3. Click cart icon
4. Click "Checkout"
5. ✅ **Expected**: Can complete purchase

### Test 4: Check Admin Panel
1. Open `admin-panel.html`
2. Click "Registered Users" in sidebar
3. ✅ **Expected**: See "Test User" in the list
4. Click "Orders" in sidebar
5. ✅ **Expected**: See orders made by Test User

### Test 5: Logout
1. Click on "Test User" dropdown in navigation
2. Click "Logout"
3. ✅ **Expected**:
   - User name disappears
   - "Login" button reappears
   - Cart is cleared
   - Cannot add items without logging in again

## Summary

✅ **Login/Register button disappears** after user logs in
✅ **User's name appears** in navigation dropdown
✅ **User can purchase items** freely after login
✅ **All user data stored** in admin panel
✅ **All orders tracked** and linked to user
✅ **Admin can view** all registered users and their orders

The system is already working exactly as you requested! Try it out by following the testing instructions above.
