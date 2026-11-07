/**
 * University of Hargeisa — Main JavaScript
 * Handles: Navigation, Dropdowns, Counter Animation, Tabs, Form Validation, Scroll Effects
 */

(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════════════
     1. STICKY HEADER SHADOW
  ══════════════════════════════════════════════════════════════ */
  const siteHeader = document.getElementById('site-header');

  function handleHeaderScroll() {
    if (window.scrollY > 10) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });


  /* ══════════════════════════════════════════════════════════════
     2. MOBILE HAMBURGER MENU
  ══════════════════════════════════════════════════════════════ */
  const hamburger   = document.getElementById('hamburger');
  const primaryNav  = document.getElementById('main-nav');

  hamburger.addEventListener('click', function () {
    const isOpen = hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    primaryNav.classList.toggle('nav--open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close nav when a link or dropdown item is clicked on mobile
  primaryNav.querySelectorAll('.nav__link:not([aria-haspopup]), .dropdown__link').forEach(function (link) {
    link.addEventListener('click', function () {
      if (window.innerWidth <= 768) {
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        primaryNav.classList.remove('nav--open');
        document.body.style.overflow = '';
      }
    });
  });

  // Close nav on ESC
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && primaryNav.classList.contains('nav--open')) {
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      primaryNav.classList.remove('nav--open');
      document.body.style.overflow = '';
    }
  });


  /* ══════════════════════════════════════════════════════════════
     3. DROPDOWN NAVIGATION
     • Desktop: CSS hover handles open/close
     • Mobile:  Click toggles .open class
     • Keyboard: Enter / Space toggles; Escape closes
  ══════════════════════════════════════════════════════════════ */
  const dropdownItems = document.querySelectorAll('.nav__item--dropdown');

  dropdownItems.forEach(function (item) {
    const toggle = item.querySelector('.nav__link');
    const dropdown = item.querySelector('.dropdown');

    // Mobile click toggle
    toggle.addEventListener('click', function (e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const isOpen = item.classList.toggle('open');
        toggle.setAttribute('aria-expanded', isOpen);
      }
    });

    // Keyboard navigation
    toggle.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const isOpen = item.classList.toggle('open');
        toggle.setAttribute('aria-expanded', isOpen);

        if (isOpen && dropdown) {
          const firstLink = dropdown.querySelector('.dropdown__link');
          if (firstLink) firstLink.focus();
        }
      }

      if (e.key === 'Escape') {
        item.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });

    // Close when focus leaves the dropdown area
    item.addEventListener('focusout', function (e) {
      if (!item.contains(e.relatedTarget)) {
        item.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Keyboard: Arrow keys inside dropdown
    if (dropdown) {
      const dropLinks = Array.from(dropdown.querySelectorAll('.dropdown__link'));
      dropLinks.forEach(function (link, idx) {
        link.addEventListener('keydown', function (e) {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (dropLinks[idx + 1]) dropLinks[idx + 1].focus();
          }
          if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (dropLinks[idx - 1]) dropLinks[idx - 1].focus();
            else toggle.focus();
          }
          if (e.key === 'Escape') {
            item.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
            toggle.focus();
          }
        });
      });
    }
  });


  /* ══════════════════════════════════════════════════════════════
     4. ACTIVE NAV LINK — Set based on current page and section
  ══════════════════════════════════════════════════════════════ */
  const navLinks = document.querySelectorAll('.primary-nav .nav__link');
  const path = window.location.pathname.split('/').pop().toLowerCase() || 'index.html';

  navLinks.forEach(function (link) {
    const href = link.getAttribute('href');
    if (href) {
      const page = href.split('#')[0].toLowerCase();
      if ((page === path) || (path === '' && (page === 'index.html' || page === '')) || (path === 'index.html' && page === 'index.html')) {
        link.classList.add('nav__link--active');
      } else {
        link.classList.remove('nav__link--active');
      }
    }
  });

  // Only run section spy on home page if in-page sections are present
  const isHomePage = (path === '' || path === 'index.html');
  if (isHomePage) {
    const sections = document.querySelectorAll('section[id]');
    function updateActiveNav() {
      let current = '';
      const scrollY = window.scrollY + 120;

      sections.forEach(function (section) {
        if (scrollY >= section.offsetTop) {
          current = section.id;
        }
      });

      if (current) {
        navLinks.forEach(function (link) {
          const href = link.getAttribute('href');
          if (href && (href === '#' + current || href === 'index.html#' + current)) {
            navLinks.forEach(function (l) { l.classList.remove('nav__link--active'); });
            link.classList.add('nav__link--active');
          }
        });
      }
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
  }


  /* ══════════════════════════════════════════════════════════════
     5. STATS COUNTER ANIMATION (Intersection Observer)
  ══════════════════════════════════════════════════════════════ */
  const statCards = document.querySelectorAll('.stats__card');
  let statsAnimated = false;

  function animateCounter(el, target, suffix, duration) {
    const start = performance.now();
    const numEl = el.querySelector('.stats__number');

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      numEl.textContent = current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        numEl.textContent = target.toLocaleString() + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  const statsObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !statsAnimated) {
          statsAnimated = true;
          statCards.forEach(function (card) {
            const target = parseInt(card.dataset.count, 10);
            const suffix = card.dataset.suffix || '';
            animateCounter(card, target, suffix, 1800);
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  const statsSection = document.querySelector('.stats');
  if (statsSection) statsObserver.observe(statsSection);


  /* ══════════════════════════════════════════════════════════════
     6. ABOUT TABS
  ══════════════════════════════════════════════════════════════ */
  const tabButtons = document.querySelectorAll('.about__tab');
  const tabPanels  = document.querySelectorAll('.about__panel');

  tabButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const targetId = btn.getAttribute('aria-controls');

      tabButtons.forEach(function (b) {
        b.classList.remove('about__tab--active');
        b.setAttribute('aria-selected', 'false');
      });

      tabPanels.forEach(function (panel) {
        panel.classList.remove('about__panel--active');
        panel.hidden = true;
      });

      btn.classList.add('about__tab--active');
      btn.setAttribute('aria-selected', 'true');

      const target = document.getElementById(targetId);
      if (target) {
        target.classList.add('about__panel--active');
        target.hidden = false;
      }
    });

    // Keyboard: left/right arrows
    btn.addEventListener('keydown', function (e) {
      const btns = Array.from(tabButtons);
      const idx  = btns.indexOf(btn);

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const next = btns[idx + 1] || btns[0];
        next.click();
        next.focus();
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prev = btns[idx - 1] || btns[btns.length - 1];
        prev.click();
        prev.focus();
      }
    });
  });


  /* ══════════════════════════════════════════════════════════════
     7. SCROLL REVEAL ANIMATIONS (Intersection Observer)
  ══════════════════════════════════════════════════════════════ */
  const revealEls = document.querySelectorAll(
    '.college-card, .research-card, .news-card, .admissions-card, .stats__card, .about__inner, .contact__inner, .section-header'
  );

  revealEls.forEach(function (el, i) {
    el.classList.add('reveal');
    // Stagger delays for grid items
    const delay = (i % 4) * 0.1;
    el.style.transitionDelay = delay + 's';
  });

  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(function (el) {
    revealObserver.observe(el);
  });


  /* ══════════════════════════════════════════════════════════════
     8. BACK TO TOP BUTTON
  ══════════════════════════════════════════════════════════════ */
  const backToTop = document.getElementById('back-to-top');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 500) {
      backToTop.removeAttribute('hidden');
    } else {
      backToTop.setAttribute('hidden', '');
    }
  }, { passive: true });

  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ══════════════════════════════════════════════════════════════
     9. CONTACT FORM VALIDATION and SUBMISSION
  ══════════════════════════════════════════════════════════════ */
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('form-submit');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name    = document.getElementById('cf-name');
      const email   = document.getElementById('cf-email');
      const message = document.getElementById('cf-message');
      let valid = true;

      // Clear previous errors
      [name, email, message].forEach(function (field) {
        field.classList.remove('error');
      });

      formFeedback.textContent = '';
      formFeedback.className = 'contact-form__feedback';

      // Validate name
      if (!name.value.trim() || name.value.trim().length < 2) {
        name.classList.add('error');
        valid = false;
      }

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
        email.classList.add('error');
        valid = false;
      }

      // Validate message
      if (!message.value.trim() || message.value.trim().length < 10) {
        message.classList.add('error');
        valid = false;
      }

      if (!valid) {
        formFeedback.textContent = 'Please fill in all required fields correctly.';
        formFeedback.className = 'contact-form__feedback error';
        // Focus first error field
        const firstError = contactForm.querySelector('.error');
        if (firstError) firstError.focus();
        return;
      }

      // Simulate submission (replace with actual endpoint / fetch if needed)
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';

      setTimeout(function () {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        formFeedback.textContent = '✓ Thank you! Your message has been sent. We will respond within 2–3 business days.';
        formFeedback.className = 'contact-form__feedback success';
        contactForm.reset();

        // Clear success message after 8 seconds
        setTimeout(function () {
          formFeedback.textContent = '';
          formFeedback.className = 'contact-form__feedback';
        }, 8000);
      }, 1800);
    });

    // Real-time inline validation feedback
    ['cf-name', 'cf-email', 'cf-message'].forEach(function (id) {
      const field = document.getElementById(id);
      if (field) {
        field.addEventListener('blur', function () {
          field.classList.remove('error');
        });
      }
    });
  }


  /* ══════════════════════════════════════════════════════════════
     10. SMOOTH SCROLL for anchor links
  ══════════════════════════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = 120; // header + nav height
        const targetPos = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });

        // Close mobile menu if open
        if (primaryNav.classList.contains('nav--open')) {
          hamburger.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
          primaryNav.classList.remove('nav--open');
          document.body.style.overflow = '';
        }
      }
    });
  });


  /* ══════════════════════════════════════════════════════════════
     11. COPYRIGHT YEAR (auto-update)
  ══════════════════════════════════════════════════════════════ */
  const copyrightEl = document.getElementById('copyright-year');
  if (copyrightEl) {
    copyrightEl.textContent = new Date().getFullYear();
  }


  /* ══════════════════════════════════════════════════════════════
     12. HERO BG IMAGE FALLBACK
     If the hero background image fails to load, apply a CSS gradient fallback.
  ══════════════════════════════════════════════════════════════ */
  const heroBg = document.querySelector('.hero__bg');
  if (heroBg) {
    const testImg = new Image();
    testImg.onerror = function () {
      heroBg.style.backgroundImage = 'none';
      heroBg.style.background = 'linear-gradient(135deg, #0F3D2E 0%, #1a5c44 100%)';
    };
    testImg.src = 'assets/images/5.jpg';
  }

})();
