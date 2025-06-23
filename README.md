# Rakesh Das - 3D Portfolio

A stunning, interactive 3D portfolio website showcasing Rakesh Das's professional experience, skills, and projects. Built with modern web technologies and featuring smooth animations, 3D effects, and a responsive design.

## ✨ Features

### 🌟 3D Visual Effects
- **Animated 3D Background**: Particle system with floating geometries using Three.js
- **Interactive Mouse Tracking**: 3D elements respond to mouse movement
- **Floating Cube Animation**: Smooth 3D transformations in the hero section
- **Loading Screen**: Animated 3D cube loader

### 🎨 Modern Design
- **Gradient Color Scheme**: Beautiful purple-blue gradient theme
- **Glass Morphism**: Frosted glass effects with backdrop blur
- **Smooth Animations**: CSS transforms and transitions
- **Responsive Layout**: Mobile-first design approach

### 🚀 Interactive Elements
- **Smooth Scrolling Navigation**: Animated navigation with active states
- **Scroll Animations**: Elements animate into view as you scroll
- **Hover Effects**: Interactive buttons and cards with hover states
- **Typing Animation**: Typewriter effect for the hero title
- **Ripple Effects**: Material design-inspired button interactions

### 📱 Responsive Features
- **Mobile Navigation**: Hamburger menu for mobile devices
- **Adaptive Layout**: Optimized for all screen sizes
- **Touch-Friendly**: Mobile-optimized interactions

### 🎯 Sections
- **Hero Section**: Animated introduction with 3D elements
- **About**: Personal information and interests
- **Skills**: Categorized technical skills with hover effects
- **Experience**: Timeline-based work history
- **Projects**: Showcase of key projects and certifications
- **Education**: Academic background
- **Contact**: Interactive contact form

## 🛠️ Technologies Used

- **HTML5**: Semantic markup structure
- **CSS3**: Modern styling with gradients, animations, and grid layouts
- **JavaScript (ES6+)**: Interactive functionality and animations
- **Three.js**: 3D graphics and animations
- **Font Awesome**: Icon library
- **Google Fonts**: Poppins font family

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional but recommended)

### Installation

1. **Clone or download** the portfolio files
2. **Open the project** in your preferred code editor
3. **Serve the files** using one of these methods:

#### Method 1: Using Python (Recommended)
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

#### Method 2: Using Node.js
```bash
# Install http-server globally
npm install -g http-server

# Start the server
http-server
```

#### Method 3: Using Live Server (VS Code Extension)
- Install the Live Server extension in VS Code
- Right-click on `index.html`
- Select "Open with Live Server"

#### Method 4: Direct File Opening
- Simply double-click `index.html` to open in your browser
- Note: Some features may not work due to CORS restrictions

## 🎨 Customization

### Personalizing the Portfolio

1. **Update Personal Information**:
   - Edit the hero section text in `index.html`
   - Modify contact details and social links
   - Update the profile description

2. **Modify Skills**:
   - Add/remove skill categories in the skills section
   - Update skill icons and names
   - Adjust skill animations

3. **Update Experience**:
   - Add new work experiences to the timeline
   - Modify job descriptions and achievements
   - Update company names and dates

4. **Customize Projects**:
   - Add new projects with descriptions
   - Update project links and technologies
   - Modify project images (if added)

5. **Color Scheme**:
   - Modify CSS variables for colors
   - Update gradient combinations
   - Change accent colors

### Configuration Options

The portfolio includes several customizable features:

```javascript
// Animation speeds
const TYPING_SPEED = 100; // milliseconds per character
const LOADING_DURATION = 2000; // loading screen duration

// 3D Settings
const PARTICLE_COUNT = 1000; // number of background particles
const FLOATING_OBJECTS = 20; // number of 3D objects
```

## 📝 Browser Support

- ✅ Chrome 60+
- ✅ Firefox 60+  
- ✅ Safari 12+
- ✅ Edge 79+
- ⚠️ Internet Explorer: Not supported (requires modern JavaScript features)

## 🎯 Performance Optimization

The portfolio includes several performance optimizations:

- **Lazy Loading**: Animations trigger only when elements are visible
- **RequestAnimationFrame**: Smooth 60fps animations
- **Debounced Scroll Events**: Optimized scroll handling
- **Efficient DOM Updates**: Minimal reflow and repaint operations

## 📱 Mobile Optimization

- **Touch-friendly buttons**: Larger tap targets
- **Responsive typography**: Scalable text sizes
- **Optimized animations**: Reduced motion for better performance
- **Mobile navigation**: Hamburger menu system

## 🔧 Troubleshooting

### Common Issues

1. **3D animations not working**:
   - Ensure browser supports WebGL
   - Check browser console for errors
   - Verify Three.js CDN is loading

2. **Smooth scrolling not working**:
   - Enable smooth scrolling in browser settings
   - Check for JavaScript errors
   - Verify CSS scroll-behavior support

3. **Loading screen stuck**:
   - Check network connection
   - Verify all resources are loading
   - Look for JavaScript errors in console

## 🎉 Features in Detail

### 3D Background Animation
The portfolio features a sophisticated 3D background with:
- 1000+ animated particles
- Floating geometric shapes
- Mouse-interactive camera movement
- Smooth performance optimization

### Interactive Timeline
The experience section includes:
- Animated timeline with markers
- Staggered reveal animations
- Hover effects on timeline items
- Responsive mobile layout

### Skill Visualization
Skills are displayed with:
- Category-based organization
- Hover animations and tooltips
- Icon-based visual representation
- Smooth reveal animations

### Contact Form
The contact section features:
- Form validation
- Animated feedback messages
- Floating label effects
- Responsive layout

## 📧 Contact & Support

For questions or support regarding this portfolio template:

- **Email**: imrakesh.gir@gmail.com
- **Phone**: +91 7992353564
- **LinkedIn**: [Connect with Rakesh](https://www.linkedin.com/in/rakesh-das-28141a165/)
- **GitHub**: [View Projects](https://github.com/RakeshDas16)
- **Twitter/X**: [Follow @RakeshD72353149](https://x.com/RakeshD72353149)

## 📄 License

This portfolio template is open source and available under the MIT License.

## 🙏 Acknowledgments

- **Three.js** for 3D graphics capabilities
- **Font Awesome** for beautiful icons
- **Google Fonts** for typography
- **CSS Grid** for responsive layouts

---

Built with ❤️ by Rakesh Das 