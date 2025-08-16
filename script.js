// 🚀 FUTURISTIC AI PORTFOLIO - INTERACTIVE JAVASCRIPT

document.addEventListener('DOMContentLoaded', function() {
    // Initialize particle background
    initParticles();
    
    // Initialize animations
    initScrollAnimations();
    initNavigation();
    initSkillBars();
    initTypewriter();
    initContactForm();
    
    // Add some interactive magic
    addInteractiveEffects();
});

// 🌟 Particle Background
function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 100,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: ['#00d4ff', '#ff006e', '#8338ec', '#06ffa5']
                },
                shape: {
                    type: 'circle',
                    stroke: {
                        width: 0,
                        color: '#000000'
                    }
                },
                opacity: {
                    value: 0.5,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 4,
                        size_min: 0.3,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#00d4ff',
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false,
                    attract: {
                        enable: false,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'repulse'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 400,
                        line_linked: {
                            opacity: 1
                        }
                    },
                    bubble: {
                        distance: 400,
                        size: 40,
                        duration: 2,
                        opacity: 8,
                        speed: 3
                    },
                    repulse: {
                        distance: 200,
                        duration: 0.4
                    },
                    push: {
                        particles_nb: 4
                    },
                    remove: {
                        particles_nb: 2
                    }
                }
            },
            retina_detect: true
        });
    }
}

// 🎯 Navigation
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(10, 10, 11, 0.98)';
            navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'rgba(10, 10, 11, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
    
    // Smooth scrolling
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            
            // Close mobile menu
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
    
    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // Active link highlighting
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// 📊 Skill Bars Animation
function initSkillBars() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillProgress = entry.target.querySelector('.skill-progress');
                const skillPercentage = entry.target.getAttribute('data-skill');
                
                if (skillProgress && skillPercentage) {
                    setTimeout(() => {
                        skillProgress.style.width = skillPercentage + '%';
                    }, 200);
                }
                
                // Add glow effect
                entry.target.style.boxShadow = '0 0 20px rgba(0, 212, 255, 0.3)';
                setTimeout(() => {
                    entry.target.style.boxShadow = '';
                }, 1000);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    skillItems.forEach(item => {
        observer.observe(item);
    });
}

// ✨ Scroll Animations
function initScrollAnimations() {
    // Intersection Observer for fade-in animations
    const observeElements = document.querySelectorAll('.experience-card, .project-card, .stat-item, .timeline-item');
    
    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Add stagger effect for multiple items
                const siblings = Array.from(entry.target.parentNode.children);
                const index = siblings.indexOf(entry.target);
                entry.target.style.transitionDelay = `${index * 0.1}s`;
                
                fadeInObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    observeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeInObserver.observe(el);
    });
    
    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const heroContent = document.querySelector('.hero-content');
        
        if (hero && scrolled < hero.offsetHeight) {
            heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
}

// ⌨️ Typewriter Effect for Titles
function initTypewriter() {
    const titleItems = document.querySelectorAll('.title-item');
    let currentIndex = 0;
    
    function showNextTitle() {
        titleItems.forEach((item, index) => {
            item.classList.remove('active');
            if (index === currentIndex) {
                item.classList.add('active');
            }
        });
        
        currentIndex = (currentIndex + 1) % titleItems.length;
    }
    
    // Initial display
    if (titleItems.length > 0) {
        titleItems[0].classList.add('active');
        setInterval(showNextTitle, 3000);
    }
}

// 📧 Contact Form
function initContactForm() {
    const form = document.querySelector('.form');
    const submitBtn = document.querySelector('.submit-btn');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Add loading state
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class=\"fas fa-spinner fa-spin\"></i> Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                // Success animation
                submitBtn.innerHTML = '<i class=\"fas fa-check\"></i> Message Sent!';
                submitBtn.style.background = 'linear-gradient(135deg, #06ffa5, #00d4ff)';
                
                // Reset form
                form.reset();
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                }, 3000);
                
                // Show success message
                showNotification('Message sent successfully! 🚀', 'success');
            }, 2000);
        });
    }
}

// 🎮 Interactive Effects
function addInteractiveEffects() {
    // Cursor trail effect
    createCursorTrail();
    
    // Card tilt effects
    addCardTiltEffects();
    
    // Floating animation for icons
    addFloatingAnimations();
    
    // Add hover sound effects (optional)
    addSoundEffects();
    
    // Keyboard shortcuts
    addKeyboardShortcuts();
}

