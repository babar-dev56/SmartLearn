// ===== Profile JavaScript =====

document.addEventListener('DOMContentLoaded', function() {
    // Edit info button
    const editInfoBtn = document.getElementById('editInfoBtn');
    const infoForm = document.getElementById('infoForm');
    let isEditing = false;

    if (editInfoBtn && infoForm) {
        editInfoBtn.addEventListener('click', function() {
            const inputs = infoForm.querySelectorAll('input, textarea');
            
            if (!isEditing) {
                // Enable editing
                inputs.forEach(input => {
                    input.removeAttribute('readonly');
                    input.style.background = 'white';
                    input.style.border = '2px solid #e2e8f0';
                });
                this.textContent = 'Save';
                this.classList.add('btn-success');
                isEditing = true;
            } else {
                // Save changes
                const formData = new FormData(infoForm);
                const data = {};
                formData.forEach((value, key) => {
                    data[key] = value;
                });
                
                // Save to storage (in real app, this would be an API call)
                storage.set('user', { ...storage.get('user'), ...data });
                
                // Disable editing
                inputs.forEach(input => {
                    input.setAttribute('readonly', 'readonly');
                    input.style.background = '#f8fafc';
                    input.style.border = 'none';
                });
                this.textContent = 'Edit';
                this.classList.remove('btn-success');
                isEditing = false;
                
                showNotification('Profile updated successfully!', 'success');
            }
        });
    }

    // Cover image upload
    const coverEditBtn = document.querySelector('.cover-edit-btn');
    if (coverEditBtn) {
        coverEditBtn.addEventListener('click', function() {
            showNotification('Cover image upload coming soon!', 'info');
        });
    }

    // Avatar upload
    const avatarEditBtn = document.querySelector('.avatar-edit-btn');
    if (avatarEditBtn) {
        avatarEditBtn.addEventListener('click', function() {
            showNotification('Avatar upload coming soon!', 'info');
        });
    }

    // Settings form
    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Settings saved successfully!', 'success');
        });
    }

    // Load user data
    loadUserData();
});

// Load user data
function loadUserData() {
    const user = storage.get('user');
    if (!user) return;

    // Update profile info
    const firstNameInput = document.getElementById('infoForm')?.querySelector('input[value*="John"]');
    const lastNameInput = document.getElementById('infoForm')?.querySelector('input[value*="Doe"]');
    const emailInput = document.getElementById('infoForm')?.querySelector('input[type="email"]');
    
    if (user.firstName && firstNameInput) {
        firstNameInput.value = user.firstName;
    }
    if (user.lastName && lastNameInput) {
        lastNameInput.value = user.lastName;
    }
    if (user.email && emailInput) {
        emailInput.value = user.email;
    }

    // Update profile header
    const profileName = document.querySelector('.profile-details h1');
    if (profileName && user.firstName && user.lastName) {
        profileName.textContent = `${user.firstName} ${user.lastName}`;
    }

    const profileEmail = document.querySelector('.profile-email');
    if (profileEmail && user.email) {
        profileEmail.textContent = user.email;
    }
}

