/**
 * AI/ML Showcase Manager - Interactive elements that demonstrate AI/ML expertise
 * Creates engaging visual demonstrations of AI concepts
 */

export class AIShowcaseManager {
    constructor() {
        this.showcaseElements = new Map();
        this.animations = new Map();
        this.isActive = false;
        this.config = {
            enableNeuralNetwork: true,
            enableDataVisualization: true,
            enableInteractiveSkills: true,
            enableCodeSimulation: true,
            particleCount: 50,
            animationSpeed: 1.0
        };
    }

    async init() {
        try {
            this.createNeuralNetworkVisualization();
            this.createDataFlowAnimations();
            this.createInteractiveSkillBars();
            this.createCodeSimulation();
            this.createAITerminalEffect();
            this.setupInteractionHandlers();
            
            console.log('✅ AI Showcase Manager initialized');
        } catch (error) {
            console.error('❌ Failed to initialize AI Showcase Manager:', error);
            throw error;
        }
    }

    // Create neural network visualization background
    createNeuralNetworkVisualization() {
        if (!this.config.enableNeuralNetwork) return;

        const neuralBackground = document.createElement('div');
        neuralBackground.className = 'neural-network-background';
        neuralBackground.innerHTML = this.generateNeuralNetworkHTML();
        
        // Add to profile section
        const profileSection = document.querySelector('.profile-section');
        if (profileSection) {
            profileSection.appendChild(neuralBackground);
            this.showcaseElements.set('neuralNetwork', neuralBackground);
            this.animateNeuralNetwork(neuralBackground);
        }
    }

    // Generate neural network HTML structure
    generateNeuralNetworkHTML() {
        const layers = [4, 6, 4, 2]; // Neural network architecture
        let html = '<div class="neural-network">';
        
        layers.forEach((nodeCount, layerIndex) => {
            html += `<div class="neural-layer" data-layer="${layerIndex}">`;
            for (let i = 0; i < nodeCount; i++) {
                html += `<div class="neural-node" data-node="${i}">
                    <div class="node-core"></div>
                    <div class="node-activation"></div>
                </div>`;
            }
            html += '</div>';
        });
        
        // Add connections between layers
        html += '<div class="neural-connections">';
        for (let layer = 0; layer < layers.length - 1; layer++) {
            for (let node = 0; node < layers[layer]; node++) {
                for (let nextNode = 0; nextNode < layers[layer + 1]; nextNode++) {
                    html += `<div class="neural-connection" 
                             data-from="${layer}-${node}" 
                             data-to="${layer + 1}-${nextNode}">
                        <div class="connection-line"></div>
                        <div class="signal-pulse"></div>
                    </div>`;
                }
            }
        }
        html += '</div>';
        
        html += '</div>';
        return html;
    }

    // Animate neural network
    animateNeuralNetwork(container) {
        const nodes = container.querySelectorAll('.neural-node');
        const connections = container.querySelectorAll('.neural-connection');
        
        // Animate nodes with pulsing effect
        nodes.forEach((node, index) => {
            const delay = index * 100;
            const duration = 2000 + Math.random() * 1000;
            
            setInterval(() => {
                this.activateNode(node);
            }, duration + delay);
        });

        // Animate signal propagation
        this.startSignalPropagation(connections);
    }

    // Activate individual neural node
    activateNode(node) {
        const core = node.querySelector('.node-core');
        const activation = node.querySelector('.node-activation');
        
        // Add activation effect
        core.style.background = 'var(--primary-color)';
        core.style.boxShadow = '0 0 15px var(--primary-color)';
        activation.style.opacity = '1';
        activation.style.transform = 'scale(1.5)';
        
        // Reset after activation
        setTimeout(() => {
            core.style.background = '';
            core.style.boxShadow = '';
            activation.style.opacity = '0';
            activation.style.transform = 'scale(1)';
        }, 300);
    }

    // Start signal propagation animation
    startSignalPropagation(connections) {
        connections.forEach((connection, index) => {
            const pulse = connection.querySelector('.signal-pulse');
            const delay = index * 50;
            
            setInterval(() => {
                pulse.style.opacity = '1';
                pulse.style.transform = 'translateX(0%)';
                
                setTimeout(() => {
                    pulse.style.transform = 'translateX(100%)';
                }, 100);
                
                setTimeout(() => {
                    pulse.style.opacity = '0';
                    pulse.style.transform = 'translateX(0%)';
                }, 800);
            }, 3000 + delay);
        });
    }

    // Create data flow animations
    createDataFlowAnimations() {
        if (!this.config.enableDataVisualization) return;

        const sections = document.querySelectorAll('.section-title');
        sections.forEach(section => {
            this.addDataStreamEffect(section);
        });
    }

