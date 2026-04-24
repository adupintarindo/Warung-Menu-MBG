/* Warung Menu MBG — shared runtime: theme, language, nav, reveal */

(() => {
  // ───── Motion preference ─────
  window.MBG_REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener?.('change', (e) => {
    window.MBG_REDUCED_MOTION = e.matches;
    document.documentElement.classList.toggle('reduce-motion', e.matches);
  });
  if (window.MBG_REDUCED_MOTION) document.documentElement.classList.add('reduce-motion');

  // ───── Theme (light/dark navy) ─────
  const applyTheme = (t) => {
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('mbg-theme', t);
    const btns = document.querySelectorAll('.theme-toggle');
    btns.forEach(b => {
      b.setAttribute('aria-label', t === 'dark' ? 'Aktifkan mode terang' : 'Aktifkan mode gelap');
      b.setAttribute('aria-pressed', String(t === 'dark'));
    });
  };
  const savedTheme = localStorage.getItem('mbg-theme') || 'light';
  applyTheme(savedTheme);

  window.toggleTheme = () => {
    const cur = document.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(cur === 'light' ? 'dark' : 'light');
  };

  // ───── Language (ID/EN) ─────
  const savedLang = localStorage.getItem('mbg-lang') || 'id';
  const applyLang = (lang) => {
    document.documentElement.setAttribute('lang', lang);
    localStorage.setItem('mbg-lang', lang);
    // Swap all [data-id]/[data-en] attributes
    document.querySelectorAll('[data-id][data-en]').forEach(el => {
      el.textContent = el.getAttribute(`data-${lang}`);
    });
    // Placeholders
    document.querySelectorAll('[data-id-placeholder][data-en-placeholder]').forEach(el => {
      el.placeholder = el.getAttribute(`data-${lang}-placeholder`);
    });
    // Update toggles
    document.querySelectorAll('.lang-toggle button').forEach(b => {
      b.classList.toggle('is-active', b.dataset.lang === lang);
    });
    window.dispatchEvent(new CustomEvent('mbg:lang', { detail: lang }));
  };
  window.setLang = applyLang;
  window.getLang = () => document.documentElement.getAttribute('lang') || 'id';
  document.addEventListener('DOMContentLoaded', () => applyLang(savedLang));

  // ───── Nav helpers ─────
  window.initNav = () => {
    // Language toggle buttons
    document.querySelectorAll('.lang-toggle button').forEach(b => {
      b.addEventListener('click', () => applyLang(b.dataset.lang));
    });
    // Theme toggle
    document.querySelectorAll('.theme-toggle').forEach(b => {
      b.addEventListener('click', window.toggleTheme);
    });
    // Burger
    const burger = document.querySelector('.nav__burger');
    const drawer = document.querySelector('.nav__drawer');
    if (burger && drawer) {
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-controls', 'nav-drawer');
      drawer.id = drawer.id || 'nav-drawer';
      const setDrawer = (open) => {
        drawer.classList.toggle('is-open', open);
        document.body.style.overflow = open ? 'hidden' : '';
        burger.setAttribute('aria-expanded', String(open));
      };
      burger.addEventListener('click', () => setDrawer(!drawer.classList.contains('is-open')));
      drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setDrawer(false)));
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && drawer.classList.contains('is-open')) setDrawer(false);
      });
    }

    // Mark active link
    const path = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav__links a, .nav__drawer a').forEach(a => {
      const href = a.getAttribute('href');
      if (href === path) a.classList.add('is-active');
    });
  };

  // ───── Scroll reveal ─────
  const setupReveal = () => {
    if (window.MBG_REDUCED_MOTION) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
      return;
    }
    if (!('IntersectionObserver' in window)) return;
    document.documentElement.classList.add('js-reveal');
    if (window.__mbgRevealIO) { try { window.__mbgRevealIO.disconnect(); } catch(_) {} }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -2% 0px' });
    window.__mbgRevealIO = io;
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
    window.MBG = window.MBG || {};
    window.MBG.observeReveal = (el) => { if (el && el.classList?.contains('reveal')) io.observe(el); };
    setTimeout(() => {
      document.querySelectorAll('.reveal:not(.is-visible)').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight + 200) el.classList.add('is-visible');
      });
    }, 1000);
  };
  const bootReveal = () => requestAnimationFrame(() => requestAnimationFrame(setupReveal));
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootReveal);
  } else {
    bootReveal();
  }

  // ───── Back-to-top ─────
  const mountBackToTop = () => {
    const btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'Kembali ke atas');
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 15l-6-6-6 6"/></svg>`;
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    document.body.appendChild(btn);
    window.addEventListener('scroll', () => {
      btn.classList.toggle('is-visible', window.scrollY > 400);
    }, { passive: true });
  };

  // ───── Navbar render helper ─────
  window.renderNav = (activePath) => {
    return `
<nav class="nav" role="navigation" aria-label="Primary">
  <div class="nav__inner">
    <a href="index.html" class="nav__brand" aria-label="Warung Menu MBG home">
      <span class="nav__brand-mark" aria-hidden="true"><span>M</span></span>
      <span class="nav__brand-text">
        <small>Warung</small>
        <strong>Menu MBG</strong>
      </span>
    </a>
    <ul class="nav__links">
      <li><a href="index.html" data-id="Beranda" data-en="Home">Beranda</a></li>
      <li><a href="menu.html" data-id="Menu" data-en="Menu">Menu</a></li>
      <li><a href="gizi.html" data-id="Gizi" data-en="Nutrition">Gizi</a></li>
      <li><a href="video.html" data-id="Video" data-en="Video">Video</a></li>
      <li><a href="catering.html" data-id="Catering" data-en="Catering">Catering</a></li>
      <li><a href="outlet.html" data-id="Outlet" data-en="Outlets">Outlet</a></li>
      <li><a href="merch.html" data-id="Merch" data-en="Merch">Merch</a></li>
      <li><a href="tentang.html" data-id="Tentang" data-en="About">Tentang</a></li>
    </ul>
    <div class="nav__right">
      <div class="lang-toggle" role="group" aria-label="Language">
        <button data-lang="id" class="is-active">ID</button>
        <button data-lang="en">EN</button>
      </div>
      <button class="theme-toggle" aria-label="Toggle theme" title="Toggle theme">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      </button>
      <a href="catering.html" class="btn btn--gold btn--small" data-id="Pesan" data-en="Order">Pesan</a>
      <button class="nav__burger" aria-label="Open menu">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
          <path d="M3 6h18M3 12h18M3 18h18"/>
        </svg>
      </button>
    </div>
  </div>
  <div class="nav__drawer">
    <ul>
      <li><a href="index.html" data-id="Beranda" data-en="Home">Beranda</a></li>
      <li><a href="menu.html" data-id="Menu" data-en="Menu">Menu</a></li>
      <li><a href="gizi.html" data-id="Gizi" data-en="Nutrition">Gizi</a></li>
      <li><a href="video.html" data-id="Video" data-en="Video">Video</a></li>
      <li><a href="catering.html" data-id="Catering" data-en="Catering">Catering</a></li>
      <li><a href="outlet.html" data-id="Outlet" data-en="Outlets">Outlet</a></li>
      <li><a href="merch.html" data-id="Merch" data-en="Merch">Merch</a></li>
      <li><a href="tentang.html" data-id="Tentang" data-en="About">Tentang</a></li>
    </ul>
    <div class="lang-toggle">
      <button data-lang="id" class="is-active">Bahasa Indonesia</button>
      <button data-lang="en">English</button>
    </div>
  </div>
</nav>`;
  };

  // ───── Footer render helper (auto-syncs from MBG_OUTLETS) ─────
  window.renderFooter = () => {
    const outlets = (window.MBG_OUTLETS || []);
    const outletLinks = outlets.map(o => `
      <li>
        <a href="outlet.html">
          ${o.name}${o.status === 'soon' ? ' <span class="footer__soon" data-id="· SEGERA" data-en="· COMING">· SEGERA</span>' : ''}
        </a>
      </li>`).join('');

    return `
<footer class="footer" role="contentinfo">
  <div class="container">
    <div class="footer__top">
      <div class="footer__brand">
        <span class="eyebrow">Warung</span>
        <h3>Menu MBG</h3>
        <p data-id="80 menu Nusantara. Satu omprengan. Masak di dapur pusat, kirim setiap hari — tiap porsi sudah dihitung gizinya." data-en="80 Nusantara menus. One steel tray. Cooked in our central kitchen, delivered daily — every portion nutritionally balanced.">80 menu Nusantara. Satu omprengan. Masak di dapur pusat, kirim setiap hari — tiap porsi sudah dihitung gizinya.</p>
        <div class="footer__social">
          <a href="#" aria-label="Instagram"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg></a>
          <a href="#" aria-label="TikTok"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg></a>
          <a href="https://wa.me/6281234567890?text=${encodeURIComponent('Halo Warung Menu MBG!')}" aria-label="WhatsApp" target="_blank" rel="noopener"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6A8.4 8.4 0 0 1 12.5 3a8.5 8.5 0 0 1 8.5 8.5z"/></svg></a>
          <a href="mailto:halo@warungmenumbg.id" aria-label="Email"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg></a>
        </div>
      </div>
      <div>
        <h4 data-id="Jelajah" data-en="Explore">Jelajah</h4>
        <ul>
          <li><a href="index.html" data-id="Beranda" data-en="Home">Beranda</a></li>
          <li><a href="menu.html" data-id="Menu Lengkap" data-en="Full Menu">Menu Lengkap</a></li>
          <li><a href="gizi.html" data-id="Nilai Gizi" data-en="Nutrition">Nilai Gizi</a></li>
          <li><a href="video.html" data-id="Video Card" data-en="Video Cards">Video Card</a></li>
          <li><a href="catering.html" data-id="Pesan Catering" data-en="Order Catering">Pesan Catering</a></li>
          <li><a href="merch.html" data-id="Merchandise" data-en="Merchandise">Merchandise</a></li>
          <li><a href="tentang.html" data-id="Cerita Kami" data-en="Our Story">Cerita Kami</a></li>
        </ul>
      </div>
      <div>
        <h4 data-id="Outlet" data-en="Outlets">Outlet</h4>
        <ul>${outletLinks}</ul>
        <div style="margin-top:16px;display:flex;flex-direction:column;gap:8px">
          <a href="pesan.html" class="btn btn--gofood btn--small" style="justify-content:flex-start;gap:8px">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><circle cx="12" cy="12" r="10"/></svg>
            GoFood
          </a>
          <a href="pesan.html" class="btn btn--grab btn--small" style="justify-content:flex-start;gap:8px">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><circle cx="12" cy="12" r="10"/></svg>
            GrabFood
          </a>
        </div>
      </div>
      <div class="footer__newsletter">
        <h4 data-id="Update via WhatsApp" data-en="WhatsApp Updates">Update via WhatsApp</h4>
        <p style="font-size:13px;color:var(--cream-soft);margin:0 0 16px;line-height:1.5" data-id="Menu minggu ini, outlet baru, promo catering — sekali seminggu." data-en="Weekly menu rotation, new outlets, catering specials — once a week.">Menu minggu ini, outlet baru, promo catering — sekali seminggu.</p>
        <input type="tel" placeholder="0812 3456 7890" data-id-placeholder="0812 3456 7890" data-en-placeholder="Your WhatsApp number" />
        <button class="btn btn--gold btn--small" style="width:100%;margin-top:10px" data-id="Daftar" data-en="Subscribe">Daftar</button>
        <div style="margin-top:16px">
          <a href="https://wa.me/6281234567890?text=${encodeURIComponent('Halo! Saya mau tanya info catering harian Warung Menu MBG.')}" class="btn btn--wa btn--small" style="width:100%" target="_blank" rel="noopener" data-id="Chat Admin WA" data-en="Chat Admin WA">Chat Admin WA</a>
        </div>
      </div>
    </div>
    <div class="footer__divider"></div>
    <div class="footer__bottom">
      <div>© 2026 Warung Menu MBG · <span data-id="Resep dari Buku Rasa Bhayangkara Nusantara" data-en="Recipes from Buku Rasa Bhayangkara Nusantara">Resep dari Buku Rasa Bhayangkara Nusantara</span></div>
      <div style="display:flex;gap:24px">
        <a href="#" data-id="Privasi" data-en="Privacy">Privasi</a>
        <a href="#" data-id="Syarat" data-en="Terms">Syarat</a>
      </div>
    </div>
  </div>
</footer>`;
  };

  // ───── Mount layout helper ─────
  window.mountLayout = () => {
    const navSlot = document.getElementById('nav-slot');
    const footerSlot = document.getElementById('footer-slot');
    if (navSlot) navSlot.outerHTML = window.renderNav();
    if (footerSlot) footerSlot.outerHTML = window.renderFooter();
    window.initNav();
    applyLang(localStorage.getItem('mbg-lang') || 'id');
    mountBackToTop();
  };
})();

