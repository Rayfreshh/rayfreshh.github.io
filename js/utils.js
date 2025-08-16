/**
 * Utility Functions - Common helper functions and utilities
 */

const Utils = {
    // Performance utilities
    performance: {
        // Debounce function for performance optimization
        debounce(func, wait, immediate = false) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    timeout = null;
                    if (!immediate) func(...args);
                };
                const callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func(...args);
            };
        },
        
        // Throttle function for performance optimization
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
        
        // Request animation frame with fallback
        requestAnimFrame: (function() {
            return window.requestAnimationFrame ||
                   window.webkitRequestAnimationFrame ||
                   window.mozRequestAnimationFrame ||
                   function(callback) {
                       window.setTimeout(callback, 1000 / 60);
                   };
        })(),
        
        // Measure performance of a function
        measureTime(func, label = 'Function') {
            const start = performance.now();
            const result = func();
            const end = performance.now();
            console.log(`${label} took ${end - start} milliseconds`);
            return result;
        }
    },
    
    // DOM utilities
    dom: {
        // Check if element is in viewport
        isInViewport(element, threshold = 0) {
            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            const windowWidth = window.innerWidth || document.documentElement.clientWidth;
            
            return (
                rect.top >= -threshold &&
                rect.left >= -threshold &&
                rect.bottom <= windowHeight + threshold &&
                rect.right <= windowWidth + threshold
            );
        },
        
        // Get element's offset from top of page
        getOffsetTop(element) {
            let offsetTop = 0;
            while (element) {
                offsetTop += element.offsetTop;
                element = element.offsetParent;
            }
            return offsetTop;
        },
        
        // Smooth scroll to element
        scrollToElement(element, offset = 0, duration = 500) {
            const targetPosition = this.getOffsetTop(element) - offset;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            let startTime = null;
            
            function animation(currentTime) {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const run = Utils.animation.easeInOutQuad(timeElapsed, startPosition, distance, duration);
                window.scrollTo(0, run);
                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                }
            }
            
            requestAnimationFrame(animation);
        },
        
        // Create element with attributes
        createElement(tag, attributes = {}, children = []) {
            const element = document.createElement(tag);
            
            Object.keys(attributes).forEach(key => {
                if (key === 'className') {
                    element.className = attributes[key];
                } else if (key === 'innerHTML') {
                    element.innerHTML = attributes[key];
                } else {
                    element.setAttribute(key, attributes[key]);
                }
            });
            
            children.forEach(child => {
                if (typeof child === 'string') {
                    element.appendChild(document.createTextNode(child));
                } else {
                    element.appendChild(child);
                }
            });
            
            return element;
        },
        
        // Find closest parent with class
        findClosestParent(element, className) {
            while (element && !element.classList.contains(className)) {
                element = element.parentElement;
            }
            return element;
        }
    },
    
    // Animation utilities
    animation: {
        // Easing functions
        easeInOutQuad(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        },
        
        easeOutCubic(t, b, c, d) {
            t /= d;
            t--;
            return c * (t * t * t + 1) + b;
        },
        
        easeInOutCubic(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t * t + b;
            t -= 2;
            return c / 2 * (t * t * t + 2) + b;
        },
        
        // Animate element with promise
        animate(element, properties, duration = 300, easing = 'ease-out') {
            return new Promise((resolve) => {
                const startValues = {};
                const endValues = {};
                
                // Get initial values
                Object.keys(properties).forEach(prop => {
                    startValues[prop] = parseFloat(getComputedStyle(element)[prop]) || 0;
                    endValues[prop] = properties[prop];
                });
                
                const startTime = performance.now();
                
                function updateAnimation(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    Object.keys(properties).forEach(prop => {
                        const start = startValues[prop];
                        const end = endValues[prop];
                        const current = start + (end - start) * progress;
                        
                        if (prop === 'opacity') {
                            element.style[prop] = current;
                        } else {
                            element.style[prop] = current + 'px';
                        }
                    });
                    
                    if (progress < 1) {
                        requestAnimationFrame(updateAnimation);
                    } else {
                        resolve();
                    }
                }
                
                requestAnimationFrame(updateAnimation);
            });
        }
    },
    
    // String utilities
    string: {
        // Capitalize first letter
        capitalize(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        },
        
        // Convert to kebab-case
        kebabCase(str) {
            return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
        },
        
        // Convert to camelCase
        camelCase(str) {
            return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        },
        
        // Truncate string with ellipsis
        truncate(str, length, suffix = '...') {
            if (str.length <= length) return str;
            return str.substring(0, length - suffix.length) + suffix;
        },
        
        // Generate random string
        random(length = 8, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') {
            let result = '';
            for (let i = 0; i < length; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        }
    },
    
    // Number utilities
    number: {
        // Clamp number between min and max
        clamp(num, min, max) {
            return Math.min(Math.max(num, min), max);
        },
        
        // Linear interpolation
        lerp(start, end, t) {
            return start * (1 - t) + end * t;
        },
        
        // Map number from one range to another
        map(value, start1, stop1, start2, stop2) {
            return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
        },
        
        // Round to specified decimal places
        round(num, decimals = 0) {
            return Number(Math.round(num + 'e' + decimals) + 'e-' + decimals);
        },
        
        // Format number with commas
        format(num) {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
    },
    
    // Array utilities
    array: {
        // Shuffle array
        shuffle(array) {
            const shuffled = [...array];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        },
        
        // Get unique values from array
        unique(array) {
            return [...new Set(array)];
        },
        
        // Group array by property
        groupBy(array, property) {
            return array.reduce((groups, item) => {
                const value = item[property];
                if (!groups[value]) {
                    groups[value] = [];
                }
                groups[value].push(item);
                return groups;
            }, {});
        },
        
        // Chunk array into smaller arrays
        chunk(array, size) {
            const chunks = [];
            for (let i = 0; i < array.length; i += size) {
                chunks.push(array.slice(i, i + size));
            }
            return chunks;
        }
    },
    
    // Date utilities
    date: {
        // Format date
        format(date, format = 'YYYY-MM-DD') {
            const d = new Date(date);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            
            return format
                .replace('YYYY', year)
                .replace('MM', month)
                .replace('DD', day);
        },
        
        // Get relative time
        relative(date) {
            const now = new Date();
            const diff = now - new Date(date);
            const seconds = Math.floor(diff / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);
            
            if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
            if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
            if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
            return 'Just now';
        }
    },
    
    // Storage utilities
    storage: {
        // Local storage with JSON support
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.warn('Failed to save to localStorage:', e);
                return false;
            }
        },
        
        get(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (e) {
                console.warn('Failed to read from localStorage:', e);
                return defaultValue;
            }
        },
        
        remove(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (e) {
                console.warn('Failed to remove from localStorage:', e);
                return false;
            }
        },
        
        clear() {
            try {
                localStorage.clear();
                return true;
            } catch (e) {
                console.warn('Failed to clear localStorage:', e);
                return false;
            }
        }
    },
    
    // Event utilities
    events: {
        // Create custom event
        create(name, detail = null) {
            return new CustomEvent(name, { detail });
        },
        
        // Dispatch custom event
        dispatch(element, name, detail = null) {
            const event = this.create(name, detail);
            element.dispatchEvent(event);
        },
        
        // Add event listener with cleanup
        on(element, event, handler, options = {}) {
            element.addEventListener(event, handler, options);
            
            // Return cleanup function
            return () => {
                element.removeEventListener(event, handler, options);
            };
        }
    },
    
    // Device detection utilities
    device: {
        isMobile() {
            return window.innerWidth <= 768;
        },
        
        isTablet() {
            return window.innerWidth > 768 && window.innerWidth <= 1024;
        },
        
        isDesktop() {
            return window.innerWidth > 1024;
        },
        
        supportsTouch() {
            return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        },
        
        getViewportSize() {
            return {
                width: window.innerWidth,
                height: window.innerHeight
            };
        }
    },
    
    // URL utilities
    url: {
        // Get query parameters
        getParams() {
            const params = {};
            const urlParams = new URLSearchParams(window.location.search);
            for (const [key, value] of urlParams) {
                params[key] = value;
            }
            return params;
        },
        
        // Set query parameter
        setParam(key, value) {
            const url = new URL(window.location);
            url.searchParams.set(key, value);
            window.history.replaceState({}, '', url);
        },
        
        // Remove query parameter
        removeParam(key) {
            const url = new URL(window.location);
            url.searchParams.delete(key);
            window.history.replaceState({}, '', url);
        }
    }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}

// Make available globally
window.Utils = Utils;