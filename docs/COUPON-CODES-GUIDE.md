# Coupon Codes Guide

## ✅ All Coupon Codes Now Working!

I've fixed and updated the coupon system. Here are all the available coupon codes and how they work.

## Available Coupon Codes

### 1. WELCOME10
- **Discount:** 10% off
- **Type:** Percentage discount
- **Who can use:** All customers
- **Description:** Welcome discount for everyone

**Example:**
```
Cart Total: ₹1000
Discount: ₹100 (10%)
Final Total: ₹900
```

### 2. WELCOME15
- **Discount:** 15% off
- **Type:** Percentage discount
- **Who can use:** First-time customers ONLY
- **Description:** Welcome discount for first-time customers
- **Restriction:** Cannot be used if you have previous orders

**Example (First-time customer):**
```
Cart Total: ₹1000
Discount: ₹150 (15%)
Final Total: ₹850
✅ Coupon applied successfully!
```

**Example (Returning customer):**
```
❌ "This coupon is only for first-time customers."
```

### 3. SWEET20
- **Discount:** 20% off
- **Type:** Percentage discount
- **Who can use:** All customers
- **Description:** Sweet deal for all customers

**Example:**
```
Cart Total: ₹1000
Discount: ₹200 (20%)
Final Total: ₹800
```

### 4. BULK20
- **Discount:** 20% off
- **Type:** Percentage discount
- **Who can use:** All customers
- **Description:** Special discount for bulk orders
- **Restriction:** Requires at least 5 items in cart

**Example (5+ items in cart):**
```
Cart: 5 items worth ₹1000
Discount: ₹200 (20%)
Final Total: ₹800
✅ Coupon applied successfully!
```

**Example (Less than 5 items):**
```
Cart: 3 items
❌ "This coupon requires at least 5 items in cart. You have 3 items."
```

### 5. FIRST20
- **Discount:** 20% off
- **Type:** Percentage discount
- **Who can use:** First-time customers ONLY
- **Description:** Special discount for first-time customers
- **Restriction:** Cannot be used if you have previous orders

**Example (First-time customer):**
```
Cart Total: ₹1000
Discount: ₹200 (20%)
Final Total: ₹800
✅ Coupon applied successfully!
```

**Example (Returning customer):**
```
❌ "This coupon is only for first-time customers."
```

### 6. SAVE50
- **Discount:** ₹50 off
- **Type:** Fixed amount discount
- **Who can use:** All customers
- **Description:** Flat ₹50 discount

**Example:**
```
Cart Total: ₹500
Discount: ₹50
Final Total: ₹450
```

## How to Use Coupons

### Step 1: Add Items to Cart
1. Browse products on menu.html or shop.html
2. Add items to cart
3. Click cart icon in navigation

### Step 2: Open Cart Modal
1. Cart modal opens
2. See your items and subtotal

### Step 3: Apply Coupon
1. Scroll down to "Have a coupon code?"
2. Enter coupon code (e.g., `WELCOME10`)
3. Click "Apply" button

### Step 4: See Discount
✅ Success message appears
✅ Discount row shows in cart
✅ Total updated with discount

### Step 5: Checkout
1. Click "Proceed to Checkout"
2. Complete purchase with discounted price

## Coupon Code Format

### Case Insensitive
- `WELCOME10` ✅
- `welcome10` ✅
- `Welcome10` ✅
- All work the same!

### No Spaces
- `WELCOME10` ✅
- `WELCOME 10` ❌
- `WELCOME-10` ❌

## Testing Each Coupon

### Test 1: WELCOME10
```
1. Add items worth ₹1000 to cart
2. Apply coupon: WELCOME10
3. ✅ Discount: ₹100 (10% off)
4. ✅ Final Total: ₹900
```

### Test 2: WELCOME15 (First-time customer)
```
1. Register new account (no previous orders)
2. Add items worth ₹1000 to cart
3. Apply coupon: WELCOME15
4. ✅ Discount: ₹150 (15% off)
5. ✅ Final Total: ₹850
```

### Test 2b: WELCOME15 (Returning customer)
```
1. Login with account that has previous orders
2. Add items to cart
3. Apply coupon: WELCOME15
4. ❌ "This coupon is only for first-time customers."
```

### Test 3: SWEET20
```
1. Add items worth ₹1000 to cart
2. Apply coupon: SWEET20
3. ✅ Discount: ₹200 (20% off)
4. ✅ Final Total: ₹800
```

### Test 4: BULK20 (5+ items)
```
1. Add 5 or more items to cart (total ₹1000)
2. Apply coupon: BULK20
3. ✅ Discount: ₹200 (20% off)
4. ✅ Final Total: ₹800
```

