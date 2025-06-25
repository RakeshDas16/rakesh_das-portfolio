/* ==========================================================================
   Modern Portfolio JavaScript
   Clean, professional interactions with 3D effects
   ========================================================================== */

// Global variables
let scene, camera, renderer, particles, geometries;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

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
    loadTheme();
    initSimpleNavigation();
    animateSkillBars();
    addSpecialSkillAnimations();
    addMagneticEffect();
    enhanceScrollAnimations();
    document.querySelectorAll('.skill-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            const originalAnimation = tag.style.animation;
            tag.style.animation = 'none';
            setTimeout(() => {
                tag.style.animation = originalAnimation;
            }, 100);
        });
    });
    
    console.log('🎉 Portfolio fully initialized with simple navigation!');
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

// Initialize navigation
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            let targetSection = document.getElementById(targetId);
            
            // Special handling for sections
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
            } else if (targetId === 'contact') {
                targetSection = document.getElementById('contact');
            }
            
            if (targetSection) {
                // Remove active class from all links
                navLinks.forEach(l => l.classList.remove('active'));
                // Add active class to clicked link
                link.classList.add('active');
                
                // Calculate offset for fixed header
                const headerHeight = document.querySelector('.modern-header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                // Smooth scroll to section
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Update active navigation on scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    const headerHeight = document.querySelector('.modern-header').offsetHeight;
    const scrollPos = window.scrollY + headerHeight + 50;
    
    // Define sections with their corresponding elements
    const sections = [
        { id: 'home', element: document.querySelector('.hero-main') },
        { id: 'about', element: document.querySelector('.about-section') },
        { id: 'skills', element: document.getElementById('skills') },
        { id: 'experience', element: document.getElementById('experience') },
        { id: 'projects', element: document.getElementById('projects') },
        { id: 'contact', element: document.getElementById('contact') }
    ];
    
    let currentSection = 'home'; // Default to home
    
    sections.forEach(section => {
        if (section.element) {
            const sectionTop = section.element.offsetTop;
            const sectionHeight = section.element.offsetHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
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
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            });
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
// Enhanced Premium Features JavaScript
// ==========================================================================

// Theme Toggle Function - Fixed for proper sun/moon switching
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.querySelector('.theme-icon');
    const currentTheme = body.getAttribute('data-theme');
    
    if (currentTheme === 'dark') {
        // Switch to light theme
        body.setAttribute('data-theme', 'light');
        themeIcon.textContent = '🌙';
        themeIcon.style.transform = 'rotate(360deg)';
        
        // Add beautiful transition effects
        body.style.transition = 'all 0.3s ease-in-out';
        themeIcon.style.transition = 'transform 0.6s ease-in-out';
        
        // Store preference
        localStorage.setItem('theme', 'light');
        console.log('Switched to light theme');
    } else {
        // Switch to dark theme  
        body.setAttribute('data-theme', 'dark');
        themeIcon.textContent = '☀️';
        themeIcon.style.transform = 'rotate(-360deg)';
        
        // Add beautiful transition effects
        body.style.transition = 'all 0.3s ease-in-out';
        themeIcon.style.transition = 'transform 0.6s ease-in-out';
        
        // Store preference
        localStorage.setItem('theme', 'dark');
        console.log('Switched to dark theme');
    }
    
    // Add glowing effect during transition
    themeIcon.style.boxShadow = '0 0 20px rgba(124, 233, 230, 0.8)';
    setTimeout(() => {
        themeIcon.style.boxShadow = 'none';
        themeIcon.style.transform = 'rotate(0deg)';
    }, 600);
}

// Initialize theme and navigation on page load
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const body = document.body;
    const themeIcon = document.querySelector('.theme-icon');
    
    body.setAttribute('data-theme', savedTheme);
    
    if (savedTheme === 'light') {
        themeIcon.textContent = '🌙';
    } else {
        themeIcon.textContent = '☀️';
    }
    
    console.log('Theme initialized:', savedTheme);
    
    // CRITICAL: Initialize navigation system
    console.log('🚀 Starting navigation initialization...');
    initSimpleNavigation();
    console.log('✅ Navigation initialization complete!');
    
    // CRITICAL: Initialize all skill animations
    console.log('📊 Starting skill animations...');
    animateSkillBars();
    addSpecialSkillAnimations();
    addMagneticEffect();
    enhanceScrollAnimations();
    console.log('✅ All skill animations initialized!');
    
    // CRITICAL: Initialize mobile-specific features
    console.log('📱 Starting mobile features initialization...');
    initMobileMenuClose();
    initMobile3DFallback();
    initMobileSectionIndicators();
    console.log('✅ Mobile features initialized!');
    
    // Initialize cursor effects (desktop only)
    if (window.innerWidth > 768) {
        new CursorEffects();
    }
});

