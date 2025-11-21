// ===== AI Helper JavaScript =====

document.addEventListener('DOMContentLoaded', function() {
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    const questionChips = document.querySelectorAll('.question-chip');

    // Quick question chips
    questionChips.forEach(chip => {
        chip.addEventListener('click', function() {
            const question = this.textContent;
            chatInput.value = question;
            sendMessage(question);
        });
    });

    // Chat form submission
    if (chatForm && chatInput) {
        chatForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const message = chatInput.value.trim();
            if (message) {
                sendMessage(message);
                chatInput.value = '';
            }
        });
    }

    // Typing indicator
    let isTyping = false;
});

// Send message
function sendMessage(message) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;

    // Add user message
    addMessage(message, 'user');
    
    // Show typing indicator
    showTypingIndicator();
    
    // Simulate AI response
    setTimeout(() => {
        hideTypingIndicator();
        const response = generateAIResponse(message);
        addMessage(response, 'ai');
    }, 1500);
}

// Add message to chat
function addMessage(text, type) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message fade-in-up`;
    
    if (type === 'user') {
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="message-content">
                <p>${text}</p>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <p>${text}</p>
            </div>
        `;
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Show typing indicator
function showTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;

    const typingDiv = document.createElement('div');
    typingDiv.id = 'typingIndicator';
    typingDiv.className = 'message ai-message';
    typingDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    
    // Add typing dots styles
    if (!document.getElementById('typing-styles')) {
        const style = document.createElement('style');
        style.id = 'typing-styles';
        style.textContent = `
            .typing-dots {
                display: flex;
                gap: 4px;
                padding: 0.5rem;
            }
            .typing-dots span {
                width: 8px;
                height: 8px;
                background: #64748b;
                border-radius: 50%;
                animation: typingDot 1.4s infinite;
            }
            .typing-dots span:nth-child(2) {
                animation-delay: 0.2s;
            }
            .typing-dots span:nth-child(3) {
                animation-delay: 0.4s;
            }
            @keyframes typingDot {
                0%, 60%, 100% {
                    transform: translateY(0);
                    opacity: 0.7;
                }
                30% {
                    transform: translateY(-10px);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Hide typing indicator
function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Generate AI response (simulated)
function generateAIResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Simple response patterns (in a real app, this would be an API call)
    if (lowerMessage.includes('quantum') || lowerMessage.includes('mechanics')) {
        return "Quantum mechanics is a fundamental theory in physics that describes the physical properties of nature at the scale of atoms and subatomic particles. It's based on the principle that energy, momentum, and other quantities are quantized. Would you like me to explain a specific aspect of quantum mechanics?";
    }
    
    if (lowerMessage.includes('calculus')) {
        return "Calculus is a branch of mathematics that studies continuous change. It has two main branches: differential calculus (concerning rates of change and slopes) and integral calculus (concerning accumulation of quantities). What specific topic in calculus would you like help with?";
    }
    
    if (lowerMessage.includes('photosynthesis')) {
        return "Photosynthesis is the process by which plants, algae, and some bacteria convert light energy into chemical energy stored in glucose. The general equation is: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂. It occurs in two main stages: light-dependent reactions and light-independent reactions (Calvin cycle).";
    }
    
    if (lowerMessage.includes('algorithm')) {
        return "An algorithm is a step-by-step procedure for solving a problem or completing a task. In computer science, algorithms are used to process data, perform calculations, and automate tasks. Common algorithm types include sorting, searching, and graph algorithms. What type of algorithm are you interested in?";
    }
    
    if (lowerMessage.includes('essay') || lowerMessage.includes('writing')) {
        return "I can help you with essay writing! A good essay typically has: 1) An introduction with a thesis statement, 2) Body paragraphs with supporting evidence, and 3) A conclusion that summarizes your points. What specific aspect of essay writing would you like help with?";
    }
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        return "Hello! I'm here to help you with your studies. Feel free to ask me any questions about mathematics, science, literature, or any other subject. How can I assist you today?";
    }
    
    if (lowerMessage.includes('help')) {
        return "I'm your AI learning assistant! I can help you with:\n• Explaining complex concepts\n• Solving math problems\n• Reviewing essays\n• Summarizing study materials\n• Answering questions\n• Providing study tips\n\nWhat would you like help with?";
    }
    
    // Default response
    return `I understand you're asking about "${message}". That's an interesting question! While I'm a learning assistant, I'd recommend consulting your course materials or discussing this with your instructor for the most accurate information. Is there a specific aspect you'd like me to help clarify?`;
}

