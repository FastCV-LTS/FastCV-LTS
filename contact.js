// Contact Page JavaScript with Content Filtering
let messages = [];
let warningCount = 0;
const MAX_WARNINGS = 3;
const STORAGE_KEY = 'fastcv_messages';

// Comprehensive bad words filter
const badWords = [
    // Explicit content
    'fuck', 'shit', 'damn', 'hell', 'ass', 'bitch', 'bastard', 'crap',
    'piss', 'cock', 'dick', 'pussy', 'tits', 'boobs', 'sex', 'porn',
    'nude', 'naked', 'horny', 'sexy', 'slut', 'whore', 'rape', 'kill',
    
    // Offensive terms
    'stupid', 'idiot', 'moron', 'retard', 'gay', 'fag', 'nigger', 'nazi',
    'terrorist', 'bomb', 'gun', 'weapon', 'violence', 'hate', 'racist',
    
    // Spam/promotional
    'buy now', 'click here', 'free money', 'get rich', 'make money fast',
    'viagra', 'casino', 'lottery', 'winner', 'congratulations you won',
    
    // Variations and leetspeak
    'f*ck', 'sh*t', 'b*tch', 'a$$', 'f**k', 'sh**', 'wtf', 'stfu',
    'fuk', 'sht', 'btch', 'fck', 'dmn', 'hl', 'sx', 'prn'
];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeContactPage();
    setupEventListeners();
    loadMessages();
    updateMessageCount();
});

function initializeContactPage() {
    console.log('Contact page initialized');
}

function loadMessages() {
    try {
        const savedMessages = localStorage.getItem(STORAGE_KEY);
        if (savedMessages) {
            messages = JSON.parse(savedMessages);
            // Convert timestamp strings back to Date objects
            messages.forEach(msg => {
                msg.timestamp = new Date(msg.timestamp);
            });
            renderMessages();
        }
    } catch (error) {
        console.error('Error loading messages:', error);
        messages = [];
    }
}

function saveMessages() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
        console.error('Error saving messages:', error);
    }
}

function setupEventListeners() {
    // Form submission
    const messageForm = document.getElementById('messageForm');
    if (messageForm) {
        messageForm.addEventListener('submit', handleMessageSubmit);
    }
    
    // Character counters
    const nameInput = document.getElementById('userName');
    const messageInput = document.getElementById('userMessage');
    
    if (nameInput) {
        nameInput.addEventListener('input', function() {
            updateCharCount(this, 30);
        });
    }
    
    if (messageInput) {
        messageInput.addEventListener('input', function() {
            updateCharCount(this, 300);
        });
    }
}

function updateCharCount(input, maxLength) {
    const charCount = input.nextElementSibling;
    if (charCount && charCount.classList.contains('char-count')) {
        const currentLength = input.value.length;
        charCount.textContent = `${currentLength}/${maxLength}`;
        
        // Change color based on usage
        if (currentLength > maxLength * 0.9) {
            charCount.style.color = '#ff0000';
        } else if (currentLength > maxLength * 0.7) {
            charCount.style.color = '#ffff00';
        } else {
            charCount.style.color = '#666';
        }
    }
}

function handleMessageSubmit(event) {
    event.preventDefault();
    
    const nameInput = document.getElementById('userName');
    const messageInput = document.getElementById('userMessage');
    
    if (!nameInput || !messageInput) {
        console.error('Form inputs not found');
        return;
    }
    
    const name = nameInput.value.trim();
    const message = messageInput.value.trim();
    
    // Basic validation
    if (!name || !message) {
        showAlert('❌ Please fill in all fields!', 'error');
        return;
    }
    
    // Content filtering
    const filterResult = checkContent(name + ' ' + message);
    if (!filterResult.isClean) {
        showContentWarning(filterResult.reason);
        return;
    }
    
    // Check if user is banned (3 warnings)
    if (warningCount >= MAX_WARNINGS) {
        showBannedMessage();
        return;
    }
    
    // Add message
    addMessage(name, message);
    
    // Clear form
    nameInput.value = '';
    messageInput.value = '';
    updateCharCount(nameInput, 30);
    updateCharCount(messageInput, 300);
    
    // Show success
    showAlert('✅ Message sent successfully!', 'success');
}

function checkContent(text) {
    const lowerText = text.toLowerCase();
    
    // Check for bad words
    for (let word of badWords) {
        if (lowerText.includes(word.toLowerCase())) {
            return {
                isClean: false,
                reason: `Inappropriate language detected: "${word}"`
            };
        }
    }
    
    // Check for excessive caps (more than 70% uppercase)
    const capsCount = (text.match(/[A-Z]/g) || []).length;
    const letterCount = (text.match(/[A-Za-z]/g) || []).length;
    if (letterCount > 10 && (capsCount / letterCount) > 0.7) {
        return {
            isClean: false,
            reason: 'Excessive use of capital letters detected'
        };
    }
    
    // Check for repeated characters (spam-like)
    if (/(.)\1{4,}/.test(text)) {
        return {
            isClean: false,
            reason: 'Spam-like repeated characters detected'
        };
    }
    
    // Check for URLs (basic spam prevention)
    if (/https?:\/\/|www\./i.test(text)) {
        return {
            isClean: false,
            reason: 'URLs are not allowed in messages'
        };
    }
    
    return { isClean: true };
}

