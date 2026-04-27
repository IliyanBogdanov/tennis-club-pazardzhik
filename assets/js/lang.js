/**
 * lang.js — Bilingual BG/EN language switcher
 * Uses data-i18n attributes on HTML elements
 */

(function () {
  const STORAGE_KEY = 'tcpz_lang';
  const DEFAULT_LANG = 'bg';

  let translations = {};

  function getLang() {
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    if (urlLang === 'bg' || urlLang === 'en') {
      localStorage.setItem(STORAGE_KEY, urlLang);
      return urlLang;
    }
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
  }

  async function loadTranslations(lang) {
    const res = await fetch(`lang/${lang}.json`);
    if (!res.ok) throw new Error(`Failed to load ${lang}.json`);
    return res.json();
  }

  function applyTranslations(t) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (t[key] !== undefined) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = t[key];
        } else if (el.tagName === 'OPTION') {
          el.textContent = t[key];
        } else {
          el.textContent = t[key];
        }
      }
    });

    // Translate placeholder attributes
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (t[key] !== undefined) el.placeholder = t[key];
    });

    // Translate aria-label attributes
    document.querySelectorAll('[data-i18n-label]').forEach(el => {
      const key = el.getAttribute('data-i18n-label');
      if (t[key] !== undefined) el.setAttribute('aria-label', t[key]);
    });
  }

  function updateLangButton(lang) {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.textContent = lang === 'bg' ? 'EN' : 'BG';
      btn.setAttribute('data-current-lang', lang);
    });
  }

  function switchLang() {
    const current = getLang();
    const next = current === 'bg' ? 'en' : 'bg';
    localStorage.setItem(STORAGE_KEY, next);
    init(next);
  }

  async function init(lang) {
    lang = lang || getLang();
    try {
      translations = await loadTranslations(lang);
      applyTranslations(translations);
      updateLangButton(lang);
      document.documentElement.lang = lang;
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      console.warn('Language load failed:', e);
    }
  }

  // Expose globally
  window.tcpzLang = { init, switchLang, get: (key) => translations[key] || key };

  // Auto-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => init());
  } else {
    init();
  }
})();
