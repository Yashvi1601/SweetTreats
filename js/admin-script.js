// Admin Panel JavaScript

// Sample Data
const productsData = [
    { id: 1, name: 'Chocolate Lava Cake', category: 'Cakes', price: 450, stock: 25, status: 'Active', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=100&auto=format&fit=crop' },
    { id: 2, name: 'Butter Croissant', category: 'Pastries', price: 120, stock: 50, status: 'Active', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=100&auto=format&fit=crop' },
    { id: 3, name: 'Sourdough Bread', category: 'Breads', price: 280, stock: 30, status: 'Active', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=100&auto=format&fit=crop' },
    { id: 4, name: 'Red Velvet Cupcake', category: 'Cakes', price: 180, stock: 40, status: 'Active', image: 'https://images.unsplash.com/photo-1587241321921-91a834d82ffc?q=80&w=100&auto=format&fit=crop' },
    { id: 5, name: 'Blueberry Muffin', category: 'Pastries', price: 150, stock: 35, status: 'Active', image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?q=80&w=100&auto=format&fit=crop' },
];

const ordersData = [
    { id: 'ORD-1234', customer: 'Sarah Johnson', items: 'Chocolate Lava Cake', total: 450, status: 'Completed', date: '2024-02-09' },
    { id: 'ORD-1235', customer: 'Michael Chen', items: 'Butter Croissant x3', total: 360, status: 'Pending', date: '2024-02-09' },
    { id: 'ORD-1236', customer: 'Emma Rodriguez', items: 'Sourdough Bread', total: 280, status: 'Processing', date: '2024-02-09' },
    { id: 'ORD-1237', customer: 'John Smith', items: 'Red Velvet Cupcake x2', total: 360, status: 'Completed', date: '2024-02-08' },
    { id: 'ORD-1238', customer: 'Lisa Anderson', items: 'Blueberry Muffin x4', total: 600, status: 'Processing', date: '2024-02-08' },
];

const customersData = [
    { name: 'Sarah Johnson', email: 'sarah@example.com', phone: '+1 555-0101', orders: 15, spent: 6750, joined: '2023-05-12' },
    { name: 'Michael Chen', email: 'michael@example.com', phone: '+1 555-0102', orders: 12, spent: 5400, joined: '2023-06-20' },
    { name: 'Emma Rodriguez', email: 'emma@example.com', phone: '+1 555-0103', orders: 20, spent: 9000, joined: '2023-04-08' },
    { name: 'John Smith', email: 'john@example.com', phone: '+1 555-0104', orders: 8, spent: 3600, joined: '2023-07-15' },
];

const reviewsData = [
    { customer: 'Sarah Johnson', rating: 5, comment: 'The best bakery in town! Their chocolate lava cake is absolutely divine.', date: '2024-02-08', status: 'Approved' },
    { customer: 'Michael Chen', rating: 5, comment: 'Amazing quality and service! I ordered a custom birthday cake and it exceeded all expectations.', date: '2024-02-07', status: 'Approved' },
    { customer: 'Emma Rodriguez', rating: 5, comment: 'Their croissants are just like the ones I had in Paris! Fresh, buttery, and perfectly flaky.', date: '2024-02-06', status: 'Pending' },
    { customer: 'John Smith', rating: 4, comment: 'Great products, but delivery was a bit slow. Overall satisfied with the quality.', date: '2024-02-05', status: 'Pending' },
];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeSidebar();
    loadProducts();
    loadOrders();
    loadCustomers();
    loadRegisteredUsers();
    loadReviews();
    initializeChart();
    updateDashboardStats();
    loadRecentOrders();
    
    // Auto-refresh dashboard stats and recent orders every 30 seconds
    setInterval(() => {
        updateDashboardStats();
        loadRecentOrders();
    }, 30000);
});

// Sidebar Navigation
function initializeSidebar() {
    const menuItems = document.querySelectorAll('.menu-item');
    const sections = document.querySelectorAll('.content-section');

    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            
            // Update active menu item
            menuItems.forEach(mi => mi.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding section
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === sectionId) {
                    section.classList.add('active');
                }
            });
        });
    });

    // Toggle sidebar on mobile
    const toggleBtn = document.getElementById('toggleSidebar');
    const sidebar = document.getElementById('sidebar');
    
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
}

