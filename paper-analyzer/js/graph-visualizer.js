/**
 * BioSearch PaperLens - Interactive Paper Knowledge Graph Visualizer
 * High-performance force-directed canvas graph with particle telemetry,
 * category filtering, drag physics, zoom/pan controls, and node inspector.
 */

class PaperGraphVisualizer {
  constructor(canvasId, containerId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.container = document.getElementById(containerId);

    this.nodes = [];
    this.links = [];
    this.particles = [];
    this.selectedNode = null;
    this.hoveredNode = null;
    this.activeFilter = 'all';

    // Camera transform
    this.scale = 1;
    this.panX = 0;
    this.panY = 0;
    this.isDragging = false;
    this.isPanning = false;
    this.dragNode = null;
    this.lastMouseX = 0;
    this.lastMouseY = 0;

    // Visual theme palette
    this.colors = {
      paper: { fill: '#00f0ff', stroke: '#38bdf8', glow: 'rgba(0, 240, 255, 0.45)', text: '#ffffff' },
      method: { fill: '#3b82f6', stroke: '#60a5fa', glow: 'rgba(59, 130, 246, 0.35)', text: '#eff6ff' },
      foundation: { fill: '#a855f7', stroke: '#c084fc', glow: 'rgba(168, 85, 247, 0.35)', text: '#f3e8ff' },
      entity: { fill: '#10b981', stroke: '#34d399', glow: 'rgba(16, 185, 129, 0.35)', text: '#ecfdf5' },
      benchmark: { fill: '#f59e0b', stroke: '#fbbf24', glow: 'rgba(245, 158, 11, 0.35)', text: '#fffbeb' },
      comparison: { fill: '#ec4899', stroke: '#f472b6', glow: 'rgba(236, 72, 153, 0.35)', text: '#fdf2f8' }
    };

    this.initEvents();
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.animate();
  }

