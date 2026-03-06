// --- DATA & STATE ---
let cart = [];
let appliedCoupon = null;

const COUPONS = {
    'WELCOME10': { type: 'percentage', value: 10, description: '10% off for all customers' },
    'WELCOME15': { type: 'percentage', value: 15, description: '15% off for first-time customers', firstTimeOnly: true },
    'SWEET20': { type: 'percentage', value: 20, description: '20% off for all customers' },
    'BULK20': { type: 'percentage', value: 20, description: '20% off for orders with 5+ items', minItems: 5 },
    'FIRST20': { type: 'percentage', value: 20, description: '20% off for first-time customers', firstTimeOnly: true },
    'SAVE50': { type: 'fixed', value: 50, description: '₹50 off for any customer' }
};

// Load cart from localStorage on page load
function loadCartFromStorage() {
    try {
        const savedCart = localStorage.getItem('bakery_cart');
        const savedCoupon = localStorage.getItem('bakery_coupon');
        
        if (savedCart) {
            cart = JSON.parse(savedCart);
            console.log('Cart loaded from storage:', cart);
        }
        
        if (savedCoupon) {
            appliedCoupon = savedCoupon;
            console.log('Coupon loaded from storage:', appliedCoupon);
        }
        
        updateCartCount();
    } catch (e) {
        console.error('Error loading cart from storage:', e);
        cart = [];
        appliedCoupon = null;
    }
}

// Save cart to localStorage
function saveCartToStorage() {
    try {
        localStorage.setItem('bakery_cart', JSON.stringify(cart));
        if (appliedCoupon) {
            localStorage.setItem('bakery_coupon', appliedCoupon);
        } else {
            localStorage.removeItem('bakery_coupon');
        }
        console.log('Cart saved to storage');
    } catch (e) {
        console.error('Error saving cart to storage:', e);
    }
}

// --- ADMIN DATA (Today's Special & section content) ---
const ADMIN_STORAGE_KEY = 'bakeryAdminData';

