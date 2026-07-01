// ===== Theme toggle (dark/light) =====
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const sunIcon = document.getElementById('sunIcon');
const moonIcon = document.getElementById('moonIcon');

function applyTheme(theme){
  root.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  if(theme === 'light'){
    sunIcon.style.display = 'none';
    moonIcon.style.display = 'block';
  } else {
    sunIcon.style.display = 'block';
    moonIcon.style.display = 'none';
  }
}

const savedTheme = localStorage.getItem('theme') ||
  (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  applyTheme(current === 'light' ? 'dark' : 'light');
});

// ===== Mobile nav toggle =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ===== Navbar scroll state + active link =====
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-link');
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);

  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    if (window.scrollY >= top) current = sec.id;
  });
  navAnchors.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });

  // scroll-to-top button
  if (scrollTopBtn) {
    scrollTopBtn.classList.toggle('show', window.scrollY > 500);
  }
}, { passive: true });

// ===== Scroll to top =====
if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===== Typed text effect =====
const roles = [
  'Java Full Stack Developer',
  'UI/UX Designer',
  'Problem Solver',
  'CS Engineering Student'
];
const typedEl = document.getElementById('typedText');
let roleIndex = 0, charIndex = 0, deleting = false;

function typeLoop(){
  const current = roles[roleIndex];
  if (!deleting){
    typedEl.textContent = current.slice(0, ++charIndex);
    if (charIndex === current.length){ deleting = true; setTimeout(typeLoop, 1400); return; }
  } else {
    typedEl.textContent = current.slice(0, --charIndex);
    if (charIndex === 0){ deleting = false; roleIndex = (roleIndex + 1) % roles.length; }
  }
  setTimeout(typeLoop, deleting ? 45 : 80);
}
typeLoop();

// ===== Reveal on scroll (IntersectionObserver) =====
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

// ===== Skill bar fill animation =====
const fills = document.querySelectorAll('.fill');
const fillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      const el = entry.target;
      el.style.width = el.dataset.width + '%';
      fillObserver.unobserve(el);
    }
  });
}, { threshold: 0.4 });
fills.forEach(el => fillObserver.observe(el));

// ===== Animated counters (About stats) =====
const counters = document.querySelectorAll('.stat-num');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const isDecimal = target % 1 !== 0;
      let current = 0;
      const step = target / 40;
      const tick = () => {
        current += step;
        if (current >= target){
          el.textContent = isDecimal ? target.toFixed(2) : target;
          return;
        }
        el.textContent = isDecimal ? current.toFixed(2) : Math.floor(current);
        requestAnimationFrame(tick);
      };
      tick();
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
counters.forEach(el => counterObserver.observe(el));

// ===== Contact form submission with Formspree =====
const form = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !message){
    formStatus.textContent = '❌ Please fill in all required fields.';
    formStatus.style.color = 'var(--text-error, #ff6b6b)';
    return;
  }

  // Show loading state
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';
  formStatus.textContent = '⏳ Sending your message...';
  formStatus.style.color = 'var(--text-muted)';

  try {
    const formData = new FormData(form);

    if (form.action.includes('YOUR_FORM_ID')) {
      const subject = encodeURIComponent(`Portfolio message from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
      window.location.href = `mailto:meenakothandam05@gmail.com?subject=${subject}&body=${body}`;

      formStatus.textContent = '✓ Your default email client opened. Please send the message to complete contact.';
      formStatus.style.color = 'var(--text-success, #51cf66)';
      form.reset();
      submitBtn.textContent = 'Send Message';
      submitBtn.disabled = false;
      setTimeout(() => {
        formStatus.textContent = '';
      }, 5000);
      return;
    }

    const response = await fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      // Success message
      formStatus.textContent = '✓ Message sent successfully! I\'ll get back to you soon.';
      formStatus.style.color = 'var(--text-success, #51cf66)';
      form.reset();
      submitBtn.textContent = 'Send Message';
      submitBtn.disabled = false;
      
      // Clear message after 5 seconds
      setTimeout(() => {
        formStatus.textContent = '';
      }, 5000);
    } else {
      throw new Error('Form submission failed');
    }
  } catch (error) {
    formStatus.textContent = '❌ Error sending message. Please try again or email directly.';
    formStatus.style.color = 'var(--text-error, #ff6b6b)';
    submitBtn.textContent = 'Send Message';
    submitBtn.disabled = false;
  }
});

// ===== Footer year =====
document.getElementById('year').textContent = new Date().getFullYear();