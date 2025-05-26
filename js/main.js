// Main application entry point
class App {
    constructor() {
        this.editor = null;
        this.styleManager = null;
        this.themeManager = null;
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        try {
            // Initialize style manager
            this.styleManager = new StyleManager();
            
            // Initialize theme manager
            this.themeManager = new ThemeManager(this.styleManager);
            
            // Initialize main editor
            this.editor = new LandingPageEditor();
            
            // Setup additional features
            this.setupKeyboardShortcuts();
            this.setupAutoSave();
            this.loadDefaultTemplate();
            
            console.log('WYSIWYG Landing Page Editor initialized successfully');
            
        } catch (error) {
            console.error('Error initializing editor:', error);
            this.showErrorMessage('Failed to initialize editor. Please refresh the page.');
        }
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Z for undo
            if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                this.editor.undo();
            }
            
            // Ctrl/Cmd + Shift + Z for redo
            if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
                e.preventDefault();
                this.editor.redo();
            }
            
            // Ctrl/Cmd + S for save/export
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                this.editor.exportPage();
            }
            
            // Escape to deselect component
            if (e.key === 'Escape') {
                this.editor.deselectComponent();
            }
            
            // Delete key to delete selected component
            if (e.key === 'Delete' && this.editor.selectedComponent) {
                e.preventDefault();
                this.editor.deleteComponent(this.editor.selectedComponent);
            }
        });
    }

    setupAutoSave() {
        // Auto-save to localStorage every 30 seconds
        setInterval(() => {
            this.saveToLocalStorage();
        }, 30000);

        // Save when page is about to unload
        window.addEventListener('beforeunload', () => {
            this.saveToLocalStorage();
        });

        // Try to restore from localStorage on startup
        this.loadFromLocalStorage();
    }

    saveToLocalStorage() {
        try {
            const state = {
                html: this.editor.landingPage.innerHTML,
                styles: this.styleManager.exportStyles(),
                timestamp: Date.now()
            };
            
            localStorage.setItem('wysiwyg-editor-state', JSON.stringify(state));
            console.log('Auto-saved to localStorage');
            
        } catch (error) {
            console.warn('Failed to auto-save:', error);
        }
    }

    loadFromLocalStorage() {
        try {
            const saved = localStorage.getItem('wysiwyg-editor-state');
            if (saved) {
                const state = JSON.parse(saved);
                
                // Check if saved state is not too old (7 days)
                const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
                if (state.timestamp > weekAgo) {
                    this.showRestorePrompt(state);
                }
            }
        } catch (error) {
            console.warn('Failed to load from localStorage:', error);
        }
    }

    showRestorePrompt(state) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 400px;">
                <div class="modal-header">
                    <h3>Restore Previous Work?</h3>
                </div>
                <div class="modal-body">
                    <p>We found a previous version of your landing page. Would you like to restore it?</p>
                    <p><small>Last saved: ${new Date(state.timestamp).toLocaleString()}</small></p>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">
                        Start Fresh
                    </button>
                    <button class="btn btn-primary" onclick="app.restoreState(${JSON.stringify(state).replace(/"/g, '&quot;')}); this.closest('.modal').remove();">
                        Restore
                    </button>
                </div>
            </div>
        `;
        
        modal.classList.add('active');
        document.body.appendChild(modal);
    }

    restoreState(state) {
        try {
            // Restore HTML
            this.editor.landingPage.innerHTML = state.html;
            
            // Restore styles
            this.styleManager.importStyles(state.styles);
            
            // Re-setup component events
            this.editor.landingPage.querySelectorAll('.component').forEach(component => {
                this.editor.setupComponentEvents(component);
            });
            
            // Save current state to history
            this.editor.saveState();
            
            this.showSuccessMessage('Previous work restored successfully!');
            
        } catch (error) {
            console.error('Failed to restore state:', error);
            this.showErrorMessage('Failed to restore previous work.');
        }
    }

    loadDefaultTemplate() {
        // Check if landing page is empty and load a default template
        if (!this.editor.landingPage.children.length) {
            this.loadSamplePage();
        }
    }

    loadSamplePage() {
        // Add a sample header and hero section to get users started
        const headerComponent = ComponentUtils.create('header');
        if (headerComponent) {
            this.editor.landingPage.appendChild(headerComponent);
            this.editor.setupComponentEvents(headerComponent);
        }
        
        const heroComponent = ComponentUtils.create('hero');
        if (heroComponent) {
            this.editor.landingPage.appendChild(heroComponent);
            this.editor.setupComponentEvents(heroComponent);
        }
        
        this.editor.saveState();
    }

    showSuccessMessage(message) {
        this.showNotification(message, 'success');
    }

    showErrorMessage(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 15px 20px;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            animation: slideInFromRight 0.3s ease;
            max-width: 300px;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; cursor: pointer; margin-left: auto;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOutToRight 0.3s ease forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    getNotificationColor(type) {
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#007bff'
        };
        return colors[type] || colors.info;
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-triangle',
            warning: 'fa-exclamation-circle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    // Export methods for external access
    exportCurrentPage() {
        return this.editor.exportPage();
    }

    clearPage() {
        if (confirm('Are you sure you want to clear the entire page? This action cannot be undone.')) {
            this.editor.landingPage.innerHTML = '';
            this.editor.deselectComponent();
            this.editor.saveState();
            this.showSuccessMessage('Page cleared successfully!');
        }
    }

    resetToDefaults() {
        if (confirm('Are you sure you want to reset all styles to defaults? This action cannot be undone.')) {
            this.styleManager.resetStyles();
            this.editor.saveState();
            this.showSuccessMessage('Styles reset to defaults!');
        }
    }
}

// Add custom CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
@keyframes slideInFromRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOutToRight {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(100%);
        opacity: 0;
    }
}

.notification {
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    line-height: 1.4;
}

.notification button {
    font-size: 12px;
}

/* Loading spinner */
.loading-spinner {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: #fff;
    animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

/* Helper classes */
.fade-in {
    animation: fadeIn 0.5s ease-in;
}

.fade-out {
    animation: fadeOut 0.5s ease-out forwards;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
}

/* Improved button disabled state */
.btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
}

/* Better focus states */
.btn:focus,
.tab-btn:focus,
.device-btn:focus {
    outline: 2px solid #007bff;
    outline-offset: 2px;
}

/* Improved scrollbar for webkit browsers */
.sidebar::-webkit-scrollbar,
.preview-frame::-webkit-scrollbar {
    width: 8px;
}

.sidebar::-webkit-scrollbar-track,
.preview-frame::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
}

.sidebar::-webkit-scrollbar-thumb,
.preview-frame::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
}

.sidebar::-webkit-scrollbar-thumb:hover,
.preview-frame::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}
`;
document.head.appendChild(notificationStyles);

// Global error handler
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    if (window.app) {
        window.app.showErrorMessage('An unexpected error occurred. Check the console for details.');
    }
});

// Global promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    if (window.app) {
        window.app.showErrorMessage('An error occurred while processing your request.');
    }
});

// Initialize the application
const app = new App();

// Make app globally accessible for debugging
window.app = app;

// Add some useful global functions
window.exportPage = () => app.exportCurrentPage();
window.clearPage = () => app.clearPage();
window.resetStyles = () => app.resetToDefaults();

// Console welcome message
console.log(`
🎨 WYSIWYG Landing Page Editor
============================
Ready to create beautiful landing pages!

Available global functions:
- exportPage() - Export current page
- clearPage() - Clear the entire page  
- resetStyles() - Reset all styles to defaults

Keyboard shortcuts:
- Ctrl/Cmd + Z: Undo
- Ctrl/Cmd + Shift + Z: Redo
- Ctrl/Cmd + S: Export page
- Escape: Deselect component
- Delete: Delete selected component
`);
