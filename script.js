// ================= MOBILE MENU TOGGLE =================
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.getElementById('nav-links');

mobileMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('is-active');
    navLinks.classList.toggle('active');
});

// Close menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('is-active');
        navLinks.classList.remove('active');
    });
});

// ================= SMOOTH SCROLL FOR ANCHOR LINKS =================
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

// ================= INTERSECTION OBSERVER FOR FADE-IN ANIMATIONS =================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all cards and boxes
document.querySelectorAll('.solution-card, .bento-box').forEach(el => {
    observer.observe(el);
});

// ================= NAVBAR SCROLL EFFECT =================
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
        navbar.style.background = 'rgba(0, 0, 0, 0.9)';
        navbar.style.borderBottomColor = '#2a2a2a';
    } else {
        navbar.style.background = 'rgba(0, 0, 0, 0.7)';
        navbar.style.borderBottomColor = '#1a1a1a';
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// ================= PARALLAX EFFECT ON HERO =================
const hero = document.querySelector('.hero');
window.addEventListener('scroll', () => {
    const scrollPosition = window.pageYOffset;
    if (hero) {
        hero.style.transform = `translateY(${scrollPosition * 0.5}px)`;
    }
});

// ================= BUTTON RIPPLE EFFECT =================
const buttons = document.querySelectorAll('.cta-button, .read-btn, .nav-btn, .submit-btn');

buttons.forEach(button => {
    button.addEventListener('mouseenter', function(e) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// ================= SCROLL PROGRESS INDICATOR =================
const createProgressBar = () => {
    const progressBar = document.createElement('div');
    progressBar.classList.add('scroll-progress');
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
};

createProgressBar();

// ================= ACTIVE NAV LINK INDICATOR =================
const navItems = document.querySelectorAll('.nav-links a:not(.nav-btn)');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href').slice(1) === current) {
            item.classList.add('active');
        }
    });
});

// ================= LAZY LOAD IMAGES =================
const images = document.querySelectorAll('img');

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ================= CONTACT FORM VALIDATION & SUBMISSION =================
const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');

if (contactForm) {
    // Real-time validation
    const inputs = contactForm.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateField(input);
        });
        
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input);
            }
        });
    });
    
    // Form submission
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validate all fields
        let isValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            return;
        }
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };
        
        // Send email via mailto (for Gmail)
        const mailtoLink = `mailto:hello@holdingdevs.com?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(`Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`)}`;
        
        // Show success message
        contactForm.style.opacity = '0';
        contactForm.style.pointerEvents = 'none';
        successMessage.classList.add('show');
        
        // Reset form
        contactForm.reset();
        
        // Open email client
        window.location.href = mailtoLink;
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            successMessage.classList.remove('show');
            contactForm.style.opacity = '1';
            contactForm.style.pointerEvents = 'auto';
        }, 5000);
    });
}

// ================= FIELD VALIDATION FUNCTION =================
function validateField(field) {
    const errorSpan = field.parentElement.querySelector('.form-error');
    let isValid = true;
    let errorMessage = '';
    
    if (!field.value.trim()) {
        isValid = false;
        errorMessage = 'This field is required';
    } else if (field.name === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    if (isValid) {
        field.classList.remove('error');
        if (errorSpan) errorSpan.textContent = '';
    } else {
        field.classList.add('error');
        if (errorSpan) errorSpan.textContent = errorMessage;
    }
    
    return isValid;
}

// ================= KEYBOARD NAVIGATION =================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        mobileMenu.classList.remove('is-active');
        navLinks.classList.remove('active');
    }
});

// ================= PAGE LOAD ANIMATION =================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// ================= SMOOTH PAGE TRANSITIONS =================
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease-in-out';
        document.body.style.opacity = '1';
    }, 100);
});

// ================= PERFORMANCE OPTIMIZATION =================
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            // Scroll-based animations go here
            ticking = false;
        });
        ticking = true;
    }
});

// ================= ACCESSIBILITY IMPROVEMENTS =================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

// ================= CONSOLE GREETING =================
console.log('%c🚀 HOLDING DEVS - Execution Agency', 'font-size: 20px; font-weight: bold; color: #ffffff;');
console.log('%cBuilt with passion for high-performance execution', 'font-size: 14px; color: #888888;');