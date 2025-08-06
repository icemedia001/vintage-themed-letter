// Enhanced Vintage Letter Script
const letterClosed = document.getElementById('letterClosed');
const letterOpened = document.getElementById('letterOpened');
const waxSeal = document.getElementById('waxSeal');
const closeLetter = document.getElementById('closeLetter');
const handwritingToggle = document.getElementById('handwritingToggle');
const letterPaperOpened = document.querySelector('.letter-paper-opened');
const customizeInitial = document.getElementById('customizeInitial');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const initialOptions = document.querySelectorAll('.initial-option');

// Handwriting toggle functionality
let isHandwritingMode = false;

// Sound effects (using Web Audio API for better control)
let audioContext;
let waxBreakSound;
let paperTearSound;

// Initialize audio context
function initAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
        console.log('Web Audio API not supported');
    }
}

// Create wax breaking sound effect
function createWaxBreakSound() {
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.3);
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
}

// Create paper tear sound effect
function createPaperTearSound() {
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();
    
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.2);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, audioContext.currentTime);
    filter.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
}

// Create scent animation
function createScentAnimation() {
    const scentWisp = document.createElement('div');
    scentWisp.className = 'scent-wisp';
    scentWisp.style.position = 'absolute';
    scentWisp.style.top = '50%';
    scentWisp.style.left = '50%';
    scentWisp.style.width = '4px';
    scentWisp.style.height = '4px';
    scentWisp.style.background = 'radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 70%)';
    scentWisp.style.borderRadius = '50%';
    scentWisp.style.opacity = '0';
    scentWisp.style.pointerEvents = 'none';
    scentWisp.style.zIndex = '1';
    
    waxSeal.appendChild(scentWisp);
    
    // Animate the scent wisp
    setTimeout(() => {
        scentWisp.style.transition = 'all 3s ease-out';
        scentWisp.style.opacity = '1';
        scentWisp.style.transform = 'translate(-50%, -200px) scale(0.3)';
        
        setTimeout(() => {
            scentWisp.remove();
        }, 3000);
    }, 100);
}

// Update seal initial
function updateSealInitial(initial) {
    const sealInitial = waxSeal.querySelector('.seal-initial');
    sealInitial.textContent = initial;
    waxSeal.setAttribute('data-initial', initial);
    
    // Update the closing seal as well
    const sealTextClosing = document.querySelector('.seal-text-closing');
    if (sealTextClosing) {
        sealTextClosing.textContent = initial;
    }
}

// Show customize modal
function showCustomizeModal() {
    modalOverlay.classList.add('show');
    
    // Highlight current initial
    const currentInitial = waxSeal.getAttribute('data-initial');
    initialOptions.forEach(option => {
        option.classList.remove('selected');
        if (option.getAttribute('data-initial') === currentInitial) {
            option.classList.add('selected');
        }
    });
}

// Hide customize modal
function hideCustomizeModal() {
    modalOverlay.classList.remove('show');
}

function toggleHandwriting() {
    isHandwritingMode = !isHandwritingMode;
    
    if (isHandwritingMode) {
        letterPaperOpened.classList.add('handwriting-mode');
        handwritingToggle.querySelector('.handwriting-icon').textContent = '📝';
        handwritingToggle.querySelector('.handwriting-text').textContent = 'Print';
    } else {
        letterPaperOpened.classList.remove('handwriting-mode');
        handwritingToggle.querySelector('.handwriting-icon').textContent = '✒️';
        handwritingToggle.querySelector('.handwriting-text').textContent = 'Handwriting';
    }
}

// Enhanced open letter function with sound and effects
function openLetter() {
    // Play wax breaking sound
    createWaxBreakSound();
    
    // Create scent animation
    createScentAnimation();
    
    // Add class to body for scrolling and layout changes
    document.body.classList.add('letter-open');
    
    letterClosed.style.opacity = '0';
    letterClosed.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        letterClosed.style.display = 'none';
        letterOpened.style.display = 'block';
        
        letterOpened.style.opacity = '0';
        letterOpened.style.transform = 'scale(0.95)';
        
        requestAnimationFrame(() => {
            letterOpened.style.transition = 'all 0.8s ease-in-out';
            letterOpened.style.opacity = '1';
            letterOpened.style.transform = 'scale(1)';
        });
        
        // Scroll to top when letter opens
        window.scrollTo(0, 0);
    }, 400);
}

