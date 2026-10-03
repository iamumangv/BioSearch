/**
 * BioSearch — Global Cyber & Biosafety Threat Map Engine
 * Renders an animated high-tech dotted matrix world map with active threat vectors,
 * glowing network mesh, red alert callouts, and live threat website launcher.
 */

import { WORLD_DOTS } from './config/world-dots-data.js';

export class ThreatMap {
  constructor(canvasId = 'threat-canvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.dots = WORLD_DOTS; // [ [nx, ny], ... ] normalized to 1000x500

    // Coordinate system dimensions
    this.mapWidth = 1000;
    this.mapHeight = 500;

    // High DPI scaling
    this.dpr = window.devicePixelRatio || 1;
    this.width = this.canvas.clientWidth || 1000;
    this.height = this.canvas.clientHeight || 580;

    // Simulation state
    this.isRunning = true;
    this.activeFilter = 'all';
    this.hoveredHub = null;
    this.mousePos = { x: -1, y: -1 };
    this.lastTime = performance.now();

    // Stats
    this.attacksBlocked = 2489120;
    this.attacksPerSec = 14280;
    this.activeVectorsCount = 18;

    // Global Hubs (Network Nodes)
    this.hubs = [
      { id: 'sf', name: 'Silicon Valley', x: 175, y: 175, ip: '104.28.19.4', threat: 'Low', ping: '12ms', country: 'USA' },
      { id: 'nyc', name: 'New York', x: 260, y: 165, ip: '198.51.100.22', threat: 'Medium', ping: '18ms', country: 'USA' },
      { id: 'chi', name: 'Chicago', x: 230, y: 160, ip: '162.243.14.88', threat: 'Low', ping: '22ms', country: 'USA' },
      { id: 'sao', name: 'São Paulo', x: 360, y: 365, ip: '177.18.220.10', threat: 'Medium', ping: '115ms', country: 'Brazil' },
      { id: 'bog', name: 'Bogotá', x: 275, y: 245, ip: '190.24.89.5', threat: 'Low', ping: '98ms', country: 'Colombia' },
      { id: 'lon', name: 'London', x: 485, y: 125, ip: '185.12.64.1', threat: 'High', ping: '35ms', country: 'UK' },
      { id: 'fra', name: 'Frankfurt', x: 520, y: 130, ip: '194.109.6.92', threat: 'High', ping: '38ms', country: 'Germany' },
      { id: 'rom', name: 'Rome (Active Hotspot)', x: 535, y: 165, ip: '151.100.4.2', threat: 'CRITICAL', ping: '44ms', country: 'Italy', isHotspot: true },
      { id: 'mad', name: 'Madrid', x: 475, y: 160, ip: '213.0.88.19', threat: 'High', ping: '42ms', country: 'Spain', isHotspot: true },
      { id: 'cai', name: 'Cairo', x: 575, y: 190, ip: '41.130.22.8', threat: 'Medium', ping: '68ms', country: 'Egypt' },
      { id: 'lag', name: 'Lagos', x: 510, y: 255, ip: '102.164.3.1', threat: 'Low', ping: '120ms', country: 'Nigeria' },
      { id: 'jhb', name: 'Johannesburg', x: 575, y: 395, ip: '196.25.1.1', threat: 'Low', ping: '175ms', country: 'South Africa' },
      { id: 'dxb', name: 'Dubai', x: 630, y: 200, ip: '94.200.12.4', threat: 'Medium', ping: '82ms', country: 'UAE' },
      { id: 'del', name: 'New Delhi', x: 700, y: 195, ip: '182.72.10.4', threat: 'High', ping: '85ms', country: 'India' },
      { id: 'sin', name: 'Singapore', x: 775, y: 275, ip: '202.158.40.1', threat: 'High', ping: '65ms', country: 'Singapore' },
      { id: 'pek', name: 'Beijing', x: 805, y: 165, ip: '202.108.22.5', threat: 'High', ping: '110ms', country: 'China' },
      { id: 'tyo', name: 'Tokyo', x: 880, y: 165, ip: '133.242.18.9', threat: 'Medium', ping: '92ms', country: 'Japan' },
      { id: 'syd', name: 'Sydney', x: 900, y: 390, ip: '139.130.4.5', threat: 'Low', ping: '145ms', country: 'Australia' }
    ];

    // Static Network Mesh Lines between hubs (Green Grid)
    this.networkEdges = [
      ['sf', 'nyc'], ['sf', 'chi'], ['chi', 'nyc'],
      ['nyc', 'lon'], ['nyc', 'sao'], ['bog', 'sao'], ['nyc', 'bog'],
      ['lon', 'fra'], ['fra', 'rom'], ['lon', 'mad'], ['mad', 'rom'],
      ['rom', 'cai'], ['cai', 'dxb'], ['cai', 'lag'], ['lag', 'jhb'],
      ['fra', 'del'], ['dxb', 'del'], ['del', 'sin'], ['sin', 'pek'],
      ['pek', 'tyo'], ['sin', 'syd'], ['tyo', 'syd'], ['sf', 'tyo']
    ];

    // Dynamic Attack Vectors (Arcs)
    this.vectors = [];
    this.impacts = [];
    this.alertBadges = [];

    // Pre-seed attack vectors
    this.initVectors();

    // DOM Elements
    this.tooltip = document.getElementById('threat-tooltip');
    this.modal = document.getElementById('threat-map-modal');
    this.openModalBtn = document.getElementById('btn-open-threatmap');
    this.closeModalBtn = document.getElementById('threat-modal-close');
    this.directLaunchBtn = document.getElementById('btn-direct-threatmap');

    this.setupListeners();
    this.resize();
    this.startLoop();
    this.startHUDTimer();
  }

