/**
 * BioSearch — Simplified Threat Map Section Preview
 * Features a minimalist world map with 5 connected global hubs and 4-5 smoothly moving pulse dots,
 * providing a lightweight teaser that leads to the dedicated Threat Map portal.
 */

import { WORLD_DOTS } from './config/world-dots-data.js';

export class ThreatMapPreview {
  constructor(canvasId = 'threat-preview-canvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.dots = WORLD_DOTS; // 3,028 land dots rendered softly in the background

    this.mapWidth = 1000;
    this.mapHeight = 500;
    this.lastTime = performance.now();

    // Exactly 5 Major Global Nodes
    this.nodes = [
      { id: 'sf', name: 'Silicon Valley', x: 180, y: 170, color: '#00ff88' },
      { id: 'nyc', name: 'New York', x: 270, y: 160, color: '#00e5ff' },
      { id: 'lon', name: 'London', x: 490, y: 130, color: '#8b5cf6' },
      { id: 'sin', name: 'Singapore', x: 770, y: 275, color: '#00ff88' },
      { id: 'tyo', name: 'Tokyo', x: 870, y: 170, color: '#ff3366' }
    ];

    // Connection Paths between the 5 nodes
    this.paths = [
      { from: this.nodes[0], to: this.nodes[1] }, // SF -> NYC
      { from: this.nodes[1], to: this.nodes[2] }, // NYC -> London
      { from: this.nodes[2], to: this.nodes[3] }, // London -> Singapore
      { from: this.nodes[3], to: this.nodes[4] }, // Singapore -> Tokyo
      { from: this.nodes[4], to: this.nodes[0] }  // Tokyo -> SF (trans-Pacific)
    ];

    // 5 Smoothly Moving Pulse Dots
    this.movingDots = [
      { pathIndex: 0, progress: 0.1, speed: 0.28, color: '#00ff88', size: 4 },
      { pathIndex: 1, progress: 0.4, speed: 0.32, color: '#00e5ff', size: 4.5 },
      { pathIndex: 2, progress: 0.7, speed: 0.25, color: '#ff3366', size: 4 },
      { pathIndex: 3, progress: 0.2, speed: 0.35, color: '#a855f7', size: 4 },
      { pathIndex: 4, progress: 0.6, speed: 0.30, color: '#00ff88', size: 4.5 }
    ];

    // Expanding ripples when dots hit nodes
    this.ripples = [];

    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Click canvas to navigate to the standalone threat-map website
    this.canvas.addEventListener('click', () => {
      window.location.href = 'threat-map/index.html';
    });

    this.startLoop();
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

  startLoop() {
    const loop = (time) => {
      requestAnimationFrame(loop);
      const dt = Math.min((time - this.lastTime) / 1000, 0.08);
      this.lastTime = time;

      this.update(dt);
      this.render(time / 1000);
    };
    requestAnimationFrame(loop);
  }

  update(dt) {
    // Update the 5 moving dots
    for (const dot of this.movingDots) {
      dot.progress += dot.speed * dt;
      if (dot.progress >= 1) {
        dot.progress = 0;
        const currentPath = this.paths[dot.pathIndex];
        // Trigger ripple at destination node
        this.ripples.push({
          x: currentPath.to.x,
          y: currentPath.to.y,
          radius: 3,
          maxRadius: 24,
          alpha: 1,
          color: dot.color
        });
        // Move to next path in sequence
        dot.pathIndex = (dot.pathIndex + 1) % this.paths.length;
      }
    }

    // Update ripples
    for (let i = this.ripples.length - 1; i >= 0; i--) {
      const rip = this.ripples[i];
      rip.radius += 30 * dt;
      rip.alpha -= 1.6 * dt;
      if (rip.alpha <= 0 || rip.radius >= rip.maxRadius) {
        this.ripples.splice(i, 1);
      }
    }
  }

  render(t) {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    // Dark clear
    ctx.fillStyle = '#02060b';
    ctx.fillRect(0, 0, w, h);

    const scaleX = w / this.mapWidth;
    const scaleY = h / this.mapHeight;

    ctx.save();
    ctx.scale(scaleX, scaleY);

    // 1. Subtle background grid & curved meridian
    this.drawBackgroundGrid(ctx);

    // 2. Soft World Continent Dots
    this.drawWorldDots(ctx);

    // 3. Connection Lines between the 5 nodes
    this.drawConnectionLines(ctx);

    // 4. Expanding Ripples
    this.drawRipples(ctx);

    // 5. The 5 Major Hubs
    this.drawNodes(ctx, t);

    // 6. The 4-5 Moving Pulse Dots
    this.drawMovingDots(ctx);

    ctx.restore();
  }

  drawBackgroundGrid(ctx) {
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 255, 136, 0.04)';
    ctx.lineWidth = 1;

    for (let x = 150; x < 1000; x += 150) {
      ctx.beginPath();
      ctx.moveTo(x, 20);
      ctx.lineTo(x, 480);
      ctx.stroke();
    }
    for (let y = 80; y <= 420; y += 80) {
      ctx.beginPath();
      ctx.moveTo(20, y);
      ctx.quadraticCurveTo(500, y + (y - 250) * 0.06 * 20, 980, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawWorldDots(ctx) {
    ctx.save();
    ctx.fillStyle = 'rgba(0, 255, 136, 0.28)';

    for (let i = 0; i < this.dots.length; i++) {
      const [nx, ny] = this.dots[i];
      ctx.beginPath();
      ctx.arc(nx, ny, 1.1, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  drawConnectionLines(ctx) {
    ctx.save();
    ctx.lineWidth = 1.4;

    for (const path of this.paths) {
      ctx.beginPath();
      ctx.moveTo(path.from.x, path.from.y);

      // Trans-Pacific line: arch high over top or curve gracefully
      if (path.from.id === 'tyo' && path.to.id === 'sf') {
        ctx.bezierCurveTo(950, 60, 100, 60, path.to.x, path.to.y);
      } else {
        const midX = (path.from.x + path.to.x) / 2;
        const midY = (path.from.y + path.to.y) / 2 - 30;
        ctx.quadraticCurveTo(midX, midY, path.to.x, path.to.y);
      }

      ctx.strokeStyle = 'rgba(0, 255, 136, 0.2)';
      ctx.stroke();
    }
    ctx.restore();
  }

  drawRipples(ctx) {
    ctx.save();
    for (const rip of this.ripples) {
      ctx.beginPath();
      ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 255, 136, ${rip.alpha})`;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = rip.color;
      ctx.shadowBlur = 8;
      ctx.stroke();
    }
    ctx.restore();
  }

  drawNodes(ctx, t) {
    ctx.save();

    for (const node of this.nodes) {
      const pulse = (Math.sin(t * 3 + node.x) + 1) * 0.5;

      // Outer ring
      ctx.beginPath();
      ctx.arc(node.x, node.y, 6 + pulse * 6, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 255, 136, ${0.4 - pulse * 0.25})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Core dot
      ctx.beginPath();
      ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = node.color;
      ctx.shadowBlur = 12;
      ctx.fill();

      // City label
      ctx.font = '600 9px "Space Grotesk", sans-serif';
      ctx.fillStyle = '#e2e8f0';
      ctx.fillText(node.name, node.x + 8, node.y + 3);
    }
    ctx.restore();
  }

  drawMovingDots(ctx) {
    ctx.save();

    for (const dot of this.movingDots) {
      const path = this.paths[dot.pathIndex];
      const p = dot.progress;

      let px, py;
      if (path.from.id === 'tyo' && path.to.id === 'sf') {
        // Cubic bezier for trans-pacific
        const inv = 1 - p;
        const p0 = { x: path.from.x, y: path.from.y };
        const p1 = { x: 950, y: 60 };
        const p2 = { x: 100, y: 60 };
        const p3 = { x: path.to.x, y: path.to.y };

        px = inv**3 * p0.x + 3 * inv**2 * p * p1.x + 3 * inv * p**2 * p2.x + p**3 * p3.x;
        py = inv**3 * p0.y + 3 * inv**2 * p * p1.y + 3 * inv * p**2 * p2.y + p**3 * p3.y;
      } else {
        // Quadratic bezier
        const midX = (path.from.x + path.to.x) / 2;
        const midY = (path.from.y + path.to.y) / 2 - 30;
        const inv = 1 - p;

        px = inv * inv * path.from.x + 2 * inv * p * midX + p * p * path.to.x;
        py = inv * inv * path.from.y + 2 * inv * p * midY + p * p * path.to.y;
      }

      // Glowing pulse dot head
      ctx.beginPath();
      ctx.arc(px, py, dot.size, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = dot.color;
      ctx.shadowBlur = 14;
      ctx.fill();

      // Outer glow
      ctx.beginPath();
      ctx.arc(px, py, dot.size * 1.8, 0, Math.PI * 2);
      ctx.fillStyle = dot.color;
      ctx.shadowBlur = 18;
      ctx.fill();
    }
    ctx.restore();
  }
}