/* ═══════════════════════════════════════════════════════════════════════
   UI/UX UPGRADE PACK — shared systems
   ═══════════════════════════════════════════════════════════════════════ */

// ─── 01. Glassmorphism navbar scroll handler ───
(() => {
  const applyNavScroll = () => {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    const onScroll = () => nav.classList.toggle('nav--scrolled', window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyNavScroll);
  } else {
    applyNavScroll();
  }
})();

// ─── 05. Mega-menu (desktop): wrap "Menu" nav link ───
window.renderNavMega = () => {
  // Called after renderNav() injects the nav — upgrades the Menu link
  const menuLink = document.querySelector('.nav__links a[href="menu.html"]');
  if (!menuLink) return;
  const li = menuLink.closest('li');
  if (!li) return;
  li.classList.add('nav__mega-trigger');
  li.innerHTML = `
    <a href="menu.html" data-id="Menu" data-en="Menu" aria-haspopup="true" aria-expanded="false">Menu <span aria-hidden="true">▾</span></a>
    <div class="nav__mega" role="menu" aria-label="Submenu Menu">
      <div class="nav__mega__col">
        <div class="nav__mega__label">Halaman</div>
        <ul class="nav__mega__list">
          <li><a href="menu.html" role="menuitem">Semua Menu (80)</a></li>
          <li><a href="menu.html?filter=weekly" role="menuitem">Menu Minggu Ini</a></li>
          <li><a href="gizi.html" role="menuitem">Nilai Gizi</a></li>
          <li><a href="video.html" role="menuitem">Video Resep</a></li>
          <li><a href="catering.html" role="menuitem">Pesan Catering</a></li>
          <li><a href="pesan.html" role="menuitem">Cara Pesan</a></li>
        </ul>
      </div>
      <div class="nav__mega__col">
        <div class="nav__mega__preview-label">Menu Minggu Ini</div>
        <div class="nav__mega__preview" id="mega-preview">
          <div class="mega-preview__loading">Memuat pilihan minggu ini…</div>
        </div>
      </div>
    </div>`;
  // Keyboard + hover parity
  const trigger = li.querySelector('a');
  const mega = li.querySelector('.nav__mega');
  const setOpen = (open) => {
    li.classList.toggle('is-open', open);
    trigger.setAttribute('aria-expanded', String(open));
  };
  li.addEventListener('mouseenter', () => setOpen(true));
  li.addEventListener('mouseleave', () => setOpen(false));
  trigger.addEventListener('focus', () => setOpen(true));
  li.addEventListener('focusout', (e) => { if (!li.contains(e.relatedTarget)) setOpen(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && li.classList.contains('is-open')) { setOpen(false); trigger.focus(); }
  });
  // Populate preview with weekly menus from data
  const preview = document.getElementById('mega-preview');
  if (preview && window.MBG_MENUS) {
    const weekly = window.MBG_MENUS.filter(m => m.weekly || m.featured).slice(0, 4);
    preview.innerHTML = weekly.map(m => `
      <a href="menu.html#menu-${m.no}" class="mega-preview__item" role="menuitem">
        <span class="mega-preview__num">${m.no}.</span>
        <span class="mega-preview__name">${m.name_id}</span>
      </a>`).join('');
  }
};