const DEFAULT_ADMIN_DATA = {
    todaysSpecialSection: {
        label: "Don't Miss Out",
        title: "Today's Special",
        subtitle: "Our bakers have prepared these favourites fresh today. Limited quantities—order now to treat yourself!"
    },
    todaysSpecial: [
        { title: "Choco Lava Cake", description: "Warm, gooey chocolate centre with a soft sponge—our most loved dessert. Baked to order.", price: 900, imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=600&auto=format&fit=crop", badge: "Best Seller", badgeType: "default" },
        { title: "Butter Croissant", description: "Flaky, buttery layers made with French-style butter. Perfect with coffee.", price: 250, imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop", badge: "Fresh Today", badgeType: "new" },
        { title: "Strawberry Shortcake", description: "Light sponge, fresh cream & seasonal strawberries. A classic that never goes out of style.", price: 1100, imageUrl: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=600&auto=format&fit=crop", badge: "Customer Favourite", badgeType: "default" }
    ]
};

function getAdminData() {
    try {
        const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            return { ...DEFAULT_ADMIN_DATA, ...parsed };
        }
    } catch (e) { /* ignore */ }
    return DEFAULT_ADMIN_DATA;
}

function renderTodaysSpecial() {
    const container = document.getElementById('todays-special-cards');
    const headingLabel = document.getElementById('todays-special-label');
    const headingTitle = document.getElementById('todays-special-title');
    const headingSubtitle = document.getElementById('todays-special-subtitle');
    if (!container) return;

    const data = getAdminData();
    const section = data.todaysSpecialSection || DEFAULT_ADMIN_DATA.todaysSpecialSection;
    const items = Array.isArray(data.todaysSpecial) && data.todaysSpecial.length ? data.todaysSpecial : DEFAULT_ADMIN_DATA.todaysSpecial;

    if (headingLabel) headingLabel.textContent = section.label || "Don't Miss Out";
    if (headingTitle) headingTitle.textContent = section.title || "Today's Special";
    if (headingSubtitle) headingSubtitle.textContent = section.subtitle || "";

    const badgeIcons = { "Best Seller": "fa-star", "Fresh Today": "fa-sparkles", "Customer Favourite": "fa-heart" };
    container.innerHTML = items.map(item => {
        const icon = badgeIcons[item.badge] || "fa-star";
        const badgeClass = (item.badgeType === 'new') ? 'special-badge special-new' : 'special-badge';
        const priceStr = typeof item.price === 'number' ? `₹${item.price.toLocaleString('en-IN')}` : `₹${item.price}`;
        return `
            <div class="col-lg-4 col-md-6">
                <div class="special-card">
                    <div class="${badgeClass}"><i class="fa-solid ${icon}"></i> ${escapeHtml(item.badge || 'Special')}</div>
                    <div class="special-img-wrap">
                        <img src="${item.imageUrl}" 
                        class="special-img" 
                        alt="${item.title}" 
                        style="cursor: pointer;"
                        onclick="openQuickView('${item.title.replace(/'/g, "\\'")}', '${item.description.replace(/'/g, "\\'")}', '${item.price}', '${item.imageUrl}')">
                    </div>
                    <div class="special-content">
                        <h4 class="special-title">${escapeHtml(item.title || '')}</h4>
                        <p class="special-desc">${escapeHtml(item.description || '')}</p>
                        <div class="d-flex align-items-center justify-content-between mt-3">
                            <span class="special-price">${priceStr}</span>
                            <a href="#menu" class="btn-custom btn-sm">Order Now</a>
                        </div>
                    </div>
                </div>
            </div>`;
    }).join('');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function () {

    // --- 1. Loading Animation ---
    const loader = document.getElementById('loader-wrapper');
    if (loader) {
        window.addEventListener('load', () => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        });
    }

    // --- Load cart from localStorage ---
    loadCartFromStorage();

    // --- 2. Navbar Scroll Animation ---
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- 3. Product Filtering & Search ---
    const filterBtns = document.querySelectorAll('.filter-btn-icon');
    const productGrid = document.getElementById('product-grid');
    const sectionDivider = document.getElementById('section-divider');
    const searchInput = document.getElementById('searchInput');

    // Query product items from the grid only (exclude any message div we add)
    function getProductItems() {
        return productGrid ? productGrid.querySelectorAll('.product-item') : [];
    }
    const productItems = getProductItems();

    // Create "No items found" message and insert before first product (so it doesn't break grid order)
    let noResultsMsg = null;
    if (productGrid && productItems.length > 0) {
        noResultsMsg = document.createElement('div');
        noResultsMsg.className = 'col-12 text-center mt-5';
        noResultsMsg.id = 'no-results-msg';
        noResultsMsg.innerHTML = '<h4 class="text-muted">No sweet treats found matching your search. 🍪</h4>';
        noResultsMsg.style.display = 'none';
        productGrid.appendChild(noResultsMsg);
    }

    function filterProducts() {
        // Get fresh list of products each time filter is called
        const productItems = getProductItems();
        
        const searchTerm = (searchInput && searchInput.value) ? searchInput.value.toLowerCase().trim() : '';
        const activeBtn = document.querySelector('.filter-btn-icon.active');
        const activeCategory = activeBtn ? (activeBtn.getAttribute('data-filter') || 'all') : 'all';
        let visibleCount = 0;

        console.log('Filtering products - Category:', activeCategory, 'Search:', searchTerm, 'Total products:', productItems.length);

        // Hide divider when searching or filtering by category
        if (sectionDivider) {
            sectionDivider.style.display = (activeCategory === 'all' && searchTerm === '') ? 'block' : 'none';
        }

        productItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category') || '';
            const titleEl = item.querySelector('.product-title');
            const itemTitle = (titleEl && titleEl.textContent) ? titleEl.textContent.toLowerCase().trim() : '';

            const matchesCategory = activeCategory === 'all' || itemCategory === activeCategory;
            const matchesSearch = searchTerm === '' || itemTitle.includes(searchTerm);

            if (matchesCategory && matchesSearch) {
                item.style.display = '';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });

        console.log('Visible products:', visibleCount);

        if (noResultsMsg) {
            noResultsMsg.style.display = visibleCount === 0 ? 'block' : 'none';
        }
    }

    // Make filterProducts globally accessible
    window.filterProducts = filterProducts;

    // Listen for products loaded event to refresh the filter
    document.addEventListener('productsLoaded', function() {
        console.log('Products loaded event received, running filter...');
        filterProducts();
    });

    // Search input: run on input and keyup for broad compatibility
    if (searchInput) {
        searchInput.addEventListener('input', filterProducts);
        searchInput.addEventListener('keyup', filterProducts);
    }

    // Filter button clicks
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterProducts();
        });
    });

    // Run once on load so state is correct (e.g. if user had focus in search)
    filterProducts();

    // --- 4. CART SYSTEM ---
    const cartModalElement = document.getElementById('cartModal');
    const cartModal = new bootstrap.Modal(cartModalElement);

    // Open Modal when clicking cart icon
    const cartButton = document.getElementById('cartButton');
    if (cartButton) {
        cartButton.addEventListener('click', () => {
            renderCart();
            cartModal.show();
        });
    }

    // --- 7. Scroll To Top ---
    const scrollBtn = document.getElementById('scrollTopBtn');
    if (scrollBtn) {
        window.addEventListener('scroll', () => {
            scrollBtn.style.display = window.scrollY > 300 ? 'flex' : 'none';
        });
        scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // --- 8. Close Mobile Menu on Link Click ---
    const navLinks = document.querySelectorAll('.nav-link:not(#cartButton)');
    navLinks.forEach(l => {
        l.addEventListener('click', () => {
            const menu = document.getElementById('navbarNav');
            if (menu.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(menu);
                bsCollapse.toggle();
            }
        });
    });

    // --- 10. Scroll Animations ---
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Get all animated elements
        const animatedElements = document.querySelectorAll(
            '.animate-on-scroll, .animate-fade-in, .animate-slide-left, .animate-slide-right, .animate-scale, .animate-bounce'
        );

        // Observe each element
        animatedElements.forEach(el => {
            observer.observe(el);
        });

        // Immediately show elements that are already in viewport
        function checkVisibleElements() {
            animatedElements.forEach(el => {
                const rect = el.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight - 100 && rect.bottom > 0;
                
                if (isVisible) {
                    el.classList.add('animate-in');
                }
            });
        }

        // Check on load and scroll
        checkVisibleElements();
        window.addEventListener('scroll', checkVisibleElements);
        
        // Force animation for above-fold content after page load
        setTimeout(() => {
            const aboveFold = document.querySelectorAll('.hero-section .animate-slide-left, .hero-section .animate-slide-right');
            aboveFold.forEach(el => {
                el.classList.add('animate-immediate');
            });
            
            // Trigger animations for elements in first section
            checkVisibleElements();
        }, 100);
    }

    // Initialize animations
    initScrollAnimations();
});

