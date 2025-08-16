/**
 * Education Manager - Handles education section interactions and document preview
 */

const EducationManager = {
    initialized: false,
    educationRows: [],
    overlays: {},
    currentTimeout: null,
    
    // Initialize education functionality
    init() {
        if (this.initialized) return;
        
        console.log('🎓 Initializing Education Manager...');
        
        this.setupElements();
        this.setupEducationRows();
        this.setupOverlayEvents();
        
        this.initialized = true;
    },
    
    // Setup DOM elements
    setupElements() {
        this.educationRows = document.querySelectorAll('.education-row');
        
        this.overlays = {
            // Education info overlay
            educationOverlay: document.getElementById('educationOverlay'),
            educationBackdrop: document.getElementById('educationBackdrop'),
            educationClose: document.getElementById('educationClose'),
            educationTitle: document.getElementById('educationTitle'),
            educationContent: document.getElementById('educationContent'),
            
            // Document preview overlay
            documentPreviewOverlay: document.getElementById('documentPreviewOverlay'),
            documentPreviewBackdrop: document.getElementById('documentPreviewBackdrop'),
            documentPreviewClose: document.getElementById('documentPreviewClose'),
            documentPreviewTitle: document.getElementById('documentPreviewTitle'),
            documentPreviewFrame: document.getElementById('documentPreviewFrame')
        };
    },
    
    // Setup education row interactions
    setupEducationRows() {
        this.educationRows.forEach(row => {
            const fileUrl = row.getAttribute('data-file');
            const title = row.querySelector('.row-label')?.textContent;
            const content = row.getAttribute('data-info');
            
            if (fileUrl) {
                this.setupDocumentRow(row, title, fileUrl);
            } else {
                this.setupInfoRow(row, title, content);
            }
        });
    },
    
    // Setup document preview row
    setupDocumentRow(row, title, fileUrl) {
        if (this.isMobile()) {
            // Mobile: click to open document in new tab
            row.addEventListener('click', (e) => {
                e.stopPropagation();
                window.open(fileUrl, '_blank');
            });
        } else {
            // Desktop: hover to show document preview
            row.addEventListener('mouseenter', () => {
                this.clearTimeout();
                this.currentTimeout = setTimeout(() => {
                    this.showDocumentPreview(title, fileUrl);
                }, 500); // 500ms delay to prevent accidental triggers
            });
            
            row.addEventListener('mouseleave', () => {
                this.clearTimeout();
            });
            
            // Click to open in new tab
            row.addEventListener('click', (e) => {
                e.stopPropagation();
                window.open(fileUrl, '_blank');
            });
        }
    },
    
    // Setup info-only row
    setupInfoRow(row, title, content) {
        if (this.isMobile()) {
            row.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showEducationInfo(title, content);
            });
        } else {
            row.addEventListener('mouseenter', () => {
                this.clearTimeout();
                this.currentTimeout = setTimeout(() => {
                    this.showEducationInfo(title, content);
                }, 500);
            });
            
            row.addEventListener('mouseleave', () => {
                this.clearTimeout();
            });
        }
    },
    
    // Setup overlay event handlers
    setupOverlayEvents() {
        // Document preview overlay events
        if (this.overlays.documentPreviewOverlay) {
            this.overlays.documentPreviewOverlay.addEventListener('mouseenter', () => {
                // Keep open when hovering over overlay
            });
            
            this.overlays.documentPreviewOverlay.addEventListener('mouseleave', () => {
                this.hideDocumentPreview();
            });
        }
        
        // Education info overlay events
        if (this.overlays.educationOverlay) {
            this.overlays.educationOverlay.addEventListener('mouseenter', () => {
                // Keep open when hovering over overlay
            });
            
            this.overlays.educationOverlay.addEventListener('mouseleave', () => {
                this.hideEducationInfo();
            });
        }
        
        // Close button events
        if (this.overlays.educationClose) {
            this.overlays.educationClose.addEventListener('click', () => {
                this.hideEducationInfo();
            });
        }
        
        if (this.overlays.documentPreviewClose) {
            this.overlays.documentPreviewClose.addEventListener('click', () => {
                this.hideDocumentPreview();
            });
        }
        
        // Backdrop events
        if (this.overlays.educationBackdrop) {
            this.overlays.educationBackdrop.addEventListener('click', () => {
                this.hideEducationInfo();
            });
        }
        
        if (this.overlays.documentPreviewBackdrop) {
            this.overlays.documentPreviewBackdrop.addEventListener('click', () => {
                this.hideDocumentPreview();
            });
        }
    },
    
    // Show document preview overlay
    showDocumentPreview(title, fileUrl) {
        if (!this.overlays.documentPreviewOverlay) return;
        
        console.log(`📄 Showing document preview: ${title}`);
        
        this.overlays.documentPreviewTitle.textContent = title;
        this.overlays.documentPreviewFrame.src = fileUrl;
        this.overlays.documentPreviewOverlay.classList.add('show');
        this.overlays.documentPreviewBackdrop.classList.add('show');
        document.body.style.overflow = 'hidden';
    },
    
    // Hide document preview overlay
    hideDocumentPreview() {
        if (!this.overlays.documentPreviewOverlay) return;
        
        this.overlays.documentPreviewOverlay.classList.remove('show');
        this.overlays.documentPreviewBackdrop.classList.remove('show');
        document.body.style.overflow = '';
        
        // Clear iframe src to stop loading
        setTimeout(() => {
            this.overlays.documentPreviewFrame.src = '';
        }, 300);
    },
    
    // Show education info overlay
    showEducationInfo(title, content) {
        if (!this.overlays.educationOverlay) return;
        
        console.log(`ℹ️ Showing education info: ${title}`);
        
        this.overlays.educationTitle.textContent = title;
        this.overlays.educationContent.textContent = content;
        this.overlays.educationOverlay.classList.add('show');
        this.overlays.educationBackdrop.classList.add('show');
        document.body.style.overflow = 'hidden';
    },
    
    // Hide education info overlay
    hideEducationInfo() {
        if (!this.overlays.educationOverlay) return;
        
        this.overlays.educationOverlay.classList.remove('show');
        this.overlays.educationBackdrop.classList.remove('show');
        document.body.style.overflow = '';
    },
    
    // Close all overlays
    closeOverlays() {
        this.hideDocumentPreview();
        this.hideEducationInfo();
        this.clearTimeout();
    },
    
    // Clear current timeout
    clearTimeout() {
        if (this.currentTimeout) {
            clearTimeout(this.currentTimeout);
            this.currentTimeout = null;
        }
    },
    
    // Check if device is mobile
    isMobile() {
        return window.innerWidth <= 768;
    },
    
    // Add new education item programmatically
    addEducationItem(data) {
        const educationSection = document.querySelector('.education-section');
        if (!educationSection) return;
        
        const educationItem = document.createElement('div');
        educationItem.className = 'education-item';
        
        educationItem.innerHTML = `
            <h3 class="degree-title">${data.title}</h3>
            <p class="institution">${data.institution}</p>
            <p class="institution">${data.location}</p>
            <p class="year">${data.year}</p>
            
            <div class="education-rows">
                ${data.rows.map(row => `
                    <div class="education-row" 
                         data-info="${row.info}" 
                         ${row.file ? `data-file="${row.file}"` : ''}>
                        <span class="row-label">${row.label}</span>
                        <span class="row-arrow">→</span>
                    </div>
                `).join('')}
            </div>
        `;
        
        educationSection.appendChild(educationItem);
        
        // Reinitialize with new elements
        this.setupElements();
        this.setupEducationRows();
    },
    
    // Get education data for analytics
    getEducationData() {
        const educationItems = document.querySelectorAll('.education-item');
        const data = [];
        
        educationItems.forEach(item => {
            const title = item.querySelector('.degree-title')?.textContent;
            const institution = item.querySelector('.institution')?.textContent;
            const year = item.querySelector('.year')?.textContent;
            
            const rows = [];
            const educationRows = item.querySelectorAll('.education-row');
            educationRows.forEach(row => {
                rows.push({
                    label: row.querySelector('.row-label')?.textContent,
                    info: row.getAttribute('data-info'),
                    file: row.getAttribute('data-file')
                });
            });
            
            data.push({
                title,
                institution,
                year,
                rows
            });
        });
        
        return data;
    },
    
    // Preload documents for better performance
    preloadDocuments() {
        const documentRows = document.querySelectorAll('.education-row[data-file]');
        
        documentRows.forEach(row => {
            const fileUrl = row.getAttribute('data-file');
            if (fileUrl) {
                // Create a hidden iframe to preload the document
                const preloadFrame = document.createElement('iframe');
                preloadFrame.src = fileUrl;
                preloadFrame.style.display = 'none';
                document.body.appendChild(preloadFrame);
                
                // Remove after loading
                setTimeout(() => {
                    document.body.removeChild(preloadFrame);
                }, 2000);
            }
        });
    },
    
    // Cleanup method
    destroy() {
        this.closeOverlays();
        this.educationRows = [];
        this.overlays = {};
        this.initialized = false;
    }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EducationManager;
}

// Make available globally
window.EducationManager = EducationManager;