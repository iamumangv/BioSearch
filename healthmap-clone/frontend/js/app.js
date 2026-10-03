/**
 * EpiWatch — Global Disease Outbreak Monitor
 * Frontend Application Controller
 */

// Persisted HUD layout preferences
const UI_STATE_KEY = 'epiwatch.hud.v2';

// Matches the .panel-left / .panel-right breakpoint in style.css
const PHONE_QUERY = '(max-width: 720px)';

const UI_DEFAULTS = {
  sidebar: true,
  eventsPanel: true,
  statsBar: true,
  legend: false,
  chart: false
};

function loadUiState() {
  let saved = {};
  try {
    saved = JSON.parse(localStorage.getItem(UI_STATE_KEY) || '{}') || {};
  } catch (e) {
    saved = {};
  }
  return { ...UI_DEFAULTS, ...saved };
}

function saveUiState() {
  try {
    localStorage.setItem(UI_STATE_KEY, JSON.stringify(state.ui));
  } catch (e) {
    /* storage unavailable — layout simply won't persist */
  }
}

// Application State
const state = {
  events: [],
  filteredEvents: [],
  summary: null,
  map: null,
  clusterGroup: null,
  markersMap: new Map(), // id -> marker
  chart: null,
  selectedEventId: null,
  isClusteringEnabled: true,
  currentTileLayer: null,
  labelsLayer: null,
  currentBasemap: 'dark',
  ui: loadUiState()
};

// 100% Free Public Basemap Tile Providers (Zero API Key, Zero Watermark)
const BASEMAPS = {
  dark: {
    name: 'Dark Canvas',
    base: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    ref: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
    maxZoom: 16
  },
  satellite: {
    name: 'Satellite View',
    base: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    ref: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS',
    maxZoom: 17
  },
  street: {
    name: 'OpenStreetMap',
    base: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    ref: null,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
  }
};

// Severity color palette
const SEVERITY_COLORS = {
  critical: '#ff2244',
  high: '#ff7b00',
  medium: '#ffd700',
  low: '#00e676'
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  applyUiState();
  initMap();
  initEventListeners();
  setBtnActive('btnToggleClusters', state.isClusteringEnabled);
  loadData();
  // Auto-refresh every 2 minutes
  setInterval(loadData, 120000);
});

/* -------------------------------------------------------------
   Floating HUD — panel + disclosure state
   Every floating surface (filters, alert feed, metric strip) is
   toggled from the left rail and its state is remembered.
------------------------------------------------------------- */
const PANEL_IDS = ['sidebar', 'eventsPanel', 'statsBar'];

// <details> fires `toggle` asynchronously, so restoring the saved layout would
// otherwise look like user input and re-open panels the user had closed.
let restoringUi = false;

function applyUiState() {
  restoringUi = true;

  PANEL_IDS.forEach((id) => {
    const panel = document.getElementById(id);
    if (panel) panel.classList.toggle('is-hidden', !state.ui[id]);
    syncRailButton(id);
  });

  ['legendDetails', 'chartDetails'].forEach((id) => {
    const details = document.getElementById(id);
    if (details) details.open = !!state.ui[id.replace('Details', '')];
  });

  closeAppsMenu();

  // Release the guard once the queued toggle events have drained
  setTimeout(() => {
    restoringUi = false;
  }, 0);
}

function syncRailButton(panelId) {
  const btn = document.querySelector(`.rail-btn[data-panel="${panelId}"]`);
  if (!btn) return;
  btn.classList.toggle('is-active', !!state.ui[panelId]);
  btn.setAttribute('aria-pressed', state.ui[panelId] ? 'true' : 'false');
}

function togglePanel(panelId) {
  state.ui[panelId] = !state.ui[panelId];

  // On phones the panels become full-width sheets, so only one can be open.
  if (state.ui[panelId] && window.matchMedia(PHONE_QUERY).matches) {
    collapseOtherPanels(panelId);
  }

  const panel = document.getElementById(panelId);
  if (panel) panel.classList.toggle('is-hidden', !state.ui[panelId]);

  syncRailButton(panelId);
  saveUiState();
}