// ─── 16. Toast notification system ───
window.MBG = window.MBG || {};
window.MBG.toast = (() => {
  let container = null;
  const ICONS = {
    success: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
    error:   '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    default: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
  };
  const sanitize = (s) => String(s).replace(/[&<>"']/g, (c) => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));
  const getContainer = () => {
    if (!container || !document.body.contains(container)) {
      container = document.createElement('div');
      container.className = 'mbg-toast-container';
      container.setAttribute('role', 'status');
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('aria-atomic', 'true');
      document.body.appendChild(container);
    }
    return container;
  };
  return (msg, { type = 'default', duration = 3200, icon } = {}) => {
    const toast = document.createElement('div');
    toast.className = `mbg-toast${type !== 'default' ? ` mbg-toast--${type}` : ''}`;
    toast.setAttribute('role', type === 'error' ? 'alert' : 'status');
    toast.innerHTML = `
      <span class="mbg-toast__icon" aria-hidden="true">${icon || ICONS[type] || ICONS.default}</span>
      <span class="mbg-toast__msg">${sanitize(msg)}</span>
      <button class="mbg-toast__close" type="button" aria-label="Tutup notifikasi">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>`;
    const dismiss = () => {
      toast.classList.remove('is-visible');
      setTimeout(() => toast.remove(), 400);
    };
    toast.querySelector('.mbg-toast__close').addEventListener('click', dismiss);
    getContainer().appendChild(toast);
    requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('is-visible')));
    if (duration > 0) setTimeout(dismiss, duration);
    return toast;
  };
})();

