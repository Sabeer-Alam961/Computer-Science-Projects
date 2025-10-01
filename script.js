// ==============================
// 1. Theme Toggle Functionality
// ==============================
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const root = document.documentElement;

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    root.setAttribute('data-theme', 'dark');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
}

// Toggle theme on click
themeToggle.addEventListener('click', () => {
    if (root.getAttribute('data-theme') === 'dark') {
        root.removeAttribute('data-theme');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
    } else {
        root.setAttribute('data-theme', 'dark');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
    }
});


// ==============================
// 2. Typewriter Effect
// ==============================
class TypewriterEffect {
    constructor(element, roles, options = {}) {
        this.element = element;
        this.roles = roles;
        this.options = {
            typeSpeed: 100,
            deleteSpeed: 50,
            delayBetweenWords: 2000,
            loop: true,
            ...options
        };
        
        this.currentRoleIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.iconElement = document.getElementById('currentIcon');
        
        this.start();
    }

    start() {
        this.type();
    }

    type() {
        const currentRole = this.roles[this.currentRoleIndex];
        const currentText = currentRole.text;
        
        // Update icon when starting a new role
        if (!this.isDeleting && this.currentCharIndex === 0) {
            this.updateIcon(currentRole.icon);
        }

        if (this.isDeleting) {
            // Delete characters
            this.element.textContent = currentText.substring(0, this.currentCharIndex - 1);
            this.currentCharIndex--;
        } else {
            // Add characters
            this.element.textContent = currentText.substring(0, this.currentCharIndex + 1);
            this.currentCharIndex++;
        }

        // Determine typing speed
        let typeSpeed = this.isDeleting ? this.options.deleteSpeed : this.options.typeSpeed;

        // Add randomness for natural effect
        typeSpeed += Math.random() * 50;

        // Check if word is complete
        if (!this.isDeleting && this.currentCharIndex === currentText.length) {
            typeSpeed = this.options.delayBetweenWords;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentCharIndex === 0) {
            this.isDeleting = false;
            this.currentRoleIndex = (this.currentRoleIndex + 1) % this.roles.length;
        }

        setTimeout(() => this.type(), typeSpeed);
    }

    updateIcon(iconClass) {
        this.iconElement.style.transform = 'scale(0.8)';
        this.iconElement.style.opacity = '0.6';
        
        setTimeout(() => {
            this.iconElement.innerHTML = `<i class="${iconClass}"></i>`;
            this.iconElement.style.transform = 'scale(1)';
            this.iconElement.style.opacity = '1';
        }, 150);
    }
}

// Define roles
const roles = [
    { text: "Full Stack Developer", icon: "fas fa-code" },
    { text: "UI/UX Designer", icon: "fas fa-paintbrush" },
    { text: "Python Enthusiast", icon: "fab fa-python" },
    { text: "Problem Solver", icon: "fas fa-lightbulb" },
    { text: "Creative Thinker", icon: "fas fa-brain" },
    { text: "Tech Explorer", icon: "fas fa-rocket" }
];

// Start typewriter effect
document.addEventListener('DOMContentLoaded', function() {
    const typewriterElement = document.getElementById('typewriterText');
    setTimeout(() => {
        new TypewriterEffect(typewriterElement, roles, {
            typeSpeed: 80,
            deleteSpeed: 40,
            delayBetweenWords: 2500
        });
    }, 2000);
});


// ==============================
// 3. Smooth Scroll for Links
// ==============================
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


// ==============================
// 4. Cursor Particle Effect
// ==============================
document.addEventListener('mousemove', (e) => {
    const particles = document.querySelectorAll('.particle');
    particles.forEach((particle, index) => {
        const speed = (index + 1) * 0.01;
        const x = (e.clientX * speed);
        const y = (e.clientY * speed);
        particle.style.transform = `translate(${x}px, ${y}px)`;
    });
});


// ==============================
// 5. Button Hover Animations
// ==============================
document.querySelectorAll('.btn-modern, .btn-outline').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px) scale(1.05)';
    });
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
    button.addEventListener('mousedown', function() {
        this.style.transform = 'translateY(-1px) scale(1.02)';
    });
    button.addEventListener('mouseup', function() {
        this.style.transform = 'translateY(-3px) scale(1.05)';
    });
});


// ==============================
// 6. Active Nav Link on Scroll
// ==============================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});


// ==============================
// 7. Navbar Collapse on Mobile
// ==============================
const navItems = document.querySelectorAll('.nav-link');
const navMenu = document.getElementById('navMenu');

navItems.forEach(link => {
    link.addEventListener('click', () => {
        const bsCollapse = new bootstrap.Collapse(navMenu, { toggle: false });
        bsCollapse.hide();
    });
});


// ==============================
// 8. Resume View in New Tab
// ==============================
document.getElementById('downloadResume').addEventListener('click', (e) => {
    e.preventDefault();
    const resumeUrl = 'assets/Sabeer Alam CV.pdf';
    window.open(resumeUrl, '_blank'); // Open in new tab
});


// ==============================
// 9. Social Icon Click Event
// ==============================
document.querySelectorAll('.social-icon').forEach(icon => {
    icon.addEventListener('click', (e) => {
        console.log(`You clicked on ${icon.getAttribute('aria-label')} icon`);
    });
});


// ==============================
// 10. Project Buttons
// ==============================
document.addEventListener('DOMContentLoaded', function () {
    const projectButtons = document.querySelectorAll('.project-card .btn-outline');
    projectButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const url = this.getAttribute('href');
            window.open(url, '_blank');
        });
    });
});



// ==============================
// 11. AOS Init + Contact Form
// ==============================
document.addEventListener('DOMContentLoaded', () => {
    AOS.init({ duration: 800, once: true });

    const form = document.querySelector("#contact form");
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const subject = document.getElementById("subject").value.trim();
        const message = document.getElementById("message").value.trim();

        if (!name || !email || !subject || !message) {
            alert("⚠️ Please fill in all fields.");
            return;
        }
        if (!validateEmail(email)) {
            alert("❌ Please enter a valid email address.");
            return;
        }

        alert("✅ Message sent successfully! Thank you, " + name + ".");
        form.reset();
    });

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email.toLowerCase());
    }
});


// ==============================
// 12. Newsletter Form
// ==============================
function handleSubscribe(event) {
    event.preventDefault();

    const emailInput = event.target.querySelector('.newsletter-input');
    const email = emailInput.value.trim();
    const successMessage = document.getElementById('successMessage');
    const form = event.target;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    setTimeout(() => {
        successMessage.classList.add('show');
        form.reset();

        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 5000);
    }, 500);
}


// ==============================
// 13. Footer Reveal Animation
// ==============================
document.addEventListener('DOMContentLoaded', function () {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.transform = 'translateY(0)';
                entry.target.style.opacity = '1';
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.footer-section').forEach(section => {
        section.style.transform = 'translateY(20px)';
        section.style.opacity = '0';
        section.style.transition = 'all 0.6s ease-in-out';
        observer.observe(section);
    });
});
