// Import data from external file
let projects, personalInfo, skills, stats, about, contact, footer;

// DOM elements
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const backToTopBtn = document.getElementById('back-to-top');
const projectsGrid = document.getElementById('projects-grid');
const filterBtns = document.querySelectorAll('.filter-btn');
const contactForm = document.getElementById('contact-form');

// Initialize the app
document.addEventListener('DOMContentLoaded', async function () {
    try {
        // Try to load data from data.json first
        let data;
        try {
            const response = await fetch('js/data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            data = await response.json();
            console.log('✅ Loaded personal data from data.json');
        } catch (error) {
            console.warn('⚠️ data.json not found, using template data:', error.message);

            // Fallback to template data
            const templateResponse = await fetch('js/data.template.json');
            if (!templateResponse.ok) {
                throw new Error(`Template data not found! status: ${templateResponse.status}`);
            }
            data = await templateResponse.json();
            console.log('📄 Loaded template data from data.template.json');

            // Show notification to user
            showDataNotification();
        }

        // Assign data to global variables
        ({ projects, personalInfo, skills, stats, about, contact, footer } = data);

        // Initialize all components
        initializePersonalInfo();
        initializeAbout();
        initializeContact();
        initializeFooter();
        initializeNavigation();
        initializeProjects();
        initializeAnimations();
        initializeScrollEffects();
        initializeContactForm();
        initializeStatCounters();

    } catch (error) {
        console.error('Failed to load portfolio data from JSON:', error);
        alert('Failed to load portfolio data. Please check the console for details.');
    }
});

// Navigation functionality
function initializeNavigation() {
    // Mobile menu toggle
    navToggle.addEventListener('click', function () {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');

            // Update active link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 100;
        const sectionId = current.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
}

// Initialize projects
function initializeProjects() {
    renderProjects(projects);
    initializeProjectFilters();
}

// Render projects to the DOM
function renderProjects(projectsToRender) {
    projectsGrid.innerHTML = '';

    projectsToRender.forEach(project => {
        const projectCard = createProjectCard(project);
        projectsGrid.appendChild(projectCard);
    });
}

// Create a project card element
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = `project-card fade-in`;
    card.dataset.category = project.category;

    const imageContent = project.image
        ? `<img src="${project.image}" alt="${project.title}">`
        : `<i class="${project.icon}"></i>`;

    const liveLink = project.liveUrl
        ? `<a href="${project.liveUrl}" class="project-link" target="_blank" rel="noopener noreferrer">
             <i class="fas fa-external-link-alt"></i> Live Demo
           </a>`
        : '';

    card.innerHTML = `
        <div class="project-image">
            ${imageContent}
        </div>
        <div class="project-content">
            <h3 class="project-title">${project.title}</h3>
            <p class="project-description">${project.description}</p>
            <div class="project-tags">
                ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
            </div>
            <div class="project-links">
                <a href="${project.githubUrl}" class="project-link" target="_blank" rel="noopener noreferrer">
                    <i class="fab fa-github"></i> Source Code
                </a>
                ${liveLink}
            </div>
        </div>
    `;

    return card;
}

// Initialize project filters
function initializeProjectFilters() {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const filter = this.dataset.filter;

            // Update active filter button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Filter projects
            filterProjects(filter);
        });
    });
}

