// Authentication Manager
const AuthManager = {
    // Get all users from localStorage
    getUsers() {
        try {
            const users = localStorage.getItem('bakery_users');
            return users ? JSON.parse(users) : [];
        } catch (e) {
            console.error('Error loading users:', e);
            return [];
        }
    },

    // Save users to localStorage
    saveUsers(users) {
        try {
            localStorage.setItem('bakery_users', JSON.stringify(users));
            return true;
        } catch (e) {
            console.error('Error saving users:', e);
            return false;
        }
    },

    // Get current logged-in user
    getCurrentUser() {
        try {
            const user = localStorage.getItem('bakery_current_user');
            return user ? JSON.parse(user) : null;
        } catch (e) {
            console.error('Error loading current user:', e);
            return null;
        }
    },

    // Check if user is logged in
    isLoggedIn() {
        return this.getCurrentUser() !== null;
    },

    // Validation functions
    validateName(name) {
        if (!name || name.trim().length < 2) {
            return { valid: false, message: 'Name must be at least 2 characters long' };
        }
        if (/\d/.test(name)) {
            return { valid: false, message: 'Name must not contain numbers' };
        }
        if (!/^[a-zA-Z\s]+$/.test(name)) {
            return { valid: false, message: 'Name must contain only letters and spaces' };
        }
        return { valid: true };
    },

    validateEmail(email) {
        if (!email || !email.includes('@')) {
            return { valid: false, message: 'Please enter a valid email address' };
        }
        if (!email.endsWith('@gmail.com')) {
            return { valid: false, message: 'Email must be a Gmail address (@gmail.com)' };
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        if (!emailRegex.test(email)) {
            return { valid: false, message: 'Please enter a valid Gmail address' };
        }
        return { valid: true };
    },

    validatePhone(phone) {
        if (!phone) {
            return { valid: false, message: 'Phone number is required' };
        }
        // Remove any spaces, dashes, or other characters
        const cleanPhone = phone.replace(/\D/g, '');
        if (cleanPhone.length !== 10) {
            return { valid: false, message: 'Phone number must be exactly 10 digits' };
        }
        if (!/^\d{10}$/.test(cleanPhone)) {
            return { valid: false, message: 'Phone number must contain only digits' };
        }
        return { valid: true, cleanPhone };
    },

    validatePassword(password) {
        if (!password || password.length < 6) {
            return { valid: false, message: 'Password must be at least 6 characters long' };
        }
        return { valid: true };
    },

    // Register new user
    register(userData) {
        const users = this.getUsers();
        
        // Validate name
        const nameValidation = this.validateName(userData.name);
        if (!nameValidation.valid) {
            return { success: false, message: nameValidation.message };
        }

        // Validate email
        const emailValidation = this.validateEmail(userData.email);
        if (!emailValidation.valid) {
            return { success: false, message: emailValidation.message };
        }

        // Validate phone
        const phoneValidation = this.validatePhone(userData.phone);
        if (!phoneValidation.valid) {
            return { success: false, message: phoneValidation.message };
        }

        // Validate password
        const passwordValidation = this.validatePassword(userData.password);
        if (!passwordValidation.valid) {
            return { success: false, message: passwordValidation.message };
        }

        // Check if email already exists
        if (users.find(u => u.email === userData.email)) {
            return { success: false, message: 'Email already registered' };
        }

        // Create new user
        const newUser = {
            id: Date.now(),
            name: userData.name.trim(),
            email: userData.email.toLowerCase().trim(),
            password: userData.password, // In production, this should be hashed
            phone: phoneValidation.cleanPhone,
            address: userData.address || '',
            registeredDate: new Date().toLocaleDateString('en-IN'),
            isLoggedIn: false
        };

        users.push(newUser);
        this.saveUsers(users);

        return { success: true, message: 'Registration successful!', user: newUser };
    },

    // Login user
    login(email, password) {
        // Validate email format
        const emailValidation = this.validateEmail(email);
        if (!emailValidation.valid) {
            return { success: false, message: emailValidation.message };
        }

        // Validate password
        if (!password || password.trim().length === 0) {
            return { success: false, message: 'Password is required' };
        }

        const users = this.getUsers();
        const user = users.find(u => u.email === email.toLowerCase().trim() && u.password === password);

        if (!user) {
            return { success: false, message: 'Invalid email or password' };
        }

        // Update user login status
        user.isLoggedIn = true;
        this.saveUsers(users);

        // Set current user
        const userSession = { ...user };
        delete userSession.password; // Don't store password in session
        localStorage.setItem('bakery_current_user', JSON.stringify(userSession));

        return { success: true, message: 'Login successful!', user: userSession };
    },

    // Logout user
    logout() {
        const currentUser = this.getCurrentUser();
        if (currentUser) {
            const users = this.getUsers();
            const user = users.find(u => u.id === currentUser.id);
            if (user) {
                user.isLoggedIn = false;
                this.saveUsers(users);
            }
        }

        localStorage.removeItem('bakery_current_user');
        return { success: true, message: 'Logged out successfully' };
    },

    // Update user profile
    updateProfile(userId, updates) {
        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex === -1) {
            return { success: false, message: 'User not found' };
        }

        // Update user data
        users[userIndex] = { ...users[userIndex], ...updates };
        this.saveUsers(users);

        // Update current user session if it's the same user
        const currentUser = this.getCurrentUser();
        if (currentUser && currentUser.id === userId) {
            const updatedUser = { ...users[userIndex] };
            delete updatedUser.password;
            localStorage.setItem('bakery_current_user', JSON.stringify(updatedUser));
        }

        return { success: true, message: 'Profile updated successfully', user: users[userIndex] };
    }
};

