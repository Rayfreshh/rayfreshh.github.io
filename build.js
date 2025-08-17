#!/usr/bin/env node

/**
 * Build Script for Etiosa Raymond Portfolio
 * Optimizes CSS, JS, and images for production deployment
 */

const fs = require('fs').promises;
const path = require('path');

class PortfolioBuildTool {
    constructor() {
        this.sourceDir = __dirname;
        this.buildDir = path.join(__dirname, 'dist');
        this.cssFiles = [
            'css/variables.css',
            'css/base.css',
            'css/layout.css',
            'css/components.css',
            'css/sections.css',
            'css/overlays.css',
            'css/animations.css'
        ];
        this.jsFiles = [
            'js/main.js',
            'js/skills.js',
            'js/education.js',
            'js/tooltips.js',
            'js/mobile.js',
            'js/utils.js'
        ];
    }

    async build() {
        console.log('🚀 Starting portfolio build process...');
        
        try {
            await this.createBuildDirectory();
            await this.optimizeCSS();
            await this.optimizeJS();
            await this.optimizeHTML();
            await this.copyAssets();
            await this.generateServiceWorker();
            await this.generateManifest();
            
            console.log('✅ Build completed successfully!');
            console.log(`📁 Build files located in: ${this.buildDir}`);
            
        } catch (error) {
            console.error('❌ Build failed:', error);
            process.exit(1);
        }
    }

    async createBuildDirectory() {
        try {
            await fs.access(this.buildDir);
            await fs.rm(this.buildDir, { recursive: true });
        } catch (error) {
            // Directory doesn't exist, which is fine
        }
        
        await fs.mkdir(this.buildDir, { recursive: true });
        await fs.mkdir(path.join(this.buildDir, 'css'), { recursive: true });
        await fs.mkdir(path.join(this.buildDir, 'js'), { recursive: true });
        await fs.mkdir(path.join(this.buildDir, 'assets'), { recursive: true });
        
        console.log('📁 Created build directory');
    }

    async optimizeCSS() {
        console.log('🎨 Optimizing CSS...');
        
        let combinedCSS = '';
        
        for (const cssFile of this.cssFiles) {
            try {
                const filePath = path.join(this.sourceDir, cssFile);
                const content = await fs.readFile(filePath, 'utf8');
                combinedCSS += `/* ${cssFile} */\n${content}\n\n`;
            } catch (error) {
                console.warn(`⚠️  Could not read ${cssFile}, skipping...`);
            }
        }
        
        // Basic CSS minification
        const minifiedCSS = this.minifyCSS(combinedCSS);
        
        await fs.writeFile(
            path.join(this.buildDir, 'css', 'main.min.css'),
            minifiedCSS
        );
        
        console.log(`✨ CSS optimized: ${combinedCSS.length} → ${minifiedCSS.length} characters`);
    }

    async optimizeJS() {
        console.log('⚡ Optimizing JavaScript...');
        
        let combinedJS = '';
        
        for (const jsFile of this.jsFiles) {
            try {
                const filePath = path.join(this.sourceDir, jsFile);
                const content = await fs.readFile(filePath, 'utf8');
                combinedJS += `/* ${jsFile} */\n${content}\n\n`;
            } catch (error) {
                console.warn(`⚠️  Could not read ${jsFile}, skipping...`);
            }
        }
        
        // Basic JS minification
        const minifiedJS = this.minifyJS(combinedJS);
        
        await fs.writeFile(
            path.join(this.buildDir, 'js', 'main.min.js'),
            minifiedJS
        );
        
        console.log(`✨ JavaScript optimized: ${combinedJS.length} → ${minifiedJS.length} characters`);
    }