    // Add data stream effect to element
    addDataStreamEffect(element) {
        const dataStream = document.createElement('div');
        dataStream.className = 'data-stream';
        
        for (let i = 0; i < 20; i++) {
            const bit = document.createElement('div');
            bit.className = 'data-bit';
            bit.textContent = Math.random() > 0.5 ? '1' : '0';
            bit.style.left = Math.random() * 100 + '%';
            bit.style.animationDelay = Math.random() * 2 + 's';
            dataStream.appendChild(bit);
        }
        
        element.appendChild(dataStream);
        this.showcaseElements.set(`dataStream_${element.id || Math.random()}`, dataStream);
    }

    // Create interactive skill bars with ML-inspired features
    createInteractiveSkillBars() {
        if (!this.config.enableInteractiveSkills) return;

        const skillBars = document.querySelectorAll('.skill-bar, .language-bar');
        skillBars.forEach(bar => {
            this.enhanceSkillBar(bar);
        });
    }

    // Enhance skill bar with AI features
    enhanceSkillBar(bar) {
        const progress = bar.querySelector('.skill-progress, .language-progress');
        if (!progress) return;

        // Add gradient effect
        progress.style.background = 'var(--gradient-primary)';
        progress.style.backgroundSize = '200% 100%';
        
        // Add hover interaction
        bar.addEventListener('mouseenter', () => {
            this.activateSkillAnalysis(bar);
        });

        bar.addEventListener('mouseleave', () => {
            this.deactivateSkillAnalysis(bar);
        });

        // Add confidence indicator
        const confidence = document.createElement('div');
        confidence.className = 'skill-confidence';
        confidence.textContent = `${Math.floor(Math.random() * 15 + 85)}% confidence`;
        bar.appendChild(confidence);
    }

    // Activate skill analysis animation
    activateSkillAnalysis(bar) {
        const progress = bar.querySelector('.skill-progress, .language-progress');
        const confidence = bar.querySelector('.skill-confidence');
        
        // Simulate AI analysis
        progress.style.animation = 'skillAnalysis 2s ease-in-out infinite';
        
        if (confidence) {
            confidence.style.opacity = '1';
            confidence.style.transform = 'translateY(0)';
        }

        // Add scanning line effect
        const scanLine = document.createElement('div');
        scanLine.className = 'skill-scan-line';
        bar.appendChild(scanLine);
        
        setTimeout(() => {
            if (scanLine.parentNode) {
                scanLine.parentNode.removeChild(scanLine);
            }
        }, 2000);
    }

    // Deactivate skill analysis
    deactivateSkillAnalysis(bar) {
        const progress = bar.querySelector('.skill-progress, .language-progress');
        const confidence = bar.querySelector('.skill-confidence');
        
        progress.style.animation = '';
        
        if (confidence) {
            confidence.style.opacity = '0';
            confidence.style.transform = 'translateY(10px)';
        }
    }

    // Create code simulation effect
    createCodeSimulation() {
        if (!this.config.enableCodeSimulation) return;

        const jobTitles = document.querySelectorAll('.job-title');
        jobTitles.forEach(title => {
            if (title.textContent.includes('AI') || title.textContent.includes('ML')) {
                this.addCodeSimulation(title);
            }
        });
    }

    // Add code simulation to element
    addCodeSimulation(element) {
        const codeLines = [
            'import tensorflow as tf',
            'model = tf.keras.Sequential()',
            'model.add(Dense(128, activation="relu"))',
            'model.compile(optimizer="adam")',
            'model.fit(X_train, y_train)',
            'predictions = model.predict(X_test)'
        ];

        element.addEventListener('mouseenter', () => {
            this.startCodeAnimation(element, codeLines);
        });
    }

