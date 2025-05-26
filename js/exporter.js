// Export functionality for landing pages
class PageExporter {
    constructor(landingPageElement, globalStyles) {
        this.landingPage = landingPageElement;
        this.globalStyles = globalStyles;
        this.pageSettings = {
            title: document.getElementById('page-title')?.value || 'My Landing Page',
            description: document.getElementById('meta-description')?.value || 'A beautifully crafted landing page',
            favicon: document.getElementById('favicon-url')?.value || ''
        };
    }

    export() {
        const exportModal = this.createExportModal();
        document.body.appendChild(exportModal);
        exportModal.classList.add('active');
    }

    createExportModal() {
        const modal = document.createElement('div');
        modal.className = 'modal export-modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h3>Export Landing Page</h3>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="export-options">
                        <div class="export-option">
                            <button class="btn btn-primary export-btn" data-type="html">
                                <i class="fas fa-file-code"></i>
                                Download HTML File
                            </button>
                            <p>Download a complete HTML file ready to host</p>
                        </div>
                        <div class="export-option">
                            <button class="btn btn-secondary export-btn" data-type="zip">
                                <i class="fas fa-file-archive"></i>
                                Download Project (ZIP)
                            </button>
                            <p>Download HTML, CSS, and assets as a project</p>
                        </div>
                        <div class="export-option">
                            <button class="btn btn-secondary export-btn" data-type="preview">
                                <i class="fas fa-external-link-alt"></i>
                                Open Preview
                            </button>
                            <p>Open the landing page in a new tab</p>
                        </div>
                    </div>
                    
                    <div class="export-settings">
                        <h4>Export Settings</h4>
                        <div class="control-group">
                            <label>
                                <input type="checkbox" id="include-editor-styles" checked>
                                Remove editor-specific styles
                            </label>
                        </div>
                        <div class="control-group">
                            <label>
                                <input type="checkbox" id="minify-css" checked>
                                Minify CSS
                            </label>
                        </div>
                        <div class="control-group">
                            <label>
                                <input type="checkbox" id="include-faq-js">
                                Include FAQ functionality
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add event listeners
        modal.querySelectorAll('.export-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = btn.getAttribute('data-type');
                this.handleExport(type, modal);
            });
        });

        return modal;
    }

    handleExport(type, modal) {
        const settings = this.getExportSettings(modal);
        
        switch (type) {
            case 'html':
                this.exportHTML(settings);
                break;
            case 'zip':
                this.exportZIP(settings);
                break;
            case 'preview':
                this.openPreview(settings);
                break;
        }
        
        modal.remove();
    }

    getExportSettings(modal) {
        return {
            removeEditorStyles: modal.querySelector('#include-editor-styles').checked,
            minifyCSS: modal.querySelector('#minify-css').checked,
            includeFAQJS: modal.querySelector('#include-faq-js').checked
        };
    }

    exportHTML(settings) {
        const html = this.generateHTML(settings);
        this.downloadFile(html, 'landing-page.html', 'text/html');
    }

    exportZIP(settings) {
        // For a complete implementation, you'd use JSZip library
        // For now, we'll export as HTML with embedded styles
        const html = this.generateHTML(settings);
        this.downloadFile(html, 'landing-page.html', 'text/html');
        
        // Show a message about the ZIP functionality
        this.showMessage('ZIP export would require additional libraries. Downloading as HTML file instead.');
    }

    openPreview(settings) {
        const html = this.generateHTML(settings);
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    }

    generateHTML(settings) {
        const cleanHTML = this.cleanHTML(this.landingPage.innerHTML, settings);
        const css = this.generateCSS(settings);
        const js = this.generateJS(settings.includeFAQJS);

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.pageSettings.title}</title>
    <meta name="description" content="${this.pageSettings.description}">
    ${this.pageSettings.favicon ? `<link rel="icon" href="${this.pageSettings.favicon}">` : ''}
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
${css}
    </style>
</head>
<body>
    <div class="landing-page">
${cleanHTML}
    </div>
    ${js ? `<script>\n${js}\n</script>` : ''}
