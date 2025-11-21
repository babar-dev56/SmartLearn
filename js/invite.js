// ===== Invite Students JavaScript =====

document.addEventListener('DOMContentLoaded', function() {
    const inviteModal = document.getElementById('inviteModal');
    const closeInviteModal = document.getElementById('closeInviteModal');
    const inviteBtns = document.querySelectorAll('.invite-btn');
    const inviteTabs = document.querySelectorAll('.invite-tab');
    const inviteTabContents = document.querySelectorAll('.invite-tab-content');
    const copyLinkBtn = document.getElementById('copyLinkBtn');
    const roomLink = document.getElementById('roomLink');
    const inviteEmailForm = document.getElementById('inviteEmailForm');
    const shareButtons = document.querySelectorAll('.share-btn');

    // Open invite modal
    inviteBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const roomName = this.getAttribute('data-room');
            inviteModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Update room link with room name
            if (roomLink) {
                const linkValue = `https://smartlearn.com/room/${roomName.toLowerCase().replace(/\s+/g, '-')}`;
                roomLink.value = linkValue;
            }
        });
    });

    // Close invite modal
    if (closeInviteModal) {
        closeInviteModal.addEventListener('click', function() {
            inviteModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Close modal on outside click
    if (inviteModal) {
        inviteModal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Tab switching
    inviteTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            inviteTabs.forEach(t => t.classList.remove('active'));
            inviteTabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            const targetContent = document.getElementById(targetTab + 'Tab');
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

    // Copy link functionality
    if (copyLinkBtn && roomLink) {
        copyLinkBtn.addEventListener('click', function() {
            roomLink.select();
            roomLink.setSelectionRange(0, 99999); // For mobile devices
            
            navigator.clipboard.writeText(roomLink.value).then(() => {
                const originalHTML = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i> Copied!';
                this.style.background = 'var(--success-color)';
                this.style.color = 'white';
                this.style.borderColor = 'var(--success-color)';
                
                setTimeout(() => {
                    this.innerHTML = originalHTML;
                    this.style.background = '';
                    this.style.color = '';
                    this.style.borderColor = '';
                }, 2000);
                
                showNotification('Link copied to clipboard!', 'success');
            }).catch(() => {
                showNotification('Failed to copy link', 'error');
            });
        });
    }

    // Share buttons
    shareButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const link = roomLink ? roomLink.value : window.location.href;
            const roomName = document.querySelector('.invite-btn[data-room]')?.getAttribute('data-room') || 'Discussion Room';
            const text = `Join me in ${roomName} on Smart Learn!`;
            
            if (this.classList.contains('email-share')) {
                window.location.href = `mailto:?subject=Join ${roomName}&body=${encodeURIComponent(text + '\n\n' + link)}`;
            } else if (this.classList.contains('whatsapp-share')) {
                window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + link)}`, '_blank');
            } else if (this.classList.contains('facebook-share')) {
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`, '_blank');
            } else if (this.classList.contains('twitter-share')) {
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(link)}`, '_blank');
            } else if (this.classList.contains('linkedin-share')) {
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(link)}`, '_blank');
            }
        });
    });

    // Email invitation form
    if (inviteEmailForm) {
        inviteEmailForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emails = document.getElementById('inviteEmails').value;
            const message = document.getElementById('inviteMessage').value;
            
            if (!emails.trim()) {
                showNotification('Please enter at least one email address', 'error');
                return;
            }
            
            // Simulate sending invitations
            const emailList = emails.split(',').map(email => email.trim()).filter(email => email);
            
            showNotification(`Invitations sent to ${emailList.length} student(s)!`, 'success');
            
            // Reset form
            inviteEmailForm.reset();
            inviteModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
});

