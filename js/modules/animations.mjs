/**
 * Animation Manager - Modern scroll-based animations with Intersection Observer
 * Implements AI/ML-inspired animations and smooth transitions
 */

export class AnimationManager {
    constructor() {
        this.observers = new Map();
        this.animatedElements = new Set();
        this.isSupported = 'IntersectionObserver' in window;
        this.config = {
            threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
            rootMargin: '50px 0px -50px 0px',
            enableParallax: true,
            enableNeuralEffects: true,
            performance: {
                useTransform3d: true,
                useWillChange: true,
                debounceScroll: 16
            }
        };
    }

    async init() {
        if (!this.isSupported) {
            console.warn('IntersectionObserver not supported, falling back to basic animations');
            return this.initFallbackAnimations();
        }

        try {
            await this.setupIntersectionObservers();
            this.setupNeuralNetworkAnimations();
            this.setupParallaxEffects();
            this.setupMicroInteractions();
            
            console.log('✅ Animation Manager initialized with Intersection Observer');
        } catch (error) {
            console.error('❌ Failed to initialize Animation Manager:', error);
            throw error;
        }
    }

    // Setup Intersection Observers for different animation types
    async setupIntersectionObservers() {
        // Main content animation observer
        this.observers.set('main', new IntersectionObserver(
            this.handleMainContentIntersection.bind(this),
            {
                threshold: this.config.threshold,
                rootMargin: this.config.rootMargin
            }
        ));

        // Skills animation observer (higher precision)
        this.observers.set('skills', new IntersectionObserver(
            this.handleSkillsIntersection.bind(this),
            {
                threshold: [0, 0.3, 0.7, 1],
                rootMargin: '20px 0px -20px 0px'
            }
        ));

        // Neural effects observer (AI/ML themed animations)
        this.observers.set('neural', new IntersectionObserver(
            this.handleNeuralIntersection.bind(this),
            {
                threshold: [0, 0.5, 1],
                rootMargin: '100px 0px -100px 0px'
            }
        ));

        // Start observing elements
        this.observeElements();
    }

    // Observe elements for animations
    observeElements() {
        // Main content sections
        const sections = document.querySelectorAll('.profile-section, .education-section, .experience-section, .tools-languages-column');
        sections.forEach(el => {
            this.observers.get('main')?.observe(el);
            el.setAttribute('data-animation-state', 'pending');
        });

        // Skills and progress elements
        const skillElements = document.querySelectorAll('.skill-bar, .language-bar, .tool-item, .language-item');
        skillElements.forEach(el => {
            this.observers.get('skills')?.observe(el);
            el.setAttribute('data-skill-animation', 'pending');
        });

        // Elements for neural network effects
        const neuralElements = document.querySelectorAll('.section-title, .degree-title, .job-title, .name');
        neuralElements.forEach(el => {
            this.observers.get('neural')?.observe(el);
            el.setAttribute('data-neural-effect', 'pending');
        });
    }

    // Handle main content intersection
    handleMainContentIntersection(entries) {
        entries.forEach(entry => {
            const element = entry.target;
            const ratio = entry.intersectionRatio;
            
            if (ratio > 0.1 && !this.animatedElements.has(element)) {
                this.animateElementEntry(element);
                this.animatedElements.add(element);
            }

            // Progressive enhancement based on intersection ratio
            this.updateElementOpacity(element, ratio);
            this.updateElementTransform(element, ratio);
        });
    }

    // Handle skills intersection with progressive loading
    handleSkillsIntersection(entries) {
        entries.forEach(entry => {
            const element = entry.target;
            const ratio = entry.intersectionRatio;
            
            if (ratio > 0.3) {
                this.animateSkillProgress(element);
            }

            if (ratio > 0.7) {
                this.addSkillGlowEffect(element);
            }
        });
    }

    // Handle neural network-inspired animations
    handleNeuralIntersection(entries) {
        entries.forEach(entry => {
            const element = entry.target;
            const ratio = entry.intersectionRatio;
            
            if (ratio > 0.5 && this.config.enableNeuralEffects) {
                this.addNeuralGlowEffect(element);
                this.addTypingAnimation(element);
            }
        });
    }

    // Animate element entry with modern easing
    animateElementEntry(element) {
        element.setAttribute('data-animation-state', 'animating');
        
        // Apply GPU-accelerated transform
        if (this.config.performance.useTransform3d) {
            element.style.transform = 'translate3d(0, 0, 0)';
        }

        if (this.config.performance.useWillChange) {
            element.style.willChange = 'transform, opacity';
        }

        // Determine animation type based on element
        const animationType = this.getAnimationType(element);
        
        requestAnimationFrame(() => {
            element.classList.add('animate-in', `animate-${animationType}`);
            
            // Cleanup after animation
            setTimeout(() => {
                element.style.willChange = 'auto';
                element.setAttribute('data-animation-state', 'completed');
            }, 800);
        });
    }

