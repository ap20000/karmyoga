/**
 * Karmayog Foundation - Premium UI Interactions
 * Features: Deep-scroll reveals, Navbar morphing, and Magnetic buttons.
 */

// 0. Apply saved theme BEFORE DOMContentLoaded to prevent flash
(function() {
  const savedTheme = localStorage.getItem('karmayog-theme');
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();

document.addEventListener("DOMContentLoaded", () => {
  // 1. Navigation Morphing
  window.addEventListener("scroll", () => {
    const navbar = document.getElementById("navbar");
    if (navbar) {
      if (window.scrollY > 100) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    }
  });

  // 2. Premium Intersection Observer for "Bento Unveil"
  const bentoObserverOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  };

  const bentoObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0) scale(1)";
        entry.target.style.filter = "blur(0)";
      }
    });
  }, bentoObserverOptions);

  // Initial state for bento items
  document.querySelectorAll(".bento-item, .fade-in-up").forEach((el, index) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(50px) scale(0.95)";
    el.style.filter = "blur(10px)";
    el.style.transition = `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s`;
    bentoObserver.observe(el);
  });

  // 3. Magnetic Hover Effect for Premium Buttons (Simplified)
  document.querySelectorAll(".btn-premium").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) scale(1.05)`;
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
    });
  });

  // 4. Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href").slice(1);
      const targetEl = document.getElementById(targetId);

      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  });

  // 5. Donation Page UI Interactions
  const freqBtns = document.querySelectorAll(".freq-btn");
  if (freqBtns.length > 0) {
    freqBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        freqBtns.forEach(b => {
          b.classList.remove("btn-primary");
          b.classList.add("btn-outline");
        });
        btn.classList.remove("btn-outline");
        btn.classList.add("btn-primary");
      });
    });
  }

  const amountBtns = document.querySelectorAll(".amount-btn");
  const customAmountContainer = document.getElementById("custom-amount-container");
  const impactMessage = document.getElementById("impact-message");

  const impactTexts = {
    "1000": "NPR 1,000 can provide educational materials for a child for a month.",
    "5000": "NPR 5,000 can provide clean drinking water to a school for a year.",
    "10000": "NPR 10,000 can fund a medical camp for an entire community.",
    "Other": "Every contribution, big or small, creates a lasting impact."
  };

  if (amountBtns.length > 0) {
    amountBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        // Reset all amount buttons
        amountBtns.forEach(b => {
          b.classList.remove("btn-primary");
          b.classList.add("btn-outline");
        });

        // Set active button
        btn.classList.remove("btn-outline");
        btn.classList.add("btn-primary");

        const amount = btn.getAttribute("data-amount");

        if (btn.id === "btn-other") {
          customAmountContainer.style.display = "block";
          impactMessage.innerText = impactTexts["Other"];
        } else {
          customAmountContainer.style.display = "none";
          if (impactTexts[amount]) {
            impactMessage.innerText = impactTexts[amount];
          }
        }
      });
    });
  }
});

// 6. Reusable Footer Web Component
class KarmayogFooter extends HTMLElement {
  connectedCallback() {
    const basePath = this.getAttribute("base-path") || "";

    this.innerHTML = `
   <footer class="footer">
  <div class="container">
    <div style="
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 2rem;
      padding: 2.5rem 0 1.5rem;
      border-top: 1px solid rgba(255,255,255,0.12);
    ">
      <!-- Brand -->
      <div style="display: flex; align-items: center; gap: 1rem;">
        <a href="${basePath}index.html">
          <img
            src="https://karmayogfoundation.org/wp-content/uploads/2023/02/cropped-Karmayog-foundation-logo_transparent-300x300-1.png"
            alt="Karmayog Foundation Logo"
            style="height: 128px; width: auto;"
          />
        </a>
        <div style="font-size: 0.8rem; opacity: 0.6; line-height: 1.5;">
          <div>Baneshwor, Kathmandu, Nepal</div>
          <div>contact@karmayogfoundation.org</div>
        </div>
      </div>

      <!-- Links -->
      <nav style="display: flex; gap: 3rem; flex-wrap: wrap;">
        <div>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.3rem; margin: 0; padding: 0;">
            <li><a href="${basePath}pages/programs.html" style="font-size: 0.85rem; opacity: 0.75;">Privacy</a></li>
            <li><a href="${basePath}pages/programs.html" style="font-size: 0.85rem; opacity: 0.75;">Policy</a></li>
            <li><a href="${basePath}pages/donate.html" style="font-size: 0.85rem; opacity: 0.75;">About Us</a></li>
            <li><a href="${basePath}pages/programs.html" style="font-size: 0.85rem; opacity: 0.75;">Support</a></li>
            <li><a href="${basePath}pages/programs.html" style="font-size: 0.85rem; opacity: 0.75;">FAQ</a></li>
            <li><a href="${basePath}pages/programs.html" style="font-size: 0.85rem; opacity: 0.75;">Blog</a></li>
          </ul>
        </div>
        <div>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.3rem; margin: 0; padding: 0;">
            <li><a href="${basePath}pages/donate.html" style="font-size: 0.85rem; opacity: 0.75;">Our Story</a></li>
            <li><a href="${basePath}pages/team.html" style="font-size: 0.85rem; opacity: 0.75;">The Team</a></li>
            <li><a href="${basePath}pages/contact.html" style="font-size: 0.85rem; opacity: 0.75;">Contact Us</a></li>
          </ul>
        </div>
      </nav>
    </div>

    <!-- Bottom bar -->
    <div style="
      padding: 1rem 0;
      border-top: 1px solid rgba(255,255,255,0.07);
      font-size: 0.75rem;
      opacity: 0.4;
      text-align: center;
    ">
      &copy; 2026 Karmayog Foundation. All rights reserved.
    </div>
  </div>
