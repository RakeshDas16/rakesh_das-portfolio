/* ==========================================================================
   Modern Portfolio JavaScript
   Clean, professional interactions with 3D effects
   ========================================================================== */

// Global variables
let scene, camera, renderer, particles, geometries;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

// Premium interaction variables
let cursorTrail = [];
let magneticElements = [];
let scrollProgress = 0;
let currentTheme = 'dark';
let skillsAnimated = false;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initLoadingScreen();
    init3DBackground();
    initNavigation();
    initScrollAnimations();
    initFormHandling();
    initTypingEffect();
    initCyclingText();
    initMobileNavigation();
    updateBackgroundColor();
    initMusicPlayer();
    initializeSpotlightEffect();
    
    // Initialize premium features
    initInteractiveCursor();
    initAdvancedScrollAnimations();
    initEnhancedSkillsVisualization();
    initThemeToggle();
    initMagneticElements();
    initScrollProgressIndicator();
});

// Make downloadResume function globally accessible - move outside DOMContentLoaded
window.downloadResume = downloadResume;

// Volume control toggle function
function toggleVolumeControl() {
    const volumeSliderContainer = document.getElementById('volumeSliderContainer');
    if (volumeSliderContainer) {
        volumeSliderContainer.classList.toggle('active');
        
        // Auto-start music if not playing
        const backgroundMusic = document.getElementById('backgroundMusic');
        if (backgroundMusic && backgroundMusic.paused) {
            backgroundMusic.play().catch(console.log);
        }
    }
}

// Make volume control function globally accessible
window.toggleVolumeControl = toggleVolumeControl;

// Close volume control when clicking outside
document.addEventListener('click', function(e) {
    const volumeControl = document.querySelector('.volume-control-nav');
    const volumeSliderContainer = document.getElementById('volumeSliderContainer');
    
    if (volumeControl && volumeSliderContainer && !volumeControl.contains(e.target)) {
        volumeSliderContainer.classList.remove('active');
    }
});

// Debug: Ensure function is available
console.log('downloadResume function available:', typeof window.downloadResume === 'function');
console.log('toggleVolumeControl function available:', typeof window.toggleVolumeControl === 'function');

// Make element draggable
function makeDraggable(element) {
    let isDragging = false;
    let startX, startY, startLeft, startTop;
    
    element.addEventListener('mousedown', function(e) {
        // Only allow dragging if not clicking on controls
        if (e.target.closest('.music-btn') || e.target.closest('.volume-slider')) {
            return;
        }
        
        isDragging = true;
        element.style.cursor = 'grabbing';
        
        startX = e.clientX;
        startY = e.clientY;
        startLeft = parseInt(window.getComputedStyle(element).left, 10);
        startTop = parseInt(window.getComputedStyle(element).top, 10);
        
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        
        e.preventDefault();
    });
    
    function onMouseMove(e) {
        if (!isDragging) return;
        
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        let newLeft = startLeft + deltaX;
        let newTop = startTop + deltaY;
        
        // Keep within viewport bounds
        const rect = element.getBoundingClientRect();
        const maxLeft = window.innerWidth - rect.width;
        const maxTop = window.innerHeight - rect.height;
        
        newLeft = Math.max(0, Math.min(newLeft, maxLeft));
        newTop = Math.max(0, Math.min(newTop, maxTop));
        
        element.style.left = newLeft + 'px';
        element.style.top = newTop + 'px';
        element.style.bottom = 'auto';
        element.style.right = 'auto';
    }
    
    function onMouseUp() {
        isDragging = false;
        element.style.cursor = 'grab';
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }
    
    // Add grab cursor by default
    element.style.cursor = 'grab';
    
    // Add touch support for mobile
    element.addEventListener('touchstart', function(e) {
        if (e.target.closest('.music-btn') || e.target.closest('.volume-slider')) {
            return;
        }
        
        isDragging = true;
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        startLeft = parseInt(window.getComputedStyle(element).left, 10);
        startTop = parseInt(window.getComputedStyle(element).top, 10);
        
        e.preventDefault();
    });
    
    element.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        
        const touch = e.touches[0];
        const deltaX = touch.clientX - startX;
        const deltaY = touch.clientY - startY;
        
        let newLeft = startLeft + deltaX;
        let newTop = startTop + deltaY;
        
        const rect = element.getBoundingClientRect();
        const maxLeft = window.innerWidth - rect.width;
        const maxTop = window.innerHeight - rect.height;
        
        newLeft = Math.max(0, Math.min(newLeft, maxLeft));
        newTop = Math.max(0, Math.min(newTop, maxTop));
        
        element.style.left = newLeft + 'px';
        element.style.top = newTop + 'px';
        element.style.bottom = 'auto';
        element.style.right = 'auto';
        
        e.preventDefault();
    });
    
    element.addEventListener('touchend', function() {
        isDragging = false;
    });
}