// ─── 13. Floating WhatsApp button ───
window.MBG.mountWaFab = (waUrl) => {
  const buildHref = (url) => {
    if (url) return url;
    if (window.MBG_WA && typeof window.waLink === 'function') {
      return window.waLink(window.MBG_WA.defaultMsg || 'Halo Warung Menu MBG!');
    }
    return 'https://wa.me/6281234567890?text=' + encodeURIComponent('Halo Warung Menu MBG!');
  };
  const fab = document.createElement('a');
  fab.className = 'mbg-wa-fab';
  fab.href = buildHref(waUrl);
  fab.target = '_blank';
  fab.rel = 'noopener noreferrer';
  fab.setAttribute('aria-label', 'Chat WhatsApp admin');
  fab.innerHTML = `
    <span class="mbg-wa-fab__pulse" aria-hidden="true"></span>
    <svg width="26" height="26" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.529 5.853L.057 23.55a.75.75 0 00.916.916l5.697-1.472A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.73 9.73 0 01-4.95-1.35l-.354-.213-3.667.948.969-3.567-.231-.367A9.75 9.75 0 1112 21.75z"/>
    </svg>`;
  document.body.appendChild(fab);
  // Refresh href once data loads — click always uses fresh value
  const refresh = () => { fab.href = buildHref(waUrl); };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', refresh);
  } else {
    refresh();
  }
  fab.addEventListener('pointerdown', refresh);
  // Reveal after first meaningful paint
  setTimeout(() => fab.classList.add('is-visible'), 1400);
};

