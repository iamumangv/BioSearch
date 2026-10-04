/**
 * BioSearch — Main Entry Point (Background Update)
 *
 * Changes vs original main.js:
 *  - NO hovering research papers (HoveringPaper removed)
 *  - 3D BiologicalKnowledgeGraph is ALWAYS fully visible from load
 *  - Warm ambient lighting added to match the dark amber background
 *  - All original features (search, HealthMap, scroll, UI) fully intact
 */

import * as THREE from 'three';
import { SceneManager } from './three/scene.js';
import { BiologicalKnowledgeGraph } from './three/graph.js';
import { ScrollController } from './scroll-controller.js';
import { initUI } from './ui.js';
import { HealthMapPreview } from './healthmap-preview.js';

// ─── Initialize 3D Scene ──────────────────────────────────────────────────────
const canvas = document.getElementById('three-canvas');
const sceneManager = new SceneManager(canvas);

// Radiant amber light positioned directly in the heart of the 3D graph
const centerCoreLight = new THREE.PointLight(0xff6a00, 5.5, 45);
centerCoreLight.position.set(0, 0, 1);
sceneManager.scene.add(centerCoreLight);

const warmFill = new THREE.PointLight(0xff8c00, 2.8, 75);
warmFill.position.set(6, 4, 5);
sceneManager.scene.add(warmFill);

// Biological Knowledge Graph — always fully visible (no scroll trigger)
const bioGraph = new BiologicalKnowledgeGraph(sceneManager.scene);

// Patch: force graph visible at full opacity regardless of scroll position
const _originalUpdate = bioGraph.update.bind(bioGraph);
bioGraph.update = function(scrollP, time, dt) {
  _originalUpdate(scrollP, time, dt);
  // Override scroll-based fade — always show the graph
  this.hubMat.opacity     = 0.95;
  this.latticeMat.opacity = 0.78;
  this.lineMat.opacity    = 0.35;
  this.pulseMat.opacity   = 0.88;
};

// Scroll Controller (for camera parallax — original behaviour)
const scrollController = new ScrollController();

// UI Interactions (original — search, navbar, counter, pills, ripple, glow)
initUI(scrollController);

// Homepage HealthMap Outbreak Radar Preview
const healthmapPreview = new HealthMapPreview('healthmap-preview-canvas');

// ─── Animation Loop ───────────────────────────────────────────────────────────
const clock = new THREE.Clock();
let time = 0;

function animate() {
  requestAnimationFrame(animate);

  const dt = Math.min(clock.getDelta(), 0.05);
  time += dt;

  const scrollP = scrollController.update(dt);

  // Update scene (camera parallax, lights)
  sceneManager.update(time, scrollP);

  // Update biological knowledge graph & traveling pulses
  bioGraph.update(scrollP, time, dt);

  // Respiration pulse on central core light
  centerCoreLight.intensity = 5.2 + Math.sin(time * 2.2) * 1.0;

  // Warm fill light drifts slowly
  warmFill.position.x = Math.sin(time * 0.3) * 8;
  warmFill.position.y = Math.cos(time * 0.2) * 5 + 2;

  sceneManager.render();
}

animate();
