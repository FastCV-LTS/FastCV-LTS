// 90's Retro JavaScript for FastCV-LTS

document.addEventListener('DOMContentLoaded', function() {
    // Add retro sound effects (optional - commented out for now)
    // const clickSound = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
    
    // Retro typing effect for hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        heroTitle.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < originalText.length) {
                heroTitle.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }
        
        setTimeout(typeWriter, 1000);
    }
    
    // Add glitch effect to logo
    const logo = document.querySelector('.logo-text');
    if (logo) {
        setInterval(() => {
            logo.style.textShadow = `${Math.random() * 4}px ${Math.random() * 4}px 0px #ff00ff, ${Math.random() * 4}px ${Math.random() * 4}px 0px #00ffff`;
            setTimeout(() => {
                logo.style.textShadow = '2px 2px 0px #ff00ff';
            }, 100);
        }, 3000);
    }
    
    // Add click effects to buttons
    const buttons = document.querySelectorAll('.cta-button');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create retro click effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 0, 0.6)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'retroRipple 0.6s linear';
            ripple.style.pointerEvents = 'none';
            
            this.style.position = 'relative';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add hover effects to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.background = `linear-gradient(45deg, #ff00ff, #00ffff)`;
            this.style.color = '#000';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.background = '#000';
            this.style.color = '#fff';
        });
    });
    
    // Add retro cursor trail effect
    let mouseTrail = [];
    document.addEventListener('mousemove', function(e) {
        mouseTrail.push({
            x: e.clientX,
            y: e.clientY,
            time: Date.now()
        });
        
        // Keep only recent trail points
        mouseTrail = mouseTrail.filter(point => Date.now() - point.time < 500);
        
        // Create trail element
        if (mouseTrail.length > 1) {
            const trail = document.createElement('div');
            trail.style.position = 'fixed';
            trail.style.left = e.clientX + 'px';
            trail.style.top = e.clientY + 'px';
            trail.style.width = '4px';
            trail.style.height = '4px';
            trail.style.background = '#ff00ff';
            trail.style.borderRadius = '50%';
            trail.style.pointerEvents = 'none';
            trail.style.zIndex = '9999';
            trail.style.animation = 'fadeOut 0.5s ease-out forwards';
            
            document.body.appendChild(trail);
            
            setTimeout(() => {
                if (trail.parentNode) {
                    trail.parentNode.removeChild(trail);
                }
            }, 500);
        }
    });
    
    // Add navigation active state management
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Add retro loading screen effect
    function showRetroLoader() {
        const loader = document.createElement('div');
        loader.id = 'retro-loader';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="loader-text">LOADING...</div>
                <div class="loader-bar">
                    <div class="loader-progress"></div>
                </div>
            </div>
        `;
        
        const loaderStyles = `
            #retro-loader {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: #000;
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                font-family: 'Courier New', monospace;
            }
            .loader-content {
                text-align: center;
                color: #00ffff;
            }
            .loader-text {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 20px;
                text-shadow: 2px 2px 0px #ff00ff;
                animation: blink 1s infinite;
            }
            .loader-bar {
                width: 300px;
                height: 20px;
                border: 2px solid #00ffff;
                background: #000;
                position: relative;
            }
            .loader-progress {
                height: 100%;
                background: linear-gradient(45deg, #ff00ff, #00ffff);
                width: 0%;
                animation: loadProgress 2s ease-in-out forwards;
            }
            @keyframes blink {
                0%, 50% { opacity: 1; }
                51%, 100% { opacity: 0; }
            }
            @keyframes loadProgress {
                0% { width: 0%; }
                100% { width: 100%; }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = loaderStyles;
        document.head.appendChild(styleSheet);
        document.body.appendChild(loader);
        
        setTimeout(() => {
            loader.remove();
            styleSheet.remove();
        }, 2000);
    }
    
    // Show loader on page load
    if (document.readyState === 'loading') {
        showRetroLoader();
    }
});

// Add CSS animations via JavaScript
const retroAnimations = `
    @keyframes retroRipple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes fadeOut {
        to {
            opacity: 0;
            transform: scale(0);
        }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = retroAnimations;
document.head.appendChild(styleSheet);

// Console easter egg
console.log(`
██████╗ ███████╗████████╗██████╗  ██████╗ 
██╔══██╗██╔════╝╚══██╔══╝██╔══██╗██╔═══██╗
██████╔╝█████╗     ██║   ██████╔╝██║   ██║
██╔══██╗██╔══╝     ██║   ██╔══██╗██║   ██║
██║  ██║███████╗   ██║   ██║  ██║╚██████╔╝
╚═╝  ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ 

Welcome to FastCV-LTS - The 90's are back!
Built with ❤️ and lots of neon colors.
`);