// --- CART FUNCTIONS (Global Scope for onclick) ---

// Add to Cart Function
function addToCart(itemName, itemPrice) {
    console.log('addToCart called:', itemName, itemPrice);
    
    // Check if AuthManager is available
    if (typeof AuthManager === 'undefined') {
        console.error('AuthManager not loaded');
        showToast('Authentication system not loaded. Please refresh the page.');
        return;
    }

    // Check if user is logged in
    const isLoggedIn = AuthManager.isLoggedIn();
    console.log('User logged in:', isLoggedIn);
    
    if (!isLoggedIn) {
        showToast('Please login or register to add items to cart!');
        
        // Show auth modal if function exists
        if (typeof showAuthModal === 'function') {
            console.log('Opening auth modal');
            showAuthModal('login');
        } else {
            console.error('showAuthModal function not found');
        }
        return;
    }

    // Check if item already exists
    const existingItem = cart.find(item => item.name === itemName);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name: itemName, price: itemPrice, quantity: 1 });
    }
    
    // Save cart to localStorage
    saveCartToStorage();
    
    updateCartCount();
    showToast(`${itemName} added to cart!`);
    console.log('Item added to cart successfully');
}



// Update Badge Count
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const badge = document.getElementById('cartCount');
    if (badge) {
        badge.innerText = count;
        badge.style.display = count > 0 ? 'block' : 'none';
    }
}