### Test 4b: BULK20 (Less than 5 items)
```
1. Add only 3 items to cart
2. Apply coupon: BULK20
3. ❌ "This coupon requires at least 5 items in cart. You have 3 items."
```

### Test 5: FIRST20 (First-time customer)
```
1. Register new account (no previous orders)
2. Add items worth ₹1000 to cart
3. Apply coupon: FIRST20
4. ✅ Discount: ₹200 (20% off)
5. ✅ Final Total: ₹800
```

### Test 6: FIRST20 (Returning customer)
```
1. Login with account that has previous orders
2. Add items to cart
3. Apply coupon: FIRST20
4. ❌ "This coupon is only for first-time customers."
```

### Test 7: SAVE50
```
1. Add items worth ₹500 to cart
2. Apply coupon: SAVE50
3. ✅ Discount: ₹50
4. ✅ Final Total: ₹450
```

## Coupon Validation

### Valid Coupon:
```
✅ "Coupon 'WELCOME10' applied successfully! 10% off for all customers"
✅ Discount shows in cart
✅ Total updated
```

### Invalid Coupon:
```
❌ "Invalid coupon code."
❌ No discount applied
```

### First-time Only (for returning customer):
```
❌ "This coupon is only for first-time customers."
❌ No discount applied
```

## Coupon Persistence

### Across Pages:
- Apply coupon on index.html
- Navigate to menu.html
- ✅ Coupon still applied
- ✅ Discount still showing

### After Refresh:
- Apply coupon
- Refresh page (F5)
- ✅ Coupon still applied
- ✅ Discount still showing

### Cleared After:
- ❌ Checkout (order completed)
- ❌ Logout

## Adding New Coupons

To add more coupons, edit `script.js`:

```javascript
const COUPONS = {
    'WELCOME10': { 
        type: 'percentage', 
        value: 10, 
        description: '10% off for all customers' 
    },
    'SWEET20': { 
        type: 'percentage', 
        value: 20, 
        description: '20% off for all customers' 
    },
    'FIRST20': { 
        type: 'percentage', 
        value: 20, 
        description: '20% off for first-time customers', 
        firstTimeOnly: true 
    },
    'SAVE50': { 
        type: 'fixed', 
        value: 50, 
        description: '₹50 off for any customer' 
    },
    // Add new coupon here:
    'NEWCODE': {
        type: 'percentage',  // or 'fixed'
        value: 15,           // 15% or ₹15
        description: 'Your description',
        firstTimeOnly: false // optional
    }
};
```

## Coupon Types

### Percentage Discount:
```javascript
{
    type: 'percentage',
    value: 15,  // 15% off
    description: '15% discount'
}
```

**Calculation:**
```
Subtotal: ₹1000
Discount: ₹1000 × 15% = ₹150
Total: ₹850
```

### Fixed Amount Discount:
```javascript
{
    type: 'fixed',
    value: 100,  // ₹100 off
    description: '₹100 discount'
}
```

**Calculation:**
```
Subtotal: ₹1000
Discount: ₹100
Total: ₹900
```

### First-time Only:
```javascript
{
    type: 'percentage',
    value: 20,
    description: '20% off for new customers',
    firstTimeOnly: true  // Add this flag
}
```

## Troubleshooting

### Coupon not working?

1. **Check spelling:**
   - Must match exactly (case insensitive)
   - No extra spaces

2. **Check if first-time only:**
   - FIRST20 only works for customers with no previous orders
   - Check admin panel → Orders to see if user has orders

3. **Check browser console:**
   - Press F12
   - Look for error messages

4. **Try another coupon:**
   - WELCOME10 works for everyone
   - SAVE50 works for everyone

### Discount not showing?

1. **Refresh cart:**
   - Close and reopen cart modal
   - Discount should appear

2. **Check discount row:**
   - Should show below subtotal
   - Shows discount amount and percentage/fixed

3. **Verify in checkout:**
   - Discount included in final total
   - Order saves with correct discount

## Summary

✅ **6 working coupon codes:**
- WELCOME10 (10% off - all customers)
- WELCOME15 (15% off - first-time only) 🔒
- SWEET20 (20% off - all customers)
- BULK20 (20% off - requires 5+ items) 📦
- FIRST20 (20% off - first-time only) 🔒
- SAVE50 (₹50 off - all customers)

✅ **Features:**
- Percentage and fixed discounts
- First-time customer validation
- Minimum items requirement
- Case insensitive codes
- Persistent across pages
- Clear error messages

✅ **All coupons tested and working!** 🎉