function collapseOtherPanels(exceptId) {
  ['sidebar', 'eventsPanel'].forEach((id) => {
    if (id === exceptId || !state.ui[id]) return;
    state.ui[id] = false;
    const el = document.getElementById(id);
    if (el) el.classList.add('is-hidden');
    syncRailButton(id);
  });
}

function enforcePhoneExclusivity() {
  if (!window.matchMedia(PHONE_QUERY).matches) return;
  if (!state.ui.sidebar || !state.ui.eventsPanel) return;
  collapseOtherPanels('sidebar');
  saveUiState();
}

function ensurePanelOpen(panelId) {
  if (state.ui[panelId]) return;
  togglePanel(panelId);
}

/* -------------------------------------------------------------
   Overflow menu (cross-project navigation)
------------------------------------------------------------- */
function toggleAppsMenu(event) {
  if (event) event.stopPropagation();
  const menu = document.getElementById('appsMenu');
  const btn = document.getElementById('btnAppsMenu');
  if (!menu) return;

  const open = !menu.classList.contains('open');
  menu.classList.toggle('open', open);
  if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
}

function closeAppsMenu() {
  const menu = document.getElementById('appsMenu');
  const btn = document.getElementById('btnAppsMenu');
  if (menu) menu.classList.remove('open');
  if (btn) btn.setAttribute('aria-expanded', 'false');
}

/* -------------------------------------------------------------
   Map Initialization
------------------------------------------------------------- */
function initMap() {
  // Center world view
  state.map = L.map('map', {
    center: [20, 10],
    zoom: 2.5,
    minZoom: 2,
    maxZoom: 14,
    worldCopyJump: true,
    zoomControl: false
  });

  // Zoom lives in the bottom-right gutter so the floating toolbar owns the top-right
  L.control.zoom({ position: 'bottomright' }).addTo(state.map);

  // Create pane for reference labels (below markers, above base tiles)
  state.map.createPane('labels');
  state.map.getPane('labels').style.zIndex = 250;
  state.map.getPane('labels').style.pointerEvents = 'none';

  // 100% Free Dark Canvas Basemap (Zero Watermarks, No API Key Required)
  const defaultBasemap = BASEMAPS.dark;
  state.currentTileLayer = L.tileLayer(defaultBasemap.base, {
    attribution: defaultBasemap.attribution,
    maxZoom: defaultBasemap.maxZoom
  }).addTo(state.map);

  state.labelsLayer = L.tileLayer(defaultBasemap.ref, {
    attribution: '',
    maxZoom: defaultBasemap.maxZoom,
    pane: 'labels'
  }).addTo(state.map);

  // Initialize marker cluster group with custom dark stylings
  state.clusterGroup = L.markerClusterGroup({
    showCoverageOnHover: false,
    maxClusterRadius: 45,
    iconCreateFunction: function (cluster) {
      const markers = cluster.getAllChildMarkers();
      let hasCritical = false;
      let hasHigh = false;

      for (const m of markers) {
        if (m.options.severity === 'critical') hasCritical = true;
        else if (m.options.severity === 'high') hasHigh = true;
      }

      let clusterClass = 'marker-cluster-small';
      if (hasCritical) {
        clusterClass = 'marker-cluster-large';
      } else if (hasHigh) {
        clusterClass = 'marker-cluster-medium';
      }

      return L.divIcon({
        html: `<div><span>${cluster.getChildCount()}</span></div>`,
        className: `marker-cluster ${clusterClass}`,
        iconSize: L.point(40, 40)
      });
    }
  });

  state.map.addLayer(state.clusterGroup);
}

