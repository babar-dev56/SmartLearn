// ===== Authentication JavaScript =====

document.addEventListener('DOMContentLoaded', function() {
    // Toggle password visibility
    const togglePassword = document.getElementById('togglePassword');
    const toggleRegPassword = document.getElementById('toggleRegPassword');
    const passwordInput = document.getElementById('password');
    const regPasswordInput = document.getElementById('regPassword');

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.querySelector('i').classList.toggle('fa-eye');
            this.querySelector('i').classList.toggle('fa-eye-slash');
        });
    }

    if (toggleRegPassword && regPasswordInput) {
        toggleRegPassword.addEventListener('click', function() {
            const type = regPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            regPasswordInput.setAttribute('type', type);
            this.querySelector('i').classList.toggle('fa-eye');
            this.querySelector('i').classList.toggle('fa-eye-slash');
        });
    }

    // Password strength checker
    const regPassword = document.getElementById('regPassword');
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');

    if (regPassword && strengthFill && strengthText) {
        regPassword.addEventListener('input', function() {
            const password = this.value;
            const strength = checkPasswordStrength(password);
            
            strengthFill.style.width = strength.percentage + '%';
            strengthFill.style.background = strength.color;
            strengthText.textContent = strength.text;
            strengthText.style.color = strength.color;
        });
    }

    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const remember = document.getElementById('remember')?.checked;

            // Simulate login (in real app, this would be an API call)
            if (email && password) {
                // Store user session
                storage.set('user', { email, remember });
                storage.set('isLoggedIn', true);
                
                showNotification('Login successful!', 'success');
                
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            } else {
                showNotification('Please fill in all fields', 'error');
            }
        });
    }

    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('regEmail').value;
            const password = document.getElementById('regPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const studentId = document.getElementById('studentId').value;
            const terms = document.getElementById('terms').checked;

            // Validation
            if (!firstName || !lastName || !email || !password || !confirmPassword) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }

            if (password !== confirmPassword) {
                showNotification('Passwords do not match', 'error');
                return;
            }

            if (password.length < 8) {
                showNotification('Password must be at least 8 characters', 'error');
                return;
            }

            if (!terms) {
                showNotification('Please accept the terms and conditions', 'error');
                return;
            }

            // Simulate registration (in real app, this would be an API call)
            const userData = {
                firstName,
                lastName,
                email,
                studentId,
                createdAt: new Date().toISOString()
            };

            storage.set('user', userData);
            storage.set('isLoggedIn', true);
            
            showNotification('Registration successful!', 'success');
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        });
    }

    // Social login buttons
    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons.forEach(button => {
        button.addEventListener('click', function() {
            const provider = this.classList.contains('google') ? 'Google' : 'GitHub';
            showNotification(`${provider} login coming soon!`, 'info');
        });
    });
});

// Password strength checker
function checkPasswordStrength(password) {
    let strength = 0;
    let feedback = [];

    if (password.length >= 8) strength++;
    else feedback.push('at least 8 characters');

    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    else feedback.push('uppercase and lowercase letters');

    if (password.match(/\d/)) strength++;
    else feedback.push('numbers');

    if (password.match(/[^a-zA-Z\d]/)) strength++;
    else feedback.push('special characters');

    const levels = [
        { percentage: 25, color: '#ef4444', text: 'Weak' },
        { percentage: 50, color: '#f59e0b', text: 'Fair' },
        { percentage: 75, color: '#3b82f6', text: 'Good' },
        { percentage: 100, color: '#10b981', text: 'Strong' }
    ];

    return levels[strength] || levels[0];
}

// Check if user is logged in
function checkAuth() {
    const isLoggedIn = storage.get('isLoggedIn');
    const currentPath = window.location.pathname;
    const authPages = ['login.html', 'register.html', 'index.html'];
    const isAuthPage = authPages.some(page => currentPath.includes(page));

    if (!isLoggedIn && !isAuthPage) {
        window.location.href = 'login.html';
    } else if (isLoggedIn && isAuthPage && !currentPath.includes('index.html')) {
        window.location.href = 'dashboard.html';
    }
}

// Run auth check on pages that need it
if (window.location.pathname.includes('dashboard.html') || 
    window.location.pathname.includes('notes.html') ||
    window.location.pathname.includes('discussion.html') ||
    window.location.pathname.includes('ai-helper.html') ||
    window.location.pathname.includes('deadlines.html') ||
    window.location.pathname.includes('profile.html')) {
    checkAuth();
}

