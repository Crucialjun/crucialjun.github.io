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

  /* ── Hero particle effect (Antigravity) ───────── */
  (function initHeroParticles() {
    const canvas = document.getElementById("hero-particles");
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    const hero = document.getElementById("hero");
    let W, H, particles, rafId;

    function isDarkMode() {
      const t = document.documentElement.getAttribute("data-theme");
      if (t === "dark") return true;
      if (t === "light") return false;
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    function resize() {
      W = canvas.width  = hero.offsetWidth;
      H = canvas.height = hero.offsetHeight;
      if (!particles) spawnParticles();
    }

    function makeParticle(initial) {
      return {
        x:        Math.random() * (W || window.innerWidth),
        y:        initial ? Math.random() * (H || window.innerHeight) : (H || window.innerHeight) + 12,
        speedY:   0.25 + Math.random() * 0.6,
        driftX:   (Math.random() - 0.5) * 0.18,
        angle:    Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.008,
        len:      4 + Math.random() * 6,
        opacity:  0.12 + Math.random() * 0.38,
      };
    }

    function spawnParticles() {
      const count = Math.min(130, Math.max(60, Math.floor((W * H) / 7500)));
      particles = Array.from({ length: count }, (_, i) => makeParticle(true));
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      const dark = isDarkMode();
      const r = dark ? 224 : 200;
      const g = dark ?  92 :  78;
      const b = dark ?  48 :  24;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.strokeStyle = `rgba(${r},${g},${b},${p.opacity})`;
        ctx.lineWidth   = 1.5;
        ctx.lineCap     = "round";
        ctx.beginPath();
        ctx.moveTo(-p.len / 2, 0);
        ctx.lineTo( p.len / 2, 0);
        ctx.stroke();
        ctx.restore();

        p.y     -= p.speedY;
        p.x     += p.driftX;
        p.angle += p.rotSpeed;

        if (p.y < -20 || p.x < -20 || p.x > W + 20) {
          particles[i] = makeParticle(false);
        }
      }
      rafId = requestAnimationFrame(draw);
    }

    // Pause when hero is off-screen (performance)
    const pauseObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        if (!rafId) draw();
      } else {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }, { threshold: 0 });
    pauseObserver.observe(hero);

    resize();
    window.addEventListener("resize", resize, { passive: true });
    draw();
  })();

});