    // Start code animation
    startCodeAnimation(element, codeLines) {
        const overlay = document.createElement('div');
        overlay.className = 'code-simulation-overlay';
        
        const codeContainer = document.createElement('div');
        codeContainer.className = 'code-container';
        
        codeLines.forEach((line, index) => {
            setTimeout(() => {
                const codeLine = document.createElement('div');
                codeLine.className = 'code-line';
                codeLine.textContent = line;
                codeContainer.appendChild(codeLine);
                
                // Typing effect
                this.typeWriter(codeLine, line);
            }, index * 400);
        });
        
        overlay.appendChild(codeContainer);
        element.appendChild(overlay);
        
        // Remove after animation
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, codeLines.length * 400 + 2000);
    }

    // Typewriter effect
    typeWriter(element, text) {
        element.textContent = '';
        let i = 0;
        
        const timer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
            }
        }, 50);
    }

    // Create AI terminal effect
    createAITerminalEffect() {
        const nameElement = document.querySelector('.name');
        if (!nameElement) return;

        nameElement.addEventListener('click', () => {
            this.showAITerminal();
        });
    }

    // Show AI terminal simulation
    showAITerminal() {
        const terminal = document.createElement('div');
        terminal.className = 'ai-terminal';
        terminal.innerHTML = `
            <div class="terminal-header">
                <div class="terminal-title">AI System Status</div>
                <div class="terminal-close" onclick="this.parentElement.parentElement.remove()">×</div>
            </div>
            <div class="terminal-content">
                <div class="terminal-line">Initializing AI systems...</div>
                <div class="terminal-line">Loading neural networks... ✓</div>
                <div class="terminal-line">Optimizing performance... ✓</div>
                <div class="terminal-line">System ready for deployment ✓</div>
                <div class="terminal-cursor">_</div>
            </div>
        `;
        
        document.body.appendChild(terminal);
        
        // Animate terminal lines
        const lines = terminal.querySelectorAll('.terminal-line');
        lines.forEach((line, index) => {
            line.style.opacity = '0';
            setTimeout(() => {
                line.style.opacity = '1';
                this.typeWriter(line, line.textContent);
            }, index * 800);
        });
        
        // Auto close after delay
        setTimeout(() => {
            if (terminal.parentNode) {
                terminal.parentNode.removeChild(terminal);
            }
        }, 8000);
    }

    // Setup interaction handlers
    setupInteractionHandlers() {
        // Add hover effects to education items
        const educationItems = document.querySelectorAll('.education-item');
        educationItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                this.addHologramEffect(item);
            });
        });

        // Add click effects to experience items
        const experienceItems = document.querySelectorAll('.experience-item');
        experienceItems.forEach(item => {
            item.addEventListener('click', () => {
                this.showAIProjectDemo(item);
            });
        });
    }

    // Add hologram effect
    addHologramEffect(element) {
        element.classList.add('hologram-active');
        
        // Create scanning lines
        const scanLines = document.createElement('div');
        scanLines.className = 'hologram-scan-lines';
        
        for (let i = 0; i < 5; i++) {
            const line = document.createElement('div');
            line.className = 'scan-line';
            line.style.top = `${i * 20}%`;
            line.style.animationDelay = `${i * 0.1}s`;
            scanLines.appendChild(line);
        }
        
        element.appendChild(scanLines);
        
        setTimeout(() => {
            element.classList.remove('hologram-active');
            if (scanLines.parentNode) {
                scanLines.parentNode.removeChild(scanLines);
            }
        }, 2000);
    }

    // Show AI project demo
    showAIProjectDemo(item) {
        const jobTitle = item.querySelector('.job-title').textContent;
        const company = item.querySelector('.company').textContent;
        
        const demoData = {
            'AI/ML Engineer': {
                description: 'Advanced machine learning model development and deployment',
                metrics: ['95% accuracy', '0.2s inference time', '99.9% uptime'],
                technologies: ['TensorFlow', 'PyTorch', 'Docker', 'Kubernetes']
            },
            'R&D Intern - AI/ML': {
                description: 'Computer vision research for industrial quality assessment',
                metrics: ['92% detection rate', '15ms processing time', '85% efficiency gain'],
                technologies: ['OpenCV', 'YOLO', 'Scene Text Detection', 'Deep Learning']
            }
        };

        const demo = demoData[jobTitle];
        if (demo) {
            this.createProjectVisualization(demo, company);
        }
    }

    // Create project visualization
    createProjectVisualization(data, company) {
        const visualization = document.createElement('div');
        visualization.className = 'project-visualization';
        visualization.innerHTML = `
            <div class="visualization-header">
                <h3>AI Project Analysis - ${company}</h3>
                <button class="close-btn" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
            <div class="visualization-content">
                <div class="project-description">${data.description}</div>
                <div class="metrics-grid">
                    ${data.metrics.map(metric => `<div class="metric-card">${metric}</div>`).join('')}
                </div>
                <div class="tech-stack">
                    ${data.technologies.map(tech => `<div class="tech-badge">${tech}</div>`).join('')}
                </div>
                <div class="ai-visualization">
                    <div class="processing-indicator">
                        <div class="pulse-ring"></div>
                        <div class="ai-core">AI</div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(visualization);
        
        // Animate metrics
        const metrics = visualization.querySelectorAll('.metric-card');
        metrics.forEach((metric, index) => {
            setTimeout(() => {
                metric.style.opacity = '1';
                metric.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    // Handle resize
    handleResize() {
        // Recalculate positions for responsive design
        this.showcaseElements.forEach(element => {
            element.style.transform = 'none';
            // Force reflow
            element.offsetHeight;
        });
    }

    // Pause all animations
    pause() {
        this.isActive = false;
        this.animations.forEach(animation => {
            if (animation.pause) animation.pause();
        });
    }

    // Resume all animations
    resume() {
        this.isActive = true;
        this.animations.forEach(animation => {
            if (animation.play) animation.play();
        });
    }

    // Cleanup
    destroy() {
        this.showcaseElements.forEach(element => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });
        
        this.showcaseElements.clear();
        this.animations.clear();
    }
}

export default AIShowcaseManager;