</body>
</html>`;
    }

    cleanHTML(html, settings) {
        if (!settings.removeEditorStyles) {
            return html;
        }

        // Remove editor-specific elements and classes
        const div = document.createElement('div');
        div.innerHTML = html;

        // Remove component controls
        div.querySelectorAll('.component-controls').forEach(el => el.remove());
        div.querySelectorAll('.drag-handle').forEach(el => el.remove());

        // Remove editor classes
        div.querySelectorAll('.component').forEach(el => {
            el.classList.remove('component', 'selected');
        });

        div.querySelectorAll('.editable').forEach(el => {
            el.classList.remove('editable', 'editing');
            el.removeAttribute('contenteditable');
        });

        // Remove data attributes used by editor
        div.querySelectorAll('[data-component]').forEach(el => {
            el.removeAttribute('data-component');
        });

        div.querySelectorAll('[data-field]').forEach(el => {
            el.removeAttribute('data-field');
        });

        return div.innerHTML;
    }

    generateCSS(settings) {
        let css = '';

        // Add base styles
        css += this.getBaseCSS();

        // Add component styles
        css += this.getComponentCSS();

        // Add global variables
        css += this.getGlobalVariablesCSS();

        // Minify if requested
        if (settings.minifyCSS) {
            css = this.minifyCSS(css);
        }

        return css;
    }

    getBaseCSS() {
        return `
/* Reset and Base Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: var(--font-family, 'Inter', sans-serif);
    font-size: var(--base-font-size, 16px);
    line-height: 1.6;
    color: #333;
    background: #ffffff;
}

/* Container */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Sections */
.section {
    padding: 60px 0;
}

.section.small {
    padding: 40px 0;
}

.section.large {
    padding: 80px 0;
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
    margin: 0 0 1rem 0;
    font-weight: 600;
    line-height: 1.2;
}

h1 { font-size: 2.5rem; }
h2 { font-size: 2rem; }
h3 { font-size: 1.5rem; }
h4 { font-size: 1.25rem; }
h5 { font-size: 1.125rem; }
h6 { font-size: 1rem; }

p {
    margin: 0 0 1rem 0;
}

/* Buttons */
.cta-button {
    display: inline-block;
    padding: 12px 24px;
    background: var(--primary-color);
    color: white;
    text-decoration: none;
    border-radius: 6px;
    font-weight: 600;
    transition: all 0.2s;
    border: none;
    cursor: pointer;
    font-size: inherit;
}

.cta-button:hover {
    background: #0056b3;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

/* Images */
img {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
}

/* Utility Classes */
.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }

/* Responsive */
@media (max-width: 768px) {
    h1 { font-size: 2rem; }
    h2 { font-size: 1.75rem; }
    h3 { font-size: 1.25rem; }
    
    .section { padding: 40px 0; }
    .section.large { padding: 60px 0; }
    .container { padding: 0 15px; }
}
`;
    }

    getComponentCSS() {
        // Return the complete component-specific CSS matching components.css
        return `
/* Header Section */
.header-section {
    background: white;
    border-bottom: 1px solid #e5e5e5;
    position: sticky;
    top: 0;
    z-index: 100;
}

.navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 0;
}

.navbar-brand {
    display: flex;
    align-items: center;
}

.brand-logo {
    height: 40px;
    width: auto;
    max-width: 150px;
}

.navbar-menu {
    display: flex;
    align-items: center;
    gap: 40px;
}

.navbar-nav {
    display: flex;
    align-items: center;
    gap: 30px;
}

.nav-link {
    text-decoration: none;
    color: #333;
    font-weight: 500;
    font-size: 16px;
    transition: color 0.2s;
}

.nav-link:hover {
    color: var(--primary-color);
}

.navbar-cta .cta-button {
    background: var(--primary-color);
    color: white;
    padding: 12px 24px;
    font-weight: 600;
    border-radius: 6px;
}

.mobile-menu-toggle {
    display: none;
    flex-direction: column;
    cursor: pointer;
    gap: 4px;
}

.mobile-menu-toggle span {
    width: 25px;
    height: 3px;
    background: #333;
    transition: all 0.3s;
}

/* Mobile menu active state */
.mobile-menu-toggle.active span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
}

