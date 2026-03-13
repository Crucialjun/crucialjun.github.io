/*!
 * Nicholas Otieno - Portfolio Scripts
 */

window.addEventListener("DOMContentLoaded", () => {

  /* ── Theme management ─────────────────────────── */
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon   = themeToggle ? themeToggle.querySelector("i") : null;

  // Cycles: system → light → dark → system
  const THEMES = ["system", "light", "dark"];
  const ICONS  = {
    system: "fa-circle-half-stroke",
    light:  "fa-sun",
    dark:   "fa-moon",
  };
  const LABELS = {
    system: "Using system color mode — click to switch to light",
    light:  "Light mode — click to switch to dark",
    dark:   "Dark mode — click to switch to system",
  };

  function getStoredTheme() {
    return localStorage.getItem("theme") || "system";
  }

  function applyTheme(theme) {
    const html = document.documentElement;
    if (theme === "system") {
      html.removeAttribute("data-theme");
    } else {
      html.setAttribute("data-theme", theme);
    }
    localStorage.setItem("theme", theme);
    if (themeIcon && themeToggle) {
      themeIcon.className = "fa-solid " + ICONS[theme];
      themeToggle.setAttribute("aria-label", LABELS[theme]);
    }
  }

  function cycleTheme() {
    const current = getStoredTheme();
    const next = THEMES[(THEMES.indexOf(current) + 1) % THEMES.length];
    applyTheme(next);
  }

  // Apply stored/default theme immediately (anti-FOUC script handles
  // initial paint; this syncs the icon state)
  applyTheme(getStoredTheme());

  if (themeToggle) {
    themeToggle.addEventListener("click", cycleTheme);
  }

  // Keep icon in sync when OS preference changes while in "system" mode
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (getStoredTheme() === "system") {
      applyTheme("system"); // no-op on DOM, just resyncs icon
    }
  });

  /* ── Navbar scroll effect ─────────────────────── */
  const navbar = document.getElementById("navbar");
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 40);
  }, { passive: true });

  /* ── Mobile nav toggle ────────────────────────── */
  const toggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (toggle && navLinks) {
    toggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close on link click
    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (!navbar.contains(e.target)) {
        navLinks.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ── Smooth scroll with nav offset ───────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offsetTop = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offsetTop, behavior: "smooth" });
    });
  });

  /* ── Reveal on scroll ─────────────────────────── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings
        const siblings = entry.target.parentElement
          ? Array.from(entry.target.parentElement.querySelectorAll(".reveal"))
          : [];
        const idx = siblings.indexOf(entry.target);
        const delay = idx * 80;
        setTimeout(() => {
          entry.target.classList.add("visible");
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -60px 0px" });

  document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

  /* ── Active nav link highlighting ─────────────── */
  const sections = document.querySelectorAll("section[id]");
  const links = document.querySelectorAll(".nav-links a");

  const highlightNav = () => {
    let current = "";
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 120) {
        current = section.id;
      }
    });
    links.forEach(link => {
      link.style.color = "";
      const href = link.getAttribute("href");
      if (href === "#" + current) {
        link.style.color = "var(--accent-light)";
      }
    });
  };
  window.addEventListener("scroll", highlightNav, { passive: true });
  highlightNav();

  /* ── Contact form feedback ────────────────────── */
  const form = document.querySelector(".contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      const btn = this.querySelector("button[type=submit]");
      btn.disabled = true;
      btn.textContent = "Sending...";
      // Formspree handles actual submission; re-enable after delay
      setTimeout(() => {
        btn.textContent = "Send Message";
        btn.disabled = false;
      }, 4000);
    });

    // Input focus ring styling
    form.querySelectorAll("input, textarea").forEach(input => {
      input.addEventListener("focus", () => {
        input.closest(".form-group").querySelector("label").style.color = "var(--accent-light)";
      });
      input.addEventListener("blur", () => {
        input.closest(".form-group").querySelector("label").style.color = "";
      });
    });
  }

  /* ── Respect reduced motion ───────────────────── */
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll(".reveal").forEach(el => {
      el.classList.add("visible");
    });
  }

});
