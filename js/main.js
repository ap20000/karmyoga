document.addEventListener('DOMContentLoaded', () => {
  console.log('Karmayog Foundation - Loaded');

  // --- CUSTOM CURSOR ---
  let cursor = document.querySelector('.hover-cursor');
  if (!cursor) {
    cursor = document.createElement('div');
    cursor.className = 'hover-cursor';
    document.body.appendChild(cursor);
  }

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    cursor.classList.add('active');
  });

  document.addEventListener('mouseleave', () => cursor.classList.remove('active'));
  document.addEventListener('mouseenter', () => cursor.classList.add('active'));

  const interactiveElements = document.querySelectorAll(
    'a, button, .btn, .nav-links a, .nav-links .newsletter-link, .btn-nav, .hamburger, ' +
    '.programs-showcase-item, .mission-grid-item, .impact-item, .stat-card, ' +
    '.social-link, .footer-col ul li a, .footer-contact p, .help-button, ' +
    '.back-to-top, .modal-close, .issue-btn, .scroll-indicator, input, select, textarea'
  );

  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
    el.addEventListener('mousedown',  () => cursor.classList.add('clicked'));
    el.addEventListener('mouseup',    () => cursor.classList.remove('clicked'));
  });

  if (window.innerWidth <= 900) cursor.style.display = 'none';

  // --- NAVBAR SCROLL LOGIC ---
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const isFixed = document.body.hasAttribute('data-nav-fixed') || navbar.hasAttribute('data-nav-fixed');
    const handleScroll = () => {
      if (isFixed || window.scrollY > 50) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // --- REVEAL ANIMATIONS ---
  const reveals = document.querySelectorAll('[data-reveal]');
  if (reveals.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.revealDelay || 0;
          setTimeout(() => entry.target.classList.add('revealed'), delay);
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    reveals.forEach(el => revealObserver.observe(el));
  }

  // --- STAT COUNTERS ---
  const counters = document.querySelectorAll('.stat-number[data-count]');
  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target, parseInt(entry.target.dataset.count, 10));
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObserver.observe(c));

    function animateCounter(el, target) {
      let step = 0;
      const steps = 60, duration = 2000;
      const increment = target / steps;
      const timer = setInterval(() => {
        step++;
        if (step >= steps) {
          el.textContent = target.toLocaleString() + (target === 100 ? '%' : '+');
          clearInterval(timer);
        } else {
          el.textContent = Math.floor(step * increment).toLocaleString() + (target === 100 ? '%' : '+');
        }
      }, duration / steps);
    }
  }

  // --- SMOOTH SCROLL ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#' || !targetId) return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.pushState(null, null, targetId);
      }
    });
  });

  // --- HERO VIDEO ---
  const heroVideo = document.querySelector('.hero-background-video');
  if (heroVideo) {
    heroVideo.muted = true;
    heroVideo.playsInline = true;
    heroVideo.addEventListener('loadeddata', () => heroVideo.style.opacity = '1');
    heroVideo.addEventListener('error', () => {
      const bg = document.querySelector('.hero--video-bg');
      if (bg) bg.style.background = 'linear-gradient(135deg, #1A2E40, #2AB7CA)';
    });
    const p = heroVideo.play();
    if (p !== undefined) p.catch(() => {});
  }

  // --- RESIZE HANDLER ---
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth > 900) {
        const navLinks  = document.getElementById('navLinks');
        const hamburger = document.querySelector('.hamburger');
        const overlay   = document.querySelector('.nav-overlay');
        if (navLinks?.classList.contains('open'))  navLinks.classList.remove('open');
        if (hamburger?.classList.contains('open')) hamburger.classList.remove('open');
        if (overlay?.classList.contains('active')) overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
      if (cursor) cursor.style.display = window.innerWidth <= 900 ? 'none' : 'block';
    }, 250);
  });

  // --- ACTIVE NAV LINK ---
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href') || '';
    link.classList.remove('active');
    if (currentPath === '/' && href.includes('index')) link.classList.add('active');
    else if (currentPath.endsWith(href) || (href.includes('pages/') && currentPath.includes(href.replace('../', '')))) link.classList.add('active');
  });

  // --- BACK TO TOP ---
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => backToTop.classList.toggle('visible', window.scrollY > 500));
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // --- ORBIT ANIMATION ---
  initOrbitAnimation();
});