// ─── 18. Lazy-load with blur-up ───
window.MBG.initLazyLoad = () => {
  if (!('IntersectionObserver' in window)) {
    // Fallback: load all immediately
    document.querySelectorAll('img[data-src]').forEach(img => {
      img.src = img.dataset.src;
      img.classList.add('loaded');
    });
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const img = entry.target;
      img.src = img.dataset.src;
      img.onload = () => img.classList.add('loaded');
      io.unobserve(img);
    });
  }, { rootMargin: '200px 0px' });
  document.querySelectorAll('img[data-src].lazy').forEach(img => io.observe(img));
};

// ─── 14. Count-up animation ───
window.MBG.countUp = (el, target, duration = 1600, suffix = '') => {
  if (window.MBG_REDUCED_MOTION) {
    const locale = (document.documentElement.lang === 'en' ? 'en-US' : 'id-ID');
    el.textContent = Number(target).toLocaleString(locale) + suffix;
    return;
  }
  const start = Date.now();
  const startVal = 0;
  const step = () => {
    const elapsed = Date.now() - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3); // cubic ease-out
    const current = Math.round(startVal + (target - startVal) * ease);
    const locale = (document.documentElement.lang === 'en' ? 'en-US' : 'id-ID');
    el.textContent = current.toLocaleString(locale) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};
window.MBG.initCountUp = () => {
  if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count || '0', 10);
      const suffix = el.dataset.suffix || '';
      window.MBG.countUp(el, target, 1800, suffix);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => io.observe(el));
};

// ─── 15. Favorites system ───
window.MBG.favs = (() => {
  const KEY = 'mbg-favs';
  const get = () => JSON.parse(localStorage.getItem(KEY) || '[]');
  const save = (arr) => localStorage.setItem(KEY, JSON.stringify(arr));
  return {
    isFav: (id) => get().includes(String(id)),
    toggle: (id) => {
      const arr = get();
      const sid = String(id);
      const idx = arr.indexOf(sid);
      if (idx === -1) { arr.push(sid); save(arr); return true; }
      arr.splice(idx, 1); save(arr); return false;
    },
    getAll: () => get(),
    count: () => get().length,
  };
})();

