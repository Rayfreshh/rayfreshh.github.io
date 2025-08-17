/**
 * Accessibility Manager - WCAG 2.1 AA compliance and enhanced usability
 * Ensures the portfolio is accessible to all users
 */

export class AccessibilityManager {
    constructor() {
        this.focusedElement = null;
        this.focusTrap = null;
        this.announcer = null;
        this.config = {
            enableFocusManagement: true,
            enableScreenReaderSupport: true,
            enableKeyboardNavigation: true,
            enableHighContrast: true,
            enableReducedMotion: true,
            announceChanges: true
        };
        this.keyboardMap = new Map();
    }

    async init() {
        try {
            this.createScreenReaderAnnouncer();
            this.setupFocusManagement();
            this.setupKeyboardNavigation();
            this.setupARIASupport();
            this.setupHighContrastMode();
            this.setupReducedMotionSupport();
            this.setupSkipLinks();
            this.enhanceFormAccessibility();
            this.monitorAccessibilityViolations();
            
            console.log('✅ Accessibility Manager initialized');
        } catch (error) {
            console.error('❌ Failed to initialize Accessibility Manager:', error);
            throw error;
        }
    }

    // Create screen reader announcer
    createScreenReaderAnnouncer() {
        this.announcer = document.createElement('div');
        this.announcer.id = 'screen-reader-announcer';
        this.announcer.setAttribute('aria-live', 'polite');
        this.announcer.setAttribute('aria-atomic', 'true');
        this.announcer.setAttribute('aria-hidden', 'false');
        this.announcer.style.cssText = `
            position: absolute;
            left: -10000px;
            width: 1px;
            height: 1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
        `;
        
        document.body.appendChild(this.announcer);
    }

    // Announce messages to screen readers
    announce(message, priority = 'polite') {
        if (!this.config.announceChanges || !this.announcer) return;
        
        this.announcer.setAttribute('aria-live', priority);
        this.announcer.textContent = message;
        
        // Clear after announcement
        setTimeout(() => {
            this.announcer.textContent = '';
        }, 1000);
    }

    // Setup focus management
    setupFocusManagement() {
        if (!this.config.enableFocusManagement) return;

        // Track focus changes
        document.addEventListener('focusin', (event) => {
            this.handleFocusIn(event);
        });

        document.addEventListener('focusout', (event) => {
            this.handleFocusOut(event);
        });

        // Ensure visible focus indicators
        this.enhanceFocusIndicators();

        // Focus trap for modals
        this.setupFocusTrap();
    }

    // Handle focus in events
    handleFocusIn(event) {
        const element = event.target;
        this.focusedElement = element;

        // Add visual focus enhancement
        element.classList.add('focused');

        // Announce focused element to screen readers
        if (this.shouldAnnounceElement(element)) {
            const announcement = this.generateFocusAnnouncement(element);
            this.announce(announcement);
        }

        // Ensure element is visible
        this.ensureElementVisible(element);
    }

    // Handle focus out events
    handleFocusOut(event) {
        const element = event.target;
        element.classList.remove('focused');
    }

    // Generate focus announcement
    generateFocusAnnouncement(element) {
        const role = element.getAttribute('role') || element.tagName.toLowerCase();
        const label = element.getAttribute('aria-label') || 
                     element.getAttribute('title') || 
                     element.textContent.trim();
        
        const state = [];
        if (element.getAttribute('aria-expanded')) {
            state.push(element.getAttribute('aria-expanded') === 'true' ? 'expanded' : 'collapsed');
        }
        if (element.disabled) state.push('disabled');
        if (element.getAttribute('aria-pressed')) {
            state.push(element.getAttribute('aria-pressed') === 'true' ? 'pressed' : 'not pressed');
        }

        return `${label} ${role} ${state.join(' ')}`.trim();
    }