// Render Items inside Modal
function renderCart() {
    const list = document.getElementById('cartItemsList');
    const subtotalEl = document.getElementById('cartSubtotal');
    const totalEl = document.getElementById('cartTotal');
    const discountRow = document.getElementById('discountRow');
    const discountEl = document.getElementById('cartDiscount');
    const couponInput = document.getElementById('couponCode');
    const couponMessage = document.getElementById('couponMessage');

    if (!list || !totalEl) return;

    list.innerHTML = '';

    if (cart.length === 0) {
        list.innerHTML = '<li class="list-group-item text-center text-muted">Your cart is empty. Add some treats!</li>';
        subtotalEl.innerText = '₹0.00';
        totalEl.innerText = '₹0.00';
        discountRow.style.display = 'none';

        // Reset Coupon State
        appliedCoupon = null;
        if (couponInput) couponInput.value = '';
        if (couponMessage) {
            couponMessage.style.display = 'none';
            couponMessage.classList.remove('text-danger');
            couponMessage.classList.add('text-success');
        }
        return;
    }

    let subtotal = 0;
    cart.forEach((item, index) => {
        subtotal += item.price * item.quantity;
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <strong>${item.name}</strong><br>
                    <small class="text-muted">₹${item.price.toFixed(2)} each</small>
                </div>
                <div class="d-flex align-items-center">
                    <button class="btn btn-sm btn-outline-secondary me-2" onclick="decreaseQuantity(${index})" style="width: 30px; height: 30px; padding: 0;">-</button>
                    <span class="mx-2 fw-bold">${item.quantity}</span>
                    <button class="btn btn-sm btn-outline-secondary me-3" onclick="increaseQuantity(${index})" style="width: 30px; height: 30px; padding: 0;">+</button>
                    <span class="fw-bold me-3">₹${(item.price * item.quantity).toFixed(2)}</span>
                    <button class="btn btn-sm btn-outline-danger" onclick="removeItemCompletely(${index})" title="Remove all">&times;</button>
                </div>
            </div>
        `;
        list.appendChild(li);
    });

    let discountAmount = 0;
    let discountText = '';
    
    if (appliedCoupon && COUPONS[appliedCoupon]) {
        const coupon = COUPONS[appliedCoupon];
        
        if (coupon.type === 'percentage') {
            discountAmount = (subtotal * coupon.value) / 100;
            discountText = `-₹${discountAmount.toFixed(2)} (${coupon.value}% off)`;
        } else if (coupon.type === 'fixed') {
            discountAmount = coupon.value;
            discountText = `-₹${discountAmount.toFixed(2)}`;
        }
        
        discountRow.style.display = 'flex';
        discountEl.innerText = discountText;
        
        // Show applied coupon in input and update button
        if (couponInput) {
            couponInput.value = appliedCoupon;
        }
        
        // Update the apply button to show "Remove" when coupon is applied
        const applyBtn = document.getElementById('applyCouponBtn');
        if (applyBtn) {
            applyBtn.textContent = 'Remove';
            applyBtn.onclick = removeCoupon;
            applyBtn.className = 'btn btn-outline-danger';
        }
        
        // Show success message
        if (couponMessage) {
            const coupon = COUPONS[appliedCoupon];
            couponMessage.innerText = `Coupon '${appliedCoupon}' applied! ${coupon.description}`;
            couponMessage.className = "small mt-1 text-success fw-bold";
            couponMessage.style.display = 'block';
        }
    } else {
        discountRow.style.display = 'none';
        
        // Reset button to "Apply"
        const applyBtn = document.getElementById('applyCouponBtn');
        if (applyBtn) {
            applyBtn.textContent = 'Apply';
            applyBtn.onclick = applyCoupon;
            applyBtn.className = 'btn btn-outline-secondary';
        }
    }

    const finalTotal = subtotal - discountAmount;

    subtotalEl.innerText = `₹${subtotal.toFixed(2)}`;
    totalEl.innerText = `₹${finalTotal.toFixed(2)}`;
}

// Apply Coupon
function applyCoupon() {
    const input = document.getElementById('couponCode');
    const message = document.getElementById('couponMessage');
    const code = input.value.trim().toUpperCase();

    // If input is empty and there's an applied coupon, remove it
    if (!code) {
        if (appliedCoupon) {
            appliedCoupon = null;
            saveCartToStorage();
            message.innerText = "Coupon removed.";
            message.className = "small mt-1 text-info fw-bold";
            message.style.display = 'block';
            renderCart();
            return;
        } else {
            message.innerText = "Please enter a code.";
            message.className = "small mt-1 text-danger fw-bold";
            message.style.display = 'block';
            return;
        }
    }

    if (COUPONS.hasOwnProperty(code)) {
        const coupon = COUPONS[code];
        
        // Check if coupon is for first-time customers only
        if (coupon.firstTimeOnly) {
            // Check if user has previous orders
            const currentUser = AuthManager.getCurrentUser();
            if (currentUser) {
                const orders = JSON.parse(localStorage.getItem('bakery_orders') || '[]');
                const userOrders = orders.filter(o => o.email === currentUser.email);
                
                if (userOrders.length > 0) {
                    message.innerText = "This coupon is only for first-time customers.";
                    message.className = "small mt-1 text-danger fw-bold";
                    message.style.display = 'block';
                    return;
                }
            }
        }
        
        // Check if coupon requires minimum items
        if (coupon.minItems) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            if (totalItems < coupon.minItems) {
                message.innerText = `This coupon requires at least ${coupon.minItems} items in cart. You have ${totalItems} items.`;
                message.className = "small mt-1 text-danger fw-bold";
                message.style.display = 'block';
                return;
            }
        }
        
        appliedCoupon = code;
        saveCartToStorage(); // Save coupon
        message.innerText = `Coupon '${code}' applied successfully! ${coupon.description}`;
        message.className = "small mt-1 text-success fw-bold";
        message.style.display = 'block';
        renderCart();
    } else {
        // Invalid coupon - don't change the applied coupon, just show error
        message.innerText = "Invalid coupon code.";
        message.className = "small mt-1 text-danger fw-bold";
        message.style.display = 'block';
    }
}

// Remove Coupon
function removeCoupon() {
    const input = document.getElementById('couponCode');
    const message = document.getElementById('couponMessage');
    
    appliedCoupon = null;
    saveCartToStorage();
    
    if (input) {
        input.value = '';
    }
    
    if (message) {
        message.innerText = "Coupon removed.";
        message.className = "small mt-1 text-info fw-bold";
        message.style.display = 'block';
        
        // Hide message after 2 seconds
        setTimeout(() => {
            message.style.display = 'none';
        }, 2000);
    }
    
    renderCart();
}

// Remove Item (decrease quantity by 1)
function removeFromCart(index) {
    if (index >= 0 && index < cart.length) {
        // Decrease quantity by 1
        cart[index].quantity -= 1;
        
        // If quantity becomes 0, remove the item completely
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        
        saveCartToStorage(); // Save after removing
        updateCartCount();
        renderCart();
    }
}

// Decrease quantity by 1
function decreaseQuantity(index) {
    if (index >= 0 && index < cart.length) {
        cart[index].quantity -= 1;
        
        // If quantity becomes 0, remove the item completely
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        
        saveCartToStorage();
        updateCartCount();
        renderCart();
    }
}

// Increase quantity by 1
function increaseQuantity(index) {
    if (index >= 0 && index < cart.length) {
        cart[index].quantity += 1;
        saveCartToStorage();
        updateCartCount();
        renderCart();
    }
}

// Remove item completely (all quantities)
function removeItemCompletely(index) {
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        saveCartToStorage();
        updateCartCount();
        renderCart();
    }
}

// Checkout Function
function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    // Check if user is logged in
    if (typeof AuthManager === 'undefined' || !AuthManager.isLoggedIn()) {
        alert("Please login to complete your purchase!");
        showAuthModal('login');
        return;
    }

    const currentUser = AuthManager.getCurrentUser();
    const checkoutBtn = document.querySelector('#cartModal .btn-custom');
    
    if (checkoutBtn) {
        const originalText = checkoutBtn.innerText;
        checkoutBtn.innerText = "Processing...";
        checkoutBtn.disabled = true;

        setTimeout(() => {
            // Calculate totals
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            let discount = 0;
            
            if (appliedCoupon && COUPONS[appliedCoupon]) {
                const coupon = COUPONS[appliedCoupon];
                if (coupon.type === 'percentage') {
                    discount = (subtotal * coupon.value) / 100;
                } else if (coupon.type === 'fixed') {
                    discount = coupon.value;
                }
            }
            
            const total = subtotal - discount;

            // Create order object
            const order = {
                id: 'ORD-' + Date.now(),
                customerId: currentUser.id,
                customerName: currentUser.name,
                email: currentUser.email,
                phone: currentUser.phone || '',
                address: currentUser.address || '',
                items: cart.map(item => ({
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                })),
                itemsSummary: cart.map(item => `${item.name} x${item.quantity}`).join(', '),
                subtotal: subtotal,
                discount: discount,
                couponUsed: appliedCoupon || '',
                total: total,
                status: 'Pending',
                date: new Date().toLocaleDateString('en-IN'),
                timestamp: Date.now()
            };

            // Save order to localStorage (for admin panel)
            try {
                const orders = JSON.parse(localStorage.getItem('bakery_orders') || '[]');
                orders.push(order);
                localStorage.setItem('bakery_orders', JSON.stringify(orders));
                console.log('Order saved successfully:', order.id);
            } catch (e) {
                console.error('Error saving order:', e);
            }

            // Close modal
            const modalEl = document.getElementById('cartModal');
            const modalInstance = bootstrap.Modal.getInstance(modalEl);
            if (modalInstance) modalInstance.hide();

            // Show success message
            alert(`Order Placed Successfully!\n\nOrder ID: ${order.id}\nAmount Paid: ₹${total.toFixed(2)}\n\nThanks for shopping with Sweet Treats, ${currentUser.name}!`);

            // Clear cart
            cart = [];
            appliedCoupon = null;
            
            // Clear cart from localStorage
            localStorage.removeItem('bakery_cart');
            localStorage.removeItem('bakery_coupon');
            
            checkoutBtn.innerText = originalText;
            checkoutBtn.disabled = false;

            updateCartCount();
        }, 1500);
    }
}

// --- 5. Toast Notification ---
function showToast(message) {
    const toast = document.getElementById('cartToast');
    const msg = document.getElementById('toastMessage');
    if (toast && msg) {
        msg.textContent = message;
        toast.classList.add('show');
        setTimeout(() => { toast.classList.remove('show'); }, 3000);
    }
}

// --- 6. Contact Form Validation ---
function handleFormSubmit(event) {
    event.preventDefault();
    const btn = event.target.querySelector('button');
    const originalText = btn.innerText;
    btn.innerText = 'Message Sent!';
    btn.style.backgroundColor = '#4CAF50';
    setTimeout(() => {
        btn.innerText = originalText;
        btn.style.backgroundColor = '';
        document.getElementById('contactForm').reset();
    }, 3000);
}
function openQuickView(title, desc, price, img) {
    const content = document.getElementById('quickViewContent');
    content.innerHTML = `
        <img src="${img}" alt="${title}">
        <span class="badge">Bakery Fresh</span>
        <h3>${title}</h3>
        <p class="text-muted mb-3">${desc}</p>
        <div class="d-flex justify-content-between align-items-center">
            <span class="price-tag">₹${price}</span>
            <button class="btn btn-custom" 
                    style="background: var(--dark-chocolate); color: white;" 
                    onclick="addToCart('${title}', ${price}, '${img}');">
                Add to Cart
            </button>
        </div>
    `;
    
    // Show the modal
    const qvModal = new bootstrap.Modal(document.getElementById('quickViewModal'));
    qvModal.show();
}

// --- Video Modal Functions ---
function toggleVideoModal() {
    const modal = document.getElementById('videoModal');
    const video = document.getElementById('modalVideo');
    
    if (modal.classList.contains('active')) {
        modal.classList.remove('active');
        video.pause();
    } else {
        modal.classList.add('active');
        video.play();
    }
}

function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    const video = document.getElementById('modalVideo');
    modal.classList.remove('active');
    video.pause();
}

function playSlowMotion(type) {
    // You can customize this to show different videos based on type
    const videoSources = {
        'dough': 'https://player.vimeo.com/external/372467507.hd.mp4?s=7b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b&profile_id=175',
        'rising': 'https://player.vimeo.com/external/372467508.hd.mp4?s=7b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b&profile_id=175',
        'baking': 'https://player.vimeo.com/external/372467509.hd.mp4?s=7b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b&profile_id=175'
    };
    
    const modal = document.getElementById('videoModal');
    const video = document.getElementById('modalVideo');
    const source = video.querySelector('source');
    
    if (videoSources[type]) {
        source.src = videoSources[type];
        video.load();
    }
    
    modal.classList.add('active');
    video.play();
}

// Initialize video hover effects when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Video Hover Effects for Slow Motion Cards
    const slomoCards = document.querySelectorAll('.slomo-video-card');
    slomoCards.forEach(card => {
        const video = card.querySelector('.slomo-preview');
        
        card.addEventListener('mouseenter', () => {
            if (video) video.play();
        });
        
        card.addEventListener('mouseleave', () => {
            if (video) {
                video.pause();
                video.currentTime = 0;
            }
        });
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeVideoModal();
        }
    });
});

// Test function for reviews (can be called from browser console)
window.testReviews = function() {
    console.log('=== ADDING TEST REVIEW ===');
    
    // Add a test review with Approved status
    const testReview = {
        id: Date.now(),
        userId: 999,
        customerName: "Test Customer",
        email: "test@gmail.com",
        rating: 5,
        comment: "This is a test review to verify the system works!",
        date: new Date().toLocaleDateString('en-IN'),
        timestamp: Date.now(),
        status: 'Approved'  // Already approved for testing
    };
    
    const reviews = JSON.parse(localStorage.getItem('bakery_reviews') || '[]');
    reviews.push(testReview);
    localStorage.setItem('bakery_reviews', JSON.stringify(reviews));
    
    console.log('Test review added:', testReview);
    console.log('Total reviews now:', reviews.length);
    
    // Reload the page to see the review
    alert('Test review added! Page will reload to show it.');
    location.reload();
};

// Function to manually reload reviews
window.reloadReviews = function() {
    console.log('=== RELOADING REVIEWS ===');
    if (typeof loadApprovedReviews === 'function') {
        loadApprovedReviews();
        console.log('Reviews reloaded');
    } else {
        console.error('loadApprovedReviews function not found');
    }
};

// Function to check current reviews status
window.checkReviews = function() {
    console.log('=== CHECKING REVIEWS ===');
    const allReviews = JSON.parse(localStorage.getItem('bakery_reviews') || '[]');
    const approved = allReviews.filter(r => r.status === 'Approved');
    const pending = allReviews.filter(r => r.status === 'Pending');
    const rejected = allReviews.filter(r => r.status === 'Rejected');
    
    console.log('Total reviews:', allReviews.length);
    console.log('Approved:', approved.length);
    console.log('Pending:', pending.length);
    console.log('Rejected:', rejected.length);
    console.log('All reviews:', allReviews);
    
    return {
        total: allReviews.length,
        approved: approved.length,
        pending: pending.length,
        rejected: rejected.length,
        reviews: allReviews
    };
};

// Function to clear all reviews
window.clearAllReviews = function() {
    if (confirm('Are you sure you want to clear all reviews?')) {
        localStorage.removeItem('bakery_reviews');
        console.log('All reviews cleared');
        alert('All reviews cleared! Page will reload.');
        location.reload();
    }
};


// Load store settings from localStorage
function loadStoreSettings() {
    console.log('Loading store settings...');
    
    // Load store info
    const storeInfo = JSON.parse(localStorage.getItem('bakery_store_info') || 'null');
    if (storeInfo) {
        console.log('Store info found:', storeInfo);
        
        // Update footer contact info
        const footerEmail = document.querySelector('.footer .contact-info p:has(.fa-envelope)');
        if (footerEmail && storeInfo.email) {
            footerEmail.innerHTML = `<i class="fas fa-envelope"></i> ${storeInfo.email}`;
        }
        
        const footerPhone = document.querySelector('.footer .contact-info p:has(.fa-phone)');
        if (footerPhone && storeInfo.phone) {
            footerPhone.innerHTML = `<i class="fas fa-phone"></i> ${storeInfo.phone}`;
        }
        
        const footerAddress = document.querySelector('.footer .contact-info p:has(.fa-map-marker-alt)');
        if (footerAddress && storeInfo.address) {
            footerAddress.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${storeInfo.address}`;
        }
        
        // Update brand name if changed
        if (storeInfo.name) {
            const brandElements = document.querySelectorAll('.navbar-brand, .brand-font');
            brandElements.forEach(el => {
                if (el.classList.contains('navbar-brand') || el.classList.contains('brand-font')) {
                    el.textContent = storeInfo.name;
                }
            });
        }
        
        // Update contact page feature boxes
        const contactFeatureBoxes = document.querySelectorAll('.feature-box');
        if (contactFeatureBoxes.length >= 3) {
            // Update location box
            if (storeInfo.address) {
                const locationBox = contactFeatureBoxes[0];
                const locationText = locationBox.querySelector('p');
                if (locationText) {
                    locationText.innerHTML = storeInfo.address.replace(/\n/g, '<br>');
                }
            }
            
            // Update phone box
            if (storeInfo.phone) {
                const phoneBox = contactFeatureBoxes[1];
                const phoneText = phoneBox.querySelector('p');
                const phoneLink = phoneBox.querySelector('a[href^="tel:"]');
                if (phoneText) {
                    phoneText.innerHTML = `Phone: ${storeInfo.phone}<br>Available 7 days a week`;
                }
                if (phoneLink) {
                    phoneLink.href = `tel:${storeInfo.phone.replace(/[^0-9+]/g, '')}`;
                }
            }
            
            // Update email box
            if (storeInfo.email) {
                const emailBox = contactFeatureBoxes[2];
                const emailText = emailBox.querySelector('p');
                const emailLink = emailBox.querySelector('a[href^="mailto:"]');
                if (emailText) {
                    emailText.innerHTML = `General: ${storeInfo.email}<br>Orders: ${storeInfo.email}<br>Catering: ${storeInfo.email}`;
                }
                if (emailLink) {
                    emailLink.href = `mailto:${storeInfo.email}`;
                }
            }
        }
        
        // Update contact page map section with real Google Maps
        const mapContainer = document.querySelector('.map-container');
        if (mapContainer && storeInfo.address) {
            // Encode address for Google Maps URL
            const encodedAddress = encodeURIComponent(storeInfo.address);
            
            // Create Google Maps iframe
            mapContainer.innerHTML = `
                <iframe 
                    src="https://maps.google.com/maps?q=${encodedAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    width="100%" 
                    height="400" 
                    style="border:0; border-radius: 15px;" 
                    allowfullscreen="" 
                    loading="lazy" 
                    referrerpolicy="no-referrer-when-downgrade">
                </iframe>
            `;
        }
        
        // Update "Open in Google Maps" button
        const mapButton = document.querySelector('a[href*="maps.google.com"]');
        if (mapButton && storeInfo.address) {
            const encodedAddress = encodeURIComponent(storeInfo.address);
            mapButton.href = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
        }
    }
    
    // Load business hours
    const businessHours = JSON.parse(localStorage.getItem('bakery_business_hours') || 'null');
    if (businessHours) {
        console.log('Business hours found:', businessHours);
        
        // Format time from 24h to 12h format
        function formatTime(time24) {
            const [hours, minutes] = time24.split(':');
            const hour = parseInt(hours);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const hour12 = hour % 12 || 12;
            return `${hour12}:${minutes} ${ampm}`;
        }
        
        // Update footer business hours
        const footerHours = document.querySelector('.footer .contact-info p:has(.fa-clock)');
        if (footerHours && businessHours.openingTime && businessHours.closingTime) {
            const workingDays = businessHours.workingDays.filter(d => d.open).map(d => d.day);
            const daysText = workingDays.length === 7 ? 'Mon-Sun' : 
                            workingDays.length === 5 && workingDays[0] === 'Mon' ? 'Mon-Fri' :
                            workingDays.join(', ');
            
            footerHours.innerHTML = `<i class="fas fa-clock"></i> ${daysText}: ${formatTime(businessHours.openingTime)} - ${formatTime(businessHours.closingTime)}`;
        }
        
        // Update contact page opening hours section
        const openingHoursDiv = document.querySelector('.opening-hours');
        if (openingHoursDiv && businessHours.openingTime && businessHours.closingTime) {
            const timeRange = `${formatTime(businessHours.openingTime)} - ${formatTime(businessHours.closingTime)}`;
            
            // Update each day's hours
            const hourRows = openingHoursDiv.querySelectorAll('.d-flex.justify-content-between');
            if (hourRows.length >= 3) {
                const dayMap = {
                    'Monday - Friday': ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
                    'Saturday': ['Sat'],
                    'Sunday': ['Sun']
                };
                
                hourRows.forEach((row, index) => {
                    const dayLabel = row.querySelector('strong');
                    if (dayLabel && index < 3) {
                        const dayKey = dayLabel.textContent.trim();
                        const daysToCheck = dayMap[dayKey] || [];
                        
                        // Check if any of these days are open
                        const isOpen = daysToCheck.some(day => {
                            const dayInfo = businessHours.workingDays.find(d => d.day === day);
                            return dayInfo && dayInfo.open;
                        });
                        
                        const timeSpan = row.querySelector('span:last-child');
                        if (timeSpan) {
                            timeSpan.textContent = isOpen ? timeRange : 'Closed';
                        }
                    }
                });
            }
        }
    }
}

// Load settings when page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(loadStoreSettings, 200);
});

// Also load when page becomes visible (when switching from admin panel)
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        setTimeout(loadStoreSettings, 200);
    }
});