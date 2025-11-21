// ===== Collaboration JavaScript =====

document.addEventListener('DOMContentLoaded', function() {
    const shareContentBtn = document.getElementById('shareContentBtn');
    const shareContentModal = document.getElementById('shareContentModal');
    const closeShareModal = document.getElementById('closeShareModal');
    const cancelShare = document.getElementById('cancelShare');
    const shareContentForm = document.getElementById('shareContentForm');
    const collabTabs = document.querySelectorAll('.collab-tab');
    const collabTabContents = document.querySelectorAll('.collab-tab-content');
    const shareTabs = document.querySelectorAll('.share-tab');
    const shareTabContents = document.querySelectorAll('.share-tab-content');
    const likeButtons = document.querySelectorAll('.like-btn');
    const voteButtons = document.querySelectorAll('.vote-btn');
    const feedContainer = document.querySelector('.feed-container');

    // Open share content modal
    if (shareContentBtn && shareContentModal) {
        shareContentBtn.addEventListener('click', function() {
            shareContentModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    // Close share modal
    if (closeShareModal) {
        closeShareModal.addEventListener('click', function() {
            shareContentModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    if (cancelShare) {
        cancelShare.addEventListener('click', function() {
            shareContentModal.classList.remove('active');
            document.body.style.overflow = '';
            shareContentForm.reset();
        });
    }

    // Collaboration tabs
    collabTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            collabTabs.forEach(t => t.classList.remove('active'));
            collabTabContents.forEach(c => c.classList.remove('active'));
            
            this.classList.add('active');
            const targetContent = document.getElementById(targetTab + 'Tab');
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

    // Share content tabs
    shareTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetShare = this.getAttribute('data-share');
            
            shareTabs.forEach(t => t.classList.remove('active'));
            shareTabContents.forEach(c => c.classList.remove('active'));
            
            this.classList.add('active');
            const targetContent = document.getElementById(targetShare + 'ShareTab');
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

    // Like functionality
    likeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            const countSpan = this.querySelector('span');
            let currentLikes = parseInt(countSpan.textContent) || 0;
            
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                this.style.color = '#ef4444';
                currentLikes++;
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                this.style.color = '';
                currentLikes--;
            }
            
            countSpan.textContent = currentLikes;
        });
    });

    // Vote functionality
    voteButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const isUpvote = this.classList.contains('upvote');
            const countSpan = this.querySelector('span');
            let currentVotes = parseInt(countSpan.textContent) || 0;
            
            // Remove active state from sibling
            const sibling = this.parentElement.querySelector(isUpvote ? '.downvote' : '.upvote');
            if (sibling && sibling.classList.contains('active')) {
                sibling.classList.remove('active');
                sibling.style.color = '';
            }
            
            // Toggle active state
            if (this.classList.contains('active')) {
                this.classList.remove('active');
                this.style.color = '';
                if (isUpvote) currentVotes--;
                else currentVotes++;
            } else {
                this.classList.add('active');
                this.style.color = isUpvote ? '#10b981' : '#ef4444';
                if (isUpvote) currentVotes++;
                else currentVotes--;
            }
            
            if (countSpan) {
                countSpan.textContent = currentVotes;
            }
        });
    });

    // Share content form submission
    if (shareContentForm) {
        shareContentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const activeShareTab = document.querySelector('.share-tab.active');
            const shareType = activeShareTab ? activeShareTab.getAttribute('data-share') : 'note';
            
            let content = {};
            
            if (shareType === 'note') {
                const title = document.getElementById('shareNoteTitle').value;
                const file = document.getElementById('shareNoteFile').files[0];
                const description = document.getElementById('shareNoteDescription').value;
                
                if (!title || !file) {
                    showNotification('Please fill in all required fields', 'error');
                    return;
                }
                
                content = { type: 'note', title, description, fileName: file.name };
            } else if (shareType === 'summary') {
                const title = document.getElementById('summaryTitle').value;
                const contentText = document.getElementById('summaryContent').value;
                
                if (!title || !contentText) {
                    showNotification('Please fill in all required fields', 'error');
                    return;
                }
                
                content = { type: 'summary', title, content: contentText };
            } else if (shareType === 'question') {
                const title = document.getElementById('questionTitle').value;
                const details = document.getElementById('questionDetails').value;
                const image = document.getElementById('questionImage').files[0];
                
                if (!title || !details) {
                    showNotification('Please fill in all required fields', 'error');
                    return;
                }
                
                content = { type: 'question', title, details, hasImage: !!image };
            }
            
            // Add to feed
            addToFeed(content);
            
            showNotification('Content shared successfully!', 'success');
            shareContentForm.reset();
            shareContentModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // File upload handling
    const uploadAreas = document.querySelectorAll('.upload-area');
    uploadAreas.forEach(area => {
        const input = area.querySelector('input[type="file"]');
        if (input) {
            area.addEventListener('click', function() {
                input.click();
            });

            input.addEventListener('change', function() {
                if (this.files.length > 0) {
                    const file = this.files[0];
                    area.innerHTML = `
                        <i class="fas fa-file"></i>
                        <p><strong>${file.name}</strong></p>
                        <p style="font-size: 0.875rem; color: #64748b;">${formatFileSize(file.size)}</p>
                    `;
                    area.style.borderColor = '#10b981';
                    area.style.background = 'rgba(16, 185, 129, 0.05)';
                }
            });
        }
    });
});

