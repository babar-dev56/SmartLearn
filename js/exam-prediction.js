// ===== Exam Prediction JavaScript =====

document.addEventListener('DOMContentLoaded', function() {
    const addPastPaperBtn = document.getElementById('addPastPaperBtn');
    const addPastPaperModal = document.getElementById('addPastPaperModal');
    const closePastPaperModal = document.getElementById('closePastPaperModal');
    const cancelPastPaper = document.getElementById('cancelPastPaper');
    const addPastPaperForm = document.getElementById('addPastPaperForm');
    const paperUploadArea = document.getElementById('paperUploadArea');
    const paperFile = document.getElementById('paperFile');
    const papersGrid = document.querySelector('.papers-grid');

    // Open add past paper modal
    if (addPastPaperBtn && addPastPaperModal) {
        addPastPaperBtn.addEventListener('click', function() {
            addPastPaperModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    // Close modal
    if (closePastPaperModal) {
        closePastPaperModal.addEventListener('click', function() {
            addPastPaperModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    if (cancelPastPaper) {
        cancelPastPaper.addEventListener('click', function() {
            addPastPaperModal.classList.remove('active');
            document.body.style.overflow = '';
            addPastPaperForm.reset();
        });
    }

    // File upload handling
    if (paperUploadArea && paperFile) {
        paperUploadArea.addEventListener('click', function() {
            paperFile.click();
        });

        paperUploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.borderColor = '#6366f1';
            this.style.background = 'rgba(99, 102, 241, 0.05)';
        });

        paperUploadArea.addEventListener('dragleave', function() {
            this.style.borderColor = '';
            this.style.background = '';
        });

        paperUploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.borderColor = '';
            this.style.background = '';
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                paperFile.files = files;
                updateUploadArea(files[0]);
            }
        });

        paperFile.addEventListener('change', function() {
            if (this.files.length > 0) {
                updateUploadArea(this.files[0]);
            }
        });
    }

    // Form submission
    if (addPastPaperForm) {
        addPastPaperForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const title = document.getElementById('paperTitle').value;
            const subject = document.getElementById('paperSubject').value;
            const year = document.getElementById('paperYear').value;
            const score = document.getElementById('yourScore').value;
            const difficulty = document.getElementById('paperDifficulty').value;
            const timeTaken = document.getElementById('timeTaken').value;
            const notes = document.getElementById('paperNotes').value;
            const file = paperFile.files[0];

            if (!title || !subject || !year || !score || !timeTaken || !file) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }

            // Add paper to grid
            addPaperToGrid({
                title,
                subject,
                year,
                score,
                difficulty,
                timeTaken,
                notes,
                fileName: file.name,
                fileSize: file.size
            });

            showNotification('Past paper added successfully!', 'success');
            addPastPaperForm.reset();
            paperUploadArea.innerHTML = `
                <i class="fas fa-cloud-upload-alt"></i>
                <p>Drag and drop PDF file here or click to browse</p>
            `;
            addPastPaperModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Paper actions
    if (papersGrid) {
        papersGrid.addEventListener('click', function(e) {
            const actionBtn = e.target.closest('.action-btn');
            if (!actionBtn) return;

            const paperCard = actionBtn.closest('.paper-card');
            const paperTitle = paperCard.querySelector('h3').textContent;
            const action = actionBtn.querySelector('i').classList;

            if (action.contains('fa-eye')) {
                showNotification(`Viewing ${paperTitle}...`, 'info');
            } else if (action.contains('fa-download')) {
                showNotification(`Downloading ${paperTitle}...`, 'info');
                setTimeout(() => {
                    showNotification(`${paperTitle} downloaded!`, 'success');
                }, 1000);
            } else if (action.contains('fa-chart-line')) {
                showNotification(`Analyzing ${paperTitle}...`, 'info');
            } else if (action.contains('fa-trash')) {
                if (confirm(`Are you sure you want to delete ${paperTitle}?`)) {
                    paperCard.style.animation = 'fadeOut 0.3s ease';
                    setTimeout(() => {
                        paperCard.remove();
                        showNotification('Past paper deleted', 'success');
                    }, 300);
                }
            }
        });
    }
});

// Update upload area
function updateUploadArea(file) {
    const uploadArea = document.getElementById('paperUploadArea');
    if (!uploadArea) return;

    uploadArea.innerHTML = `
        <i class="fas fa-file-pdf"></i>
        <p><strong>${file.name}</strong></p>
        <p style="font-size: 0.875rem; color: #64748b;">${formatFileSize(file.size)}</p>
    `;
    uploadArea.style.borderColor = '#10b981';
    uploadArea.style.background = 'rgba(16, 185, 129, 0.05)';
}

// Add paper to grid
function addPaperToGrid(paper) {
    const papersGrid = document.querySelector('.papers-grid');
    if (!papersGrid) return;

    const paperCard = document.createElement('div');
    paperCard.className = 'paper-card stagger-item fade-in-up';
    
    const difficultyClass = paper.difficulty === 'easy' ? 'easy' : paper.difficulty === 'hard' ? 'hard' : 'medium';
    const difficultyText = paper.difficulty.charAt(0).toUpperCase() + paper.difficulty.slice(1);
    
    paperCard.innerHTML = `
        <div class="paper-header">
            <div class="paper-icon">
                <i class="fas fa-file-pdf"></i>
            </div>
            <div class="paper-info">
                <h3>${paper.title}</h3>
                <p class="paper-meta">
                    <span><i class="fas fa-calendar"></i> ${paper.year}</span>
                    <span><i class="fas fa-tag"></i> ${getSubjectName(paper.subject)}</span>
                </p>
            </div>
        </div>
        <div class="paper-stats">
            <div class="stat-box">
                <span class="stat-label">Your Score</span>
                <span class="stat-value">${paper.score}%</span>
            </div>
            <div class="stat-box">
                <span class="stat-label">Difficulty</span>
                <span class="stat-value ${difficultyClass}">${difficultyText}</span>
            </div>
            <div class="stat-box">
                <span class="stat-label">Time Taken</span>
                <span class="stat-value">${formatTime(paper.timeTaken)}</span>
            </div>
        </div>
        <div class="paper-actions">
            <button class="action-btn" title="View">
                <i class="fas fa-eye"></i>
            </button>
            <button class="action-btn" title="Download">
                <i class="fas fa-download"></i>
            </button>
            <button class="action-btn" title="Analyze">
                <i class="fas fa-chart-line"></i>
            </button>
            <button class="action-btn" title="Delete">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    papersGrid.insertBefore(paperCard, papersGrid.firstChild);
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

// Format time
function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
        return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
}