// ── Orbit Animation ──
function initOrbitAnimation() {
  const orbitWrapper = document.getElementById('orbitWrapper');
  if (!orbitWrapper) return;

  if (window.innerWidth <= 768) {
    orbitWrapper.style.display = 'none';
    const mobileFallback = document.getElementById('orbitMobile');
    if (mobileFallback) mobileFallback.style.display = 'grid';
    return;
  }

  const orbitItems   = document.querySelectorAll('.orbit-item');
  const totalItems   = orbitItems.length;
  const OUTER_RADIUS = 200;
  const cx = orbitWrapper.offsetWidth  / 2;
  const cy = orbitWrapper.offsetHeight / 2;
  let angle = 0;

  function positionItems() {
    orbitItems.forEach((item, i) => {
      const theta = angle + (i * (2 * Math.PI / totalItems));
      item.style.left     = (cx + OUTER_RADIUS * Math.cos(theta)) + 'px';
      item.style.top      = (cy + OUTER_RADIUS * Math.sin(theta)) + 'px';
      item.style.position = 'absolute';
    });
  }

  positionItems();
  let animationFrame, isAnimating = true;

  function animate() {
    if (!isAnimating) return;
    angle += 0.004;
    positionItems();
    animationFrame = requestAnimationFrame(animate);
  }
  animate();

  orbitWrapper.addEventListener('mouseenter', () => { isAnimating = false; orbitWrapper.classList.add('orbit-paused'); cancelAnimationFrame(animationFrame); });
  orbitWrapper.addEventListener('mouseleave', () => { isAnimating = true;  orbitWrapper.classList.remove('orbit-paused'); animate(); });

  window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) {
      cancelAnimationFrame(animationFrame);
      orbitWrapper.style.display = 'none';
      const mob = document.getElementById('orbitMobile');
      if (mob) mob.style.display = 'grid';
    } else {
      positionItems();
    }
  });
}


// ══════════════════════════════════════════════════════
//  CUSTOM ELEMENTS
// ══════════════════════════════════════════════════════

class KarmayogNavbar extends HTMLElement {
  connectedCallback() {
    if (this.innerHTML.trim()) return;
    const basePath = this.getAttribute('base-path') || '';

    this.innerHTML = `
    <nav class="navbar" id="navbar">
      <div class="navbar-inner">
        <div class="nav-left">
          <a href="${basePath}index.html" class="nav-brand">
            <img src="https://wsrv.nl/?url=karmayogfoundation.org/wp-content/uploads/2023/02/cropped-Karmayog-foundation-logo_transparent-300x300-1.png&w=300&q=90" alt="Karmayog Foundation" />
          </a>
          <ul class="nav-links" id="navLinks">
            <li><a href="${basePath}index.html">Home</a></li>
            <li><a href="${basePath}pages/programs.html">What We Do</a></li>
            <li><a href="${basePath}pages/whoarewe.html">About Us</a></li>
            <li><a href="${basePath}pages/team.html">Our Team</a></li>
            <li><a href="${basePath}pages/contact.html">Contact</a></li>
            <li><a href="${basePath}pages/newsletter.html" id="navNewsletterBtn" class="newsletter-link">Newsletter</a></li>
            <li class="nav-donate-li"><a href="${basePath}pages/donate.html">❤️ Donate Now</a></li>
          </ul>
        </div>
        <div class="nav-right">
          <a href="${basePath}pages/donate.html" class="btn-nav">❤️ Donate Now</a>
        </div>
        <button class="hamburger" id="hamburgerBtn" aria-label="Open menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
    <!-- dim overlay behind mobile drawer -->
    <div class="nav-overlay" id="navOverlay"></div>`;

    this.initializeNavbar();
  }

  initializeNavbar() {
    const hamburger = this.querySelector('#hamburgerBtn');
    const navLinks  = this.querySelector('#navLinks');
    const overlay   = this.querySelector('#navOverlay');

    const openMenu = () => {
      navLinks.classList.add('open');
      hamburger.classList.add('open');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      hamburger.setAttribute('aria-expanded', 'true');
    };

    const closeMenu = () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
      hamburger.setAttribute('aria-expanded', 'false');
    };

    if (hamburger && navLinks) {
      hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinks.classList.contains('open') ? closeMenu() : openMenu();
      });
    }

    if (overlay) {
      overlay.addEventListener('click', closeMenu);
    }

    // close on nav link click (mobile)
    navLinks?.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 900) closeMenu();
      });
    });

    // close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }
}
customElements.define('karmayog-navbar', KarmayogNavbar);


class KarmayogFooter extends HTMLElement {
  connectedCallback() {
    const basePath = this.getAttribute('base-path') || '';
    const year = new Date().getFullYear();
    this.innerHTML = `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <img src="https://wsrv.nl/?url=karmayogfoundation.org/wp-content/uploads/2023/02/cropped-Karmayog-foundation-logo_transparent-300x300-1.png&w=300&q=90" alt="Karmayog Foundation" />
            <p>Uplifting underprivileged communities across rural Nepal through education, clean water, and sustainable development.</p>
            <div class="footer-socials">
              <a href="https://facebook.com" class="social-link">f</a>
              <a href="https://instagram.com" class="social-link">in</a>
              <a href="https://youtube.com" class="social-link">y</a>
            </div>
          </div>
          <div class="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="${basePath}index.html">Home</a></li>
              <li><a href="${basePath}pages/programs.html">Programs</a></li>
              <li><a href="${basePath}pages/whoarewe.html">About Us</a></li>
              <li><a href="${basePath}pages/team.html">Our Team</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Support</h4>
            <ul>
              <li><a href="${basePath}pages/contact.html">Contact Us</a></li>
              <li><a href="${basePath}pages/donate.html">Donate</a></li>
              <li><a href="${basePath}pages/newsletter.html">Newsletter</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Reach Us</h4>
            <div class="footer-contact">
              <p>Baneshwor, Kathmandu</p>
              <p>contact@karmayogfoundation.org</p>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>© ${year} Karmayog Foundation. All rights reserved.</p>
        </div>
      </div>
    </footer>`;
  }
}
customElements.define('karmayog-footer', KarmayogFooter);


// ── utils ──
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}