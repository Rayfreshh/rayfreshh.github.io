/**
 * Lazy Loader - Progressive loading of images and resources
 */

const LazyLoader = {
    initialized: false,
    observer: null,
    imageQueue: [],
    moduleQueue: [],
    
    // Initialize lazy loading
    init() {
        if (this.initialized) return;
        
        console.log('🔄 Initializing Lazy Loader...');
        
        this.setupIntersectionObserver();
        this.setupImageLazyLoading();
        this.setupModuleLazyLoading();
        this.setupProgressiveEnhancement();
        
        this.initialized = true;
    },
    
    // Setup Intersection Observer for lazy loading
    setupIntersectionObserver() {
        if (!window.IntersectionObserver) {
            console.warn('IntersectionObserver not supported, falling back to immediate loading');
            this.loadAllImages();
            return;
        }
        
        const options = {
            root: null,
            rootMargin: '50px 0px', // Start loading 50px before element enters viewport
            threshold: 0.1
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadElement(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, options);
    },
    
    // Setup image lazy loading
    setupImageLazyLoading() {
        // Find all images that should be lazy loaded
        const lazyImages = document.querySelectorAll('img[data-src], [data-bg]');
        
        lazyImages.forEach(img => {
            this.observer.observe(img);
        });
        
        // Convert profile image to lazy loading
        this.convertProfileImageToLazy();
    },
    
    // Convert profile image to use lazy loading
    convertProfileImageToLazy() {
        const profileImage = document.querySelector('.profile-image');
        if (profileImage) {
            // Create placeholder
            const placeholder = this.createImagePlaceholder();
            profileImage.style.background = `${placeholder}, url('../assets/IMG_0930.jpeg')`;
            profileImage.style.backgroundSize = 'cover, cover';
            profileImage.style.backgroundPosition = 'center, center 20%';
            
            // Set up lazy loading
            profileImage.setAttribute('data-bg', 'assets/IMG_0930.jpeg');
            this.observer.observe(profileImage);
        }
    },
    
    // Create image placeholder
    createImagePlaceholder() {
        return `linear-gradient(45deg, 
            rgba(244, 208, 63, 0.1) 25%, 
            transparent 25%, 
            transparent 75%, 
            rgba(244, 208, 63, 0.1) 75%),
            linear-gradient(45deg, 
            rgba(244, 208, 63, 0.1) 25%, 
            transparent 25%, 
            transparent 75%, 
            rgba(244, 208, 63, 0.1) 75%)`;
    },
    
    // Load element when it enters viewport
    loadElement(element) {
        if (element.hasAttribute('data-src')) {
            this.loadImage(element);
        } else if (element.hasAttribute('data-bg')) {
            this.loadBackgroundImage(element);
        } else if (element.hasAttribute('data-module')) {
            this.loadModule(element);
        }
    },
    
    // Load lazy image
    loadImage(img) {
        return new Promise((resolve, reject) => {
            const tempImage = new Image();
            
            tempImage.onload = () => {
                img.src = tempImage.src;
                img.classList.add('loaded');
                img.removeAttribute('data-src');
                resolve(img);
            };
            
            tempImage.onerror = () => {
                img.classList.add('error');
                reject(new Error(`Failed to load image: ${img.dataset.src}`));
            };
            
            tempImage.src = img.dataset.src;
        });
    },
    
    // Load lazy background image
    loadBackgroundImage(element) {
        return new Promise((resolve, reject) => {
            const tempImage = new Image();
            
            tempImage.onload = () => {
                element.style.backgroundImage = `url('${tempImage.src}')`;
                element.classList.add('loaded');
                element.removeAttribute('data-bg');
                resolve(element);
            };
            
            tempImage.onerror = () => {
                element.classList.add('error');
                reject(new Error(`Failed to load background image: ${element.dataset.bg}`));
            };
            
            tempImage.src = element.dataset.bg;
        });
    },
    
    // Setup module lazy loading
    setupModuleLazyLoading() {
        // Define modules that can be loaded on demand
        const lazyModules = [
            {
                trigger: '.education-row',
                module: 'education',
                script: 'js/education.js'
            },
            {
                trigger: '.skill-control',
                module: 'skills', 
                script: 'js/skills.js'
            },
            {
                trigger: '.social-link',
                module: 'tooltips',
                script: 'js/tooltips.js'
            }
        ];
        
        lazyModules.forEach(config => {
            const triggers = document.querySelectorAll(config.trigger);
            if (triggers.length > 0) {
                // Observe first element of each type
                const element = triggers[0];
                element.setAttribute('data-module', config.module);
                element.setAttribute('data-script', config.script);
                this.observer.observe(element);
            }
        });
    },
    
    // Load JavaScript module
    loadModule(element) {
        const moduleName = element.dataset.module;
        const scriptPath = element.dataset.script;
        
        if (this.moduleQueue.includes(moduleName)) {
            return; // Already loading or loaded
        }
        
        this.moduleQueue.push(moduleName);
        
        return this.loadScript(scriptPath)
            .then(() => {
                console.log(`✅ Module loaded: ${moduleName}`);
                element.classList.add('module-loaded');
            })
            .catch(error => {
                console.error(`❌ Failed to load module ${moduleName}:`, error);
            });
    },
    
    // Load script dynamically
    loadScript(src) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) {
                resolve(); // Script already loaded
                return;
            }
            
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            
            script.onload = resolve;
            script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
            
            document.head.appendChild(script);
        });
    },
    
    // Setup progressive enhancement
    setupProgressiveEnhancement() {
        // Enhance functionality progressively
        this.enhanceFormElements();
        this.enhanceNavigationElements();
        this.enhanceInteractiveElements();
    },
    
    // Enhance form elements
    enhanceFormElements() {
        const inputs = document.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // Add enhanced validation
            input.addEventListener('invalid', this.handleInvalidInput);
            
            // Add better focus management
            input.addEventListener('focus', this.handleInputFocus);
            input.addEventListener('blur', this.handleInputBlur);
        });
    },
    
    // Handle invalid input
    handleInvalidInput(event) {
        const input = event.target;
        
        // Create custom validation message
        const message = input.validationMessage;
        if (message) {
            const tooltip = document.createElement('div');
            tooltip.className = 'validation-tooltip';
            tooltip.textContent = message;
            
            input.parentNode.appendChild(tooltip);
            
            setTimeout(() => {
                if (tooltip.parentNode) {
                    tooltip.parentNode.removeChild(tooltip);
                }
            }, 3000);
        }
    },
    
    // Handle input focus
    handleInputFocus(event) {
        event.target.classList.add('focused');
    },
    
    // Handle input blur
    handleInputBlur(event) {
        event.target.classList.remove('focused');
    },
    
    // Enhance navigation elements
    enhanceNavigationElements() {
        const navLinks = document.querySelectorAll('a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const target = document.getElementById(targetId);
                
                if (target) {
                    this.smoothScrollTo(target);
                }
            });
        });
    },
    
    // Smooth scroll to element
    smoothScrollTo(element) {
        const start = window.pageYOffset;
        const target = element.offsetTop - 20; // 20px offset
        const distance = target - start;
        const duration = 800;
        
        let startTime = null;
        
        const animateScroll = (timestamp) => {
            if (!startTime) startTime = timestamp;
            
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const ease = this.easeInOutCubic(progress);
            
            window.scrollTo(0, start + (distance * ease));
            
            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            }
        };
        
        requestAnimationFrame(animateScroll);
    },
    
    // Easing function
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    },
    
    // Enhance interactive elements
    enhanceInteractiveElements() {
        // Add keyboard navigation support
        const interactiveElements = document.querySelectorAll(
            '.skill-control, .language-control, .education-row, [onclick]'
        );
        
        interactiveElements.forEach(element => {
            if (!element.hasAttribute('tabindex')) {
                element.setAttribute('tabindex', '0');
            }
            
            element.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    element.click();
                }
            });
        });
    },
    
    // Load all images immediately (fallback)
    loadAllImages() {
        const lazyImages = document.querySelectorAll('img[data-src], [data-bg]');
        
        lazyImages.forEach(element => {
            this.loadElement(element);
        });
    },
    
    // Preload critical resources
    preloadCriticalResources() {
        const criticalResources = [
            { url: 'css/main.css', as: 'style' },
            { url: 'js/main.js', as: 'script' },
            { url: 'assets/IMG_0930.jpeg', as: 'image' }
        ];
        
        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.url;
            link.as = resource.as;
            
            if (resource.as === 'style') {
                link.onload = () => {
                    link.rel = 'stylesheet';
                };
            }
            
            document.head.appendChild(link);
        });
    },
    
    // Check if resource should be lazy loaded
    shouldLazyLoad(element) {
        // Don't lazy load critical above-the-fold content
        const rect = element.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        return rect.top > viewportHeight;
    },
    
    // Get loading priority for resource
    getLoadingPriority(element) {
        if (element.closest('.profile-section')) return 'high';
        if (element.closest('.education-section')) return 'medium';
        return 'low';
    },
    
    // Progressive JPEG loading
    loadProgressiveImage(img) {
        const lowQualitySrc = img.dataset.srcLow;
        const highQualitySrc = img.dataset.src;
        
        if (lowQualitySrc) {
            // Load low quality first
            const tempImage = new Image();
            tempImage.onload = () => {
                img.src = tempImage.src;
                img.classList.add('low-quality');
                
                // Then load high quality
                this.loadImage(img);
            };
            tempImage.src = lowQualitySrc;
        } else {
            this.loadImage(img);
        }
    },
    
    // Cleanup method
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
        
        this.imageQueue = [];
        this.moduleQueue = [];
        this.initialized = false;
    }
};

// Auto-initialize
if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => LazyLoader.init());
    } else {
        LazyLoader.init();
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LazyLoader;
}

// Make available globally
window.LazyLoader = LazyLoader;