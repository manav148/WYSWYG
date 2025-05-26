// Editor core functionality
class LandingPageEditor {
    constructor() {
        this.landingPage = document.getElementById('landing-page');
        this.previewFrame = document.getElementById('preview-frame');
        this.selectedComponent = null;
        this.history = [];
        this.historyIndex = -1;
        this.draggedComponent = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupDragAndDrop();
        this.setupImageModal();
        this.saveState();
    }

    setupEventListeners() {
        // Component list click handlers
        document.querySelectorAll('.component-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const componentType = item.getAttribute('data-component');
                this.addComponent(componentType);
            });
        });

        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(btn.getAttribute('data-tab'));
            });
        });

        // Device selector
        document.querySelectorAll('.device-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchDevice(btn.getAttribute('data-device'));
            });
        });

        // Global style controls
        this.setupGlobalStyleControls();

        // Undo/Redo
        document.getElementById('undo-btn').addEventListener('click', () => this.undo());
        document.getElementById('redo-btn').addEventListener('click', () => this.redo());

        // Export
        document.getElementById('export-btn').addEventListener('click', () => this.exportPage());

        // Click outside to deselect
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.component') && !e.target.closest('.sidebar')) {
                this.deselectComponent();
            }
        });
    }

    setupGlobalStyleControls() {
        const primaryColor = document.getElementById('primary-color');
        const secondaryColor = document.getElementById('secondary-color');
        const fontFamily = document.getElementById('font-family');
        const baseFontSize = document.getElementById('base-font-size');

        primaryColor.addEventListener('change', (e) => {
            document.documentElement.style.setProperty('--primary-color', e.target.value);
            this.saveState();
        });

        secondaryColor.addEventListener('change', (e) => {
            document.documentElement.style.setProperty('--secondary-color', e.target.value);
            this.saveState();
        });

        fontFamily.addEventListener('change', (e) => {
            document.documentElement.style.setProperty('--font-family', e.target.value);
            this.saveState();
        });

        baseFontSize.addEventListener('input', (e) => {
            const value = e.target.value + 'px';
            document.documentElement.style.setProperty('--base-font-size', value);
            document.querySelector('.value').textContent = value;
            this.saveState();
        });
    }

    setupDragAndDrop() {
        // Make components sortable
        new Sortable(this.landingPage, {
            handle: '.drag-handle',
            animation: 150,
            onEnd: () => {
                this.saveState();
            }
        });
    }

    setupImageModal() {
        const modal = document.getElementById('image-modal');
        const closeBtn = document.getElementById('close-modal');
        const cancelBtn = document.getElementById('cancel-upload');
        const confirmBtn = document.getElementById('confirm-upload');
        const uploadArea = document.getElementById('upload-area');
        const imageInput = document.getElementById('image-input');
        const imageUrl = document.getElementById('image-url');

        let currentImageTarget = null;

        // Close modal
        [closeBtn, cancelBtn].forEach(btn => {
            btn.addEventListener('click', () => {
                modal.classList.remove('active');
                currentImageTarget = null;
            });
        });

        // Upload area click
        uploadArea.addEventListener('click', () => {
            imageInput.click();
        });

        // File input change
        imageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    imageUrl.value = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });

        // Confirm upload
        confirmBtn.addEventListener('click', () => {
            const url = imageUrl.value;
            if (url && currentImageTarget) {
                this.setImageSrc(currentImageTarget, url);
                modal.classList.remove('active');
                currentImageTarget = null;
                imageUrl.value = '';
                imageInput.value = '';
                this.saveState();
            }
        });

        // Image placeholder click handler
        document.addEventListener('click', (e) => {
            if (e.target.closest('.image-placeholder')) {
                currentImageTarget = e.target.closest('.image-placeholder');
                modal.classList.add('active');
            }
        });
    }

    addComponent(type) {
        const component = ComponentUtils.create(type);
        if (component) {
            this.landingPage.appendChild(component);
            this.setupComponentEvents(component);
            this.saveState();
            
            // Auto-select the new component
            this.selectComponent(component);
        }
    }

    setupComponentEvents(component) {
        // Component controls
        const controls = component.querySelectorAll('.control-btn');
        controls.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = btn.getAttribute('data-action');
                this.handleComponentAction(component, action);
            });
        });

        // Component selection
        component.addEventListener('click', (e) => {
            e.stopPropagation();
            this.selectComponent(component);
        });

        // Editable content
        const editables = component.querySelectorAll('.editable');
        editables.forEach(editable => {
            this.setupEditableElement(editable);
        });
    }

    setupEditableElement(element) {
        element.addEventListener('click', (e) => {
            e.stopPropagation();
            this.startEditing(element);
        });

        element.addEventListener('blur', () => {
            this.stopEditing(element);
        });

        element.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                element.blur();
            }
        });
    }

    startEditing(element) {
        element.contentEditable = true;
        element.classList.add('editing');
        element.focus();
        
        // Select all text
        const range = document.createRange();
        range.selectNodeContents(element);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }

    stopEditing(element) {
        element.contentEditable = false;
        element.classList.remove('editing');
        this.saveState();
    }

    selectComponent(component) {
        // Remove previous selection
        this.deselectComponent();
        
        // Select new component
        this.selectedComponent = component;
        component.classList.add('selected');
        
        // Show element styles panel
        this.showElementStyles(component);
    }

    deselectComponent() {
        if (this.selectedComponent) {
            this.selectedComponent.classList.remove('selected');
            this.selectedComponent = null;
        }
        
        // Hide element styles panel
        document.getElementById('element-styles').style.display = 'none';
    }

    showElementStyles(component) {
        const elementStyles = document.getElementById('element-styles');
        const controlsContainer = document.getElementById('element-style-controls');
        
        // Clear previous controls
        controlsContainer.innerHTML = '';
        
        // Get component type and definition
        const componentType = component.getAttribute('data-component');
        const definition = ComponentUtils.getDefinition(componentType);
        
        if (definition && definition.styles) {
            Object.entries(definition.styles).forEach(([key, config]) => {
                const controlGroup = this.createStyleControl(key, config, component);
                controlsContainer.appendChild(controlGroup);
            });
        }
        
        // Add common style controls
        this.addCommonStyleControls(controlsContainer, component);
        
        elementStyles.style.display = 'block';
    }

    createStyleControl(key, config, component) {
        const group = document.createElement('div');
        group.className = 'control-group';
        
        const label = document.createElement('label');
        label.textContent = config.label || key;
        group.appendChild(label);
        
        if (config.type === 'select') {
            const select = document.createElement('select');
            config.options.forEach(option => {
                const optionEl = document.createElement('option');
                optionEl.value = option;
                optionEl.textContent = option;
                select.appendChild(optionEl);
            });
            
            select.addEventListener('change', (e) => {
                this.applyStyleToComponent(component, key, e.target.value);
            });
            
            group.appendChild(select);
        }
        
        return group;
    }

    addCommonStyleControls(container, component) {
        // Margin
        const marginGroup = this.createRangeControl('Margin', 'margin', 0, 100, (value) => {
            component.style.margin = value + 'px';
            this.saveState();
        });
        container.appendChild(marginGroup);
        
        // Padding
        const paddingGroup = this.createRangeControl('Padding', 'padding', 0, 100, (value) => {
            component.style.padding = value + 'px';
            this.saveState();
        });
        container.appendChild(paddingGroup);
    }

    createRangeControl(label, name, min, max, callback) {
        const group = document.createElement('div');
        group.className = 'control-group';
        
        const labelEl = document.createElement('label');
        labelEl.textContent = label;
        group.appendChild(labelEl);
        
        const input = document.createElement('input');
        input.type = 'range';
        input.min = min;
        input.max = max;
        input.value = 0;
        
        const valueSpan = document.createElement('span');
        valueSpan.className = 'value';
        valueSpan.textContent = '0px';
        
        input.addEventListener('input', (e) => {
            const value = e.target.value;
            valueSpan.textContent = value + 'px';
            callback(value);
        });
        
        group.appendChild(input);
        group.appendChild(valueSpan);
        
        return group;
    }

    applyStyleToComponent(component, property, value) {
        // Remove existing classes that match the property
        if (property === 'background') {
            component.classList.remove('bg-gradient-blue', 'bg-gradient-sunset', 'bg-gradient-ocean', 'bg-gradient-forest');
        }
        
        // Add new class
        component.classList.add(value);
        this.saveState();
    }

    handleComponentAction(component, action) {
        switch (action) {
            case 'edit':
                this.selectComponent(component);
                break;
            case 'duplicate':
                this.duplicateComponent(component);
                break;
            case 'delete':
                this.deleteComponent(component);
                break;
        }
    }

    duplicateComponent(component) {
        const clone = component.cloneNode(true);
        const newId = 'comp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        clone.setAttribute('data-component-id', newId);
        
        component.parentNode.insertBefore(clone, component.nextSibling);
        this.setupComponentEvents(clone);
        this.saveState();
    }

    deleteComponent(component) {
        if (this.selectedComponent === component) {
            this.deselectComponent();
        }
        component.remove();
        this.saveState();
    }

    setImageSrc(placeholder, src) {
        const img = document.createElement('img');
        img.src = src;
        img.alt = 'Uploaded image';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        
        // Clear placeholder content and add image
        placeholder.innerHTML = '';
        placeholder.appendChild(img);
        placeholder.classList.remove('image-placeholder');
        placeholder.classList.add('image-container');
        
        // Add click handler to change image
        placeholder.addEventListener('click', (e) => {
            e.stopPropagation();
            this.currentImageTarget = placeholder;
            document.getElementById('image-modal').classList.add('active');
        });
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }

    switchDevice(device) {
        // Update device buttons
        document.querySelectorAll('.device-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-device="${device}"]`).classList.add('active');
        
        // Update preview frame
        this.previewFrame.className = `preview-frame ${device}`;
    }

    saveState() {
        const state = {
            html: this.landingPage.innerHTML,
            styles: {
                primaryColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color'),
                secondaryColor: getComputedStyle(document.documentElement).getPropertyValue('--secondary-color'),
                fontFamily: getComputedStyle(document.documentElement).getPropertyValue('--font-family'),
                baseFontSize: getComputedStyle(document.documentElement).getPropertyValue('--base-font-size')
            }
        };
        
        // Remove future history if we're not at the end
        if (this.historyIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.historyIndex + 1);
        }
        
        this.history.push(JSON.stringify(state));
        this.historyIndex++;
        
        // Limit history size
        if (this.history.length > 50) {
            this.history.shift();
            this.historyIndex--;
        }
        
        this.updateUndoRedoButtons();
    }

    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.loadState(JSON.parse(this.history[this.historyIndex]));
            this.updateUndoRedoButtons();
        }
    }

    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.loadState(JSON.parse(this.history[this.historyIndex]));
            this.updateUndoRedoButtons();
        }
    }

    loadState(state) {
        this.landingPage.innerHTML = state.html;
        
        // Restore styles
        Object.entries(state.styles).forEach(([key, value]) => {
            if (value) {
                document.documentElement.style.setProperty(`--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`, value);
            }
        });
        
        // Re-setup events for all components
        this.landingPage.querySelectorAll('.component').forEach(component => {
            this.setupComponentEvents(component);
        });
        
        this.deselectComponent();
    }

    updateUndoRedoButtons() {
        const undoBtn = document.getElementById('undo-btn');
        const redoBtn = document.getElementById('redo-btn');
        
        undoBtn.disabled = this.historyIndex <= 0;
        redoBtn.disabled = this.historyIndex >= this.history.length - 1;
    }

    exportPage() {
        const exporter = new PageExporter(this.landingPage, {
            primaryColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color'),
            secondaryColor: getComputedStyle(document.documentElement).getPropertyValue('--secondary-color'),
            fontFamily: getComputedStyle(document.documentElement).getPropertyValue('--font-family'),
            baseFontSize: getComputedStyle(document.documentElement).getPropertyValue('--base-font-size')
        });
        
        exporter.export();
    }
}

// Initialize sortable functionality (requires sortable.js)
// For now, we'll add a simple drag-and-drop implementation placeholder
const Sortable = class {
    constructor(element, options) {
        this.element = element;
        this.options = options;
        // Simple placeholder - in a real implementation, you'd use SortableJS
        console.log('Sortable initialized', element, options);
    }
};