/* -------------------------------------------------------------
   Data Fetching & Rendering
------------------------------------------------------------- */
async function loadData() {
  const loading = document.getElementById('mapLoading');
  if (loading && state.events.length === 0) loading.classList.remove('hidden');

  let apiSuccess = false;
  // Try local FastAPI backend endpoints if port is 8000 or if backend is running on 8000
  const apiBases = [];
  if (window.location.port === '8000') {
    apiBases.push('');
  } else if (window.location.protocol.startsWith('http')) {
    apiBases.push('http://127.0.0.1:8000');
  }

  for (const base of apiBases) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const [eventsRes, summaryRes, diseasesRes] = await Promise.all([
        fetch(`${base}/api/outbreaks?days=365&limit=1000`, { signal: controller.signal }).then((r) => r.json()),
        fetch(`${base}/api/summary`, { signal: controller.signal }).then((r) => r.json()),
        fetch(`${base}/api/diseases`, { signal: controller.signal }).then((r) => r.json())
      ]);
      clearTimeout(timeoutId);

      if (eventsRes && eventsRes.events && eventsRes.events.length > 0) {
        state.events = eventsRes.events;
        state.summary = summaryRes;

        populateDiseaseDropdown(diseasesRes.diseases || []);
        updateStatsBar(summaryRes);
        applyFilters();
        renderChart(summaryRes.events_by_disease || {});

        const updatedEl = document.getElementById('lastUpdated');
        if (updatedEl) updatedEl.textContent = `Live API (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`;
        const ind = document.getElementById('liveIndicator');
        if (ind) ind.title = 'Connected to Live EpiWatch FastAPI Backend';
        apiSuccess = true;
        break;
      }
    } catch (e) {
      // Continue to next endpoint or fallback
    }
  }

  // If backend server is offline (e.g. running on static server 8080), fall back to rich verified baseline surveillance data
  if (!apiSuccess) {
    const seed = (typeof SEED_OUTBREAK_EVENTS !== 'undefined' && Array.isArray(SEED_OUTBREAK_EVENTS)) ? SEED_OUTBREAK_EVENTS : [];
    if (seed.length > 0) {
      state.events = seed;

      // Calculate aggregated metrics
      const uniqueCountries = new Set(seed.map((e) => e.country).filter(Boolean));
      const bySev = { critical: 0, high: 0, medium: 0, low: 0 };
      const byDis = {};
      const diseases = new Set();

      seed.forEach((e) => {
        const s = (e.severity || 'medium').toLowerCase();
        if (bySev[s] !== undefined) bySev[s]++;
        const d = e.disease || 'Other';
        diseases.add(d);
        byDis[d] = (byDis[d] || 0) + 1;
      });

      const summary = {
        total_events: seed.length,
        active_outbreaks: seed.filter((e) => e.is_active !== false).length,
        countries_affected: uniqueCountries.size,
        events_by_severity: bySev,
        events_by_disease: byDis
      };

      state.summary = summary;
      populateDiseaseDropdown(Array.from(diseases).sort());
      updateStatsBar(summary);
      applyFilters();
      renderChart(byDis);

      const updatedEl = document.getElementById('lastUpdated');
      if (updatedEl) updatedEl.textContent = `Baseline Feeds (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`;
      const ind = document.getElementById('liveIndicator');
      if (ind) ind.title = 'Displaying Verified Baseline Surveillance Feeds (Start backend on :8000 for continuous auto-refresh)';
    } else {
      console.warn('No outbreak data available in seed or API.');
      showToast('Connecting to global outbreak data feeds...', 'info');
    }
  }

  if (loading) loading.classList.add('hidden');
}

function populateDiseaseDropdown(diseases) {
  const select = document.getElementById('filterDisease');
  if (!select) return;
  const currentVal = select.value;

  select.innerHTML = '<option value="">All Diseases</option>';
  diseases.forEach((d) => {
    const opt = document.createElement('option');
    opt.value = d;
    opt.textContent = d;
    select.appendChild(opt);
  });
  select.value = currentVal;
}

function updateStatsBar(summary) {
  if (!summary) return;
  const total = document.getElementById('statTotalVal');
  const active = document.getElementById('statActiveVal');
  const countries = document.getElementById('statCountriesVal');
  const high = document.getElementById('statHighVal');
  const critical = document.getElementById('statCriticalVal');

  if (total) total.textContent = summary.total_events || state.events.length || 0;
  if (active) active.textContent = summary.active_outbreaks || state.events.length || 0;
  if (countries) countries.textContent = summary.countries_affected || 0;

  const bySev = summary.events_by_severity || {};
  if (high) high.textContent = bySev.high || 0;
  if (critical) critical.textContent = bySev.critical || 0;
}

