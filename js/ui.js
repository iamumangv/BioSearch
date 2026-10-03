/**
 * BioSearch — UI Controller
 * Handles:
 * - Seamless scroll navigation to Search section
 * - Search input auto-focus & search box glowing highlight
 * - Topic pill auto-filler
 * - Stat counter animations
 * - Button ripples and mouse glow
 */

export function initUI(scrollController) {
  // ─── Navbar scroll styling ───────────────────────────────────────────────────
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // ─── Seamless Scroll to Search Function ──────────────────────────────────────
  const searchSection = document.getElementById('explore-section');
  const searchInput   = document.getElementById('search-input');
  const searchBox     = document.getElementById('main-search-box');

  function smoothScrollToSearch() {
    if (!searchSection) return;
    const targetY = searchSection.offsetTop - 80;
    window.scrollTo({ top: targetY, behavior: 'smooth' });

    // Focus and highlight search box once arrived
    setTimeout(() => {
      if (searchInput) {
        searchInput.focus();
      }
      if (searchBox) {
        searchBox.classList.add('highlight');
        setTimeout(() => searchBox.classList.remove('highlight'), 1200);
      }
    }, 650);
  }

  // ─── Buttons & CTA triggers ─────────────────────────────────────────────────
  const startBtn = document.getElementById('start-exploring-btn');
  if (startBtn) {
    startBtn.addEventListener('click', smoothScrollToSearch);
  }

  const navCtaBtn = document.getElementById('nav-cta-btn');
  if (navCtaBtn) {
    navCtaBtn.addEventListener('click', smoothScrollToSearch);
  }

  const navSearchLink = document.getElementById('nav-search-link');
  if (navSearchLink) {
    navSearchLink.addEventListener('click', e => {
      e.preventDefault();
      smoothScrollToSearch();
    });
  }

  const bannerSearchBtn = document.getElementById('banner-search-btn');
  if (bannerSearchBtn) {
    bannerSearchBtn.addEventListener('click', smoothScrollToSearch);
  }

  const scrollIndicator = document.getElementById('scroll-indicator');
  const scrollTrack     = document.getElementById('hero-scroll-track');
  if (scrollIndicator && scrollTrack) {
    scrollIndicator.addEventListener('click', () => {
      const targetY = scrollTrack.offsetTop + (scrollTrack.offsetHeight - window.innerHeight) * 0.75;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    });
  }

  // Auto Demo button
  const demoBtn = document.getElementById('watch-demo-btn');
  if (demoBtn && scrollController) {
    demoBtn.addEventListener('click', () => {
      const active = scrollController.toggleAutoDemo();
      demoBtn.classList.toggle('active-demo', active);
    });
  }

  // Smooth scroll for all other anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '' || href === '#explore-section') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ─── Stat Counter Animation ──────────────────────────────────────────────────
  function animateCounter(el, target, duration = 2000) {
    const start   = performance.now();
    const easeOut = t => 1 - Math.pow(1 - t, 3);

    function tick(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value    = Math.round(easeOut(progress) * target);
      el.textContent = value;
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target;
      }
    }
    requestAnimationFrame(tick);
  }

  const statsSection = document.getElementById('hero-stats');
  let countersStarted = false;

  const counterObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !countersStarted) {
      countersStarted = true;
      document.querySelectorAll('.stat-num').forEach(el => {
        const target = parseInt(el.dataset.target, 10);
        setTimeout(() => animateCounter(el, target, 2200), 1200);
      });
    }
  }, { threshold: 0.3 });

  if (statsSection) counterObserver.observe(statsSection);

  // ─── Topic Pill Tag Selectors ───────────────────────────────────────────────
  document.querySelectorAll('.pill-tag').forEach(pill => {
    pill.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = pill.textContent.trim();
        searchInput.focus();
      }
      if (searchBox) {
        searchBox.classList.add('highlight');
        setTimeout(() => searchBox.classList.remove('highlight'), 800);
      }
    });
  });

  // Search Submit Action
  const searchSubmitBtn = document.getElementById('search-submit-btn');
  if (searchSubmitBtn && searchInput) {
    searchSubmitBtn.addEventListener('click', () => {
      const query = searchInput.value.trim();
      if (!query) {
        searchInput.placeholder = "Please enter a gene or research keyword...";
        searchInput.focus();
        return;
      }
      searchSubmitBtn.textContent = "Querying Graph...";
      setTimeout(() => {
        searchSubmitBtn.textContent = "Search Graph";
        alert(`Querying BioSearch Knowledge Graph for "${query}"...\nFound 1,420 connected nodes across PubMed & bioRxiv.`);
      }, 600);
    });
  }

  // ─── 3D Model Search & Category Filtering ────────────────────────────────────
  const modelsInput = document.getElementById('models-3d-input');
  const modelsSearchBtn = document.getElementById('models-3d-search-btn');

  function handle3DModelSearch() {
    const query = modelsInput ? modelsInput.value.trim() : '';
    if (query) {
      window.location.href = `model-viewer.html?q=${encodeURIComponent(query)}`;
    } else {
      window.location.href = `model-viewer.html`;
    }
  }

  if (modelsSearchBtn) {
    modelsSearchBtn.addEventListener('click', handle3DModelSearch);
  }
  if (modelsInput) {
    modelsInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') handle3DModelSearch();
    });
  }

  // Category filter tabs on models grid
  document.querySelectorAll('.model-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.model-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;
      document.querySelectorAll('.model-card').forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ─── Button Ripple Effect ───────────────────────────────────────────────────
  document.querySelectorAll('.btn-primary, .btn-secondary, .nav-cta, .banner-btn, .search-submit-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const ripple = document.createElement('span');

      ripple.style.cssText = `
        position: absolute;
        width: 4px; height: 4px;
        border-radius: 50%;
        background: rgba(255,255,255,0.45);
        transform: scale(0);
        left: ${x - 2}px; top: ${y - 2}px;
        pointer-events: none;
        animation: rippleExpand 0.6s ease-out forwards;
      `;
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  // Ripple animation keyframe
  const style = document.createElement('style');
  style.textContent = `
    @keyframes rippleExpand {
      to { transform: scale(80); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  // ─── Cursor Ambient Glow ─────────────────────────────────────────────────────
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 360px; height: 360px;
    border-radius: 50%;
    pointer-events: none;
    z-index: 1;
    background: radial-gradient(circle, rgba(0,240,255,0.07) 0%, rgba(139,92,246,0.03) 40%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: left 0.12s ease-out, top 0.12s ease-out;
    mix-blend-mode: screen;
  `;
  document.body.appendChild(glow);

  window.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  }, { passive: true });
}
