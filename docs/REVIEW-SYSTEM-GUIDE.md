# Review System Guide

## ✅ Feature Complete: User Reviews with Admin Approval

Users can now submit reviews that go to the admin panel for approval. Only approved reviews appear on the website!

## How It Works

### User Flow

```
User writes review on website
         ↓
Review saved with "Pending" status
         ↓
Admin sees review in admin panel
         ↓
Admin approves or rejects
         ↓
If approved → Review appears on website
If rejected → Review hidden from website
```

## For Users: Writing a Review

### Step 1: Navigate to Reviews Section
1. Open `index.html`
2. Scroll down to "Customer Reviews" section
3. Click "Write a Review" button

### Step 2: Login Required
- If not logged in, login modal appears
- Must be registered and logged in to write reviews
- This prevents spam and ensures accountability

### Step 3: Fill Review Form
**Rating:**
- Click on stars to rate (1-5 stars)
- 5 stars = Excellent
- 1 star = Poor

**Your Review:**
- Write your experience
- Minimum required
- Be honest and helpful

### Step 4: Submit
- Click "Submit Review"
- ✅ Success message: "Thank you! Your review has been submitted for approval."
- Review is now pending admin approval

### Step 5: Wait for Approval
- Review goes to admin panel
- Admin will review and approve/reject
- Once approved, review appears on website

## For Admin: Managing Reviews

### Step 1: Open Admin Panel
1. Open `admin-panel.html`
2. Click "Reviews" in left sidebar

### Step 2: View All Reviews
You'll see all reviews with:
- Customer name and email
- Star rating
- Review comment
- Date submitted
- Status badge (Pending/Approved/Rejected)

### Step 3: Filter Reviews
Click filter buttons at top:
- **All** - Show all reviews
- **Pending** - Show only pending reviews (need action)
- **Approved** - Show approved reviews (visible on website)

### Step 4: Approve a Review
1. Find a pending review
2. Click "✓ Approve" button
3. ✅ Review status changes to "Approved"
4. ✅ Review now visible on website

### Step 5: Reject a Review
1. Find a pending review
2. Click "✕ Reject" button
3. Confirm rejection
4. ✅ Review status changes to "Rejected"
5. ✅ Review hidden from website

### Step 6: Delete a Review
1. Click trash icon (🗑️) on any review
2. Confirm deletion
3. ✅ Review permanently deleted

## Example Workflow

### User Side:

1. **John Doe logs in**
2. **Scrolls to reviews section**
3. **Clicks "Write a Review"**
4. **Rates 5 stars**
5. **Writes:** "Amazing chocolate cake! Best I've ever had. Will definitely order again!"
6. **Clicks Submit**
7. **Sees message:** "Thank you! Your review has been submitted for approval."

### Admin Side:

1. **Admin opens admin panel**
2. **Clicks "Reviews"**
3. **Sees John's review with "Pending" badge**
4. **Reads the review**
5. **Clicks "✓ Approve"**
6. **Review approved!**

### Website:

1. **Refresh index.html**
2. **John's review now appears in reviews section**
3. **Shows 5 stars and his comment**
4. **Other users can see it**

## Review Display on Website

### Where Reviews Appear:
- `index.html` - Customer Reviews section
- Shows approved reviews only
- Displays:
  - Customer name
  - Star rating
  - Review comment
  - Date

### Review Card Format:
```
┌─────────────────────────────────────┐
│ "                                   │
│ ★★★★★                              │
│                                     │
│ Amazing chocolate cake! Best I've   │
│ ever had. Will definitely order     │
│ again!                              │
│                                     │
│ John Doe                            │
│ 09/02/2026                          │
└─────────────────────────────────────┘
```

## Review Status Explained

### Pending (Yellow Badge)
- Review just submitted
- Waiting for admin approval
- Not visible on website
- Admin needs to take action

### Approved (Green Badge)
- Admin approved the review
- Visible on website
- Shows in customer reviews section
- Helps build trust

### Rejected (Red Badge)
- Admin rejected the review
- Not visible on website
- Might be spam or inappropriate
- Can be deleted permanently

## Admin Best Practices

### When to Approve:
✅ Genuine customer feedback
✅ Constructive criticism
✅ Positive experiences
✅ Helpful for other customers
✅ Professional language

### When to Reject:
❌ Spam or fake reviews
❌ Offensive language
❌ Irrelevant content
❌ Competitor sabotage
❌ Personal attacks

### Tips:
- Check pending reviews daily
- Respond to negative feedback (future feature)
- Approve honest reviews (even if not 5 stars)
- Build trust with transparency

## Technical Details

### Data Storage:
- **Location:** Browser localStorage
- **Key:** `bakery_reviews`
- **Format:** JSON array

### Review Object Structure:
```javascript
{
  id: 1234567890,              // Unique timestamp ID
  userId: 123456,              // User's ID
  customerName: "John Doe",    // User's name
  email: "john@example.com",   // User's email
  rating: 5,                   // 1-5 stars
  comment: "Amazing!",         // Review text
  date: "09/02/2026",          // Submission date
  timestamp: 1234567890,       // For sorting
  status: "Pending"            // Pending/Approved/Rejected
}
```

## Troubleshooting

### Review not appearing on website?
1. Check if review is approved in admin panel
2. Refresh the website (Ctrl+F5)
3. Check browser console for errors

### Can't submit review?
1. Make sure you're logged in
2. Fill both rating and comment
3. Check browser console for errors

### Reviews not loading in admin?
1. Check localStorage:
   ```javascript
   JSON.parse(localStorage.getItem('bakery_reviews'))
   ```
2. Refresh admin panel
3. Check browser console

## Testing the System

### Test 1: Submit a Review
1. Open `index.html`
2. Login as a user
3. Click "Write a Review"
4. Rate 5 stars
5. Write: "Test review - great service!"
6. Submit
7. ✅ Success message appears

### Test 2: View in Admin
1. Open `admin-panel.html`
2. Click "Reviews"
3. ✅ See your test review with "Pending" badge

### Test 3: Approve Review
1. Click "✓ Approve" on test review
2. ✅ Status changes to "Approved"

### Test 4: See on Website
1. Refresh `index.html`
2. Scroll to reviews section
3. ✅ Your review appears!

### Test 5: Filter Reviews
1. In admin panel, click "Pending"
2. ✅ Only pending reviews show
3. Click "Approved"
4. ✅ Only approved reviews show

## Summary

✅ **Users can write reviews** (must be logged in)
✅ **Reviews go to admin panel** with "Pending" status
✅ **Admin can approve/reject** reviews
✅ **Only approved reviews** appear on website
✅ **Filter reviews** by status in admin
✅ **Delete reviews** permanently
✅ **Professional review system** with moderation

Perfect review management system! 🎉