// Initialize loading screen
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    
    // Hide loading screen after a delay
    setTimeout(() => {
        document.body.classList.add('loaded');
        setTimeout(() => {
            if (loadingScreen) {
                loadingScreen.style.display = 'none';
            }
        }, 500);
    }, 2000);
}

// Initialize 3D background
function init3DBackground() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    camera.position.z = 400;

    // Create particles
    createParticles();
    
    // Create floating geometries
    createFloatingGeometries();
    
    // Event listeners
    document.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('resize', onWindowResize, false);
    
    // Start animation loop
    animate();
}

// Create particle system
function createParticles() {
    const particleCount = 1000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 2000;
        positions[i + 1] = (Math.random() - 0.5) * 2000;
        positions[i + 2] = (Math.random() - 0.5) * 2000;

        // Color variations
        const colorVariation = Math.random();
        if (colorVariation < 0.33) {
            colors[i] = 0.39; colors[i + 1] = 0.40; colors[i + 2] = 0.95; // Blue
        } else if (colorVariation < 0.66) {
            colors[i] = 0.55; colors[i + 1] = 0.36; colors[i + 2] = 0.96; // Purple
        } else {
            colors[i] = 0.02; colors[i + 1] = 0.71; colors[i + 2] = 0.83; // Cyan
        }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 3,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

// Create floating 3D geometries
function createFloatingGeometries() {
    geometries = [];
    
    // Create various geometric shapes
    const shapes = [
        new THREE.TetrahedronGeometry(20, 0),
        new THREE.OctahedronGeometry(15, 0),
        new THREE.IcosahedronGeometry(18, 0),
        new THREE.DodecahedronGeometry(16, 0)
    ];

    for (let i = 0; i < 15; i++) {
        const geometry = shapes[Math.floor(Math.random() * shapes.length)];
        const material = new THREE.MeshPhongMaterial({
            color: new THREE.Color().setHSL(Math.random(), 0.7, 0.5),
            transparent: true,
            opacity: 0.3,
            wireframe: true
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(
            (Math.random() - 0.5) * 1000,
            (Math.random() - 0.5) * 1000,
            (Math.random() - 0.5) * 1000
        );
        
        mesh.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );

        scene.add(mesh);
        geometries.push(mesh);
    }

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0x6366f1, 0.6);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
}

// Mouse move handler
function onMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.1;
    mouseY = (event.clientY - windowHalfY) * 0.1;
}

// Window resize handler
function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    const time = Date.now() * 0.0005;
    
    // Animate particles
    if (particles) {
        particles.rotation.x += 0.0005;
        particles.rotation.y += 0.001;
    }
    
    // Animate geometries
    if (geometries) {
        geometries.forEach((mesh, index) => {
            mesh.rotation.x += 0.01 + index * 0.002;
            mesh.rotation.y += 0.01 + index * 0.003;
            mesh.position.y += Math.sin(time + index) * 0.5;
        });
    }
    
    // Camera movement based on mouse
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    
    renderer.render(scene, camera);
}

// Initialize navigation with improved section segregation
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            let targetSection = document.getElementById(targetId);
            
            // Special handling for sections with proper segregation
            if (targetId === 'home') {
                targetSection = document.querySelector('.hero-main');
            } else if (targetId === 'about') {
                targetSection = document.querySelector('.about-section');
            } else if (targetId === 'skills') {
                targetSection = document.getElementById('skills');
            } else if (targetId === 'experience') {
                targetSection = document.getElementById('experience');
            } else if (targetId === 'projects') {
                targetSection = document.getElementById('projects');
            } else if (targetId === 'education') {
                targetSection = document.getElementById('education');
            } else if (targetId === 'contact') {
                targetSection = document.getElementById('contact');
            }
            
            if (targetSection) {
                // Remove active class from all links
                navLinks.forEach(l => l.classList.remove('active'));
                // Add active class to clicked link
                link.classList.add('active');
                
                // Calculate offset for fixed header with better spacing
                const headerHeight = document.querySelector('.modern-header').offsetHeight;
                const extraOffset = 100; // Additional offset for better section segregation
                const targetPosition = targetSection.offsetTop - headerHeight - extraOffset;
                
                // Smooth scroll to section
                window.scrollTo({
                    top: Math.max(0, targetPosition),
                    behavior: 'smooth'
                });
            }
        });
    });

    // Update active navigation on scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

