# Test: Product Sync Between Admin and Website

## Quick Test Steps

### Test 1: Add a New Product

1. **Open `admin-panel.html`**
2. **Click "Products"** in sidebar
3. **Click "+ Add New Product"**
4. **Enter these details:**
   - Name: `Test Chocolate Cake`
   - Category: `Cakes`
   - Price: `500`
   - Stock: `20`
   - Image: (press Enter to use default)
5. **Click OK** on each prompt
6. ✅ **Expected:** "Product added successfully!" message

### Test 2: Verify in Admin Panel

1. **Look at the products table**
2. ✅ **Expected:** See "Test Chocolate Cake" in the list
3. ✅ **Expected:** Price shows ₹500
4. ✅ **Expected:** Stock shows 20
5. ✅ **Expected:** Category shows Cakes

### Test 3: View on Main Website

1. **Open `menu.html`** in your browser
2. **Scroll down to the product grid**
3. ✅ **Expected:** See "Test Chocolate Cake" in the products
4. ✅ **Expected:** Price shows ₹500.00
5. ✅ **Expected:** "Add to Cart" button visible

### Test 4: Test Filtering

1. **On menu.html**, click the "Cakes" filter button
2. ✅ **Expected:** "Test Chocolate Cake" is visible
3. **Click "All" filter**
4. ✅ **Expected:** "Test Chocolate Cake" still visible

### Test 5: Test Add to Cart

1. **Login** (if not already logged in)
2. **Click "Add to Cart"** on "Test Chocolate Cake"
3. ✅ **Expected:** Item added to cart
4. ✅ **Expected:** Cart badge updates
5. ✅ **Expected:** Toast message appears

### Test 6: Edit the Product

1. **Go back to `admin-panel.html`**
2. **Click the edit icon (✏️)** next to "Test Chocolate Cake"
3. **Change name to:** `Deluxe Chocolate Cake`
4. **Change price to:** `600`
5. **Click OK** on each prompt
6. ✅ **Expected:** "Product updated successfully!" message

### Test 7: Verify Edit on Website

1. **Refresh `menu.html`** (Ctrl+F5)
2. ✅ **Expected:** Product name changed to "Deluxe Chocolate Cake"
3. ✅ **Expected:** Price changed to ₹600.00

### Test 8: Delete the Product

1. **Go back to `admin-panel.html`**
2. **Click the delete icon (🗑️)** next to "Deluxe Chocolate Cake"
3. **Click OK** to confirm
4. ✅ **Expected:** "Product deleted successfully!" message
5. ✅ **Expected:** Product removed from admin table

### Test 9: Verify Deletion on Website

1. **Refresh `menu.html`** (Ctrl+F5)
2. ✅ **Expected:** "Deluxe Chocolate Cake" is gone
3. ✅ **Expected:** Other products still visible

## Success Criteria

✅ Products added in admin appear on website
✅ Products can be edited and changes reflect on website
✅ Products can be deleted and removal reflects on website
✅ Products are filterable by category
✅ Products can be added to cart
✅ All changes persist after page refresh

## If Something Doesn't Work

### Check Browser Console
1. Press F12
2. Go to "Console" tab
3. Look for error messages (red text)

### Check localStorage
1. Press F12
2. Go to "Application" tab (Chrome) or "Storage" tab (Firefox)
3. Click "Local Storage" → your domain
4. Look for `bakery_products` key
5. Should see JSON array of products

### Force Refresh
- Windows/Linux: Ctrl + F5
- Mac: Cmd + Shift + R

### Clear and Reset
```javascript
// In browser console:
localStorage.removeItem('bakery_products');
location.reload();
```

## Expected Result

**Perfect sync between admin panel and main website!**

Any product you add, edit, or delete in the admin panel will immediately be reflected on the main website after a refresh.

🎉 **Product management is now fully functional!**
