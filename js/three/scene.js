/**
 * BioSearch — Three.js Scene Setup & Management
 */

import * as THREE from 'three';
import { createParticleGlowTexture } from './textures.js';

const rand = (a, b) => Math.random() * (b - a) + a;
const randI = (a, b) => Math.floor(rand(a, b));

export class SceneManager {
  constructor(canvasElement) {
    this.canvas = canvasElement;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // Scene
    this.scene = new THREE.Scene();

    // Camera (closer distance so the 3D graph appears bigger & more immersive)
    this.camera = new THREE.PerspectiveCamera(
      54,
      window.innerWidth / window.innerHeight,
      0.1,
      200
    );
    this.camera.position.set(0, 0, 13.8);

    // Mouse coordinates for parallax
    this.mouse = { x: 0, y: 0, tx: 0, ty: 0 };

    this._setupLights();
    this._setupAmbientParticles();
    this._setupEventListeners();
  }

  _setupLights() {
    this.ambientLight = new THREE.AmbientLight(0xfff5ea, 0.65);
    this.scene.add(this.ambientLight);

    // Radiant orange light right in the center of the graph
    this.centerAmberLight = new THREE.PointLight(0xff6a00, 5.5, 38);
    this.centerAmberLight.position.set(0, 0, 0);
    this.scene.add(this.centerAmberLight);

    // Warm ambient accent lights
    this.pointLight1 = new THREE.PointLight(0xff8c00, 4.0, 65);
    this.pointLight1.position.set(8, 6, 7);
    this.scene.add(this.pointLight1);

    this.pointLight2 = new THREE.PointLight(0x8b5cf6, 3.5, 50);
    this.pointLight2.position.set(-10, -6, 6);
    this.scene.add(this.pointLight2);

    this.pointLight3 = new THREE.PointLight(0x00f0ff, 3.0, 45);
    this.pointLight3.position.set(0, 4, 8);
    this.scene.add(this.pointLight3);
  }

  _setupAmbientParticles() {
    const AMBIENT_COUNT = 240;
    const ambGeo = new THREE.BufferGeometry();
    const ambPos = new Float32Array(AMBIENT_COUNT * 3);
    const ambCol = new Float32Array(AMBIENT_COUNT * 3);
    const ambPal = [
      new THREE.Color(0xff8c00), // Warm amber
      new THREE.Color(0xf59e0b), // Golden amber
      new THREE.Color(0x00f0ff), // Cyan
      new THREE.Color(0xa855f7)  // Violet
    ];

    for (let i = 0; i < AMBIENT_COUNT; i++) {
      ambPos[i * 3]     = rand(-26, 26);
      ambPos[i * 3 + 1] = rand(-18, 18);
      ambPos[i * 3 + 2] = rand(-14, 4);
      const c = ambPal[randI(0, ambPal.length)];
      ambCol[i * 3]     = c.r;
      ambCol[i * 3 + 1] = c.g;
      ambCol[i * 3 + 2] = c.b;
    }

    ambGeo.setAttribute('position', new THREE.BufferAttribute(ambPos, 3));
    ambGeo.setAttribute('color',    new THREE.BufferAttribute(ambCol, 3));

    const ambMat = new THREE.PointsMaterial({
      size: 0.12,
      map: createParticleGlowTexture(),
      vertexColors: true,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.ambientParticles = new THREE.Points(ambGeo, ambMat);
    this.scene.add(this.ambientParticles);
  }

  _setupEventListeners() {
    window.addEventListener('mousemove', e => {
      this.mouse.tx = (e.clientX / window.innerWidth  - 0.5) * 2;
      this.mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  update(time, scrollP) {
    // Ambient drift
    this.ambientParticles.rotation.y = time * 0.015;

    // Smooth mouse parallax
    this.mouse.x += (this.mouse.tx - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.ty - this.mouse.y) * 0.05;

    // Smooth camera elevation as scroll reaches graph & search
    const targetCamY = (scrollP > 0.6) ? -1.8 * Math.min(1, (scrollP - 0.6) / 0.4) : 0;
    const targetCamZ = (scrollP > 0.6) ? 13.8 + 1.5 * Math.min(1, (scrollP - 0.6) / 0.4) : 13.8;

    this.camera.position.x = this.mouse.x * 1.1;
    this.camera.position.y += (-this.mouse.y * 0.7 + targetCamY - this.camera.position.y) * 0.06;
    this.camera.position.z += (targetCamZ - this.camera.position.z) * 0.06;
    this.camera.lookAt(0, targetCamY * 0.5, 0);

    // Dynamic colored point lights
    this.pointLight1.position.x = Math.sin(time * 0.4) * 11;
    this.pointLight1.position.y = Math.cos(time * 0.3) * 7 + 2;
    this.pointLight2.position.x = Math.cos(time * 0.5) * 11;
    this.pointLight2.position.y = Math.sin(time * 0.4) * 7 - 4;
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