// Update active navigation link based on scroll position with improved section detection
function updateActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    const headerHeight = document.querySelector('.modern-header').offsetHeight;
    const scrollPos = window.scrollY + headerHeight + 200; // Increased offset for better section detection
    
    // Define sections with their corresponding elements and proper segregation
    const sections = [
        { id: 'home', element: document.querySelector('.hero-main') },
        { id: 'about', element: document.querySelector('.about-section') },
        { id: 'skills', element: document.getElementById('skills') },
        { id: 'experience', element: document.getElementById('experience') },
        { id: 'projects', element: document.getElementById('projects') },
        { id: 'education', element: document.getElementById('education') },
        { id: 'contact', element: document.getElementById('contact') }
    ];
    
    let currentSection = 'home'; // Default to home
    
    // Improved section detection with better boundaries
    sections.forEach((section, index) => {
        if (section.element) {
            const sectionTop = section.element.offsetTop - 300; // Better threshold
            const nextSection = sections[index + 1];
            const sectionBottom = nextSection && nextSection.element 
                ? nextSection.element.offsetTop - 300
                : document.body.scrollHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                currentSection = section.id;
            }
        }
    });
    
    // Update active nav link
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });

    // Update navbar background on scroll
    const navbar = document.querySelector('.modern-header');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(13, 13, 13, 0.95)';
            navbar.style.backdropFilter = 'blur(25px)';
        } else {
            navbar.style.background = 'rgba(13, 13, 13, 0.8)';
            navbar.style.backdropFilter = 'blur(20px)';
        }
    }
}

// Initialize mobile navigation
function initMobileNavigation() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const mobileOverlay = document.querySelector('.mobile-overlay');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            const isActive = navMenu.classList.contains('active');
            
            // Toggle navigation
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
            
            // Toggle overlay
            if (mobileOverlay) {
                mobileOverlay.classList.toggle('active');
            }
            
            // Prevent body scroll when menu is open
            if (!isActive) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when clicking on overlay
        if (mobileOverlay) {
            mobileOverlay.addEventListener('click', () => {
                closeMenu();
            });
        }
        
        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                closeMenu();
            });
        });
        
        // Close menu function
        function closeMenu() {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
            if (mobileOverlay) {
                mobileOverlay.classList.remove('active');
            }
            document.body.style.overflow = '';
        }
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMenu();
            }
        });
    }
}

// Initialize scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });
    
    // Observe individual elements
    document.querySelectorAll('.project-card, .timeline-item, .contact-item').forEach(element => {
        observer.observe(element);
    });
}

// Initialize typing effect (if needed)
function initTypingEffect() {
    // This can be used for future typing animations
    const typingElements = document.querySelectorAll('[data-typing]');
    
    typingElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        
        let i = 0;
        const timer = setInterval(() => {
            element.textContent += text.charAt(i);
            i++;
            
            if (i > text.length) {
                clearInterval(timer);
            }
        }, 50);
    });
}

