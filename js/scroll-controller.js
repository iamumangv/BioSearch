/**
 * BioSearch — Scroll Controller
 * Manages scroll tracking, step HUD labels, badge updates, and auto demo mode.
 */

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

export class ScrollController {
  constructor() {
    this.targetProgress  = 0;
    this.currentProgress = 0;
    this.isAutoDemo      = false;
    this.autoDemoTime    = 0;

    // DOM Elements
    this.scrollTrack      = document.getElementById('hero-scroll-track');
    this.scrollFill       = document.getElementById('scroll-fill');
    this.badgeText        = document.getElementById('badge-status-text');
    this.step1            = document.getElementById('step-1');
    this.step2            = document.getElementById('step-2');
    this.step3            = document.getElementById('step-3');
    this.heroContent      = document.querySelector('.hero-content');
    this.graphReadyBanner = document.getElementById('graph-ready-banner');
    this.scrollHintText   = document.getElementById('scroll-hint-text');

    this._setupListeners();
    this.updateScroll();
  }

  _setupListeners() {
    window.addEventListener('scroll', () => this.updateScroll(), { passive: true });
    window.addEventListener('resize', () => this.updateScroll());
  }

  updateScroll() {
    if (!this.scrollTrack) return;
    const rect = this.scrollTrack.getBoundingClientRect();
    const trackHeight = this.scrollTrack.offsetHeight - window.innerHeight;
    if (trackHeight <= 0) return;

    const rawP = (-rect.top) / trackHeight;
    this.targetProgress = clamp(rawP, 0, 1.15);
  }

  toggleAutoDemo() {
    this.isAutoDemo = !this.isAutoDemo;
    this.autoDemoTime = 0;
    return this.isAutoDemo;
  }

  update(dt) {
    if (this.isAutoDemo) {
      this.autoDemoTime += dt * 0.42;
      this.targetProgress = (Math.sin(this.autoDemoTime - Math.PI / 2) + 1) / 2;
    }

    // Smooth lerp
    this.currentProgress += (this.targetProgress - this.currentProgress) * 0.085;
    const sp = this.currentProgress;

    // HUD progress bar fill
    if (this.scrollFill) {
      this.scrollFill.style.width = `${clamp(sp, 0, 1) * 100}%`;
    }

    // HUD step labels
    if (this.step1 && this.step2 && this.step3) {
      this.step1.classList.toggle('active', sp < 0.32);
      this.step2.classList.toggle('active', sp >= 0.32 && sp < 0.72);
      this.step3.classList.toggle('active', sp >= 0.72);
    }

    // Badge status text
    if (this.badgeText) {
      if (sp < 0.3) {
        this.badgeText.textContent = "Hovering 3D Preprints · Scroll to Synthesize";
      } else if (sp < 0.7) {
        this.badgeText.textContent = "Papers Cascading & Dissolving into Particles...";
      } else {
        this.badgeText.textContent = "Connected Biological Knowledge Graph Formed";
      }
    }

    // Scroll hint text
    if (this.scrollHintText) {
      if (sp < 0.6) {
        this.scrollHintText.textContent = "Scroll to synthesize & search";
      } else {
        this.scrollHintText.textContent = "Continue scrolling to search";
      }
    }

    // Hero content elevation & fade
    if (this.heroContent) {
      if (sp > 0.38) {
        const heroOpacity = clamp(1 - (sp - 0.38) * 2.2, 0, 1);
        const heroY       = (sp - 0.38) * -60;
        this.heroContent.style.opacity   = heroOpacity;
        this.heroContent.style.transform = `translateY(${heroY}px)`;
        this.heroContent.style.pointerEvents = heroOpacity > 0.1 ? 'auto' : 'none';
      } else {
        this.heroContent.style.opacity   = 1;
        this.heroContent.style.transform = 'translateY(0px)';
        this.heroContent.style.pointerEvents = 'auto';
      }
    }

    // Graph Ready Banner
    if (this.graphReadyBanner) {
      if (sp >= 0.72 && sp < 1.05) {
        this.graphReadyBanner.classList.add('visible');
      } else {
        this.graphReadyBanner.classList.remove('visible');
      }
    }

    return sp;
  }
}
