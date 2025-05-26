// Style management functionality
class StyleManager {
    constructor() {
        this.customStyles = new Map();
        this.globalStyles = {
            primaryColor: '#007bff',
            secondaryColor: '#6c757d',
            fontFamily: 'Inter',
            baseFontSize: '16px'
        };
        
        this.init();
    }

    init() {
        this.loadDefaultStyles();
        this.setupStyleObserver();
    }

    loadDefaultStyles() {
        // Apply default global styles
        Object.entries(this.globalStyles).forEach(([key, value]) => {
            this.setGlobalStyle(key, value);
        });
    }

    setupStyleObserver() {
        // Watch for style changes in the document
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    this.onStyleChange(mutation.target);
                }
            });
        });

        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['style'],
            subtree: true
        });
    }

    setGlobalStyle(property, value) {
        const cssProperty = `--${property.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
        document.documentElement.style.setProperty(cssProperty, value);
        this.globalStyles[property] = value;
    }

    getGlobalStyle(property) {
        return this.globalStyles[property];
    }

    setComponentStyle(componentId, property, value) {
        if (!this.customStyles.has(componentId)) {
            this.customStyles.set(componentId, {});
        }
        
        const componentStyles = this.customStyles.get(componentId);
        componentStyles[property] = value;
        
        this.applyComponentStyle(componentId, property, value);
    }

    applyComponentStyle(componentId, property, value) {
        const component = document.querySelector(`[data-component-id="${componentId}"]`);
        if (component) {
            component.style[property] = value;
        }
    }

    removeComponentStyle(componentId, property) {
        if (this.customStyles.has(componentId)) {
            const componentStyles = this.customStyles.get(componentId);
            delete componentStyles[property];
            
            const component = document.querySelector(`[data-component-id="${componentId}"]`);
            if (component) {
                component.style.removeProperty(property);
            }
        }
    }

    getComponentStyles(componentId) {
        return this.customStyles.get(componentId) || {};
    }

    onStyleChange(element) {
        const componentId = element.getAttribute('data-component-id');
        if (componentId) {
            // Update our internal style tracking
            const computedStyles = window.getComputedStyle(element);
            const inlineStyles = element.style;
            
            if (!this.customStyles.has(componentId)) {
                this.customStyles.set(componentId, {});
            }
            
            // Track inline styles
            for (let i = 0; i < inlineStyles.length; i++) {
                const property = inlineStyles[i];
                const value = inlineStyles.getPropertyValue(property);
                this.customStyles.get(componentId)[property] = value;
            }
        }
    }

    generateStyleSheet() {
        let css = ':root {\n';
        
        // Add global CSS variables
        Object.entries(this.globalStyles).forEach(([key, value]) => {
            const cssProperty = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
            css += `  ${cssProperty}: ${value};\n`;
        });
        
        css += '}\n\n';

        // Add component-specific styles
        this.customStyles.forEach((styles, componentId) => {
            if (Object.keys(styles).length > 0) {
                css += `[data-component-id="${componentId}"] {\n`;
                Object.entries(styles).forEach(([property, value]) => {
                    css += `  ${property}: ${value};\n`;
                });
                css += '}\n\n';
            }
        });

        return css;
    }

    exportStyles() {
        return {
            global: { ...this.globalStyles },
            components: Object.fromEntries(this.customStyles)
        };
    }

    importStyles(styles) {
        if (styles.global) {
            Object.entries(styles.global).forEach(([key, value]) => {
                this.setGlobalStyle(key, value);
            });
        }

        if (styles.components) {
            Object.entries(styles.components).forEach(([componentId, componentStyles]) => {
                this.customStyles.set(componentId, componentStyles);
                Object.entries(componentStyles).forEach(([property, value]) => {
                    this.applyComponentStyle(componentId, property, value);
                });
            });
        }
    }

    resetStyles() {
        // Reset to defaults
        this.customStyles.clear();
        this.globalStyles = {
            primaryColor: '#007bff',
            secondaryColor: '#6c757d',
            fontFamily: 'Inter',
            baseFontSize: '16px'
        };
        this.loadDefaultStyles();

        // Clear all inline styles from components
        document.querySelectorAll('[data-component-id]').forEach(element => {
            element.removeAttribute('style');
        });
    }

    // Utility methods for common style operations
    addCSSClass(componentId, className) {
        const component = document.querySelector(`[data-component-id="${componentId}"]`);
        if (component) {
            component.classList.add(className);
        }
    }

    removeCSSClass(componentId, className) {
        const component = document.querySelector(`[data-component-id="${componentId}"]`);
        if (component) {
            component.classList.remove(className);
        }
    }

    toggleCSSClass(componentId, className) {
        const component = document.querySelector(`[data-component-id="${componentId}"]`);
        if (component) {
            component.classList.toggle(className);
        }
    }

    // Color manipulation utilities
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    lightenColor(color, percent) {
        const rgb = this.hexToRgb(color);
        if (!rgb) return color;

        const factor = (100 + percent) / 100;
        return this.rgbToHex(
            Math.min(255, Math.round(rgb.r * factor)),
            Math.min(255, Math.round(rgb.g * factor)),
            Math.min(255, Math.round(rgb.b * factor))
        );
    }

    darkenColor(color, percent) {
        const rgb = this.hexToRgb(color);
        if (!rgb) return color;

        const factor = (100 - percent) / 100;
        return this.rgbToHex(
            Math.round(rgb.r * factor),
            Math.round(rgb.g * factor),
            Math.round(rgb.b * factor)
        );
    }

    // Responsive style management
    setResponsiveStyle(componentId, property, values) {
        const component = document.querySelector(`[data-component-id="${componentId}"]`);
        if (!component) return;

        // Apply desktop value as default
        if (values.desktop) {
            component.style[property] = values.desktop;
        }

        // Create responsive CSS rules
        let css = '';
        if (values.tablet) {
            css += `@media (max-width: 768px) { [data-component-id="${componentId}"] { ${property}: ${values.tablet}; } }\n`;
        }
        if (values.mobile) {
            css += `@media (max-width: 576px) { [data-component-id="${componentId}"] { ${property}: ${values.mobile}; } }\n`;
        }

        // Add to document head
        if (css) {
            this.addCustomCSS(css, `responsive-${componentId}-${property}`);
        }
    }

    addCustomCSS(css, id) {
        // Remove existing style with same ID
        const existing = document.getElementById(id);
        if (existing) {
            existing.remove();
        }

        // Add new style element
        const style = document.createElement('style');
        style.id = id;
        style.textContent = css;
        document.head.appendChild(style);
    }

    removeCustomCSS(id) {
        const style = document.getElementById(id);
        if (style) {
            style.remove();
        }
    }

    // Animation utilities
    addAnimation(componentId, animationName, duration = '0.5s', easing = 'ease') {
        const component = document.querySelector(`[data-component-id="${componentId}"]`);
        if (component) {
            component.style.animation = `${animationName} ${duration} ${easing}`;
        }
    }

    removeAnimation(componentId) {
        const component = document.querySelector(`[data-component-id="${componentId}"]`);
        if (component) {
            component.style.animation = '';
        }
    }

    // Predefined style presets
    applyPreset(presetName) {
        const presets = {
            modern: {
                primaryColor: '#6366f1',
                secondaryColor: '#8b5cf6',
                fontFamily: 'Inter',
                baseFontSize: '16px'
            },
            classic: {
                primaryColor: '#dc2626',
                secondaryColor: '#7c2d12',
                fontFamily: 'Georgia',
                baseFontSize: '18px'
            },
            minimal: {
                primaryColor: '#000000',
                secondaryColor: '#6b7280',
                fontFamily: 'Arial',
                baseFontSize: '15px'
            },
            vibrant: {
                primaryColor: '#f59e0b',
                secondaryColor: '#ea580c',
                fontFamily: 'Inter',
                baseFontSize: '16px'
            }
        };

        const preset = presets[presetName];
        if (preset) {
            Object.entries(preset).forEach(([key, value]) => {
                this.setGlobalStyle(key, value);
            });
        }
    }
}

// Theme management
class ThemeManager {
    constructor(styleManager) {
        this.styleManager = styleManager;
        this.themes = {
            light: {
                background: '#ffffff',
                text: '#333333',
                surface: '#f8f9fa'
            },
            dark: {
                background: '#1a1a1a',
                text: '#ffffff',
                surface: '#2d2d2d'
            }
        };
        this.currentTheme = 'light';
    }

    setTheme(themeName) {
        const theme = this.themes[themeName];
        if (!theme) return;

        this.currentTheme = themeName;
        
        // Apply theme styles
        Object.entries(theme).forEach(([key, value]) => {
            this.styleManager.setGlobalStyle(`theme-${key}`, value);
        });

        // Add theme class to body
        document.body.className = document.body.className.replace(/theme-\w+/g, '');
        document.body.classList.add(`theme-${themeName}`);
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    addCustomTheme(name, themeConfig) {
        this.themes[name] = themeConfig;
    }
}