.mobile-menu-toggle.active span:nth-child(2) {
    opacity: 0;
}

.mobile-menu-toggle.active span:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -6px);
}

/* Mobile menu dropdown */
@media (max-width: 768px) {
    .navbar-menu {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border: 1px solid #e5e5e5;
        border-top: none;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        opacity: 0;
        visibility: hidden;
        transform: translateY(-10px);
        transition: all 0.3s ease;
        flex-direction: column;
        align-items: stretch;
        gap: 0;
        z-index: 1000;
    }
    
    .navbar-menu.mobile-menu-open {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
        display: flex;
    }
    
    .navbar-nav {
        flex-direction: column;
        gap: 0;
        width: 100%;
    }
    
    .nav-link {
        padding: 15px 20px;
        border-bottom: 1px solid #f0f0f0;
        display: block;
        width: 100%;
    }
    
    .nav-link:hover {
        background: #f8f9fa;
    }
    
    .navbar-cta {
        padding: 15px 20px;
        border-top: 1px solid #f0f0f0;
    }
    
    .navbar-cta .cta-button {
        width: 100%;
        text-align: center;
        justify-content: center;
        display: flex;
    }
}

/* Header Background Variants */
.header-section.bg-white {
    background: white;
}

.header-section.bg-light {
    background: #f8f9fa;
}

.header-section.bg-dark {
    background: #343a40;
}

.header-section.bg-dark .nav-link,
.header-section.bg-dark .mobile-menu-toggle span {
    color: white;
}

.header-section.bg-transparent {
    background: transparent;
    border-bottom: none;
}

/* Hero Section */
.hero-section {
    background: white;
    color: #333;
    position: relative;
    overflow: hidden;
}

.hero-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;
    min-height: 500px;
}

.hero-content {
    text-align: left;
}

.hero-section h1 {
    font-size: 3.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: #333;
    line-height: 1.1;
}

.hero-section p {
    font-size: 1.25rem;
    margin-bottom: 2rem;
    color: #6c757d;
    line-height: 1.6;
}

.hero-section .cta-button {
    font-size: 1.1rem;
    padding: 15px 30px;
    background: var(--primary-color);
    color: white;
}

.hero-image {
    position: relative;
}

.hero-img {
    width: 100%;
    height: 400px;
    border-radius: 12px;
    overflow: hidden;
}

.hero-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* Hero Background Variants */
.hero-section.bg-white {
    background: white;
}

.hero-section.bg-light {
    background: #f8f9fa;
}

.hero-section.bg-gradient-blue {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.hero-section.bg-gradient-blue h1,
.hero-section.bg-gradient-blue p {
    color: white;
}

.hero-section.bg-gradient-sunset {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    color: white;
}

.hero-section.bg-gradient-sunset h1,
.hero-section.bg-gradient-sunset p {
    color: white;
}

.hero-section.bg-gradient-ocean {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    color: white;
}

.hero-section.bg-gradient-ocean h1,
.hero-section.bg-gradient-ocean p {
    color: white;
}

.hero-section.bg-gradient-forest {
    background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
    color: white;
}

.hero-section.bg-gradient-forest h1,
.hero-section.bg-gradient-forest p {
    color: white;
}

/* Image Handling */
.image-placeholder {
    background: #f8f9fa;
    border: 2px dashed #dee2e6;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    text-align: center;
    padding: 20px;
}

.image-placeholder:hover {
    border-color: var(--primary-color);
    background: #f0f8ff;
}

.image-placeholder i {
    font-size: 2rem;
    color: #6c757d;
    margin-bottom: 10px;
}

.image-placeholder p {
    color: #6c757d;
    margin: 0;
    font-size: 14px;
}

.image-container {
    position: relative;
    overflow: hidden;
    border-radius: 8px;
}

.image-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
}

.image-container:hover img {
    transform: scale(1.05);
}

/* Trust Badges */
.trust-badges {
    background: #f8f9fa;
}

.trust-badges h2 {
    text-align: center;
    margin-bottom: 3rem;
    color: #6c757d;
    font-size: 1.5rem;
    font-weight: 600;
}

.logos-grid {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 40px;
    flex-wrap: wrap;
}

