document.addEventListener('DOMContentLoaded', function() {
    // Typewriter effect for skills in subtitle
    function initTypewriter() {
        const skillsList = [
            "Cybersecurity", 
            "Scuba Diver", 
            "Musician", 
            "Photographer", 
            "Streamer",
            "Web Developer",
        
        ];
        const subtitleElement = document.querySelector('.skill-typewriter');
        let currentSkillIndex = 0;
        let currentCharIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100; // Typing speed of the characters
        let pauseTime = 1500;  // Once complete there is a pause time before deletion

        function typeWriter() {
            const currentSkill = skillsList[currentSkillIndex];
            
           
            if (isDeleting) {
                // Remove character
                subtitleElement.textContent = currentSkill.substring(0, currentCharIndex - 1);
                currentCharIndex--;
                typingSpeed = 50; // Faster when deleting
            } else {
                // Add character
                subtitleElement.textContent = currentSkill.substring(0, currentCharIndex + 1);
                currentCharIndex++;
                typingSpeed = 100; // Normal speed when typing
            }
            
            // If word is complete
            if (!isDeleting && currentCharIndex === currentSkill.length) {
                // Pause at the end of word
                typingSpeed = pauseTime;
                isDeleting = true;
            } 
            // If deletion is complete
            else if (isDeleting && currentCharIndex === 0) {
                isDeleting = false;
                
                // Move to next skill
                currentSkillIndex = (currentSkillIndex + 1) % skillsList.length;
                
                // Pause before typing next word
                typingSpeed = 500;
            }
            
            // Schedule next frame
            setTimeout(typeWriter, typingSpeed);
        }
        
        // Start the animation
        setTimeout(typeWriter, 1000); // Delay the first animation by 1 second
    }

    // Initialize Three.js for 3D transitions
    let renderer, scene, camera, cube;
    let isAnimating = false;
    
    function init3DTransition() {
        const canvas = document.getElementById('transition-canvas');
        if (!canvas) {
            console.warn('Transition canvas not found');
            return;
        }
        
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
            if (isAnimating || !renderer) return resolve();
            isAnimating = true;
            
            const canvas = document.getElementById('transition-canvas');
            if (!canvas) return resolve();
            
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
    
    // start 3D transition system
    try {
        init3DTransition();
    } catch (error) {
        console.warn('3D transition initialization failed:', error);
    }
    
    // Initialize the typewriter effect if we're on the homepage
    if (window.location.pathname === '/' || 
        window.location.pathname.endsWith('index.html') || 
        window.location.pathname.split('/').pop() === '') {
        initTypewriter();
    }
    
    // Navigation functionality
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const sideNav = document.querySelector('.side-nav');
    
    // Handle navigation clicks with 3D transition
    if (navLinks.length > 0) {
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
    }
    
    // Mobile menu toggle
    if (mobileToggle && sideNav) {
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
    }
    
    // Highlight current page in navigation
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
    
    // Portfolio filtering - FIX: Make it work regardless of page name
    // Check if portfolio elements exist instead of relying on page name
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    if (filterButtons.length > 0 && portfolioItems.length > 0) {
        console.log('Portfolio filter initialized with', portfolioItems.length, 'items');
        
        // Debug info to help troubleshoot
        portfolioItems.forEach(item => {
            console.log('Portfolio item:', item.getAttribute('data-category'));
        });
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filterValue = this.getAttribute('data-filter');
                console.log('Filter clicked:', filterValue);
                
                // Update active button state
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Filter the items
                portfolioItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    if (filterValue === 'all' || category === filterValue) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
        
        // Trigger "all" filter by default to ensure everything is visible initially
        const allFilter = document.querySelector('.filter-btn[data-filter="all"]');
        if (allFilter) {
            allFilter.click();
        }
    }
    
    // Animate skill bars when skills section comes into view
    const skillBars = document.querySelectorAll('.skill-progress');
    if (skillBars.length > 0) {
        skillBars.forEach(bar => {
            const skillInfo = bar.parentElement.querySelector('.skill-info span:last-child');
            if (skillInfo) {
                const width = skillInfo.textContent;
                bar.style.width = width;
            }
        });
    }
    
    // form submission with validation and proper handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            const nameInput = this.querySelector('input[name="name"]');
            const emailInput = this.querySelector('input[name="email"]');
            const messageInput = this.querySelector('textarea[name="message"]');
            
            let valid = true;
            
            // Validate name
            if (nameInput && !nameInput.value.trim()) {
                markInvalid(nameInput, 'Please enter your name');
                valid = false;
            } else if (nameInput) {
                markValid(nameInput);
            }
            
           
            if (emailInput) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailInput.value.trim() || !emailRegex.test(emailInput.value)) {
                    markInvalid(emailInput, 'Please enter a valid email address');
                    valid = false;
                } else {
                    markValid(emailInput);
                }
            }
            
            
            if (messageInput && !messageInput.value.trim()) {
                markInvalid(messageInput, 'Please enter your message');
                valid = false;
            } else if (messageInput) {
                markValid(messageInput);
            }
            
            if (valid) {
                //  data to a server
                
                const formData = new FormData(contactForm);
                const formObject = {};
                formData.forEach((value, key) => {
                    formObject[key] = value;
                });
                
                console.log('Form submitted:', formObject);
                
                // Display success message
                const successMessage = document.createElement('div');
                successMessage.className = 'alert alert-success';
                successMessage.textContent = 'Thank you for your message! I will get back to you soon.';
                
                // Insert message before form
                contactForm.parentNode.insertBefore(successMessage, contactForm);
                
                
                setTimeout(() => {
                    successMessage.remove();
                }, 5000);
                
                // Reset form
                contactForm.reset();
            }
        });
        
        // Helper functions for form validation
        function markInvalid(input, message) {
            input.classList.add('is-invalid');
            
            // Create or update error message
            let errorDiv = input.nextElementSibling;
            if (!errorDiv || !errorDiv.classList.contains('invalid-feedback')) {
                errorDiv = document.createElement('div');
                errorDiv.className = 'invalid-feedback';
                input.parentNode.insertBefore(errorDiv, input.nextSibling);
            }
            errorDiv.textContent = message;
        }
        
        function markValid(input) {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
            
            // Remove any existing error message
            const errorDiv = input.nextElementSibling;
            if (errorDiv && errorDiv.classList.contains('invalid-feedback')) {
                errorDiv.remove();
            }
        }
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

// Additional Function to animate skill bars
function animateSkills() {
    // Get all elements skill-progress class
    const skillBars = document.querySelectorAll('.skill-progress');
    
    
    if (skillBars.length === 10) return;
    
    
    skillBars.forEach(bar => {
        // Get the percentage text from the closest skill item
        const percentText = bar.closest('.skill-item').querySelector('.skill-info span:last-child').textContent;
        // Extract the percentage value
        const percentValue = parseInt(percentText);
        
        // Set the width to the percentage value
        if (!isNaN(percentValue)) {
            // Small delay for animation effect
            setTimeout(() => {
                bar.style.width = percentValue + '%';
            }, 300);
        }
    });
}

// Function to check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Function to handle skills animation when scrolling
function handleScrollAnimation() {
    const skillsSection = document.querySelector('.skills-container');
    
    if (skillsSection && isInViewport(skillsSection)) {
        animateSkills();
        // Remove the scroll event listener once animation is triggered
        window.removeEventListener('scroll', handleScrollAnimation);
    }
}


document.addEventListener('DOMContentLoaded', function() {
    n
    window.addEventListener('scroll', handleScrollAnimation);
    

    handleScrollAnimation();
});