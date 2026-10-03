/**
 * BioSearch — Catalog Page Controller (models.html)
 * Controls the interactive 3D stage, model card selection, real-time search, and category filtering.
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { MODELS_DATA } from './config/models-data.js';

// ─── 3D Stage Setup ──────────────────────────────────────────────────────────
const canvas = document.getElementById('stage-canvas');
const container = canvas.parentElement;

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(container.clientWidth, container.clientHeight);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  container.clientWidth / container.clientHeight,
  0.1,
  1000
);
camera.position.set(0, 4, 22);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 6;
controls.maxDistance = 50;
controls.target.set(0, 0, 0);

// Lighting
const ambient = new THREE.AmbientLight(0xffffff, 0.75);
scene.add(ambient);

const light1 = new THREE.DirectionalLight(0x00f0ff, 1.8);
light1.position.set(12, 16, 12);
scene.add(light1);

const light2 = new THREE.DirectionalLight(0xa855f7, 1.4);
light2.position.set(-12, -10, -12);
scene.add(light2);

// ─── Procedural Model Builders for Stage ─────────────────────────────────────
function buildStageModel(id) {
  const group = new THREE.Group();

  if (id === 'crispr-cas9') {
    // Cas9 lobes
    for (let h = 0; h < 5; h++) {
      const angle = (h / 5) * Math.PI * 2;
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(Math.cos(angle) * 3.8, -3.5, Math.sin(angle) * 3.8),
        new THREE.Vector3(Math.cos(angle + 0.3) * 4.6, 0, Math.sin(angle + 0.3) * 4.6),
        new THREE.Vector3(Math.cos(angle + 0.8) * 3.8, 3.5, Math.sin(angle + 0.8) * 3.8),
      ]);
      const geo = new THREE.TubeGeometry(curve, 24, 0.4, 8, false);
      const mat = new THREE.MeshPhysicalMaterial({ color: 0x00f0ff, roughness: 0.25, metalness: 0.2 });
      group.add(new THREE.Mesh(geo, mat));
    }
    // Clamped DNA double strand
    for (let s = 0; s < 2; s++) {
      const pts = [];
      for (let t = -4.5; t <= 4.5; t += 0.5) {
        pts.push(new THREE.Vector3(Math.sin(t * 1.3 + s * Math.PI) * 1.4, t * 1.1, Math.cos(t * 1.3 + s * Math.PI) * 1.4));
      }
      const curve = new THREE.CatmullRomCurve3(pts);
      const geo = new THREE.TubeGeometry(curve, 32, 0.3, 8, false);
      const mat = new THREE.MeshPhysicalMaterial({ color: 0x10b981, roughness: 0.2 });
      group.add(new THREE.Mesh(geo, mat));
    }
  } else if (id === 'spike-protein') {
    // Trimer
    for (let t = 0; t < 3; t++) {
      const angle = (t / 3) * Math.PI * 2;
      const pts = [
        new THREE.Vector3(Math.cos(angle) * 0.9, -5.5, Math.sin(angle) * 0.9),
        new THREE.Vector3(Math.cos(angle + 0.3) * 1.6, 0, Math.sin(angle + 0.3) * 1.6),
        new THREE.Vector3(Math.cos(angle - 0.2) * 3.2, 5.0, Math.sin(angle - 0.2) * 3.2),
      ];
      const curve = new THREE.CatmullRomCurve3(pts);
      const geo = new THREE.TubeGeometry(curve, 24, 0.45, 8, false);
      const mat = new THREE.MeshPhysicalMaterial({ color: [0xf43f5e, 0xa855f7, 0x00f0ff][t], roughness: 0.3 });
      group.add(new THREE.Mesh(geo, mat));
    }
  } else if (id === 'dna-helix') {
    const totalH = 13;
    const pts1 = [], pts2 = [];
    for (let y = -totalH/2; y <= totalH/2; y += 0.4) {
      const a = (y / totalH) * Math.PI * 2 * 2.5;
      pts1.push(new THREE.Vector3(Math.cos(a) * 2.3, y, Math.sin(a) * 2.3));
      pts2.push(new THREE.Vector3(Math.cos(a + Math.PI) * 2.3, y, Math.sin(a + Math.PI) * 2.3));
      if (Math.round(y * 10) % 8 === 0) {
        const rungGeo = new THREE.CylinderGeometry(0.12, 0.12, 4.6, 6);
        const rungMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.3 });
        const rung = new THREE.Mesh(rungGeo, rungMat);
        rung.position.set(0, y, 0);
        rung.rotation.z = Math.PI / 2;
        rung.rotation.y = -a;
        group.add(rung);
      }
    }
    const c1 = new THREE.CatmullRomCurve3(pts1);
    const c2 = new THREE.CatmullRomCurve3(pts2);
    group.add(new THREE.Mesh(new THREE.TubeGeometry(c1, 40, 0.35, 8, false), new THREE.MeshPhysicalMaterial({ color: 0x10b981, roughness: 0.25 })));
    group.add(new THREE.Mesh(new THREE.TubeGeometry(c2, 40, 0.35, 8, false), new THREE.MeshPhysicalMaterial({ color: 0x06b6d4, roughness: 0.25 })));
  } else if (id === 'hemoglobin') {
    const offs = [[-2.2, -1.8, -1.2], [2.2, -1.8, 1.2], [-1.8, 2.0, 1.2], [1.8, 2.0, -1.2]];
    const colors = [0x8b5cf6, 0x00f0ff, 0xec4899, 0x38bdf8];
    offs.forEach((off, i) => {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(off[0]-1, off[1]-1.2, off[2]),
        new THREE.Vector3(off[0], off[1], off[2]+1.2),
        new THREE.Vector3(off[0]+1, off[1]+1.2, off[2])
      ]);
      const geo = new THREE.TubeGeometry(curve, 20, 0.45, 8, false);
      const mat = new THREE.MeshPhysicalMaterial({ color: colors[i], roughness: 0.3 });
      group.add(new THREE.Mesh(geo, mat));

      // Heme center
      const heme = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.15, 10), new THREE.MeshPhysicalMaterial({ color: 0xff2222, metalness: 0.8 }));
      heme.position.set(off[0], off[1], off[2]);
      group.add(heme);
    });
  } else {
    // AlphaFold / Ribosome generic representation
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(Math.cos(a) * 2.8, -4, Math.sin(a) * 2.8),
        new THREE.Vector3(Math.cos(a + 0.4) * 3.4, 0, Math.sin(a + 0.4) * 3.4),
        new THREE.Vector3(Math.cos(a) * 2.8, 4, Math.sin(a) * 2.8)
      ]);
      const geo = new THREE.TubeGeometry(curve, 24, 0.4, 8, false);
      const mat = new THREE.MeshPhysicalMaterial({ color: [0x38bdf8, 0x8b5cf6, 0x00f0ff, 0x10b981, 0xf43f5e, 0xf59e0b][i], roughness: 0.3 });
      group.add(new THREE.Mesh(geo, mat));
    }
  }

  return group;
}

let currentStageGroup = null;
let currentSelectedId = 'crispr-cas9';
let isAutoSpin = true;

function loadStageModel(modelId) {
  currentSelectedId = modelId;
  const meta = MODELS_DATA.find(m => m.id === modelId) || MODELS_DATA[0];

  if (currentStageGroup) {
    scene.remove(currentStageGroup);
    currentStageGroup.traverse(c => {
      if (c.geometry) c.geometry.dispose();
      if (c.material) c.material.dispose();
    });
  }

  currentStageGroup = buildStageModel(modelId);
  scene.add(currentStageGroup);

  // Update HUD
  const nameEl = document.getElementById('stage-model-name');
  const pdbEl  = document.getElementById('stage-model-pdb');
  const linkEl = document.getElementById('stage-open-viewer-btn');

  if (nameEl) nameEl.textContent = meta.name;
  if (pdbEl)  pdbEl.textContent  = `PDB: ${meta.pdbId} · Resolution: ${meta.resolution} · ${meta.categoryLabel}`;
  if (linkEl) linkEl.href        = `model-viewer.html?model=${meta.id}`;

  // Update card active states
  document.querySelectorAll('.catalog-card').forEach(card => {
    card.classList.toggle('active-card', card.dataset.id === modelId);
  });
}

// ─── Interaction Handlers ────────────────────────────────────────────────────
function setupCatalog() {
  // Check URL param on page load (e.g. models.html?model=spike-protein)
  const urlParams = new URLSearchParams(window.location.search);
  const paramModel = urlParams.get('model') || urlParams.get('q');
  const match = MODELS_DATA.find(m => m.id === paramModel || m.name.toLowerCase().includes((paramModel||'').toLowerCase()));
  const initialId = match ? match.id : 'crispr-cas9';

  loadStageModel(initialId);

  // Clicking cards in grid
  document.querySelectorAll('.catalog-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.id;
      loadStageModel(id);

      // Smooth scroll up to stage if clicked from bottom
      const stageWrapper = document.querySelector('.catalog-stage-wrapper');
      if (stageWrapper && window.scrollY > stageWrapper.offsetTop + 100) {
        stageWrapper.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Spin toggle
  const spinBtn = document.getElementById('stage-btn-spin');
  if (spinBtn) {
    spinBtn.addEventListener('click', () => {
      isAutoSpin = !isAutoSpin;
      spinBtn.style.color = isAutoSpin ? 'var(--cyan)' : '#fff';
    });
  }

  // Reset view
  const resetBtn = document.getElementById('stage-btn-reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      camera.position.set(0, 4, 22);
      controls.target.set(0, 0, 0);
      controls.update();
    });
  }

  // Real-time search filter
  const searchInput = document.getElementById('catalog-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', e => {
      const q = e.target.value.toLowerCase().trim();
      document.querySelectorAll('.catalog-card').forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(q) ? 'flex' : 'none';
      });
    });
  }

  // Category filter tabs
  document.querySelectorAll('.catalog-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.catalog-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;
      document.querySelectorAll('.catalog-card').forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// ─── Render Loop ─────────────────────────────────────────────────────────────
function animate() {
  requestAnimationFrame(animate);
  controls.update();

  if (isAutoSpin && currentStageGroup) {
    currentStageGroup.rotation.y += 0.007;
  }

  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  if (!container) return;
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});

setupCatalog();
animate();
