// 🚀 SINGLE PAGE PORTFOLIO - INTERACTIVE JAVASCRIPT

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initParticles();
    initHoverEffects();
    initTooltips();
    initResponsive();
    
    // Test all functionality
    testFunctionality();
});

// 🌟 Particle Background
function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: ['#00d4ff', '#ff006e', '#8338ec', '#06ffa5']
                },
                shape: {
                    type: 'circle'
                },
                opacity: {
                    value: 0.4,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 1,
                        opacity_min: 0.1
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 2,
                        size_min: 0.3
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#00d4ff',
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 1.5,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out'
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
                    }
                },
                modes: {
                    repulse: {
                        distance: 100,
                        duration: 0.4
                    },
                    push: {
                        particles_nb: 2
                    }
                }
            },
            retina_detect: true
        });
    }
}

// ✨ Hover Effects
function initHoverEffects() {
    // Experience card flip effects
    const experienceCards = document.querySelectorAll('.experience-card');
    experienceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1)';
        });
    });

    // Skill category hover effects
    const skillCategories = document.querySelectorAll('.skill-category');
    skillCategories.forEach(category => {
        category.addEventListener('mouseenter', () => {
            // Animate skill bars on hover
            const skillBars = category.querySelectorAll('.skill-bar');
            skillBars.forEach(bar => {
                const currentWidth = bar.style.width;
                bar.style.transform = 'scaleY(1.5)';
                bar.style.boxShadow = '0 0 10px rgba(0, 212, 255, 0.5)';
            });
        });
        
        category.addEventListener('mouseleave', () => {
            const skillBars = category.querySelectorAll('.skill-bar');
            skillBars.forEach(bar => {
                bar.style.transform = 'scaleY(1)';
                bar.style.boxShadow = 'none';
            });
        });
    });

    // Project card hover effects
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const icon = card.querySelector('.project-icon');
            if (icon) {
                icon.style.transform = 'rotate(360deg) scale(1.1)';
                icon.style.transition = 'transform 0.6s ease';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('.project-icon');
            if (icon) {
                icon.style.transform = 'rotate(0deg) scale(1)';
            }
        });
    });

    // Education card slide effects
    const educationCards = document.querySelectorAll('.education-card');
    educationCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const icon = card.querySelector('.education-icon');
            if (icon) {
                icon.style.transform = 'scale(1.2)';
                icon.style.boxShadow = '0 0 15px rgba(0, 212, 255, 0.5)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('.education-icon');
            if (icon) {
                icon.style.transform = 'scale(1)';
                icon.style.boxShadow = 'none';
            }
        });
    });

    // Contact link effects
    const contactLinks = document.querySelectorAll('.contact-link');
    contactLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.transform = 'translateY(-3px) scale(1.1)';
        });
        
        link.addEventListener('mouseleave', () => {
            link.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Stats hover effects
    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const number = item.querySelector('.stat-number');
            if (number) {
                number.style.transform = 'scale(1.1)';
                number.style.textShadow = '0 0 10px rgba(0, 212, 255, 0.5)';
            }
        });
        
        item.addEventListener('mouseleave', () => {
            const number = item.querySelector('.stat-number');
            if (number) {
                number.style.transform = 'scale(1)';
                number.style.textShadow = 'none';
            }
        });
    });
}

// 💬 Tooltips
function initTooltips() {
    const tooltip = document.getElementById('tooltip');
    const elementsWithTooltips = document.querySelectorAll('[title]');
    
    elementsWithTooltips.forEach(element => {
        element.addEventListener('mouseenter', (e) => {
            const title = element.getAttribute('title');
            if (title) {
                tooltip.textContent = title;
                tooltip.style.opacity = '1';
                updateTooltipPosition(e);
                element.removeAttribute('title');
                element.setAttribute('data-title', title);
            }
        });
        
        element.addEventListener('mousemove', updateTooltipPosition);
        
        element.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
            const title = element.getAttribute('data-title');
            if (title) {
                element.setAttribute('title', title);
                element.removeAttribute('data-title');
            }
        });
    });
    
    function updateTooltipPosition(e) {
        const tooltipRect = tooltip.getBoundingClientRect();
        let x = e.clientX + 10;
        let y = e.clientY - 30;
        
        // Prevent tooltip from going off screen
        if (x + tooltipRect.width > window.innerWidth) {
            x = e.clientX - tooltipRect.width - 10;
        }
        if (y < 0) {
            y = e.clientY + 10;
        }
        
        tooltip.style.left = x + 'px';
        tooltip.style.top = y + 'px';
    }
}

// 📱 Responsive Handling
function initResponsive() {
    // Handle window resize
    window.addEventListener('resize', () => {
        // Reinitialize particles on resize
        if (window.innerWidth < 768 && typeof pJSDom !== 'undefined') {
            // Reduce particles on mobile
            if (pJSDom[0] && pJSDom[0].pJS) {
                pJSDom[0].pJS.particles.number.value = 30;
                pJSDom[0].pJS.fn.particlesRefresh();
            }
        }
    });

    // Touch device optimizations
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
        
        // Convert hover effects to tap effects on mobile
        const hoverElements = document.querySelectorAll('.experience-card, .skill-category, .project-card');
        hoverElements.forEach(element => {
            element.addEventListener('touchstart', () => {
                element.style.transform = element.style.transform.replace('scale(1)', 'scale(1.02)');
            });
            
            element.addEventListener('touchend', () => {
                setTimeout(() => {
                    element.style.transform = element.style.transform.replace('scale(1.02)', 'scale(1)');
                }, 200);
            });
        });
    }
}