// Filter projects by category
function filterProjects(category) {
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
            setTimeout(() => {
                card.classList.add('visible');
            }, 100);
        } else {
            card.classList.remove('visible');
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

// Initialize scroll effects
function initializeScrollEffects() {
    // Back to top button
    window.addEventListener('scroll', function () {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Navbar background on scroll
    window.addEventListener('scroll', function () {
        const navbar = document.getElementById('navbar');
        if (window.pageYOffset > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
}

// Initialize animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all elements with animation classes
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    animatedElements.forEach(el => observer.observe(el));
}

// Initialize personal info in hero section
function initializePersonalInfo() {
    if (personalInfo) {
        // Update hero section
        const heroName = document.getElementById('hero-name');
        const heroTitle = document.getElementById('hero-title');
        const heroDescription = document.getElementById('hero-description');
        const heroCodeName = document.getElementById('hero-code-name');
        const heroCodeSkills = document.getElementById('hero-code-skills');
        const heroCodePassion = document.getElementById('hero-code-passion');

        if (heroName) heroName.textContent = personalInfo.name;
        if (heroTitle) heroTitle.textContent = personalInfo.title;
        if (heroDescription) heroDescription.textContent = personalInfo.description;
        if (heroCodeName) heroCodeName.textContent = `"${personalInfo.name}"`;
        if (heroCodeSkills && Array.isArray(personalInfo.skills)) {
            heroCodeSkills.innerHTML = personalInfo.skills.map(skill => `\"${skill}\"`).join(', \n           ');
        }
        if (heroCodePassion && personalInfo.passion) {
            heroCodePassion.textContent = `"${personalInfo.passion}"`;
        }

        // Update page title
        document.title = `${personalInfo.name} - Portfolio`;
    }
}

// Initialize about section
function initializeAbout() {
    if (about) {
        // Update about title
        const aboutTitle = document.getElementById('about-title');
        if (aboutTitle) aboutTitle.textContent = about.title;

        // Update about paragraphs
        const aboutParagraphs = document.getElementById('about-paragraphs');
        if (aboutParagraphs && about.paragraphs) {
            aboutParagraphs.innerHTML = about.paragraphs
                .map(paragraph => `<p>${paragraph}</p>`)
                .join('');
        }

        // Update skills title
        const skillsTitle = document.getElementById('skills-title');
        if (skillsTitle) skillsTitle.textContent = about.skillsTitle;
    }

    // Initialize skills
    if (skills) {
        const skillsGrid = document.getElementById('skills-grid');
        if (skillsGrid) {
            skillsGrid.innerHTML = skills
                .map(skill => `
                    <div class="skill-item">
                        <i class="${skill.icon}"></i>
                        <span>${skill.name}</span>
                    </div>
                `).join('');
        }
    }

    // Initialize stats
    if (stats) {
        const statsContainer = document.getElementById('stats-container');
        if (statsContainer) {
            statsContainer.innerHTML = stats
                .map(stat => `
                    <div class="stat">
                        <div class="stat-number" data-target="${stat.number}">0</div>
                        <div class="stat-label">${stat.label}</div>
                    </div>
                `).join('');
        }
    }
}

// Initialize contact section
function initializeContact() {
    if (contact) {
        const contactTitle = document.getElementById('contact-title');
        const contactSubtitle = document.getElementById('contact-subtitle');

        if (contactTitle) contactTitle.textContent = contact.title;
        if (contactSubtitle) contactSubtitle.textContent = contact.subtitle;
    }

    if (personalInfo) {
        const contactInfo = document.getElementById('contact-info');
        if (contactInfo) {
            contactInfo.innerHTML = `
                <div class="contact-item">
                    <div class="contact-icon">
                        <i class="fas fa-envelope"></i>
                    </div>
                    <div class="contact-details">
                        <h3>Email</h3>
                        <p>${personalInfo.email}</p>
                    </div>
                </div>
                <div class="contact-item">
                    <div class="contact-icon">
                        <i class="fab fa-github"></i>
                    </div>
                    <div class="contact-details">
                        <h3>GitHub</h3>
                        <p>${personalInfo.github}</p>
                    </div>
                </div>
                <div class="contact-item">
                    <div class="contact-icon">
                        <i class="fab fa-linkedin"></i>
                    </div>
                    <div class="contact-details">
                        <h3>LinkedIn</h3>
                        <p>${personalInfo.linkedin}</p>
                    </div>
                </div>
            `;
        }
    }
}

// Initialize footer
function initializeFooter() {
    if (footer) {
        const footerCopyright = document.getElementById('footer-copyright');
        if (footerCopyright) footerCopyright.textContent = `© ${footer.copyright}`;
    }

    if (personalInfo && personalInfo.socialLinks) {
        const socialLinks = document.getElementById('social-links');
        if (socialLinks) {
            socialLinks.innerHTML = `
                <a href="${personalInfo.socialLinks.github}" class="social-link" target="_blank" rel="noopener noreferrer" title="GitHub">
                    <i class="fab fa-github"></i>
                </a>
                <a href="${personalInfo.socialLinks.linkedin}" class="social-link" target="_blank" rel="noopener noreferrer" title="LinkedIn">
                    <i class="fab fa-linkedin"></i>
                </a>
            `;
        }
    }
}

// Initialize contact form
function initializeContactForm() {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        const formObject = {};

        for (let [key, value] of formData.entries()) {
            formObject[key] = value;
        }

        // Here you would typically send the data to a server
        // For now, we'll just show a success message
        showFormMessage('Thank you for your message! I\'ll get back to you soon.', 'success');

        // Reset form
        this.reset();
    });
}

// Show form message
function showFormMessage(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;

    // Style the message
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;

    document.body.appendChild(messageDiv);

    // Animate in
    setTimeout(() => {
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 5 seconds
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 300);
    }, 5000);
}

// Show notification when using template data
function showDataNotification() {
    const notification = document.createElement('div');
    notification.className = 'data-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-info-circle"></i>
            <div class="notification-text">
                <strong>Using Template Data</strong>
                <p>Create a <code>js/data.json</code> file to customize your portfolio content.</p>
            </div>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #2196F3;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        opacity: 0;
        transition: all 0.3s ease;
        max-width: 500px;
        font-family: inherit;
    `;

    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 12px;
    `;

    notification.querySelector('.notification-close').style.cssText = `
        background: rgba(255,255,255,0.2);
        border: none;
        color: white;
        padding: 5px 8px;
        border-radius: 4px;
        cursor: pointer;
        margin-left: auto;
    `;

    notification.querySelector('code').style.cssText = `
        background: rgba(255,255,255,0.2);
        padding: 2px 6px;
        border-radius: 3px;
        font-family: monospace;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 100);

    // Auto-hide after 10 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 10000);
}

// Initialize stat counters
function initializeStatCounters() {
    const stats = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => statsObserver.observe(stat));
}

// Animate counter
function animateCounter(element) {
    const target = parseInt(element.dataset.target);
    const duration = 2000; // 2 seconds
    const start = 0;
    const increment = target / (duration / 16); // 60fps
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        element.textContent = Math.floor(current);

        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        }
    }, 16);
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading animation
window.addEventListener('load', function () {
    document.body.classList.add('loaded');

    // Trigger initial animations
    setTimeout(() => {
        const initialElements = document.querySelectorAll('.hero .fade-in, .hero .slide-in-left, .hero .slide-in-right');
        initialElements.forEach(el => el.classList.add('visible'));
    }, 500);
});

// Utility function to debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized scroll handler
const optimizedScrollHandler = debounce(() => {
    updateActiveNavLink();
}, 10);

window.addEventListener('scroll', optimizedScrollHandler);

// Add some interactive effects
document.addEventListener('mousemove', function (e) {
    const cards = document.querySelectorAll('.project-card, .stats-card');
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        } else {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        }
    });
});

// Keyboard navigation
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        // Close mobile menu
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

// Add focus management for accessibility
document.addEventListener('DOMContentLoaded', function () {
    // Add focus indicators
    const focusableElements = document.querySelectorAll('a, button, input, textarea, select');
    focusableElements.forEach(element => {
        element.addEventListener('focus', function () {
            this.style.outline = '2px solid #667eea';
            this.style.outlineOffset = '2px';
        });

        element.addEventListener('blur', function () {
            this.style.outline = 'none';
        });
    });
});