// Interactive Cursor Effects
class CursorEffects {
    constructor() {
        this.canvas = document.getElementById('cursor-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.lastMouse = { x: 0, y: 0 };
        
        this.init();
    }
    
    init() {
        this.resizeCanvas();
        this.bindEvents();
        this.animate();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    bindEvents() {
        window.addEventListener('resize', () => this.resizeCanvas());
        
        document.addEventListener('mousemove', (e) => {
            this.lastMouse.x = this.mouse.x;
            this.lastMouse.y = this.mouse.y;
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            
            // Create particle trail
            if (this.getDistance(this.lastMouse, this.mouse) > 10) {
                this.createParticle();
            }
        });
        
        // Enhanced effects for interactive elements
        document.querySelectorAll('a, button, .skill-bar, .skill-tag, .indicator').forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.createBurst();
            });
        });
    }
    
    createParticle() {
        const particle = {
            x: this.mouse.x + (Math.random() - 0.5) * 20,
            y: this.mouse.y + (Math.random() - 0.5) * 20,
            size: Math.random() * 3 + 1,
            life: 1,
            decay: Math.random() * 0.02 + 0.01,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            color: `hsla(${180 + Math.random() * 60}, 70%, 60%, ${Math.random() * 0.5 + 0.3})`
        };
        
        this.particles.push(particle);
    }
    
    createBurst() {
        for (let i = 0; i < 15; i++) {
            const angle = (Math.PI * 2 * i) / 15;
            const velocity = Math.random() * 3 + 2;
            
            const particle = {
                x: this.mouse.x,
                y: this.mouse.y,
                size: Math.random() * 4 + 2,
                life: 1,
                decay: Math.random() * 0.03 + 0.02,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                color: `hsla(${180 + Math.random() * 60}, 80%, 70%, 0.8)`
            };
            
            this.particles.push(particle);
        }
    }
    
    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= particle.decay;
            particle.size *= 0.98;
            
            if (particle.life <= 0 || particle.size < 0.1) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.life;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
    }
    
    getDistance(p1, p2) {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    animate() {
        this.updateParticles();
        this.drawParticles();
        requestAnimationFrame(() => this.animate());
    }
}



// Enhanced Skills Animation with Debugging
function animateSkillBars() {
    console.log('🎯 Starting skill bar animation setup...');
    
    const skillBars = document.querySelectorAll('.skill-fill');
    console.log(`📊 Found ${skillBars.length} skill bars to animate`);
    
    skillBars.forEach((bar, index) => {
        const width = bar.dataset.width;
        console.log(`📈 Skill bar ${index + 1}: target width = ${width}%`);
        
        // Ensure the bar starts at 0%
        bar.style.width = '0%';
    });
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target;
                const width = fill.dataset.width;
                
                console.log(`🎯 Animating skill bar to ${width}%`);
                
                setTimeout(() => {
                    fill.style.width = width + '%';
                    fill.style.transition = 'width 2s ease-in-out';
                    console.log(`✅ Skill bar animated to ${width}%`);
                }, Math.random() * 500);
            }
        });
    }, { threshold: 0.3 }); // Lowered threshold for earlier activation
    
    skillBars.forEach(bar => {
        observer.observe(bar);
        console.log('👀 Observer attached to skill bar');
    });
    
    console.log('✅ Skill bar animation setup complete!');
}

