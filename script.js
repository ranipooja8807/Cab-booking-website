let API_URL = 'http://localhost:3001/api';
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Initialize auth state
if (currentUser) {
    updateAuthUI();
}

// Mobile Navigation Toggle
const menuBar = document.querySelector('#menu-bars');
const navbar = document.querySelector('.navbar');

menuBar.addEventListener('click', () => {
    menuBar.classList.toggle('fa-times');
    navbar.classList.toggle('active');
});

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.navbar a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuBar.classList.remove('fa-times');
        navbar.classList.remove('active');
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form submission handling
const bookingForm = document.querySelector('#booking-form');
if (bookingForm) {
    bookingForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = document.querySelector('#name').value;
        const phone = document.querySelector('#phone').value;
        const date = document.querySelector('#date').value;
        const time = document.querySelector('#time').value;
        const pickup = document.querySelector('#pickup').value;
        const drop = document.querySelector('#drop').value;
        
        if (!name || !phone || !date || !time || !pickup || !drop) {
            alert('Please fill in all fields');
            return;
        }
        
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
            alert('Please enter a valid 10-digit phone number');
            return;
        }
        
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            alert('Please select a future date');
            return;
        }
        
        try {
            const response = await fetch(`${API_URL}/bookings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, phone, date, time, pickup, drop })
            });
            
            const data = await response.json();
            
            if (data.success) {
                alert(`Booking confirmed!\nBooking ID: ${data.booking.id}\n\nWe will contact you shortly!`);
                this.reset();
            } else {
                alert('Booking failed. Please try again.');
            }
        } catch (error) {
            alert(`Booking submitted! (Demo mode)\n\nDetails:\nName: ${name}\nPhone: ${phone}\nPickup: ${pickup}\nDrop: ${drop}`);
            this.reset();
        }
    });
}

// Request buttons functionality
const requestButtons = document.querySelectorAll('.request-btn');
requestButtons.forEach(button => {
    button.addEventListener('click', function() {
        const rideType = this.closest('.tariff-container').querySelector('h3').textContent.toLowerCase();
        alert(`Request submitted for ${rideType}!\nWe will contact you shortly to confirm your booking.`);
    });
});

// Apply driver button
const applyBtn = document.querySelector('.apply-btn');
if (applyBtn) {
    applyBtn.addEventListener('click', async function() {
        const name = prompt('Enter your full name:');
        if (!name) return;
        
        const phone = prompt('Enter your phone number:');
        if (!phone) return;
        
        const email = prompt('Enter your email:');
        if (!email) return;
        
        try {
            const response = await fetch(`${API_URL}/drivers/apply`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, phone, email, experience: 0 })
            });
            
            const data = await response.json();
            alert('Application submitted successfully!\nWe will review and contact you soon.');
        } catch (error) {
            alert('Application submitted! (Demo mode)\nWe will contact you soon.');
        }
    });
}

// Offer buttons
const offerButtons = document.querySelectorAll('.offer-btn');
offerButtons.forEach(button => {
    button.addEventListener('click', async function() {
        const offerText = this.closest('.offer-card').querySelector('h3').textContent;
        
        try {
            const response = await fetch(`${API_URL}/offers/claim`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: 'user123', offerCode: offerText })
            });
            
            const data = await response.json();
            alert('Offer claimed successfully!\nCheck your account for details.');
        } catch (error) {
            alert('Offer claimed! (Demo mode)\nYou can use this offer on your next ride.');
        }
    });
});

// Add loading animation to buttons
function addLoadingState(button) {
    const originalText = button.textContent;
    button.textContent = 'Loading...';
    button.disabled = true;
    
    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
    }, 2000);
}

// Apply loading state to form submit
const submitButton = document.querySelector('.search-cabs button');
if (submitButton) {
    submitButton.addEventListener('click', function() {
        if (bookingForm.checkValidity()) {
            addLoadingState(this);
        }
    });
}

// Apply loading state to request buttons
requestButtons.forEach(button => {
    button.addEventListener('click', function() {
        addLoadingState(this);
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.booking-content, .tariff-container, .faqs, .drive-card, .offer-card, .gallery-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && !menuBar.contains(e.target)) {
        menuBar.classList.remove('fa-times');
        navbar.classList.remove('active');
    }
});

// Prevent form submission on Enter key in input fields
document.querySelectorAll('.form-fields input').forEach(input => {
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const nextInput = this.parentElement.querySelector(`input[tabindex="${parseInt(this.tabIndex || 0) + 1}"]`) || 
                             this.parentElement.nextElementSibling?.querySelector('input') ||
                             document.querySelector('.search-cabs button');
            if (nextInput) {
                nextInput.focus();
            }
        }
    });
});

// FAQ accordion functionality
document.querySelectorAll('.faqs').forEach(faq => {
    faq.addEventListener('click', function() {
        this.classList.toggle('active');
    });
});

// Auth UI Management
function updateAuthUI() {
    const authButtons = document.querySelector('.auth-buttons');
    const userMenu = document.getElementById('user-menu');
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const userName = document.getElementById('user-name');
    
    if (currentUser) {
        loginBtn.style.display = 'none';
        signupBtn.style.display = 'none';
        userMenu.style.display = 'flex';
        userName.textContent = currentUser.name;
    } else {
        loginBtn.style.display = 'block';
        signupBtn.style.display = 'block';
        userMenu.style.display = 'none';
    }
}

// Modal Management
const loginModal = document.getElementById('login-modal');
const signupModal = document.getElementById('signup-modal');
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const logoutBtn = document.getElementById('logout-btn');
const closeBtns = document.querySelectorAll('.close');

loginBtn?.addEventListener('click', () => loginModal.style.display = 'block');
signupBtn?.addEventListener('click', () => signupModal.style.display = 'block');

closeBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        this.closest('.modal').style.display = 'none';
    });
});

window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

document.getElementById('show-signup')?.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.style.display = 'none';
    signupModal.style.display = 'block';
});

document.getElementById('show-login')?.addEventListener('click', (e) => {
    e.preventDefault();
    signupModal.style.display = 'none';
    loginModal.style.display = 'block';
});

// Login Form
document.getElementById('login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
        const response = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            currentUser = data.user;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            updateAuthUI();
            loginModal.style.display = 'none';
            alert(`Welcome back, ${currentUser.name}!`);
        } else {
            alert(data.error || 'Login failed');
        }
    } catch (error) {
        alert('Login failed. Server not available.');
    }
});

// Signup Form
document.getElementById('signup-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const phone = document.getElementById('signup-phone').value;
    const password = document.getElementById('signup-password').value;
    
    try {
        const response = await fetch(`${API_URL}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phone, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('Registration successful! Please login.');
            signupModal.style.display = 'none';
            loginModal.style.display = 'block';
        } else {
            alert(data.error || 'Registration failed');
        }
    } catch (error) {
        alert('Registration failed. Server not available.');
    }
});

// Logout
logoutBtn?.addEventListener('click', () => {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateAuthUI();
    alert('Logged out successfully!');
});

// Check server health on load
window.addEventListener('load', async () => {
    for (let port = 3001; port <= 3005; port++) {
        try {
            const response = await fetch(`http://localhost:${port}/api/health`);
            if (response.ok) {
                API_URL = `http://localhost:${port}/api`;
                console.log(`✓ Server connected on port ${port}`);
                return;
            }
        } catch (error) {
            continue;
        }
    }
    console.log('Demo mode: Server not running. Using local functionality.');
});
