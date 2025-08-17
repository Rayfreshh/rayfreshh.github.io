/**
 * Performance Monitor - Core Web Vitals tracking and optimization
 * Monitors and reports on key performance metrics
 */

export class PerformanceMonitor {
    constructor() {
        this.metrics = new Map();
        this.observers = new Map();
        this.config = {
            enableLogging: true,
            enableReporting: false,
            reportingEndpoint: null,
            samplingRate: 1.0, // 100% of sessions
            thresholds: {
                FCP: 1800, // First Contentful Paint
                LCP: 2500, // Largest Contentful Paint
                FID: 100,  // First Input Delay
                CLS: 0.1,  // Cumulative Layout Shift
                TTFB: 800  // Time to First Byte
            }
        };
        this.isSupported = 'PerformanceObserver' in window;
        this.navigationStartTime = performance.now();
    }

    async init() {
        if (!this.isSupported) {
            console.warn('PerformanceObserver not supported, using fallback metrics');
            return this.initFallbackMetrics();
        }

        try {
            this.setupPerformanceObservers();
            this.measureNavigationTiming();
            this.measureResourceTiming();
            this.setupWebVitalsTracking();
            this.startMemoryMonitoring();
            
            console.log('✅ Performance Monitor initialized');
        } catch (error) {
            console.error('❌ Failed to initialize Performance Monitor:', error);
            throw error;
        }
    }

    // Setup Performance Observers for different metrics
    setupPerformanceObservers() {
        // Largest Contentful Paint (LCP)
        if ('PerformanceObserver' in window) {
            this.observers.set('lcp', new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.recordMetric('LCP', lastEntry.startTime, {
                    element: lastEntry.element?.tagName || 'Unknown',
                    url: lastEntry.url || 'N/A'
                });
            }));