// Special Floating Animations for Specific Skills
function addSpecialSkillAnimations() {
    const skillTags = document.querySelectorAll('.skill-tag');
    
    skillTags.forEach(tag => {
        const tagText = tag.textContent.toLowerCase();
        
        // Apply special animations based on skill name
        if (tagText.includes('mysql')) {
            tag.classList.add('mysql-special');
            tag.style.animation = 'mysqlSpecialFloat 4s ease-in-out infinite';
            tag.style.borderColor = 'rgba(255, 165, 0, 0.4)';
            tag.style.color = '#ffa500';
        }
        else if (tagText.includes('spring')) {
            tag.classList.add('spring-special');
            tag.style.animation = 'springFloat 3.5s ease-in-out infinite';
            tag.style.borderColor = 'rgba(106, 176, 76, 0.4)';
            tag.style.color = '#6ab04c';
        }
        else if (tagText.includes('java')) {
            tag.classList.add('java-special');
            tag.style.animation = 'javaFloat 4.5s ease-in-out infinite';
            tag.style.borderColor = 'rgba(237, 112, 20, 0.4)';
            tag.style.color = '#ed7014';
        }
        else if (tagText.includes('python')) {
            tag.classList.add('python-special');
            tag.style.animation = 'pythonFloat 3.8s ease-in-out infinite';
            tag.style.borderColor = 'rgba(52, 152, 219, 0.4)';
            tag.style.color = '#3498db';
        }
        else if (tagText.includes('mongodb')) {
            tag.classList.add('mongo-special');
            tag.style.animation = 'mongoFloat 4.2s ease-in-out infinite';
            tag.style.borderColor = 'rgba(76, 175, 80, 0.4)';
            tag.style.color = '#4caf50';
        }
        else if (tagText.includes('aws')) {
            tag.classList.add('aws-special');
            tag.style.animation = 'awsFloat 3.7s ease-in-out infinite';
            tag.style.borderColor = 'rgba(255, 153, 0, 0.4)';
            tag.style.color = '#ff9900';
        }
    });
}

// Enhanced Magnetic Effect for Interactive Elements
function addMagneticEffect() {
    const magneticElements = document.querySelectorAll('.skill-bar, .skill-tag, .indicator, .theme-btn, .volume-btn');
    
    magneticElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const strength = 0.3;
            element.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = '';
        });
    });
}

// Enhanced Scroll Animations
function enhanceScrollAnimations() {
    const animatedElements = document.querySelectorAll('.skill-bar, .skill-category-enhanced, .timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease';
        observer.observe(element);
    });
}

