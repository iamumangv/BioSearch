/**
 * BioSearch — HoveringPaper Class
 * Handles paper hover, gravity drop, aerodynamic tumbling, and helical vortex dissolution.
 */

import * as THREE from 'three';
import { makePaperTexture, createParticleGlowTexture } from './textures.js';
import { PAPER_DIMENSIONS } from '../config/papers-data.js';

const PI = Math.PI;
const rand  = (a, b) => Math.random() * (b - a) + a;
const randI = (a, b) => Math.floor(rand(a, b));
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const lerp  = (a, b, t) => a + (b - a) * t;

export class HoveringPaper {
  constructor(cfg, index, scene) {
    this.cfg   = cfg;
    this.index = index;
    this.scene = scene;

    // Initial hover coordinates
    this.hoverX = cfg.hoverPos[0];
    this.hoverY = cfg.hoverPos[1];
    this.hoverZ = cfg.hoverPos[2];

    // Bottom destination coordinates
    this.bottomX = cfg.hoverPos[0] * 0.55 + rand(-1.2, 1.2);
    this.bottomY = rand(-8.2, -6.5);
    this.bottomZ = rand(-2, 2);

    // Staggered scroll timeline
    this.fallStart = 0.08 + index * 0.04;
    this.fallEnd   = this.fallStart + 0.32;

    const { width, height, depth } = PAPER_DIMENSIONS;

    // ── Paper Mesh ──
    const geo = new THREE.BoxGeometry(width, height, depth);
    const tex = makePaperTexture(cfg.title, cfg.authors, cfg.topic);

    this.frontMat = new THREE.MeshPhysicalMaterial({
      map: tex,
      roughness: 0.25,
      metalness: 0.15,
      transparent: true,
      opacity: 1,
    });
    this.backMat = new THREE.MeshPhysicalMaterial({
      color: 0x090f26,
      roughness: 0.4,
      transparent: true,
      opacity: 1,
    });
    this.edgeMat = new THREE.MeshPhysicalMaterial({
      color: 0x00f0ff,
      emissive: new THREE.Color(0x00f0ff),
      emissiveIntensity: 0.45,
      transparent: true,
      opacity: 1,
    });

    this.materials = [
      this.edgeMat, this.edgeMat, this.edgeMat, this.edgeMat,
      this.frontMat, this.backMat
    ];
    this.mesh = new THREE.Mesh(geo, this.materials);
    this.mesh.position.set(this.hoverX, this.hoverY, this.hoverZ);
    this.mesh.rotation.set(cfg.rot[0], cfg.rot[1], cfg.rot[2]);
    this.scene.add(this.mesh);

    // ── Glowing Dissolution Particles (130 particles per paper) ──
    this.numParticles = 130;
    this.particlePositions = new Float32Array(this.numParticles * 3);
    this.particleTargets   = new Float32Array(this.numParticles * 3);
    this.particleColors    = new Float32Array(this.numParticles * 3);
    this.vortexOffset      = [];

    const colors = [
      new THREE.Color(0x00f0ff),
      new THREE.Color(0xa855f7),
      new THREE.Color(0xf43f5e),
      new THREE.Color(0xffffff),
    ];

    for (let p = 0; p < this.numParticles; p++) {
      this.particlePositions[p * 3]     = this.bottomX + rand(-width / 2, width / 2);
      this.particlePositions[p * 3 + 1] = this.bottomY + rand(-height / 2, height / 2);
      this.particlePositions[p * 3 + 2] = this.bottomZ + rand(-0.2, 0.2);

      const theta = rand(0, PI * 2);
      const phi   = rand(0, PI);
      const r     = rand(4.0, 9.0);
      this.particleTargets[p * 3]     = r * Math.sin(phi) * Math.cos(theta);
      this.particleTargets[p * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.75;
      this.particleTargets[p * 3 + 2] = r * Math.cos(phi) * 0.65;

      const c = colors[randI(0, colors.length)];
      this.particleColors[p * 3]     = c.r;
      this.particleColors[p * 3 + 1] = c.g;
      this.particleColors[p * 3 + 2] = c.b;

      this.vortexOffset.push({
        phase: rand(0, PI * 2),
        radius: rand(1.5, 4.0),
      });
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(this.numParticles * 3), 3));
    pGeo.setAttribute('color',    new THREE.BufferAttribute(this.particleColors, 3));

    this.pMat = new THREE.PointsMaterial({
      size: 0.28,
      map: createParticleGlowTexture(),
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    this.particleSystem = new THREE.Points(pGeo, this.pMat);
    this.scene.add(this.particleSystem);
  }

  update(scrollP, time) {
    const i = this.index;

    if (scrollP <= this.fallStart) {
      // ── STATE 1: HOVERING AT THE TOP ──
      const floatY = Math.sin(time * 1.8 + i * 1.1) * 0.35;
      const floatX = Math.cos(time * 1.2 + i * 0.9) * 0.15;
      const rotZ   = Math.sin(time * 1.5 + i * 1.4) * 0.05;

      this.mesh.visible = true;
      this.mesh.position.set(
        this.hoverX + floatX,
        this.hoverY + floatY,
        this.hoverZ
      );
      this.mesh.rotation.set(
        this.cfg.rot[0] + Math.sin(time + i) * 0.05,
        this.cfg.rot[1] + Math.cos(time * 0.9 + i) * 0.05,
        this.cfg.rot[2] + rotZ
      );

      for (const m of this.materials) m.opacity = 1;
      this.pMat.opacity = 0;

    } else if (scrollP > this.fallStart && scrollP < this.fallEnd) {
      // ── STATE 2: CASCADING FALL ──
      const f = (scrollP - this.fallStart) / (this.fallEnd - this.fallStart);
      const easeFall = f * f;

      this.mesh.visible = true;
      this.mesh.position.x = lerp(this.hoverX, this.bottomX, f) + Math.sin(f * PI * 2 + i) * 0.4;
      this.mesh.position.y = lerp(this.hoverY, this.bottomY, easeFall);
      this.mesh.position.z = lerp(this.hoverZ, this.bottomZ, f);

      // Aerodynamic tumbling
      this.mesh.rotation.x = this.cfg.rot[0] + f * PI * 1.4;
      this.mesh.rotation.y = this.cfg.rot[1] + f * PI * 0.7;
      this.mesh.rotation.z = this.cfg.rot[2] + Math.sin(f * PI * 3) * 0.25;

      // Dissolution threshold
      const dissolveThreshold = 0.72;
      if (f > dissolveThreshold) {
        const d = (f - dissolveThreshold) / (1 - dissolveThreshold);
        for (const m of this.materials) m.opacity = 1 - d;
        this.pMat.opacity = d * 0.9;

        const pArr = this.particleSystem.geometry.attributes.position.array;
        for (let p = 0; p < this.numParticles; p++) {
          const vo = this.vortexOffset[p];
          const spiralAngle = vo.phase + d * PI * 3;
          const spiralR     = vo.radius * d;

          pArr[p * 3]     = this.bottomX + Math.cos(spiralAngle) * spiralR;
          pArr[p * 3 + 1] = this.bottomY + d * 3.0 + Math.sin(spiralAngle) * (spiralR * 0.4);
          pArr[p * 3 + 2] = this.bottomZ + Math.sin(spiralAngle) * spiralR;
        }
        this.particleSystem.geometry.attributes.position.needsUpdate = true;
      } else {
        for (const m of this.materials) m.opacity = 1;
        this.pMat.opacity = 0;
      }

    } else {
      // ── STATE 3: DISSOLVED PARTICLES WEAVING INTO GRAPH ──
      this.mesh.visible = false;
      for (const m of this.materials) m.opacity = 0;

      const graphP = clamp((scrollP - this.fallEnd) / (1.0 - this.fallEnd), 0, 1);
      this.pMat.opacity = 0.95;

      const pArr = this.particleSystem.geometry.attributes.position.array;
      for (let p = 0; p < this.numParticles; p++) {
        const bx = this.bottomX;
        const by = this.bottomY;
        const bz = this.bottomZ;

        const tx = this.particleTargets[p * 3];
        const ty = this.particleTargets[p * 3 + 1];
        const tz = this.particleTargets[p * 3 + 2];

        const vo = this.vortexOffset[p];
        const vortexAngle = vo.phase + (1 - graphP) * PI * 4;
        const vortexDist  = (1 - graphP) * vo.radius * 2;

        const curX = lerp(bx, tx, graphP) + Math.cos(vortexAngle) * vortexDist * 0.5;
        const curY = lerp(by, ty, graphP) + Math.sin(vortexAngle) * vortexDist * 0.3;
        const curZ = lerp(bz, tz, graphP) + Math.sin(time * 0.8 + p) * 0.05;

        pArr[p * 3]     = curX;
        pArr[p * 3 + 1] = curY;
        pArr[p * 3 + 2] = curZ;
      }
      this.particleSystem.geometry.attributes.position.needsUpdate = true;
      this.particleSystem.rotation.y = time * 0.09;
    }
  }
}
