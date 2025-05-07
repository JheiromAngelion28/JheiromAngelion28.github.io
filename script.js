document.addEventListener('DOMContentLoaded', function() {
    // Initialize Three.js for 3D transitions
    let renderer, scene, camera, cube;
    let isAnimating = false;
    
    function init3DTransition() {
        const canvas = document.getElementById('transition-canvas');
        
        // Set up Three.js scene
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        
        // Create a cube for transition effect
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshBasicMaterial({
            color: 0x3498db,
            wireframe: true
        });
        cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        
        camera.position.z = 5;
    }
    
    function animateTransition(duration = 1000) {
        return new Promise((resolve) => {
            if (isAnimating) return;
            isAnimating = true;
            
            const canvas = document.getElementById('transition-canvas');
            canvas.style.opacity = '1';
            
            let startTime = null;
            const rotationSpeed = 0.02;
            
            function animate(time) {
                if (!startTime) startTime = time;
                const progress = (time - startTime) / duration;
                
                // Rotate cube
                cube.rotation.x += rotationSpeed;
                cube.rotation.y += rotationSpeed;
                
                // Scale up
                if (progress < 0.5) {
                    const scale = progress * 2;
                    cube.scale.set(scale, scale, scale);
                }
                // Scale down
                else if (progress < 1) {
                    const scale = 2 - (progress - 0.5) * 2;
                    cube.scale.set(scale, scale, scale);
                }
                // End animation
                else {
                    canvas.style.opacity = '0';
                    cube.scale.set(0, 0, 0);
                    isAnimating = false;
                    resolve();
                    return;
                }
                
                renderer.render(scene, camera);
                requestAnimationFrame(animate);
            }
            
            requestAnimationFrame(animate);
        });
    }
    
    // Initialize 3D transition system
    init3DTransition();
    
    // Navigation functionality
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const sideNav = document.querySelector('.side-nav');
    
    // Handle navigation clicks with 3D transition
    navLinks.forEach(link => {
        link.addEventListener('click', async function(e) {
            if (this.classList.contains('active')) return;
            
            e.preventDefault();
            const targetPage = this.getAttribute('href');
            
            // Start transition animation
            await animateTransition();
            
            // Navigate to new page
            window.location.href = targetPage;
        });
    });
    
    // Mobile menu toggle
    mobileToggle.addEventListener('click', function() {
        sideNav.classList.toggle('active');
        this.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.side-nav .nav-link').forEach(link => {
        link.addEventListener('click', () => {
            sideNav.classList.remove('active');
            mobileToggle.classList.remove('active');
        });
    });
    
    // Highlight current page in navigation
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
    
    // Portfolio filtering (only on portfolio page)
    if (currentPage === 'portfolio.html') {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                const filterValue = this.getAttribute('data-filter');
                
                portfolioItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // Animate skill bars when skills section comes into view
    if (currentPage === 'skills.html') {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        skillBars.forEach(bar => {
            const width = bar.parentElement.querySelector('.skill-info span:last-child').textContent;
            bar.style.width = width;
        });
    }
    
    // Form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! I will get back to you soon.');
            this.reset();
        });
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (renderer) {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
    });
});