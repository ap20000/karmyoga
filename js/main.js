
document.addEventListener('DOMContentLoaded', () => {
  console.log('Karmayog Foundation - Loaded');

  
  const cursor = document.createElement('div');
  cursor.className = 'hover-cursor';
  document.body.appendChild(cursor);

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    cursor.classList.add('active');
  });

  document.addEventListener('mouseleave', () => {
    cursor.classList.remove('active');
  });

  document.addEventListener('mouseenter', () => {
    cursor.classList.add('active');
  });

  const interactiveElements = document.querySelectorAll(
    'a, button, .btn, .nav-links a, .nav-links .newsletter-link, .btn-nav, .hamburger, ' +
    '.programs-showcase-item, .mission-grid-item, .impact-item, .stat-card, ' +
    '.social-link, .footer-col ul li a, .footer-contact p, .help-button, ' +
    '.back-to-top, .modal-close, .issue-btn, .scroll-indicator, input, select, textarea'
  );

  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hovered');
    });
    
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hovered');
    });

    el.addEventListener('mousedown', () => {
      cursor.classList.add('clicked');
    });

    el.addEventListener('mouseup', () => {
      cursor.classList.remove('clicked');
    });
  });

  if (window.innerWidth <= 768) {
    cursor.style.display = 'none';
  }

  
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); 
  }

  
  const reveals = document.querySelectorAll('[data-reveal]');
  
  if (reveals.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.revealDelay || 0;
          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, delay);
          revealObserver.unobserve(entry.target);
        }
      });
    }, { 
      threshold: 0.1, 
      rootMargin: '0px 0px -50px 0px' 
    });

    reveals.forEach(el => revealObserver.observe(el));
  }

  
  const counters = document.querySelectorAll('.stat-number[data-count]');
  
  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.dataset.count, 10);
          animateCounter(entry.target, target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));

    function animateCounter(el, target) {
      let current = 0;
      const duration = 2000; 
      const steps = 60;
      const increment = target / steps;
      let step = 0;
      
      const timer = setInterval(() => {
        step++;
        current += increment;
        
        if (step >= steps) {
          el.textContent = target.toLocaleString() + (target === 100 ? '%' : '+');
          clearInterval(timer);
        } else {
          el.textContent = Math.floor(current).toLocaleString() + (target === 100 ? '%' : '+');
        }
      }, duration / steps);
    }
  }

  
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#' || !targetId) return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
        history.pushState(null, null, targetId);
      }
    });
  });

  
  const heroVideo = document.querySelector('.hero-background-video');
  
  if (heroVideo) {
    heroVideo.muted = true;
    heroVideo.playsInline = true;
    
    heroVideo.addEventListener('loadeddata', () => {
      heroVideo.style.opacity = '1';
    });
    
    heroVideo.addEventListener('error', () => {
      document.querySelector('.hero--video-bg').style.background = 'linear-gradient(135deg, #1A2E40, #2AB7CA)';
    });
    
    const playPromise = heroVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        console.log('Autoplay prevented - will play on interaction');
      });
    }
  }

 
  document.addEventListener('click', function playVideoOnFirstInteraction() {
    const video = document.querySelector('.hero-background-video');
    if (video && video.paused) {
      video.play();
    }
    document.removeEventListener('click', playVideoOnFirstInteraction);
  }, { once: true });

  
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth > 768) {
        const navLinks = document.getElementById('navLinks');
        const hamburger = document.querySelector('.hamburger');
        
        if (navLinks?.classList.contains('open')) {
          navLinks.classList.remove('open');
        }
        if (hamburger?.classList.contains('open')) {
          hamburger.classList.remove('open');
        }
        document.body.style.overflow = '';
      }
      
      
      const cursor = document.querySelector('.hover-cursor');
      if (cursor) {
        if (window.innerWidth <= 768) {
          cursor.style.display = 'none';
        } else {
          cursor.style.display = 'block';
        }
      }
    }, 250);
  });

 
  function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.remove('active');
      
      if (currentPath === '/' && href.includes('index')) {
        link.classList.add('active');
      } else if (currentPath.endsWith(href) || 
                 (href.includes('pages/') && currentPath.includes(href.replace('../', '')))) {
        link.classList.add('active');
      }
    });
  }
  
  setActiveNavLink();

 
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  
  if ('loading' in HTMLImageElement.prototype) {
    lazyImages.forEach(img => {
      img.src = img.dataset.src || img.src;
    });
  } else {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          imageObserver.unobserve(img);
        }
      });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
  }

  const freqBtns = document.querySelectorAll('.freq-btn');
  const amountBtns = document.querySelectorAll('.amount-btn');
  const customAmt = document.getElementById('custom-amount-container');
  const impactMsg = document.getElementById('impact-message');
  
  // Frequency buttons (Monthly/One-time)
  if (freqBtns.length) {
    freqBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        freqBtns.forEach(b => {
          b.classList.remove('btn-primary');
          b.classList.add('btn-outline');
        });
        btn.classList.remove('btn-outline');
        btn.classList.add('btn-primary');
      });
    });
  }
  
  // Amount buttons with impact messages
  const impactTexts = {
    '1000': 'NPR 1,000 provides educational materials for a child for a month.',
    '5000': 'NPR 5,000 provides clean drinking water to a school for a year.',
    '10000': 'NPR 10,000 funds a medical camp for an entire community.',
    'Other': 'Every contribution matters and creates a lasting impact.'
  };
  
  if (amountBtns.length) {
    amountBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        amountBtns.forEach(b => {
          b.classList.remove('btn-primary');
          b.classList.add('btn-outline');
        });
        btn.classList.remove('btn-outline');
        btn.classList.add('btn-primary');
        
        const amount = btn.dataset.amount;
        
        if (btn.id === 'btn-other') {
          if (customAmt) customAmt.style.display = 'block';
          if (impactMsg) impactMsg.textContent = impactTexts['Other'];
        } else {
          if (customAmt) customAmt.style.display = 'none';
          if (impactMsg && impactTexts[amount]) {
            impactMsg.textContent = impactTexts[amount];
          }
        }
      });
    });
  }

  
  const backToTop = document.getElementById('backToTop');
  const helpButton = document.getElementById('helpButton');

  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });

    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  if (helpButton) {
    helpButton.addEventListener('click', () => {
      window.location.href = 'pages/contact.html';
    });
  }
});