// SIMPLE & BULLETPROOF NAVIGATION - GUARANTEED TO WORK!
function initSimpleNavigation() {
    console.log('🚀 Starting SIMPLE navigation system...');
    
    // CLEAN SECTION MAPPING (using consistent IDs)
    const sections = {
        'home': document.getElementById('home'),
        'about': document.getElementById('about'), 
        'skills': document.getElementById('skills'),
        'experience': document.getElementById('experience'),
        'projects': document.getElementById('projects'),
        'education': document.getElementById('education'),
        'contact': document.getElementById('contact')
    };
    
    // Debug: Check all sections are found
    Object.keys(sections).forEach(key => {
        if (sections[key]) {
            console.log(`✅ Found section: ${key}`);
        } else {
            console.error(`❌ Missing section: ${key}`);
        }
    });
    
    // SIMPLE SCROLL FUNCTION
    function scrollToSection(sectionId) {
        console.log(`🎯 Scrolling to: ${sectionId}`);
        
        const targetSection = sections[sectionId];
        if (!targetSection) {
            console.error(`❌ Section ${sectionId} not found!`);
            return;
        }
        
        // Calculate position with header offset
        const headerHeight = 100; // Safe offset for fixed header
        const elementTop = targetSection.offsetTop;
        const targetPosition = elementTop - headerHeight;
        
        console.log(`📐 Element top: ${elementTop}, Target position: ${targetPosition}`);
        
        // SMOOTH SCROLL
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        console.log(`✅ Scrolled to ${sectionId} successfully!`);
    }
    
    // 1. HEADER NAVIGATION LINKS
    console.log('🔗 Setting up header navigation...');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    console.log(`Found ${navLinks.length} navigation links`);
    
    navLinks.forEach(link => {
        // Remove any existing event listeners
        link.onclick = null;
        
        const href = link.getAttribute('href');
        const sectionId = href.substring(1); // Remove the #
        
        console.log(`🔗 Setting up nav link: ${sectionId}`);
        
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log(`🧭 Header nav clicked: ${sectionId}`);
            scrollToSection(sectionId);
        });
    });
    
    // 2. SECTION INDICATORS
    console.log('📍 Setting up section indicators...');
    const indicators = document.querySelectorAll('.indicator');
    console.log(`Found ${indicators.length} indicators`);
    
    indicators.forEach(indicator => {
        // Remove any existing event listeners
        indicator.onclick = null;
        
        const sectionId = indicator.getAttribute('data-section');
        console.log(`📍 Setting up indicator: ${sectionId}`);
        
        indicator.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log(`📍 Indicator clicked: ${sectionId}`);
            scrollToSection(sectionId);
        });
        
        // Make it visually obvious it's clickable
        indicator.style.cursor = 'pointer';
        indicator.style.transition = 'all 0.3s ease';
        
        // Add hover effects
        indicator.addEventListener('mouseenter', function() {
            indicator.style.transform = 'scale(1.1)';
            indicator.style.background = 'rgba(124, 233, 230, 0.2)';
        });
        
        indicator.addEventListener('mouseleave', function() {
            indicator.style.transform = 'scale(1)';
            indicator.style.background = 'rgba(255, 255, 255, 0.1)';
        });
    });
    
    // Make scrollToSection globally accessible
    window.scrollToSection = scrollToSection;
    
    console.log('✅ SIMPLE navigation system setup complete!');
    console.log('🎯 All navigation should now work perfectly!');
    console.log('🧭 Test both header nav and side indicators!');
}

// Mobile Menu Toggle Function
function toggleMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    
    if (navMenu && mobileToggle) {
        navMenu.classList.toggle('active');
        mobileToggle.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }
}

// Close mobile menu when clicking outside
function initMobileMenuClose() {
    document.addEventListener('click', (e) => {
        const navMenu = document.getElementById('navMenu');
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        
        if (navMenu && mobileToggle) {
            // If menu is open and click is outside menu and toggle button
            if (navMenu.classList.contains('active') && 
                !navMenu.contains(e.target) && 
                !mobileToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        }
    });
    
    // Close menu when nav link is clicked
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const navMenu = document.getElementById('navMenu');
            const mobileToggle = document.querySelector('.mobile-menu-toggle');
            
            if (navMenu && mobileToggle) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    });
}

