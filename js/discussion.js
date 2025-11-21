// ===== Discussion Rooms JavaScript =====

document.addEventListener('DOMContentLoaded', function() {
    // Create room button
    const createRoomBtn = document.getElementById('createRoomBtn');
    const createRoomModal = document.getElementById('createRoomModal');
    const closeRoomModal = document.getElementById('closeRoomModal');
    const cancelRoom = document.getElementById('cancelRoom');
    const createRoomForm = document.getElementById('createRoomForm');

    // Open create room modal
    if (createRoomBtn && createRoomModal) {
        createRoomBtn.addEventListener('click', function() {
            createRoomModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    // Close create room modal
    if (closeRoomModal) {
        closeRoomModal.addEventListener('click', function() {
            createRoomModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    if (cancelRoom) {
        cancelRoom.addEventListener('click', function() {
            createRoomModal.classList.remove('active');
            document.body.style.overflow = '';
            createRoomForm.reset();
        });
    }

    // Create room form submission
    if (createRoomForm) {
        createRoomForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const roomName = document.getElementById('roomName').value;
            const roomSubject = document.getElementById('roomSubject').value;
            const roomDescription = document.getElementById('roomDescription').value;
            const roomPrivacy = document.getElementById('roomPrivacy').value;

            if (!roomName || !roomSubject || !roomDescription) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }

            // Add room to grid
            addRoomToGrid({
                name: roomName,
                subject: roomSubject,
                description: roomDescription,
                privacy: roomPrivacy,
                members: 1,
                messages: 0,
                createdAt: new Date()
            });

            showNotification('Room created successfully!', 'success');
            createRoomForm.reset();
            createRoomModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Join room buttons
    const roomsGrid = document.querySelector('.rooms-grid');
    if (roomsGrid) {
        roomsGrid.addEventListener('click', function(e) {
            const joinBtn = e.target.closest('.btn');
            if (!joinBtn || !joinBtn.textContent.includes('Join')) return;

            const roomCard = joinBtn.closest('.room-card');
            const roomName = roomCard.querySelector('h3').textContent;
            
            if (joinBtn.classList.contains('btn-primary')) {
                showNotification(`You're already in ${roomName}`, 'info');
            } else {
                joinBtn.textContent = 'Joined';
                joinBtn.classList.remove('btn-outline');
                joinBtn.classList.add('btn-primary');
                showNotification(`Joined ${roomName}!`, 'success');
                
                // Update member count
                const memberCount = roomCard.querySelector('.room-meta span');
                if (memberCount) {
                    const currentCount = parseInt(memberCount.textContent);
                    memberCount.innerHTML = `<i class="fas fa-users"></i> ${currentCount + 1} members`;
                }
            }
        });
    }

    // Search rooms
    const roomSearch = document.getElementById('roomSearch');
    if (roomSearch) {
        roomSearch.addEventListener('input', debounce(function() {
            const searchTerm = this.value.toLowerCase();
            const roomCards = document.querySelectorAll('.room-card');
            
            roomCards.forEach(card => {
                const name = card.querySelector('h3').textContent.toLowerCase();
                const description = card.querySelector('.room-description').textContent.toLowerCase();
                
                if (name.includes(searchTerm) || description.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        }, 300));
    }
});

// Add room to grid
function addRoomToGrid(room) {
    const roomsSection = document.querySelector('.rooms-section');
    if (!roomsSection) return;

    // Find or create "My Rooms" section
    let myRoomsSection = document.querySelector('.rooms-section');
    if (!myRoomsSection || !myRoomsSection.querySelector('.section-title')?.textContent.includes('My Rooms')) {
        // Create new section if needed
        const newSection = document.createElement('section');
        newSection.className = 'rooms-section';
        newSection.innerHTML = `
            <h2 class="section-title">My Rooms</h2>
            <div class="rooms-grid"></div>
        `;
        document.querySelector('.page-content').insertBefore(newSection, roomsSection);
        myRoomsSection = newSection;
    }

    const roomsGrid = myRoomsSection.querySelector('.rooms-grid');
    if (!roomsGrid) return;

    const roomCard = document.createElement('div');
    roomCard.className = 'room-card fade-in-up';
    roomCard.innerHTML = `
        <div class="room-header">
            <div class="room-icon">
                <i class="fas ${getSubjectIcon(room.subject)}"></i>
            </div>
            <div class="room-info">
                <h3>${room.name}</h3>
                <p class="room-meta">
                    <span><i class="fas fa-users"></i> ${room.members} member${room.members !== 1 ? 's' : ''}</span>
                    <span><i class="fas fa-comment"></i> ${room.messages} message${room.messages !== 1 ? 's' : ''}</span>
                </p>
            </div>
        </div>
        <p class="room-description">${room.description}</p>
        <div class="room-footer">
            <span class="room-tag">${getSubjectName(room.subject)}</span>
            <button class="btn btn-sm btn-primary">Join</button>
        </div>
    `;
    roomsGrid.insertBefore(roomCard, roomsGrid.firstChild);
}

// Get subject icon
function getSubjectIcon(subject) {
    const icons = {
        'math': 'fa-calculator',
        'physics': 'fa-atom',
        'chemistry': 'fa-flask',
        'cs': 'fa-code',
        'english': 'fa-book-reader'
    };
    return icons[subject] || 'fa-comments';
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