// 🌟 Cursor Trail
function createCursorTrail() {
    const trail = [];
    const trailLength = 20;
    
    for (let i = 0; i < trailLength; i++) {
        const dot = document.createElement('div');
        dot.className = 'cursor-trail';
        dot.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: linear-gradient(45deg, #00d4ff, #ff006e);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            opacity: ${1 - i / trailLength};
            transition: all 0.1s ease;
        `;
        document.body.appendChild(dot);
        trail.push(dot);
    }
    
    let mouseX = 0, mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateTrail() {
        let x = mouseX, y = mouseY;
        
        trail.forEach((dot, index) => {
            const nextDot = trail[index + 1] || trail[0];
            dot.style.left = x + 'px';
            dot.style.top = y + 'px';
            
            if (nextDot) {
                x += (nextDot.offsetLeft - x) * 0.3;
                y += (nextDot.offsetTop - y) * 0.3;
            }
        });
        
        requestAnimationFrame(animateTrail);
    }
    
    animateTrail();
}

// 🎲 Card Tilt Effects
function addCardTiltEffects() {
    const cards = document.querySelectorAll('.experience-card, .project-card, .skill-category');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
}

// 🎈 Floating Animations
function addFloatingAnimations() {
    const floatingElements = document.querySelectorAll('.floating-icon, .social-link');
    
    floatingElements.forEach((element, index) => {
        const amplitude = 10 + Math.random() * 10;
        const frequency = 0.02 + Math.random() * 0.01;
        const offset = Math.random() * Math.PI * 2;
        
        function animate() {
            const time = Date.now() * frequency;
            const y = Math.sin(time + offset) * amplitude;
            const x = Math.cos(time * 0.5 + offset) * (amplitude * 0.5);
            
            element.style.transform += ` translate(${x}px, ${y}px)`;
            requestAnimationFrame(animate);
        }
        
        // Stagger the animations
        setTimeout(animate, index * 200);
    });
}

// 🔊 Sound Effects (Optional)
function addSoundEffects() {
    // Create audio context for sound effects
    let audioContext;
    
    function createBeep(frequency, duration) {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
    }
    
    // Add sound to buttons
    const buttons = document.querySelectorAll('.btn, .social-link, .nav-link');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            createBeep(800, 0.1);
        });
        
        button.addEventListener('click', () => {
            createBeep(600, 0.2);
        });
    });
}

// ⌨️ Keyboard Shortcuts
function addKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Alt + number keys for navigation
        if (e.altKey) {
            const sections = ['#home', '#about', '#experience', '#skills', '#projects', '#contact'];
            const key = parseInt(e.key);
            
            if (key >= 1 && key <= sections.length) {
                e.preventDefault();
                const section = document.querySelector(sections[key - 1]);
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
        
        // Escape key to close mobile menu
        if (e.key === 'Escape') {
            const navMenu = document.querySelector('.nav-menu');
            const hamburger = document.querySelector('.hamburger');
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
}

// 🔔 Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #00d4ff, #8338ec);
        color: white;
        padding: 1rem 2rem;
        border-radius: 25px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 🎨 Dynamic Color Theme
function initDynamicTheme() {
    const colors = [
        { primary: '#00d4ff', secondary: '#ff006e' },
        { primary: '#8338ec', secondary: '#06ffa5' },
        { primary: '#3a86ff', secondary: '#ffbe0b' },
        { primary: '#ff006e', secondary: '#00d4ff' }
    ];
    
    let currentTheme = 0;
    
    function changeTheme() {
        const theme = colors[currentTheme];
        document.documentElement.style.setProperty('--accent-1', theme.primary);
        document.documentElement.style.setProperty('--accent-2', theme.secondary);
        
        currentTheme = (currentTheme + 1) % colors.length;
    }
    
    // Change theme every 30 seconds
    setInterval(changeTheme, 30000);
}

// 📱 Mobile Optimizations
function initMobileOptimizations() {
    // Disable animations on mobile for better performance
    if (window.innerWidth < 768) {
        document.body.classList.add('mobile');
        
        // Reduce particle count on mobile
        if (typeof particlesJS !== 'undefined') {
            const particlesConfig = {
                particles: { number: { value: 30 } }
            };
            particlesJS('particles-js', particlesConfig);
        }
    }
    
    // Handle orientation change
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 100);
    });
}

// 🚀 Performance Monitoring
function initPerformanceMonitoring() {
    // Monitor FPS
    let fps = 0;
    let lastTime = performance.now();
    
    function measureFPS() {
        const currentTime = performance.now();
        fps = 1000 / (currentTime - lastTime);
        lastTime = currentTime;
        
        // Reduce effects if FPS is too low
        if (fps < 30) {
            document.body.classList.add('low-performance');
        }
        
        requestAnimationFrame(measureFPS);
    }
    
    measureFPS();
}

// 🎯 Scroll Progress Indicator
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #00d4ff, #ff006e, #8338ec);
        z-index: 10000;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initDynamicTheme();
    initMobileOptimizations();
    initPerformanceMonitoring();
    initScrollProgress();
});

// 🎪 Easter Eggs
document.addEventListener('keydown', (e) => {
    // Konami Code
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    let konamiIndex = 0;
    
    if (e.code === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            // Activate party mode!
            document.body.style.animation = 'rainbow 2s infinite';
            showNotification('🎉 Party Mode Activated! 🎉', 'success');
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

// Add rainbow animation
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(style);