/* -------------------------------------------------------------
   Filtering Logic
------------------------------------------------------------- */
function applyFilters() {
  const days = parseInt(document.getElementById('filterDays')?.value || '365', 10);
  const disease = document.getElementById('filterDisease')?.value.toLowerCase() || '';
  const severity = document.getElementById('filterSeverity')?.value || '';
  const source = document.getElementById('filterSource')?.value.toLowerCase() || '';
  const search = document.getElementById('filterSearch')?.value.toLowerCase().trim() || '';

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  state.filteredEvents = state.events.filter((ev) => {
    // Date filter
    const evDate = new Date(ev.date);
    if (evDate < cutoff) return false;

    // Disease filter
    if (disease && (!ev.disease || ev.disease.toLowerCase() !== disease)) {
      return false;
    }

    // Severity filter
    if (severity && ev.severity !== severity) {
      return false;
    }

    // Source filter
    if (source && (!ev.source || !ev.source.toLowerCase().includes(source))) {
      return false;
    }

    // Search query
    if (search) {
      const match =
        (ev.title && ev.title.toLowerCase().includes(search)) ||
        (ev.description && ev.description.toLowerCase().includes(search)) ||
        (ev.country && ev.country.toLowerCase().includes(search)) ||
        (ev.disease && ev.disease.toLowerCase().includes(search)) ||
        (ev.location && ev.location.toLowerCase().includes(search));
      if (!match) return false;
    }

    return true;
  });

  renderMapMarkers();
  renderEventsList();
  updateEventCount();
}

function clearFilters() {
  document.getElementById('filterDays').value = '365';
  document.getElementById('filterDisease').value = '';
  document.getElementById('filterSeverity').value = '';
  document.getElementById('filterSource').value = '';
  document.getElementById('filterSearch').value = '';
  applyFilters();
  showToast('Filters cleared', 'info');
}

function updateEventCount() {
  const badge = document.getElementById('eventCountBadge');
  const countLabel = document.getElementById('sidebarEventCount');
  const len = state.filteredEvents.length;

  if (badge) badge.textContent = len;
  if (countLabel) countLabel.textContent = `Showing ${len} of ${state.events.length} events`;
}

/* -------------------------------------------------------------
   Map Markers & Popups
------------------------------------------------------------- */
function renderMapMarkers() {
  state.clusterGroup.clearLayers();
  state.markersMap.clear();

  state.filteredEvents.forEach((ev) => {
    if (typeof ev.lat !== 'number' || typeof ev.lon !== 'number') return;

    const color = SEVERITY_COLORS[ev.severity] || SEVERITY_COLORS.medium;
    const pulseAnimation = ev.severity === 'critical' ? 'animation: pulse 1.8s infinite;' : '';

    const icon = L.divIcon({
      className: 'custom-marker',
      html: `
        <div class="marker-inner" style="
          background: ${color};
          width: 14px;
          height: 14px;
          box-shadow: 0 0 10px ${color}, 0 0 20px ${color}88;
          ${pulseAnimation}
        "></div>
      `,
      iconSize: [18, 18],
      iconAnchor: [9, 9],
      popupAnchor: [0, -10]
    });

    const marker = L.marker([ev.lat, ev.lon], {
      icon: icon,
      severity: ev.severity,
      eventId: ev.id
    });

    const formattedDate = new Date(ev.date).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    const popupHtml = `
      <div class="popup-content">
        <span class="popup-severity-badge bg-sev-${ev.severity}">${ev.severity} Alert</span>
        <h3 class="popup-title">${escapeHtml(ev.title)}</h3>
        <div class="popup-meta">
          <span>📍 ${escapeHtml(ev.location || ev.country)}</span>
          <span>🦠 ${escapeHtml(ev.disease)}</span>
          <span>📅 ${formattedDate}</span>
          ${ev.cases ? `<span>📊 Cases: <strong>${ev.cases.toLocaleString()}</strong></span>` : ''}
          ${ev.deaths ? `<span>⚰️ Fatalities: <strong>${ev.deaths.toLocaleString()}</strong></span>` : ''}
          <span>🏛️ Source: <em>${escapeHtml(ev.source)}</em></span>
        </div>
        ${ev.description ? `<p class="popup-desc">${escapeHtml(ev.description.substring(0, 160))}...</p>` : ''}
        <button class="popup-btn" onclick="openModal('${ev.id}')">View Full Outbreak Intelligence</button>
      </div>
    `;

    marker.bindPopup(popupHtml, { maxWidth: 320 });

    marker.on('click', () => {
      highlightEventCard(ev.id);
    });

    state.clusterGroup.addLayer(marker);
    state.markersMap.set(ev.id, marker);
  });
}