</footer>
        `;
  }
}

customElements.define("karmayog-footer", KarmayogFooter);

// 7. Reusable Navbar Web Component
class KarmayogNavbar extends HTMLElement {
  connectedCallback() {
    const basePath = this.getAttribute("base-path") || "";

    // Check if navbar was already inserted to avoid duplicate execution
    if (this.innerHTML.trim() !== "") return;

    this.innerHTML = `
    <nav class="navbar" id="navbar">
      <div class="container navbar-flex">
        <a href="${basePath}index.html" class="nav-brand">
          <img
            src="https://karmayogfoundation.org/wp-content/uploads/2023/02/cropped-Karmayog-foundation-logo_transparent-300x300-1.png"
            alt="Karmayog Foundation Logo"
            style="height: 50px; width: auto"
          />
        </a>
        <ul class="nav-links">
          <li><a href="${basePath}index.html" class="nav-link">Home</a></li>
       
          <li><a href="${basePath}pages/programs.html" class="nav-link">What We Do</a></li>
          <li><a href="${basePath}pages/whoarewe.html" class="nav-link">Who are we</a></li>
          <li><a href="${basePath}pages/team.html" class="nav-link">Our Team</a></li>
          <li><a href="${basePath}pages/donate.html" class="nav-link">Donations</a></li>
          <li><a href="${basePath}pages/contact.html" class="nav-link">Contact</a></li>
          <li><button class="theme-toggle" id="themeToggle" aria-label="Toggle dark mode" title="Toggle dark mode">🌙</button></li>
          <li><a href="#" id="navNewsletterBtn" class="btn btn-donate">News Letter</a></li>
        </ul>
      </div>
    </nav>

    <!-- Newsletter Modal popup -->
    <div id="newsletterModal" class="modal-overlay">
      <div class="modal-box">
        <button class="modal-close" id="closeNewsletterModal">&times;</button>
        <div class="modal-header">
          <h3>Select <span class="text-gradient">Issue</span></h3>
          <p style="color: var(--text-secondary); margin-top: 0.5rem;">Choose a specific newsletter issue to read.</p>
        </div>
        <div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem;">
          <button class="btn btn-outline issue-select" data-issue="Feb-2024" style="width: 100%;">February 2024 Newsletter</button>
          <button class="btn btn-outline issue-select" data-issue="Jan-2024" style="width: 100%;">January 2024 Newsletter</button>
        </div>
      </div>
    </div>
    `;

    // Highlight active link based on current path
    const currentPath = window.location.pathname;
    this.querySelectorAll(".nav-link").forEach((link) => {
      // Very basic active check: if the link's href is included in the current pathname
      if (
        link.getAttribute("href") &&
        currentPath.includes(link.getAttribute("href").replace("../", ""))
      ) {
        link.style.color = "var(--text-primary)";
      }
    });

    // Theme Toggle Logic
    const themeToggle = this.querySelector("#themeToggle");
    if (themeToggle) {
      // Set correct icon on load
      const currentTheme = document.documentElement.getAttribute('data-theme');
      themeToggle.textContent = currentTheme === 'dark' ? '☀️' : '🌙';

      themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isDark) {
          document.documentElement.removeAttribute('data-theme');
          localStorage.setItem('karmayog-theme', 'light');
          themeToggle.textContent = '🌙';
        } else {
          document.documentElement.setAttribute('data-theme', 'dark');
          localStorage.setItem('karmayog-theme', 'dark');
          themeToggle.textContent = '☀️';
        }
      });
    }

    // Modal Logic
    const newsletterBtn = this.querySelector("#navNewsletterBtn");
    const modal = this.querySelector("#newsletterModal"); // Use this.querySelector for elements within the component

    if (newsletterBtn && modal) {
      const closeBtn = modal.querySelector("#closeNewsletterModal");
      const issueBtns = modal.querySelectorAll(".issue-select");

      newsletterBtn.addEventListener("click", () => {
        modal.classList.add("active");
        document.body.style.overflow = "hidden"; // Prevent background scrolling
      });

      closeBtn.addEventListener("click", () => {
        modal.classList.remove("active");
        document.body.style.overflow = "";
      });

      // Close modal if overlay is clicked
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.classList.remove("active");
          document.body.style.overflow = "";
        }
      });

      // Proceed on issue selection
      issueBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const issue = e.target.getAttribute("data-issue");

          let targetPath = `${basePath}pages/pdf_viewer.html`;
          if (currentPath.includes("/pages/")) {
            targetPath = `${basePath}pdf_viewer.html`;
          } else if (basePath === "") {
            targetPath = "pages/pdf_viewer.html";
          }

          window.location.href = `${targetPath}?issue=${issue}`;
        });
      });
    }
  }
}

customElements.define("karmayog-navbar", KarmayogNavbar);
