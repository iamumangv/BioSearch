/**
 * BioSearch — Three.js Texture Generators
 * Procedural Canvas Textures for Bioluminescent Glow and Research Preprints
 */

import * as THREE from 'three';

const randI = (a, b) => Math.floor(Math.random() * (b - a) + a);

/**
 * Creates a high-dynamic-range bioluminescent particle glow texture
 */
export function createParticleGlowTexture() {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 128;
  const ctx = c.getContext('2d');

  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0,   'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.18, 'rgba(0, 240, 255, 0.95)');
  grad.addColorStop(0.42, 'rgba(124, 58, 237, 0.55)');
  grad.addColorStop(0.75, 'rgba(124, 58, 237, 0.12)');
  grad.addColorStop(1,   'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);

  const tex = new THREE.CanvasTexture(c);
  tex.generateMipmaps = false;
  tex.minFilter = THREE.LinearFilter;
  return tex;
}

/**
 * Creates a larger halo glow texture for major biological hub nodes
 */
export function createHubGlowTexture() {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 128;
  const ctx = c.getContext('2d');

  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0,   'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.2, 'rgba(236, 72, 153, 0.95)');
  grad.addColorStop(0.5, 'rgba(139, 92, 246, 0.6)');
  grad.addColorStop(0.8, 'rgba(0, 240, 255, 0.15)');
  grad.addColorStop(1,   'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);

  const tex = new THREE.CanvasTexture(c);
  tex.generateMipmaps = false;
  tex.minFilter = THREE.LinearFilter;
  return tex;
}

/**
 * Procedural scientific paper texture generator
 */
export function makePaperTexture(title, authors, topic) {
  const W = 512, H = 700;
  const c  = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');

  // Deep metallic gradient background
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0,   '#080e28');
  grad.addColorStop(0.5, '#0b163d');
  grad.addColorStop(1,   '#06091e');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Outer neon border
  ctx.strokeStyle = 'rgba(0,240,255,0.55)';
  ctx.lineWidth = 4;
  ctx.strokeRect(8, 8, W - 16, H - 16);

  // Inner faint border
  ctx.strokeStyle = 'rgba(139,92,246,0.35)';
  ctx.lineWidth = 1;
  ctx.strokeRect(16, 16, W - 32, H - 32);

  // Header banner
  const hGrad = ctx.createLinearGradient(0, 0, W, 0);
  hGrad.addColorStop(0, 'rgba(0,240,255,0.22)');
  hGrad.addColorStop(1, 'rgba(139,92,246,0.22)');
  ctx.fillStyle = hGrad;
  ctx.fillRect(0, 0, W, 84);

  // Tag
  ctx.font = 'bold 16px monospace';
  ctx.fillStyle = '#00f0ff';
  ctx.fillText('BIOSEARCH · ' + (topic || 'PEER REVIEWED'), 30, 36);

  // Title
  ctx.font = 'bold 28px Arial';
  ctx.fillStyle = '#ffffff';
  const words = title.split(' ');
  let line = '', lineY = 112;
  for (const w of words) {
    const test = line + w + ' ';
    if (ctx.measureText(test).width > W - 60 && line !== '') {
      ctx.fillText(line.trim(), 30, lineY);
      line  = w + ' ';
      lineY += 36;
    } else { line = test; }
  }
  ctx.fillText(line.trim(), 30, lineY);
  lineY += 40;

  // Divider
  const divGrad = ctx.createLinearGradient(30, 0, W - 30, 0);
  divGrad.addColorStop(0, 'rgba(0,240,255,0.85)');
  divGrad.addColorStop(1, 'rgba(139,92,246,0.85)');
  ctx.strokeStyle = divGrad;
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(30, lineY); ctx.lineTo(W - 30, lineY); ctx.stroke();
  lineY += 24;

  // Authors
  ctx.font = '19px Arial';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(authors, 30, lineY);
  lineY += 38;

  // Abstract label
  ctx.font = 'bold 15px monospace';
  ctx.fillStyle = '#a855f7';
  ctx.fillText('ABSTRACT & METHODOLOGY', 30, lineY);
  lineY += 26;

  // Abstract lines
  ctx.font = '15px Arial';
  ctx.fillStyle = 'rgba(203,213,225,0.8)';
  const abstractLines = [
    'Investigation of molecular dynamics and spatial',
    'gene interactions across eukaryotic transcriptomes.',
    'Identified 64 conserved loci linking cellular pathways',
    'with metabolic synthesis and immune evasion.',
  ];
  for (const l of abstractLines) {
    ctx.fillText(l, 30, lineY);
    lineY += 24;
  }
  lineY += 24;

  // Keyword tags
  const tags = ['GENOMICS', 'CRISPR-CAS9', 'TRANSCRIPTOME', 'GRAPH-AI'];
  ctx.font = 'bold 13px monospace';
  let tagX = 30;
  for (const t of tags) {
    const tw = ctx.measureText(t).width + 18;
    ctx.fillStyle = 'rgba(0,240,255,0.12)';
    ctx.strokeStyle = 'rgba(0,240,255,0.45)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(tagX, lineY, tw, 24, 4);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#00f0ff';
    ctx.fillText(t, tagX + 9, lineY + 16);
    tagX += tw + 10;
  }
  lineY += 50;

  // Simulated chart
  const bars = [0.4, 0.75, 0.5, 0.92, 0.65, 0.85, 0.4];
  const bW = 38, bGap = 16, bBase = H - 60;
  for (let i = 0; i < bars.length; i++) {
    const bH = bars[i] * 90;
    const bX = 30 + i * (bW + bGap);
    const bGrad = ctx.createLinearGradient(0, bBase - bH, 0, bBase);
    bGrad.addColorStop(0, 'rgba(0,240,255,0.75)');
    bGrad.addColorStop(1, 'rgba(139,92,246,0.75)');
    ctx.fillStyle = bGrad;
    ctx.fillRect(bX, bBase - bH, bW, bH);
  }

  // Footer DOI
  ctx.font = '13px monospace';
  ctx.fillStyle = 'rgba(148,163,184,0.6)';
  ctx.fillText('DOI: 10.1038/s41586-026-0' + randI(100, 999), 30, H - 24);

  return new THREE.CanvasTexture(c);
}
