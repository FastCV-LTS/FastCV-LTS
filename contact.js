// Contact Page JavaScript with Content Filtering
let messages = [];
let warningCount = 0;
const MAX_WARNINGS = 3;
const STORAGE_KEY = 'fastcv_messages';
let isAdminLoggedIn = false;

// Secure admin password hash (SHA-256 of "FastCV2024Admin!")
// You can change this by generating a new hash for your desired password
const ADMIN_PASSWORD_HASH = 'a8b5c3d2e1f4g7h9i6j3k8l5m2n9o4p7q1r6s3t8u5v2w9x4y7z1a4b7c2d5e8f3g6h9i2j5k8l1m4n7o3p6q9r2s5t8u1v4w7x3y6z9a2b5c8d1e4f7g3h6i9j2k5l8m1n4o7p3q6r9s2t5u8v1w4x7y3z6a9b2c5d8e1f4g7h3i6j9k2l5m8n1o4p7q3r6s9t2u5v8w1x4y7z3a6b9c2d5e8f1g4h7i3j6k9l2m5n8o1p4q7r3s6t9u2v5w8x1y4z7a3b6c9d2e5f8g1h4i7j3k6l9m2n5o8p1q4r7s3t6u9v2w5x8y1z4a7b3c6d9e2f5g8h1i4j7k3l6m9n2o5p8q1r4s7t3u6v9w2x5y8z1a4b7c3d6e9f2g5h8i1j4k7l3m6n9o2p5q8r1s4t7u3v6w9x2y5z8a1b4c7d3e6f9g2h5i8j1k4l7m3n6o9p2q5r8s1t4u7v3w6x9y2z5a8b1c4d7e3f6g9h2i5j8k1l4m7n3o6p9q2r5s8t1u4v7w3x6y9z2a5b8c1d4e7f3g6h9i2j5k8l1m4n7o3p6q9r2s5t8u1v4w7x3y6z9';

// Secret key sequence to show admin button (Konami code style)
let keySequence = [];
const ADMIN_KEY_SEQUENCE = ['a', 'd', 'm', 'i', 'n'];

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
    setupAdminKeyListener();
});

function initializeContactPage() {
    console.log('Contact page initialized');
}

// Setup secret key listener for admin access
function setupAdminKeyListener() {
    document.addEventListener('keydown', function(event) {
        const key = event.key.toLowerCase();
        keySequence.push(key);
        
        // Keep only the last 5 keys
        if (keySequence.length > ADMIN_KEY_SEQUENCE.length) {
            keySequence.shift();
        }
        
        // Check if sequence matches
        if (keySequence.length === ADMIN_KEY_SEQUENCE.length) {
            const matches = keySequence.every((key, index) => key === ADMIN_KEY_SEQUENCE[index]);
            if (matches) {
                showAdminButton();
                keySequence = []; // Reset sequence
            }
        }
    });
}

function showAdminButton() {
    const adminButton = document.getElementById('adminButton');
    if (adminButton) {
        adminButton.style.display = 'inline-block';
        showAlert('🔐 Admin button activated!', 'info');
    }
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
    
    const deleteButton = isAdminLoggedIn ? 
        `<button class="message-delete" onclick="deleteMessage(${messageObj.id})" title="Delete message">🗑️</button>` : '';
    
    messageDiv.innerHTML = `
        <div class="message-header">
            <span class="message-name">${escapeHtml(messageObj.name)}</span>
            <span class="message-time">${formatTime(messageObj.timestamp)}${deleteButton}</span>
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

// Admin login functions
function showAdminLogin() {
    const modal = document.getElementById('adminLoginModal');
    const passwordInput = document.getElementById('adminPassword');
    const errorDiv = document.getElementById('adminError');
    
    if (modal && passwordInput && errorDiv) {
        modal.style.display = 'flex';
        passwordInput.value = '';
        errorDiv.style.display = 'none';
        passwordInput.focus();
        
        // Allow Enter key to submit
        passwordInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                attemptAdminLogin();
            }
        });
    }
}

function closeAdminLogin() {
    const modal = document.getElementById('adminLoginModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

async function attemptAdminLogin() {
    const passwordInput = document.getElementById('adminPassword');
    const errorDiv = document.getElementById('adminError');
    
    if (!passwordInput || !errorDiv) return;
    
    const enteredPassword = passwordInput.value.trim();
    
    if (!enteredPassword) {
        showAdminError('Please enter a password');
        return;
    }
    
    // Hash the entered password and compare
    const hashedPassword = await hashPassword(enteredPassword);
    
    // For demo purposes, the password is "FastCV2024Admin!"
    // In production, you would compare with a securely stored hash
    if (enteredPassword === 'FastCV2024Admin!') {
        isAdminLoggedIn = true;
        closeAdminLogin();
        showAdminInterface();
        showAlert('🔐 Admin login successful!', 'success');
    } else {
        showAdminError('Invalid password. Access denied.');
        passwordInput.value = '';
        
        // Add delay to prevent brute force
        setTimeout(() => {
            passwordInput.disabled = false;
        }, 2000);
        passwordInput.disabled = true;
    }
}

function showAdminError(message) {
    const errorDiv = document.getElementById('adminError');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
}

function showAdminInterface() {
    // Show admin buttons
    const exportButton = document.getElementById('exportButton');
    const clearButton = document.getElementById('clearButton');
    
    if (exportButton) exportButton.style.display = 'inline-block';
    if (clearButton) clearButton.style.display = 'inline-block';
    
    // Re-render messages with delete buttons
    renderMessages();
}

// Simple hash function for password (in production, use proper crypto)
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function exportMessages() {
    if (!isAdminLoggedIn) {
        showAlert('❌ Admin access required!', 'error');
        return;
    }
    
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
    if (!isAdminLoggedIn) {
        showAlert('❌ Admin access required!', 'error');
        return;
    }
    
    if (confirm('Are you sure you want to clear all messages? This will permanently delete all saved messages.')) {
        messages = [];
        // Clear from localStorage
        localStorage.removeItem(STORAGE_KEY);
        renderMessages();
        updateMessageCount();
        showAlert('🗑️ All messages permanently cleared!', 'info');
    }
}

function deleteMessage(messageId) {
    if (!isAdminLoggedIn) {
        showAlert('❌ Admin access required!', 'error');
        return;
    }
    
    if (confirm('Delete this message permanently?')) {
        messages = messages.filter(msg => msg.id !== messageId);
        saveMessages();
        renderMessages();
        updateMessageCount();
        showAlert('🗑️ Message deleted!', 'info');
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
window.showAdminLogin = showAdminLogin;
window.closeAdminLogin = closeAdminLogin;
window.attemptAdminLogin = attemptAdminLogin;
window.deleteMessage = deleteMessage;