// Load Products
function loadProducts() {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;

    // Get products from localStorage, or use default data
    let products = JSON.parse(localStorage.getItem('bakery_products') || 'null');
    
    // If no products in localStorage, save default products
    if (!products || products.length === 0) {
        products = productsData;
        localStorage.setItem('bakery_products', JSON.stringify(products));
    }

    tbody.innerHTML = products.map(product => `
        <tr>
            <td><img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; border-radius: 8px; object-fit: cover;"></td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>₹${product.price}</td>
            <td>
                <button class="btn-action" onclick="editProduct(${product.id})"><i class="fa-solid fa-edit"></i></button>
                <button class="btn-action" onclick="deleteProduct(${product.id})"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

// Load Orders
function loadOrders() {
    const tbody = document.getElementById('ordersTableBody');
    if (!tbody) return;

    // Get real orders from localStorage
    const realOrders = JSON.parse(localStorage.getItem('bakery_orders') || '[]');
    
    // Combine with sample data if needed, or use only real orders
    const allOrders = realOrders.length > 0 ? realOrders : ordersData;

    if (allOrders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted py-4">
                    <i class="fa-solid fa-shopping-bag fa-3x mb-3" style="opacity: 0.3;"></i>
                    <p>No orders yet</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = allOrders.map(order => {
        // Handle both old format (customer) and new format (customerName)
        const customerName = order.customerName || order.customer || 'Unknown';
        const items = order.itemsSummary || order.items || '';

        return `
            <tr>
                <td>${order.id}</td>
                <td>${customerName}</td>
                <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${items}</td>
                <td>₹${order.total}</td>
                <td>${order.date}</td>
                <td>
                    <button class="btn-action" onclick="viewOrder('${order.id}')"><i class="fa-solid fa-eye"></i></button>
                </td>
            </tr>
        `;
    }).join('');
}

function filterOrders(status) {
    const tbody = document.getElementById('ordersTableBody');
    if (!tbody) return;

    // Get real orders from localStorage
    const realOrders = JSON.parse(localStorage.getItem('bakery_orders') || '[]');
    const allOrders = realOrders.length > 0 ? realOrders : ordersData;

    const filteredOrders = status === 'all' 
        ? allOrders 
        : allOrders.filter(order => order.status.toLowerCase() === status);

    tbody.innerHTML = filteredOrders.map(order => {
        const customerName = order.customerName || order.customer || 'Unknown';
        const items = order.itemsSummary || order.items || '';

        return `
            <tr>
                <td>${order.id}</td>
                <td>${customerName}</td>
                <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${items}</td>
                <td>₹${order.total}</td>
                <td>${order.date}</td>
                <td>
                    <button class="btn-action" onclick="viewOrder('${order.id}')"><i class="fa-solid fa-eye"></i></button>
                </td>
            </tr>
        `;
    }).join('');
}

// Load Recent Orders for Dashboard
function loadRecentOrders() {
    const tbody = document.getElementById('recentOrdersTableBody');
    if (!tbody) return;

    // Get real orders from localStorage
    const realOrders = JSON.parse(localStorage.getItem('bakery_orders') || '[]');
    
    if (realOrders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-muted py-4">
                    <i class="fa-solid fa-shopping-bag fa-2x mb-2" style="opacity: 0.3;"></i>
                    <p>No recent orders</p>
                </td>
            </tr>
        `;
        return;
    }

    // Sort by timestamp (newest first) and take only the 5 most recent
    const recentOrders = realOrders
        .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
        .slice(0, 5);

    tbody.innerHTML = recentOrders.map(order => {
        const customerName = order.customerName || order.customer || 'Unknown';
        const items = order.itemsSummary || order.items || '';

        return `
            <tr>
                <td>${order.id}</td>
                <td>${customerName}</td>
                <td style="max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${items}</td>
                <td>₹${order.total}</td>
                <td>${order.date}</td>
                <td>
                    <button class="btn-action" onclick="viewOrder('${order.id}')" title="View Details">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Load Customers
function loadCustomers() {
    const tbody = document.getElementById('customersTableBody');
    if (!tbody) return;

    // Get real users and orders from localStorage
    const users = AuthManager.getUsers();
    const orders = JSON.parse(localStorage.getItem('bakery_orders') || '[]');
    
    if (users.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted py-4">
                    <i class="fa-solid fa-users fa-3x mb-3" style="opacity: 0.3;"></i>
                    <p>No customers yet</p>
                </td>
            </tr>
        `;
        return;
    }

    // Calculate order statistics for each user
    const customersWithStats = users.map(user => {
        const userOrders = orders.filter(o => o.email === user.email);
        const totalSpent = userOrders.reduce((sum, o) => sum + (o.total || 0), 0);
        
        return {
            name: user.name,
            email: user.email,
            phone: user.phone || 'N/A',
            orders: userOrders.length,
            spent: totalSpent,
            joined: user.registeredDate
        };
    });

    tbody.innerHTML = customersWithStats.map(customer => `
        <tr>
            <td>${customer.name}</td>
            <td>${customer.email}</td>
            <td>${customer.phone}</td>
            <td>${customer.orders}</td>
            <td>₹${customer.spent.toLocaleString('en-IN')}</td>
            <td>${customer.joined}</td>
            <td>
                <button class="btn-action" onclick="viewCustomer('${customer.email}')" title="View Details"><i class="fa-solid fa-eye"></i></button>
                <button class="btn-action" onclick="contactCustomer('${customer.email}')" title="Contact"><i class="fa-solid fa-envelope"></i></button>
            </td>
        </tr>
    `).join('');
}

// Load Reviews
function loadReviews() {
    const container = document.getElementById('reviewsContainer');
    if (!container) return;

    // Get reviews from localStorage
    const reviews = JSON.parse(localStorage.getItem('bakery_reviews') || '[]');
    
    if (reviews.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fa-solid fa-star fa-3x mb-3" style="opacity: 0.3; color: #999;"></i>
                <p class="text-muted">No reviews yet</p>
            </div>
        `;
        return;
    }

    // Sort by timestamp (newest first)
    reviews.sort((a, b) => b.timestamp - a.timestamp);

    container.innerHTML = reviews.map(review => {
        const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
        let badgeClass = 'badge-warning';
        if (review.status === 'Approved') badgeClass = 'badge-success';
        if (review.status === 'Rejected') badgeClass = 'badge-danger';

        return `
            <div class="col-lg-6">
                <div class="card">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <div>
                                <h5 style="margin-bottom: 0.5rem;">${review.customerName}</h5>
                                <small style="color: #999;">${review.email}</small>
                                <div style="color: #F5A623; font-size: 1.2rem; margin-top: 0.5rem;">${stars}</div>
                            </div>
                            <span class="badge ${badgeClass}">${review.status}</span>
                        </div>
                        <p style="color: #666; line-height: 1.6;">${review.comment}</p>
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <small style="color: #999;">${review.date}</small>
                            <div>
                                ${review.status === 'Pending' ? `
                                    <button class="btn-action" style="color: #28a745;" onclick="approveReview(${review.id})">
                                        <i class="fa-solid fa-check"></i> Approve
                                    </button>
                                    <button class="btn-action" style="color: #dc3545;" onclick="rejectReview(${review.id})">
                                        <i class="fa-solid fa-times"></i> Reject
                                    </button>
                                ` : ''}
                                <button class="btn-action" onclick="deleteReview(${review.id})">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Approve Review
function approveReview(id) {
    const reviews = JSON.parse(localStorage.getItem('bakery_reviews') || '[]');
    const review = reviews.find(r => r.id === id);
    
    if (!review) {
        alert('Review not found');
        return;
    }
    
    review.status = 'Approved';
    localStorage.setItem('bakery_reviews', JSON.stringify(reviews));
    
    alert('Review approved! It will now be visible on the website.');
    loadReviews();
}

// Reject Review
function rejectReview(id) {
    if (!confirm('Are you sure you want to reject this review?')) {
        return;
    }
    
    const reviews = JSON.parse(localStorage.getItem('bakery_reviews') || '[]');
    const review = reviews.find(r => r.id === id);
    
    if (!review) {
        alert('Review not found');
        return;
    }
    
    review.status = 'Rejected';
    localStorage.setItem('bakery_reviews', JSON.stringify(reviews));
    
    alert('Review rejected.');
    loadReviews();
}

// Delete Review
function deleteReview(id) {
    if (!confirm('Are you sure you want to delete this review permanently?')) {
        return;
    }
    
    let reviews = JSON.parse(localStorage.getItem('bakery_reviews') || '[]');
    reviews = reviews.filter(r => r.id !== id);
    localStorage.setItem('bakery_reviews', JSON.stringify(reviews));
    
    alert('Review deleted successfully!');
    loadReviews();
}

// Initialize Sales Chart with Real Data
function initializeChart() {
    const ctx = document.getElementById('salesChart');
    if (!ctx) return;

    // Get real orders from localStorage
    const orders = JSON.parse(localStorage.getItem('bakery_orders') || '[]');
    
    // Calculate sales for last 7 days
    const salesData = [];
    const labels = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString('en-IN');
        
        // Get day name
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayName = dayNames[date.getDay()];
        labels.push(dayName);
        
        // Calculate revenue for this day
        const dayOrders = orders.filter(o => o.date === dateStr);
        const dayRevenue = dayOrders.reduce((sum, o) => sum + (o.total || 0), 0);
        salesData.push(dayRevenue);
    }

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Sales',
                data: salesData,
                borderColor: '#FF6B9D',
                backgroundColor: 'rgba(255, 107, 157, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '₹' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

// Product Modal Functions
function openProductModal() {
    const modal = new bootstrap.Modal(document.getElementById('productModal'));
    modal.show();
}

function saveProduct() {
    alert('Product saved successfully!');
    const modal = bootstrap.Modal.getInstance(document.getElementById('productModal'));
    modal.hide();
    loadProducts();
}

function editProduct(id) {
    const products = JSON.parse(localStorage.getItem('bakery_products') || '[]');
    const product = products.find(p => p.id === id);
    
    if (!product) {
        alert('Product not found');
        return;
    }
    
    const newName = prompt('Product Name:', product.name);
    if (!newName) return;
    
    const newPrice = prompt('Price (₹):', product.price);
    if (!newPrice) return;
    
    // Update product
    product.name = newName;
    product.price = parseFloat(newPrice);
    
    // Save to localStorage
    localStorage.setItem('bakery_products', JSON.stringify(products));
    
    alert('Product updated successfully!');
    loadProducts();
}

function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        let products = JSON.parse(localStorage.getItem('bakery_products') || '[]');
        products = products.filter(p => p.id !== id);
        
        // Save to localStorage
        localStorage.setItem('bakery_products', JSON.stringify(products));
        
        alert('Product deleted successfully!');
        loadProducts();
    }
}

function addNewProduct() {
    const name = prompt('Product Name:');
    if (!name) return;
    
    const category = prompt('Category (Cakes/Pastries/Breads/Cookies/etc):');
    if (!category) return;
    
    const price = prompt('Price (₹):');
    if (!price) return;
    
    const image = prompt('Image URL:', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=400&auto=format&fit=crop');
    if (!image) return;
    
    // Get existing products
    const products = JSON.parse(localStorage.getItem('bakery_products') || '[]');
    
    // Create new product
    const newProduct = {
        id: Date.now(),
        name: name,
        category: category,
        price: parseFloat(price),
        status: 'Active',
        image: image
    };
    
    // Add to products array
    products.push(newProduct);
    
    // Save to localStorage
    localStorage.setItem('bakery_products', JSON.stringify(products));
    
    alert('Product added successfully!');
    loadProducts();
}

// Order Functions
function viewOrder(id) {
    // Get orders from localStorage
    const realOrders = JSON.parse(localStorage.getItem('bakery_orders') || '[]');
    const allOrders = realOrders.length > 0 ? realOrders : ordersData;
    
    const order = allOrders.find(o => o.id === id);
    
    if (!order) {
        alert('Order not found');
        return;
    }
    
    let details = `=== ORDER DETAILS ===\n\n`;
    details += `Order ID: ${order.id}\n`;
    details += `Customer: ${order.customerName || order.customer}\n`;
    details += `Email: ${order.email || 'N/A'}\n`;
    details += `Phone: ${order.phone || 'N/A'}\n`;
    details += `Address: ${order.address || 'N/A'}\n`;
    details += `Date: ${order.date}\n`;
    details += `Status: ${order.status}\n\n`;
    
    details += `=== ITEMS ===\n`;
    if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
            details += `- ${item.name} x${item.quantity} @ ₹${item.price} = ₹${item.price * item.quantity}\n`;
        });
    } else {
        details += order.itemsSummary || order.items || 'No items';
        details += '\n';
    }
    
    details += `\n=== PAYMENT ===\n`;
    details += `Subtotal: ₹${order.subtotal || order.total}\n`;
    if (order.discount && order.discount > 0) {
        details += `Discount: -₹${order.discount}\n`;
        if (order.couponUsed) {
            details += `Coupon: ${order.couponUsed}\n`;
        }
    }
    details += `Total: ₹${order.total}\n`;
    
    alert(details);
}

