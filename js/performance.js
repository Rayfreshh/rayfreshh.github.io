/**
 * Performance Monitor - Tracks and optimizes website performance
 */

const PerformanceMonitor = {
    initialized: false,
    metrics: {},
    
    // Initialize performance monitoring
    init() {
        if (this.initialized) return;
        
        console.log('📊 Initializing Performance Monitor...');
        
        this.setupPerformanceObserver();
        this.measureLoadTimes();
        this.setupResourceObserver();
        this.setupUserTimingObserver();
        this.trackCoreWebVitals();
        
        this.initialized = true;
    },
    
    // Setup Performance Observer for navigation timing
    setupPerformanceObserver() {
        if (!window.PerformanceObserver) return;
        
        try {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (entry.entryType === 'navigation') {
                        this.processNavigationTiming(entry);
                    }
                });
            });
            
            observer.observe({ entryTypes: ['navigation'] });
        } catch (error) {
            console.warn('PerformanceObserver not supported:', error);
        }
    },
    
    // Process navigation timing data
    processNavigationTiming(entry) {
        this.metrics.navigation = {
            domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
            loadComplete: entry.loadEventEnd - entry.loadEventStart,
            domInteractive: entry.domInteractive - entry.navigationStart,
            firstPaint: this.getFirstPaint(),
            firstContentfulPaint: this.getFirstContentfulPaint()
        };
        
        console.log('📈 Navigation Metrics:', this.metrics.navigation);
    },
    
    // Measure critical loading times
    measureLoadTimes() {
        // Mark start times
        performance.mark('portfolio-start');
        
        // Measure when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                performance.mark('portfolio-dom-ready');
                performance.measure('portfolio-dom-load', 'portfolio-start', 'portfolio-dom-ready');
            });
        }
        
        // Measure when everything is loaded
        window.addEventListener('load', () => {
            performance.mark('portfolio-loaded');
            performance.measure('portfolio-full-load', 'portfolio-start', 'portfolio-loaded');
            
            this.analyzeLoadMetrics();
        });
    },
    
    // Setup resource loading observer
    setupResourceObserver() {
        if (!window.PerformanceObserver) return;
        
        try {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                this.analyzeResourceLoading(entries);
            });
            
            observer.observe({ entryTypes: ['resource'] });
        } catch (error) {
            console.warn('Resource observer setup failed:', error);
        }
    },
    
    // Analyze resource loading performance
    analyzeResourceLoading(entries) {
        const resources = {
            css: [],
            js: [],
            images: [],
            fonts: [],
            other: []
        };
        
        entries.forEach(entry => {
            const type = this.getResourceType(entry.name);
            const resourceData = {
                name: entry.name,
                duration: entry.duration,
                size: entry.transferSize || entry.encodedBodySize,
                cached: entry.transferSize === 0 && entry.decodedBodySize > 0
            };
            
            resources[type].push(resourceData);
        });
        
        this.metrics.resources = resources;
        this.identifySlowResources(resources);
    },
    
    // Identify slow-loading resources
    identifySlowResources(resources) {
        const slowThreshold = 1000; // 1 second
        
        Object.keys(resources).forEach(type => {
            const slowResources = resources[type].filter(resource => 
                resource.duration > slowThreshold && !resource.cached
            );
            
            if (slowResources.length > 0) {
                console.warn(`⚠️  Slow ${type} resources:`, slowResources);
                this.suggestOptimizations(type, slowResources);
            }
        });
    },
    
    // Suggest performance optimizations
    suggestOptimizations(type, slowResources) {
        const suggestions = {
            css: [
                'Consider minifying CSS files',
                'Implement critical CSS inlining',
                'Use CSS-in-JS for component-specific styles'
            ],
            js: [
                'Implement code splitting',
                'Use lazy loading for non-critical scripts',
                'Consider using a bundler like Webpack or Rollup'
            ],
            images: [
                'Optimize image formats (WebP, AVIF)',
                'Implement responsive images with srcset',
                'Use lazy loading for below-the-fold images'
            ],
            fonts: [
                'Use font-display: swap',
                'Preload critical fonts',
                'Consider using system fonts'
            ]
        };
        
        console.log(`💡 Optimization suggestions for ${type}:`, suggestions[type] || []);
    },
    
    // Setup user timing observer
    setupUserTimingObserver() {
        if (!window.PerformanceObserver) return;
        
        try {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    console.log(`⏱️  ${entry.name}: ${entry.duration.toFixed(2)}ms`);
                });
            });
            
            observer.observe({ entryTypes: ['measure'] });
        } catch (error) {
            console.warn('User timing observer setup failed:', error);
        }
    },
    
    // Track Core Web Vitals
    trackCoreWebVitals() {
        // First Contentful Paint (FCP)
        this.observeMetric('first-contentful-paint', (entry) => {
            this.metrics.fcp = entry.value;
            console.log(`🎨 First Contentful Paint: ${entry.value.toFixed(2)}ms`);
        });
        
        // Largest Contentful Paint (LCP)
        this.observeMetric('largest-contentful-paint', (entry) => {
            this.metrics.lcp = entry.value;
            console.log(`🖼️  Largest Contentful Paint: ${entry.value.toFixed(2)}ms`);
        });
        
        // First Input Delay (FID)
        this.observeMetric('first-input', (entry) => {
            this.metrics.fid = entry.processingStart - entry.startTime;
            console.log(`👆 First Input Delay: ${this.metrics.fid.toFixed(2)}ms`);
        });
        
        // Cumulative Layout Shift (CLS)
        this.observeMetric('layout-shift', (entry) => {
            if (!entry.hadRecentInput) {
                this.metrics.cls = (this.metrics.cls || 0) + entry.value;
                console.log(`📐 Cumulative Layout Shift: ${this.metrics.cls.toFixed(4)}`);
            }
        });
    },
    
    // Generic metric observer
    observeMetric(metricName, callback) {
        if (!window.PerformanceObserver) return;
        
        try {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(callback);
            });
            
            observer.observe({ entryTypes: [metricName] });
        } catch (error) {
            console.warn(`Failed to observe ${metricName}:`, error);
        }
    },
    
    // Get First Paint timing
    getFirstPaint() {
        const paintEntries = performance.getEntriesByType('paint');
        const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
        return firstPaint ? firstPaint.startTime : null;
    },
    
    // Get First Contentful Paint timing
    getFirstContentfulPaint() {
        const paintEntries = performance.getEntriesByType('paint');
        const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        return fcp ? fcp.startTime : null;
    },
    
    // Determine resource type from URL
    getResourceType(url) {
        if (url.includes('.css')) return 'css';
        if (url.includes('.js')) return 'js';
        if (/\.(jpg|jpeg|png|gif|webp|svg)/.test(url)) return 'images';
        if (/\.(woff|woff2|ttf|otf)/.test(url)) return 'fonts';
        return 'other';
    },
    
    // Analyze load metrics
    analyzeLoadMetrics() {
        const measures = performance.getEntriesByType('measure');
        
        measures.forEach(measure => {
            if (measure.name.startsWith('portfolio-')) {
                console.log(`📊 ${measure.name}: ${measure.duration.toFixed(2)}ms`);
            }
        });
        
        this.generatePerformanceReport();
    },
    
    // Generate comprehensive performance report
    generatePerformanceReport() {
        const report = {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            connection: this.getConnectionInfo(),
            metrics: this.metrics,
            recommendations: this.generateRecommendations()
        };
        
        console.log('📈 Performance Report:', report);
        
        // Store report for analytics (if needed)
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('portfolio-performance', JSON.stringify(report));
        }
        
        return report;
    },
    
    // Get network connection info
    getConnectionInfo() {
        if (navigator.connection) {
            return {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                rtt: navigator.connection.rtt,
                saveData: navigator.connection.saveData
            };
        }
        return null;
    },
    
    // Generate performance recommendations
    generateRecommendations() {
        const recommendations = [];
        
        if (this.metrics.fcp > 2500) {
            recommendations.push('Consider optimizing critical rendering path for faster FCP');
        }
        
        if (this.metrics.lcp > 4000) {
            recommendations.push('Optimize largest contentful element (likely the profile image)');
        }
        
        if (this.metrics.fid > 100) {
            recommendations.push('Reduce JavaScript execution time during initial load');
        }
        
        if (this.metrics.cls > 0.1) {
            recommendations.push('Stabilize layout shifts by setting dimensions for dynamic content');
        }
        
        return recommendations;
    },
    
    // Monitor specific function performance
    measureFunction(fn, name) {
        return function(...args) {
            performance.mark(`${name}-start`);
            const result = fn.apply(this, args);
            performance.mark(`${name}-end`);
            performance.measure(name, `${name}-start`, `${name}-end`);
            return result;
        };
    },
    
    // Monitor async function performance
    measureAsyncFunction(fn, name) {
        return async function(...args) {
            performance.mark(`${name}-start`);
            const result = await fn.apply(this, args);
            performance.mark(`${name}-end`);
            performance.measure(name, `${name}-start`, `${name}-end`);
            return result;
        };
    },
    
    // Get current performance score
    getPerformanceScore() {
        const scores = {
            fcp: this.scoreFCP(this.metrics.fcp),
            lcp: this.scoreLCP(this.metrics.lcp),
            fid: this.scoreFID(this.metrics.fid),
            cls: this.scoreCLS(this.metrics.cls)
        };
        
        const overallScore = Object.values(scores)
            .filter(score => score !== null)
            .reduce((sum, score) => sum + score, 0) / 
            Object.values(scores).filter(score => score !== null).length;
        
        return {
            overall: Math.round(overallScore),
            breakdown: scores
        };
    },
    
    // Score individual metrics
    scoreFCP(fcp) {
        if (!fcp) return null;
        if (fcp < 1800) return 100;
        if (fcp < 3000) return 50;
        return 0;
    },
    
    scoreLCP(lcp) {
        if (!lcp) return null;
        if (lcp < 2500) return 100;
        if (lcp < 4000) return 50;
        return 0;
    },
    
    scoreFID(fid) {
        if (!fid) return null;
        if (fid < 100) return 100;
        if (fid < 300) return 50;
        return 0;
    },
    
    scoreCLS(cls) {
        if (cls === undefined) return null;
        if (cls < 0.1) return 100;
        if (cls < 0.25) return 50;
        return 0;
    }
};

// Auto-initialize in development mode
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    PerformanceMonitor.init();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceMonitor;
}

// Make available globally
window.PerformanceMonitor = PerformanceMonitor;