// UI Functions for Auth Modal
function showAuthModal(mode = 'login') {
    const modal = document.getElementById('authModal');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const modalTitle = document.getElementById('authModalTitle');

    if (!modal || !loginForm || !registerForm || !modalTitle) {
        console.error('Auth modal elements not found');
        return;
    }

    if (mode === 'login') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        modalTitle.textContent = 'Login to Your Account';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        modalTitle.textContent = 'Create New Account';
    }

    // Get or create modal instance
    let authModal = bootstrap.Modal.getInstance(modal);
    if (!authModal) {
        authModal = new bootstrap.Modal(modal);
    }
    authModal.show();
}

function switchAuthMode(mode) {
    showAuthModal(mode);
}

function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    // Client-side validation
    if (!email) {
        showToast('Please enter your email address');
        return;
    }

    if (!password) {
        showToast('Please enter your password');
        return;
    }

    const result = AuthManager.login(email, password);

    if (result.success) {
        showToast(result.message);
        updateUserNav();
        
        // Close modal
        const modal = document.getElementById('authModal');
        const modalInstance = bootstrap.Modal.getInstance(modal);
        if (modalInstance) {
            modalInstance.hide();
        }
        
        // Reset form
        event.target.reset();
    } else {
        showToast(result.message);
    }
}

function handleRegister(event) {
    event.preventDefault();
    
    console.log('Registration form submitted');
    
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const phone = document.getElementById('registerPhone').value.trim();
    const address = document.getElementById('registerAddress').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;

    console.log('Form data:', { name, email, phone, address: address.substring(0, 20) + '...' });

    // Client-side validation
    const nameValidation = AuthManager.validateName(name);
    if (!nameValidation.valid) {
        console.log('Name validation failed:', nameValidation.message);
        alert(nameValidation.message);
        return;
    }

    const emailValidation = AuthManager.validateEmail(email);
    if (!emailValidation.valid) {
        console.log('Email validation failed:', emailValidation.message);
        alert(emailValidation.message);
        return;
    }

    const phoneValidation = AuthManager.validatePhone(phone);
    if (!phoneValidation.valid) {
        console.log('Phone validation failed:', phoneValidation.message);
        alert(phoneValidation.message);
        return;
    }

    const passwordValidation = AuthManager.validatePassword(password);
    if (!passwordValidation.valid) {
        console.log('Password validation failed:', passwordValidation.message);
        alert(passwordValidation.message);
        return;
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
        console.log('Passwords do not match');
        alert('Passwords do not match');
        return;
    }

    if (!address || address.length < 10) {
        console.log('Address too short');
        alert('Please enter a complete address (at least 10 characters)');
        return;
    }

    const userData = {
        name: name,
        email: email,
        password: password,
        phone: phone,
        address: address
    };

    console.log('Attempting registration...');
    const result = AuthManager.register(userData);
    console.log('Registration result:', result);

    if (result.success) {
        // Automatically log the user in after registration
        console.log('Registration successful, attempting auto-login...');
        const loginResult = AuthManager.login(userData.email, userData.password);
        console.log('Auto-login result:', loginResult);
        
        if (loginResult.success) {
            alert('Registration successful! Welcome, ' + userData.name + '!');
            updateUserNav();
            
            // Close modal
            const modal = document.getElementById('authModal');
            const modalInstance = bootstrap.Modal.getInstance(modal);
            if (modalInstance) {
                modalInstance.hide();
            }
            
            // Reset form
            event.target.reset();
        } else {
            // If auto-login fails, show login form
            alert(result.message + ' Please login to continue.');
            setTimeout(() => {
                showAuthModal('login');
            }, 1500);
            event.target.reset();
        }
    } else {
        console.log('Registration failed:', result.message);
        alert(result.message);
    }
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        AuthManager.logout();
        showToast('Logged out successfully');
        updateUserNav();
        
        // Clear cart
        cart = [];
        
        // Clear cart from localStorage
        localStorage.removeItem('bakery_cart');
        localStorage.removeItem('bakery_coupon');
        
        updateCartCount();
    }
}

function updateUserNav() {
    const userNav = document.getElementById('userNav');
    const guestNav = document.getElementById('guestNav');
    const userNameDisplay = document.getElementById('userNameDisplay');

    const currentUser = AuthManager.getCurrentUser();

    if (currentUser) {
        // User is logged in
        if (userNav) userNav.style.display = 'block';
        if (guestNav) guestNav.style.display = 'none';
        if (userNameDisplay) userNameDisplay.textContent = currentUser.name;
    } else {
        // User is not logged in
        if (userNav) userNav.style.display = 'none';
        if (guestNav) guestNav.style.display = 'block';
    }
}

// Initialize auth state on page load
document.addEventListener('DOMContentLoaded', function() {
    updateUserNav();
});
