/* Warung Menu MBG — shared runtime: theme, language, nav, reveal */

(() => {
  // ───── Theme (light/dark navy) ─────
  const applyTheme = (t) => {
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('mbg-theme', t);
    const btns = document.querySelectorAll('.theme-toggle');
    btns.forEach(b => b.setAttribute('aria-label', t === 'dark' ? 'Switch to light' : 'Switch to dark'));
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
      burger.addEventListener('click', () => {
        drawer.classList.toggle('is-open');
        document.body.style.overflow = drawer.classList.contains('is-open') ? 'hidden' : '';
      });
      drawer.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          drawer.classList.remove('is-open');
          document.body.style.overflow = '';
        });
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
    if (!('IntersectionObserver' in window)) return;
    document.documentElement.classList.add('js-reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -2% 0px' });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
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
          ${o.name}${o.status === 'soon' ? ' <span style="font-size:10px;color:var(--gold);letter-spacing:0.15em">· SEGERA</span>' : ''}
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
