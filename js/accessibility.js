/**
 * Accessibility Manager - WCAG 2.1 AA Compliance
 * Provides comprehensive accessibility features and auditing
 */

const AccessibilityManager = {
    initialized: false,
    announcer: null,
    focusTracker: null,
    
    // Initialize accessibility features
    init() {
        if (this.initialized) return;
        
        console.log('♿ Initializing Accessibility Manager...');
        
        this.createScreenReaderAnnouncer();
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupARIALabels();
        this.setupSkipLinks();
        this.setupColorContrastMode();
        this.setupReducedMotionSupport();
        this.auditAccessibility();
        
        this.initialized = true;
    },
    
    // Create screen reader announcer
    createScreenReaderAnnouncer() {
        this.announcer = document.createElement('div');
        this.announcer.setAttribute('aria-live', 'polite');
        this.announcer.setAttribute('aria-atomic', 'true');
        this.announcer.className = 'sr-only';
        this.announcer.style.cssText = `
            position: absolute !important;
            width: 1px !important;
            height: 1px !important;
            padding: 0 !important;
            margin: -1px !important;
            overflow: hidden !important;
            clip: rect(0, 0, 0, 0) !important;
            white-space: nowrap !important;
            border: 0 !important;
        `;
        
        document.body.appendChild(this.announcer);
    },
    
    // Announce message to screen readers
    announce(message, priority = 'polite') {
        if (!this.announcer) return;
        
        this.announcer.setAttribute('aria-live', priority);
        this.announcer.textContent = message;
        
        // Clear after announcement
        setTimeout(() => {
            this.announcer.textContent = '';
        }, 1000);
    },
    
    // Setup comprehensive keyboard navigation
    setupKeyboardNavigation() {
        // Add keyboard support to all interactive elements
        const interactiveElements = document.querySelectorAll(
            '.skill-control, .language-control, .education-row, .social-link, .arrow, [onclick]'
        );
        
        interactiveElements.forEach(element => {
            if (!element.hasAttribute('tabindex')) {
                element.setAttribute('tabindex', '0');
            }
            
            element.addEventListener('keydown', (event) => {
                this.handleKeyboardInteraction(event, element);
            });
        });
        
        // Global keyboard shortcuts
        document.addEventListener('keydown', (event) => {
            this.handleGlobalKeyboardShortcuts(event);
        });
    },
    
    // Handle keyboard interactions
    handleKeyboardInteraction(event, element) {
        switch (event.key) {
            case 'Enter':
            case ' ':
                event.preventDefault();
                this.activateElement(element);
                break;
            case 'Escape':
                this.handleEscape(element);
                break;
            case 'ArrowDown':
            case 'ArrowUp':
                this.handleArrowNavigation(event, element);
                break;
        }
    },
    
    // Activate element (click equivalent)
    activateElement(element) {
        if (element.click) {
            element.click();
            this.announce(`Activated ${this.getElementDescription(element)}`);
        }
    },
    
    // Handle escape key
    handleEscape(element) {
        // Close any open overlays
        const openOverlays = document.querySelectorAll('.overlay.show, .modal.show, .menu-dropdown.show');
        openOverlays.forEach(overlay => {
            overlay.classList.remove('show');
        });
        
        if (openOverlays.length > 0) {
            this.announce('Overlay closed');
        }
    },
    
    // Handle arrow key navigation
    handleArrowNavigation(event, element) {
        const navigableElements = Array.from(document.querySelectorAll('[tabindex="0"]:not([disabled])'));
        const currentIndex = navigableElements.indexOf(element);
        
        if (currentIndex === -1) return;
        
        let nextIndex;
        if (event.key === 'ArrowDown') {
            nextIndex = (currentIndex + 1) % navigableElements.length;
        } else {
            nextIndex = (currentIndex - 1 + navigableElements.length) % navigableElements.length;
        }
        
        navigableElements[nextIndex].focus();
        event.preventDefault();
    },
    
    // Global keyboard shortcuts
    handleGlobalKeyboardShortcuts(event) {
        // Alt + 1: Skip to main content
        if (event.altKey && event.key === '1') {
            const mainContent = document.getElementById('main-content') || document.querySelector('main');
            if (mainContent) {
                mainContent.focus();
                this.announce('Jumped to main content');
            }
        }
        
        // Alt + 2: Skip to navigation
        if (event.altKey && event.key === '2') {
            const navigation = document.querySelector('nav') || document.querySelector('.menu-dropdown');
            if (navigation) {
                const firstLink = navigation.querySelector('a, button');
                if (firstLink) {
                    firstLink.focus();
                    this.announce('Jumped to navigation');
                }
            }
        }
        
        // Alt + H: Toggle high contrast
        if (event.altKey && event.key.toLowerCase() === 'h') {
            this.toggleHighContrast();
        }
        
        // Alt + R: Toggle reduced motion
        if (event.altKey && event.key.toLowerCase() === 'r') {
            this.toggleReducedMotion();
        }
    },
    
    // Setup focus management
    setupFocusManagement() {
        this.focusTracker = {
            previousFocus: null,
            focusStack: []
        };
        
        // Track focus changes
        document.addEventListener('focusin', (event) => {
            this.focusTracker.previousFocus = event.target;
        });
        
        // Handle focus trapping in modals
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Tab') {
                this.handleTabTrapping(event);
            }
        });
        
        // Add focus indicators
        this.addFocusIndicators();
    },
    
    // Handle tab trapping in modals
    handleTabTrapping(event) {
        const openModal = document.querySelector('.overlay.show, .modal.show');
        if (!openModal) return;
        
        const focusableElements = openModal.querySelectorAll(
            'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (event.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                event.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                event.preventDefault();
            }
        }
    },
    
    // Add visual focus indicators
    addFocusIndicators() {
        const style = document.createElement('style');
        style.textContent = `
            .focus-visible, 
            *:focus-visible {
                outline: 3px solid #f4d03f !important;
                outline-offset: 2px !important;
                box-shadow: 0 0 0 5px rgba(244, 208, 63, 0.3) !important;
            }
            
            .high-contrast .focus-visible,
            .high-contrast *:focus-visible {
                outline: 3px solid #000 !important;
                background-color: #ff0 !important;
                color: #000 !important;
            }
        `;
        document.head.appendChild(style);
    },
    
    // Setup ARIA labels and descriptions
    setupARIALabels() {
        // Profile image
        const profileImage = document.querySelector('.profile-image');
        if (profileImage && !profileImage.hasAttribute('aria-label')) {
            profileImage.setAttribute('aria-label', 'Professional headshot of Etiosa Raymond');
            profileImage.setAttribute('role', 'img');
        }
        
        // Skill bars
        const skillBars = document.querySelectorAll('.skill-bar, .language-bar');
        skillBars.forEach(bar => {
            const progress = bar.querySelector('.skill-progress, .language-progress');
            const name = bar.closest('.tool-item, .language-item')?.querySelector('.tool-name, .language-name')?.textContent;
            const value = progress?.getAttribute('data-value');
            
            if (name && value) {
                bar.setAttribute('role', 'progressbar');
                bar.setAttribute('aria-label', `${name} proficiency`);
                bar.setAttribute('aria-valuenow', value);
                bar.setAttribute('aria-valuemin', '0');
                bar.setAttribute('aria-valuemax', '100');
                bar.setAttribute('aria-valuetext', `${value} percent`);
            }
        });
        
        // Education rows
        const educationRows = document.querySelectorAll('.education-row');
        educationRows.forEach(row => {
            const label = row.querySelector('.row-label')?.textContent;
            const hasDocument = row.hasAttribute('data-file');
            
            if (label) {
                row.setAttribute('aria-label', 
                    hasDocument ? 
                    `${label} - Click to view document` : 
                    `${label} - Click for more information`
                );
            }
        });
        
        // Social links
        const socialLinks = document.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            const title = link.getAttribute('title');
            if (title && !link.hasAttribute('aria-label')) {
                if (link.hasAttribute('download')) {
                    link.setAttribute('aria-label', `Download ${title}`);
                } else {
                    link.setAttribute('aria-label', `Visit ${title} (opens in new tab)`);
                }
            }
        });
        
        // Menu dropdown
        const menuDropdown = document.getElementById('menuDropdown');
        if (menuDropdown) {
            menuDropdown.setAttribute('role', 'menu');
            
            const menuItems = menuDropdown.querySelectorAll('.menu-item');
            menuItems.forEach(item => {
                item.setAttribute('role', 'menuitem');
            });
        }
    },
    
    // Setup skip links
    setupSkipLinks() {
        const skipLink = document.querySelector('.sr-only');
        if (!skipLink) {
            const link = document.createElement('a');
            link.href = '#main-content';
            link.className = 'sr-only skip-link';
            link.textContent = 'Skip to main content';
            link.style.cssText = `
                position: absolute;
                top: -40px;
                left: 6px;
                background: #000;
                color: #fff;
                padding: 8px;
                text-decoration: none;
                z-index: 100000;
            `;
            
            link.addEventListener('focus', () => {
                link.style.top = '6px';
            });
            
            link.addEventListener('blur', () => {
                link.style.top = '-40px';
            });
            
            document.body.insertBefore(link, document.body.firstChild);
        }
    },
    
    // Setup color contrast mode
    setupColorContrastMode() {
        // Check for saved preference
        const hasHighContrast = localStorage.getItem('high-contrast') === 'true';
        if (hasHighContrast) {
            document.body.classList.add('high-contrast');
        }
        
        // Add high contrast CSS
        const style = document.createElement('style');
        style.textContent = `
            .high-contrast {
                filter: contrast(150%) brightness(120%);
            }
            
            .high-contrast .profile-section {
                background-color: #000 !important;
                color: #fff !important;
            }
            
            .high-contrast .description {
                background-color: #ff0 !important;
                color: #000 !important;
            }
            
            .high-contrast .skill-progress,
            .high-contrast .language-progress {
                background-color: #000 !important;
            }
            
            .high-contrast button,
            .high-contrast .social-link {
                background-color: #000 !important;
                color: #fff !important;
                border: 2px solid #fff !important;
            }
        `;
        document.head.appendChild(style);
    },
    
    // Toggle high contrast mode
    toggleHighContrast() {
        const isHighContrast = document.body.classList.toggle('high-contrast');
        localStorage.setItem('high-contrast', isHighContrast);
        
        this.announce(
            isHighContrast ? 
            'High contrast mode enabled' : 
            'High contrast mode disabled'
        );
    },
    
    // Setup reduced motion support
    setupReducedMotionSupport() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const hasReducedMotion = localStorage.getItem('reduced-motion') === 'true';
        
        if (prefersReducedMotion || hasReducedMotion) {
            this.enableReducedMotion();
        }
    },
    
    // Enable reduced motion
    enableReducedMotion() {
        document.body.classList.add('reduced-motion');
        
        const style = document.createElement('style');
        style.textContent = `
            .reduced-motion *,
            .reduced-motion *::before,
            .reduced-motion *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
                scroll-behavior: auto !important;
            }
        `;
        document.head.appendChild(style);
    },
    
    // Toggle reduced motion
    toggleReducedMotion() {
        const hasReducedMotion = document.body.classList.toggle('reduced-motion');
        localStorage.setItem('reduced-motion', hasReducedMotion);
        
        if (hasReducedMotion) {
            this.enableReducedMotion();
        }
        
        this.announce(
            hasReducedMotion ? 
            'Reduced motion enabled' : 
            'Reduced motion disabled'
        );
    },
    
    // Get element description for screen readers
    getElementDescription(element) {
        const ariaLabel = element.getAttribute('aria-label');
        if (ariaLabel) return ariaLabel;
        
        const title = element.getAttribute('title');
        if (title) return title;
        
        const textContent = element.textContent?.trim();
        if (textContent) return textContent;
        
        const className = element.className;
        return className || 'interactive element';
    },
    
    // Audit accessibility issues
    auditAccessibility() {
        const issues = [];
        
        // Check for missing alt text
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.hasAttribute('alt') && !img.hasAttribute('aria-label')) {
                issues.push({
                    type: 'missing-alt-text',
                    element: img,
                    message: 'Image missing alt text'
                });
            }
        });
        
        // Check for insufficient color contrast
        this.checkColorContrast(issues);
        
        // Check for missing form labels
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            if (!input.hasAttribute('aria-label') && !input.hasAttribute('aria-labelledby') && !document.querySelector(`label[for="${input.id}"]`)) {
                issues.push({
                    type: 'missing-form-label',
                    element: input,
                    message: 'Form control missing label'
                });
            }
        });
        
        // Check for keyboard accessibility
        const interactiveElements = document.querySelectorAll('button, a, [onclick], [tabindex]');
        interactiveElements.forEach(element => {
            if (element.tabIndex < 0 && !element.hasAttribute('aria-hidden')) {
                issues.push({
                    type: 'keyboard-inaccessible',
                    element: element,
                    message: 'Interactive element not keyboard accessible'
                });
            }
        });
        
        // Check for proper heading structure
        this.checkHeadingStructure(issues);
        
        // Log issues
        if (issues.length > 0) {
            console.warn('🚨 Accessibility issues found:', issues);
            this.displayAccessibilityReport(issues);
        } else {
            console.log('✅ No accessibility issues found');
        }
        
        return issues;
    },
    
    // Check color contrast
    checkColorContrast(issues) {
        // This is a simplified contrast check
        // In production, you'd use a more sophisticated algorithm
        const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, button');
        
        textElements.forEach(element => {
            const styles = window.getComputedStyle(element);
            const color = styles.color;
            const backgroundColor = styles.backgroundColor;
            
            // Simple contrast check (you'd want a more sophisticated implementation)
            if (color === backgroundColor) {
                issues.push({
                    type: 'poor-contrast',
                    element: element,
                    message: 'Text and background colors have poor contrast'
                });
            }
        });
    },
    
    // Check heading structure
    checkHeadingStructure(issues) {
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        let previousLevel = 0;
        
        headings.forEach(heading => {
            const currentLevel = parseInt(heading.tagName.charAt(1));
            
            if (currentLevel > previousLevel + 1) {
                issues.push({
                    type: 'heading-structure',
                    element: heading,
                    message: `Heading level ${currentLevel} follows level ${previousLevel} - levels should not be skipped`
                });
            }
            
            previousLevel = currentLevel;
        });
    },
    
    // Display accessibility report
    displayAccessibilityReport(issues) {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            const report = document.createElement('div');
            report.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: #f44336;
                color: white;
                padding: 15px;
                border-radius: 5px;
                z-index: 10000;
                max-width: 300px;
                font-size: 12px;
            `;
            
            report.innerHTML = `
                <h4>Accessibility Issues (${issues.length})</h4>
                <ul>
                    ${issues.map(issue => `<li>${issue.message}</li>`).join('')}
                </ul>
                <button onclick="this.parentNode.remove()" style="background: transparent; border: 1px solid white; color: white; padding: 5px; margin-top: 10px;">Close</button>
            `;
            
            document.body.appendChild(report);
            
            // Auto-remove after 10 seconds
            setTimeout(() => {
                if (report.parentNode) {
                    report.parentNode.removeChild(report);
                }
            }, 10000);
        }
    },
    
    // Create accessibility settings panel
    createAccessibilityPanel() {
        const panel = document.createElement('div');
        panel.className = 'accessibility-panel';
        panel.innerHTML = `
            <button class="accessibility-toggle" aria-label="Open accessibility settings">
                ♿
            </button>
            <div class="accessibility-controls" hidden>
                <h3>Accessibility Settings</h3>
                <button onclick="AccessibilityManager.toggleHighContrast()">
                    Toggle High Contrast
                </button>
                <button onclick="AccessibilityManager.toggleReducedMotion()">
                    Toggle Reduced Motion
                </button>
                <button onclick="AccessibilityManager.auditAccessibility()">
                    Run Accessibility Audit
                </button>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .accessibility-panel {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 10000;
            }
            
            .accessibility-toggle {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: #f4d03f;
                border: none;
                font-size: 24px;
                cursor: pointer;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            }
            
            .accessibility-controls {
                position: absolute;
                bottom: 60px;
                right: 0;
                background: white;
                border: 1px solid #ccc;
                border-radius: 8px;
                padding: 15px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                min-width: 200px;
            }
            
            .accessibility-controls button {
                display: block;
                width: 100%;
                margin: 5px 0;
                padding: 8px;
                border: 1px solid #ccc;
                background: white;
                cursor: pointer;
            }
        `;
        document.head.appendChild(style);
        
        // Toggle functionality
        const toggle = panel.querySelector('.accessibility-toggle');
        const controls = panel.querySelector('.accessibility-controls');
        
        toggle.addEventListener('click', () => {
            const isHidden = controls.hasAttribute('hidden');
            if (isHidden) {
                controls.removeAttribute('hidden');
                toggle.setAttribute('aria-expanded', 'true');
            } else {
                controls.setAttribute('hidden', '');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
        
        document.body.appendChild(panel);
    },
    
    // Cleanup method
    destroy() {
        if (this.announcer && this.announcer.parentNode) {
            this.announcer.parentNode.removeChild(this.announcer);
        }
        
        this.initialized = false;
    }
};

// Auto-initialize
if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            AccessibilityManager.init();
            // Only show panel in development
            if (window.location.hostname === 'localhost') {
                AccessibilityManager.createAccessibilityPanel();
            }
        });
    } else {
        AccessibilityManager.init();
        if (window.location.hostname === 'localhost') {
            AccessibilityManager.createAccessibilityPanel();
        }
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AccessibilityManager;
}

// Make available globally
window.AccessibilityManager = AccessibilityManager;