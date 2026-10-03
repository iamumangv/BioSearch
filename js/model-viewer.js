/**
 * BioSearch — Interactive 3D Model Viewer Engine
 * Three.js + OrbitControls + Procedural Molecular Geometries
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { MODELS_DATA } from './config/models-data.js';

// ─── Setup Scene, Camera, Renderer ───────────────────────────────────────────
const container = document.getElementById('viewer-canvas-container');
const canvas    = document.getElementById('viewer-canvas');

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  preserveDrawingBuffer: true
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x030511);

const camera = new THREE.PerspectiveCamera(
  45,
  container.clientWidth / container.clientHeight,
  0.1,
  1000
);
camera.position.set(0, 5, 26);

// OrbitControls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 6;
controls.maxDistance = 60;
controls.target.set(0, 0, 0);

// ─── Lighting Rig ────────────────────────────────────────────────────────────
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const dirLight1 = new THREE.DirectionalLight(0x00f0ff, 1.8);
dirLight1.position.set(15, 20, 15);
scene.add(dirLight1);

const dirLight2 = new THREE.DirectionalLight(0xa855f7, 1.5);
dirLight2.position.set(-15, -10, -15);
scene.add(dirLight2);

const dirLight3 = new THREE.DirectionalLight(0xffffff, 0.9);
dirLight3.position.set(0, -15, 15);
scene.add(dirLight3);

// ─── State Management ────────────────────────────────────────────────────────
let currentModelId = 'crispr-cas9';
let currentRepresentation = 'ribbon'; // ribbon | ball-stick | surface | atoms
let currentColorMode = 'chain';       // chain | structure | neon
let isAutoSpin = true;
let currentMolGroup = null;

// ─── Molecular Geometry Generators ───────────────────────────────────────────
function buildCrisprCas9(rep, colMode) {
  const group = new THREE.Group();

  // Color palettes
  const colA = colMode === 'structure' ? 0x00f0ff : (colMode === 'neon' ? 0x00f0ff : 0x00f0ff);
  const colB = colMode === 'structure' ? 0xa855f7 : (colMode === 'neon' ? 0x8b5cf6 : 0xa855f7);
  const colC = colMode === 'structure' ? 0xf43f5e : (colMode === 'neon' ? 0xec4899 : 0x10b981);

  if (rep === 'ribbon') {
    // Cas9 Rec Lobe Helices
    for (let h = 0; h < 6; h++) {
      const angle = (h / 6) * Math.PI * 2;
      const r = 4.2;
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(Math.cos(angle) * r, -4, Math.sin(angle) * r),
        new THREE.Vector3(Math.cos(angle + 0.3) * (r + 1), -1, Math.sin(angle + 0.3) * (r + 1)),
        new THREE.Vector3(Math.cos(angle + 0.7) * (r - 0.5), 2, Math.sin(angle + 0.7) * (r - 0.5)),
        new THREE.Vector3(Math.cos(angle + 1.1) * r, 5, Math.sin(angle + 1.1) * r),
      ]);
      const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.35, 8, false);
      const tubeMat = new THREE.MeshPhysicalMaterial({
        color: colA,
        roughness: 0.25,
        metalness: 0.2,
        clearcoat: 0.4
      });
      group.add(new THREE.Mesh(tubeGeo, tubeMat));
    }

    // NUC Lobe Beta Sheets & Loops
    for (let b = 0; b < 5; b++) {
      const offset = (b - 2) * 1.6;
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-3.5 + offset, -3, 2),
        new THREE.Vector3(-2.8 + offset, 0, 3.5),
        new THREE.Vector3(-3.2 + offset, 3.5, 2.2),
      ]);
      const tubeGeo = new THREE.TubeGeometry(curve, 24, 0.4, 8, false);
      const tubeMat = new THREE.MeshPhysicalMaterial({
        color: colB,
        roughness: 0.3,
        metalness: 0.1
      });
      group.add(new THREE.Mesh(tubeGeo, tubeMat));
    }

    // Clamped Target DNA Duplex (central double strand)
    for (let strand = 0; strand < 2; strand++) {
      const pts = [];
      const sOffset = strand * Math.PI;
      for (let t = -5; t <= 5; t += 0.5) {
        pts.push(new THREE.Vector3(
          Math.sin(t * 1.2 + sOffset) * 1.5,
          t * 1.2,
          Math.cos(t * 1.2 + sOffset) * 1.5
        ));
      }
      const curve = new THREE.CatmullRomCurve3(pts);
      const tubeGeo = new THREE.TubeGeometry(curve, 40, 0.28, 8, false);
      const tubeMat = new THREE.MeshPhysicalMaterial({
        color: colC,
        emissive: new THREE.Color(colC),
        emissiveIntensity: 0.3,
        roughness: 0.2
      });
      group.add(new THREE.Mesh(tubeGeo, tubeMat));
    }
  } else if (rep === 'ball-stick' || rep === 'atoms') {
    // Atom cluster
    const atomRadius = rep === 'atoms' ? 0.45 : 0.22;
    const atomGeo = new THREE.SphereGeometry(atomRadius, 12, 12);
    const atomCount = 380;

    for (let i = 0; i < atomCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * Math.PI * 2;
      const phi   = Math.acos(2 * v - 1);
      const r = Math.pow(Math.random(), 0.5) * 6.5;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta) * 0.85;
      const z = r * Math.cos(phi);

      const col = (x < -1) ? colA : ((x > 1) ? colB : colC);
      const mat = new THREE.MeshStandardMaterial({ color: col, roughness: 0.3 });
      const mesh = new THREE.Mesh(atomGeo, mat);
      mesh.position.set(x, y, z);
      group.add(mesh);

      // Bonds for ball & stick
      if (rep === 'ball-stick' && i % 3 === 0) {
        const bondGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.2, 6);
        const bondMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.5 });
        const bond = new THREE.Mesh(bondGeo, bondMat);
        bond.position.set(x + 0.4, y, z);
        bond.rotation.z = Math.PI / 3;
        group.add(bond);
      }
    }
  } else {
    // Molecular Surface representation
    const surfGeo = new THREE.IcosahedronGeometry(5.2, 3);
    const pos = surfGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vy = pos.getY(i);
      const vz = pos.getZ(i);
      const noise = Math.sin(vx * 1.5) * Math.cos(vy * 1.5) * 0.7;
      pos.setXYZ(i, vx + noise, vy + noise * 0.5, vz + noise);
    }
    surfGeo.computeVertexNormals();

    const surfMat = new THREE.MeshPhysicalMaterial({
      color: colA,
      roughness: 0.35,
      metalness: 0.1,
      transmission: 0.4,
      opacity: 0.85,
      transparent: true,
      wireframe: false
    });
    group.add(new THREE.Mesh(surfGeo, surfMat));
  }

  return group;
}

function buildSpikeProtein(rep, colMode) {
  const group = new THREE.Group();
  const colors = [0xf43f5e, 0x8b5cf6, 0x00f0ff];

  // Trimeric 3-fold symmetry
  for (let trimer = 0; trimer < 3; trimer++) {
    const tAngle = (trimer / 3) * Math.PI * 2;
    const col = colors[trimer % colors.length];

    if (rep === 'ribbon') {
      // Stalk coiled-coil
      const stalkPts = [
        new THREE.Vector3(Math.cos(tAngle) * 0.8, -6, Math.sin(tAngle) * 0.8),
        new THREE.Vector3(Math.cos(tAngle + 0.2) * 1.2, -2, Math.sin(tAngle + 0.2) * 1.2),
        new THREE.Vector3(Math.cos(tAngle + 0.4) * 1.8, 1, Math.sin(tAngle + 0.4) * 1.8),
      ];
      const stalkCurve = new THREE.CatmullRomCurve3(stalkPts);
      const stalkGeo = new THREE.TubeGeometry(stalkCurve, 20, 0.4, 8, false);
      const mat = new THREE.MeshPhysicalMaterial({ color: col, roughness: 0.3 });
      group.add(new THREE.Mesh(stalkGeo, mat));

      // Head / Receptor Binding Domain (RBD)
      const headPts = [
        new THREE.Vector3(Math.cos(tAngle + 0.4) * 1.8, 1, Math.sin(tAngle + 0.4) * 1.8),
        new THREE.Vector3(Math.cos(tAngle) * 3.5, 3.5, Math.sin(tAngle) * 3.5),
        new THREE.Vector3(Math.cos(tAngle - 0.2) * 2.8, 6.0, Math.sin(tAngle - 0.2) * 2.8),
      ];
      const headCurve = new THREE.CatmullRomCurve3(headPts);
      const headGeo = new THREE.TubeGeometry(headCurve, 20, 0.45, 8, false);
      group.add(new THREE.Mesh(headGeo, mat));
    } else {
      // Spherical atoms/surface for each protomer
      const count = rep === 'surface' ? 8 : 120;
      const radius = rep === 'surface' ? 1.6 : (rep === 'atoms' ? 0.45 : 0.24);
      const geo = new THREE.SphereGeometry(radius, 12, 12);
      const mat = new THREE.MeshStandardMaterial({
        color: col,
        roughness: 0.3,
        transparent: rep === 'surface',
        opacity: rep === 'surface' ? 0.75 : 1.0
      });

      for (let i = 0; i < count; i++) {
        const h = (i / count) * 11 - 5.5;
        const spread = (h + 6) * 0.35;
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(
          Math.cos(tAngle + i * 0.2) * (1.2 + spread),
          h,
          Math.sin(tAngle + i * 0.2) * (1.2 + spread)
        );
        group.add(mesh);
      }
    }
  }

  return group;
}

function buildDnaHelix(rep, colMode) {
  const group = new THREE.Group();
  const strand1Col = colMode === 'neon' ? 0x00f0ff : 0x10b981;
  const strand2Col = colMode === 'neon' ? 0xa855f7 : 0x06b6d4;

  const totalHeight = 14;
  const turns = 2.5;
  const radius = 2.4;

  const pts1 = [];
  const pts2 = [];

  for (let y = -totalHeight/2; y <= totalHeight/2; y += 0.4) {
    const angle = (y / totalHeight) * Math.PI * 2 * turns;
    const x1 = Math.cos(angle) * radius;
    const z1 = Math.sin(angle) * radius;
    const x2 = Math.cos(angle + Math.PI) * radius;
    const z2 = Math.sin(angle + Math.PI) * radius;

    pts1.push(new THREE.Vector3(x1, y, z1));
    pts2.push(new THREE.Vector3(x2, y, z2));

    // Base pair rungs
    if (Math.round(y * 10) % 8 === 0) {
      const rungGeo = new THREE.CylinderGeometry(0.12, 0.12, radius * 2, 8);
      const rungMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.3 });
      const rung = new THREE.Mesh(rungGeo, rungMat);
      rung.position.set(0, y, 0);
      rung.rotation.z = Math.PI / 2;
      rung.rotation.y = -angle;
      group.add(rung);
    }
  }

  const curve1 = new THREE.CatmullRomCurve3(pts1);
  const curve2 = new THREE.CatmullRomCurve3(pts2);

  const tubeThickness = rep === 'atoms' ? 0.6 : (rep === 'ball-stick' ? 0.22 : 0.38);

  const geo1 = new THREE.TubeGeometry(curve1, 60, tubeThickness, 10, false);
  const geo2 = new THREE.TubeGeometry(curve2, 60, tubeThickness, 10, false);

  const mat1 = new THREE.MeshPhysicalMaterial({ color: strand1Col, roughness: 0.25, metalness: 0.2 });
  const mat2 = new THREE.MeshPhysicalMaterial({ color: strand2Col, roughness: 0.25, metalness: 0.2 });

  group.add(new THREE.Mesh(geo1, mat1));
  group.add(new THREE.Mesh(geo2, mat2));

  return group;
}

function buildHemoglobin(rep, colMode) {
  const group = new THREE.Group();
  const chainColors = [0x8b5cf6, 0x00f0ff, 0xec4899, 0x38bdf8];

  // 4 subunits
  const offsets = [
    [-2.2, -2.0, -1.5],
    [ 2.2, -2.0,  1.5],
    [-2.0,  2.2,  1.5],
    [ 2.0,  2.2, -1.5]
  ];

  offsets.forEach((off, idx) => {
    const subGroup = new THREE.Group();
    const col = chainColors[idx % chainColors.length];

    if (rep === 'ribbon') {
      // Globin fold helices
      for (let h = 0; h < 4; h++) {
        const start = new THREE.Vector3(off[0] + (h-1.5)*1.1, off[1] - 1.5, off[2] + (h%2)*1.2);
        const mid   = new THREE.Vector3(off[0] + (h-1.5)*1.3, off[1], off[2] - (h%2)*1.2);
        const end   = new THREE.Vector3(off[0] + (h-1.5)*1.0, off[1] + 1.5, off[2] + (h%2)*1.0);
        const curve = new THREE.CatmullRomCurve3([start, mid, end]);
        const geo   = new THREE.TubeGeometry(curve, 18, 0.36, 8, false);
        const mat   = new THREE.MeshPhysicalMaterial({ color: col, roughness: 0.3 });
        subGroup.add(new THREE.Mesh(geo, mat));
      }
    } else {
      const atomCount = rep === 'surface' ? 5 : 70;
      const r = rep === 'surface' ? 1.4 : (rep === 'atoms' ? 0.42 : 0.2);
      const geo = new THREE.SphereGeometry(r, 10, 10);
      const mat = new THREE.MeshStandardMaterial({
        color: col,
        roughness: 0.3,
        transparent: rep === 'surface',
        opacity: rep === 'surface' ? 0.8 : 1.0
      });

      for (let i = 0; i < atomCount; i++) {
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(
          off[0] + (Math.random() - 0.5) * 3.0,
          off[1] + (Math.random() - 0.5) * 3.0,
          off[2] + (Math.random() - 0.5) * 3.0
        );
        subGroup.add(mesh);
      }
    }

    // Heme iron center disk
    const hemeGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.15, 12);
    const hemeMat = new THREE.MeshPhysicalMaterial({
      color: 0xff2222,
      emissive: 0x990000,
      metalness: 0.8,
      roughness: 0.2
    });
    const heme = new THREE.Mesh(hemeGeo, hemeMat);
    heme.position.set(off[0], off[1], off[2]);
    subGroup.add(heme);

    group.add(subGroup);
  });

  return group;
}

function buildGenericModel(modelId, rep, colMode) {
  if (modelId === 'crispr-cas9') return buildCrisprCas9(rep, colMode);
  if (modelId === 'spike-protein') return buildSpikeProtein(rep, colMode);
  if (modelId === 'dna-helix') return buildDnaHelix(rep, colMode);
  if (modelId === 'hemoglobin') return buildHemoglobin(rep, colMode);

  // Fallback / AlphaFold binder helical bundle
  const group = new THREE.Group();
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2;
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(Math.cos(angle) * 2.2, -4.5, Math.sin(angle) * 2.2),
      new THREE.Vector3(Math.cos(angle + 0.4) * 2.5, 0, Math.sin(angle + 0.4) * 2.5),
      new THREE.Vector3(Math.cos(angle) * 2.2, 4.5, Math.sin(angle) * 2.2)
    ]);
    const geo = new THREE.TubeGeometry(curve, 24, rep === 'atoms' ? 0.6 : 0.35, 8, false);
    const mat = new THREE.MeshPhysicalMaterial({
      color: [0x38bdf8, 0x8b5cf6, 0x00f0ff, 0x10b981, 0xf43f5e][i % 5],
      roughness: 0.3
    });
    group.add(new THREE.Mesh(geo, mat));
  }
  return group;
}

// ─── Model Loading & Switching ───────────────────────────────────────────────
function loadModel(modelId) {
  currentModelId = modelId;
  const meta = MODELS_DATA.find(m => m.id === modelId) || MODELS_DATA[0];

  // Remove existing model from scene
  if (currentMolGroup) {
    scene.remove(currentMolGroup);
    currentMolGroup.traverse(child => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
        else child.material.dispose();
      }
    });
  }

  // Build new model representation
  currentMolGroup = buildGenericModel(modelId, currentRepresentation, currentColorMode);
  scene.add(currentMolGroup);

  // Update UI Inspector with metadata
  updateInspectorUI(meta);

  // Update URL without reload
  const url = new URL(window.location);
  url.searchParams.set('model', modelId);
  window.history.replaceState({}, '', url);

  // Update dropdown selection
  const dropdown = document.getElementById('model-select');
  if (dropdown) dropdown.value = modelId;
}

function updateInspectorUI(meta) {
  const titleEl = document.getElementById('inspect-title');
  const subEl   = document.getElementById('inspect-sub');
  const tagEl   = document.getElementById('inspect-tag');
  const descEl  = document.getElementById('inspect-desc');
  const pdbEl   = document.getElementById('inspect-pdb');
  const weightEl= document.getElementById('inspect-weight');
  const resEl   = document.getElementById('inspect-res');
  const orgEl   = document.getElementById('inspect-org');
  const atomEl  = document.getElementById('inspect-atoms');
  const chainEl = document.getElementById('inspect-chains');
  const preprintsCountEl = document.getElementById('inspect-preprints-count');

  if (titleEl) titleEl.textContent = meta.name;
  if (subEl)   subEl.textContent   = meta.subtitle;
  if (tagEl)   tagEl.textContent   = meta.categoryLabel;
  if (descEl)  descEl.textContent  = meta.description;
  if (pdbEl)   pdbEl.textContent   = meta.pdbId;
  if (weightEl)weightEl.textContent= meta.weight;
  if (resEl)   resEl.textContent   = meta.resolution;
  if (orgEl)   orgEl.textContent   = meta.organism;
  if (atomEl)  atomEl.textContent  = meta.atoms;
  if (chainEl) chainEl.textContent = meta.chains;
  if (preprintsCountEl) preprintsCountEl.textContent = meta.preprintsCount;
}

// ─── Setup UI Controls & Event Handlers ──────────────────────────────────────
function setupUI() {
  // Read query params on load
  const urlParams = new URLSearchParams(window.location.search);
  const modelParam = urlParams.get('model') || urlParams.get('q') || 'crispr-cas9';
  const match = MODELS_DATA.find(m => m.id === modelParam || m.name.toLowerCase().includes(modelParam.toLowerCase()));
  const initialId = match ? match.id : 'crispr-cas9';

  // Model Dropdown
  const dropdown = document.getElementById('model-select');
  if (dropdown) {
    dropdown.innerHTML = '';
    MODELS_DATA.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m.id;
      opt.textContent = `${m.name} (${m.pdbId})`;
      dropdown.appendChild(opt);
    });
    dropdown.value = initialId;
    dropdown.addEventListener('change', e => loadModel(e.target.value));
  }

  // Representation buttons
  document.querySelectorAll('[data-rep]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-rep]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentRepresentation = btn.dataset.rep;
      loadModel(currentModelId);
    });
  });

  // Color mode buttons
  document.querySelectorAll('[data-color]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-color]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentColorMode = btn.dataset.color;
      loadModel(currentModelId);
    });
  });

  // Auto-Spin button
  const spinBtn = document.getElementById('btn-spin');
  if (spinBtn) {
    spinBtn.addEventListener('click', () => {
      isAutoSpin = !isAutoSpin;
      spinBtn.classList.toggle('active', isAutoSpin);
    });
  }

  // Reset View button
  const resetBtn = document.getElementById('btn-reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      camera.position.set(0, 5, 26);
      controls.target.set(0, 0, 0);
      controls.update();
    });
  }

  // Snapshot PNG export
  const snapshotBtn = document.getElementById('btn-snapshot');
  if (snapshotBtn) {
    snapshotBtn.addEventListener('click', () => {
      renderer.render(scene, camera);
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.download = `BioSearch-${currentModelId}.png`;
      a.href = dataUrl;
      a.click();
    });
  }

  // Sidebar toggle
  const toggleSidebarBtn = document.getElementById('btn-toggle-sidebar');
  const sidebar = document.getElementById('inspector-sidebar');
  if (toggleSidebarBtn && sidebar) {
    toggleSidebarBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      toggleSidebarBtn.classList.toggle('active');
    });
  }

  // Load initial model
  loadModel(initialId);
}

// ─── Render Animation Loop ───────────────────────────────────────────────────
function animate() {
  requestAnimationFrame(animate);

  controls.update();

  if (isAutoSpin && currentMolGroup) {
    currentMolGroup.rotation.y += 0.008;
  }

  renderer.render(scene, camera);
}

// ─── Resize Handler ──────────────────────────────────────────────────────────
window.addEventListener('resize', () => {
  if (!container) return;
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});

// Run initialization
setupUI();
animate();
