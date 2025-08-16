/**
 * Mobile Manager - Handles mobile-specific functionality and optimizations
 */

const MobileManager = {
    initialized: false,
    touchStartTime: 0,
    touchStartPosition: { x: 0, y: 0 },
    
    // Initialize mobile functionality
    init() {
        if (this.initialized) return;
        
        console.log('📱 Initializing Mobile Manager...');
        
        this.setupTouchEvents();
        this.setupMobileOptimizations();
        this.setupMobileNavigation();
        this.setupMobileGestures();
        
        this.initialized = true;
    },
    
    // Setup touch events for better mobile interaction
    setupTouchEvents() {
        // Prevent default touch behaviors that might interfere
        const interactiveElements = document.querySelectorAll(
            '.skill-control, .language-control, .education-row, .social-link, .arrow'
        );
        
        interactiveElements.forEach(element => {
            // Handle touch start
            element.addEventListener('touchstart', (e) => {
                this.touchStartTime = Date.now();
                this.touchStartPosition = {
                    x: e.touches[0].clientX,
                    y: e.touches[0].clientY
                };
                
                // Add visual feedback
                element.classList.add('touch-active');
            }, { passive: true });
            
            // Handle touch end
            element.addEventListener('touchend', (e) => {
                const touchEndTime = Date.now();
                const touchDuration = touchEndTime - this.touchStartTime;
                
                // Remove visual feedback
                element.classList.remove('touch-active');
                
                // Only trigger click if it was a quick tap (not a scroll)
                if (touchDuration < 500) {
                    const touchEndPosition = {
                        x: e.changedTouches[0].clientX,
                        y: e.changedTouches[0].clientY
                    };
                    
                    const distance = Math.sqrt(
                        Math.pow(touchEndPosition.x - this.touchStartPosition.x, 2) +
                        Math.pow(touchEndPosition.y - this.touchStartPosition.y, 2)
                    );
                    
                    // If finger didn't move much, treat as tap
                    if (distance < 10) {
                        e.preventDefault();
                        // Trigger click event programmatically
                        element.click();
                    }
                }
            }, { passive: false });
            
            // Handle touch cancel
            element.addEventListener('touchcancel', () => {
                element.classList.remove('touch-active');
            });
        });
    },
    
    // Setup mobile-specific optimizations
    setupMobileOptimizations() {
        // Disable zoom on form inputs to prevent viewport jumping
        const metaViewport = document.querySelector('meta[name="viewport"]');
        if (metaViewport) {
            metaViewport.setAttribute('content', 
                'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
            );
        }
        
        // Optimize scroll performance
        this.setupScrollOptimization();
        
        // Handle orientation changes
        this.setupOrientationHandling();
        
        // Setup mobile-specific CSS classes
        document.body.classList.add('mobile-device');
        
        // Prevent text selection on interactive elements
        this.preventTextSelection();
    },
    
    // Setup mobile navigation optimizations
    setupMobileNavigation() {
        // Make navigation items more touch-friendly
        const navItems = document.querySelectorAll('.nav-item, .social-link');
        
        navItems.forEach(item => {
            // Increase touch target size
            item.style.minHeight = '44px';
            item.style.minWidth = '44px';
            
            // Add touch feedback
            item.addEventListener('touchstart', () => {
                item.style.opacity = '0.7';
            }, { passive: true });
            
            item.addEventListener('touchend', () => {
                item.style.opacity = '1';
            }, { passive: true });
        });
    },
    
    // Setup mobile gesture handling
    setupMobileGestures() {
        let startY = 0;
        let currentY = 0;
        let isScrolling = false;
        
        // Handle pull-to-refresh prevention on certain elements
        const preventPullRefresh = document.querySelectorAll('.overlay, .modal');
        
        preventPullRefresh.forEach(element => {
            element.addEventListener('touchstart', (e) => {
                startY = e.touches[0].pageY;
                isScrolling = false;
            }, { passive: true });
            
            element.addEventListener('touchmove', (e) => {
                currentY = e.touches[0].pageY;
                
                // Prevent pull-to-refresh if scrolling down from top
                if (element.scrollTop === 0 && currentY > startY) {
                    e.preventDefault();
                }
            }, { passive: false });
        });
    },
    
    // Setup scroll optimization for mobile
    setupScrollOptimization() {
        // Use passive listeners for better scroll performance
        let isScrolling = false;
        
        window.addEventListener('scroll', () => {
            if (!isScrolling) {
                window.requestAnimationFrame(() => {
                    // Scroll-based optimizations
                    this.handleMobileScroll();
                    isScrolling = false;
                });
                isScrolling = true;
            }
        }, { passive: true });
    },
    
    // Handle mobile scroll events
    handleMobileScroll() {
        // Hide/show elements based on scroll direction
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add scroll-based classes for styling
        if (scrollTop > 100) {
            document.body.classList.add('scrolled');
        } else {
            document.body.classList.remove('scrolled');
        }
    },
    
    // Handle device orientation changes
    setupOrientationHandling() {
        window.addEventListener('orientationchange', () => {
            // Add a small delay to allow for orientation change to complete
            setTimeout(() => {
                // Trigger resize event to recalculate layouts
                window.dispatchEvent(new Event('resize'));
                
                // Update mobile state
                this.updateMobileState();
                
                // Refresh any open overlays
                this.refreshOverlaysForOrientation();
            }, 100);
        });
    },
    
    // Update mobile state after orientation change
    updateMobileState() {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            document.body.classList.add('mobile-device');
            document.body.classList.remove('desktop-device');
        } else {
            document.body.classList.add('desktop-device');
            document.body.classList.remove('mobile-device');
        }
    },
    
    // Refresh overlays after orientation change
    refreshOverlaysForOrientation() {
        const overlays = document.querySelectorAll('.overlay.show, .modal.show');
        
        overlays.forEach(overlay => {
            // Recalculate positions
            overlay.style.transform = '';
            overlay.offsetHeight; // Force reflow
            overlay.style.transform = 'translate(-50%, -50%)';
        });
    },
    
    // Prevent text selection on interactive elements
    preventTextSelection() {
        const noSelectElements = document.querySelectorAll(
            '.skill-control, .language-control, .arrow, .education-row'
        );
        
        noSelectElements.forEach(element => {
            element.style.userSelect = 'none';
            element.style.webkitUserSelect = 'none';
            element.style.mozUserSelect = 'none';
            element.style.msUserSelect = 'none';
        });
    },
    
    // Check if device is in landscape mode
    isLandscape() {
        return window.innerWidth > window.innerHeight;
    },
    
    // Check if device is in portrait mode
    isPortrait() {
        return window.innerHeight > window.innerWidth;
    },
    
    // Get device pixel ratio
    getDevicePixelRatio() {
        return window.devicePixelRatio || 1;
    },
    
    // Check if device supports touch
    supportsTouch() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },
    
    // Check if device is iOS
    isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent);
    },
    
    // Check if device is Android
    isAndroid() {
        return /Android/.test(navigator.userAgent);
    },
    
    // Setup iOS-specific optimizations
    setupIOSOptimizations() {
        if (!this.isIOS()) return;
        
        // Handle iOS viewport height issues
        const setIOSViewportHeight = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        
        setIOSViewportHeight();
        window.addEventListener('resize', setIOSViewportHeight);
        
        // Prevent iOS bounce scroll on body
        document.body.addEventListener('touchmove', (e) => {
            if (e.target === document.body) {
                e.preventDefault();
            }
        }, { passive: false });
    },
    
    // Setup Android-specific optimizations
    setupAndroidOptimizations() {
        if (!this.isAndroid()) return;
        
        // Handle Android keyboard behavior
        let initialViewportHeight = window.innerHeight;
        
        window.addEventListener('resize', () => {
            const currentViewportHeight = window.innerHeight;
            const heightDifference = initialViewportHeight - currentViewportHeight;
            
            // If height decreased significantly, keyboard is likely open
            if (heightDifference > 150) {
                document.body.classList.add('keyboard-open');
            } else {
                document.body.classList.remove('keyboard-open');
            }
        });
    },
    
    // Add haptic feedback for supported devices
    hapticFeedback(type = 'light') {
        if (navigator.vibrate) {
            switch (type) {
                case 'light':
                    navigator.vibrate(10);
                    break;
                case 'medium':
                    navigator.vibrate(20);
                    break;
                case 'heavy':
                    navigator.vibrate(50);
                    break;
                default:
                    navigator.vibrate(10);
            }
        }
    },
    
    // Get mobile device info
    getDeviceInfo() {
        return {
            isMobile: window.innerWidth <= 768,
            isTouch: this.supportsTouch(),
            isIOS: this.isIOS(),
            isAndroid: this.isAndroid(),
            isLandscape: this.isLandscape(),
            isPortrait: this.isPortrait(),
            pixelRatio: this.getDevicePixelRatio(),
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight
        };
    },
    
    // Cleanup method
    destroy() {
        document.body.classList.remove('mobile-device', 'desktop-device', 'scrolled', 'keyboard-open');
        this.initialized = false;
    }
};

// Initialize mobile optimizations based on platform
if (typeof window !== 'undefined') {
    // Setup platform-specific optimizations
    if (MobileManager.isIOS()) {
        MobileManager.setupIOSOptimizations();
    } else if (MobileManager.isAndroid()) {
        MobileManager.setupAndroidOptimizations();
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MobileManager;
}

// Make available globally
window.MobileManager = MobileManager;