// Initialize form handling
function initFormHandling() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    
    // Basic validation
    if (!name || !email || !message) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Create mailto link
    const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    const mailtoLink = `mailto:imrakesh.gir@gmail.com?subject=${subject}&body=${body}`;
    
    // Show success message and open email client
    showNotification('Opening your email client to send the message...', 'success');
    window.open(mailtoLink, '_blank');
    
    // Reset form after a delay
    setTimeout(() => {
        e.target.reset();
    }, 1000);
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show notification
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${type === 'success' ? '#22c55e' : type === 'info' ? '#3b82f6' : '#ef4444'};
        color: white;
        border-radius: 12px;
        z-index: 10000;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        transform: translateY(-100px);
        transition: all 0.3s ease;
        font-weight: 500;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateY(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateY(-100px)';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Resume download function with small popup near button
function downloadResume() {
    console.log('downloadResume function called'); // Debug log
    
    // Find the resume button to position popup near it
    const resumeBtn = document.querySelector('.resume-download');
    if (!resumeBtn) return;
    
    const rect = resumeBtn.getBoundingClientRect();
    
    // Create small popup
    const popup = document.createElement('div');
    popup.className = 'resume-popup';
    
    popup.style.cssText = `
        position: fixed;
        top: ${rect.bottom + 10}px;
        right: ${window.innerWidth - rect.right}px;
        background: rgba(13, 13, 13, 0.95);
        backdrop-filter: blur(25px);
        -webkit-backdrop-filter: blur(25px);
        border: 1px solid rgba(118, 176, 171, 0.3);
        border-radius: 12px;
        padding: 1.5rem;
        min-width: 280px;
        max-width: 320px;
        z-index: 100000;
        box-shadow: 0 15px 50px rgba(0, 0, 0, 0.6);
        opacity: 0;
        transform: translateY(-10px) scale(0.95);
        transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    `;
    
    popup.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem;">
            <div style="color: #76b0ab; font-size: 1.5rem;">📄</div>
            <h4 style="color: white; font-size: 1rem; margin: 0; font-weight: 600;">
                Download Resume
            </h4>
        </div>
        <p style="color: rgba(255, 255, 255, 0.8); margin: 0 0 1.25rem 0; font-size: 0.9rem; line-height: 1.4;">
            Download Rakesh Das's professional resume PDF ?
        </p>
        <div style="display: flex; gap: 0.75rem;">
            <button class="popup-confirm" style="
                background: linear-gradient(135deg, #76b0ab, #5a9b95);
                color: white;
                border: none;
                padding: 0.6rem 1.2rem;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 0.85rem;
                flex: 1;
                box-shadow: 0 3px 10px rgba(118, 176, 171, 0.3);
            ">
                📥 Download
            </button>
            <button class="popup-cancel" style="
                background: rgba(255, 255, 255, 0.1);
                color: rgba(255, 255, 255, 0.8);
                border: 1px solid rgba(255, 255, 255, 0.2);
                padding: 0.6rem 1.2rem;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 0.85rem;
                flex: 1;
            ">
                Cancel
            </button>
        </div>
        <div style="
            position: absolute;
            top: -8px;
            right: 20px;
            width: 0;
            height: 0;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-bottom: 8px solid rgba(118, 176, 171, 0.3);
        "></div>
    `;
    
    document.body.appendChild(popup);
    
    // Animate in
    setTimeout(() => {
        popup.style.opacity = '1';
        popup.style.transform = 'translateY(0) scale(1)';
    }, 10);
    
    // Handle buttons
    const confirmBtn = popup.querySelector('.popup-confirm');
    const cancelBtn = popup.querySelector('.popup-cancel');
    
    confirmBtn.addEventListener('click', () => {
        // Google Drive direct download URL
        const resumeUrl = 'https://drive.google.com/uc?export=download&id=1R_Osx65mBFg0d_RFoxlFga191hCVcrbG';
        
        // Create a temporary link element to trigger download
        const downloadLink = document.createElement('a');
        downloadLink.href = resumeUrl;
        downloadLink.download = 'Rakesh_Das_Resume.pdf';
        downloadLink.target = '_blank';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        closePopup();
        showNotification('Resume download started!', 'success');
        
        setTimeout(() => {
            showNotification('If download didn\'t start, please check your pop-up blocker', 'info');
        }, 2000);
    });
    
    cancelBtn.addEventListener('click', closePopup);
    
    // Add hover effects
    confirmBtn.addEventListener('mouseenter', () => {
        confirmBtn.style.transform = 'translateY(-1px)';
        confirmBtn.style.boxShadow = '0 5px 15px rgba(118, 176, 171, 0.4)';
    });
    
    confirmBtn.addEventListener('mouseleave', () => {
        confirmBtn.style.transform = 'translateY(0)';
        confirmBtn.style.boxShadow = '0 3px 10px rgba(118, 176, 171, 0.3)';
    });
    
    cancelBtn.addEventListener('mouseenter', () => {
        cancelBtn.style.background = 'rgba(255, 255, 255, 0.15)';
        cancelBtn.style.borderColor = 'rgba(255, 255, 255, 0.3)';
    });
    
    cancelBtn.addEventListener('mouseleave', () => {
        cancelBtn.style.background = 'rgba(255, 255, 255, 0.1)';
        cancelBtn.style.borderColor = 'rgba(255, 255, 255, 0.2)';
    });
    
    function closePopup() {
        popup.style.opacity = '0';
        popup.style.transform = 'translateY(-10px) scale(0.95)';
        setTimeout(() => {
            if (popup.parentNode) {
                document.body.removeChild(popup);
            }
        }, 300);
    }
    
    // Close when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function outsideClick(e) {
            if (!popup.contains(e.target) && !resumeBtn.contains(e.target)) {
                closePopup();
                document.removeEventListener('click', outsideClick);
            }
        });
    }, 100);
    
    // ESC key to close
    document.addEventListener('keydown', function escapeHandler(e) {
        if (e.key === 'Escape') {
            closePopup();
            document.removeEventListener('keydown', escapeHandler);
        }
    });
}

// Initialize cycling text
function initCyclingText() {
    const words = ['Learner', 'Thriver', 'Bhakta'];
    const cyclingElement = document.getElementById('cycling-text');
    let currentIndex = 0;
    
    if (!cyclingElement) return;
    
    // Set initial text
    cyclingElement.textContent = words[currentIndex];
    
    function changeText() {
        cyclingElement.style.opacity = '0';
        cyclingElement.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            currentIndex = (currentIndex + 1) % words.length;
            cyclingElement.textContent = words[currentIndex];
            cyclingElement.style.opacity = '1';
            cyclingElement.style.transform = 'scale(1)';
        }, 300);
    }
    
    // Change text every 2.5 seconds
    setInterval(changeText, 2500);
}

// Create hero 3D element
function createHero3DElement() {
    const heroElement = document.getElementById('hero-cube');
    if (!heroElement) return;
    
    // Create a simple 3D animated element
    heroElement.innerHTML = `
        <div class="tech-orb">
            <div class="orb-core">
                <div class="core-glow"></div>
            </div>
            <div class="floating-icons">
                <div class="icon icon-1">💻</div>
                <div class="icon icon-2">⚡</div>
                <div class="icon icon-3">🚀</div>
                <div class="icon icon-4">⭐</div>
            </div>
        </div>
    `;
    
    // Add CSS for the 3D element
    const style = document.createElement('style');
    style.textContent = `
        .tech-orb {
            position: relative;
            width: 200px;
            height: 200px;
            margin: 0 auto;
        }
        
        .orb-core {
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), transparent 50%),
                        linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4);
            border-radius: 50%;
            position: relative;
            animation: orbPulse 3s ease-in-out infinite;
            box-shadow: 0 0 50px rgba(99, 102, 241, 0.5);
        }
        
        .core-glow {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 120%;
            height: 120%;
            background: radial-gradient(circle, rgba(99, 102, 241, 0.3), transparent 70%);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: glowPulse 2s ease-in-out infinite alternate;
        }
        
        .floating-icons {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
        
        .icon {
            position: absolute;
            font-size: 1.5rem;
            animation: iconFloat 4s ease-in-out infinite;
        }
        
        .icon-1 { top: 10%; left: 50%; animation-delay: 0s; }
        .icon-2 { top: 50%; right: 10%; animation-delay: 1s; }
        .icon-3 { bottom: 10%; left: 50%; animation-delay: 2s; }
        .icon-4 { top: 50%; left: 10%; animation-delay: 3s; }
        
        @keyframes orbPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        
        @keyframes glowPulse {
            0% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
            100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1.1); }
        }
        
        @keyframes iconFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }
    `;
    document.head.appendChild(style);
}

// Background color update function
function updateBackgroundColor() {
    let ticking = false;
    
    function update() {
        const scrollPercent = window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight);
        const hue1 = 230 + scrollPercent * 60; // Blue to purple range
        const hue2 = 260 + scrollPercent * 40; // Purple to pink range
        
        const newBackground = `
            radial-gradient(circle at 20% 80%, hsla(${hue1}, 70%, 60%, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, hsla(${hue2}, 70%, 60%, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, hsla(200, 70%, 60%, 0.05) 0%, transparent 50%),
            #0a0a0a
        `;
        
        document.body.style.setProperty('background', newBackground, 'important');
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(update);
            ticking = true;
        }
    }
    
    // Initial background
    update();
    
    // Update on scroll
    window.addEventListener('scroll', requestTick);
}

// Skill item interactions
document.addEventListener('DOMContentLoaded', () => {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-4px) scale(1.05)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Initialize hero 3D element when page loads
window.addEventListener('load', () => {
    createHero3DElement();
    
    // Additional initialization after everything is loaded
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// Add scroll to top functionality
function initScrollToTop() {
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '↑';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 1.5rem;
        cursor: pointer;
        z-index: 1000;
        opacity: 0;
        transform: translateY(100px);
        transition: all 0.3s ease;
        box-shadow: 0 5px 20px rgba(99, 102, 241, 0.3);
    `;
    
    document.body.appendChild(scrollToTopBtn);
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.transform = 'translateY(0)';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.transform = 'translateY(100px)';
        }
    });
    
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize scroll to top when page loads
document.addEventListener('DOMContentLoaded', initScrollToTop);

