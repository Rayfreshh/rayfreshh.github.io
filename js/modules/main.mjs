/**
 * Main Application Module - ES6 Version
 * Modern JavaScript architecture with ES6 modules
 */

import { SkillsManager } from './skills.mjs';
import { EducationManager } from './education.mjs';
import { TooltipManager } from './tooltips.mjs';
import { MobileManager } from './mobile.mjs';
import { PerformanceMonitor } from './performance.mjs';
import { LazyLoader } from './lazy-loader.mjs';
import { AnimationManager } from './animations.mjs';
import { AccessibilityManager } from './accessibility.mjs';
import { AIShowcaseManager } from './ai-showcase.mjs';

class PortfolioApp {
    constructor() {
        this.initialized = false;
        this.isMobile = false;
        this.modules = new Map();
        this.config = {
            debug: false,
            performance: true,
            lazyLoading: true,
            animations: true
        };
    }

    // Initialize the application
    async init(config = {}) {
        if (this.initialized) return;
        
        this.config = { ...this.config, ...config };
        
        try {
            console.log('🚀 Initializing Portfolio App (ES6)...');
            
            // Detect device capabilities
            this.detectDeviceCapabilities();
            
            // Initialize core modules
            await this.initializeModules();
            
            // Setup global event listeners
            this.setupGlobalEvents();
            
            // Initialize performance monitoring if enabled
            if (this.config.performance) {
                await this.initializePerformanceMonitoring();
            }
            
            // Initialize lazy loading if enabled
            if (this.config.lazyLoading) {
                await this.initializeLazyLoading();
            }
            
            this.initialized = true;
            console.log('✅ Portfolio App initialized successfully');
            
            // Dispatch custom event
            this.dispatchEvent('portfolio:initialized', { config: this.config });
            
        } catch (error) {
            console.error('❌ Failed to initialize Portfolio App:', error);
            throw error;
        }
    }

    // Detect device capabilities
    detectDeviceCapabilities() {
        this.isMobile = window.innerWidth <= 768;
        
        this.capabilities = {
            isMobile: this.isMobile,
            hasTouch: 'ontouchstart' in window,
            hasIntersectionObserver: 'IntersectionObserver' in window,
            hasPerformanceObserver: 'PerformanceObserver' in window,
            hasServiceWorker: 'serviceWorker' in navigator,
            prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            supportsWebP: this.checkWebPSupport(),
            connectionType: navigator.connection?.effectiveType || 'unknown'
        };

        console.log('📱 Device capabilities:', this.capabilities);
    }

