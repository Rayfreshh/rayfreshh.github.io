/**
 * Skills Manager - ES6 Module Version
 * Handles skill bar interactions and animations
 */

export class SkillsManager {
    constructor() {
        this.initialized = false;
        this.skillControls = [];
        this.languageControls = [];
        this.animationFrameId = null;
    }

    // Initialize skills functionality
    async init() {
        if (this.initialized) return;
        
        console.log('🎯 Initializing Skills Manager (ES6)...');
        
        this.skillControls = document.querySelectorAll('.skill-control');
        this.languageControls = document.querySelectorAll('.language-control');
        
        await this.setupSkillControls();
        await this.setupLanguageControls();
        await this.setupSkillBarClicks();
        await this.setupLanguageBarClicks();
        
        // Animate skill bars with intersection observer
        this.setupSkillBarAnimations();
        
        this.initialized = true;
    }

    // Setup skill control interactions
    async setupSkillControls() {
        this.skillControls.forEach(control => {
            control.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const value = this.extractValueFromOnclick(control);
                this.showSkillValue(control, value);
            });

            // Add keyboard support
            control.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    control.click();
                }
            });
        });
    }

    // Extract value from onclick attribute
    extractValueFromOnclick(element) {
        const onclickStr = element.getAttribute('onclick') || '';
        const match = onclickStr.match(/(\d+)/);
        return match ? parseInt(match[1]) : 0;
    }

    // Setup language control interactions
    async setupLanguageControls() {
        this.languageControls.forEach(control => {
            control.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const value = this.extractValueFromOnclick(control);
                this.showLanguageValue(control, value);
            });

            // Add keyboard support
            control.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    control.click();
                }
            });
        });
    }

    // Setup skill bar click interactions
    async setupSkillBarClicks() {
        const skillBars = document.querySelectorAll('.skill-bar');
        skillBars.forEach(bar => {
            bar.addEventListener('click', () => {
                this.showCurrentSkillValue(bar);
            });

            bar.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.showCurrentSkillValue(bar);
                }
            });
        });
    }

    // Setup language bar click interactions
    async setupLanguageBarClicks() {
        const languageBars = document.querySelectorAll('.language-bar');
        languageBars.forEach(bar => {
            bar.addEventListener('click', () => {
                this.showCurrentLanguageValue(bar);
            });

            bar.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.showCurrentLanguageValue(bar);
                }
            });
        });
    }

    // Setup skill bar animations using Intersection Observer
    setupSkillBarAnimations() {
        if (!window.IntersectionObserver) return;

        const options = {
            threshold: 0.3,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateSkillBar(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        // Observe all skill and language progress bars
        const progressBars = document.querySelectorAll('.skill-progress, .language-progress');
        progressBars.forEach(bar => observer.observe(bar));
    }

    // Animate individual skill bar
    animateSkillBar(progressBar) {
        const targetWidth = progressBar.style.width;
        const targetValue = parseInt(targetWidth);
        
        // Reset to 0
        progressBar.style.width = '0%';
        progressBar.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
        
        // Animate to target width
        requestAnimationFrame(() => {
            progressBar.style.width = targetWidth;
        });

        // Add completion animation
        setTimeout(() => {
            progressBar.classList.add('animation-complete');
        }, 1500);
    }

    // Show skill value tooltip on control
    showSkillValue(element, value) {
        const tooltip = element.querySelector('.control-tooltip');
        if (!tooltip) return;
        
        // Position tooltip
        const rect = element.getBoundingClientRect();
        tooltip.style.position = 'fixed';
        tooltip.style.left = (rect.left + rect.width / 2) + 'px';
        tooltip.style.top = (rect.top - 35) + 'px';
        tooltip.style.transform = 'translateX(-50%)';
        
        // Show the tooltip
        tooltip.style.opacity = '1';
        tooltip.style.visibility = 'visible';
        
        // Button animation with modern CSS
        element.style.transform = 'scale(1.2)';
        element.style.color = 'var(--primary-color, #f4d03f)';
        
        // Reset after delay
        setTimeout(() => {
            element.style.transform = 'scale(1)';
            element.style.color = '';
            tooltip.style.opacity = '0';
            tooltip.style.visibility = 'hidden';
        }, 800);

        // Haptic feedback on supported devices
        this.triggerHapticFeedback();
    }

    // Show language value tooltip on control
    showLanguageValue(element, value) {
        const tooltip = element.querySelector('.control-tooltip');
        if (!tooltip) return;
        
        // Position tooltip
        const rect = element.getBoundingClientRect();
        tooltip.style.position = 'fixed';
        tooltip.style.left = (rect.left + rect.width / 2) + 'px';
        tooltip.style.top = (rect.top - 35) + 'px';
        tooltip.style.transform = 'translateX(-50%)';
        
        // Show the tooltip
        tooltip.style.opacity = '1';
        tooltip.style.visibility = 'visible';
        
        // Button animation
        element.style.transform = 'scale(1.2)';
        element.style.color = 'var(--primary-color, #f4d03f)';
        
        // Reset after delay
        setTimeout(() => {
            element.style.transform = 'scale(1)';
            element.style.color = '';
            tooltip.style.opacity = '0';
            tooltip.style.visibility = 'hidden';
        }, 800);

        this.triggerHapticFeedback();
    }

    // Show current skill value on bar hover/click
    showCurrentSkillValue(element) {
        const progress = element.querySelector('.skill-progress');
        const tooltip = element.querySelector('.skill-tooltip');
        
        if (!progress || !tooltip) return;
        
        const value = progress.getAttribute('data-value');
        
        tooltip.style.opacity = '1';
        tooltip.style.visibility = 'visible';
        tooltip.style.transform = 'translateX(-50%) scale(1.1)';
        
        setTimeout(() => {
            tooltip.style.opacity = '0';
            tooltip.style.visibility = 'hidden';
            tooltip.style.transform = 'translateX(-50%) scale(1)';
        }, 800);
    }

    // Show current language value on bar hover/click
    showCurrentLanguageValue(element) {
        const progress = element.querySelector('.language-progress');
        const tooltip = element.querySelector('.language-tooltip');
        
        if (!progress || !tooltip) return;
        
        const value = progress.getAttribute('data-value');
        
        tooltip.style.opacity = '1';
        tooltip.style.visibility = 'visible';
        tooltip.style.transform = 'translateX(-50%) scale(1.1)';
        
        setTimeout(() => {
            tooltip.style.opacity = '0';
            tooltip.style.visibility = 'hidden';
            tooltip.style.transform = 'translateX(-50%) scale(1)';
        }, 800);
    }

    // Trigger haptic feedback
    triggerHapticFeedback(type = 'light') {
        if ('vibrate' in navigator) {
            const patterns = {
                light: 10,
                medium: 20,
                heavy: 50
            };
            navigator.vibrate(patterns[type] || 10);
        }
    }

    // Update skill value programmatically with animation
    async updateSkillValue(skillName, newValue, animate = true) {
        const skillItems = document.querySelectorAll('.tool-item');
        
        for (const item of skillItems) {
            const name = item.querySelector('.tool-name')?.textContent;
            if (name === skillName) {
                const progress = item.querySelector('.skill-progress');
                const tooltip = item.querySelector('.skill-tooltip');
                
                if (progress) {
                    if (animate) {
                        await this.animateValueChange(progress, newValue);
                    } else {
                        progress.style.width = `${newValue}%`;
                    }
                    progress.setAttribute('data-value', newValue);
                }
                
                if (tooltip) {
                    tooltip.textContent = `${newValue}%`;
                }
                break;
            }
        }
    }

    // Animate value change
    animateValueChange(progressElement, newValue) {
        return new Promise((resolve) => {
            const currentValue = parseInt(progressElement.style.width) || 0;
            const difference = newValue - currentValue;
            const duration = 1000; // 1 second
            const startTime = performance.now();

            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function
                const easedProgress = 1 - Math.pow(1 - progress, 3);
                
                const currentAnimatedValue = currentValue + (difference * easedProgress);
                progressElement.style.width = `${currentAnimatedValue}%`;
                
                if (progress < 1) {
                    this.animationFrameId = requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };

            this.animationFrameId = requestAnimationFrame(animate);
        });
    }

    // Get all skill data
    getSkillData() {
        const skills = [];
        const skillItems = document.querySelectorAll('.tool-item');
        
        skillItems.forEach(item => {
            const name = item.querySelector('.tool-name')?.textContent;
            const progress = item.querySelector('.skill-progress');
            const value = progress?.getAttribute('data-value');
            
            if (name && value) {
                skills.push({
                    name,
                    proficiency: parseInt(value),
                    category: 'technical',
                    element: item
                });
            }
        });
        
        return skills;
    }

    // Get all language data
    getLanguageData() {
        const languages = [];
        const languageItems = document.querySelectorAll('.language-item');
        
        languageItems.forEach(item => {
            const name = item.querySelector('.language-name')?.textContent;
            const progress = item.querySelector('.language-progress');
            const value = progress?.getAttribute('data-value');
            
            if (name && value) {
                languages.push({
                    name,
                    proficiency: parseInt(value),
                    category: 'language',
                    element: item
                });
            }
        });
        
        return languages;
    }

    // Filter skills by proficiency level
    filterSkillsByProficiency(minLevel = 0, maxLevel = 100) {
        const skills = this.getSkillData();
        return skills.filter(skill => 
            skill.proficiency >= minLevel && skill.proficiency <= maxLevel
        );
    }

    // Search skills by name
    searchSkills(searchTerm) {
        const skills = [...this.getSkillData(), ...this.getLanguageData()];
        const term = searchTerm.toLowerCase();
        
        return skills.filter(skill => 
            skill.name.toLowerCase().includes(term)
        );
    }

    // Highlight matching skills
    highlightSkills(searchTerm) {
        const matchingSkills = this.searchSkills(searchTerm);
        
        // Clear previous highlights
        this.clearHighlights();
        
        // Highlight matching skills
        matchingSkills.forEach(skill => {
            skill.element.classList.add('highlighted');
        });
        
        return matchingSkills;
    }

    // Clear all highlights
    clearHighlights() {
        const highlightedItems = document.querySelectorAll('.highlighted');
        highlightedItems.forEach(item => {
            item.classList.remove('highlighted');
        });
    }

    // Export skills data as JSON
    exportSkillsData() {
        return {
            skills: this.getSkillData(),
            languages: this.getLanguageData(),
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
    }

    // Handle resize events
    handleResize() {
        // Recalculate tooltip positions if any are visible
        const visibleTooltips = document.querySelectorAll('.control-tooltip[style*="opacity: 1"]');
        visibleTooltips.forEach(tooltip => {
            // Reposition tooltip
            const control = tooltip.closest('.skill-control, .language-control');
            if (control) {
                const rect = control.getBoundingClientRect();
                tooltip.style.left = (rect.left + rect.width / 2) + 'px';
                tooltip.style.top = (rect.top - 35) + 'px';
            }
        });
    }

    // Cleanup method
    destroy() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        
        this.clearHighlights();
        this.skillControls = [];
        this.languageControls = [];
        this.initialized = false;
        
        console.log('🧹 Skills Manager destroyed');
    }
}

// Create singleton instance
const skillsManager = new SkillsManager();

// Export for both module and global use
export default skillsManager;