            this.observers.get('lcp')?.observe({ entryTypes: ['largest-contentful-paint'] });
        }

        // First Input Delay (FID)
        if ('PerformanceObserver' in window) {
            this.observers.set('fid', new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    this.recordMetric('FID', entry.processingStart - entry.startTime, {
                        eventType: entry.name,
                        target: entry.target?.tagName || 'Unknown'
                    });
                });
            }));

            this.observers.get('fid')?.observe({ entryTypes: ['first-input'] });
        }

        // Cumulative Layout Shift (CLS)
        if ('PerformanceObserver' in window) {
            let clsValue = 0;
            
            this.observers.set('cls', new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
                
                this.recordMetric('CLS', clsValue, {
                    sessionLength: performance.now() - this.navigationStartTime
                });
            }));

            this.observers.get('cls')?.observe({ entryTypes: ['layout-shift'] });
        }

        // Long Tasks
        if ('PerformanceObserver' in window) {
            this.observers.set('longtask', new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    this.recordMetric('Long Task', entry.duration, {
                        startTime: entry.startTime,
                        attribution: entry.attribution || []
                    });
                });
            }));

            this.observers.get('longtask')?.observe({ entryTypes: ['longtask'] });
        }
    }

    // Measure navigation timing metrics
    measureNavigationTiming() {
        if (!('getEntriesByType' in performance)) return;

        const navigationEntry = performance.getEntriesByType('navigation')[0];
        if (!navigationEntry) return;

        // Time to First Byte (TTFB)
        const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
        this.recordMetric('TTFB', ttfb);

        // DOM Content Loaded
        const domContentLoaded = navigationEntry.domContentLoadedEventEnd - navigationEntry.domContentLoadedEventStart;
        this.recordMetric('DOM Content Loaded', domContentLoaded);

        // Load Event
        const loadEvent = navigationEntry.loadEventEnd - navigationEntry.loadEventStart;
        this.recordMetric('Load Event', loadEvent);

        // DNS Lookup
        const dnsLookup = navigationEntry.domainLookupEnd - navigationEntry.domainLookupStart;
        this.recordMetric('DNS Lookup', dnsLookup);

        // TCP Connection
        const tcpConnection = navigationEntry.connectEnd - navigationEntry.connectStart;
        this.recordMetric('TCP Connection', tcpConnection);

        // Request/Response
        const requestResponse = navigationEntry.responseEnd - navigationEntry.requestStart;
        this.recordMetric('Request/Response', requestResponse);
    }

    // Measure resource timing
    measureResourceTiming() {
        if (!('getEntriesByType' in performance)) return;

        const resourceEntries = performance.getEntriesByType('resource');
        
        let totalResourceTime = 0;
        let imageCount = 0;
        let cssCount = 0;
        let jsCount = 0;
        
        resourceEntries.forEach(entry => {
            const duration = entry.responseEnd - entry.startTime;
            totalResourceTime += duration;
            
            if (entry.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
                imageCount++;
            } else if (entry.name.match(/\.css$/i)) {
                cssCount++;
            } else if (entry.name.match(/\.js$/i)) {
                jsCount++;
            }
        });

        this.recordMetric('Total Resource Time', totalResourceTime);
        this.recordMetric('Resource Count', resourceEntries.length, {
            images: imageCount,
            css: cssCount,
            javascript: jsCount
        });
    }

    // Setup Web Vitals tracking
    setupWebVitalsTracking() {
        // First Contentful Paint (FCP)
        this.measureFCP();
        
        // Custom performance markers
        this.addPerformanceMarkers();
        
        // Page load complete callback
        if (document.readyState === 'complete') {
            this.onPageLoadComplete();
        } else {
            window.addEventListener('load', () => this.onPageLoadComplete());
        }
    }

    // Measure First Contentful Paint
    measureFCP() {
        if (!('getEntriesByName' in performance)) return;

        const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
        if (fcpEntry) {
            this.recordMetric('FCP', fcpEntry.startTime);
        } else {
            // Fallback: use paint entries
            const paintEntries = performance.getEntriesByType('paint');
            const fcpFallback = paintEntries.find(entry => entry.name === 'first-contentful-paint');
            if (fcpFallback) {
                this.recordMetric('FCP', fcpFallback.startTime);
            }
        }
    }

    // Add custom performance markers
    addPerformanceMarkers() {
        // Mark critical rendering path completion
        const markCriticalPath = () => {
            performance.mark('critical-css-loaded');
            performance.mark('critical-js-loaded');
        };

        // Mark when fonts are loaded
        if ('fonts' in document) {
            document.fonts.ready.then(() => {
                performance.mark('fonts-loaded');
                this.recordMetric('Font Load Time', performance.now() - this.navigationStartTime);
            });
        }

        // Mark when images are loaded
        const images = document.querySelectorAll('img');
        let imagesLoaded = 0;
        const totalImages = images.length;

        images.forEach(img => {
            if (img.complete) {
                imagesLoaded++;
            } else {
                img.addEventListener('load', () => {
                    imagesLoaded++;
                    if (imagesLoaded === totalImages) {
                        performance.mark('all-images-loaded');
                        this.recordMetric('Image Load Time', performance.now() - this.navigationStartTime);
                    }
                });
            }
        });

        if (imagesLoaded === totalImages && totalImages > 0) {
            performance.mark('all-images-loaded');
            this.recordMetric('Image Load Time', performance.now() - this.navigationStartTime);
        }

        setTimeout(markCriticalPath, 100);
    }

    // Handle page load complete
    onPageLoadComplete() {
        performance.mark('page-load-complete');
        
        const pageLoadTime = performance.now() - this.navigationStartTime;
        this.recordMetric('Page Load Time', pageLoadTime);
        
        // Generate performance report
        setTimeout(() => this.generatePerformanceReport(), 1000);
    }

    // Start memory monitoring
    startMemoryMonitoring() {
        if (!('memory' in performance)) return;

        const measureMemory = () => {
            const memory = performance.memory;
            this.recordMetric('Memory Usage', memory.usedJSHeapSize, {
                totalHeapSize: memory.totalJSHeapSize,
                heapLimit: memory.jsHeapSizeLimit,
                percentage: Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100)
            });
        };

        // Measure memory usage periodically
        measureMemory();
        setInterval(measureMemory, 30000); // Every 30 seconds
    }

    // Record a performance metric
    recordMetric(name, value, metadata = {}) {
        const metric = {
            name,
            value: Math.round(value * 100) / 100, // Round to 2 decimal places
            timestamp: Date.now(),
            metadata,
            threshold: this.config.thresholds[name],
            isGood: this.config.thresholds[name] ? value <= this.config.thresholds[name] : null
        };

        this.metrics.set(name, metric);

        if (this.config.enableLogging) {
            const status = metric.isGood === null ? '' : 
                         metric.isGood ? '✅' : '⚠️';
            console.log(`${status} ${name}: ${value}ms`, metadata);
        }

        // Report to external service if configured
        if (this.config.enableReporting && this.shouldSample()) {
            this.reportMetric(metric);
        }
    }

    // Generate comprehensive performance report
    generatePerformanceReport() {
        const report = {
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            connection: this.getConnectionInfo(),
            metrics: Object.fromEntries(this.metrics),
            summary: this.generateSummary(),
            recommendations: this.generateRecommendations()
        };

        if (this.config.enableLogging) {
            console.group('🚀 Performance Report');
            console.table(report.summary);
            console.log('Recommendations:', report.recommendations);
            console.log('Full Report:', report);
            console.groupEnd();
        }

        return report;
    }

    // Generate performance summary
    generateSummary() {
        const summary = {};
        
        this.metrics.forEach((metric, name) => {
            summary[name] = {
                value: `${metric.value}ms`,
                status: metric.isGood === null ? 'N/A' : 
                       metric.isGood ? 'Good' : 'Needs Improvement'
            };
        });

        return summary;
    }

    // Generate performance recommendations
    generateRecommendations() {
        const recommendations = [];
        
        this.metrics.forEach((metric, name) => {
            if (metric.isGood === false) {
                recommendations.push(this.getRecommendation(name, metric.value));
            }
        });

        return recommendations;
    }

    // Get specific recommendations for metrics
    getRecommendation(metricName, value) {
        const recommendations = {
            'FCP': 'Optimize critical rendering path. Consider inlining critical CSS and deferring non-critical resources.',
            'LCP': 'Optimize your largest contentful element. Consider lazy loading, image optimization, or CDN usage.',
            'FID': 'Reduce JavaScript execution time. Consider code splitting and removing unused JavaScript.',
            'CLS': 'Ensure proper sizing for images and ads. Avoid inserting content above existing content.',
            'TTFB': 'Optimize server response time. Consider CDN, caching, or server-side optimizations.',
            'Long Task': 'Break up long-running JavaScript tasks. Consider using web workers for heavy computations.'
        };

        return {
            metric: metricName,
            value: `${value}ms`,
            recommendation: recommendations[metricName] || 'Review and optimize this metric.'
        };
    }

    // Get connection information
    getConnectionInfo() {
        if (!navigator.connection) return null;
        
        return {
            effectiveType: navigator.connection.effectiveType,
            downlink: navigator.connection.downlink,
            rtt: navigator.connection.rtt,
            saveData: navigator.connection.saveData
        };
    }

    // Check if this session should be sampled
    shouldSample() {
        return Math.random() < this.config.samplingRate;
    }

    // Report metric to external service
    async reportMetric(metric) {
        if (!this.config.reportingEndpoint) return;

        try {
            await fetch(this.config.reportingEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    metric,
                    session: {
                        timestamp: Date.now(),
                        userAgent: navigator.userAgent,
                        url: window.location.href
                    }
                })
            });
        } catch (error) {
            console.warn('Failed to report metric:', error);
        }
    }

    // Fallback metrics for unsupported browsers
    initFallbackMetrics() {
        // Basic timing using Date
        const startTime = Date.now();
        
        window.addEventListener('load', () => {
            const loadTime = Date.now() - startTime;
            console.log('📊 Page Load Time (fallback):', loadTime + 'ms');
        });

        console.log('📊 Performance monitoring active (fallback mode)');
    }

    // Get current metrics
    getMetrics() {
        return Object.fromEntries(this.metrics);
    }

    // Get metric by name
    getMetric(name) {
        return this.metrics.get(name);
    }

    // Export metrics for analysis
    exportMetrics() {
        const exportData = {
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            metrics: this.getMetrics(),
            connection: this.getConnectionInfo()
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `performance-metrics-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Handle visibility change (pause/resume)
    handleVisibilityChange() {
        if (document.hidden) {
            this.pause();
        } else {
            this.resume();
        }
    }

    // Pause monitoring
    pause() {
        this.observers.forEach(observer => observer.disconnect());
    }

    // Resume monitoring
    resume() {
        this.setupPerformanceObservers();
    }

    // Cleanup
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        this.metrics.clear();
    }
}

export default PerformanceMonitor;