// Add ripple effect to buttons
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                background: rgba(255,255,255,0.3);
                left: ${x}px;
                top: ${y}px;
                width: ${size}px;
                height: ${size}px;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.remove();
                }
            }, 600);
        });
    });
    
    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .btn {
            position: relative;
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);
});

// Performance optimization
let performanceTicking = false;

function updatePerformanceAnimations() {
    // Update any performance-critical animations here
    performanceTicking = false;
}

window.addEventListener('scroll', () => {
    if (!performanceTicking) {
        requestAnimationFrame(updatePerformanceAnimations);
        performanceTicking = true;
    }
});

// Console welcome message
console.log(`
🚀 Welcome to Rakesh Das's Portfolio!
💻 Built with passion and modern web technologies
⭐ Featuring Three.js 3D animations and responsive design
🎨 Clean, modern, and professional

Connect with me:
📧 imrakesh.gir@gmail.com
💼 linkedin.com/in/rakesh-das-28141a165/
🐱 github.com/RakeshDas16
`);

// Export functions for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initLoadingScreen,
        init3DBackground,
        initNavigation,
        showNotification,
        isValidEmail
    };
}

// Initialize music player with navigation volume control
function initMusicPlayer() {
    const backgroundMusic = document.getElementById('backgroundMusic');
    const volumeSliderNav = document.getElementById('volumeSliderNav');
    const volumePercent = document.getElementById('volumePercent');
    
    if (!backgroundMusic) return;
    
    let isPlaying = false;
    let hasInteracted = false;
    let audioContext;
    let ambientNodes = [];
    let masterGain;
    
    // Create ambient sound using Web Audio API as fallback
    function createAmbientSound() {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            masterGain = audioContext.createGain();
            masterGain.connect(audioContext.destination);
            masterGain.gain.value = volumeSliderNav.value / 100;
            
            // Create multiple flute-like tones (Krishna-inspired frequencies)
            const frequencies = [196, 294, 392, 523]; // Sa, Ga, Sa(high), Do - Krishna's flute scale
            
            frequencies.forEach((freq, index) => {
                const oscillator = audioContext.createOscillator();
                const gain = audioContext.createGain();
                
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
                
                // Create a subtle vibrato effect
                const lfo = audioContext.createOscillator();
                const lfoGain = audioContext.createGain();
                lfo.type = 'sine';
                lfo.frequency.setValueAtTime(0.3 + index * 0.1, audioContext.currentTime);
                lfoGain.gain.setValueAtTime(2, audioContext.currentTime);
                
                lfo.connect(lfoGain);
                lfoGain.connect(oscillator.frequency);
                
                // Set volume for each tone
                gain.gain.setValueAtTime(0.15 / frequencies.length, audioContext.currentTime);
                
                oscillator.connect(gain);
                gain.connect(masterGain);
                
                ambientNodes.push({ oscillator, gain, lfo });
            });
            
            return true;
        } catch (error) {
            console.log('Web Audio API not supported:', error);
            return false;
        }
    }
    
    function startAmbientSound() {
        if (audioContext && ambientNodes.length > 0) {
            ambientNodes.forEach(node => {
                node.oscillator.start();
                node.lfo.start();
            });
        }
    }
    
    function stopAmbientSound() {
        if (audioContext && ambientNodes.length > 0) {
            ambientNodes.forEach(node => {
                try {
                    node.oscillator.stop();
                    node.lfo.stop();
                } catch (e) {
                    // Node might already be stopped
                }
            });
            ambientNodes = [];
        }
    }
    
    // Set initial volume
    if (backgroundMusic && volumeSliderNav) {
        backgroundMusic.volume = volumeSliderNav.value / 100;
    }
    
    // Volume control from navigation
    if (volumeSliderNav) {
        volumeSliderNav.addEventListener('input', (e) => {
            const volume = e.target.value / 100;
            if (backgroundMusic) {
                backgroundMusic.volume = volume;
            }
            if (masterGain) {
                masterGain.gain.value = volume;
            }
            if (volumePercent) {
                volumePercent.textContent = e.target.value + '%';
            }
            updateVolumeIcon(e.target.value);
        });
    }
    
    // Auto-play when user first interacts with the page
    document.addEventListener('click', () => {
        if (!hasInteracted && !isPlaying) {
            hasInteracted = true;
        }
    }, { once: true });
    
    function toggleMusic() {
        if (isPlaying) {
            pauseMusic();
        } else {
            playMusic();
        }
    }
    
    function playMusic() {
        // Try to play the audio file first
        if (backgroundMusic) {
            backgroundMusic.play().then(() => {
                isPlaying = true;
                updatePlayState(true);
            }).catch((error) => {
                console.log('Audio file playback failed, using ambient generator:', error);
                // Fallback to ambient sound generator
                playAmbientFallback();
            });
        } else {
            playAmbientFallback();
        }
    }
    
    function playAmbientFallback() {
        if (createAmbientSound()) {
            startAmbientSound();
            isPlaying = true;
            updatePlayState(true);
            // Update music title to indicate it's generated peaceful music
            const musicTitle = document.querySelector('.music-title');
            if (musicTitle) {
                musicTitle.textContent = 'Divine Flute Tones';
            }
        } else {
            showNotification('Audio not supported in this browser', 'error');
        }
    }
    
    function pauseMusic() {
        if (backgroundMusic && !backgroundMusic.paused) {
            backgroundMusic.pause();
        }
        stopAmbientSound();
        isPlaying = false;
        updatePlayState(false);
    }
    
    function updatePlayState(playing) {
        const volumeIcon = document.querySelector('.volume-icon');
        if (volumeIcon && playing) {
            volumeIcon.style.animation = 'volumeIconBeat 1s ease-in-out infinite';
        } else if (volumeIcon) {
            volumeIcon.style.animation = 'none';
        }
    }
    
    function updateVolumeIcon(volume) {
        const volumeIcon = document.querySelector('.volume-icon');
        if (volume == 0) {
            volumeIcon.textContent = '🔇';
        } else if (volume < 50) {
            volumeIcon.textContent = '🔉';
        } else {
            volumeIcon.textContent = '🔊';
        }
    }
    
    // Handle music errors
    if (backgroundMusic) {
        backgroundMusic.addEventListener('error', (e) => {
            console.log('Music loading error, falling back to ambient generator');
            // Automatically try ambient fallback
            playAmbientFallback();
        });
        
        // Update music player when music ends (shouldn't happen with loop)
        backgroundMusic.addEventListener('ended', () => {
            pauseMusic();
        });
        
        // Show loading state
        backgroundMusic.addEventListener('loadstart', () => {
            const musicTitle = document.querySelector('.music-title');
            if (musicTitle) {
                musicTitle.textContent = 'Loading music...';
            }
        });
        
        // Update title when music is ready
        backgroundMusic.addEventListener('canplay', () => {
            const musicTitle = document.querySelector('.music-title');
            if (musicTitle && musicTitle.textContent === 'Loading music...') {
                musicTitle.textContent = 'Calm your mind';
            }
        });
    }
}

