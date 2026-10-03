# 🧬 BioSearch Platform — Central Operations Guide

Welcome to the **BioSearch Platform**, an AI-powered biomedical research, surveillance, and knowledge graphing suite.

This document serves as the **central reference** on how to start, stop, configure, and operate all components of the platform.

---

## ⚡ Quick Start (TL;DR)

| Action | One-Click (Windows) | Terminal Command |
| :--- | :--- | :--- |
| **Start Everything** | Double-click [`start.bat`](file:///c:/Users/admin/OneDrive/Desktop/Hackathon/Website_Draft/start.bat) | `python -m http.server 8080` |
| **Stop Everything** | Double-click [`stop.bat`](file:///c:/Users/admin/OneDrive/Desktop/Hackathon/Website_Draft/stop.bat) | Press `Ctrl + C` in the running terminal |
| **Open in Browser** | Opens automatically with `start.bat` | Navigate to [http://localhost:8080](http://localhost:8080) |

---

## 🚀 How to Start Everything

### Method 1: One-Click Batch Script (Recommended for Windows)
Double-click [`start.bat`](file:///c:/Users/admin/OneDrive/Desktop/Hackathon/Website_Draft/start.bat) in the project root folder.
- Launches the local HTTP server on port `8080`.
- Automatically opens your default web browser to `http://localhost:8080`.

---

### Method 2: PowerShell
Open a PowerShell terminal in the project directory:

```powershell
# Start local server on port 8080
python -m http.server 8080
```

To open the browser from PowerShell:
```powershell
Start-Process "http://localhost:8080"
```

---

### Method 3: Command Prompt (CMD)
```cmd
python -m http.server 8080
```

---

### Method 4: Node.js (Alternative)
If you prefer Node.js over Python:
```bash
npx serve . -p 8080
```

---

## 🛑 How to Stop Everything

### Method 1: Terminal Keyboard Shortcut (Standard)
If the server is running in an active terminal window, simply press:
```text
Ctrl + C
```
Type `Y` if prompted to terminate the batch job.

---

### Method 2: One-Click Stop Script (Windows)
Double-click [`stop.bat`](file:///c:/Users/admin/OneDrive/Desktop/Hackathon/Website_Draft/stop.bat) in the project root folder.
- Automatically locates any process listening on port `8080`.
- Kills the process cleanly without needing to find the window.

---

### Method 3: PowerShell Command Line
If a server was started in the background or you want to kill whatever is using port 8080:

```powershell
# Locate and terminate any process listening on port 8080
Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue |
    Select-Object -ExpandProperty OwningProcess -Unique |
    ForEach-Object { Stop-Process -Id $_ -Force }
```

---

### Method 4: Command Prompt (CMD)
```cmd
for /f "tokens=5" %a in ('netstat -aon ^| findstr ":8080" ^| findstr "LISTENING"') do taskkill /F /PID %a
```

---

## 🌐 Platform Modules & Direct URLs

Once the server is running on `http://localhost:8080`:

| Module | URL | Description |
| :--- | :--- | :--- |
| **Main BioSearch Hub** | [`http://localhost:8080/index.html`](http://localhost:8080/index.html) | Live literature search bar, trending topics, quick navigation links |
| **BioGraph Studio** | [`http://localhost:8080/graphing-model/demo.html`](http://localhost:8080/graphing-model/demo.html) | Interactive 2D/3D physics knowledge graph with live Europe PMC retrieval & Gemini AI synthesis |
| **Global Threat Map** | [`http://localhost:8080/threat-map/index.html`](http://localhost:8080/threat-map/index.html) | Real-time global pathogen surveillance, risk telemetry, outbreak radar |
| **3D Pathogen Viewer** | [`http://localhost:8080/model-viewer.html`](http://localhost:8080/model-viewer.html) | Interactive 3D molecular, protein, and viral structure inspector |

> [!TIP]
> You can also directly search from the main homepage: typing any biomedical topic (e.g., `AlphaFold`, `CRISPR Cas9`, `COVID-19 ACE2`) and clicking **"Search Graph"** will automatically redirect to BioGraph Studio and generate a living knowledge graph for that topic.

---

## 🐍 CLI Knowledge Graph Generator

In addition to the web interface, the project includes an autonomous CLI tool for batch retrieval and knowledge graph extraction:

```bash
# 1. Navigate to graphing-model directory (or run from root)
python graphing-model/fetch_pmc_and_generate_graph.py --topic "CRISPR Cas9" --max-papers 3
```

### CLI Command Options:
| Flag | Description | Default | Example |
| :--- | :--- | :--- | :--- |
| `--topic` | Biomedical search query or PMC IDs | `"COVID-19 rapid antigen tests ACE2 immunity"` | `--topic "AlphaFold 3 protein complexes"` |
| `--max-papers` | Number of publications to scrape | `5` | `--max-papers 3` |
| `--gemini-api-key` | Optional Gemini API key | Reads from `.env` | `--gemini-api-key "AIzaSy..."` |
| `--model` | Gemini Model identifier | Reads from `.env` (`gemini-3.1-flash-lite`) | `--model "gemini-3.1-flash-lite"` |
| `--format` | Output format (`json` or `triplets`) | `json` | `--format triplets` |
| `--output` | Save results to file | stdout | `--output my_graph.json` |

---

## ⚙️ Environment Variables (`.env`)

Configuration settings are stored in [`.env`](file:///c:/Users/admin/OneDrive/Desktop/Hackathon/Website_Draft/.env). A template is provided in [`.env.example`](file:///c:/Users/admin/OneDrive/Desktop/Hackathon/Website_Draft/.env.example).

```ini
# Google Gemini API Key for Biological Knowledge Graph Entity Synthesis
# Get a free key from Google AI Studio: https://aistudio.google.com/app/apikey
GEMINI_API_KEY="your_api_key_here"

# Model identifier for Google Gemini API
GEMINI_MODEL="gemini-3.1-flash-lite"

# Local Development Server Port
PORT=8080
```

> [!NOTE]
> `.env` is automatically ignored by Git (via `.gitignore`) so your API keys will never be accidentally committed.

---

## 🔧 Troubleshooting & FAQs

### 1. Port 8080 is already in use (`Address already in use` error)
- Run [`stop.bat`](file:///c:/Users/admin/OneDrive/Desktop/Hackathon/Website_Draft/stop.bat) to free port 8080.
- Or start the server on a different port:
  ```powershell
  python -m http.server 8081
  ```

### 2. Can I use the web application without a server (`file:///`)?
- Yes! The core platform has built-in defaults so you can double-click [`graphing-model/demo.html`](file:///c:/Users/admin/OneDrive/Desktop/Hackathon/Website_Draft/graphing-model/demo.html) directly in Windows Explorer.
- However, running via `start.bat` (`http://localhost:8080`) is recommended to prevent browser CORS restrictions when loading local files.

### 3. Gemini AI shows "Offline" or fails to connect
- Open BioGraph Studio and click **Gemini AI** in the top navigation bar.
- Verify your API key and click **Test Connection**.
- Ensure your model is set to `gemini-3.1-flash-lite`.
- If no internet or API quota is available, BioSearch automatically activates its **Rule-Based Semantic Fallback Engine**, allowing graph generation to continue smoothly.

---

## 📁 Repository Directory Structure

```text
Website_Draft/
├── start.bat                   # ⚡ One-click start script
├── stop.bat                    # 🛑 One-click stop script
├── README.md                   # 📖 Central operations guide (this file)
├── .env                        # 🔑 Private environment variables & API keys
├── .env.example                # 📋 Public environment template
├── index.html                  # 🏠 Main portal & search engine
├── models.html                 # 🧬 Pathogen models gallery
├── model-viewer.html           # 🔬 3D molecular viewer
├── style.css                   # 🎨 Core styling
├── css/                        # 🎨 Supporting stylesheets
├── js/                         # ⚡ Platform UI & search routing logic
├── threat-map/                 # 🗺️ Global biological threat surveillance
│   ├── index.html
│   ├── threat_map.js
│   └── threat_map.css
├── paper-analyzer/             # 📑 PaperLens: Deep Research Intelligence & Topology Engine
│   ├── index.html              # Main PaperLens application
│   ├── css/style.css           # Glassmorphic cyber-biomedical design system
│   └── js/
│       ├── papers-data.js      # Landmark datasets (AlphaFold 3, Prime Editing, ESMFold, Med-PaLM 2, etc.)
│       ├── graph-visualizer.js # Canvas force-directed topology simulation with node inspector
│       └── analyzer.js         # Reactive UI, section rendering, custom paper synthesis & exports
└── graphing-model/             # 🕸️ BioGraph Knowledge Graph Studio
    ├── demo.html               # Main knowledge graph app
    ├── index.html              # Mirror of demo.html
    ├── fetch_pmc_and_generate_graph.py  # Python CLI generator
    └── README.md               # BioGraph specific documentation
```

---

## 📑 BioSearch PaperLens — Research Paper Deep Analyzer

Accessible directly at: [`http://localhost:8080/paper-analyzer/index.html`](http://localhost:8080/paper-analyzer/index.html)

PaperLens provides structured, verifiable deep decomposition of scientific publications across 6 core pillars:
1. **Core Research Question:** The exact hypothesis ($H_1$), formal problem formulation, status quo bottleneck, and falsification criteria.
2. **Key Findings:** Quantitative headline results with exact benchmark metrics (PoseBusters, CASP15, TM-score, MedQA, ROC-AUC, $p$-values) and qualitative breakthroughs.
3. **Ablation Studies:** Component-by-component necessity analysis isolating the causal contribution of each subsystem when perturbed or removed.
4. **Lineage & Foundation:** Direct ancestral frameworks and landmark papers, explicitly contrasting inherited concepts with key divergences.
5. **Interactive Paper Knowledge Graph:** Real-time force-directed canvas graph with particle telemetry, topology filters, and interactive node inspector.
6. **Related Papers:** Semantic and methodological comparison grid highlighting shared concepts, competitor status, and key differences.