class KarmayogNavbar extends HTMLElement {
  connectedCallback() {
    if (this.innerHTML.trim()) return;
    
    const basePath = this.getAttribute('base-path') || '';
    
    this.innerHTML = `
    <nav class="navbar" id="navbar">
      <div class="navbar-inner">
        <!-- Left section with logo and navigation -->
        <div class="nav-left">
          <a href="${basePath}index.html" class="nav-brand">
            <img 
              src="https://karmayogfoundation.org/wp-content/uploads/2023/02/cropped-Karmayog-foundation-logo_transparent-300x300-1.png" 
              alt="Karmayog Foundation" 
            />
          </a>

          <ul class="nav-links" id="navLinks">
            <li><a href="${basePath}index.html">Home</a></li>
            <li><a href="${basePath}pages/programs.html">What We Do</a></li>
            <li><a href="${basePath}pages/whoarewe.html">About Us</a></li>
            <li><a href="${basePath}pages/team.html">Our Team</a></li>
            <li><a href="${basePath}pages/contact.html">Contact</a></li>
            <li><button class="newsletter-link" id="navNewsletterBtn">Newsletter</button></li>
          </ul>
        </div>

        <!-- Right section with donate button -->
        <div class="nav-right">
          <a href="${basePath}pages/donate.html" class="btn-nav">
            <span class="heart-icon">❤️</span>
            Donate Now
          </a>
        </div>

        <!-- Hamburger for mobile -->
        <button class="hamburger" id="hamburgerBtn" aria-expanded="false">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>

    <!-- Newsletter Modal -->
    <div class="modal-overlay" id="newsletterModal">
      <div class="modal-container">
        <button class="modal-close" id="closeModal">×</button>
        <div class="modal-header">
          <h3>Get the <span class="gradient-text">Newsletter</span></h3>
          <p>Choose an issue to read</p>
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          <button class="btn btn-outline issue-btn" data-issue="Feb-2024">February 2024 →</button>
          <button class="btn btn-outline issue-btn" data-issue="Jan-2024">January 2024 →</button>
          <button class="btn btn-outline issue-btn" data-issue="Dec-2023">December 2023 →</button>
        </div>
        <div style="margin-top: 1.5rem; text-align: center;">
          <p style="font-size: 0.85rem; color: var(--text-muted);">Subscribe for future issues</p>
          <form id="newsletter-form" style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
            <input type="email" placeholder="Your email" required style="flex: 1; padding: 0.7rem 1rem; border: 1px solid var(--border-light); border-radius: var(--r-full);">
            <button type="submit" class="btn btn-primary" style="padding: 0.7rem 1.5rem;">Subscribe</button>
          </form>
        </div>
      </div>
    </div>`;

    this.initializeNavbar();
  }