// Helper functions
function getCurrentUser() {
    return {
        name: 'You',
        avatar: 'https://ui-avatars.com/api/?name=You&background=6366f1&color=fff'
    };
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add content to feed
function addToFeed(content) {
    const feedContainer = document.querySelector('.feed-container');
    if (!feedContainer) return;

    const post = document.createElement('div');
    post.className = 'feed-post stagger-item fade-in-up';
    
    let postHTML = '';
    const user = getCurrentUser();
    const avatarUrl = `https://ui-avatars.com/api/?name=${user.name || 'You'}&background=6366f1&color=fff`;
    
    if (content.type === 'note') {
        postHTML = `
            <div class="post-header">
                <img src="${avatarUrl}" alt="User" class="post-avatar">
                <div class="post-author">
                    <h4>${user.name || 'You'}</h4>
                    <span class="post-time">Just now</span>
                </div>
                <div class="post-type-badge note">
                    <i class="fas fa-book"></i> Note
                </div>
            </div>
            <div class="post-content">
                <h3>${content.title}</h3>
                <p>${content.description || ''}</p>
                <div class="post-attachment">
                    <i class="fas fa-file-pdf"></i>
                    <span>${content.fileName}</span>
                    <button class="btn btn-sm">Download</button>
                </div>
            </div>
            <div class="post-actions">
                <button class="action-btn like-btn" data-likes="0">
                    <i class="far fa-heart"></i>
                    <span>0</span>
                </button>
                <button class="action-btn comment-btn">
                    <i class="far fa-comment"></i>
                    <span>0</span>
                </button>
                <button class="action-btn share-btn">
                    <i class="fas fa-share"></i>
                    Share
                </button>
            </div>
        `;
    } else if (content.type === 'summary') {
        postHTML = `
            <div class="post-header">
                <img src="${avatarUrl}" alt="User" class="post-avatar">
                <div class="post-author">
                    <h4>${user.name || 'You'}</h4>
                    <span class="post-time">Just now</span>
                </div>
                <div class="post-type-badge summary">
                    <i class="fas fa-file-alt"></i> Summary
                </div>
            </div>
            <div class="post-content">
                <h3>${content.title}</h3>
                <p>${content.content}</p>
            </div>
            <div class="post-actions">
                <button class="action-btn like-btn" data-likes="0">
                    <i class="far fa-heart"></i>
                    <span>0</span>
                </button>
                <button class="action-btn comment-btn">
                    <i class="far fa-comment"></i>
                    <span>0</span>
                </button>
                <button class="action-btn share-btn">
                    <i class="fas fa-share"></i>
                    Share
                </button>
            </div>
        `;
    } else if (content.type === 'question') {
        postHTML = `
            <div class="post-header">
                <img src="${avatarUrl}" alt="User" class="post-avatar">
                <div class="post-author">
                    <h4>${user.name || 'You'}</h4>
                    <span class="post-time">Just now</span>
                </div>
                <div class="post-type-badge question">
                    <i class="fas fa-question-circle"></i> Question
                </div>
            </div>
            <div class="post-content">
                <h3>${content.title}</h3>
                <p>${content.details}</p>
                ${content.hasImage ? '<div class="question-image"><img src="#" alt="Question"></div>' : ''}
            </div>
            <div class="post-actions">
                <button class="action-btn like-btn" data-likes="0">
                    <i class="far fa-heart"></i>
                    <span>0</span>
                </button>
                <button class="action-btn comment-btn">
                    <i class="far fa-comment"></i>
                    <span>0</span>
                </button>
                <button class="action-btn answer-btn">
                    <i class="fas fa-pen"></i>
                    Answer
                </button>
            </div>
        `;
    }
    
    post.innerHTML = postHTML;
    feedContainer.insertBefore(post, feedContainer.firstChild);
    
    // Re-attach event listeners
    const newLikeBtn = post.querySelector('.like-btn');
    if (newLikeBtn) {
        newLikeBtn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            const countSpan = this.querySelector('span');
            let currentLikes = parseInt(countSpan.textContent) || 0;
            
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                this.style.color = '#ef4444';
                currentLikes++;
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                this.style.color = '';
                currentLikes--;
            }
            
            countSpan.textContent = currentLikes;
        });
    }
}

