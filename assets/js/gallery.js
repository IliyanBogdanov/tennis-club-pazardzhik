/**
 * gallery.js — Masonry gallery with lightbox
 */

(function () {
  const items = [];
  let currentIndex = 0;

  function buildItems() {
    document.querySelectorAll('.gallery-item').forEach((el, i) => {
      el.dataset.index = i;
      items.push(el);
    });
  }

  function openLightbox(index) {
    const lb = document.getElementById('lightbox');
    if (!lb) return;
    currentIndex = index;
    renderLightboxContent();
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    const lb = document.getElementById('lightbox');
    if (!lb) return;
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }

  function renderLightboxContent() {
    const content = document.getElementById('lightbox-content');
    if (!content) return;
    const item = items[currentIndex];
    if (!item) return;
    const img = item.querySelector('img');
    const placeholder = item.querySelector('.gallery-placeholder');
    if (img) {
      content.innerHTML = `<img src="${img.src}" alt="${img.alt || ''}">`;
    } else if (placeholder) {
      content.innerHTML = placeholder.innerHTML;
      content.style.fontSize = '5rem';
      content.style.display = 'flex';
      content.style.alignItems = 'center';
      content.style.justifyContent = 'center';
    }
  }

  function prev() {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    renderLightboxContent();
  }

  function next() {
    currentIndex = (currentIndex + 1) % items.length;
    renderLightboxContent();
  }

  function initGalleryFilters() {
    const tabs = document.querySelectorAll('.filter-tab[data-gallery-filter]');
    const galleryItems = document.querySelectorAll('.gallery-item[data-category]');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const filter = tab.dataset.galleryFilter;
        galleryItems.forEach(item => {
          if (filter === 'all' || item.dataset.category === filter) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  function init() {
    buildItems();

    // Click to open
    items.forEach((item, i) => {
      item.addEventListener('click', () => openLightbox(i));
    });

    // Lightbox controls
    const lb = document.getElementById('lightbox');
    if (lb) {
      document.getElementById('lightbox-close')?.addEventListener('click', closeLightbox);
      document.getElementById('lightbox-prev')?.addEventListener('click', prev);
      document.getElementById('lightbox-next')?.addEventListener('click', next);

      // Close on backdrop click
      lb.addEventListener('click', (e) => {
        if (e.target === lb) closeLightbox();
      });
    }

    // Keyboard nav
    document.addEventListener('keydown', (e) => {
      const lb = document.getElementById('lightbox');
      if (!lb?.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    });

    initGalleryFilters();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