function resetMapView() {
  if (state.map) {
    state.map.flyTo([20, 10], 2.5, { duration: 1.2 });
  }
}

function toggleClusters() {
  state.isClusteringEnabled = !state.isClusteringEnabled;
  if (state.isClusteringEnabled) {
    state.markersMap.forEach((m) => state.map.removeLayer(m));
    state.map.addLayer(state.clusterGroup);
    showToast('Marker clustering enabled', 'info');
  } else {
    state.map.removeLayer(state.clusterGroup);
    // Add raw markers directly
    state.markersMap.forEach((m) => m.addTo(state.map));
    showToast('Marker clustering disabled', 'info');
  }
  setBtnActive('btnToggleClusters', state.isClusteringEnabled);
}

function toggleBasemap() {
  const modes = ['dark', 'satellite', 'street'];
  const nextIdx = (modes.indexOf(state.currentBasemap) + 1) % modes.length;
  state.currentBasemap = modes[nextIdx];
  const cfg = BASEMAPS[state.currentBasemap];

  if (state.currentTileLayer) state.map.removeLayer(state.currentTileLayer);
  if (state.labelsLayer) state.map.removeLayer(state.labelsLayer);

  state.currentTileLayer = L.tileLayer(cfg.base, {
    attribution: cfg.attribution,
    maxZoom: cfg.maxZoom
  }).addTo(state.map);

  if (cfg.ref) {
    state.labelsLayer = L.tileLayer(cfg.ref, {
      attribution: '',
      maxZoom: cfg.maxZoom,
      pane: 'labels'
    }).addTo(state.map);
  } else {
    state.labelsLayer = null;
  }

  showToast(`Basemap: ${cfg.name}`, 'info');
}

/* -------------------------------------------------------------
   Events List Panel
------------------------------------------------------------- */
function renderEventsList() {
  const container = document.getElementById('eventsList');
  if (!container) return;

  if (state.filteredEvents.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"/><path d="M8 12h8"/>
        </svg>
        <p>No outbreak events match your criteria.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = state.filteredEvents
    .map((ev) => {
      const formattedDate = new Date(ev.date).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric'
      });
      const isSelected = ev.id === state.selectedEventId ? 'highlighted' : '';

      return `
        <div class="event-card ${isSelected}" data-severity="${ev.severity}" id="card-${ev.id}" onclick="selectEvent('${ev.id}')">
          <div class="card-header">
            <span class="card-disease bg-sev-${ev.severity}">${escapeHtml(ev.disease)}</span>
            <span class="card-severity-icon">${getSeverityIcon(ev.severity)}</span>
          </div>
          <div class="card-title">${escapeHtml(ev.title)}</div>
          <div class="card-meta">
            <span class="card-meta-item">📍 ${escapeHtml(ev.country)}</span>
            <span class="card-meta-item">📅 ${formattedDate}</span>
            ${ev.cases ? `<span class="card-meta-item">👥 ${ev.cases.toLocaleString()}</span>` : ''}
            <span class="card-source-badge">${escapeHtml(ev.source)}</span>
          </div>
        </div>
      `;
    })
    .join('');
}