function showContentWarning(reason) {
    warningCount++;
    
    const warningSystem = document.getElementById('warningSystem');
    const warningMessage = document.getElementById('warningMessage');
    const warningCountElement = document.getElementById('warningCount');
    
    if (warningSystem && warningMessage && warningCountElement) {
        warningMessage.textContent = `Explicit content was detected. Please fix your comment. (${reason})`;
        warningCountElement.textContent = `Warnings: ${warningCount}/${MAX_WARNINGS}`;
        
        if (warningCount >= MAX_WARNINGS) {
            warningCountElement.innerHTML += '<br><strong style="color: #ff0000;">Final Warning!</strong>';
        }
        
        warningSystem.style.display = 'flex';
        
        // Auto-close after 5 seconds
        setTimeout(() => {
            closeWarning();
        }, 5000);
    }
}

function showBannedMessage() {
    const warningSystem = document.getElementById('warningSystem');
    const warningMessage = document.getElementById('warningMessage');
    const warningCountElement = document.getElementById('warningCount');
    
    if (warningSystem && warningMessage && warningCountElement) {
        warningMessage.textContent = 'You have been reported to admin for repeated violations. Your messages are now blocked.';
        warningCountElement.innerHTML = '<strong style="color: #ff0000;">REPORTED TO ADMIN</strong>';
        
        warningSystem.style.display = 'flex';
        
        // Disable form
        const form = document.getElementById('messageForm');
        if (form) {
            const inputs = form.querySelectorAll('input, textarea, button');
            inputs.forEach(input => {
                input.disabled = true;
                input.style.opacity = '0.5';
            });
        }
    }
}

function closeWarning() {
    const warningSystem = document.getElementById('warningSystem');
    if (warningSystem) {
        warningSystem.style.display = 'none';
    }
}

function addMessage(name, message) {
    const timestamp = new Date();
    const messageObj = {
        id: Date.now(),
        name: name,
        message: message,
        timestamp: timestamp
    };
    
    messages.unshift(messageObj); // Add to beginning
    
    // Limit to 100 messages (increased from 50)
    if (messages.length > 100) {
        messages = messages.slice(0, 100);
    }
    
    // Save to localStorage
    saveMessages();
    
    renderMessages();
    updateMessageCount();
}

function renderMessages() {
    const messagesDisplay = document.getElementById('messagesDisplay');
    if (!messagesDisplay) return;
    
    // Keep welcome message and add new messages
    const welcomeMessage = messagesDisplay.querySelector('.welcome-message');
    messagesDisplay.innerHTML = '';
    
    if (welcomeMessage) {
        messagesDisplay.appendChild(welcomeMessage);
    }
    
    messages.forEach(msg => {
        const messageElement = createMessageElement(msg);
        messagesDisplay.appendChild(messageElement);
    });
    
    // Scroll to top to show newest message
    messagesDisplay.scrollTop = 0;
}

function createMessageElement(messageObj) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message-bubble';
    messageDiv.innerHTML = `
        <div class="message-header">
            <span class="message-name">${escapeHtml(messageObj.name)}</span>
            <span class="message-time">${formatTime(messageObj.timestamp)}</span>
        </div>
        <div class="message-content">${escapeHtml(messageObj.message)}</div>
    `;
    return messageDiv;
}

function formatTime(date) {
    return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function updateMessageCount() {
    const messageCountElement = document.getElementById('messageCount');
    if (messageCountElement) {
        const count = messages.length;
        messageCountElement.textContent = `${count} message${count !== 1 ? 's' : ''}`;
    }
}

function exportMessages() {
    if (messages.length === 0) {
        showAlert('📭 No messages to export!', 'info');
        return;
    }
    
    // Create export data
    const exportData = {
        exportDate: new Date().toISOString(),
        totalMessages: messages.length,
        messages: messages.map(msg => ({
            id: msg.id,
            name: msg.name,
            message: msg.message,
            timestamp: msg.timestamp.toISOString(),
            formattedTime: msg.timestamp.toLocaleString()
        }))
    };
    
    // Create downloadable file
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    // Create download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `fastcv-messages-${new Date().toISOString().split('T')[0]}.json`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showAlert('📥 Messages exported successfully!', 'success');
}

function clearMessages() {
    if (confirm('Are you sure you want to clear all messages? This will permanently delete all saved messages.')) {
        messages = [];
        // Clear from localStorage
        localStorage.removeItem(STORAGE_KEY);
        renderMessages();
        updateMessageCount();
        showAlert('🗑️ All messages permanently cleared!', 'info');
    }
}

function showAlert(message, type = 'info') {
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: #fff;
        font-weight: bold;
        z-index: 1001;
        animation: slideInRight 0.3s ease-out;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    // Set background color based on type
    switch (type) {
        case 'success':
            alert.style.background = 'linear-gradient(45deg, #00ff00, #00cc00)';
            alert.style.border = '2px solid #00ff00';
            break;
        case 'error':
            alert.style.background = 'linear-gradient(45deg, #ff0000, #cc0000)';
            alert.style.border = '2px solid #ff0000';
            break;
        case 'info':
            alert.style.background = 'linear-gradient(45deg, #00ffff, #0099cc)';
            alert.style.border = '2px solid #00ffff';
            break;
    }
    
    alert.textContent = message;
    document.body.appendChild(alert);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (alert.parentNode) {
                    alert.parentNode.removeChild(alert);
                }
            }, 300);
        }
    }, 3000);
}

// Add CSS animations for alerts
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);

// Global functions for HTML onclick handlers
window.closeWarning = closeWarning;
window.clearMessages = clearMessages;
window.exportMessages = exportMessages;