// 🧪 Test All Functionality
function testFunctionality() {
    const tests = [];
    
    // Test 1: Check if all required elements exist
    tests.push({
        name: 'DOM Elements',
        test: () => {
            const requiredElements = [
                '.profile-image',
                '.contact-link',
                '.experience-card',
                '.skill-category',
                '.project-card',
                '.education-card',
                '.stat-item'
            ];
            
            return requiredElements.every(selector => {
                const elements = document.querySelectorAll(selector);
                return elements.length > 0;
            });
        }
    });
    
    // Test 2: Check if all links are valid
    tests.push({
        name: 'Links Validation',
        test: () => {
            const links = document.querySelectorAll('a[href]');
            return Array.from(links).every(link => {
                const href = link.getAttribute('href');
                return href && (
                    href.startsWith('http') || 
                    href.startsWith('mailto:') || 
                    href.startsWith('tel:') || 
                    href.startsWith('assets/')
                );
            });
        }
    });
    
    // Test 3: Check if GitHub link is correct
    tests.push({
        name: 'GitHub Link',
        test: () => {
            const githubLink = document.querySelector('a[href*="github.com"]');
            return githubLink && githubLink.href === 'https://github.com/Rayfreshh';
        }
    });
    
    // Test 4: Check if CV download link exists
    tests.push({
        name: 'CV Download',
        test: () => {
            const cvLink = document.querySelector('a[href*="CV.pdf"]');
            return cvLink && cvLink.hasAttribute('download');
        }
    });
    
    // Test 5: Check if skill percentages are visible
    tests.push({
        name: 'Skill Percentages',
        test: () => {
            const percentages = document.querySelectorAll('.percentage');
            return percentages.length > 0 && Array.from(percentages).every(p => p.textContent.includes('%'));
        }
    });
    
    // Test 6: Check if hover effects work
    tests.push({
        name: 'Hover Effects',
        test: () => {
            const hoverElements = document.querySelectorAll('.experience-card, .skill-category');
            return hoverElements.length > 0;
        }
    });
    
    // Test 7: Check responsive layout
    tests.push({
        name: 'Responsive Layout',
        test: () => {
            const mainContainer = document.querySelector('.main-container');
            return mainContainer && getComputedStyle(mainContainer).display === 'grid';
        }
    });
    
    // Run all tests
    const results = tests.map(test => ({
        name: test.name,
        passed: test.test(),
        timestamp: new Date().toISOString()
    }));
    
    // Log results
    console.group('🧪 Portfolio Functionality Tests');
    results.forEach(result => {
        const icon = result.passed ? '✅' : '❌';
        console.log(`${icon} ${result.name}: ${result.passed ? 'PASSED' : 'FAILED'}`);
    });
    
    const passedTests = results.filter(r => r.passed).length;
    const totalTests = results.length;
    
    console.log(`\n📊 Test Summary: ${passedTests}/${totalTests} tests passed`);
    
    if (passedTests === totalTests) {
        console.log('🎉 All tests passed! Portfolio is ready to go!');
        showNotification('Portfolio loaded successfully! All tests passed! 🎉', 'success');
    } else {
        console.warn('⚠️ Some tests failed. Please check the implementation.');
        showNotification('Some functionality tests failed. Check console for details.', 'warning');
    }
    
    console.groupEnd();
    
    return results;
}

// 🔔 Notification System
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #06ffa5, #00d4ff)' : 
                   type === 'warning' ? 'linear-gradient(135deg, #ffbe0b, #ff006e)' : 
                   'linear-gradient(135deg, #00d4ff, #8338ec)'};
        color: white;
        padding: 12px 20px;
        border-radius: 25px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        font-size: 0.9rem;
        font-weight: 500;
        max-width: 300px;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// 🎯 Performance Monitoring
function monitorPerformance() {
    // Monitor loading time
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`⚡ Portfolio loaded in ${loadTime.toFixed(2)}ms`);
        
        if (loadTime > 3000) {
            console.warn('⚠️ Slow loading detected. Consider optimizing assets.');
        }
    });
    
    // Monitor memory usage (if available)
    if (performance.memory) {
        setInterval(() => {
            const memory = performance.memory;
            const usedMB = Math.round(memory.usedJSHeapSize / 1048576);
            
            if (usedMB > 50) {
                console.warn(`⚠️ High memory usage detected: ${usedMB}MB`);
            }
        }, 30000); // Check every 30 seconds
    }
}

// 🔧 Utility Functions
function debounce(func, wait) {
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

// 🚀 Initialize Performance Monitoring
monitorPerformance();

// 🎉 Ready State
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Portfolio initialized successfully!');
    
    // Add loaded class for animations
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);
});

// 🛡️ Error Handling
window.addEventListener('error', (event) => {
    console.error('❌ JavaScript Error:', event.error);
    showNotification('An error occurred. Please refresh the page.', 'warning');
});

// 📱 Orientation Change
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
    }, 100);
});

// 🎯 Export for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        testFunctionality,
        showNotification
    };
}