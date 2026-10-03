# EpiWatch — Global Disease Outbreak & Epidemic Monitor 🌍🔬

A real-time biological phenomenon and disease outbreak surveillance platform inspired by HealthMap.org, built with a robust Python (FastAPI + SQLite + APScheduler) backend and an interactive Leaflet.js dark-themed frontend.

---

## 🆓 100% Free API & Open Data Architecture

EpiWatch uses a **zero-cost, keyless, unblocked data collection architecture** powered by 5 authoritative open health APIs and public surveillance feeds:

1. **World Health Organization (WHO)**
   - Official international disease advisories and emergency public health updates.
   - Endpoint: `https://www.who.int/rss-feeds/news-english.xml` (Free public RSS)

2. **Centers for Disease Control and Prevention (CDC)**
   - CDC Health Alert Network (HAN) & international Travel Health Notices.
   - Endpoints: `https://tools.cdc.gov/api/v2/resources/media/316422.rss` & `https://wwwnc.cdc.gov/travel/notices/rss.xml` (Free public RSS)

3. **European Centre for Disease Prevention and Control (ECDC)**
   - Official EU epidemiological threat assessments and rapid outbreak investigations.
   - Endpoint: `https://www.ecdc.europa.eu/en/taxonomy/term/1295/feed` (Free public RSS)

4. **Disease.sh Open Disease Data API**
   - Open-source, keyless epidemic statistics engine covering 230+ countries.
   - Ingests active cases, critical caseloads, fatalities, and CDC national Influenza (ILINet) metrics.
   - Endpoints: `https://disease.sh/v3/covid-19/countries` & `https://disease.sh/v3/influenza/cdc/ILINet` (Free public REST API)

5. **Global Disease News Surveillance**
   - Real-time early-warning surveillance monitoring verified medical news reports (Reuters, CIDRAP, FDA, BBC, UN News, AP).
   - Endpoint: Google News Real-Time RSS Query (Free, unauthenticated, zero rate limits)

6. **Free Geocoding Engine**:
   - Ultra-fast built-in coordinate cache for 200+ countries, all 50 US States, and major outbreak epicenters.
   - Automatic fallback to OpenStreetMap Nominatim with retry protection.

---

## 🚀 Features

- **Automated Pipeline**:
  - Disease classification (Mpox, H5N1, Dengue, Cholera, Marburg, Nipah, Measles, Plague, COVID-19, Salmonella, etc.)
  - Location geocoding & coordinates mapping
  - Severity classification (Critical 🔴, High 🟠, Medium 🟡, Low 🟢)
  - Background scheduler refreshing feeds every 30 minutes via APScheduler
  - Instant manual refresh via `/api/refresh`
- **Frontend Dashboard**:
  - Leaflet.js interactive dark-mode map (100% Free ESRI Dark Canvas + Satellite & Street Layer Switcher)
  - Clustered and pulsing severity markers
  - Clickable event cards synced with map markers
  - Interactive outbreak detail modals with primary agency source links
  - Donut distribution chart with Chart.js
  - Filters by time range, disease, severity, data source, and free-text search

---

## 🛠️ Quick Start

### 1. Requirements
- Python 3.9+

### 2. Run the Server
From the project directory:
```bash
/opt/homebrew/bin/python3 -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```
*(Or if using standard python3 with installed dependencies)*:
```bash
python3 -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```

> **Tip:** If port 8000 is already in use by a previous instance, kill it with:
> ```bash
> lsof -ti :8000 | xargs kill -9
> ```

### 3. Open the Web Application
Open your web browser and navigate to:
**[http://127.0.0.1:8000](http://127.0.0.1:8000)**

---

## 📡 Free API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/outbreaks` | List outbreaks with query params (`days`, `disease`, `country`, `severity`, `source`, `limit`) |
| `GET` | `/api/summary` | Global statistical breakdown by disease, severity, and country |
| `GET` | `/api/sources` | Metadata, endpoints, and status of all 5 integrated free public APIs |
| `GET` | `/api/stats/covid` | Direct query to Disease.sh open COVID-19 stats (optional `?country=` param) |
| `GET` | `/api/stats/influenza` | Direct query to CDC Influenza-Like Illness surveillance metrics |
| `GET` | `/api/diseases` | Unique list of tracked diseases |
| `GET` | `/api/countries` | Unique list of affected countries |
| `GET` | `/api/status` | System health and data source metrics |
| `POST` | `/api/refresh` | Trigger immediate background data collection across all free APIs |
| `GET` | `/docs` | Interactive Swagger / OpenAPI documentation |
