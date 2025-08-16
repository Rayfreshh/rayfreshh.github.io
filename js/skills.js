/**
 * Skills Manager - Handles skill bar interactions and animations
 */

const SkillsManager = {
    initialized: false,
    skillControls: [],
    languageControls: [],
    
    // Initialize skills functionality
    init() {
        if (this.initialized) return;
        
        console.log('🎯 Initializing Skills Manager...');
        
        this.skillControls = document.querySelectorAll('.skill-control');
        this.languageControls = document.querySelectorAll('.language-control');
        
        this.setupSkillControls();
        this.setupLanguageControls();
        this.setupSkillBarClicks();
        this.setupLanguageBarClicks();
        
        this.initialized = true;
    },
    
    // Setup skill control interactions
    setupSkillControls() {
        this.skillControls.forEach(control => {
            control.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const value = control.onclick.toString().match(/(\d+)/)?.[1] || '0';
                this.showSkillValue(control, parseInt(value));
            });
        });
    },
    
    // Setup language control interactions
    setupLanguageControls() {
        this.languageControls.forEach(control => {
            control.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const value = control.onclick.toString().match(/(\d+)/)?.[1] || '0';
                this.showLanguageValue(control, parseInt(value));
            });
        });
    },
    
    // Setup skill bar click interactions
    setupSkillBarClicks() {
        const skillBars = document.querySelectorAll('.skill-bar');
        skillBars.forEach(bar => {
            bar.addEventListener('click', () => {
                this.showCurrentSkillValue(bar);
            });
        });
    },
    
    // Setup language bar click interactions
    setupLanguageBarClicks() {
        const languageBars = document.querySelectorAll('.language-bar');
        languageBars.forEach(bar => {
            bar.addEventListener('click', () => {
                this.showCurrentLanguageValue(bar);
            });
        });
    },
    
    // Show skill value tooltip on control
    showSkillValue(element, value) {
        const tooltip = element.querySelector('.control-tooltip');
        if (!tooltip) return;
        
        // Position tooltip above the button
        const rect = element.getBoundingClientRect();
        tooltip.style.left = (rect.left + rect.width / 2) + 'px';
        tooltip.style.top = (rect.top - 35) + 'px';
        tooltip.style.transform = 'translateX(-50%)';
        
        // Show the tooltip
        tooltip.style.opacity = '1';
        
        // Button animation
        element.style.transform = 'scale(1.2)';
        element.style.color = 'var(--primary-color)';
        
        // Reset after delay
        setTimeout(() => {
            element.style.transform = 'scale(1)';
            element.style.color = '';
            tooltip.style.opacity = '0';
        }, 800);
    },
    
    // Show language value tooltip on control
    showLanguageValue(element, value) {
        const tooltip = element.querySelector('.control-tooltip');
        if (!tooltip) return;
        
        // Position tooltip above the button
        const rect = element.getBoundingClientRect();
        tooltip.style.left = (rect.left + rect.width / 2) + 'px';
        tooltip.style.top = (rect.top - 35) + 'px';
        tooltip.style.transform = 'translateX(-50%)';
        
        // Show the tooltip
        tooltip.style.opacity = '1';
        
        // Button animation
        element.style.transform = 'scale(1.2)';
        element.style.color = 'var(--primary-color)';
        
        // Reset after delay
        setTimeout(() => {
            element.style.transform = 'scale(1)';
            element.style.color = '';
            tooltip.style.opacity = '0';
        }, 800);
    },
    
    // Show current skill value on bar hover/click
    showCurrentSkillValue(element) {
        const progress = element.querySelector('.skill-progress');
        const tooltip = element.querySelector('.skill-tooltip');
        
        if (!progress || !tooltip) return;
        
        const value = progress.getAttribute('data-value');
        
        tooltip.style.opacity = '1';
        tooltip.style.transform = 'translateX(-50%) scale(1.1)';
        
        setTimeout(() => {
            tooltip.style.opacity = '0';
            tooltip.style.transform = 'translateX(-50%) scale(1)';
        }, 800);
    },
    
    // Show current language value on bar hover/click
    showCurrentLanguageValue(element) {
        const progress = element.querySelector('.language-progress');
        const tooltip = element.querySelector('.language-tooltip');
        
        if (!progress || !tooltip) return;
        
        const value = progress.getAttribute('data-value');
        
        tooltip.style.opacity = '1';
        tooltip.style.transform = 'translateX(-50%) scale(1.1)';
        
        setTimeout(() => {
            tooltip.style.opacity = '0';
            tooltip.style.transform = 'translateX(-50%) scale(1)';
        }, 800);
    },
    
    // Animate skill bars on page load
    animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        skillBars.forEach((bar, index) => {
            const targetWidth = bar.style.width;
            bar.style.width = '0%';
            
            setTimeout(() => {
                bar.style.transition = 'width 1s ease-out';
                bar.style.width = targetWidth;
            }, index * 100);
        });
    },
    
    // Animate language bars on page load
    animateLanguageBars() {
        const languageBars = document.querySelectorAll('.language-progress');
        
        languageBars.forEach((bar, index) => {
            const targetWidth = bar.style.width;
            bar.style.width = '0%';
            
            setTimeout(() => {
                bar.style.transition = 'width 1s ease-out';
                bar.style.width = targetWidth;
            }, index * 100 + 500); // Delay after skill bars
        });
    },
    
    // Highlight skills based on search/filter
    highlightSkills(searchTerm) {
        const skillItems = document.querySelectorAll('.tool-item, .language-item');
        
        skillItems.forEach(item => {
            const name = item.querySelector('.tool-name, .language-name')?.textContent.toLowerCase();
            const matches = name?.includes(searchTerm.toLowerCase());
            
            if (matches) {
                item.classList.add('highlighted');
            } else {
                item.classList.remove('highlighted');
            }
        });
    },
    
    // Clear skill highlights
    clearHighlights() {
        const highlightedItems = document.querySelectorAll('.highlighted');
        highlightedItems.forEach(item => {
            item.classList.remove('highlighted');
        });
    },
    
    // Get skill data for analytics or export
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
                    category: 'technical'
                });
            }
        });
        
        return skills;
    },
    
    // Get language data for analytics or export
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
                    category: 'language'
                });
            }
        });
        
        return languages;
    },
    
    // Update skill value programmatically
    updateSkillValue(skillName, newValue) {
        const skillItems = document.querySelectorAll('.tool-item');
        
        skillItems.forEach(item => {
            const name = item.querySelector('.tool-name')?.textContent;
            if (name === skillName) {
                const progress = item.querySelector('.skill-progress');
                const tooltip = item.querySelector('.skill-tooltip');
                
                if (progress) {
                    progress.style.width = `${newValue}%`;
                    progress.setAttribute('data-value', newValue);
                }
                
                if (tooltip) {
                    tooltip.textContent = `${newValue}%`;
                }
            }
        });
    },
    
    // Cleanup method
    destroy() {
        this.skillControls = [];
        this.languageControls = [];
        this.initialized = false;
    }
};

// Global functions for backward compatibility
window.showSkillValue = (element, value) => SkillsManager.showSkillValue(element, value);
window.showLanguageValue = (element, value) => SkillsManager.showLanguageValue(element, value);
window.showCurrentSkillValue = (element) => SkillsManager.showCurrentSkillValue(element);
window.showCurrentLanguageValue = (element) => SkillsManager.showCurrentLanguageValue(element);

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SkillsManager;
}

// Make available globally
window.SkillsManager = SkillsManager;