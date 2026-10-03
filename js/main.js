/**
 * BioSearch — Main Application Entry Point
 * Orchestrates 3D scene, hovering papers, biological graph, scroll tracking, and UI.
 */

import * as THREE from 'three';
import { SceneManager } from './three/scene.js';
import { BiologicalKnowledgeGraph } from './three/graph.js';
import { HoveringPaper } from './three/paper.js';
import { PAPER_CONFIGS } from './config/papers-data.js';
import { ScrollController } from './scroll-controller.js';
import { initUI } from './ui.js';
import { ThreatMapPreview } from './threat-map-preview.js';

// ─── Initialize System Components ────────────────────────────────────────────
const canvas = document.getElementById('three-canvas');
const sceneManager = new SceneManager(canvas);

// Biological Knowledge Graph
const bioGraph = new BiologicalKnowledgeGraph(sceneManager.scene);

// Hovering Research Papers
const papers = PAPER_CONFIGS.map((cfg, i) => new HoveringPaper(cfg, i, sceneManager.scene));

// Scroll Controller
const scrollController = new ScrollController();

// UI Interactions
initUI(scrollController);

// Homepage Threat Map Preview (5 hubs, moving pulse dots)
const threatPreview = new ThreatMapPreview('threat-preview-canvas');

// ─── Animation Loop ──────────────────────────────────────────────────────────
const clock = new THREE.Clock();
let time = 0;

function animate() {
  requestAnimationFrame(animate);

  const dt = Math.min(clock.getDelta(), 0.05);
  time += dt;

  // Update scroll progression and HUD
  const scrollP = scrollController.update(dt);

  // Update scene camera, lights, and parallax
  sceneManager.update(time, scrollP);

  // Update 3D hovering papers
  for (const paper of papers) {
    paper.update(scrollP, time);
  }

  // Update biological knowledge graph & traveling action potential pulses
  bioGraph.update(scrollP, time, dt);

  // Render frame
  sceneManager.render();
}

animate();
