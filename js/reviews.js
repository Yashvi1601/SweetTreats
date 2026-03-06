// Reviews Management System

// Open review modal
function openReviewModal() {
    // Check if user is logged in
    if (typeof AuthManager === 'undefined' || !AuthManager.isLoggedIn()) {
        showToast('Please login to write a review!');
        if (typeof showAuthModal === 'function') {
            showAuthModal('login');
        }
        return;
    }

    const modal = document.getElementById('reviewModal');
    if (!modal) {
        console.error('Review modal not found');
        return;
    }

    const reviewModal = new bootstrap.Modal(modal);
    reviewModal.show();
}

// Submit review
function submitReview(event) {
    event.preventDefault();

    // Check if user is logged in
    if (typeof AuthManager === 'undefined' || !AuthManager.isLoggedIn()) {
        showToast('Please login to submit a review!');
        return;
    }

    const currentUser = AuthManager.getCurrentUser();
    const rating = document.querySelector('input[name="rating"]:checked');
    const comment = document.getElementById('reviewComment');

    if (!rating || !comment.value.trim()) {
        showToast('Please provide a rating and comment');
        return;
    }

    // Create review object
    const review = {
        id: Date.now(),
        userId: currentUser.id,
        customerName: currentUser.name,
        email: currentUser.email,
        rating: parseInt(rating.value),
        comment: comment.value.trim(),
        date: new Date().toLocaleDateString('en-IN'),
        timestamp: Date.now(),
        status: 'Pending'
    };

    // Save review to localStorage
    try {
        const reviews = JSON.parse(localStorage.getItem('bakery_reviews') || '[]');
        reviews.push(review);
        localStorage.setItem('bakery_reviews', JSON.stringify(reviews));
        
        console.log('Review submitted:', review);
        showToast('Thank you! Your review has been submitted for approval.');
        
        // Close modal
        const modal = document.getElementById('reviewModal');
        const modalInstance = bootstrap.Modal.getInstance(modal);
        if (modalInstance) {
            modalInstance.hide();
        }
        
        // Reset form
        event.target.reset();
        
    } catch (e) {
        console.error('Error saving review:', e);
        showToast('Error submitting review. Please try again.');
    }
}

// Load approved reviews on the website
function loadApprovedReviews() {
    console.log('Loading approved reviews...');
    
    const reviewsContainer = document.querySelector('#reviews .row.g-4');
    if (!reviewsContainer) {
        console.log('Reviews container not found');
        return;
    }

    // Get all reviews from localStorage
    const allReviews = JSON.parse(localStorage.getItem('bakery_reviews') || '[]');
    const approvedReviews = allReviews.filter(r => r.status === 'Approved');
    
    console.log('Total reviews:', allReviews.length);
    console.log('Approved reviews:', approvedReviews.length);
    
    if (approvedReviews.length === 0) {
        console.log('No approved reviews - keeping default content');
        return;
    }

    // Clear container
    reviewsContainer.innerHTML = '';

    // Add each approved review
    approvedReviews.forEach(review => {
        const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.customerName)}&background=ff6b9d&color=fff&size=100`;
        
        const reviewHTML = `
            <div class="col-lg-4 col-md-6">
                <div class="testimonial-card">
                    <div class="quote-icon">
                        <i class="fa-solid fa-quote-left"></i>
                    </div>
                    <p class="mb-4">"${review.comment}"</p>
                    <div class="d-flex align-items-center">
                        <img src="${avatarUrl}" alt="${review.customerName}" class="client-img me-3">
                        <div>
                            <h5 class="mb-1">${review.customerName}</h5>
                            <div class="text-warning mb-1" style="font-size: 1.2rem;">
                                ${stars}
                            </div>
                            <small class="text-muted">Verified Customer</small>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        reviewsContainer.insertAdjacentHTML('beforeend', reviewHTML);
    });
    
    console.log('Reviews loaded successfully');
}

// Load reviews when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(loadApprovedReviews, 500);
    });
} else {
    setTimeout(loadApprovedReviews, 500);
}

// Reload reviews when page becomes visible
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        setTimeout(loadApprovedReviews, 300);
    }
});
