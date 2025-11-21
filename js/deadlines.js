// ===== Deadlines JavaScript =====

document.addEventListener('DOMContentLoaded', function() {
    // Add deadline button
    const addDeadlineBtn = document.getElementById('addDeadlineBtn');
    const addDeadlineModal = document.getElementById('addDeadlineModal');
    const closeDeadlineModal = document.getElementById('closeDeadlineModal');
    const cancelDeadline = document.getElementById('cancelDeadline');
    const addDeadlineForm = document.getElementById('addDeadlineForm');

    // Open add deadline modal
    if (addDeadlineBtn && addDeadlineModal) {
        addDeadlineBtn.addEventListener('click', function() {
            addDeadlineModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Set minimum date to today
            const dateInput = document.getElementById('deadlineDate');
            if (dateInput) {
                const today = new Date().toISOString().split('T')[0];
                dateInput.setAttribute('min', today);
            }
        });
    }

    // Close add deadline modal
    if (closeDeadlineModal) {
        closeDeadlineModal.addEventListener('click', function() {
            addDeadlineModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    if (cancelDeadline) {
        cancelDeadline.addEventListener('click', function() {
            addDeadlineModal.classList.remove('active');
            document.body.style.overflow = '';
            addDeadlineForm.reset();
        });
    }

    // Add deadline form submission
    if (addDeadlineForm) {
        addDeadlineForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const title = document.getElementById('deadlineTitle').value;
            const description = document.getElementById('deadlineDescription').value;
            const date = document.getElementById('deadlineDate').value;
            const time = document.getElementById('deadlineTime').value;
            const subject = document.getElementById('deadlineSubject').value;
            const priority = document.getElementById('deadlinePriority').value;
            const reminder = document.getElementById('reminderTime').value;

            if (!title || !date) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }

            // Calculate days left
            const deadlineDate = new Date(date + (time ? 'T' + time : ''));
            const today = new Date();
            const daysLeft = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));

            // Add deadline to list
            addDeadlineToGrid({
                title,
                description,
                date: deadlineDate,
                subject,
                priority,
                reminder,
                daysLeft,
                completed: false
            });

            showNotification('Deadline added successfully!', 'success');
            addDeadlineForm.reset();
            addDeadlineModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // View toggle
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            viewButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const view = this.getAttribute('data-view');
            // Calendar view would be implemented here
            if (view === 'list') {
                showNotification('List view active', 'info');
            }
        });
    });

    // Deadline actions
    const deadlinesContainer = document.getElementById('deadlinesContainer');
    if (deadlinesContainer) {
        deadlinesContainer.addEventListener('click', function(e) {
            const actionBtn = e.target.closest('.action-btn');
            if (!actionBtn) return;

            const deadlineCard = actionBtn.closest('.deadline-card');
            const deadlineTitle = deadlineCard.querySelector('h3').textContent;
            const action = actionBtn.querySelector('i').classList;

            if (action.contains('fa-edit')) {
                showNotification(`Editing ${deadlineTitle}...`, 'info');
                // Edit functionality would open modal with pre-filled data
            } else if (action.contains('fa-check')) {
                deadlineCard.classList.add('completed');
                deadlineCard.querySelector('.deadline-badge').textContent = 'Completed';
                deadlineCard.querySelector('.deadline-badge').className = 'deadline-badge completed';
                showNotification(`${deadlineTitle} marked as completed!`, 'success');
            } else if (action.contains('fa-trash')) {
                if (confirm(`Are you sure you want to delete ${deadlineTitle}?`)) {
                    deadlineCard.style.animation = 'fadeOut 0.3s ease';
                    setTimeout(() => {
                        deadlineCard.remove();
                        showNotification('Deadline deleted', 'success');
                    }, 300);
                }
            }
        });
    }

    // Search deadlines
    const deadlineSearch = document.getElementById('deadlineSearch');
    if (deadlineSearch) {
        deadlineSearch.addEventListener('input', debounce(function() {
            const searchTerm = this.value.toLowerCase();
            const deadlineCards = document.querySelectorAll('.deadline-card');
            
            deadlineCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const description = card.querySelector('.deadline-description')?.textContent.toLowerCase() || '';
                
                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        }, 300));
    }

    // Check for upcoming deadlines and show notifications
    checkUpcomingDeadlines();
});

// Add deadline to grid
function addDeadlineToGrid(deadline) {
    const deadlinesContainer = document.getElementById('deadlinesContainer');
    if (!deadlinesContainer) return;

    // Determine which section to add to
    let section;
    if (deadline.daysLeft <= 2 && deadline.priority === 'urgent') {
        section = deadlinesContainer.querySelector('.deadline-section:first-of-type .deadlines-list');
    } else if (deadline.daysLeft > 2) {
        section = deadlinesContainer.querySelectorAll('.deadline-section')[1]?.querySelector('.deadlines-list');
    }

    if (!section) {
        // Add to upcoming section
        section = deadlinesContainer.querySelectorAll('.deadline-section')[1]?.querySelector('.deadlines-list');
    }

    if (!section) return;

    const deadlineCard = document.createElement('div');
    deadlineCard.className = `deadline-card ${deadline.priority === 'urgent' ? 'urgent' : ''} fade-in-up`;
    deadlineCard.innerHTML = `
        <div class="deadline-priority ${deadline.priority === 'urgent' ? 'urgent-badge' : ''}"></div>
        <div class="deadline-content">
            <div class="deadline-header">
                <h3>${deadline.title}</h3>
                <span class="deadline-badge ${deadline.priority === 'urgent' ? 'urgent' : 'upcoming'}">${deadline.priority === 'urgent' ? 'Urgent' : 'Upcoming'}</span>
            </div>
            <p class="deadline-description">${deadline.description || 'No description'}</p>
            <div class="deadline-meta">
                <span><i class="fas fa-calendar"></i> Due: ${formatDate(deadline.date)}</span>
                <span><i class="fas fa-clock"></i> ${deadline.daysLeft} ${deadline.daysLeft === 1 ? 'day' : 'days'} left</span>
                ${deadline.subject ? `<span><i class="fas fa-tag"></i> ${getSubjectName(deadline.subject)}</span>` : ''}
            </div>
        </div>
        <div class="deadline-actions">
            <button class="action-btn" title="Edit">
                <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn" title="Complete">
                <i class="fas fa-check"></i>
            </button>
            <button class="action-btn" title="Delete">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    section.insertBefore(deadlineCard, section.firstChild);
}

// Check upcoming deadlines
function checkUpcomingDeadlines() {
    const deadlineCards = document.querySelectorAll('.deadline-card:not(.completed)');
    deadlineCards.forEach(card => {
        const daysLeftText = card.querySelector('.deadline-meta span:nth-child(2)')?.textContent;
        if (daysLeftText) {
            const daysLeft = parseInt(daysLeftText);
            if (daysLeft <= 2) {
                card.classList.add('urgent');
                const badge = card.querySelector('.deadline-badge');
                if (badge && !badge.classList.contains('completed')) {
                    badge.textContent = 'Urgent';
                    badge.className = 'deadline-badge urgent';
                }
            }
        }
    });
}

// Get subject name
function getSubjectName(subject) {
    const subjects = {
        'math': 'Mathematics',
        'physics': 'Physics',
        'chemistry': 'Chemistry',
        'cs': 'Computer Science',
        'english': 'English'
    };
    return subjects[subject] || subject;
}