  initVectors() {
    const defaultAttacks = [
      { from: 'pek', to: 'nyc', type: 'DDOS', label: 'DDOS: 840 Gbps', color: '#ff3366', speed: 0.35 },
      { from: 'rom', to: 'lon', type: 'MALWARE', label: 'C2 BOTNET BEACON', color: '#ff3366', speed: 0.42 },
      { from: 'sin', to: 'sf', type: 'EXPLOIT', label: 'ZERO-DAY CVE-2026', color: '#ff3366', speed: 0.3 },
      { from: 'del', to: 'fra', type: 'RANSOMWARE', label: 'RANSOMWARE INJECT', color: '#ff3366', speed: 0.38 },
      { from: 'sf', to: 'sao', type: 'DATA_EXFIL', label: 'SYN-FLOOD INTRUSION', color: '#ff3366', speed: 0.45 },
      { from: 'tyo', to: 'syd', type: 'TELEMETRY', label: 'TELEMETRY PUSH', color: '#00ff88', speed: 0.28 },
      { from: 'lon', to: 'cai', type: 'SECURITY', label: 'BIOSAFETY SYNC', color: '#00e5ff', speed: 0.32 },
      { from: 'dxb', to: 'rom', type: 'BOTNET', label: 'BOTNET PROBE', color: '#ff3366', speed: 0.48 }
    ];

    defaultAttacks.forEach((atk, i) => {
      this.createVector(atk.from, atk.to, atk.type, atk.label, atk.color, atk.speed, i * 0.25);
    });
  }

