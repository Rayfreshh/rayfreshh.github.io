/**
 * Main Application Entry Point
 * Initializes all modules and handles global functionality
 */

// Import modules (when using ES6 modules)
// import { SkillsManager } from './skills.js';
// import { EducationManager } from './education.js';
// import { TooltipManager } from './tooltips.js';
// import { MobileManager } from './mobile.js';

// Global application state
const App = {
    initialized: false,
    isMobile: false,
    
    // Initialize the application
    init() {
        if (this.initialized) return;
        
        console.log('🚀 Initializing Etiosa Raymond Portfolio...');
        
        // Detect mobile device
        this.isMobile = this.detectMobile();
        
        // Initialize modules
        this.initializeModules();
        
        // Setup global event listeners
        this.setupGlobalEvents();
        
        // Mark as initialized
        this.initialized = true;
        
        console.log('✅ Portfolio initialized successfully');
    },
    
    // Detect if device is mobile
    detectMobile() {
        return window.innerWidth <= 768;
    },
    
    // Initialize all application modules
    initializeModules() {
        try {
            // Initialize skills module
            if (typeof SkillsManager !== 'undefined') {
                SkillsManager.init();
            }
            
            // Initialize education module
            if (typeof EducationManager !== 'undefined') {
                EducationManager.init();
            }
            
            // Initialize tooltip module
            if (typeof TooltipManager !== 'undefined') {
                TooltipManager.init();
            }
            
            // Initialize mobile module if on mobile
            if (this.isMobile && typeof MobileManager !== 'undefined') {
                MobileManager.init();
            }
            
        } catch (error) {
            console.error('❌ Error initializing modules:', error);
        }
    },
    
    // Setup global event listeners
    setupGlobalEvents() {
        // Handle window resize
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Handle escape key for closing overlays
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        
        // Handle clicks outside overlays
        document.addEventListener('click', this.handleGlobalClick.bind(this));
        
        // Prevent default touch behaviors on interactive elements
        this.setupTouchOptimization();
        
        // Setup scroll performance optimization
        this.setupScrollOptimization();
    },
    
    // Handle window resize events
    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = this.detectMobile();
        
        // If mobile state changed, reinitialize modules
        if (wasMobile !== this.isMobile) {
            console.log(`📱 Device type changed: ${this.isMobile ? 'Mobile' : 'Desktop'}`);
            this.reinitializeModules();
        }
    },
    
    // Handle global keydown events
    handleKeyDown(event) {
        if (event.key === 'Escape') {
            // Close any open overlays
            this.closeAllOverlays();
        }
    },
    
    // Handle global click events
    handleGlobalClick(event) {
        // Handle clicks outside overlays to close them
        if (event.target.classList.contains('overlay-backdrop')) {
            this.closeAllOverlays();
        }
    },
    
    // Close all open overlays
    closeAllOverlays() {
        // Close education overlay
        if (typeof EducationManager !== 'undefined') {
            EducationManager.closeOverlays();
        }
        
        // Close any other overlays
        const overlays = document.querySelectorAll('.overlay, .modal');
        overlays.forEach(overlay => {
            overlay.classList.remove('show', 'active');
        });
    },
    
    // Setup touch optimization
    setupTouchOptimization() {
        const interactiveElements = document.querySelectorAll(
            '.skill-control, .language-control, .arrow, .social-link, .education-row'
        );
        
        interactiveElements.forEach(element => {
            element.addEventListener('touchstart', function(e) {
                e.preventDefault();
            }, {passive: false});
            
            element.addEventListener('touchend', function(e) {
                e.preventDefault();
                element.click();
            }, {passive: false});
        });
    },
    
    // Setup scroll performance optimization
    setupScrollOptimization() {
        let ticking = false;
        
        function updateScrollPosition() {
            // Scroll-based animations or updates can go here
            ticking = false;
        }
        
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateScrollPosition);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestTick, {passive: true});
    },
    
    // Reinitialize modules when device type changes
    reinitializeModules() {
        console.log('🔄 Reinitializing modules for device change...');
        
        // Destroy current instances if they have cleanup methods
        if (typeof SkillsManager !== 'undefined' && SkillsManager.destroy) {
            SkillsManager.destroy();
        }
        
        if (typeof EducationManager !== 'undefined' && EducationManager.destroy) {
            EducationManager.destroy();
        }
        
        // Reinitialize
        this.initializeModules();
    },
    
    // Utility functions
    utils: {
        // Debounce function for performance
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
        
        // Throttle function for performance
        throttle(func, limit) {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },
        
        // Check if element is in viewport
        isInViewport(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        },
        
        // Animate element
        animate(element, animation, duration = 300) {
            return new Promise((resolve) => {
                element.style.animationDuration = `${duration}ms`;
                element.classList.add(animation);
                
                element.addEventListener('animationend', () => {
                    element.classList.remove(animation);
                    resolve();
                }, { once: true });
            });
        }
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}

// Make App globally available
window.Portfolio = App;