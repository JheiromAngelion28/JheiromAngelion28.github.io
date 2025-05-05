document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const sideNav = document.querySelector('.side-nav');
    
    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            navigateTo(targetId);
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
    
    // Function to navigate to a specific page
    function navigateTo(targetId) {
        const targetPage = document.querySelector(targetId);
        const currentPage = document.querySelector('.page.active');
        
        if (!targetPage || targetPage === currentPage) return;
        
        // Determine direction
        const currentIndex = Array.from(pages).indexOf(currentPage);
        const targetIndex = Array.from(pages).indexOf(targetPage);
        const direction = targetIndex > currentIndex ? 'next' : 'previous';
        
        // Update active nav link
        navLinks.forEach(link => link.classList.remove('active'));
        document.querySelector(`.nav-link[href="${targetId}"]`).classList.add('active');
        
        // Animate page transition
        currentPage.classList.remove('active');
        currentPage.classList.add(direction);
        
        targetPage.classList.add('active');
        targetPage.classList.remove('next', 'previous');
        
        // Reset classes after animation
        setTimeout(() => {
            currentPage.classList.remove('next', 'previous');
        }, 400);
    }
    
    // Handle scroll events for manual scrolling
    const pageContainer = document.querySelector('.page-container');
    let isScrolling = false;
    
    pageContainer.addEventListener('scroll', function() {
        if (!isScrolling) {
            isScrolling = true;
            
            // Find which page is currently in view
            const scrollPosition = this.scrollTop;
            const windowHeight = window.innerHeight;
            const currentPageIndex = Math.round(scrollPosition / windowHeight);
            const currentPage = pages[currentPageIndex];
            
            // Update active page and nav link
            if (currentPage) {
                pages.forEach(page => page.classList.remove('active'));
                currentPage.classList.add('active');
                
                navLinks.forEach(link => link.classList.remove('active'));
                document.querySelector(`.nav-link[href="#${currentPage.id}"]`).classList.add('active');
            }
            
            setTimeout(() => {
                isScrolling = false;
            }, 100);
        }
    });
    
    // Portfolio filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            // Filter portfolio items
            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // Animate skill bars when skills section comes into view
    const skillsSection = document.querySelector('#skills');
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                skillBars.forEach(bar => {
                    const width = bar.parentElement.querySelector('.skill-info span:last-child').textContent;
                    bar.style.width = width;
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    if (skillsSection) {
        observer.observe(skillsSection);
    }
    
    // Form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Here you would typically send the form data to a server
            alert('Thank you for your message! I will get back to you soon.');
            this.reset();
        });
    }
});