  createVector(fromId, toId, type = 'DDOS', label = 'ATTACK', color = '#ff3366', speed = 0.35, offset = 0) {
    const fromHub = this.hubs.find(h => h.id === fromId);
    const toHub = this.hubs.find(h => h.id === toId);
    if (!fromHub || !toHub) return;

    // Curved control point arching over the path
    const dx = toHub.x - fromHub.x;
    const dy = toHub.y - fromHub.y;
    const dist = Math.hypot(dx, dy);

    // Arch height perpendicular to the line
    const midX = (fromHub.x + toHub.x) / 2;
    const midY = (fromHub.y + toHub.y) / 2;
    const archHeight = Math.min(dist * 0.35, 120);

    // Higher arch upwards
    const cpX = midX - (dy / dist) * (archHeight * 0.5);
    const cpY = midY - Math.abs(dx * 0.2) - archHeight;

    this.vectors.push({
      from: fromHub,
      to: toHub,
      cpX,
      cpY,
      type,
      label,
      color,
      progress: (offset % 1),
      speed: speed * (0.8 + Math.random() * 0.4),
      pulses: [
        { progress: (offset % 1), size: 4 },
        { progress: ((offset + 0.15) % 1), size: 2.5 }
      ],
      showBadge: Math.random() > 0.4,
      badgePos: { x: cpX, y: cpY - 15 }
    });
  }