// Mobile and 3D Detection - Ultra Conservative Approach
function initMobile3DFallback() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isVeryLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;
    const mobile3DFallback = document.getElementById('mobile3DFallback');
    const splineViewer = document.getElementById('splineViewer');
    
    // Check screen size - only tiny screens get fallback
    const screenWidth = window.innerWidth;
    const isTinyScreen = screenWidth <= 280; // Even more conservative
    
    console.log('🔍 Device Detection:', {
        isMobile,
        isVeryLowEndDevice,
        hardwareConcurrency: navigator.hardwareConcurrency,
        screenWidth: window.innerWidth,
        isTinyScreen,
        userAgent: navigator.userAgent
    });
    
    // Function to show mobile fallback
    function showMobileFallback() {
        if (splineViewer) splineViewer.style.display = 'none';
        if (mobile3DFallback) {
            mobile3DFallback.style.display = 'block';
            console.log('📱 Showing mobile 3D fallback');
        }
    }
    
    // Function to show Spline viewer (default)
    function showSplineViewer() {
        if (mobile3DFallback) mobile3DFallback.style.display = 'none';
        if (splineViewer) {
            splineViewer.style.display = 'block';
            console.log('🌟 Showing Spline 3D viewer');
        }
    }
    
    // MOBILE-FIRST Decision logic - Prioritize mobile experience
    if (isMobile) {
        // ALL mobile devices get fallback by default to prevent blackout
        console.log('📱 Mobile device detected - showing CSS fallback for better performance');
        showMobileFallback();
    } else {
        // Desktop/laptop only gets Spline viewer
        console.log('🖥️ Desktop device detected - showing Spline 3D viewer');
        console.log('🚫 Fallback will NEVER activate on desktop');
        showSplineViewer();
        
        // Desktop: Only listen for actual errors, no timeout
        if (splineViewer) {
            splineViewer.addEventListener('error', () => {
                console.log('❌ Desktop Spline viewer error detected, but keeping it');
                // Don't switch to fallback on desktop - let Spline handle its own loading
            });
        }
    }
    
    // Handle window resize - maintain mobile vs desktop distinction
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Re-detect if we're on mobile (shouldn't change, but just in case)
            const stillMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            
            if (stillMobile) {
                console.log('📱 Resize: Still mobile - keeping CSS fallback');
                showMobileFallback();
            } else {
                console.log('🖥️ Resize: Still desktop - keeping Spline viewer');
                showSplineViewer();
            }
        }, 500);
    });
}

// Enhanced Section Indicators for Mobile
function initMobileSectionIndicators() {
    const indicators = document.querySelectorAll('.indicator');
    const sections = [
        { id: 'home', element: document.querySelector('.hero-main') },
        { id: 'about', element: document.querySelector('.about-section') },
        { id: 'skills', element: document.getElementById('skills') },
        { id: 'experience', element: document.getElementById('experience') },
        { id: 'projects', element: document.getElementById('projects') },
        { id: 'education', element: document.getElementById('education') },
        { id: 'contact', element: document.getElementById('contact') }
    ];
    
    // Make sure indicators work on mobile
    indicators.forEach(indicator => {
        const sectionId = indicator.getAttribute('data-section');
        
        // Remove existing listeners
        indicator.onclick = null;
        
        // Add click listener with better mobile support
        indicator.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            console.log(`📱 Mobile indicator clicked: ${sectionId}`);
            scrollToSection(sectionId);
            
            // Visual feedback for mobile
            indicator.style.transform = 'scale(1.1)';
            setTimeout(() => {
                indicator.style.transform = '';
            }, 200);
        });
        
        // Touch support
        indicator.addEventListener('touchstart', (e) => {
            e.preventDefault();
            indicator.style.transform = 'scale(1.05)';
        });
        
        indicator.addEventListener('touchend', (e) => {
            e.preventDefault();
            indicator.style.transform = '';
            const sectionId = indicator.getAttribute('data-section');
            scrollToSection(sectionId);
        });
    });
    
    // Update active indicator on scroll - mobile optimized
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            updateMobileActiveIndicator(sections, indicators);
        }, 100);
    });
}

function updateMobileActiveIndicator(sections, indicators) {
    const headerHeight = document.querySelector('.modern-header')?.offsetHeight || 70;
    const scrollPos = window.scrollY + headerHeight + 100;
    
    let currentSection = 'home';
    
    sections.forEach(section => {
        if (section.element) {
            const sectionTop = section.element.offsetTop;
            const sectionHeight = section.element.offsetHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                currentSection = section.id;
            }
        }
    });
    
    // Update indicators
    indicators.forEach(indicator => {
        indicator.classList.remove('active');
        if (indicator.getAttribute('data-section') === currentSection) {
            indicator.classList.add('active');
        }
    });
} 
