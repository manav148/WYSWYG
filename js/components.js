// Component definitions for the WYSIWYG editor
const Components = {
    header: {
        name: 'Header/Navigation',
        category: 'header',
        template: `
            <header class="header-section component" data-component="header">
                <div class="component-controls">
                    <button class="control-btn" data-action="edit" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="control-btn" data-action="duplicate" title="Duplicate">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="control-btn" data-action="delete" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="drag-handle">
                    <i class="fas fa-grip-vertical"></i>
                </div>
                <div class="container">
                    <nav class="navbar">
                        <div class="navbar-brand">
                            <div class="image-placeholder brand-logo" data-field="logo">
                                <i class="fas fa-image"></i>
                                <p>Logo</p>
                            </div>
                        </div>
                        <div class="navbar-menu">
                            <div class="navbar-nav">
                                <a href="#hero" class="nav-link editable" data-field="nav1">Why Buy Remnant</a>
                                <a href="#benefits" class="nav-link editable" data-field="nav2">How it works</a>
                                <a href="#faq" class="nav-link editable" data-field="nav3">FAQ</a>
                            </div>
                            <div class="navbar-cta">
                                <a href="#" class="cta-button editable" data-field="header_cta">BUY REMNANT ADS</a>
                            </div>
                        </div>
                        <div class="mobile-menu-toggle">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </nav>
                </div>
            </header>
        `,
        fields: {
            logo: { type: 'image', label: 'Company Logo' },
            nav1: { type: 'text', label: 'Navigation Link 1' },
            nav2: { type: 'text', label: 'Navigation Link 2' },
            nav3: { type: 'text', label: 'Navigation Link 3' },
            header_cta: { type: 'text', label: 'Header CTA Button' }
        },
        styles: {
            background: { type: 'select', options: ['bg-white', 'bg-light', 'bg-dark', 'bg-transparent'] },
            position: { type: 'select', options: ['static', 'sticky'] }
        }
    },

    hero: {
        name: 'Hero Section',
        category: 'header',
        template: `
            <section id="hero" class="hero-section section large component" data-component="hero">
                <div class="component-controls">
                    <button class="control-btn" data-action="edit" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="control-btn" data-action="duplicate" title="Duplicate">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="control-btn" data-action="delete" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="drag-handle">
                    <i class="fas fa-grip-vertical"></i>
                </div>
                <div class="container">
                    <div class="hero-grid">
                        <div class="hero-content">
                            <h1 class="editable" data-field="title">Remnant Media Buying Experts</h1>
                            <p class="editable" data-field="subtitle">Premium advertising at up to 70% less spend.</p>
                            <a href="#" class="cta-button editable" data-field="cta">BUY REMNANT ADS</a>
                        </div>
                        <div class="hero-image">
                            <div class="image-placeholder hero-img" data-field="hero_image">
                                <i class="fas fa-image"></i>
                                <p>Add Hero Image</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `,
        fields: {
            title: { type: 'text', label: 'Main Title' },
            subtitle: { type: 'textarea', label: 'Subtitle' },
            cta: { type: 'text', label: 'Call to Action' },
            hero_image: { type: 'image', label: 'Hero Image' }
        },
        styles: {
            background: { type: 'select', options: ['bg-white', 'bg-light', 'bg-gradient-blue', 'bg-gradient-sunset', 'bg-gradient-ocean', 'bg-gradient-forest'] },
            textAlign: { type: 'select', options: ['text-center', 'text-left', 'text-right'] }
        }
    },

    'trust-badges': {
        name: 'Trust Badges',
        category: 'social-proof',
        template: `
            <section class="trust-badges section component" data-component="trust-badges">
                <div class="component-controls">
                    <button class="control-btn" data-action="edit" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="control-btn" data-action="duplicate" title="Duplicate">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="control-btn" data-action="delete" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="drag-handle">
                    <i class="fas fa-grip-vertical"></i>
                </div>
                <div class="container">
                    <h2 class="editable" data-field="title">Trusted by Leading Brands</h2>
                    <div class="logos-grid">
                        <div class="logo-item">
                            <div class="image-placeholder" data-field="logo1">
                                <i class="fas fa-image"></i>
                                <p>Add Logo</p>
                            </div>
                        </div>
                        <div class="logo-item">
                            <div class="image-placeholder" data-field="logo2">
                                <i class="fas fa-image"></i>
                                <p>Add Logo</p>
                            </div>
                        </div>
                        <div class="logo-item">
                            <div class="image-placeholder" data-field="logo3">
                                <i class="fas fa-image"></i>
                                <p>Add Logo</p>
                            </div>
                        </div>
                        <div class="logo-item">
                            <div class="image-placeholder" data-field="logo4">
                                <i class="fas fa-image"></i>
                                <p>Add Logo</p>
                            </div>
                        </div>
                        <div class="logo-item">
                            <div class="image-placeholder" data-field="logo5">
                                <i class="fas fa-image"></i>
                                <p>Add Logo</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `,
        fields: {
            title: { type: 'text', label: 'Section Title' },
            logo1: { type: 'image', label: 'Logo 1' },
            logo2: { type: 'image', label: 'Logo 2' },
            logo3: { type: 'image', label: 'Logo 3' },
            logo4: { type: 'image', label: 'Logo 4' },
            logo5: { type: 'image', label: 'Logo 5' }
        }
    },

    benefits: {
        name: 'Benefits Grid',
        category: 'content',
        template: `
            <section id="benefits" class="benefits-section section component" data-component="benefits">
                <div class="component-controls">
                    <button class="control-btn" data-action="edit" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="control-btn" data-action="duplicate" title="Duplicate">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="control-btn" data-action="delete" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="drag-handle">
                    <i class="fas fa-grip-vertical"></i>
                </div>
                <div class="container">
                    <h2 class="editable" data-field="title">Why Choose Our Services</h2>
                    <div class="benefits-grid">
                        <div class="benefit-item">
                            <div class="image-placeholder benefit-image" data-field="image1">
                                <i class="fas fa-image"></i>
                                <p>Add Image</p>
                            </div>
                            <h3 class="editable" data-field="benefit1_title">Premium Quality</h3>
                            <p class="editable" data-field="benefit1_text">We deliver top-quality results that exceed your expectations and drive measurable business growth.</p>
                        </div>
                        <div class="benefit-item">
                            <div class="image-placeholder benefit-image" data-field="image2">
                                <i class="fas fa-image"></i>
                                <p>Add Image</p>
                            </div>
                            <h3 class="editable" data-field="benefit2_title">Cost Effective</h3>
                            <p class="editable" data-field="benefit2_text">Get significantly better ROI with our efficient processes and competitive pricing structure.</p>
                        </div>
                        <div class="benefit-item">
                            <div class="image-placeholder benefit-image" data-field="image3">
                                <i class="fas fa-image"></i>
                                <p>Add Image</p>
                            </div>
                            <h3 class="editable" data-field="benefit3_title">Expert Support</h3>
                            <p class="editable" data-field="benefit3_text">Our team of experts provides continuous optimization and support for maximum performance.</p>
                        </div>
                    </div>
                </div>
            </section>
        `,
        fields: {
            title: { type: 'text', label: 'Section Title' },
            image1: { type: 'image', label: 'Benefit 1 Image' },
            benefit1_title: { type: 'text', label: 'Benefit 1 Title' },
            benefit1_text: { type: 'textarea', label: 'Benefit 1 Description' },
            image2: { type: 'image', label: 'Benefit 2 Image' },
            benefit2_title: { type: 'text', label: 'Benefit 2 Title' },
            benefit2_text: { type: 'textarea', label: 'Benefit 2 Description' },
            image3: { type: 'image', label: 'Benefit 3 Image' },
            benefit3_title: { type: 'text', label: 'Benefit 3 Title' },
            benefit3_text: { type: 'textarea', label: 'Benefit 3 Description' }
        }
    },

    process: {
        name: 'Process Steps',
        category: 'content',
        template: `
            <section class="process-section section component" data-component="process">
                <div class="component-controls">
                    <button class="control-btn" data-action="edit" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="control-btn" data-action="duplicate" title="Duplicate">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="control-btn" data-action="delete" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="drag-handle">
                    <i class="fas fa-grip-vertical"></i>
                </div>
                <div class="container">
                    <h2 class="editable" data-field="title">Our Simple Process</h2>
                    <div class="process-grid">
                        <div class="process-step">
                            <div class="step-icon">
                                <i class="fas fa-lightbulb"></i>
                            </div>
                            <h3 class="editable" data-field="step1_title">Strategy & Planning</h3>
                            <p class="editable" data-field="step1_text">We analyze your goals and create a tailored strategy designed for maximum impact and efficiency.</p>
                        </div>
                        <div class="process-step">
                            <div class="step-icon">
                                <i class="fas fa-rocket"></i>
                            </div>
                            <h3 class="editable" data-field="step2_title">Implementation</h3>
                            <p class="editable" data-field="step2_text">Our expert team executes the plan with precision, ensuring quality and timely delivery.</p>
                        </div>
                        <div class="process-step">
                            <div class="step-icon">
                                <i class="fas fa-chart-line"></i>
                            </div>
                            <h3 class="editable" data-field="step3_title">Optimization</h3>
                            <p class="editable" data-field="step3_text">We continuously monitor and optimize performance to maximize your return on investment.</p>
                        </div>
                    </div>
                </div>
            </section>
        `,
        fields: {
            title: { type: 'text', label: 'Section Title' },
            step1_title: { type: 'text', label: 'Step 1 Title' },
            step1_text: { type: 'textarea', label: 'Step 1 Description' },
            step2_title: { type: 'text', label: 'Step 2 Title' },
            step2_text: { type: 'textarea', label: 'Step 2 Description' },
            step3_title: { type: 'text', label: 'Step 3 Title' },
            step3_text: { type: 'textarea', label: 'Step 3 Description' }
        }
    },

    testimonial: {
        name: 'Testimonial',
        category: 'social-proof',
        template: `
            <section class="testimonial-section section component" data-component="testimonial">
                <div class="component-controls">
                    <button class="control-btn" data-action="edit" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="control-btn" data-action="duplicate" title="Duplicate">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="control-btn" data-action="delete" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="drag-handle">
                    <i class="fas fa-grip-vertical"></i>
                </div>
                <div class="container">
                    <div class="testimonial-content">
                        <div class="testimonial-quote editable" data-field="quote">The team delivered exceptional results that exceeded our expectations. Highly recommended!</div>
                        <div class="testimonial-author editable" data-field="author">– John Smith, CEO</div>
                        <div class="testimonial-company editable" data-field="company">Leading Tech Company</div>
                    </div>
                </div>
            </section>
        `,
        fields: {
            quote: { type: 'textarea', label: 'Testimonial Quote' },
            author: { type: 'text', label: 'Author Name & Title' },
            company: { type: 'text', label: 'Company Name' }
        }
    },

    faq: {
        name: 'FAQ Section',
        category: 'content',
        template: `
            <section id="faq" class="faq-section section component" data-component="faq">
                <div class="component-controls">
                    <button class="control-btn" data-action="edit" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="control-btn" data-action="duplicate" title="Duplicate">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="control-btn" data-action="delete" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="drag-handle">
                    <i class="fas fa-grip-vertical"></i>
                </div>
                <div class="container">
                    <h2 class="editable" data-field="title">Frequently Asked Questions</h2>
                    <div class="faq-container">
                        <div class="faq-item">
                            <button class="faq-question" data-field="question1">
                                <span class="editable">What makes your service different?</span>
                            </button>
                            <div class="faq-answer">
                                <p class="editable" data-field="answer1">We provide premium quality service at competitive prices with expert support throughout the entire process.</p>
                            </div>
                        </div>
                        <div class="faq-item">
                            <button class="faq-question" data-field="question2">
                                <span class="editable">How quickly can you deliver results?</span>
                            </button>
                            <div class="faq-answer">
                                <p class="editable" data-field="answer2">Most projects are completed within 2-4 weeks, depending on complexity and scope requirements.</p>
                            </div>
                        </div>
                        <div class="faq-item">
                            <button class="faq-question" data-field="question3">
                                <span class="editable">Do you offer ongoing support?</span>
                            </button>
                            <div class="faq-answer">
                                <p class="editable" data-field="answer3">Yes, we provide continuous monitoring and optimization to ensure maximum performance and ROI.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `,
        fields: {
            title: { type: 'text', label: 'Section Title' },
            question1: { type: 'text', label: 'Question 1' },
            answer1: { type: 'textarea', label: 'Answer 1' },
            question2: { type: 'text', label: 'Question 2' },
            answer2: { type: 'textarea', label: 'Answer 2' },
            question3: { type: 'text', label: 'Question 3' },
            answer3: { type: 'textarea', label: 'Answer 3' }
        }
    },

    footer: {
        name: 'Footer',
        category: 'footer',
        template: `
            <footer class="footer-section section component" data-component="footer">
                <div class="component-controls">
                    <button class="control-btn" data-action="edit" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="control-btn" data-action="duplicate" title="Duplicate">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="control-btn" data-action="delete" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="drag-handle">
                    <i class="fas fa-grip-vertical"></i>
                </div>
                <div class="container">
                    <div class="footer-content">
                        <div>
                            <div class="image-placeholder footer-logo" data-field="logo">
                                <i class="fas fa-image"></i>
                                <p>Company Logo</p>
                            </div>
                            <p class="footer-text editable" data-field="description">Building exceptional solutions for forward-thinking businesses.</p>
                        </div>
                    </div>
                    <div class="footer-bottom">
                        <p class="editable" data-field="copyright">© 2025 Your Company Name. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        `,
        fields: {
            logo: { type: 'image', label: 'Company Logo' },
            description: { type: 'textarea', label: 'Company Description' },
            copyright: { type: 'text', label: 'Copyright Text' }
        }
    }
};

// Component utility functions
const ComponentUtils = {
    // Create a new component instance
    create(type) {
        const component = Components[type];
        if (!component) {
            console.error(`Component type "${type}" not found`);
            return null;
        }

        const div = document.createElement('div');
        div.innerHTML = component.template.trim();
        const element = div.firstChild;
        
        // Add unique ID
        element.setAttribute('data-component-id', 'comp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9));
        
        return element;
    },

    // Get component definition
    getDefinition(type) {
        return Components[type] || null;
    },

    // Get all component types
    getTypes() {
        return Object.keys(Components);
    },

    // Get components by category
    getByCategory(category) {
        return Object.entries(Components).filter(([key, component]) => 
            component.category === category
        );
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Components, ComponentUtils };
}