    async optimizeHTML() {
        console.log('📄 Optimizing HTML...');
        
        try {
            const htmlContent = await fs.readFile(
                path.join(this.sourceDir, 'index_optimized.html'),
                'utf8'
            );
            
            // Update paths to use minified files
            const optimizedHTML = htmlContent
                .replace('css/main.css', 'css/main.min.css')
                .replace(/src="js\/[\w.-]+\.js"/g, 'src="js/main.min.js"')
                .replace(/defer/g, '') // Remove defer since we're combining files
                .replace(/<!-- Load JavaScript modules -->[\s\S]*?(?=<script>)/g, '')
                .replace(/\s+/g, ' ') // Basic minification
                .trim();
            
            await fs.writeFile(
                path.join(this.buildDir, 'index.html'),
                optimizedHTML
            );
            
            console.log('✨ HTML optimized and paths updated');
            
        } catch (error) {
            console.error('Failed to optimize HTML:', error);
        }
    }

    async copyAssets() {
        console.log('📋 Copying assets...');
        
        try {
            const assetsDir = path.join(this.sourceDir, 'assets');
            const files = await fs.readdir(assetsDir);
            
            for (const file of files) {
                const sourcePath = path.join(assetsDir, file);
                const destPath = path.join(this.buildDir, 'assets', file);
                await fs.copyFile(sourcePath, destPath);
            }
            
            // Copy bio.html if it exists
            try {
                await fs.copyFile(
                    path.join(this.sourceDir, 'bio.html'),
                    path.join(this.buildDir, 'bio.html')
                );
            } catch (error) {
                console.warn('⚠️  bio.html not found, skipping...');
            }
            
            console.log('✨ Assets copied successfully');
            
        } catch (error) {
            console.error('Failed to copy assets:', error);
        }
    }

    async generateServiceWorker() {
        console.log('⚙️  Generating service worker...');
        
        const serviceWorker = `
/**
 * Service Worker for Etiosa Raymond Portfolio
 * Provides offline functionality and performance caching
 */

const CACHE_NAME = 'etiosa-portfolio-v1';
const urlsToCache = [
    '/',
    '/css/main.min.css',
    '/js/main.min.js',
    '/assets/IMG_0930.jpeg',
    '/assets/Etiosa_Raymond_CV.pdf',
    '/bio.html'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached version or fetch from network
                return response || fetch(event.request);
            })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
        `.trim();
        
        await fs.writeFile(
            path.join(this.buildDir, 'sw.js'),
            serviceWorker
        );
        
        console.log('✨ Service worker generated');
    }

    async generateManifest() {
        console.log('📱 Generating web app manifest...');
        
        const manifest = {
            name: "Etiosa Raymond - AI/ML Engineer Portfolio",
            short_name: "Etiosa Raymond",
            description: "Smart Systems Engineer specializing in AI/ML and Computer Vision",
            start_url: "/",
            display: "standalone",
            background_color: "#f5f5f5",
            theme_color: "#f4d03f",
            icons: [
                {
                    src: "assets/IMG_0930.jpeg",
                    sizes: "512x512",
                    type: "image/jpeg",
                    purpose: "any maskable"
                }
            ]
        };
        
        await fs.writeFile(
            path.join(this.buildDir, 'manifest.json'),
            JSON.stringify(manifest, null, 2)
        );
        
        console.log('✨ Web app manifest generated');
    }

    minifyCSS(css) {
        return css
            .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
            .replace(/\s+/g, ' ') // Collapse whitespace
            .replace(/;\s*}/g, '}') // Remove unnecessary semicolons
            .replace(/\s*{\s*/g, '{') // Clean braces
            .replace(/;\s*/g, ';') // Clean semicolons
            .replace(/,\s*/g, ',') // Clean commas
            .trim();
    }

    minifyJS(js) {
        return js
            .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
            .replace(/\/\/.*$/gm, '') // Remove line comments
            .replace(/\s+/g, ' ') // Collapse whitespace
            .replace(/;\s*}/g, '}') // Clean up
            .trim();
    }
}

// Run build if called directly
if (require.main === module) {
    const builder = new PortfolioBuildTool();
    builder.build();
}

module.exports = PortfolioBuildTool;