function selectEvent(id) {
  state.selectedEventId = id;
  highlightEventCard(id);

  const ev = state.events.find((e) => e.id === id);
  const marker = state.markersMap.get(id);

  if (ev && state.map) {
    state.map.flyTo([ev.lat, ev.lon], 6, { duration: 1 });
    if (marker) {
      setTimeout(() => {
        state.clusterGroup.zoomToShowLayer(marker, () => {
          marker.openPopup();
        });
      }, 500);
    }
  }
}

function highlightEventCard(id) {
  document.querySelectorAll('.event-card').forEach((c) => c.classList.remove('highlighted'));
  const card = document.getElementById(`card-${id}`);
  if (card) {
    // The card only exists while the alert feed is on-screen
    ensurePanelOpen('eventsPanel');
    card.classList.add('highlighted');
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function getSeverityIcon(sev) {
  switch (sev) {
    case 'critical': return '🔴';
    case 'high': return '🟠';
    case 'medium': return '🟡';
    default: return '🟢';
  }
}

/* -------------------------------------------------------------
   Chart Rendering
   The canvas lives inside a collapsed <details>, so it has no size
   until the user opens that section — resize on reveal.
------------------------------------------------------------- */
function renderChart(diseaseStats) {
  const canvas = document.getElementById('diseaseChart');
  if (!canvas) return;

  const labels = Object.keys(diseaseStats).slice(0, 6);
  const data = Object.values(diseaseStats).slice(0, 6);

  if (labels.length === 0) return;

  if (state.chart) {
    state.chart.destroy();
  }

  const ctx = canvas.getContext('2d');
  state.chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: [
            '#ff2244',
            '#ff7b00',
            '#ffd700',
            '#00cfff',
            '#00ff88',
            '#a855f7'
          ],
          borderColor: 'rgba(8, 18, 29, 0.9)',
          borderWidth: 2,
          hoverOffset: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            boxWidth: 9,
            boxHeight: 9,
            color: '#8aa8c0',
            font: { size: 9.5, family: 'Inter' },
            padding: 7
          }
        },
        tooltip: {
          backgroundColor: 'rgba(8, 18, 29, 0.96)',
          titleColor: '#e8f4ff',
          bodyColor: '#00cfff',
          borderColor: 'rgba(0, 207, 255, 0.3)',
          borderWidth: 1,
          padding: 9,
          displayColors: false
        }
      },
      cutout: '66%'
    }
  });
}

/* -------------------------------------------------------------
   Detail Modal Logic
------------------------------------------------------------- */
function openModal(id) {
  const ev = state.events.find((e) => e.id === id);
  if (!ev) return;

  const modal = document.getElementById('modalOverlay');
  const content = document.getElementById('modalContent');
  if (!modal || !content) return;

  const formattedDate = new Date(ev.date).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const tagsHtml = (ev.tags || [])
    .map((t) => `<span class="modal-tag">${escapeHtml(t)}</span>`)
    .join('');

  content.innerHTML = `
    <span class="modal-disease-badge bg-sev-${ev.severity}">${escapeHtml(ev.disease)} • ${ev.severity.toUpperCase()}</span>
    <h2 class="modal-title">${escapeHtml(ev.title)}</h2>

    <div class="modal-stats-grid">
      <div class="modal-stat-box">
        <span class="modal-stat-value" style="color: ${SEVERITY_COLORS[ev.severity]}">${ev.severity.toUpperCase()}</span>
        <span class="modal-stat-label">Alert Severity</span>
      </div>
      <div class="modal-stat-box">
        <span class="modal-stat-value">${ev.cases ? ev.cases.toLocaleString() : 'Monitoring'}</span>
        <span class="modal-stat-label">Confirmed Cases</span>
      </div>
      <div class="modal-stat-box">
        <span class="modal-stat-value">${ev.deaths !== null && ev.deaths !== undefined ? ev.deaths.toLocaleString() : 'N/A'}</span>
        <span class="modal-stat-label">Reported Deaths</span>
      </div>
    </div>

    <div class="popup-meta" style="margin-bottom: 14px;">
      <span>📍 <strong>Location:</strong> ${escapeHtml(ev.location || ev.country)} (Lat: ${ev.lat.toFixed(2)}, Lon: ${ev.lon.toFixed(2)})</span>
      <span>📅 <strong>First Observed:</strong> ${formattedDate}</span>
      <span>🏛️ <strong>Primary Surveillance Agency:</strong> ${escapeHtml(ev.source)}</span>
      <span>🚨 <strong>Surveillance Status:</strong> ${ev.is_active ? 'Active Outbreak Watch' : 'Contained'}</span>
    </div>

    <div class="modal-description">
      ${escapeHtml(ev.description || 'No detailed surveillance bulletin provided.')}
    </div>

    ${tagsHtml ? `<div class="modal-tags">${tagsHtml}</div>` : ''}

    ${
      ev.source_url
        ? `<a href="${encodeURI(ev.source_url)}" target="_blank" rel="noopener noreferrer" class="modal-source-link">
            <span>Read Primary Source Bulletin</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
            </svg>
          </a>`
        : ''
    }
  `;

  modal.classList.add('open');
}

