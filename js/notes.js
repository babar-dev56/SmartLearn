// ===== Notes & Books JavaScript =====

document.addEventListener('DOMContentLoaded', function() {
    // Upload button
    const uploadBtn = document.getElementById('uploadBtn');
    const uploadModal = document.getElementById('uploadModal');
    const closeUploadModal = document.getElementById('closeUploadModal');
    const cancelUpload = document.getElementById('cancelUpload');
    const uploadForm = document.getElementById('uploadForm');
    const fileInput = document.getElementById('fileInput');
    const uploadArea = document.getElementById('uploadArea');
    const uploadedFiles = document.getElementById('uploadedFiles');

    // Open upload modal
    if (uploadBtn && uploadModal) {
        uploadBtn.addEventListener('click', function() {
            uploadModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    // Close upload modal
    if (closeUploadModal) {
        closeUploadModal.addEventListener('click', function() {
            uploadModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    if (cancelUpload) {
        cancelUpload.addEventListener('click', function() {
            uploadModal.classList.remove('active');
            document.body.style.overflow = '';
            uploadForm.reset();
            uploadedFiles.innerHTML = '';
        });
    }

    // File input handling
    if (uploadArea && fileInput) {
        uploadArea.addEventListener('click', function() {
            fileInput.click();
        });

        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.borderColor = '#6366f1';
            this.style.background = 'rgba(99, 102, 241, 0.05)';
        });

        uploadArea.addEventListener('dragleave', function() {
            this.style.borderColor = '';
            this.style.background = '';
        });

        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.borderColor = '';
            this.style.background = '';
            const files = e.dataTransfer.files;
            handleFiles(files);
        });

        fileInput.addEventListener('change', function() {
            handleFiles(this.files);
        });
    }

    // Upload form submission
    if (uploadForm) {
        uploadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const title = document.getElementById('fileTitle').value;
            const subject = document.getElementById('fileSubject').value;
            const description = document.getElementById('fileDescription').value;
            const files = fileInput.files;

            if (!title || !subject || files.length === 0) {
                showNotification('Please fill in all required fields and select files', 'error');
                return;
            }

            // Simulate file upload
            showNotification('Files uploaded successfully!', 'success');
            
            // Add to notes grid
            Array.from(files).forEach(file => {
                addNoteToGrid({
                    title: title || file.name,
                    subject: subject,
                    description: description,
                    size: file.size,
                    date: new Date(),
                    type: getFileType(file.name)
                });
            });

            // Reset form
            uploadForm.reset();
            uploadedFiles.innerHTML = '';
            uploadModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Filter functionality
    const subjectFilter = document.getElementById('subjectFilter');
    const typeFilter = document.getElementById('typeFilter');
    const sortFilter = document.getElementById('sortFilter');
    const notesSearch = document.getElementById('notesSearch');

    [subjectFilter, typeFilter, sortFilter, notesSearch].forEach(filter => {
        if (filter) {
            filter.addEventListener('change', applyFilters);
            filter.addEventListener('input', applyFilters);
        }
    });

    // Note actions
    const notesGrid = document.getElementById('notesGrid');
    if (notesGrid) {
        notesGrid.addEventListener('click', function(e) {
            const actionBtn = e.target.closest('.action-btn');
            if (!actionBtn) return;

            const noteCard = actionBtn.closest('.note-card');
            const noteTitle = noteCard.querySelector('h3').textContent;
            const action = actionBtn.querySelector('i').classList;

            if (action.contains('fa-download')) {
                showNotification(`Downloading ${noteTitle}...`, 'info');
                // Simulate download
                setTimeout(() => {
                    showNotification(`${noteTitle} downloaded!`, 'success');
                }, 1000);
            } else if (action.contains('fa-share')) {
                shareContent(noteTitle, 'Check out this note!', window.location.href);
            } else if (action.contains('fa-trash')) {
                if (confirm(`Are you sure you want to delete ${noteTitle}?`)) {
                    noteCard.style.animation = 'fadeOut 0.3s ease';
                    setTimeout(() => {
                        noteCard.remove();
                        showNotification('Note deleted', 'success');
                    }, 300);
                }
            }
        });
    }
});

// Handle file selection
function handleFiles(files) {
    const uploadedFiles = document.getElementById('uploadedFiles');
    if (!uploadedFiles) return;

    uploadedFiles.innerHTML = '';
    Array.from(files).forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.className = 'uploaded-file-item';
        fileItem.style.cssText = 'display: flex; align-items: center; justify-content: space-between; padding: 0.75rem; background: #f8fafc; border-radius: 8px; margin-bottom: 0.5rem;';
        fileItem.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.75rem;">
                <i class="fas fa-file" style="color: #6366f1;"></i>
                <div>
                    <div style="font-weight: 600;">${file.name}</div>
                    <div style="font-size: 0.875rem; color: #64748b;">${formatFileSize(file.size)}</div>
                </div>
            </div>
        `;
        uploadedFiles.appendChild(fileItem);
    });
}

// Get file type from extension
function getFileType(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    const types = {
        'pdf': 'pdf',
        'doc': 'notes',
        'docx': 'notes',
        'txt': 'notes',
        'jpg': 'image',
        'jpeg': 'image',
        'png': 'image',
        'gif': 'image'
    };
    return types[ext] || 'notes';
}

// Get file icon
function getFileIcon(type) {
    const icons = {
        'pdf': 'fa-file-pdf',
        'notes': 'fa-file-alt',
        'book': 'fa-book',
        'image': 'fa-file-image'
    };
    return icons[type] || 'fa-file';
}

// Add note to grid
function addNoteToGrid(note) {
    const notesGrid = document.getElementById('notesGrid');
    if (!notesGrid) return;

    const noteCard = document.createElement('div');
    noteCard.className = 'note-card fade-in-up';
    noteCard.innerHTML = `
        <div class="note-icon">
            <i class="fas ${getFileIcon(note.type)}"></i>
        </div>
        <div class="note-content">
            <h3>${note.title}</h3>
            <p class="note-meta">
                <span><i class="fas fa-tag"></i> ${getSubjectName(note.subject)}</span>
                <span><i class="fas fa-calendar"></i> ${timeAgo(note.date)}</span>
            </p>
            <p class="note-size">${formatFileSize(note.size)}</p>
        </div>
        <div class="note-actions">
            <button class="action-btn" title="Download">
                <i class="fas fa-download"></i>
            </button>
            <button class="action-btn" title="Share">
                <i class="fas fa-share"></i>
            </button>
            <button class="action-btn" title="Delete">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    notesGrid.insertBefore(noteCard, notesGrid.firstChild);
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

// Apply filters
function applyFilters() {
    const subjectFilter = document.getElementById('subjectFilter')?.value || 'all';
    const typeFilter = document.getElementById('typeFilter')?.value || 'all';
    const sortFilter = document.getElementById('sortFilter')?.value || 'recent';
    const searchTerm = document.getElementById('notesSearch')?.value.toLowerCase() || '';

    const noteCards = document.querySelectorAll('.note-card');
    let visibleCount = 0;

    noteCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const subject = card.querySelector('.note-meta span').textContent.toLowerCase();
        const matchesSearch = !searchTerm || title.includes(searchTerm);
        const matchesSubject = subjectFilter === 'all' || subject.includes(subjectFilter);
        
        if (matchesSearch && matchesSubject) {
            card.style.display = 'flex';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    // Sort notes
    const notesGrid = document.getElementById('notesGrid');
    if (notesGrid && sortFilter !== 'recent') {
        const cards = Array.from(noteCards);
        cards.sort((a, b) => {
            if (sortFilter === 'name') {
                return a.querySelector('h3').textContent.localeCompare(b.querySelector('h3').textContent);
            }
            return 0;
        });
        cards.forEach(card => notesGrid.appendChild(card));
    }
}