  initializeNavbar() {
    const currentPath = window.location.pathname;
    this.querySelectorAll('.nav-links a').forEach(link => {
      const href = link.getAttribute('href') || '';
      
      if (currentPath === '/' && href.includes('index')) {
        link.classList.add('active');
      } else if (currentPath.endsWith(href) && href !== '#') {
        link.classList.add('active');
      }
    });

    const hamburger = this.querySelector('#hamburgerBtn');
    const navLinks = this.querySelector('#navLinks');
    
    if (hamburger && navLinks) {
      hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = navLinks.classList.toggle('open');
        hamburger.classList.toggle('open', isOpen);
        hamburger.setAttribute('aria-expanded', String(isOpen));
        
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });

      navLinks.querySelectorAll('a, .newsletter-link').forEach(link => {
        link.addEventListener('click', () => {
          navLinks.classList.remove('open');
          hamburger.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        });
      });

      document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('open') && 
            !navLinks.contains(e.target) && 
            !hamburger.contains(e.target)) {
          navLinks.classList.remove('open');
          hamburger.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      });
    }

    const modalBtn = this.querySelector('#navNewsletterBtn');
    const modal = this.querySelector('#newsletterModal');
    const closeBtn = this.querySelector('#closeModal');
    const issueBtns = this.querySelectorAll('.issue-btn');
    const newsletterForm = this.querySelector('#newsletter-form');

    const openModal = () => {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (modalBtn) modalBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
    }

    if (newsletterForm) {
      newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        
        const successMsg = document.createElement('div');
        successMsg.textContent = '✓ Subscribed successfully!';
        successMsg.style.cssText = `
          background: var(--grad-primary);
          color: white;
          padding: 0.75rem;
          border-radius: var(--r-full);
          margin-top: 1rem;
          font-size: 0.9rem;
          animation: slideUp 0.3s ease;
        `;
        
        newsletterForm.appendChild(successMsg);
        emailInput.value = '';
        
        setTimeout(() => {
          successMsg.remove();
        }, 3000);
        
        setTimeout(() => {
          closeModal();
        }, 2000);
      });
    }

    issueBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const issue = btn.dataset.issue;
        const basePath = this.getAttribute('base-path') || '';
        const currentPath = window.location.pathname;
        
        let target = '';
        if (currentPath.includes('/pages/')) {
          target = `${basePath}pdf_viewer.html`;
        } else {
          target = `pages/pdf_viewer.html`;
        }
        
        window.location.href = `${target}?issue=${issue}`;
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const modal = this.querySelector('#newsletterModal');
        if (modal && modal.classList.contains('active')) {
          closeModal();
        }
      }
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
          <!-- Brand Column -->
          <div class="footer-brand">
            <img 
              src="https://karmayogfoundation.org/wp-content/uploads/2023/02/cropped-Karmayog-foundation-logo_transparent-300x300-1.png" 
              alt="Karmayog Foundation" 
            />
            <p>Uplifting underprivileged communities across rural Nepal through education, clean water, and sustainable development.</p>
            <div class="footer-socials">
              <a href="https://www.facebook.com/karmayogfoundation" target="_blank" rel="noopener" class="social-link" aria-label="Facebook">f</a>
              <a href="https://www.instagram.com/karmayogfoundation" target="_blank" rel="noopener" class="social-link" aria-label="Instagram">in</a>
              <a href="https://www.youtube.com/@karmayogfoundation" target="_blank" rel="noopener" class="social-link" aria-label="YouTube">▶</a>
            </div>
          </div>

          <!-- Quick Links -->
          <div class="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="${basePath}index.html">Home</a></li>
              <li><a href="${basePath}pages/programs.html">Our Programs</a></li>
              <li><a href="${basePath}pages/whoarewe.html">About Us</a></li>
              <li><a href="${basePath}pages/team.html">Our Team</a></li>
              <li><a href="${basePath}pages/donate.html">Donate</a></li>
            </ul>
          </div>

          <!-- Support -->
          <div class="footer-col">
            <h4>Support</h4>
            <ul>
              <li><a href="${basePath}pages/contact.html">Contact Us</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#" id="footerNewsletterBtn">Newsletter</a></li>
            </ul>
          </div>

          <!-- Contact -->
          <div class="footer-col">
            <h4>Reach Us</h4>
            <div class="footer-contact">
              <p><i class="fas fa-map-marker-alt"></i> Baneshwor, Kathmandu</p>
              <p><i class="fas fa-envelope"></i> contact@karmayog.org</p>
              <p><i class="fas fa-phone"></i> +977 1 234 5678</p>
              <p><i class="fas fa-clock"></i> Mon-Fri: 9AM - 6PM</p>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <p>© ${year} Karmayog Foundation. All rights reserved.</p>
          <div class="footer-bottom-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>`;

    const footerNewsletterBtn = this.querySelector('#footerNewsletterBtn');
    if (footerNewsletterBtn) {
      footerNewsletterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const modal = document.querySelector('#newsletterModal');
        if (modal) {
          modal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    }
  }
}