// Enhanced close letter function with sound
function closeLetterFn() {
    // Play paper tear sound
    createPaperTearSound();
    
    // Remove body class to restore original layout
    document.body.classList.remove('letter-open');
    
    letterOpened.style.opacity = '0';
    letterOpened.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        letterOpened.style.display = 'none';
        letterClosed.style.display = 'block';
        
        letterClosed.style.opacity = '0';
        letterClosed.style.transform = 'scale(0.95)';
        
        requestAnimationFrame(() => {
            letterClosed.style.transition = 'all 0.8s ease-in-out';
            letterClosed.style.opacity = '1';
            letterClosed.style.transform = 'scale(1)';
        });
    }, 400);
}

// Enhanced wax seal interactions
waxSeal.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    // Add breaking animation
    this.style.animation = 'sealPulse 0.3s ease-in-out';
    setTimeout(() => {
        this.style.animation = 'sealBreathing 4s ease-in-out infinite';
    }, 300);
    
    openLetter();
});

letterClosed.addEventListener('click', function(e) {
    if (e.target === waxSeal || waxSeal.contains(e.target)) {
        return; // Let wax seal handle its own click
    }
    openLetter();
});

closeLetter.addEventListener('click', function() {
    closeLetterFn();
});

// Handwriting control
handwritingToggle.addEventListener('click', function() {
    toggleHandwriting();
});

// Customize initial functionality
customizeInitial.addEventListener('click', function() {
    showCustomizeModal();
});

modalClose.addEventListener('click', function() {
    hideCustomizeModal();
});

// Initial option selection
initialOptions.forEach(option => {
    option.addEventListener('click', function() {
        const initial = this.getAttribute('data-initial');
        updateSealInitial(initial);
        
        // Update selected state
        initialOptions.forEach(opt => opt.classList.remove('selected'));
        this.classList.add('selected');
        
        // Hide modal after selection
        setTimeout(() => {
            hideCustomizeModal();
        }, 500);
    });
});

// Close modal when clicking outside
modalOverlay.addEventListener('click', function(e) {
    if (e.target === modalOverlay) {
        hideCustomizeModal();
    }
});

// Enhanced hover effects for wax seal
waxSeal.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.08) rotate(2deg)';
    this.style.filter = 'brightness(1.2) drop-shadow(0 10px 20px rgba(0, 0, 0, 0.5))';
});

waxSeal.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1) rotate(0deg)';
    this.style.filter = 'brightness(1) drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3))';
});

// Add periodic scent animation
setInterval(() => {
    if (letterClosed.style.display !== 'none') {
        createScentAnimation();
    }
}, 8000); // Every 8 seconds

// Keyboard support for accessibility
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (letterClosed.style.display !== 'none') {
            // Open letter if it's closed
            openLetter();
        } else {
            // Close letter if it's open
            closeLetterFn();
        }
    }
    
    if (e.key === 'Escape') {
        if (modalOverlay.classList.contains('show')) {
            // Close modal with Escape key
            hideCustomizeModal();
        } else if (letterOpened.style.display !== 'none') {
            // Close letter with Escape key
            closeLetterFn();
        }
    }
    
    // Handwriting toggle with 'H' key
    if (e.key.toLowerCase() === 'h' && letterOpened.style.display !== 'none') {
        toggleHandwriting();
    }
    
    // Customize initial with 'C' key
    if (e.key.toLowerCase() === 'c' && letterOpened.style.display !== 'none') {
        showCustomizeModal();
    }
});

// Add focus management for accessibility
waxSeal.setAttribute('tabindex', '0');
waxSeal.setAttribute('role', 'button');
waxSeal.setAttribute('aria-label', 'Click to open the vintage letter');

closeLetter.setAttribute('tabindex', '0');
handwritingToggle.setAttribute('tabindex', '0');
customizeInitial.setAttribute('tabindex', '0');

// Focus styles for accessibility
waxSeal.addEventListener('focus', function() {
    this.style.outline = '3px solid #D4AF37';
    this.style.outlineOffset = '3px';
    this.style.transform = 'scale(1.05)';
});

waxSeal.addEventListener('blur', function() {
    this.style.outline = 'none';
    this.style.transform = 'scale(1)';
});

// Initialize audio on user interaction
document.addEventListener('click', function() {
    if (!audioContext) {
        initAudio();
    }
}, { once: true });

// Smooth entrance animation on page load
window.addEventListener('load', function() {
    letterClosed.style.opacity = '0';
    letterClosed.style.transform = 'scale(0.8) translateY(50px)';
    
    setTimeout(() => {
        letterClosed.style.transition = 'all 1.2s ease-out';
        letterClosed.style.opacity = '1';
        letterClosed.style.transform = 'scale(1) translateY(0)';
    }, 200);
});