// Enhanced Spotlight Effect for All Cards (Portfolio-wide)
function initializeSpotlightEffect() {
    // All card types that now have spotlight effects
    const cardSelectors = [
        '.card',                // About Me bento grid cards
        '.skill-category',      // Skills section cards
        '.project-card',        // Projects section cards
        '.education-item',      // Education section cards
        '.certification-item',  // Certification cards
        '.timeline-content'     // Experience timeline cards
    ];
    
    cardSelectors.forEach(selector => {
        const cards = document.querySelectorAll(selector);
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                
                card.style.setProperty('--x', `${x}%`);
                card.style.setProperty('--y', `${y}%`);
            });

            card.addEventListener('mouseleave', () => {
                card.style.setProperty('--x', '50%');
                card.style.setProperty('--y', '50%');
            });
        });
    });
    
    console.log('✨ Spotlight effects initialized for all portfolio cards!');
}

// ========================================================================== 
// PREMIUM FEATURE 1: Interactive Cursor Effects
// ==========================================================================

function initInteractiveCursor() {
    // Create custom cursor
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    const cursorFollower = document.createElement('div');
    cursorFollower.className = 'cursor-follower';
    document.body.appendChild(cursorFollower);
    
    // Cursor trail container
    const trailContainer = document.createElement('div');
    trailContainer.className = 'cursor-trail-container';
    document.body.appendChild(trailContainer);
    
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;
    
    // Update cursor position
    document.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;
        
        // Update custom cursor position
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        // Create trail particles
        createCursorTrail(cursorX, cursorY);
        
        // Update magnetic effect
        updateMagneticEffect(cursorX, cursorY);
    });
    
    // Animate cursor follower
    function animateCursorFollower() {
        followerX += (cursorX - followerX) * 0.1;
        followerY += (cursorY - followerY) * 0.1;
        
        cursorFollower.style.left = followerX + 'px';
        cursorFollower.style.top = followerY + 'px';
        
        requestAnimationFrame(animateCursorFollower);
    }
    animateCursorFollower();
    
    // Cursor interactions
    const interactiveElements = document.querySelectorAll('a, button, .nav-link, .project-card, .contact-item');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');
            cursorFollower.classList.add('cursor-hover');
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
            cursorFollower.classList.remove('cursor-hover');
        });
    });
}