  resize() {
    if (!this.canvas || !this.container) return;
    const rect = this.container.getBoundingClientRect();
    this.width = rect.width || 800;
    this.height = Math.max(rect.height, 560);
    this.canvas.width = this.width * window.devicePixelRatio;
    this.canvas.height = this.height * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  loadGraph(graphData) {
    if (!graphData || !graphData.nodes) return;

    const centerX = this.width / 2;
    const centerY = this.height / 2;

    // Deep copy nodes and links
    this.nodes = graphData.nodes.map((n, i) => {
      // Position nodes radially or randomly around center
      const angle = (i / graphData.nodes.length) * Math.PI * 2;
      const radius = n.group === 'paper' ? 0 : 140 + (i % 3) * 60;
      return {
        ...n,
        x: n.group === 'paper' ? centerX : centerX + Math.cos(angle) * radius,
        y: n.group === 'paper' ? centerY : centerY + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        radius: n.radius || 18
      };
    });

    const nodeMap = new Map(this.nodes.map(n => [n.id, n]));

    this.links = graphData.links.map(l => ({
      ...l,
      source: nodeMap.get(l.source) || l.source,
      target: nodeMap.get(l.target) || l.target
    })).filter(l => l.source && l.target && typeof l.source === 'object' && typeof l.target === 'object');

    // Reset particles
    this.particles = [];
    for (let i = 0; i < this.links.length * 3; i++) {
      const link = this.links[i % this.links.length];
      this.particles.push({
        link: link,
        progress: Math.random(),
        speed: 0.003 + Math.random() * 0.004,
        size: 2 + Math.random() * 2
      });
    }

    // Reset view
    this.scale = 1;
    this.panX = 0;
    this.panY = 0;
    this.selectedNode = this.nodes.find(n => n.group === 'paper') || this.nodes[0] || null;
    this.updateInspector(this.selectedNode);
  }

  setFilter(filterGroup) {
    this.activeFilter = filterGroup;
  }

  initEvents() {
    this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    window.addEventListener('mouseup', () => this.onMouseUp());
    this.canvas.addEventListener('wheel', (e) => this.onWheel(e), { passive: false });

    // Touch support
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        this.startInteraction(touch.clientX - rect.left, touch.clientY - rect.top, e);
      }
    }, { passive: false });

    this.canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        this.moveInteraction(touch.clientX - rect.left, touch.clientY - rect.top);
      }
    }, { passive: false });

    this.canvas.addEventListener('touchend', () => this.onMouseUp());
  }

  getCanvasCoords(e) {
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const worldX = (mouseX - this.panX) / this.scale;
    const worldY = (mouseY - this.panY) / this.scale;
    return { mouseX, mouseY, worldX, worldY };
  }

  findNodeAt(worldX, worldY) {
    for (let i = this.nodes.length - 1; i >= 0; i--) {
      const n = this.nodes[i];
      if (this.activeFilter !== 'all' && n.group !== this.activeFilter && n.group !== 'paper') continue;
      const dx = worldX - n.x;
      const dy = worldY - n.y;
      if (dx * dx + dy * dy <= (n.radius + 6) * (n.radius + 6)) {
        return n;
      }
    }
    return null;
  }

  onMouseDown(e) {
    const coords = this.getCanvasCoords(e);
    this.startInteraction(coords.mouseX, coords.mouseY, e);
  }

  startInteraction(mouseX, mouseY, originalEvent) {
    const worldX = (mouseX - this.panX) / this.scale;
    const worldY = (mouseY - this.panY) / this.scale;
    const hitNode = this.findNodeAt(worldX, worldY);

    if (hitNode) {
      this.isDragging = true;
      this.dragNode = hitNode;
      this.selectedNode = hitNode;
      this.updateInspector(hitNode);
    } else {
      this.isPanning = true;
    }
    this.lastMouseX = mouseX;
    this.lastMouseY = mouseY;
    if (originalEvent && originalEvent.preventDefault) originalEvent.preventDefault();
  }

  onMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      if (!this.isDragging && !this.isPanning) {
        this.hoveredNode = null;
        return;
      }
    }
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    this.moveInteraction(mouseX, mouseY);
  }

  moveInteraction(mouseX, mouseY) {
    const worldX = (mouseX - this.panX) / this.scale;
    const worldY = (mouseY - this.panY) / this.scale;

    if (this.isDragging && this.dragNode) {
      this.dragNode.x = worldX;
      this.dragNode.y = worldY;
      this.dragNode.vx = 0;
      this.dragNode.vy = 0;
    } else if (this.isPanning) {
      this.panX += mouseX - this.lastMouseX;
      this.panY += mouseY - this.lastMouseY;
    } else {
      this.hoveredNode = this.findNodeAt(worldX, worldY);
      this.canvas.style.cursor = this.hoveredNode ? 'pointer' : 'grab';
    }

    this.lastMouseX = mouseX;
    this.lastMouseY = mouseY;
  }

  onMouseUp() {
    this.isDragging = false;
    this.dragNode = null;
    this.isPanning = false;
    this.canvas.style.cursor = 'default';
  }

  onWheel(e) {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.89;
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const newScale = Math.max(0.4, Math.min(3.0, this.scale * zoomFactor));
    this.panX = mouseX - (mouseX - this.panX) * (newScale / this.scale);
    this.panY = mouseY - (mouseY - this.panY) * (newScale / this.scale);
    this.scale = newScale;
  }

  resetView() {
    this.scale = 1;
    this.panX = 0;
    this.panY = 0;
  }

  zoomIn() {
    const newScale = Math.min(3.0, this.scale * 1.25);
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    this.panX = centerX - (centerX - this.panX) * (newScale / this.scale);
    this.panY = centerY - (centerY - this.panY) * (newScale / this.scale);
    this.scale = newScale;
  }

  zoomOut() {
    const newScale = Math.max(0.4, this.scale * 0.8);
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    this.panX = centerX - (centerX - this.panX) * (newScale / this.scale);
    this.panY = centerY - (centerY - this.panY) * (newScale / this.scale);
    this.scale = newScale;
  }

  simulate() {
    if (this.nodes.length === 0) return;

    const kRepel = 2400;
    const kLink = 0.04;
    const targetDist = 140;
    const damping = 0.84;
    const centerAttract = 0.003;
    const centerX = this.width / 2;
    const centerY = this.height / 2;

    // 1. Repulsion between all nodes
    for (let i = 0; i < this.nodes.length; i++) {
      const n1 = this.nodes[i];
      for (let j = i + 1; j < this.nodes.length; j++) {
        const n2 = this.nodes[j];
        let dx = n2.x - n1.x;
        let dy = n2.y - n1.y;
        let distSq = dx * dx + dy * dy + 0.1;
        let dist = Math.sqrt(distSq);
        let force = kRepel / distSq;
        let fx = (dx / dist) * force;
        let fy = (dy / dist) * force;

        n1.vx -= fx;
        n1.vy -= fy;
        n2.vx += fx;
        n2.vy += fy;
      }

      // Gravitate toward center
      n1.vx += (centerX - n1.x) * centerAttract;
      n1.vy += (centerY - n1.y) * centerAttract;
    }

    // 2. Spring attraction along links
    for (const link of this.links) {
      const s = link.source;
      const t = link.target;
      let dx = t.x - s.x;
      let dy = t.y - s.y;
      let dist = Math.sqrt(dx * dx + dy * dy) || 1;
      let displacement = dist - targetDist;
      let fx = (dx / dist) * displacement * kLink;
      let fy = (dy / dist) * displacement * kLink;

      s.vx += fx;
      s.vy += fy;
      t.vx -= fx;
      t.vy -= fy;
    }

    // 3. Update positions
    for (const n of this.nodes) {
      if (this.isDragging && n === this.dragNode) continue;
      // Fixed center paper node
      if (n.group === 'paper') {
        n.vx *= 0.5;
        n.vy *= 0.5;
        n.x += (centerX - n.x) * 0.05;
        n.y += (centerY - n.y) * 0.05;
        continue;
      }
      n.vx *= damping;
      n.vy *= damping;
      n.x += n.vx;
      n.y += n.vy;
    }

    // 4. Update particles
    for (const p of this.particles) {
      p.progress += p.speed;
      if (p.progress >= 1) p.progress = 0;
    }
  }

  animate() {
    this.simulate();
    this.render();
    requestAnimationFrame(() => this.animate());
  }

  render() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    ctx.save();
    ctx.translate(this.panX, this.panY);
    ctx.scale(this.scale, this.scale);

    // Draw background subtle grid dots
    this.renderBackgroundGrid(ctx);

    // Draw links
    for (const link of this.links) {
      const isConnected = this.selectedNode && 
        (link.source.id === this.selectedNode.id || link.target.id === this.selectedNode.id);
      const isFilteredOut = this.activeFilter !== 'all' && 
        (link.source.group !== this.activeFilter && link.source.group !== 'paper') &&
        (link.target.group !== this.activeFilter && link.target.group !== 'paper');

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(link.source.x, link.source.y);
      ctx.lineTo(link.target.x, link.target.y);

      if (isFilteredOut) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.lineWidth = 1;
      } else if (isConnected) {
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.75)';
        ctx.lineWidth = 2.4;
      } else {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
        ctx.lineWidth = 1.2;
      }
      ctx.stroke();

      // Link label on hover / connected
      if (isConnected && link.label) {
        const midX = (link.source.x + link.target.x) / 2;
        const midY = (link.source.y + link.target.y) / 2;
        ctx.font = '10px Inter, sans-serif';
        ctx.fillStyle = '#94a3b8';
        ctx.textAlign = 'center';
        ctx.fillText(link.label, midX, midY - 6);
      }
      ctx.restore();
    }

    // Draw animated energy particles along links
    for (const p of this.particles) {
      const s = p.link.source;
      const t = p.link.target;
      const isFilteredOut = this.activeFilter !== 'all' && 
        (s.group !== this.activeFilter && s.group !== 'paper') &&
        (t.group !== this.activeFilter && t.group !== 'paper');
      if (isFilteredOut) continue;

      const px = s.x + (t.x - s.x) * p.progress;
      const py = s.y + (t.y - s.y) * p.progress;

      ctx.save();
      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fillStyle = (this.selectedNode && (s.id === this.selectedNode.id || t.id === this.selectedNode.id))
        ? '#00f0ff'
        : 'rgba(139, 92, 246, 0.6)';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.restore();
    }

    // Draw nodes
    for (const node of this.nodes) {
      const isPaper = node.group === 'paper';
      const isSelected = this.selectedNode && this.selectedNode.id === node.id;
      const isHovered = this.hoveredNode && this.hoveredNode.id === node.id;
      const isFiltered = this.activeFilter !== 'all' && node.group !== this.activeFilter && !isPaper;
      const style = this.colors[node.group] || this.colors.method;

      ctx.save();

      if (isFiltered) {
        ctx.globalAlpha = 0.2;
      }

      // Outer glow for selected/hovered/paper
      if (isSelected || isHovered || isPaper) {
        ctx.beginPath();
        const pulse = isPaper ? Math.sin(Date.now() * 0.003) * 4 : 0;
        ctx.arc(node.x, node.y, node.radius + (isSelected ? 10 : 6) + pulse, 0, Math.PI * 2);
        ctx.fillStyle = style.glow;
        ctx.fill();

        ctx.strokeStyle = style.stroke;
        ctx.lineWidth = isSelected ? 2.5 : 1.5;
        ctx.stroke();
      }

      // Node Body
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = style.fill;
      ctx.shadowColor = style.stroke;
      ctx.shadowBlur = isSelected ? 16 : 8;
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = isSelected ? 2.5 : 1.2;
      ctx.stroke();

      // Node Label
      ctx.font = isPaper ? 'bold 13px Inter, sans-serif' : '11px Inter, sans-serif';
      ctx.fillStyle = style.text;
      ctx.textAlign = 'center';
      ctx.shadowBlur = 4;
      ctx.shadowColor = '#000000';
      ctx.fillText(node.label, node.x, node.y + node.radius + 15);

      ctx.restore();
    }

    ctx.restore();
  }

  renderBackgroundGrid(ctx) {
    const gridSize = 40;
    const startX = -this.panX / this.scale - 200;
    const endX = (this.width - this.panX) / this.scale + 200;
    const startY = -this.panY / this.scale - 200;
    const endY = (this.height - this.panY) / this.scale + 200;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.035)';
    for (let x = Math.floor(startX / gridSize) * gridSize; x < endX; x += gridSize) {
      for (let y = Math.floor(startY / gridSize) * gridSize; y < endY; y += gridSize) {
        ctx.fillRect(x, y, 1.5, 1.5);
      }
    }
  }

  updateInspector(node) {
    const elTitle = document.getElementById('inspector-node-title');
    const elGroup = document.getElementById('inspector-node-group');
    const elInfo = document.getElementById('inspector-node-info');
    const elEdges = document.getElementById('inspector-node-edges');

    if (!elTitle || !elGroup || !elInfo) return;

    if (!node) {
      elTitle.innerText = 'Select a node';
      elGroup.innerText = 'Topology Inspector';
      elInfo.innerText = 'Click any entity, paper, or method in the graph to inspect structural relationships and telemetry.';
      if (elEdges) elEdges.innerHTML = '';
      return;
    }

    const groupNames = {
      paper: 'Primary Publication',
      method: 'Architecture & Method',
      foundation: 'Foundational Paper / Framework',
      entity: 'Target Entity / Assembly',
      benchmark: 'Benchmark & Validation',
      comparison: 'Competitor / Baseline'
    };

    elTitle.innerText = node.label;
    elGroup.innerText = groupNames[node.group] || node.group.toUpperCase();
    elInfo.innerText = node.info || 'Central node in the paper lineage graph.';

    if (elEdges) {
      const connectedLinks = this.links.filter(
        l => l.source.id === node.id || l.target.id === node.id
      );

      if (connectedLinks.length === 0) {
        elEdges.innerHTML = '<div class="inspector-edge-item">No direct edges detected</div>';
      } else {
        elEdges.innerHTML = connectedLinks.map(l => {
          const isSource = l.source.id === node.id;
          const otherNode = isSource ? l.target : l.source;
          const dirIcon = isSource ? '→' : '←';
          return `
            <div class="inspector-edge-item" onclick="window.paperGraphVisualizer.selectNodeById('${otherNode.id}')">
              <span class="edge-dir">${dirIcon}</span>
              <span class="edge-type">${l.type || 'relates'}</span>
              <span class="edge-target">${otherNode.label}</span>
            </div>
          `;
        }).join('');
      }
    }
  }

  selectNodeById(nodeId) {
    const found = this.nodes.find(n => n.id === nodeId);
    if (found) {
      this.selectedNode = found;
      this.updateInspector(found);
    }
  }
}

window.PaperGraphVisualizer = PaperGraphVisualizer;