function updateOrderStatus(id) {
    const newStatus = prompt('Enter new status (Pending/Processing/Completed):');
    if (newStatus) {
        alert('Order ' + id + ' status updated to: ' + newStatus);
        loadOrders();
    }
}

// Customer Functions
function viewCustomer(email) {
    const users = AuthManager.getUsers();
    const user = users.find(u => u.email === email);
    
    if (!user) {
        alert('Customer not found');
        return;
    }
    
    // Get user's orders
    const orders = JSON.parse(localStorage.getItem('bakery_orders') || '[]');
    const userOrders = orders.filter(o => o.email === email);
    const totalSpent = userOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    
    let details = `=== CUSTOMER DETAILS ===\n\n`;
    details += `Name: ${user.name}\n`;
    details += `Email: ${user.email}\n`;
    details += `Password: ${user.password || 'Not available'}\n`;
    details += `Phone: ${user.phone || 'Not provided'}\n`;
    details += `Address: ${user.address || 'Not provided'}\n`;
    details += `Registered: ${user.registeredDate}\n\n`;
    details += `=== ORDER HISTORY ===\n`;
    details += `Total Orders: ${userOrders.length}\n`;
    details += `Total Spent: ₹${totalSpent.toLocaleString('en-IN')}\n\n`;
    
    if (userOrders.length > 0) {
        details += `Recent Orders:\n`;
        userOrders.slice(0, 5).forEach(order => {
            details += `- ${order.id}: ₹${order.total} (${order.date})\n`;
        });
    }
    
    alert(details);
}