function createCursorTrail(x, y) {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail-particle';
    trail.style.left = x + 'px';
    trail.style.top = y + 'px';
    
    document.querySelector('.cursor-trail-container').appendChild(trail);
    
    // Remove trail particle after animation
    setTimeout(() => {
        if (trail.parentNode) {
            trail.parentNode.removeChild(trail);
        }
    }, 1000);
}

// ========================================================================== 
// PREMIUM FEATURE 2: Advanced Scroll Animations
// ==========================================================================

function initAdvancedScrollAnimations() {
    // Parallax backgrounds
    const parallaxElements = document.querySelectorAll('.hero-main, .about-section, spline-viewer');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.3 + (index * 0.1);
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
        
        updateScrollProgress();
        updateSectionAnimations();
    });
    
    // Staggered reveal animations with delayed Skills section
    const revealElements = document.querySelectorAll('.skill-category, .timeline-item, .project-card, .contact-item');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add extra delay for skill categories to avoid confusion with About Me
                const isSkillCategory = entry.target.classList.contains('skill-category');
                const baseDelay = isSkillCategory ? 1200 : 0; // Extra 1200ms delay for skills
                
                setTimeout(() => {
                    entry.target.classList.add('reveal-animated');
                }, baseDelay + (index * 100));
            }
        });
    }, { threshold: 0.2 });
    
    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
}

function updateScrollProgress() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    scrollProgress = (winScroll / height) * 100;
    
    const progressBar = document.querySelector('.scroll-progress-bar');
    if (progressBar) {
        progressBar.style.width = scrollProgress + '%';
    }
}

function updateSectionAnimations() {
    const sections = document.querySelectorAll('.section');
    const scrollTop = window.pageYOffset;
    
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
            const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
            section.style.setProperty('--scroll-progress', progress);
        }
    });
}

// ========================================================================== 
// PREMIUM FEATURE 3: Enhanced Skills Visualization
// ==========================================================================

function initEnhancedSkillsVisualization() {
    const skillsSection = document.getElementById('skills');
    if (!skillsSection) return;
    
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !skillsAnimated) {
                skillsAnimated = true;
                // Add a 1500ms delay to let About Me section finish animating first
                setTimeout(() => {
                    animateSkillBars();
                    animateSkillClouds();
                }, 1500);
            }
        });
    }, { threshold: 0.3 });
    
    skillsObserver.observe(skillsSection);
}