.logo-item {
    height: 60px;
    opacity: 0.7;
    transition: all 0.3s;
    filter: grayscale(100%);
}

.logo-item:hover {
    opacity: 1;
    filter: grayscale(0%);
    transform: scale(1.05);
}

.logo-item img {
    height: 100%;
    width: auto;
    object-fit: contain;
}

/* Benefits Section */
.benefits-section {
    background: white;
}

.benefits-section h2 {
    text-align: center;
    margin-bottom: 3rem;
    font-size: 2.5rem;
    color: #333;
}

.benefits-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 40px;
    align-items: start;
}

.benefit-item {
    text-align: center;
    padding: 30px 20px;
    border-radius: 12px;
    transition: all 0.3s;
}

.benefit-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.benefit-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 20px;
}

.benefit-item h3 {
    font-size: 1.5rem;
    margin-bottom: 15px;
    color: #333;
}

.benefit-item p {
    color: #6c757d;
    line-height: 1.7;
}

/* Process Steps */
.process-section {
    background: #f8f9fa;
}

.process-section h2 {
    text-align: center;
    margin-bottom: 3rem;
    font-size: 2.5rem;
    color: #333;
}

.process-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 40px;
}

.process-step {
    text-align: center;
    padding: 40px 20px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
    transition: all 0.3s;
    position: relative;
}

.process-step:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.step-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 20px;
    background: var(--primary-color);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    color: white;
}


.process-step h3 {
    font-size: 1.5rem;
    margin-bottom: 15px;
    color: #333;
}

.process-step p {
    color: #6c757d;
    line-height: 1.7;
}

/* Testimonial Section */
.testimonial-section {
    background: white;
    text-align: center;
}

.testimonial-content {
    max-width: 800px;
    margin: 0 auto;
}

.testimonial-quote {
    font-size: 1.75rem;
    font-style: italic;
    color: #333;
    margin-bottom: 2rem;
    line-height: 1.4;
}

.testimonial-quote::before,
.testimonial-quote::after {
    content: '"';
    color: var(--primary-color);
    font-size: 3rem;
    font-weight: 700;
}

.testimonial-author {
    font-size: 1.1rem;
    color: #6c757d;
    font-weight: 500;
}

.testimonial-company {
    color: var(--primary-color);
    font-weight: 600;
}

/* FAQ Section */
.faq-section {
    background: #f8f9fa;
}

.faq-section h2 {
    text-align: center;
    margin-bottom: 3rem;
    font-size: 2.5rem;
    color: #333;
}

.faq-container {
    max-width: 800px;
    margin: 0 auto;
}

.faq-item {
    background: white;
    border-radius: 8px;
    margin-bottom: 15px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    overflow: hidden;
}

.faq-question {
    width: 100%;
    padding: 20px;
    background: none;
    border: none;
    text-align: left;
    font-size: 1.1rem;
    font-weight: 600;
    color: #333;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.2s;
}

.faq-question:hover {
    background: #f8f9fa;
}

.faq-question::after {
    content: '+';
    font-size: 1.5rem;
    color: var(--primary-color);
    transition: transform 0.2s;
}

.faq-question.active::after {
    transform: rotate(45deg);
}

.faq-answer {
    padding: 0 20px;
    max-height: 0;
    overflow: hidden;
    transition: all 0.3s ease;
}

.faq-answer.active {
    padding: 0 20px 20px;
    max-height: 200px;
}

.faq-answer p {
    color: #6c757d;
    line-height: 1.7;
    margin: 0;
}

/* Footer */
.footer-section {
    background: #343a40;
    color: white;
    text-align: center;
}

.footer-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 40px;
    margin-bottom: 30px;
}

.footer-logo {
    height: 60px;
    width: auto;
    max-width: 200px;
    margin: 0 auto 20px auto;
}

.footer-logo img {
    height: 100%;
    width: auto;
    object-fit: contain;
}

.footer-text {
    color: #adb5bd;
    line-height: 1.7;
}

.footer-bottom {
    padding-top: 30px;
    border-top: 1px solid #495057;
    color: #adb5bd;
    font-size: 14px;
}