    // Check WebP support
    checkWebPSupport() {
        return new Promise((resolve) => {
            const webP = new Image();
            webP.onload = webP.onerror = () => {
                resolve(webP.height === 2);
            };
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    }

    // Initialize core modules
    async initializeModules() {
        const moduleConfigs = [
            {
                name: 'accessibility',
                instance: new AccessibilityManager(),
                condition: () => true,
                priority: 1
            },
            {
                name: 'animations',
                instance: new AnimationManager(),
                condition: () => this.capabilities.hasIntersectionObserver && this.config.animations,
                priority: 2
            },
            {
                name: 'ai-showcase',
                instance: new AIShowcaseManager(),
                condition: () => this.config.animations && !this.capabilities.prefersReducedMotion,
                priority: 2
            },
            {
                name: 'skills',
                instance: new SkillsManager(),
                condition: () => document.querySelectorAll('.skill-control').length > 0,
                priority: 3
            },
            {
                name: 'education',
                instance: new EducationManager(),
                condition: () => document.querySelectorAll('.education-row').length > 0,
                priority: 3
            },
            {
                name: 'tooltips',
                instance: new TooltipManager(),
                condition: () => true,
                priority: 4
            },
            {
                name: 'mobile',
                instance: new MobileManager(),
                condition: () => this.isMobile || this.capabilities.hasTouch,
                priority: 2
            }
        ];

        // Sort modules by priority
        moduleConfigs.sort((a, b) => (a.priority || 999) - (b.priority || 999));

        for (const config of moduleConfigs) {
            if (config.condition()) {
                try {
                    await config.instance.init();
                    this.modules.set(config.name, config.instance);
                    console.log(`✅ Module initialized: ${config.name} (priority: ${config.priority || 'default'})`);
                } catch (error) {
                    console.error(`❌ Failed to initialize ${config.name}:`, error);
                }
            }
        }
    }

    // Initialize performance monitoring
    async initializePerformanceMonitoring() {
        try {
            const performanceMonitor = new PerformanceMonitor();
            await performanceMonitor.init();
            this.modules.set('performance', performanceMonitor);
        } catch (error) {
            console.warn('Performance monitoring unavailable:', error);
        }
    }

    // Initialize lazy loading
    async initializeLazyLoading() {
        try {
            const lazyLoader = new LazyLoader();
            await lazyLoader.init();
            this.modules.set('lazyLoader', lazyLoader);
        } catch (error) {
            console.warn('Lazy loading unavailable:', error);
        }
    }

    // Setup global event listeners
    setupGlobalEvents() {
        // Handle window resize with debouncing
        const debouncedResize = this.debounce(() => {
            this.handleResize();
        }, 250);
        
        window.addEventListener('resize', debouncedResize);

        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });

        // Handle orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.handleOrientationChange(), 100);
        });

        // Global keyboard shortcuts
        document.addEventListener('keydown', (event) => {
            this.handleGlobalKeyboard(event);
        });

        // Handle online/offline events
        window.addEventListener('online', () => this.handleConnectionChange(true));
        window.addEventListener('offline', () => this.handleConnectionChange(false));
    }

    // Handle window resize
    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth <= 768;

        if (wasMobile !== this.isMobile) {
            console.log(`📱 Device type changed: ${this.isMobile ? 'Mobile' : 'Desktop'}`);
            this.handleDeviceTypeChange();
        }

        // Notify modules about resize
        this.modules.forEach((module, name) => {
            if (typeof module.handleResize === 'function') {
                module.handleResize();
            }
        });

        this.dispatchEvent('portfolio:resize', { isMobile: this.isMobile });
    }

    // Handle device type change
    async handleDeviceTypeChange() {
        // Reinitialize mobile-specific modules
        if (this.isMobile && !this.modules.has('mobile')) {
            try {
                const mobileManager = new MobileManager();
                await mobileManager.init();
                this.modules.set('mobile', mobileManager);
            } catch (error) {
                console.error('Failed to initialize mobile manager:', error);
            }
        } else if (!this.isMobile && this.modules.has('mobile')) {
            const mobileManager = this.modules.get('mobile');
            if (typeof mobileManager.destroy === 'function') {
                mobileManager.destroy();
            }
            this.modules.delete('mobile');
        }
    }

    // Handle visibility change
    handleVisibilityChange() {
        if (document.hidden) {
            // Page is hidden - pause non-essential operations
            this.pauseNonEssentialOperations();
        } else {
            // Page is visible - resume operations
            this.resumeOperations();
        }
    }

    // Handle orientation change
    handleOrientationChange() {
        this.detectDeviceCapabilities();
        
        // Refresh modules that depend on orientation
        this.modules.forEach((module, name) => {
            if (typeof module.handleOrientationChange === 'function') {
                module.handleOrientationChange();
            }
        });

        this.dispatchEvent('portfolio:orientationchange');
    }

    // Handle global keyboard shortcuts
    handleGlobalKeyboard(event) {
        // Escape key - close all overlays
        if (event.key === 'Escape') {
            this.closeAllOverlays();
        }
        
        // Ctrl/Cmd + / - Show keyboard shortcuts help
        if ((event.ctrlKey || event.metaKey) && event.key === '/') {
            event.preventDefault();
            this.showKeyboardShortcuts();
        }
    }

    // Handle connection change
    handleConnectionChange(isOnline) {
        console.log(`🌐 Connection: ${isOnline ? 'Online' : 'Offline'}`);
        
        // Update UI based on connection status
        document.body.classList.toggle('offline', !isOnline);
        
        this.dispatchEvent('portfolio:connectionchange', { isOnline });
    }

    // Close all overlays
    closeAllOverlays() {
        this.modules.forEach((module, name) => {
            if (typeof module.closeOverlays === 'function') {
                module.closeOverlays();
            }
        });

        this.dispatchEvent('portfolio:overlays-closed');
    }

    // Show keyboard shortcuts
    showKeyboardShortcuts() {
        const shortcuts = [
            { key: 'Esc', description: 'Close overlays' },
            { key: 'Tab', description: 'Navigate through interactive elements' },
            { key: 'Enter/Space', description: 'Activate focused element' },
            { key: 'Ctrl+/', description: 'Show this help' }
        ];

        // Create and show shortcuts modal
        this.showModal('Keyboard Shortcuts', shortcuts.map(shortcut => 
            `<div class="shortcut-item">
                <kbd>${shortcut.key}</kbd>
                <span>${shortcut.description}</span>
            </div>`
        ).join(''));
    }

    // Show modal dialog
    showModal(title, content) {
        // Create modal if it doesn't exist
        let modal = document.getElementById('global-modal');
        if (!modal) {
            modal = this.createModal();
        }

        modal.querySelector('.modal-title').textContent = title;
        modal.querySelector('.modal-content').innerHTML = content;
        modal.classList.add('show');
        
        // Focus management
        const closeButton = modal.querySelector('.modal-close');
        closeButton.focus();
    }

    // Create modal element
    createModal() {
        const modal = document.createElement('div');
        modal.id = 'global-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-dialog">
                <div class="modal-header">
                    <h3 class="modal-title"></h3>
                    <button class="modal-close" aria-label="Close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="modal-content"></div>
                </div>
            </div>
        `;

        // Event listeners
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.classList.remove('show');
        });

        modal.querySelector('.modal-backdrop').addEventListener('click', () => {
            modal.classList.remove('show');
        });

        document.body.appendChild(modal);
        return modal;
    }

    // Pause non-essential operations
    pauseNonEssentialOperations() {
        this.modules.forEach((module, name) => {
            if (typeof module.pause === 'function') {
                module.pause();
            }
        });
    }

    // Resume operations
    resumeOperations() {
        this.modules.forEach((module, name) => {
            if (typeof module.resume === 'function') {
                module.resume();
            }
        });
    }

    // Get module by name
    getModule(name) {
        return this.modules.get(name);
    }

    // Check if module is loaded
    hasModule(name) {
        return this.modules.has(name);
    }

    // Dispatch custom event
    dispatchEvent(eventName, detail = {}) {
        const event = new CustomEvent(eventName, {
            detail: {
                ...detail,
                timestamp: Date.now(),
                source: 'PortfolioApp'
            }
        });
        
        document.dispatchEvent(event);
    }

    // Utility: Debounce function
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
    }

    // Utility: Throttle function
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
    }

    // Get application state
    getState() {
        return {
            initialized: this.initialized,
            isMobile: this.isMobile,
            capabilities: this.capabilities,
            config: this.config,
            modules: Array.from(this.modules.keys()),
            timestamp: Date.now()
        };
    }

    // Cleanup and destroy
    async destroy() {
        console.log('🧹 Destroying Portfolio App...');

        // Destroy all modules
        for (const [name, module] of this.modules) {
            if (typeof module.destroy === 'function') {
                try {
                    await module.destroy();
                    console.log(`✅ Module destroyed: ${name}`);
                } catch (error) {
                    console.error(`❌ Failed to destroy ${name}:`, error);
                }
            }
        }

        // Clear modules
        this.modules.clear();
        
        // Remove global event listeners
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        
        this.initialized = false;
        
        this.dispatchEvent('portfolio:destroyed');
    }
}

// Create and export singleton instance
const app = new PortfolioApp();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
} else {
    app.init();
}

// Make available globally for debugging
window.PortfolioApp = app;

export default app;
export { PortfolioApp };