// ─── 12. Pull-to-refresh (PWA) ───
window.MBG.initPullToRefresh = (onRefresh) => {
  let startY = 0;
  let isPulling = false;
  const indicator = document.querySelector('.ptr-indicator');
  if (!indicator) return;
  document.addEventListener('touchstart', (e) => {
    if (window.scrollY === 0) startY = e.touches[0].clientY;
  }, { passive: true });
  document.addEventListener('touchmove', (e) => {
    if (startY === 0) return;
    const delta = e.touches[0].clientY - startY;
    if (delta > 60 && window.scrollY === 0) {
      indicator.classList.add('is-visible');
      isPulling = true;
    }
  }, { passive: true });
  document.addEventListener('touchend', () => {
    if (isPulling) {
      isPulling = false;
      startY = 0;
      if (onRefresh) onRefresh();
      else { setTimeout(() => { location.reload(); }, 400); }
      setTimeout(() => indicator.classList.remove('is-visible'), 800);
    }
    startY = 0;
  }, { passive: true });
};

// ─── 11. Sticky CTA dismiss ───
window.MBG.initStickyCta = () => {
  const cta = document.querySelector('.sticky-cta');
  if (!cta) return;
  // Add dismiss button if not present
  if (!cta.querySelector('.sticky-cta__dismiss')) {
    const btn = document.createElement('button');
    btn.className = 'sticky-cta__dismiss';
    btn.setAttribute('aria-label', 'Tutup');
    btn.innerHTML = '×';
    btn.addEventListener('click', () => {
      cta.classList.remove('is-visible');
      cta.style.display = 'none';
      sessionStorage.setItem('mbg-cta-dismissed', '1');
    });
    cta.appendChild(btn);
  }
  // Don't show if dismissed this session
  if (sessionStorage.getItem('mbg-cta-dismissed')) {
    cta.style.display = 'none';
  }
};

// ─── 19. Dark mode toggle with icon ───
window.MBG.renderThemeToggle = () => `
  <button class="theme-toggle" aria-label="Toggle theme" title="Toggle dark mode">
    <svg class="icon-moon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
    <svg class="icon-sun" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  </button>`;

// ─── Auto-mount WA FAB on all pages ───
(() => {
  const mount = () => {
    window.MBG.mountWaFab();
    window.MBG.initStickyCta();
    window.MBG.initCountUp();
    window.MBG.initLazyLoad();
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();

// ─── 20. Shared utilities ───
window.MBG.escapeHTML = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
}[c]));

window.MBG.t = (id, en) => (document.documentElement.lang === 'en' ? en : id);

// Generic modal focus trap + Escape + backdrop dismiss
window.MBG.bindModal = (modal, { onClose, initialFocus, closeOnBackdrop = true } = {}) => {
  if (!modal) return { close: () => {} };
  const focusable = 'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])';
  let previouslyFocused = null;
  const open = () => {
    previouslyFocused = document.activeElement;
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    const target = initialFocus ? modal.querySelector(initialFocus) : modal.querySelector(focusable);
    (target || modal).focus({ preventScroll: true });
  };
  const close = () => {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
      previouslyFocused.focus({ preventScroll: true });
    }
    if (typeof onClose === 'function') onClose();
  };
  modal.setAttribute('role', modal.getAttribute('role') || 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.tabIndex = modal.tabIndex || -1;
  modal.addEventListener('click', (e) => {
    if (closeOnBackdrop && e.target === modal) close();
  });
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { e.stopPropagation(); close(); return; }
    if (e.key !== 'Tab') return;
    const nodes = [...modal.querySelectorAll(focusable)].filter(n => n.offsetParent !== null);
    if (!nodes.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
    else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
  });
  modal.querySelectorAll('[data-modal-close]').forEach(btn => btn.addEventListener('click', close));
  return { open, close };
};

// Details/summary ARIA helper — add aria-expanded sync + live reg for panel open
window.MBG.enhanceDetails = (root = document) => {
  root.querySelectorAll('details').forEach(det => {
    const summary = det.querySelector('summary');
    if (!summary) return;
    summary.setAttribute('aria-expanded', String(det.open));
    det.addEventListener('toggle', () => summary.setAttribute('aria-expanded', String(det.open)));
  });
};

document.addEventListener('DOMContentLoaded', () => window.MBG.enhanceDetails());