function animateSkillBars() {
    // Create skill progress bars
    const skillCategories = document.querySelectorAll('.skill-category');
    
    skillCategories.forEach((category, categoryIndex) => {
        const skillItems = category.querySelectorAll('.skill-item');
        
        skillItems.forEach((item, itemIndex) => {
            // Add progress bar
            const progressBar = document.createElement('div');
            progressBar.className = 'skill-progress-bar';
            
            const progressFill = document.createElement('div');
            progressFill.className = 'skill-progress-fill';
            
            // Random skill levels for demo (replace with actual data)
            const skillLevels = {
                'Java': 90, 'Python': 85, 'Spring Boot': 88, 'Hibernate': 82,
                'MySQL': 87, 'MongoDB': 80, 'AWS': 83, 'Docker': 85,
                'REST APIs': 90, 'Kafka': 78, 'HTML5': 88, 'CSS3': 85
            };
            
            const skillName = item.textContent.replace(/[^\w\s]/gi, '').trim();
            let level = skillLevels[skillName] || (75 + Math.random() * 20);
            
            progressFill.style.width = '0%';
            progressBar.appendChild(progressFill);
            item.appendChild(progressBar);
            
            // Animate progress bar
            setTimeout(() => {
                progressFill.style.width = level + '%';
                progressFill.setAttribute('data-level', Math.round(level) + '%');
            }, (categoryIndex * 200) + (itemIndex * 100));
        });
    });
}

function animateSkillClouds() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach((item, index) => {
        // Additional delay to ensure proper sequencing after About Me
        setTimeout(() => {
            item.classList.add('skill-cloud-animated');
            
            // Add floating animation
            item.style.animationDelay = (index * 0.1) + 's';
        }, index * 100); // Increased from 75ms to 100ms for better spacing
    });
}

// ========================================================================== 
// PREMIUM FEATURE 4: Theme Toggle
// ==========================================================================

function initThemeToggle() {
    // Create theme toggle button
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '🌙';
    themeToggle.setAttribute('aria-label', 'Toggle theme');
    
    // Add to navigation
    const navigation = document.querySelector('.nav-menu');
    if (navigation) {
        navigation.appendChild(themeToggle);
    }
    
    // Load saved theme
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    setTheme(savedTheme);
    
    // Theme toggle event
    themeToggle.addEventListener('click', () => {
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        
        // Add click animation
        themeToggle.style.transform = 'scale(0.8)';
        setTimeout(() => {
            themeToggle.style.transform = 'scale(1)';
        }, 150);
    });
}

function setTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
    
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.innerHTML = theme === 'dark' ? '☀️' : '🌙';
    }
    
    // Smooth theme transition
    document.body.style.transition = 'all 0.3s ease';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 300);
}

// ========================================================================== 
// Magnetic Elements Effect
// ==========================================================================

function initMagneticElements() {
    magneticElements = document.querySelectorAll('.nav-link, .btn, .contact-icon, .project-icon');
    
    magneticElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.transition = 'transform 0.3s ease';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translate(0, 0)';
            element.style.transition = 'transform 0.5s ease';
        });
    });
}

function updateMagneticEffect(mouseX, mouseY) {
    magneticElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const distance = Math.sqrt(
            Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2)
        );
        
        if (distance < 100) {
            const strength = (100 - distance) / 100;
            const deltaX = (mouseX - centerX) * strength * 0.3;
            const deltaY = (mouseY - centerY) * strength * 0.3;
            
            element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        }
    });
}

// ========================================================================== 
// Scroll Progress Indicator
// ==========================================================================

function initScrollProgressIndicator() {
    // Create scroll progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-bar';
    document.body.appendChild(progressBar);
    
    // Create section indicators
    const sections = ['home', 'about', 'skills', 'experience', 'projects', 'contact'];
    const sectionIndicators = document.createElement('div');
    sectionIndicators.className = 'section-indicators';
    
    sections.forEach((sectionId, index) => {
        const indicator = document.createElement('div');
        indicator.className = 'section-indicator';
        indicator.setAttribute('data-section', sectionId);
        indicator.title = sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
        
        indicator.addEventListener('click', () => {
            const targetSection = document.getElementById(sectionId) || 
                                 document.querySelector(sectionId === 'home' ? '.hero-main' : `.${sectionId}-section`);
            if (targetSection) {
                const headerHeight = document.querySelector('.modern-header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
        
        sectionIndicators.appendChild(indicator);
    });
    
    document.body.appendChild(sectionIndicators);
    
    // Update indicators on scroll
    window.addEventListener('scroll', updateSectionIndicators);
}

function updateSectionIndicators() {
    const indicators = document.querySelectorAll('.section-indicator');
    const headerHeight = document.querySelector('.modern-header').offsetHeight;
    const scrollPos = window.scrollY + headerHeight + 100;
    
    const sections = [
        { id: 'home', element: document.querySelector('.hero-main') },
        { id: 'about', element: document.querySelector('.about-section') },
        { id: 'skills', element: document.getElementById('skills') },
        { id: 'experience', element: document.getElementById('experience') },
        { id: 'projects', element: document.getElementById('projects') },
        { id: 'contact', element: document.getElementById('contact') }
    ];
    
    let activeSection = 'home';
    
    sections.forEach(section => {
        if (section.element) {
            const sectionTop = section.element.offsetTop;
            const sectionHeight = section.element.offsetHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                activeSection = section.id;
            }
        }
    });
    
    indicators.forEach(indicator => {
        indicator.classList.remove('active');
        if (indicator.getAttribute('data-section') === activeSection) {
            indicator.classList.add('active');
        }
    });
} 
