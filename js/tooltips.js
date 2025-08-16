/**
 * Tooltip Manager - Handles tooltip positioning and display logic
 */

const TooltipManager = {
    initialized: false,
    tooltips: [],
    
    // Initialize tooltip functionality
    init() {
        if (this.initialized) return;
        
        console.log('💬 Initializing Tooltip Manager...');
        
        this.setupTooltips();
        this.setupGlobalTooltipEvents();
        
        this.initialized = true;
    },
    
    // Setup all tooltips in the page
    setupTooltips() {
        // Control tooltips (skill controls)
        this.tooltips = document.querySelectorAll('.control-tooltip');
        
        // Skill/Language bar tooltips
        const skillTooltips = document.querySelectorAll('.skill-tooltip, .language-tooltip');
        skillTooltips.forEach(tooltip => {
            this.tooltips = [...this.tooltips, tooltip];
        });
        
        // Setup hover events for skill bars
        this.setupSkillBarTooltips();
        this.setupLanguageBarTooltips();
    },
    
    // Setup skill bar tooltip events
    setupSkillBarTooltips() {
        const skillBars = document.querySelectorAll('.skill-bar');
        
        skillBars.forEach(bar => {
            const tooltip = bar.querySelector('.skill-tooltip');
            if (!tooltip) return;
            
            bar.addEventListener('mouseenter', () => {
                this.showTooltip(tooltip, bar);
            });
            
            bar.addEventListener('mouseleave', () => {
                this.hideTooltip(tooltip);
            });
        });
    },
    
    // Setup language bar tooltip events
    setupLanguageBarTooltips() {
        const languageBars = document.querySelectorAll('.language-bar');
        
        languageBars.forEach(bar => {
            const tooltip = bar.querySelector('.language-tooltip');
            if (!tooltip) return;
            
            bar.addEventListener('mouseenter', () => {
                this.showTooltip(tooltip, bar);
            });
            
            bar.addEventListener('mouseleave', () => {
                this.hideTooltip(tooltip);
            });
        });
    },
    
    // Show tooltip with proper positioning
    showTooltip(tooltip, element) {
        if (!tooltip || !element) return;
        
        // Position tooltip
        this.positionTooltip(tooltip, element);
        
        // Show tooltip
        tooltip.style.opacity = '1';
        tooltip.style.visibility = 'visible';
        
        // Add animation class
        tooltip.classList.add('tooltip-show');
    },
    
    // Hide tooltip
    hideTooltip(tooltip) {
        if (!tooltip) return;
        
        tooltip.style.opacity = '0';
        tooltip.style.visibility = 'hidden';
        tooltip.classList.remove('tooltip-show');
    },
    
    // Position tooltip relative to element
    positionTooltip(tooltip, element) {
        if (!tooltip || !element) return;
        
        const rect = element.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        
        // Check if tooltip is a control tooltip (fixed positioning)
        if (tooltip.classList.contains('control-tooltip')) {
            // Use fixed positioning for control tooltips
            tooltip.style.position = 'fixed';
            tooltip.style.left = (rect.left + rect.width / 2) + 'px';
            tooltip.style.top = (rect.top - 35) + 'px';
            tooltip.style.transform = 'translateX(-50%)';
        } else {
            // Use absolute positioning for bar tooltips
            tooltip.style.position = 'absolute';
            tooltip.style.left = '50%';
            tooltip.style.top = '-30px';
            tooltip.style.transform = 'translateX(-50%)';
        }
        
        // Boundary checks to keep tooltip in viewport
        this.adjustTooltipPosition(tooltip, rect);
    },
    
    // Adjust tooltip position to stay within viewport
    adjustTooltipPosition(tooltip, elementRect) {
        const tooltipRect = tooltip.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Horizontal boundary check
        if (tooltipRect.left < 0) {
            tooltip.style.left = '10px';
            tooltip.style.transform = 'none';
        } else if (tooltipRect.right > viewportWidth) {
            tooltip.style.left = (viewportWidth - tooltipRect.width - 10) + 'px';
            tooltip.style.transform = 'none';
        }
        
        // Vertical boundary check
        if (tooltipRect.top < 0) {
            // Show below element instead
            if (tooltip.classList.contains('control-tooltip')) {
                tooltip.style.top = (elementRect.bottom + 10) + 'px';
            } else {
                tooltip.style.top = '30px';
            }
        }
    },
    
    // Setup global tooltip events
    setupGlobalTooltipEvents() {
        // Hide tooltips on scroll
        window.addEventListener('scroll', () => {
            this.hideAllTooltips();
        }, { passive: true });
        
        // Hide tooltips on window resize
        window.addEventListener('resize', () => {
            this.hideAllTooltips();
        });
        
        // Hide tooltips on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideAllTooltips();
            }
        });
    },
    
    // Hide all visible tooltips
    hideAllTooltips() {
        this.tooltips.forEach(tooltip => {
            this.hideTooltip(tooltip);
        });
    },
    
    // Create dynamic tooltip
    createTooltip(element, content, options = {}) {
        const tooltip = document.createElement('div');
        tooltip.className = 'dynamic-tooltip';
        tooltip.textContent = content;
        
        // Apply custom styles
        Object.assign(tooltip.style, {
            position: 'fixed',
            background: options.background || 'var(--text-color)',
            color: options.color || 'var(--white)',
            padding: options.padding || '8px 12px',
            borderRadius: options.borderRadius || 'var(--border-radius)',
            fontSize: options.fontSize || 'var(--font-size-sm)',
            whiteSpace: 'nowrap',
            zIndex: 'var(--z-tooltip)',
            opacity: '0',
            visibility: 'hidden',
            transition: 'all var(--transition-fast)',
            pointerEvents: 'none'
        });
        
        document.body.appendChild(tooltip);
        
        // Position and show
        this.positionTooltip(tooltip, element);
        this.showTooltip(tooltip, element);
        
        return tooltip;
    },
    
    // Remove dynamic tooltip
    removeTooltip(tooltip) {
        if (tooltip && tooltip.parentNode) {
            this.hideTooltip(tooltip);
            setTimeout(() => {
                tooltip.parentNode.removeChild(tooltip);
            }, 200);
        }
    },
    
    // Update tooltip content
    updateTooltipContent(tooltip, newContent) {
        if (tooltip) {
            tooltip.textContent = newContent;
        }
    },
    
    // Get tooltip data for analytics
    getTooltipData() {
        const data = [];
        
        this.tooltips.forEach(tooltip => {
            if (tooltip.textContent) {
                data.push({
                    content: tooltip.textContent,
                    type: tooltip.className,
                    visible: tooltip.style.opacity === '1'
                });
            }
        });
        
        return data;
    },
    
    // Check if device supports hover
    supportsHover() {
        return window.matchMedia('(hover: hover)').matches;
    },
    
    // Mobile-friendly tooltip handling
    handleMobileTooltips() {
        if (!this.supportsHover()) {
            // Convert hover tooltips to click tooltips on mobile
            const hoverElements = document.querySelectorAll('[data-tooltip]');
            
            hoverElements.forEach(element => {
                element.addEventListener('click', (e) => {
                    e.preventDefault();
                    const content = element.getAttribute('data-tooltip');
                    const existingTooltip = document.querySelector('.mobile-tooltip');
                    
                    if (existingTooltip) {
                        this.removeTooltip(existingTooltip);
                    } else {
                        const tooltip = this.createTooltip(element, content);
                        tooltip.classList.add('mobile-tooltip');
                        
                        // Auto-hide after 3 seconds
                        setTimeout(() => {
                            this.removeTooltip(tooltip);
                        }, 3000);
                    }
                });
            });
        }
    },
    
    // Cleanup method
    destroy() {
        this.hideAllTooltips();
        this.tooltips = [];
        this.initialized = false;
    }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TooltipManager;
}

// Make available globally
window.TooltipManager = TooltipManager;