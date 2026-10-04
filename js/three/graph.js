/**
 * BioSearch — Biological Knowledge Graph System
 * Renders major biological hubs, lattice mesh filaments, and traveling action potential pulses.
 */

import * as THREE from 'three';
import { createParticleGlowTexture, createHubGlowTexture } from './textures.js';

const PI = Math.PI;
const rand  = (a, b) => Math.random() * (b - a) + a;
const randI = (a, b) => Math.floor(rand(a, b));
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const lerp  = (a, b, t) => a + (b - a) * t;

export class BiologicalKnowledgeGraph {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    const particleGlowTex = createParticleGlowTexture();
    const hubGlowTex      = createHubGlowTexture();

    // ── Make 3D graph bigger and more immersive ──
    this.group.scale.set(1.4, 1.4, 1.4);

    // ── 1. Major Biological Hubs (Core Central Orange Cluster + Outer Hubs) ──
    this.hubCount = 20;
    this.hubPositions = new Float32Array(this.hubCount * 3);
    this.hubColors    = new Float32Array(this.hubCount * 3);
    this.hubSizes     = new Float32Array(this.hubCount);

    const orangePalette = [
      new THREE.Color(0xff6a00), // Vibrant amber orange
      new THREE.Color(0xff7a00), // Core orange
      new THREE.Color(0xff9500), // Bright gold orange
      new THREE.Color(0xff5500), // Deep ember orange
      new THREE.Color(0xffaa22), // Warm light orange
    ];

    const outerPalette = [
      new THREE.Color(0x00f0ff), // Cyan
      new THREE.Color(0xa855f7), // Violet
      new THREE.Color(0xf43f5e), // Pink
      new THREE.Color(0x38bdf8), // Sky Blue
    ];

    for (let i = 0; i < this.hubCount; i++) {
      const isCenter = i < 8; // First 8 hubs form the bright orange center cluster
      const phi   = Math.acos(-1 + (2 * i) / this.hubCount);
      const theta = Math.sqrt(this.hubCount * PI) * phi;
      const radius = isCenter ? rand(0.8, 3.2) : rand(4.5, 7.5);

      this.hubPositions[i * 3]     = radius * Math.cos(theta) * Math.sin(phi);
      this.hubPositions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi) * 0.75;
      this.hubPositions[i * 3 + 2] = radius * Math.cos(phi) * 0.65;

      const c = isCenter ? orangePalette[i % orangePalette.length] : outerPalette[i % outerPalette.length];
      this.hubColors[i * 3]     = c.r;
      this.hubColors[i * 3 + 1] = c.g;
      this.hubColors[i * 3 + 2] = c.b;