function closeModal(event) {
  if (event && event.target !== event.currentTarget) return;
  const modal = document.getElementById('modalOverlay');
  if (modal) modal.classList.remove('open');
}

/* -------------------------------------------------------------
   Manual Refresh Trigger
------------------------------------------------------------- */
async function triggerRefresh() {
  const btn = document.getElementById('btnRefresh');
  if (btn) btn.classList.add('spinning');

  showToast('Fetching latest data from 5 free API sources (WHO, CDC, ECDC, Disease.sh, News)...', 'info');

  try {
    const res = await fetch('/api/refresh', { method: 'POST' });
    const data = await res.json();
    showToast('Surveillance update underway!', 'success');
    setTimeout(loadData, 2500);
  } catch (e) {
    showToast('Could not reach backend refresh service.', 'error');
  } finally {
    setTimeout(() => {
      if (btn) btn.classList.remove('spinning');
    }, 1500);
  }
}

/* -------------------------------------------------------------
   Toast Notifications
------------------------------------------------------------- */
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✅' : type === 'error' ? '⚠️' : 'ℹ️'}</span>
    <div>${escapeHtml(message)}</div>
  `;

  container.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

/* -------------------------------------------------------------
   Utilities
------------------------------------------------------------- */
function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function setBtnActive(id, active) {
  const btn = document.getElementById(id);
  if (btn) btn.classList.toggle('is-on', !!active);
}

function initEventListeners() {
  // Two open panels would stack on top of each other on a phone
  window.addEventListener('resize', enforcePhoneExclusivity);

  // Dismiss the overflow menu on outside click
  document.addEventListener('click', (e) => {
    const menu = document.getElementById('appsMenu');
    if (menu && menu.classList.contains('open') && !menu.contains(e.target)) {
      closeAppsMenu();
    }
  });

  // Persist + respond to the collapsed analysis sections
  [['legendDetails', 'legend'], ['chartDetails', 'chart']].forEach(([id, key]) => {
    const details = document.getElementById(id);
    if (!details) return;

    details.addEventListener('toggle', () => {
      if (restoringUi) return;

      state.ui[key] = details.open;
      saveUiState();

      if (key === 'chart' && details.open) {
        // The canvas lives inside the filters panel — reveal it if it is hidden
        ensurePanelOpen('sidebar');
        // Give the panel its layout back before Chart.js measures the canvas
        requestAnimationFrame(() => {
          if (state.chart) state.chart.resize();
        });
      }
    });
  });

  window.addEventListener('keydown', (e) => {
    // Escape closes the topmost thing: menu, then modal
    if (e.key === 'Escape') {
      const menu = document.getElementById('appsMenu');
      if (menu && menu.classList.contains('open')) {
        closeAppsMenu();
        return;
      }
      closeModal(null);
      return;
    }

    // "/" jumps to search, but never while the user is already typing
    const typing = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName);
    if (e.key === '/' && !typing) {
      e.preventDefault();
      ensurePanelOpen('sidebar');
      const search = document.getElementById('filterSearch');
      if (search) search.focus();
    }
  });
}