/* Responsive Design */
@media (max-width: 768px) {
    .navbar-menu {
        display: none;
    }
    
    .mobile-menu-toggle {
        display: flex;
    }
    
    .brand-logo {
        height: 35px;
    }

    .hero-grid {
        grid-template-columns: 1fr;
        gap: 40px;
        text-align: center;
    }
    
    .hero-content {
        text-align: center;
    }
    
    .hero-section h1 {
        font-size: 2.5rem;
    }
    
    .hero-section p {
        font-size: 1.1rem;
    }
    
    .hero-img {
        height: 300px;
    }
    
    .benefits-grid,
    .process-grid {
        grid-template-columns: 1fr;
        gap: 30px;
    }
    
    .logos-grid {
        gap: 30px;
    }
    
    .logo-item {
        height: 50px;
    }
    
    .testimonial-quote {
        font-size: 1.5rem;
    }
    
    .process-step {
        padding: 30px 15px;
    }
    
    .step-icon {
        width: 60px;
        height: 60px;
        font-size: 1.5rem;
    }
    
    .footer-content {
        grid-template-columns: 1fr;
        gap: 30px;
        text-align: center;
    }
}

/* Animation Classes */
.animate-on-scroll {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s ease;
}

.animate-on-scroll.animated {
    opacity: 1;
    transform: translateY(0);
}
`;
    }

    getGlobalVariablesCSS() {
        return `
/* Global Variables */
:root {
    --primary-color: ${this.globalStyles.primaryColor || '#007bff'};
    --secondary-color: ${this.globalStyles.secondaryColor || '#6c757d'};
    --font-family: ${this.globalStyles.fontFamily || 'Inter'};
    --base-font-size: ${this.globalStyles.baseFontSize || '16px'};
}
`;
    }

    generateJS(includeFAQJS = false) {
        let js = `
// Mobile Menu functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');
    
    if (mobileMenuToggle && navbarMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navbarMenu.classList.toggle('mobile-menu-open');
            mobileMenuToggle.classList.toggle('active');
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenuToggle.contains(e.target) && !navbarMenu.contains(e.target)) {
                navbarMenu.classList.remove('mobile-menu-open');
                mobileMenuToggle.classList.remove('active');
            }
        });
        
        // Close mobile menu when clicking on a nav link
        const navLinks = navbarMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navbarMenu.classList.remove('mobile-menu-open');
                mobileMenuToggle.classList.remove('active');
            });
        });
    }`;

        if (includeFAQJS) {
            js += `
    
    // FAQ functionality
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const isActive = this.classList.contains('active');
            
            // Close all other FAQs
            faqQuestions.forEach(q => {
                q.classList.remove('active');
                q.nextElementSibling.classList.remove('active');
            });
            
            // Toggle current FAQ
            if (!isActive) {
                this.classList.add('active');
                answer.classList.add('active');
            }
        });
    });`;
        }

        js += `
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});`;

        return js;
    }

    minifyCSS(css) {
        return css
            .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .replace(/;\s*}/g, '}') // Remove semicolon before closing brace
            .replace(/\s*{\s*/g, '{') // Remove spaces around opening brace
            .replace(/;\s*/g, ';') // Remove spaces after semicolons
            .replace(/,\s*/g, ',') // Remove spaces after commas
            .trim();
    }

    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    showMessage(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#dc3545' : '#007bff'};
            color: white;
            padding: 15px 20px;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Add slide animations
const style = document.createElement('style');
style.textContent = `
@keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

@keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
}

.export-modal .modal-content {
    max-width: 600px;
}

.export-options {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-bottom: 30px;
}

.export-option {
    padding: 20px;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    text-align: center;
}

.export-option .btn {
    width: 100%;
    margin-bottom: 10px;
}

.export-option p {
    margin: 0;
    color: #6c757d;
    font-size: 14px;
}

.export-settings {
    border-top: 1px solid #dee2e6;
    padding-top: 20px;
}

.export-settings h4 {
    margin-bottom: 15px;
    color: #333;
}

.export-settings .control-group {
    margin-bottom: 10px;
}

.export-settings label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 14px;
}
`;
document.head.appendChild(style);