      this.hubSizes[i] = isCenter ? rand(0.75, 1.1) : rand(0.55, 0.85);
    }

    const hubGeo = new THREE.BufferGeometry();
    hubGeo.setAttribute('position', new THREE.BufferAttribute(this.hubPositions, 3));
    hubGeo.setAttribute('color',    new THREE.BufferAttribute(this.hubColors, 3));

    this.hubMat = new THREE.PointsMaterial({
      size: 0.85,
      map: hubGlowTex,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    this.hubPoints = new THREE.Points(hubGeo, this.hubMat);
    this.group.add(this.hubPoints);

    // ── 2. Lattice Mesh Nodes (140 interconnected nodes with glowing orange core) ──
    this.latticeCount = 140;
    this.latticePositions = new Float32Array(this.latticeCount * 3);
    this.latticeColors    = new Float32Array(this.latticeCount * 3);
    this.baseTargets      = [];

    for (let i = 0; i < this.latticeCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * PI;
      const phi   = Math.acos(2.0 * v - 1.0);
      const r     = rand(1.2, 8.5);

      const tx = r * Math.sin(phi) * Math.cos(theta);
      const ty = r * Math.sin(phi) * Math.sin(theta) * 0.7;
      const tz = r * Math.cos(phi) * 0.6;

      this.baseTargets.push(new THREE.Vector3(tx, ty, tz));

      this.latticePositions[i * 3]     = tx;
      this.latticePositions[i * 3 + 1] = ty;
      this.latticePositions[i * 3 + 2] = tz;

      // Inner nodes closer to center (r < 4.2) glow rich orange
      const dist = Math.sqrt(tx * tx + ty * ty + tz * tz);
      let c;
      if (dist < 4.0) {
        c = orangePalette[randI(0, orangePalette.length)];
      } else {
        c = outerPalette[randI(0, outerPalette.length)];
      }

      this.latticeColors[i * 3]     = c.r;
      this.latticeColors[i * 3 + 1] = c.g;
      this.latticeColors[i * 3 + 2] = c.b;
    }

    const latGeo = new THREE.BufferGeometry();
    latGeo.setAttribute('position', new THREE.BufferAttribute(this.latticePositions, 3));
    latGeo.setAttribute('color',    new THREE.BufferAttribute(this.latticeColors, 3));

    this.latticeMat = new THREE.PointsMaterial({
      size: 0.38,
      map: particleGlowTex,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    this.latticePoints = new THREE.Points(latGeo, this.latticeMat);
    this.group.add(this.latticePoints);

    // ── 3. Interconnecting Mesh Filaments (Line Segments) ──
    this.maxLines = 260;
    this.linePositions = new Float32Array(this.maxLines * 6);
    this.lineColors    = new Float32Array(this.maxLines * 6);
    this.activeEdges   = [];

    let edgeIdx = 0;
    const maxDist = 3.6;

    const allCoords = [];
    for (let i = 0; i < this.hubCount; i++) {
      allCoords.push(new THREE.Vector3(
        this.hubPositions[i * 3],
        this.hubPositions[i * 3 + 1],
        this.hubPositions[i * 3 + 2]
      ));
    }
    for (let i = 0; i < this.latticeCount; i++) {
      allCoords.push(this.baseTargets[i]);
    }

    for (let i = 0; i < allCoords.length && edgeIdx < this.maxLines; i++) {
      for (let j = i + 1; j < allCoords.length && edgeIdx < this.maxLines; j++) {
        const d = allCoords[i].distanceTo(allCoords[j]);
        if (d < maxDist) {
          const a = allCoords[i];
          const b = allCoords[j];

          this.linePositions[edgeIdx * 6]     = a.x;
          this.linePositions[edgeIdx * 6 + 1] = a.y;
          this.linePositions[edgeIdx * 6 + 2] = a.z;
          this.linePositions[edgeIdx * 6 + 3] = b.x;
          this.linePositions[edgeIdx * 6 + 4] = b.y;
          this.linePositions[edgeIdx * 6 + 5] = b.z;

          const midDist = (a.length() + b.length()) * 0.5;
          if (midDist < 4.0) {
            // Warm orange/amber filaments in the center of the graph
            this.lineColors[edgeIdx * 6]     = 1.0;
            this.lineColors[edgeIdx * 6 + 1] = 0.48;
            this.lineColors[edgeIdx * 6 + 2] = 0.0;
            this.lineColors[edgeIdx * 6 + 3] = 1.0;
            this.lineColors[edgeIdx * 6 + 4] = 0.65;
            this.lineColors[edgeIdx * 6 + 5] = 0.15;
          } else {
            // Outer bioluminescent gradient edge
            this.lineColors[edgeIdx * 6]     = 0.0;
            this.lineColors[edgeIdx * 6 + 1] = 0.85;
            this.lineColors[edgeIdx * 6 + 2] = 1.0;
            this.lineColors[edgeIdx * 6 + 3] = 0.55;
            this.lineColors[edgeIdx * 6 + 4] = 0.23;
            this.lineColors[edgeIdx * 6 + 5] = 0.97;
          }

          this.activeEdges.push({ a, b });
          edgeIdx++;
        }
      }
    }

    this.edgeCount = edgeIdx;
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(this.linePositions, 3));
    lineGeo.setAttribute('color',    new THREE.BufferAttribute(this.lineColors, 3));

    this.lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.lineMesh = new THREE.LineSegments(lineGeo, this.lineMat);
    this.group.add(this.lineMesh);

    // ── 4. Action Potential Pulses (Data Energy Packets) ──
    this.pulseCount = 36;
    this.pulsePositions = new Float32Array(this.pulseCount * 3);
    this.pulseStates    = [];

    for (let p = 0; p < this.pulseCount; p++) {
      const edge = this.activeEdges[randI(0, this.activeEdges.length)];
      this.pulseStates.push({
        edge,
        progress: Math.random(),
        speed: rand(0.3, 0.7),
        direction: Math.random() > 0.5 ? 1 : -1,
      });
      this.pulsePositions[p * 3]     = edge.a.x;
      this.pulsePositions[p * 3 + 1] = edge.a.y;
      this.pulsePositions[p * 3 + 2] = edge.a.z;
    }

    const pulseGeo = new THREE.BufferGeometry();
    pulseGeo.setAttribute('position', new THREE.BufferAttribute(this.pulsePositions, 3));

    this.pulseMat = new THREE.PointsMaterial({
      size: 0.55,
      map: hubGlowTex,
      color: 0xff7a00, // Vibrant orange energy packets
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    this.pulsePoints = new THREE.Points(pulseGeo, this.pulseMat);
    this.group.add(this.pulsePoints);
  }

  update(scrollP, time, dt) {
    const graphFade = clamp((scrollP - 0.52) / 0.35, 0, 1);

    this.hubMat.opacity     = graphFade * 0.95;
    this.latticeMat.opacity = graphFade * 0.75;
    this.lineMat.opacity    = graphFade * 0.32;
    this.pulseMat.opacity   = graphFade * 0.85;

    // Respiration breathing
    this.hubMat.size = 0.58 + Math.sin(time * 2.5) * 0.08;

    // Slow rotation
    this.group.rotation.y = time * 0.09;
    this.group.rotation.x = Math.sin(time * 0.05) * 0.1;

    // Pulse movement
    if (graphFade > 0.1) {
      for (let p = 0; p < this.pulseCount; p++) {
        const ps = this.pulseStates[p];
        ps.progress += ps.speed * dt * ps.direction;

        if (ps.progress > 1.0) {
          ps.progress = 0;
          ps.edge = this.activeEdges[randI(0, this.activeEdges.length)];
        } else if (ps.progress < 0) {
          ps.progress = 1.0;
          ps.edge = this.activeEdges[randI(0, this.activeEdges.length)];
        }

        const ea = ps.edge.a;
        const eb = ps.edge.b;
        this.pulsePositions[p * 3]     = lerp(ea.x, eb.x, ps.progress);
        this.pulsePositions[p * 3 + 1] = lerp(ea.y, eb.y, ps.progress);
        this.pulsePositions[p * 3 + 2] = lerp(ea.z, eb.z, ps.progress);
      }
      this.pulsePoints.geometry.attributes.position.needsUpdate = true;
    }
  }
}