    // Get animation type based on element
    getAnimationType(element) {
        if (element.classList.contains('profile-section')) return 'slide-left';
        if (element.classList.contains('education-section')) return 'slide-up';
        if (element.classList.contains('experience-section')) return 'slide-up-delay';
        if (element.classList.contains('tools-languages-column')) return 'slide-right';
        return 'fade-in';
    }

    // Update element opacity based on intersection ratio
    updateElementOpacity(element, ratio) {
        const opacity = Math.min(1, Math.max(0, (ratio - 0.1) / 0.9));
        element.style.opacity = opacity;
    }

    // Update element transform based on intersection ratio
    updateElementTransform(element, ratio) {
        if (ratio === 0) return;
        
        const translateY = (1 - ratio) * 20;
        const scale = 0.95 + (ratio * 0.05);
        
        element.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
    }

    // Animate skill progress bars
    animateSkillProgress(element) {
        if (element.getAttribute('data-skill-animation') === 'completed') return;
        
        const progressBar = element.querySelector('.skill-progress, .language-progress');
        if (!progressBar) return;
        
        const targetWidth = progressBar.getAttribute('data-value') || '0';
        
        // Reset width
        progressBar.style.width = '0%';
        progressBar.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
        
        // Animate to target width
        requestAnimationFrame(() => {
            progressBar.style.width = `${targetWidth}%`;
        });
        
        // Add completion effect
        setTimeout(() => {
            progressBar.classList.add('skill-completed');
            element.setAttribute('data-skill-animation', 'completed');
        }, 1500);
    }

    // Add AI-inspired glow effect to skills
    addSkillGlowEffect(element) {
        if (element.classList.contains('has-glow-effect')) return;
        
        element.classList.add('has-glow-effect');
        
        // Create dynamic glow animation
        const glowKeyframes = [
            { boxShadow: '0 0 5px rgba(0, 229, 255, 0.3)' },
            { boxShadow: '0 0 20px rgba(0, 229, 255, 0.6), 0 0 30px rgba(0, 229, 255, 0.3)' },
            { boxShadow: '0 0 5px rgba(0, 229, 255, 0.3)' }
        ];
        
        element.animate(glowKeyframes, {
            duration: 2000,
            iterations: 3,
            easing: 'ease-in-out'
        });
    }

    // Add neural network-inspired glow effects
    addNeuralGlowEffect(element) {
        if (element.classList.contains('neural-glow-active')) return;
        
        element.classList.add('neural-glow-active');
        
        // Create neural network particle effect
        this.createNeuralParticles(element);
        
        // Add text glow animation
        const textGlowKeyframes = [
            { textShadow: '0 0 0px transparent' },
            { textShadow: '0 0 10px rgba(0, 229, 255, 0.5), 0 0 20px rgba(26, 35, 126, 0.3)' },
            { textShadow: '0 0 0px transparent' }
        ];
        
        element.animate(textGlowKeyframes, {
            duration: 3000,
            iterations: 2,
            easing: 'ease-in-out'
        });
    }

    // Create neural network particles
    createNeuralParticles(element) {
        const particleCount = 8;
        const container = document.createElement('div');
        container.className = 'neural-particles';
        container.style.position = 'absolute';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.pointerEvents = 'none';
        container.style.zIndex = '1';
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'neural-particle';
            particle.style.position = 'absolute';
            particle.style.width = '2px';
            particle.style.height = '2px';
            particle.style.backgroundColor = '#00e5ff';
            particle.style.borderRadius = '50%';
            particle.style.boxShadow = '0 0 6px #00e5ff';
            
            // Random positioning
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            
            // Animate particles
            const moveKeyframes = [
                { transform: 'translate(0, 0) scale(1)', opacity: 0 },
                { transform: `translate(${(Math.random() - 0.5) * 100}px, ${(Math.random() - 0.5) * 100}px) scale(1.5)`, opacity: 1 },
                { transform: `translate(${(Math.random() - 0.5) * 200}px, ${(Math.random() - 0.5) * 200}px) scale(0)`, opacity: 0 }
            ];
            
            particle.animate(moveKeyframes, {
                duration: 2000 + Math.random() * 1000,
                delay: Math.random() * 500,
                easing: 'ease-out'
            });
            
            container.appendChild(particle);
        }
        
        // Position container relative to element
        if (element.style.position === '' || element.style.position === 'static') {
            element.style.position = 'relative';
        }
        
        element.appendChild(container);
        