    // Check if element should be announced
    shouldAnnounceElement(element) {
        const interactiveElements = ['button', 'link', 'input', 'select', 'textarea'];
        const roleElements = ['button', 'link', 'menuitem', 'tab', 'option'];
        
        return interactiveElements.includes(element.tagName.toLowerCase()) ||
               roleElements.includes(element.getAttribute('role')) ||
               element.hasAttribute('tabindex');
    }

    // Enhance focus indicators
    enhanceFocusIndicators() {
        const style = document.createElement('style');
        style.textContent = `
            .focused {
                outline: 2px solid var(--primary-color) !important;
                outline-offset: 2px !important;
                box-shadow: 0 0 0 4px rgba(0, 229, 255, 0.3) !important;
            }
            
            @media (prefers-contrast: high) {
                .focused {
                    outline: 3px solid #000000 !important;
                    outline-offset: 2px !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Setup focus trap for modals
    setupFocusTrap() {
        this.focusTrap = {
            active: false,
            container: null,
            firstFocusableElement: null,
            lastFocusableElement: null
        };

        document.addEventListener('keydown', (event) => {
            if (this.focusTrap.active && event.key === 'Tab') {
                this.handleFocusTrap(event);
            }
        });
    }

    // Activate focus trap
    activateFocusTrap(container) {
        this.focusTrap.container = container;
        this.focusTrap.active = true;

        const focusableElements = this.getFocusableElements(container);
        this.focusTrap.firstFocusableElement = focusableElements[0];
        this.focusTrap.lastFocusableElement = focusableElements[focusableElements.length - 1];

        // Focus first element
        if (this.focusTrap.firstFocusableElement) {
            this.focusTrap.firstFocusableElement.focus();
        }

        this.announce('Modal opened. Press Escape to close.');
    }

    // Deactivate focus trap
    deactivateFocusTrap() {
        this.focusTrap.active = false;
        this.focusTrap.container = null;
        this.announce('Modal closed.');
    }

    // Handle focus trap navigation
    handleFocusTrap(event) {
        if (!this.focusTrap.active) return;

        if (event.shiftKey) {
            // Shift + Tab
            if (document.activeElement === this.focusTrap.firstFocusableElement) {
                event.preventDefault();
                this.focusTrap.lastFocusableElement.focus();
            }
        } else {
            // Tab
            if (document.activeElement === this.focusTrap.lastFocusableElement) {
                event.preventDefault();
                this.focusTrap.firstFocusableElement.focus();
            }
        }
    }

    // Get focusable elements
    getFocusableElements(container) {
        const selector = [
            'a[href]',
            'button:not([disabled])',
            'textarea:not([disabled])',
            'input:not([disabled])',
            'select:not([disabled])',
            '[tabindex]:not([tabindex="-1"])'
        ].join(', ');

        return Array.from(container.querySelectorAll(selector))
            .filter(element => !element.hasAttribute('aria-hidden') && 
                              element.offsetWidth > 0 && 
                              element.offsetHeight > 0);
    }

    // Setup keyboard navigation
    setupKeyboardNavigation() {
        if (!this.config.enableKeyboardNavigation) return;

        // Global keyboard shortcuts
        document.addEventListener('keydown', (event) => {
            this.handleGlobalKeyboard(event);
        });

        // Enhanced navigation for custom components
        this.setupSkillsKeyboardNavigation();
        this.setupEducationKeyboardNavigation();
        this.setupMenuKeyboardNavigation();
    }

    // Handle global keyboard events
    handleGlobalKeyboard(event) {
        const { key, ctrlKey, metaKey, altKey } = event;

        // Skip to main content
        if (key === '1' && altKey) {
            event.preventDefault();
            this.skipToMainContent();
        }

        // Skip to navigation
        if (key === '2' && altKey) {
            event.preventDefault();
            this.skipToNavigation();
        }

        // Toggle high contrast
        if (key === 'h' && ctrlKey) {
            event.preventDefault();
            this.toggleHighContrast();
        }

        // Toggle reduced motion
        if (key === 'm' && ctrlKey) {
            event.preventDefault();
            this.toggleReducedMotion();
        }

        // Close all overlays with Escape
        if (key === 'Escape') {
            this.closeAllOverlays();
        }
    }

    // Setup skills keyboard navigation
    setupSkillsKeyboardNavigation() {
        const skillControls = document.querySelectorAll('.skill-control, .language-control');
        
        skillControls.forEach(control => {
            control.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    control.click();
                    this.announce('Skill level updated');
                }
            });
        });
    }

    // Setup education keyboard navigation
    setupEducationKeyboardNavigation() {
        const educationRows = document.querySelectorAll('.education-row');
        
        educationRows.forEach(row => {
            row.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    row.click();
                }
            });
        });
    }

    // Setup menu keyboard navigation
    setupMenuKeyboardNavigation() {
        const menuItems = document.querySelectorAll('.menu-item');
        
        menuItems.forEach((item, index) => {
            item.addEventListener('keydown', (event) => {
                const { key } = event;
                
                if (key === 'ArrowDown') {
                    event.preventDefault();
                    const nextItem = menuItems[index + 1] || menuItems[0];
                    nextItem.focus();
                }
                
                if (key === 'ArrowUp') {
                    event.preventDefault();
                    const prevItem = menuItems[index - 1] || menuItems[menuItems.length - 1];
                    prevItem.focus();
                }
                
                if (key === 'Home') {
                    event.preventDefault();
                    menuItems[0].focus();
                }
                
                if (key === 'End') {
                    event.preventDefault();
                    menuItems[menuItems.length - 1].focus();
                }
            });
        });
    }

    // Setup ARIA support
    setupARIASupport() {
        // Add missing ARIA labels
        this.addMissingAriaLabels();
        
        // Setup live regions
        this.setupLiveRegions();
        
        // Update dynamic content ARIA
        this.updateDynamicARIA();
    }

    // Add missing ARIA labels
    addMissingAriaLabels() {
        // Buttons without labels
        const unlabeledButtons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
        unlabeledButtons.forEach(button => {
            const text = button.textContent.trim();
            if (text) {
                button.setAttribute('aria-label', text);
            }
        });

        // Links without labels
        const unlabeledLinks = document.querySelectorAll('a:not([aria-label]):not([aria-labelledby])');
        unlabeledLinks.forEach(link => {
            const text = link.textContent.trim();
            if (!text && link.querySelector('svg')) {
                const title = link.getAttribute('title');
                if (title) {
                    link.setAttribute('aria-label', title);
                }
            }
        });

        // Form controls
        const formControls = document.querySelectorAll('input, select, textarea');
        formControls.forEach(control => {
            if (!control.hasAttribute('aria-label') && !control.hasAttribute('aria-labelledby')) {
                const label = document.querySelector(`label[for="${control.id}"]`);
                if (!label && control.placeholder) {
                    control.setAttribute('aria-label', control.placeholder);
                }
            }
        });
    }

    // Setup live regions
    setupLiveRegions() {
        // Create status live region
        const statusRegion = document.createElement('div');
        statusRegion.id = 'status-live-region';
        statusRegion.setAttribute('aria-live', 'polite');
        statusRegion.setAttribute('aria-atomic', 'true');
        statusRegion.style.cssText = `
            position: absolute;
            left: -10000px;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `;
        document.body.appendChild(statusRegion);

        // Create alert live region
        const alertRegion = document.createElement('div');
        alertRegion.id = 'alert-live-region';
        alertRegion.setAttribute('aria-live', 'assertive');
        alertRegion.setAttribute('aria-atomic', 'true');
        alertRegion.style.cssText = statusRegion.style.cssText;
        document.body.appendChild(alertRegion);
    }

    // Update dynamic ARIA
    updateDynamicARIA() {
        // Update progress bars
        const progressBars = document.querySelectorAll('.skill-progress, .language-progress');
        progressBars.forEach(bar => {
            const container = bar.closest('.skill-bar, .language-bar');
            if (container) {
                const value = bar.getAttribute('data-value') || '0';
                container.setAttribute('aria-valuenow', value);
                container.setAttribute('aria-valuemin', '0');
                container.setAttribute('aria-valuemax', '100');
                container.setAttribute('role', 'progressbar');
                container.setAttribute('aria-label', `Skill level: ${value}%`);
            }
        });

        // Update expandable sections
        const expandableElements = document.querySelectorAll('[data-expandable]');
        expandableElements.forEach(element => {
            element.setAttribute('aria-expanded', 'false');
            element.setAttribute('role', 'button');
        });
    }

    // Setup high contrast mode
    setupHighContrastMode() {
        if (!this.config.enableHighContrast) return;

        // Detect system preference
        const prefersHighContrast = window.matchMedia('(prefers-contrast: high)');
        
        if (prefersHighContrast.matches) {
            this.enableHighContrast();
        }

        // Listen for changes
        prefersHighContrast.addEventListener('change', (event) => {
            if (event.matches) {
                this.enableHighContrast();
            } else {
                this.disableHighContrast();
            }
        });
    }

    // Enable high contrast mode
    enableHighContrast() {
        document.body.classList.add('high-contrast');
        this.announce('High contrast mode enabled');
    }

    // Disable high contrast mode
    disableHighContrast() {
        document.body.classList.remove('high-contrast');
        this.announce('High contrast mode disabled');
    }

    // Toggle high contrast mode
    toggleHighContrast() {
        if (document.body.classList.contains('high-contrast')) {
            this.disableHighContrast();
        } else {
            this.enableHighContrast();
        }
    }

    // Setup reduced motion support
    setupReducedMotionSupport() {
        if (!this.config.enableReducedMotion) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            this.enableReducedMotion();
        }

        prefersReducedMotion.addEventListener('change', (event) => {
            if (event.matches) {
                this.enableReducedMotion();
            } else {
                this.disableReducedMotion();
            }
        });
    }

    // Enable reduced motion
    enableReducedMotion() {
        document.body.classList.add('reduced-motion');
        this.announce('Reduced motion enabled');
    }

    // Disable reduced motion
    disableReducedMotion() {
        document.body.classList.remove('reduced-motion');
        this.announce('Reduced motion disabled');
    }

    // Toggle reduced motion
    toggleReducedMotion() {
        if (document.body.classList.contains('reduced-motion')) {
            this.disableReducedMotion();
        } else {
            this.enableReducedMotion();
        }
    }

    // Setup skip links
    setupSkipLinks() {
        const skipLinksHTML = `
            <div id="skip-links" class="skip-links">
                <a href="#main-content" class="skip-link">Skip to main content</a>
                <a href="#navigation" class="skip-link">Skip to navigation</a>
                <a href="#tools" class="skip-link">Skip to tools section</a>
            </div>
        `;

        document.body.insertAdjacentHTML('afterbegin', skipLinksHTML);

        // Add skip links styles
        const style = document.createElement('style');
        style.textContent = `
            .skip-links {
                position: absolute;
                top: -100px;
                left: 0;
                z-index: 10000;
            }
            
            .skip-link {
                position: absolute;
                top: -100px;
                left: 0;
                background: var(--dark-bg);
                color: var(--text-inverse);
                padding: 8px 16px;
                text-decoration: none;
                border-radius: 0 0 4px 0;
                font-weight: 600;
                transition: top 0.2s ease;
            }
            
            .skip-link:focus {
                top: 0;
            }
        `;
        document.head.appendChild(style);
    }

    // Skip to main content
    skipToMainContent() {
        const mainContent = document.querySelector('#main-content, main, .main-wrapper');
        if (mainContent) {
            mainContent.focus();
            mainContent.scrollIntoView({ behavior: 'smooth' });
            this.announce('Skipped to main content');
        }
    }

    // Skip to navigation
    skipToNavigation() {
        const navigation = document.querySelector('#navigation, nav, .menu-dropdown');
        if (navigation) {
            navigation.focus();
            navigation.scrollIntoView({ behavior: 'smooth' });
            this.announce('Skipped to navigation');
        }
    }

    // Enhance form accessibility
    enhanceFormAccessibility() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            // Add form labels
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                if (!input.hasAttribute('aria-label') && !input.hasAttribute('aria-labelledby')) {
                    const placeholder = input.getAttribute('placeholder');
                    if (placeholder) {
                        input.setAttribute('aria-label', placeholder);
                    }
                }
            });

            // Add form validation
            form.addEventListener('submit', (event) => {
                const isValid = this.validateFormAccessibility(form);
                if (!isValid) {
                    event.preventDefault();
                    this.announce('Form contains errors. Please check the highlighted fields.', 'assertive');
                }
            });
        });
    }

    // Validate form accessibility
    validateFormAccessibility(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.setAttribute('aria-invalid', 'true');
                field.classList.add('error');
                isValid = false;
            } else {
                field.removeAttribute('aria-invalid');
                field.classList.remove('error');
            }
        });

        return isValid;
    }

    // Monitor accessibility violations
    monitorAccessibilityViolations() {
        // Check for common violations
        this.checkColorContrast();
        this.checkFocusableElements();
        this.checkHeadingStructure();
        this.checkImageAltText();
    }

    // Check color contrast
    checkColorContrast() {
        const elements = document.querySelectorAll('*');
        elements.forEach(element => {
            const styles = window.getComputedStyle(element);
            const color = styles.color;
            const backgroundColor = styles.backgroundColor;
            
            // Basic contrast check (simplified)
            if (color !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'rgba(0, 0, 0, 0)') {
                // Implementation would include actual contrast ratio calculation
                // This is a placeholder for the concept
            }
        });
    }

    // Check focusable elements
    checkFocusableElements() {
        const interactiveElements = document.querySelectorAll('button, a, input, select, textarea, [tabindex]');
        interactiveElements.forEach(element => {
            if (element.tabIndex < 0 && !element.hasAttribute('aria-hidden')) {
                console.warn('Interactive element is not keyboard accessible:', element);
            }
        });
    }

    // Check heading structure
    checkHeadingStructure() {
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        let lastLevel = 0;

        headings.forEach(heading => {
            const level = parseInt(heading.tagName.substr(1));
            if (level > lastLevel + 1) {
                console.warn('Heading level skipped:', heading);
            }
            lastLevel = level;
        });
    }

    // Check image alt text
    checkImageAltText() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.hasAttribute('alt') && !img.hasAttribute('aria-label')) {
                console.warn('Image missing alt text:', img);
            }
        });
    }

    // Ensure element is visible
    ensureElementVisible(element) {
        const rect = element.getBoundingClientRect();
        const viewport = {
            top: 0,
            left: 0,
            bottom: window.innerHeight,
            right: window.innerWidth
        };

        if (rect.bottom > viewport.bottom || rect.top < viewport.top ||
            rect.right > viewport.right || rect.left < viewport.left) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'nearest'
            });
        }
    }

    // Close all overlays
    closeAllOverlays() {
        const overlays = document.querySelectorAll('.overlay, .modal, .dropdown');
        overlays.forEach(overlay => {
            if (overlay.classList.contains('show') || overlay.classList.contains('active')) {
                overlay.classList.remove('show', 'active');
                this.deactivateFocusTrap();
            }
        });
    }

    // Cleanup
    destroy() {
        if (this.announcer && this.announcer.parentNode) {
            this.announcer.parentNode.removeChild(this.announcer);
        }
        
        this.keyboardMap.clear();
        this.focusTrap = null;
    }
}

export default AccessibilityManager;