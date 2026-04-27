/**
 * main.js — Shared UI: nav toggle, scroll-to-top, active link, forms
 */

(function () {
  // ---- Mobile nav ----
  function initMobileNav() {
    const hamburger = document.querySelector('.navbar__hamburger');
    const mobileMenu = document.querySelector('.navbar__mobile');
    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open);
      const spans = hamburger.querySelectorAll('span');
      if (open) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => mobileMenu.classList.remove('open'));
    });
  }

  // ---- Active nav link ----
  function initActiveNav() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.navbar__links a, .navbar__mobile a').forEach(a => {
      const href = a.getAttribute('href');
      if (href === currentPath || (currentPath === '' && href === 'index.html')) {
        a.classList.add('active');
      }
    });
  }

  // ---- Scroll to top ----
  function initScrollTop() {
    const btn = document.getElementById('scroll-top');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ---- Navbar shadow on scroll ----
  function initNavbarScroll() {
    const nav = document.querySelector('.navbar');
    if (!nav) return;
    window.addEventListener('scroll', () => {
      nav.style.boxShadow = window.scrollY > 10
        ? '0 2px 16px rgba(0,0,0,0.1)'
        : '';
    }, { passive: true });
  }

  // ---- Court filter tabs ----
  function initCourtFilter() {
    const tabs = document.querySelectorAll('.filter-tab[data-court-filter]');
    const cards = document.querySelectorAll('.court-card[data-surface]');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const filter = tab.dataset.courtFilter;
        cards.forEach(card => {
          card.closest('[data-surface-wrapper]') || card;
          if (filter === 'all' || card.dataset.surface === filter) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // ---- Form handling (Formspree-style + local fallback) ----
  function initForms() {
    document.querySelectorAll('form[data-form]').forEach(form => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('[type="submit"]');
        const notice = form.nextElementSibling;

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = '...';
        }

        // If form has an action URL (Formspree), try submitting
        const action = form.getAttribute('action');
        if (action && action.startsWith('https://formspree.io')) {
          try {
            const res = await fetch(action, {
              method: 'POST',
              body: new FormData(form),
              headers: { Accept: 'application/json' }
            });
            if (res.ok) {
              showNotice(form, 'success');
              form.reset();
            } else {
              showNotice(form, 'error');
            }
          } catch {
            showNotice(form, 'error');
          }
        } else {
          // Demo mode: just show success
          showNotice(form, 'success');
          form.reset();
        }

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.setAttribute('data-i18n', submitBtn.getAttribute('data-i18n'));
          // Re-apply translation
          if (window.tcpzLang) {
            const key = submitBtn.getAttribute('data-i18n');
            if (key) submitBtn.textContent = window.tcpzLang.get(key);
          }
        }
      });
    });
  }

  function showNotice(form, type) {
    // Remove old notices
    form.querySelectorAll('.form-notice').forEach(n => n.remove());
    const notice = document.createElement('p');
    notice.className = `form-notice form-notice--${type}`;
    notice.setAttribute('data-i18n', type === 'success' ? 'form.success' : 'form.error');
    notice.textContent = type === 'success'
      ? (window.tcpzLang?.get('form.success') || 'Благодарим!')
      : (window.tcpzLang?.get('form.error') || 'Грешка. Опитайте отново.');
    form.after(notice);
    setTimeout(() => notice.remove(), 6000);
  }

  // ---- Smooth scroll for anchor links ----
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // ---- Intersection Observer: fade-in on scroll ----
  function initScrollReveal() {
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.card, .feature-card, .pricing-card, .team-card, .benefit-card, .tournament-card, .court-card').forEach(el => {
      el.classList.add('reveal');
      observer.observe(el);
    });
  }

  // ---- Init all ----
  function init() {
    initMobileNav();
    initActiveNav();
    initScrollTop();
    initNavbarScroll();
    initCourtFilter();
    initForms();
    initSmoothScroll();
    initScrollReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