  setupListeners() {
    window.addEventListener('resize', () => this.resize());

    // Mouse coordinates tracking for tooltip and hover
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.mapWidth / rect.width;
      const scaleY = this.mapHeight / rect.height;

      const mx = (e.clientX - rect.left) * scaleX;
      const my = (e.clientY - rect.top) * scaleY;
      this.mousePos = { x: mx, y: my, clientX: e.clientX, clientY: e.clientY };

      // Find closest hub within 22px
      let closest = null;
      let minDist = 22;
      for (const hub of this.hubs) {
        const d = Math.hypot(hub.x - mx, hub.y - my);
        if (d < minDist) {
          minDist = d;
          closest = hub;
        }
      }

      this.hoveredHub = closest;
      this.updateTooltip(closest, e.clientX, e.clientY);
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.hoveredHub = null;
      this.mousePos = { x: -1, y: -1 };
      if (this.tooltip) this.tooltip.style.display = 'none';
    });

    // Click canvas to trigger a new cyber vector!
    this.canvas.addEventListener('click', (e) => {
      const source = this.hoveredHub || this.hubs[Math.floor(Math.random() * this.hubs.length)];
      let target = this.hubs[Math.floor(Math.random() * this.hubs.length)];
      while (target.id === source.id) {
        target = this.hubs[Math.floor(Math.random() * this.hubs.length)];
      }

      const threatTypes = [
        { type: 'DDOS', label: 'DDOS: 1.2 Tbps', color: '#ff3366' },
        { type: 'MALWARE', label: 'ZERO-DAY PROBE', color: '#ff3366' },
        { type: 'EXPLOIT', label: 'APT-41 EXPLOIT', color: '#ff1144' },
        { type: 'BOTNET', label: 'BOTNET INVASION', color: '#ff5500' }
      ];
      const pick = threatTypes[Math.floor(Math.random() * threatTypes.length)];

      this.createVector(source.id, target.id, pick.type, pick.label, pick.color, 0.45, 0);

      // Trigger ripple at origin immediately
      this.impacts.push({ x: source.x, y: source.y, radius: 2, maxRadius: 35, alpha: 1, color: pick.color });
    });

    // Filter Buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeFilter = btn.dataset.filter || 'all';
      });
    });

    // Quick Simulation Controls
    const pauseBtn = document.getElementById('btn-map-pause');
    if (pauseBtn) {
      pauseBtn.addEventListener('click', () => {
        this.isRunning = !this.isRunning;
        pauseBtn.innerHTML = this.isRunning
          ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> Pause`
          : `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg> Resume`;
      });
    }

    const strikeBtn = document.getElementById('btn-map-strike');
    if (strikeBtn) {
      strikeBtn.addEventListener('click', () => {
        // Launch 3 simultaneous attacks
        for (let i = 0; i < 3; i++) {
          const s = this.hubs[Math.floor(Math.random() * this.hubs.length)];
          const t = this.hubs[Math.floor(Math.random() * this.hubs.length)];
          if (s.id !== t.id) {
            this.createVector(s.id, t.id, 'DDOS', 'CRITICAL OVERRIDE', '#ff2255', 0.5, 0);
          }
        }
      });
    }

    // Modal Opening & Closing
    if (this.openModalBtn && this.modal) {
      this.openModalBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.modal.classList.add('active');
      });
    }

    if (this.directLaunchBtn) {
      this.directLaunchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // Direct launch to Kaspersky Cybermap
        window.open('https://cybermap.kaspersky.com/', '_blank', 'noopener,noreferrer');
      });
    }

    if (this.closeModalBtn && this.modal) {
      this.closeModalBtn.addEventListener('click', () => {
        this.modal.classList.remove('active');
      });

      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) {
          this.modal.classList.remove('active');
        }
      });

      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.modal.classList.contains('active')) {
          this.modal.classList.remove('active');
        }
      });
    }
  }

  updateTooltip(hub, clientX, clientY) {
    if (!this.tooltip) return;

    if (!hub) {
      this.tooltip.style.display = 'none';
      return;
    }

    const isAlert = hub.threat === 'CRITICAL' || hub.threat === 'High';
    this.tooltip.className = isAlert ? 'threat-danger' : '';
    this.tooltip.innerHTML = `
      <div class="tooltip-title">
        <span>${hub.name}</span>
        <span class="tooltip-badge ${isAlert ? 'danger' : ''}">${hub.threat}</span>
      </div>
      <div class="tooltip-row">
        <span>Node IP</span>
        <span>${hub.ip}</span>
      </div>
      <div class="tooltip-row">
        <span>Country</span>
        <span>${hub.country}</span>
      </div>
      <div class="tooltip-row">
        <span>Latency</span>
        <span>${hub.ping}</span>
      </div>
      <div class="tooltip-row">
        <span>Status</span>
        <span style="color: ${isAlert ? '#ff3366' : '#00ff88'}">${isAlert ? 'Under Attack' : 'Protected'}</span>
      </div>
    `;

    this.tooltip.style.display = 'block';
    this.tooltip.style.left = `${clientX}px`;
    this.tooltip.style.top = `${clientY}px`;
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
    this.dpr = window.devicePixelRatio || 1;

    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.resetTransform();
    this.ctx.scale(this.dpr, this.dpr);
  }

  startHUDTimer() {
    setInterval(() => {
      if (!this.isRunning) return;
      this.attacksBlocked += Math.floor(Math.random() * 25) + 8;
      this.attacksPerSec = 14200 + Math.floor(Math.sin(Date.now() * 0.002) * 850) + Math.floor(Math.random() * 120);

      const elBlocked = document.getElementById('metric-attacks-blocked');
      if (elBlocked) elBlocked.textContent = this.attacksBlocked.toLocaleString();

      const elRate = document.getElementById('metric-attacks-rate');
      if (elRate) elRate.textContent = this.attacksPerSec.toLocaleString();

      // Occasionally add a new random attack to keep screen dynamic
      if (this.vectors.length < 24 && Math.random() > 0.4) {
        const s = this.hubs[Math.floor(Math.random() * this.hubs.length)];
        const t = this.hubs[Math.floor(Math.random() * this.hubs.length)];
        if (s.id !== t.id) {
          const types = [
            { type: 'DDOS', label: 'DDOS: 720 Gbps', color: '#ff3366' },
            { type: 'MALWARE', label: 'BOTNET C2', color: '#ff3366' },
            { type: 'EXPLOIT', label: 'PORT SCAN 443', color: '#ff2255' },
            { type: 'TELEMETRY', label: 'SYNC DATA', color: '#00ff88' }
          ];
          const chosen = types[Math.floor(Math.random() * types.length)];
          this.createVector(s.id, t.id, chosen.type, chosen.label, chosen.color, 0.32, 0);
        }
      }
    }, 450);
  }

  startLoop() {
    const loop = (time) => {
      requestAnimationFrame(loop);
      const dt = Math.min((time - this.lastTime) / 1000, 0.08);
      this.lastTime = time;

      if (this.isRunning) {
        this.update(dt, time / 1000);
      }
      this.render(time / 1000);
    };
    requestAnimationFrame(loop);
  }

  update(dt, t) {
    // Update vector progress
    for (let i = this.vectors.length - 1; i >= 0; i--) {
      const v = this.vectors[i];
      v.progress += v.speed * dt;

      // Update pulses
      for (const p of v.pulses) {
        p.progress += v.speed * dt;
        if (p.progress >= 1) {
          p.progress = 0;
          // Spawn impact ring at destination
          this.impacts.push({
            x: v.to.x,
            y: v.to.y,
            radius: 2,
            maxRadius: 28,
            alpha: 1,
            color: v.color
          });
        }
      }

      // If finished, reset
      if (v.progress > 1) {
        v.progress = 0;
      }
    }

    // Update impacts
    for (let i = this.impacts.length - 1; i >= 0; i--) {
      const imp = this.impacts[i];
      imp.radius += 40 * dt;
      imp.alpha -= 1.8 * dt;
      if (imp.alpha <= 0 || imp.radius >= imp.maxRadius) {
        this.impacts.splice(i, 1);
      }
    }
  }

  render(t) {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    // Clear background
    ctx.fillStyle = '#010508';
    ctx.fillRect(0, 0, w, h);

    // Scale factors to map 1000x500 to viewport
    const scaleX = w / this.mapWidth;
    const scaleY = h / this.mapHeight;

    ctx.save();
    ctx.scale(scaleX, scaleY);

    // 1. Draw Grid Lines (Latitudes and Longitudes with subtle curved horizon)
    this.drawGrid(ctx, t);

    // 2. Draw Mediterranean / Europe Threat Hotspot Aura (matching reference image)
    this.drawHotspotAura(ctx, t);

    // 3. Draw World Dots (Green Matrix)
    this.drawWorldDots(ctx, t);

    // 4. Draw Inter-Hub Network Mesh Lines
    this.drawNetworkMesh(ctx, t);

    // 5. Draw Attack Arcs & Pulses
    this.drawAttackVectors(ctx, t);

    // 6. Draw Impact Shockwaves
    this.drawImpacts(ctx);

    // 7. Draw Global Hubs
    this.drawHubs(ctx, t);

    // 8. Draw Alert Callout Badges
    this.drawAlertBadges(ctx, t);

    ctx.restore();
  }

  drawGrid(ctx, t) {
    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(0, 255, 136, 0.04)';

    // Meridian lines (Verticals)
    for (let x = 100; x < 1000; x += 100) {
      ctx.beginPath();
      ctx.moveTo(x, 20);
      ctx.lineTo(x, 480);
      ctx.stroke();
    }

    // Curved Parallel lines (Latitudes with gentle globe curve)
    for (let y = 60; y <= 440; y += 70) {
      const curve = (y - 250) * 0.08;
      ctx.beginPath();
      ctx.moveTo(20, y);
      ctx.quadraticCurveTo(500, y + curve * 20, 980, y);
      ctx.stroke();
    }

    // Outer horizon border ellipse
    ctx.strokeStyle = 'rgba(0, 255, 136, 0.08)';
    ctx.beginPath();
    ctx.ellipse(500, 250, 480, 235, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  drawHotspotAura(ctx, t) {
    ctx.save();
    // Southern Europe / Mediterranean Hotspot (centered around x: 520, y: 160)
    const hx = 525;
    const hy = 160;
    const pulse = 1 + Math.sin(t * 4) * 0.15;

    const grad = ctx.createRadialGradient(hx, hy, 10, hx, hy, 140 * pulse);
    grad.addColorStop(0, 'rgba(255, 20, 60, 0.45)');
    grad.addColorStop(0.35, 'rgba(255, 50, 80, 0.22)');
    grad.addColorStop(0.7, 'rgba(255, 70, 40, 0.08)');
    grad.addColorStop(1, 'transparent');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(hx, hy, 130 * pulse, 65 * pulse, 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Additional mini hotspot in East Asia
    const gradAsia = ctx.createRadialGradient(800, 180, 5, 800, 180, 80);
    gradAsia.addColorStop(0, 'rgba(255, 50, 100, 0.2)');
    gradAsia.addColorStop(1, 'transparent');
    ctx.fillStyle = gradAsia;
    ctx.beginPath();
    ctx.arc(800, 180, 80, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  drawWorldDots(ctx, t) {
    ctx.save();

    const dotRadius = 1.35;
    const hotspotX = 525, hotspotY = 160;

    for (let i = 0; i < this.dots.length; i++) {
      const [nx, ny] = this.dots[i];

      // Check distance from Mediterranean Hotspot
      const distToHotspot = Math.hypot(nx - hotspotX, (ny - hotspotY) * 1.8);

      if (distToHotspot < 65) {
        // Red Hotspot Landmass Dots!
        ctx.fillStyle = distToHotspot < 35 ? '#ff2a55' : '#ff5577';
        ctx.shadowColor = '#ff2255';
        ctx.shadowBlur = 4;
      } else {
        // Green Cyber Matrix Dots
        // Subtle organic breathing on random dots
        const flicker = (Math.sin(i * 1.37 + t * 2) + 1) * 0.15;
        ctx.fillStyle = `rgba(0, 255, 136, ${0.65 + flicker})`;
        ctx.shadowColor = '#00ff88';
        ctx.shadowBlur = 1;
      }

      ctx.beginPath();
      ctx.arc(nx, ny, dotRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  drawNetworkMesh(ctx, t) {
    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(0, 255, 136, 0.22)';
    ctx.shadowColor = '#00ff88';
    ctx.shadowBlur = 3;

    for (const [id1, id2] of this.networkEdges) {
      const h1 = this.hubs.find(h => h.id === id1);
      const h2 = this.hubs.find(h => h.id === id2);
      if (!h1 || !h2) continue;

      ctx.beginPath();
      ctx.moveTo(h1.x, h1.y);
      ctx.lineTo(h2.x, h2.y);
      ctx.stroke();
    }

    ctx.restore();
  }

  drawAttackVectors(ctx, t) {
    ctx.save();

    for (const v of this.vectors) {
      if (this.activeFilter !== 'all' && v.type.toLowerCase() !== this.activeFilter.toLowerCase()) {
        continue;
      }

      const isRed = v.color.includes('ff') || v.color.includes('255');

      // 1. Draw Arced Trajectory (Ghost Path)
      ctx.beginPath();
      ctx.moveTo(v.from.x, v.from.y);
      ctx.quadraticCurveTo(v.cpX, v.cpY, v.to.x, v.to.y);
      ctx.strokeStyle = isRed ? 'rgba(255, 51, 102, 0.25)' : 'rgba(0, 255, 136, 0.25)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // 2. Draw Traveling Laser Energy Packet / Comets
      for (const pulse of v.pulses) {
        const p = pulse.progress;
        if (p < 0 || p > 1) continue;

        // Quadratic Bezier Formula: B(t) = (1-t)^2 P0 + 2(1-t)t P1 + t^2 P2
        const inv = 1 - p;
        const px = inv * inv * v.from.x + 2 * inv * p * v.cpX + p * p * v.to.x;
        const py = inv * inv * v.from.y + 2 * inv * p * v.cpY + p * p * v.to.y;

        // Comet Head
        ctx.beginPath();
        ctx.arc(px, py, pulse.size, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = v.color;
        ctx.shadowBlur = 12;
        ctx.fill();

        // Trailing glow halo
        ctx.beginPath();
        ctx.arc(px, py, pulse.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = v.color;
        ctx.shadowBlur = 16;
        ctx.fill();
      }
    }

    ctx.restore();
  }

  drawImpacts(ctx) {
    ctx.save();
    for (const imp of this.impacts) {
      ctx.beginPath();
      ctx.arc(imp.x, imp.y, imp.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 51, 102, ${imp.alpha})`;
      ctx.lineWidth = 1.8;
      ctx.shadowColor = imp.color || '#ff3366';
      ctx.shadowBlur = 8;
      ctx.stroke();
    }
    ctx.restore();
  }

  drawHubs(ctx, t) {
    ctx.save();

    for (const hub of this.hubs) {
      const isHovered = this.hoveredHub && this.hoveredHub.id === hub.id;
      const isHot = hub.isHotspot || hub.threat === 'CRITICAL';
      const mainColor = isHot ? '#ff3366' : '#00ff88';

      // Outer Pulsing Ring
      const pulse = (Math.sin(t * 4 + hub.x) + 1) * 0.5;
      const ringRadius = 5 + pulse * 6;

      ctx.beginPath();
      ctx.arc(hub.x, hub.y, ringRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${isHot ? '255, 51, 102' : '0, 255, 136'}, ${0.4 - pulse * 0.25})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Core Hub Dot
      ctx.beginPath();
      ctx.arc(hub.x, hub.y, isHovered ? 4.5 : 3, 0, Math.PI * 2);
      ctx.fillStyle = isHovered ? '#ffffff' : mainColor;
      ctx.shadowColor = mainColor;
      ctx.shadowBlur = isHovered ? 16 : 8;
      ctx.fill();

      // Subtle City Label
      ctx.font = '500 7.5px "Space Grotesk", sans-serif';
      ctx.fillStyle = isHovered ? '#ffffff' : 'rgba(255, 255, 255, 0.65)';
      ctx.fillText(hub.name.split(' ')[0], hub.x + 6, hub.y + 3);
    }

    ctx.restore();
  }

  drawAlertBadges(ctx, t) {
    ctx.save();

    // Render 3-4 active red cyber alert callout boxes (matching user screenshot)
    const alertList = [
      { text: '[DDOS: 840 Gbps]', x: 260, y: 220, color: '#ff3366', targetX: 260, targetY: 170 },
      { text: '[MALWARE C2 INTERCEPT]', x: 440, y: 155, color: '#ff3366', targetX: 475, targetY: 160 },
      { text: '[ZERO-DAY: CVE-2026]', x: 210, y: 280, color: '#ff2255', targetX: 175, targetY: 180 },
      { text: '[BOTNET CLUSTER 4]', x: 620, y: 300, color: '#ff4466', targetX: 630, targetY: 205 },
      { text: '[BIOTHREAT ALERT]', x: 840, y: 245, color: '#ff3366', targetX: 880, targetY: 170 }
    ];

    for (const badge of alertList) {
      // Connecting leader line
      ctx.beginPath();
      ctx.moveTo(badge.x, badge.y);
      ctx.lineTo(badge.targetX, badge.targetY);
      ctx.strokeStyle = 'rgba(255, 51, 102, 0.4)';
      ctx.lineWidth = 0.8;
      ctx.setLineDash([2, 2]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Box dimensions
      ctx.font = '700 8px monospace';
      const textWidth = ctx.measureText(badge.text).width;
      const bw = textWidth + 12;
      const bh = 15;
      const bx = badge.x - bw / 2;
      const by = badge.y - bh / 2;

      // Glow Box
      ctx.fillStyle = 'rgba(10, 0, 4, 0.88)';
      ctx.fillRect(bx, by, bw, bh);

      ctx.strokeStyle = badge.color;
      ctx.lineWidth = 1;
      ctx.shadowColor = badge.color;
      ctx.shadowBlur = 6;
      ctx.strokeRect(bx, by, bw, bh);

      // Box text
      ctx.fillStyle = badge.color;
      ctx.fillText(badge.text, bx + 6, by + 10.5);
    }

    ctx.restore();
  }
}
