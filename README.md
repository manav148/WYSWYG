# WYSIWYG Landing Page Editor

A comprehensive web-based WYSIWYG (What You See Is What You Get) editor for creating professional landing pages. Built with vanilla JavaScript, HTML, and CSS.

## Features

### 🎨 **Visual Editing**
- Drag and drop components to build your landing page
- Real-time preview with live editing
- Click-to-edit text content
- Component hover effects and selection
- Responsive design preview (Desktop, Tablet, Mobile)

### 🧩 **Pre-built Components**
- **Hero Section**: Eye-catching header with title, subtitle, and CTA
- **Trust Badges**: Logo showcase for credibility
- **Benefits Grid**: Feature highlights with images and descriptions
- **Process Steps**: Numbered step-by-step process explanation
- **Testimonials**: Customer feedback and social proof
- **FAQ Section**: Expandable frequently asked questions
- **Footer**: Contact information and legal text

### 🎯 **Customization Options**
- **Global Styles**: Primary/secondary colors, fonts, font sizes
- **Component Styles**: Background variants, text alignment, spacing
- **Responsive Controls**: Different styles for desktop, tablet, mobile
- **Image Management**: Upload images or use URLs
- **Style Presets**: Modern, Classic, Minimal, and Vibrant themes

### ⚡ **Advanced Features**
- **Undo/Redo**: Full history tracking with keyboard shortcuts
- **Auto-save**: Automatic saving to localStorage every 30 seconds
- **Export Options**: Download as HTML, open preview, or export project
- **Keyboard Shortcuts**: Efficient workflow with common shortcuts
- **Device Preview**: Test responsive design across different screen sizes

## Getting Started

### Quick Start
1. Open `index.html` in your web browser
2. Click components from the sidebar to add them to your page
3. Click on any text to edit it inline
4. Use the Styles tab to customize colors and fonts
5. Export your finished landing page

### File Structure
```
├── index.html              # Main editor interface
├── css/
│   ├── editor.css          # Editor interface styles
│   ├── preview.css         # Landing page preview styles
│   └── components.css      # Component-specific styles
├── js/
│   ├── main.js            # Application entry point
│   ├── editor.js          # Core editor functionality
│   ├── components.js      # Component definitions
│   ├── styler.js          # Style management
│   └── exporter.js        # Export functionality
└── README.md              # This file
```

## Usage Guide

### Adding Components
1. **Select a Component**: Click any component from the left sidebar
2. **Edit Content**: Click on text elements to edit them inline
3. **Upload Images**: Click on image placeholders to upload or add image URLs
4. **Reorder Components**: Use drag handles to reorder sections

### Customizing Styles
1. **Global Styles**: Use the Styles tab to set primary colors, fonts, and base font size
2. **Component Styles**: Select a component and use the element styles panel
3. **Responsive Design**: Use device selector to preview different screen sizes

### Keyboard Shortcuts
- `Ctrl/Cmd + Z`: Undo last action
- `Ctrl/Cmd + Shift + Z`: Redo last action
- `Ctrl/Cmd + S`: Export page
- `Escape`: Deselect current component
- `Delete`: Delete selected component

### Exporting Your Page
1. Click the **Export** button in the top toolbar
2. Choose from three export options:
   - **Download HTML**: Complete standalone HTML file
   - **Download Project**: HTML with separate CSS (future feature)
   - **Open Preview**: View in new tab

## Technical Details

### Architecture
- **Component-based**: Modular component system for easy extension
- **Event-driven**: Clean event handling for user interactions
- **State management**: History tracking with undo/redo functionality
- **Responsive**: Mobile-first design with responsive components

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ JavaScript features required
- Local storage for auto-save functionality

### Dependencies
- **Font Awesome**: Icons for the interface
- **Google Fonts**: Web fonts (Inter family)
- **No framework dependencies**: Pure vanilla JavaScript

## Customization

### Adding New Components
1. Define component in `js/components.js`:
```javascript
newComponent: {
    name: 'New Component',
    category: 'content',
    template: `<section class="new-component">...</section>`,
    fields: {
        title: { type: 'text', label: 'Title' }
    }
}
```

2. Add corresponding CSS in `css/components.css`
3. Component will automatically appear in the sidebar

### Creating Custom Themes
```javascript
// Add to StyleManager presets
styleManager.applyPreset('custom', {
    primaryColor: '#your-color',
    secondaryColor: '#your-secondary',
    fontFamily: 'Your Font',
    baseFontSize: '16px'
});
```

## Performance Considerations

- **Lazy loading**: Components loaded on demand
- **Optimized CSS**: Minimal and efficient stylesheets
- **Memory management**: Proper cleanup of event listeners
- **Auto-save throttling**: Prevents excessive localStorage writes

## Future Enhancements

- [ ] Multi-page support
- [ ] Template library
- [ ] Advanced animations
- [ ] Collaboration features
- [ ] Cloud storage integration
- [ ] A/B testing tools
- [ ] Analytics integration
- [ ] SEO optimization tools

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For questions, issues, or feature requests, please open an issue in the repository.

---

**Built with ❤️ for creating beautiful landing pages**