        // Cleanup after animation
        setTimeout(() => {
            if (container.parentNode) {
                container.parentNode.removeChild(container);
            }
        }, 3000);
    }

    // Add typing animation effect
    addTypingAnimation(element) {
        if (element.getAttribute('data-typing-animated') === 'true') return;
        
        const text = element.textContent;
        const words = text.split(' ');
        
        if (words.length < 2) return; // Skip single words
        
        element.setAttribute('data-typing-animated', 'true');
        element.style.overflow = 'hidden';
        element.style.borderRight = '2px solid #00e5ff';
        
        // Clear text
        element.textContent = '';
        
        let wordIndex = 0;
        const typeWord = () => {
            if (wordIndex < words.length) {
                element.textContent += (wordIndex > 0 ? ' ' : '') + words[wordIndex];
                wordIndex++;
                setTimeout(typeWord, 100 + Math.random() * 100);
            } else {
                // Remove cursor after typing complete
                setTimeout(() => {
                    element.style.borderRight = 'none';
                }, 500);
            }
        };
        
        setTimeout(typeWord, 300);
    }

    // Setup parallax effects
    setupParallaxEffects() {
        if (!this.config.enableParallax) return;
        
        const parallaxElements = document.querySelectorAll('.profile-image, .section-header');
        
        if (parallaxElements.length === 0) return;
        
        let ticking = false;
        
        const updateParallax = () => {
            parallaxElements.forEach(element => {
                const rect = element.getBoundingClientRect();
                const speed = element.getAttribute('data-parallax-speed') || 0.3;
                const yPos = -(rect.top * speed);
                
                element.style.transform = `translate3d(0, ${yPos}px, 0)`;
            });
            
            ticking = false;
        };
        
        const requestParallaxUpdate = () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };
        
        // Use throttled scroll listener
        const throttledScrollHandler = this.throttle(requestParallaxUpdate, this.config.performance.debounceScroll);
        window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    }

    // Setup micro-interactions
    setupMicroInteractions() {
        // Enhanced hover effects for interactive elements
        const interactiveElements = document.querySelectorAll(
            '.social-link, .skill-control, .language-control, .add-btn, .education-row'
        );
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.addHoverEffect(e.target);
            });
            
            element.addEventListener('mouseleave', (e) => {
                this.removeHoverEffect(e.target);
            });
            
            // Add click ripple effect
            element.addEventListener('click', (e) => {
                this.createRippleEffect(e);
            });
        });
    }

    // Add hover effect with AI/ML styling
    addHoverEffect(element) {
        if (element.classList.contains('hover-animated')) return;
        
        element.classList.add('hover-animated');
        
        // Create dynamic hover animation
        const hoverKeyframes = [
            { transform: 'scale(1)', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
            { transform: 'scale(1.05)', boxShadow: '0 8px 16px rgba(0, 229, 255, 0.3)' }
        ];
        
        element.animate(hoverKeyframes, {
            duration: 200,
            fill: 'forwards',
            easing: 'ease-out'
        });
    }

    // Remove hover effect
    removeHoverEffect(element) {
        element.classList.remove('hover-animated');
        
        const reverseKeyframes = [
            { transform: 'scale(1.05)', boxShadow: '0 8px 16px rgba(0, 229, 255, 0.3)' },
            { transform: 'scale(1)', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }
        ];
        
        element.animate(reverseKeyframes, {
            duration: 200,
            fill: 'forwards',
            easing: 'ease-out'
        });
    }

    // Create ripple effect on click
    createRippleEffect(event) {
        const element = event.currentTarget;
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(0, 229, 255, 0.3)';
        ripple.style.transform = 'scale(0)';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.width = size + 'px';
        ripple.style.height = size + 'px';
        ripple.style.pointerEvents = 'none';
        
        // Ensure element can contain the ripple
        if (element.style.position === '' || element.style.position === 'static') {
            element.style.position = 'relative';
        }
        if (element.style.overflow !== 'visible') {
            element.style.overflow = 'hidden';
        }
        
        element.appendChild(ripple);
        
        // Animate ripple
        ripple.animate([
            { transform: 'scale(0)', opacity: 1 },
            { transform: 'scale(1)', opacity: 0 }
        ], {
            duration: 600,
            easing: 'ease-out'
        }).onfinish = () => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        };
    }

    // Fallback animations for unsupported browsers
    initFallbackAnimations() {
        const elements = document.querySelectorAll('.profile-section, .education-section, .experience-section, .tools-languages-column');
        
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200);
        });
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

    // Handle resize
    handleResize() {
        // Recalculate observer thresholds if needed
        this.setupIntersectionObservers();
    }

    // Pause animations
    pause() {
        this.observers.forEach(observer => observer.disconnect());
    }

    // Resume animations
    resume() {
        this.observeElements();
    }

    // Cleanup
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        this.animatedElements.clear();
        
        // Remove event listeners
        window.removeEventListener('scroll', this.throttledScrollHandler);
    }
}

export default AnimationManager;