customElements.define('karmayog-footer', KarmayogFooter);


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

function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = setTimeout(() => inThrottle = false, limit);
    }
  };
}

function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function preloadImages(images) {
  images.forEach(image => {
    const img = new Image();
    img.src = image;
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    debounce,
    throttle,
    isInViewport,
    formatNumber,
    preloadImages
  };
}


document.addEventListener('DOMContentLoaded', function () {

  document.body.classList.add('page-loaded');


  const cursor = document.getElementById('cursor');

  if (cursor && window.innerWidth > 768) {
    document.addEventListener('mousemove', function (e) {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top  = e.clientY + 'px';
      cursor.classList.add('active');
    });

    document.addEventListener('mouseleave', function () {
      cursor.classList.remove('active');
    });

    const hoverEls = document.querySelectorAll(
      'a, button, .btn, .programs-showcase-item, .mission-grid-item, ' +
      '.impact-item, .stat-card, .social-link, .help-button, .back-to-top, .scroll-indicator'
    );

    hoverEls.forEach(function (el) {
      el.addEventListener('mouseenter', function () { cursor.classList.add('hovered'); });
      el.addEventListener('mouseleave', function () { cursor.classList.remove('hovered'); });
    });

    document.addEventListener('mousedown', function () { cursor.classList.add('clicked'); });
    document.addEventListener('mouseup',   function () { cursor.classList.remove('clicked'); });
  }


  var revealEls = document.querySelectorAll('[data-reveal]');

  if (revealEls.length && 'IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var delay = parseInt(entry.target.dataset.revealDelay || 0);
          setTimeout(function () {
            entry.target.classList.add('revealed');
          }, delay);
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('revealed'); });
  }


  var navbar = document.querySelector('.navbar');

  function handleScroll() {
    if (!navbar) return;

    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    var btn = document.getElementById('backToTop');
    if (btn) {
      if (window.scrollY > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); 


  var backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  var helpBtn = document.getElementById('helpButton');
  if (helpBtn) {
    helpBtn.addEventListener('click', function () {
      window.location.href = 'pages/contact.html';
    });
  }


  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


 
  (function initOrbit() {
    var wrapper  = document.getElementById('orbitWrapper');
    var mobileEl = document.getElementById('orbitMobile');
    var items    = document.querySelectorAll('.orbit-item');

    if (!wrapper || !items.length) return;

    if (window.innerWidth <= 900) {
      wrapper.style.display = 'none';
      if (mobileEl) mobileEl.style.display = 'grid';
      return;
    }

    if (mobileEl) mobileEl.style.display = 'none';

    var N      = items.length;       
    var RADIUS = 200;               
    var SPEED  = 0.012;              
    var CX     = wrapper.offsetWidth  / 2 || 230;
    var CY     = wrapper.offsetHeight / 2 || 230;

    var angle  = 0;    
    var paused = false;
    var lastT  = null;

    
    wrapper.addEventListener('mouseenter', function () { paused = true; });
    wrapper.addEventListener('mouseleave', function () { paused = false; });

    function tick(ts) {
      if (lastT === null) lastT = ts;
      var dt = ts - lastT;
      lastT = ts;

      if (!paused) {
        angle += SPEED * dt * (Math.PI / 180);
      }

      items.forEach(function (item, i) {
        var theta = angle + (i / N) * 2 * Math.PI;   
        var x = CX + RADIUS * Math.cos(theta);
        var y = CY + RADIUS * Math.sin(theta);

        
        item.style.left = x + 'px';
        item.style.top  = y + 'px';
        
      });

      requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  })();


}); 