function contactCustomer(email) {
    alert('Contact customer: ' + email);
}

// Form Submissions
document.getElementById('storeInfoForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const form = e.target;
    const storeInfo = {
        name: form.querySelector('input[type="text"]').value,
        email: form.querySelector('input[type="email"]').value,
        phone: form.querySelector('input[type="tel"]').value,
        address: form.querySelector('textarea').value
    };
    
    localStorage.setItem('bakery_store_info', JSON.stringify(storeInfo));
    alert('Store information updated successfully!');
    console.log('Store info saved:', storeInfo);
});

document.getElementById('businessHoursForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const form = e.target;
    const businessHours = {
        openingTime: form.querySelector('input[type="time"]:first-of-type').value,
        closingTime: form.querySelector('input[type="time"]:last-of-type').value,
        workingDays: Array.from(form.querySelectorAll('input[type="checkbox"]')).map((cb, index) => ({
            day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index],
            open: cb.checked
        }))
    };
    
    localStorage.setItem('bakery_business_hours', JSON.stringify(businessHours));
    alert('Business hours updated successfully!');
    console.log('Business hours saved:', businessHours);
});


// ===== REGISTERED USERS MANAGEMENT =====

// Load Registered Users
function loadRegisteredUsers() {
    const tbody = document.getElementById('usersTableBody');
    const countBadge = document.getElementById('totalUsersCount');
    
    if (!tbody) return;

    const users = AuthManager.getUsers();
    
    if (countBadge) {
        countBadge.textContent = `${users.length} Users`;
    }

    if (users.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted py-4">
                    <i class="fa-solid fa-users fa-3x mb-3" style="opacity: 0.3;"></i>
                    <p>No registered users yet</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = users.map(user => {
        return `
            <tr>
                <td>
                    <div class="d-flex align-items-center gap-2">
                        <i class="fa-solid fa-user-circle" style="font-size: 1.5rem; color: var(--primary-pink);"></i>
                        <strong>${user.name}</strong>
                    </div>
                </td>
                <td>${user.email}</td>
                <td><span style="font-family: monospace; background: #f0f0f0; padding: 4px 8px; border-radius: 4px;">${user.password || '-'}</span></td>
                <td>${user.phone || '-'}</td>
                <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${user.address || '-'}</td>
                <td>${user.registeredDate}</td>
                <td>
                    <button class="btn-action" onclick="viewUserDetails(${user.id})" title="View Details">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                    <button class="btn-action" onclick="contactUser('${user.email}')" title="Contact">
                        <i class="fa-solid fa-envelope"></i>
                    </button>
                    <button class="btn-action" onclick="deleteUser(${user.id})" title="Delete" style="color: #FF6B6B;">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// View User Details
function viewUserDetails(userId) {
    const users = AuthManager.getUsers();
    const user = users.find(u => u.id === userId);
    
    if (!user) {
        alert('User not found');
        return;
    }
    
    // Get user's orders
    const orders = DataManager.getOrders().filter(o => o.email === user.email);
    const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);
    
    let details = `=== USER DETAILS ===\n\n`;
    details += `Name: ${user.name}\n`;
    details += `Email: ${user.email}\n`;
    details += `Phone: ${user.phone || 'Not provided'}\n`;
    details += `Address: ${user.address || 'Not provided'}\n`;
    details += `Registered: ${user.registeredDate}\n`;
    details += `Status: ${user.isLoggedIn ? 'Online' : 'Offline'}\n\n`;
    details += `=== ORDER HISTORY ===\n`;
    details += `Total Orders: ${orders.length}\n`;
    details += `Total Spent: ₹${totalSpent}\n\n`;
    
    if (orders.length > 0) {
        details += `Recent Orders:\n`;
        orders.slice(0, 5).forEach(order => {
            details += `- ${order.id}: ₹${order.total} (${order.status})\n`;
        });
    }
    
    alert(details);
}

// Contact User
function contactUser(email) {
    window.location.href = `mailto:${email}`;
}

// Delete User
function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        return;
    }
    
    const users = AuthManager.getUsers();
    const updatedUsers = users.filter(u => u.id !== userId);
    localStorage.setItem('bakery_users', JSON.stringify(updatedUsers));
    
    alert('User deleted successfully!');
    loadRegisteredUsers();
}


// Update Dashboard Stats with Real Data
function updateDashboardStats() {
    // Get real data from localStorage
    const realOrders = JSON.parse(localStorage.getItem('bakery_orders') || '[]');
    const orders = realOrders.length > 0 ? realOrders : [];
    const users = AuthManager.getUsers();
    const products = JSON.parse(localStorage.getItem('bakery_products') || '[]');
    
    // Calculate today's stats
    const today = new Date().toLocaleDateString('en-IN');
    const todayOrders = orders.filter(o => o.date === today);
    const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    
    // Calculate yesterday's stats for comparison
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDate = yesterday.toLocaleDateString('en-IN');
    const yesterdayOrders = orders.filter(o => o.date === yesterdayDate);
    const yesterdayRevenue = yesterdayOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    
    // Calculate total stats
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    
    // Calculate total items sold
    const totalItemsSold = orders.reduce((sum, o) => {
        if (o.items && Array.isArray(o.items)) {
            return sum + o.items.reduce((itemSum, item) => itemSum + (item.quantity || 0), 0);
        }
        return sum;
    }, 0);
    
    // Calculate percentage changes
    const revenueChange = yesterdayRevenue > 0 
        ? (((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100).toFixed(1)
        : todayRevenue > 0 ? 100 : 0;
    
    const ordersChangePercent = yesterdayOrders.length > 0
        ? (((todayOrders.length - yesterdayOrders.length) / yesterdayOrders.length) * 100).toFixed(1)
        : todayOrders.length > 0 ? 100 : 0;
    
    // Update Today's Revenue
    const revenueEl = document.getElementById('todayRevenue');
    if (revenueEl) {
        revenueEl.textContent = '₹' + todayRevenue.toLocaleString('en-IN');
    }
    
    const revenueChangeEl = document.getElementById('revenueChange');
    if (revenueChangeEl) {
        const isPositive = revenueChange >= 0;
        revenueChangeEl.textContent = (isPositive ? '+' : '') + revenueChange + '%';
        revenueChangeEl.className = 'stat-change ' + (isPositive ? 'positive' : 'negative');
    }
    
    // Update Total Orders
    const ordersEl = document.getElementById('totalOrders');
    if (ordersEl) {
        ordersEl.textContent = totalOrders;
    }
    
    const ordersChangeEl = document.getElementById('ordersChange');
    if (ordersChangeEl) {
        const isPositive = ordersChangePercent >= 0;
        ordersChangeEl.textContent = (isPositive ? '+' : '') + ordersChangePercent + '%';
        ordersChangeEl.className = 'stat-change ' + (isPositive ? 'positive' : 'negative');
    }
    
    // Update Registered Users
    const usersCountEl = document.getElementById('registeredUsersCount');
    if (usersCountEl) {
        usersCountEl.textContent = users.length;
    }
    
    const usersChangeEl = document.getElementById('usersChange');
    if (usersChangeEl) {
        // Calculate user growth (simplified - just show if there are new users today)
        const todayUsers = users.filter(u => u.registeredDate === today);
        const userGrowth = users.length > 0 ? ((todayUsers.length / users.length) * 100).toFixed(1) : 0;
        usersChangeEl.textContent = '+' + userGrowth + '%';
        usersChangeEl.className = 'stat-change positive';
    }
    
    // Update Total Products
    const productsEl = document.getElementById('totalProducts');
    if (productsEl) {
        productsEl.textContent = products.length;
    }
    
    const productsChangeEl = document.getElementById('productsChange');
    if (productsChangeEl) {
        // Show total items sold instead of percentage
        productsChangeEl.textContent = totalItemsSold + ' sold';
        productsChangeEl.className = 'stat-change positive';
    }
    
    console.log('Dashboard updated:', {
        totalUsers: users.length,
        totalOrders: totalOrders,
        todayOrders: todayOrders.length,
        todayRevenue: todayRevenue,
        totalRevenue: totalRevenue,
        totalProducts: products.length,
        totalItemsSold: totalItemsSold
    });
}


// Filter Reviews by Status
function filterReviews(status) {
    const container = document.getElementById('reviewsContainer');
    if (!container) return;

    const reviews = JSON.parse(localStorage.getItem('bakery_reviews') || '[]');
    
    // Filter reviews based on status
    const filteredReviews = status === 'all' 
        ? reviews 
        : reviews.filter(r => r.status.toLowerCase() === status.toLowerCase());

    if (filteredReviews.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fa-solid fa-star fa-3x mb-3" style="opacity: 0.3; color: #999;"></i>
                <p class="text-muted">No ${status} reviews</p>
            </div>
        `;
        return;
    }

    // Sort by timestamp (newest first)
    filteredReviews.sort((a, b) => b.timestamp - a.timestamp);

    container.innerHTML = filteredReviews.map(review => {
        const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
        let badgeClass = 'badge-warning';
        if (review.status === 'Approved') badgeClass = 'badge-success';
        if (review.status === 'Rejected') badgeClass = 'badge-danger';

        return `
            <div class="col-lg-6">
                <div class="card">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <div>
                                <h5 style="margin-bottom: 0.5rem;">${review.customerName}</h5>
                                <small style="color: #999;">${review.email}</small>
                                <div style="color: #F5A623; font-size: 1.2rem; margin-top: 0.5rem;">${stars}</div>
                            </div>
                            <span class="badge ${badgeClass}">${review.status}</span>
                        </div>
                        <p style="color: #666; line-height: 1.6;">${review.comment}</p>
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <small style="color: #999;">${review.date}</small>
                            <div>
                                ${review.status === 'Pending' ? `
                                    <button class="btn-action" style="color: #28a745;" onclick="approveReview(${review.id})">
                                        <i class="fa-solid fa-check"></i> Approve
                                    </button>
                                    <button class="btn-action" style="color: #dc3545;" onclick="rejectReview(${review.id})">
                                        <i class="fa-solid fa-times"></i> Reject
                                    </button>
                                ` : ''}
                                <button class="btn-action" onclick="deleteReview(${review.id})">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Add event listeners for review filter buttons
document.addEventListener('DOMContentLoaded', function() {
    const reviewFilterButtons = document.querySelectorAll('#reviews .btn-filter');
    reviewFilterButtons.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            reviewFilterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filters = ['all', 'pending', 'approved'];
            filterReviews(filters[index]);
        });
    });
});


// Load existing settings when admin panel loads
function loadExistingSettings() {
    // Load store info
    const storeInfo = JSON.parse(localStorage.getItem('bakery_store_info') || 'null');
    if (storeInfo) {
        const form = document.getElementById('storeInfoForm');
        if (form) {
            form.querySelector('input[type="text"]').value = storeInfo.name || 'Sweet Treats';
            form.querySelector('input[type="email"]').value = storeInfo.email || 'hello@sweettreats.com';
            form.querySelector('input[type="tel"]').value = storeInfo.phone || '+1 (555) 123-4567';
            form.querySelector('textarea').value = storeInfo.address || '123 Baker Street, Sweet City';
        }
    }
    
    // Load business hours
    const businessHours = JSON.parse(localStorage.getItem('bakery_business_hours') || 'null');
    if (businessHours) {
        const form = document.getElementById('businessHoursForm');
        if (form) {
            form.querySelector('input[type="time"]:first-of-type').value = businessHours.openingTime || '07:00';
            form.querySelector('input[type="time"]:last-of-type').value = businessHours.closingTime || '21:00';
            
            if (businessHours.workingDays) {
                const checkboxes = form.querySelectorAll('input[type="checkbox"]');
                businessHours.workingDays.forEach((day, index) => {
                    if (checkboxes[index]) {
                        checkboxes[index].checked = day.open;
                    }
                });
            }
        }
    }
}

// Call loadExistingSettings when page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(loadExistingSettings, 500);
});