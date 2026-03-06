// Products Manager - Loads products from localStorage and displays them

function loadProductsFromStorage() {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) {
        console.log('product-grid element not found');
        return;
    }

    // Get products from localStorage
    const products = JSON.parse(localStorage.getItem('bakery_products') || '[]');
    
    console.log('Products from localStorage:', products);
    
    if (products.length === 0) {
        console.log('No products found in localStorage');
        return;
    }

    // Clear existing hardcoded products (keep only the first few as they might be in carousels)
    // We'll append new products from localStorage
    // Generate HTML for each product
    products.forEach(product => {
        if (product.status !== 'Active') return; // Only show active products
        
        // Map category to lowercase for data-category attribute
        const categoryLower = product.category.toLowerCase().trim();
        
        console.log(`Adding product: ${product.name}, Category: ${product.category} -> ${categoryLower}`);
        
        const productHTML = `
            <div class="col-lg-3 col-md-4 col-sm-6 product-item" data-category="${categoryLower}">
                <div class="product-card">
                    <div class="product-img-wrapper">
                        <img src="${product.image}" alt="${product.name}" class="product-img">
                        <div class="product-overlay">
                            <button class="btn-quick-view" onclick="openQuickView('${escapeQuotes(product.name)}', 'Fresh from our bakery', ${product.price}, '${product.image}')">
                                <i class="fa-solid fa-eye"></i> Quick View
                            </button>
                        </div>
                    </div>
                    <div class="product-info">
                        <h5 class="product-title">${escapeHtml(product.name)}</h5>
                        <span class="product-price">₹${product.price.toFixed(2)}</span>
                        <button class="btn-cart" onclick="addToCart('${escapeQuotes(product.name)}', ${product.price})">Add to Cart</button>
                    </div>
                </div>
            </div>
        `;
        
        // Check if this product already exists in the grid (by name)
        const existingProducts = productGrid.querySelectorAll('.product-title');
        let exists = false;
        existingProducts.forEach(el => {
            if (el.textContent.trim() === product.name) {
                exists = true;
            }
        });
        
        // Only add if it doesn't exist
        if (!exists) {
            productGrid.insertAdjacentHTML('beforeend', productHTML);
        }
    });
    
    console.log(`Loaded ${products.length} products from localStorage`);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function escapeQuotes(text) {
    return text.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

// Load products when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for the page to fully load
    setTimeout(() => {
        loadProductsFromStorage();
        // Trigger filter to ensure products are properly filtered
        setTimeout(() => {
            // Manually trigger the filter by dispatching a custom event
            const filterEvent = new Event('productsLoaded');
            document.dispatchEvent(filterEvent);
            
            // Also try to call filterProducts if it exists
            if (typeof window.filterProducts === 'function') {
                window.filterProducts();
            }
        }, 300);
    }, 100);
});
