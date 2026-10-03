/**
 * BioSearch — HealthMap Outbreak Radar Section Preview
 * Features an interactive planetary map with verified global disease outbreaks,
 * severity-coded pulse beacons, surveillance telemetry, and direct launch to EpiWatch HealthMap.
 */

import { WORLD_DOTS } from './config/world-dots-data.js';

export class HealthMapPreview {
  constructor(canvasId = 'healthmap-preview-canvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.dots = WORLD_DOTS; // 3,028 land dots rendered softly in the background

    this.mapWidth = 1000;
    this.mapHeight = 500;
    this.lastTime = performance.now();
    this.hoveredOutbreak = null;
    this.mousePos = { x: -1, y: -1 };

    // Verified Global Disease Hotspots (Lat/Lon converted to 1000x500 equirectangular projection)
    // x = (lon + 180) / 360 * 1000
    // y = (90 - lat) / 180 * 500
    this.outbreaks = [
      {
        id: 'mpox-drc',
        name: 'Mpox Clade Ib',
        country: 'DR Congo (South Kivu)',
        cases: '21,850 cases • 716 deaths',
        source: 'WHO Outbreak News',
        severity: 'critical',
        color: '#ff2244',
        lat: -2.5,
        lon: 28.8,
        x: ((28.8 + 180) / 360) * 1000,
        y: ((90 - (-2.5)) / 180) * 500
      },
      {
        id: 'h5n1-usa',
        name: 'Avian Flu (H5N1)',
        country: 'United States (Dairy/Poultry)',
        cases: '68 human exposures • Multistate',
        source: 'CDC Health Alert Network',
        severity: 'high',
        color: '#ff7b00',
        lat: 36.0,
        lon: -98.0,
        x: ((-98.0 + 180) / 360) * 1000,
        y: ((90 - 36.0) / 180) * 500
      },
      {
        id: 'dengue-brazil',
        name: 'Dengue Serotype Surge',
        country: 'Brazil (São Paulo/Minas)',
        cases: '4.5M cases • 3,200 deaths',
        source: 'PAHO / ReliefWeb',
        severity: 'critical',
        color: '#ff2244',
        lat: -14.2,
        lon: -51.9,
        x: ((-51.9 + 180) / 360) * 1000,
        y: ((90 - (-14.2)) / 180) * 500
      },
      {
        id: 'cholera-zambia',
        name: 'Cholera Outbreak',
        country: 'Zambia (Lusaka Province)',
        cases: '18,900 cases • 640 deaths',
        source: 'WHO / UNICEF',
        severity: 'critical',
        color: '#ff2244',
        lat: -15.4,
        lon: 28.3,
        x: ((28.3 + 180) / 360) * 1000,
        y: ((90 - (-15.4)) / 180) * 500
      },
      {
        id: 'marburg-rwanda',
        name: 'Marburg Filovirus',
        country: 'Rwanda (Kigali Cluster)',
        cases: '66 cases • 15 deaths',
        source: 'WHO DON Alert',
        severity: 'high',
        color: '#ff7b00',
        lat: -1.9,
        lon: 29.8,
        x: ((29.8 + 180) / 360) * 1000,
        y: ((90 - (-1.9)) / 180) * 500
      },
      {
        id: 'nipah-india',
        name: 'Nipah Henipavirus',
        country: 'India (Kerala)',
        cases: '4 cases • Containment Active',
        source: 'National Institute of Virology',
        severity: 'high',
        color: '#ff7b00',
        lat: 11.2,
        lon: 75.8,
        x: ((75.8 + 180) / 360) * 1000,
        y: ((90 - 11.2) / 180) * 500
      },
      {
        id: 'measles-uk',
        name: 'Measles Resurgence',
        country: 'United Kingdom & Europe',
        cases: '2,400+ pediatric clusters',
        source: 'ECDC Threat Assessment',
        severity: 'medium',
        color: '#ffd700',
        lat: 51.5,
        lon: -0.1,
        x: ((-0.1 + 180) / 360) * 1000,
        y: ((90 - 51.5) / 180) * 500
      },
      {
        id: 'covid-global',
        name: 'COVID-19 JN.1 / KP Variants',
        country: 'Global Surveillance',
        cases: 'Ongoing Genomic Tracking',
        source: 'Disease.sh Open Data',
        severity: 'low',
        color: '#00e676',
        lat: 1.3,
        lon: 103.8,
        x: ((103.8 + 180) / 360) * 1000,
        y: ((90 - 1.3) / 180) * 500
      }
    ];

    // Surveillance Telemetry Lines linking agencies
    this.vectors = [
      { from: this.outbreaks[1], to: this.outbreaks[6] }, // USA -> Europe
      { from: this.outbreaks[6], to: this.outbreaks[0] }, // Europe -> DRC
      { from: this.outbreaks[0], to: this.outbreaks[3] }, // DRC -> Zambia
      { from: this.outbreaks[0], to: this.outbreaks[4] }, // DRC -> Rwanda
      { from: this.outbreaks[4], to: this.outbreaks[5] }, // Rwanda -> India
      { from: this.outbreaks[5], to: this.outbreaks[7] }, // India -> SE Asia
      { from: this.outbreaks[1], to: this.outbreaks[2] }  // USA -> Brazil
    ];

    // Animated transmission pulse pulses
    this.pulses = [
      { vectorIndex: 0, progress: 0.2, speed: 0.35, color: '#00f0ff' },
      { vectorIndex: 1, progress: 0.7, speed: 0.40, color: '#00ff88' },
      { vectorIndex: 2, progress: 0.4, speed: 0.30, color: '#ff2244' },
      { vectorIndex: 3, progress: 0.8, speed: 0.45, color: '#ff7b00' },
      { vectorIndex: 4, progress: 0.1, speed: 0.38, color: '#a855f7' },
      { vectorIndex: 5, progress: 0.5, speed: 0.32, color: '#00ff88' }
    ];

    this.tooltip = document.getElementById('healthmap-tooltip');

    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Mouse interactions
    this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.canvas.addEventListener('mouseleave', () => this.handleMouseLeave());
    this.canvas.addEventListener('click', () => {
      window.location.href = 'healthmap-clone/frontend/index.html';
    });

    this.startLoop();
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.dpr = window.devicePixelRatio || 1;
    this.width = rect.width;
    this.height = rect.height;

    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;

    this.scaleX = this.width / this.mapWidth;
    this.scaleY = this.height / this.mapHeight;
  }

  handleMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    this.mousePos = { x: mouseX, y: mouseY };

    let found = null;
    for (const ob of this.outbreaks) {
      const sx = ob.x * this.scaleX;
      const sy = ob.y * this.scaleY;
      const dist = Math.hypot(mouseX - sx, mouseY - sy);
      if (dist < 18) {
        found = ob;
        break;
      }
    }

    this.hoveredOutbreak = found;
    if (this.tooltip) {
      if (found) {
        this.tooltip.innerHTML = `
          <div style="font-weight:700; color:${found.color}; margin-bottom:2px; font-size:13px;">${found.name}</div>
          <div style="color:#e2e8f0; font-weight:500;">${found.country}</div>
          <div style="color:#94a3b8; font-size:11px; margin-top:2px;">${found.cases}</div>
          <div style="color:#00f0ff; font-size:10px; margin-top:4px; text-transform:uppercase; letter-spacing:0.5px;">Source: ${found.source} &bull; Click to open in HealthMap</div>
        `;
        this.tooltip.style.left = `${found.x * this.scaleX}px`;
        this.tooltip.style.top = `${found.y * this.scaleY - 15}px`;
        this.tooltip.classList.add('visible');
      } else {
        this.tooltip.classList.remove('visible');
      }
    }
  }

  handleMouseLeave() {
    this.hoveredOutbreak = null;
    if (this.tooltip) this.tooltip.classList.remove('visible');
  }

  startLoop() {
    const loop = (now) => {
      const dt = (now - this.lastTime) / 1000;
      this.lastTime = now;
      this.update(dt, now);
      this.render(now);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  update(dt, now) {
    // Update vector pulses
    for (const p of this.pulses) {
      p.progress += p.speed * dt;
      if (p.progress > 1) p.progress = 0;
    }
  }

  render(now) {
    const ctx = this.ctx;
    ctx.save();
    ctx.scale(this.dpr, this.dpr);
    ctx.clearRect(0, 0, this.width, this.height);

    // 1. Draw World Matrix Land Dots
    const dotAlpha = 0.28;
    ctx.fillStyle = `rgba(0, 240, 255, ${dotAlpha})`;
    for (let i = 0; i < this.dots.length; i++) {
      const [nx, ny] = this.dots[i];
      const x = nx * this.scaleX;
      const y = ny * this.scaleY;
      ctx.fillRect(x - 1, y - 1, 2, 2);
    }

    // 2. Draw Vector Connections
    ctx.lineWidth = 1;
    for (const v of this.vectors) {
      const x1 = v.from.x * this.scaleX;
      const y1 = v.from.y * this.scaleY;
      const x2 = v.to.x * this.scaleX;
      const y2 = v.to.y * this.scaleY;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = 'rgba(0, 255, 136, 0.12)';
      ctx.stroke();
    }

    // 3. Draw Moving Telemetry Pulses along vectors
    for (const p of this.pulses) {
      const v = this.vectors[p.vectorIndex];
      const x1 = v.from.x * this.scaleX;
      const y1 = v.from.y * this.scaleY;
      const x2 = v.to.x * this.scaleX;
      const y2 = v.to.y * this.scaleY;

      const px = x1 + (x2 - x1) * p.progress;
      const py = y1 + (y2 - y1) * p.progress;

      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // 4. Draw Outbreak Beacons
    const t = now * 0.003;
    for (const ob of this.outbreaks) {
      const sx = ob.x * this.scaleX;
      const sy = ob.y * this.scaleY;
      const isHovered = this.hoveredOutbreak === ob;

      // Pulsing outer ripple ring
      const rippleSize = 10 + Math.sin(t + ob.x) * 6;
      ctx.beginPath();
      ctx.arc(sx, sy, rippleSize, 0, Math.PI * 2);
      ctx.strokeStyle = ob.color;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.35;
      ctx.stroke();
      ctx.globalAlpha = 1.0;

      // Inner glow circle
      ctx.beginPath();
      ctx.arc(sx, sy, isHovered ? 7 : 5, 0, Math.PI * 2);
      ctx.fillStyle = ob.color;
      ctx.shadowColor = ob.color;
      ctx.shadowBlur = isHovered ? 16 : 10;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Outbreak label
      ctx.font = '600 11px Inter, sans-serif';
      ctx.fillStyle = isHovered ? '#ffffff' : '#cbd5e1';
      ctx.fillText(ob.name, sx + 9, sy + 4);
    }

    ctx.restore();
  }
}
