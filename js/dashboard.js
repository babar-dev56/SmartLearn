// ===== Dashboard JavaScript =====

document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const userMenu = document.getElementById('userMenu');
    const userDropdown = document.getElementById('userDropdown');
    const aiSearchInput = document.getElementById('aiSearchInput');
    const aiSearchBtn = document.querySelector('.ai-search-btn');
    
    // Toggle sidebar collapse
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            
            // Save state to localStorage
            const isCollapsed = sidebar.classList.contains('collapsed');
            localStorage.setItem('sidebarCollapsed', isCollapsed);
        });
        
        // Load saved state
        const savedState = localStorage.getItem('sidebarCollapsed');
        if (savedState === 'true') {
            sidebar.classList.add('collapsed');
        }
    }
    
    // User menu dropdown
    if (userMenu && userDropdown) {
        userMenu.addEventListener('click', function(e) {
            e.stopPropagation();
            userMenu.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!userMenu.contains(e.target)) {
                userMenu.classList.remove('active');
            }
        });
    }
    
    // AI Search functionality
    if (aiSearchBtn && aiSearchInput) {
        aiSearchBtn.addEventListener('click', function() {
            const query = aiSearchInput.value.trim();
            if (query) {
                // Redirect to AI helper with query
                window.location.href = `ai-helper.html?q=${encodeURIComponent(query)}`;
            } else {
                window.location.href = 'ai-helper.html';
            }
        });
        
        aiSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                aiSearchBtn.click();
            }
        });
    }
    
    // Add tooltips for collapsed sidebar
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        const title = item.getAttribute('title');
        if (title) {
            item.addEventListener('mouseenter', function() {
                if (sidebar.classList.contains('collapsed')) {
                    showTooltip(this, title);
                }
            });
            
            item.addEventListener('mouseleave', function() {
                hideTooltip();
            });
        }
    });
    
    // Close tooltip when sidebar expands
    if (sidebar) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'class') {
                    if (!sidebar.classList.contains('collapsed')) {
                        hideTooltip();
                    }
                }
            });
        });
        
        observer.observe(sidebar, {
            attributes: true
        });
    }
});

// Tooltip functionality
let tooltipElement = null;

function showTooltip(element, text) {
    // Remove existing tooltip
    hideTooltip();
    
    // Create tooltip
    tooltipElement = document.createElement('div');
    tooltipElement.className = 'sidebar-tooltip';
    tooltipElement.textContent = text;
    document.body.appendChild(tooltipElement);
    
    // Position tooltip
    const rect = element.getBoundingClientRect();
    tooltipElement.style.left = (rect.right + 10) + 'px';
    tooltipElement.style.top = (rect.top + (rect.height / 2) - (tooltipElement.offsetHeight / 2)) + 'px';
    
    // Add styles if not already added
    if (!document.getElementById('tooltip-styles')) {
        const style = document.createElement('style');
        style.id = 'tooltip-styles';
        style.textContent = `
            .sidebar-tooltip {
                position: fixed;
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 0.5rem 0.75rem;
                border-radius: 6px;
                font-size: 0.875rem;
                white-space: nowrap;
                z-index: 10000;
                pointer-events: none;
                animation: fadeIn 0.2s ease-out;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            }
            .sidebar-tooltip::before {
                content: '';
                position: absolute;
                left: -5px;
                top: 50%;
                transform: translateY(-50%);
                border: 5px solid transparent;
                border-right-color: rgba(0, 0, 0, 0.9);
            }
        `;
        document.head.appendChild(style);
    }
}

function hideTooltip() {
    if (tooltipElement) {
        tooltipElement.remove();
        tooltipElement = null;
    }
}

