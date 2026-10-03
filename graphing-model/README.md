# BioGraph Studio — Dynamic Scientific Paper Fetching & Graph Generation Pipeline

A generalized, high-performance biomedical knowledge graph modeling engine and automated literature extraction pipeline.

This guide explains how to dynamically retrieve research papers on **any scientific topic** from PubMed Central (PMC), Europe PMC, or PubMed, automatically extract biological entities and directional relationships, and render them in the interactive BioGraph force-directed model.

---

## Table of Contents
1. [Pipeline Overview](#1-pipeline-overview)
2. [Method A: Zero-Code Dynamic Search via Web UI](#2-method-a-zero-code-dynamic-search-via-web-ui)
3. [Method B: Automated Python CLI Pipeline](#3-method-b-automated-python-cli-pipeline)
4. [Method C: Direct NCBI E-utilities & Europe PMC REST APIs](#4-method-c-direct-ncbi-e-utilities--europe-pmc-rest-apis)
5. [Entity & Relationship Extraction Architecture](#5-entity--relationship-extraction-architecture)
6. [Supported Data Formats for the Graphing Model](#6-supported-data-formats-for-the-graphing-model)
7. [Pre-Loaded Literature Datasets](#7-pre-loaded-literature-datasets)

---

## 1. Pipeline Overview

```
   ┌─────────────────────────────────────────────────────────────┐
   │                     1. LITERATURE QUERY                     │
   │  Search topic (e.g., "ACE2 COVID-19 pediatric immunity",    │
   │  "CRISPR-Cas9 off-target", "mRNA lipid nanoparticles")      │
   └──────────────────────────────┬──────────────────────────────┘
                                  ▼
   ┌─────────────────────────────────────────────────────────────┐
   │                  2. API ARTICLE RETRIEVAL                   │
   │  • Europe PMC REST API (JSON, CORS-enabled, Open Access)    │
   │  • NCBI Entrez E-utilities (esearch.fcgi & esummary.fcgi)   │
   └──────────────────────────────┬──────────────────────────────┘
                                  ▼
   ┌─────────────────────────────────────────────────────────────┐
   │              3. ENTITY & RELATIONSHIP EXTRACTION            │
   │  • Scientific Named Entity Recognition (NER)                │
   │  • Biological classification (Gene, Receptor, Assay, etc.)  │
   │  • Sentence-level semantic predicate mapping (binds, etc.)  │
   └──────────────────────────────┬──────────────────────────────┘
                                  ▼
   ┌─────────────────────────────────────────────────────────────┐
   │                  4. BIOGRAPH ENGINE RENDERING               │
   │  • D3.js v7 physics-based force simulation                 │
   │  • Degree centrality sizing & category coloring             │
   │  • Real-time inspector, zoom, drag, and search              │
   └─────────────────────────────────────────────────────────────┘
```

---

## 2. Method A: Zero-Code Dynamic Search via Web UI

BioGraph Studio contains a built-in **Live PMC / PubMed Query Engine** that connects directly to the scientific literature from your browser without installing anything, augmented with **Google Gemini API** for LLM-powered entity and relationship synthesis.

### Instant Search from Main Website:
You can query any scientific topic directly from the BioSearch homepage (`index.html`) using the **"Search Graph"** input or trending topic pills.
It routes automatically to:
```
graphing-model/demo.html?query=CRISPR-Cas9
```
Upon arrival, the system displays the high-tech synthesis radar, retrieves relevant open-access papers, activates Gemini entity extraction, and weaves the 3D force-directed knowledge graph in real time!

### Manual Search in Studio:
1. Open [`graphing-model/demo.html`](demo.html) in your browser.
2. Click the **"✨ Gemini AI"** button in the top navigation bar to configure your optional Gemini API key (stored securely in browser localStorage).
3. Click **"Graph Any Data"** &rarr; **"🌐 Live PMC / PubMed Query"** tab.
4. Enter any research topic or query string, for example:
   - `CRISPR Cas9 gene editing therapeutics`
   - `mRNA vaccine lipid nanoparticle delivery`
   - `CAR-T cell exhaustion immunotherapy`
   - `PMC8259047 OR PMC11462910 OR PMC8293341`
5. Ensure **"Extract extra nodes & relations with Gemini API"** is checked.
6. Click **"Fetch & Generate Graph"**.
7. The browser fetches papers via Europe PMC API, synthesizes deep entity nodes and directional biological relationships with Gemini API (or the high-precision semantic fallback), and immediately renders the interactive force-directed graph!

---

## 3. Method B: Automated Python CLI Pipeline

A standalone Python pipeline script [`fetch_pmc_and_generate_graph.py`](fetch_pmc_and_generate_graph.py) is included in this folder.

### Requirements:
Python 3.8+ (standard library only; no extra pip packages required).

### Basic Command:
```bash
python fetch_pmc_and_generate_graph.py --topic "CRISPR-Cas9 gene editing" --max-papers 5 --output crispr_graph.json
```

### With Google Gemini API Entity Synthesis:
```bash
python fetch_pmc_and_generate_graph.py --topic "AlphaFold 3 protein complexes" --gemini-api-key "AIzaSy..." --model "gemini-3.1-flash-lite" --output alphafold_graph.json
```
*(Or set the `GEMINI_API_KEY` and `GEMINI_MODEL` environment variables in `.env`)*

### Command Options:
| Flag | Description | Default | Example |
| :--- | :--- | :--- | :--- |
| `--topic` | Research topic or PMC identifiers | `"COVID-19 rapid antigen tests ACE2"` | `--topic "Alzheimer amyloid beta microglia"` |
| `--max-papers` | Number of articles to retrieve | `5` | `--max-papers 8` |
| `--gemini-api-key` | Google Gemini API key for LLM node synthesis | `""` (or `$GEMINI_API_KEY`) | `--gemini-api-key "AIzaSy..."` |
| `--model` | Google Gemini model identifier | `"gemini-3.1-flash-lite"` (or `$GEMINI_MODEL`) | `--model "gemini-3.1-flash-lite"` |
| `--format` | Output format (`json` or `triplets`) | `json` | `--format triplets` |
| `--output` | Destination file path | stdout | `--output my_graph.json` |

### Examples:

#### 1. Generate Graph for the 3 COVID-19 PMC Papers:
```bash
python fetch_pmc_and_generate_graph.py --topic "PMC8259047 OR PMC11462910 OR PMC8293341" --format triplets
```
Output:
```text
PMC8259047 -> Covid-19 : Investigates / Reports
PMC8259047 -> Antibody : Investigates / Reports
PMC8259047 -> Serum : Investigates / Reports
PMC8293341 -> Ace2 : Investigates / Reports
Ace2 -> Sars-cov-2 : Correlated with
Covid-19 -> Sars-cov-2 : Causes / Mediates
```

#### 2. Generate JSON File for Direct BioGraph Import:
```bash
python fetch_pmc_and_generate_graph.py --topic "mRNA lipid nanoparticles vaccine" --max-papers 5 --output mrna_study.json
```
Once generated, you can open BioGraph Studio, click **"Graph Any Data"** &rarr; **"JSON Schema"**, paste the JSON, and render the graph!

---

## 4. Method C: Direct NCBI E-utilities & Europe PMC REST APIs

If you are developing custom microservices or scripts, you can query the public biomedical REST APIs directly.

### 4.1. Europe PMC REST API (Recommended for Web Apps — CORS Enabled)

Europe PMC provides open access full-text articles and abstracts with full Cross-Origin Resource Sharing (CORS) headers.

#### Endpoint:
```http
GET https://www.ebi.ac.uk/europepmc/webservices/rest/search?query={QUERY}&format=json&pageSize={LIMIT}&resultType=core
```

#### Example cURL:
```bash
curl -X GET "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=PMC8259047&format=json&pageSize=1&resultType=core" \
     -H "Accept: application/json"
```

#### Extracted JSON Fields:
- `resultList.result[].title`: Title of the paper
- `resultList.result[].abstractText`: Full abstract text
- `resultList.result[].authorString`: Author listing
- `resultList.result[].pmcid`: PubMed Central Identifier (e.g. `PMC8259047`)
- `resultList.result[].doi`: Digital Object Identifier

---

### 4.2. NCBI Entrez E-utilities (Official NIH / NLM API)

#### Step 1: Search for PMIDs or PMCIDs with `esearch`
```bash
curl "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pmc&term=COVID-19+lateral+flow+antigen&retmode=json&retmax=5"
```
Response returns an array of `idlist`:
```json
{
  "esearchresult": {
    "count": "1420",
    "retmax": "5",
    "idlist": ["8259047", "11462910", "8293341"]
  }
}
```

#### Step 2: Fetch Article Summaries with `esummary`
```bash
curl "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pmc&id=8259047,11462910,8293341&retmode=json"
```

#### Step 3: Fetch Full XML or Text with `efetch`
```bash
curl "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pmc&id=8259047&retmode=xml"
```

---

## 5. Entity & Relationship Extraction Architecture

When scientific abstracts and titles are received, the parsing engine runs a 3-stage entity-relationship extraction:

1. **Entity Identification**:
   - Detects proteins, genes, receptors, assays, drugs, diseases, and specimens using biological dictionaries and MeSH terminology.
2. **Category Classification**:
   - Assigns each entity to a standardized color-coded category (`Gene / Protein`, `Host Receptor / Enzyme`, `Diagnostic Assay`, `Disease / Pathology`, `Drug / Therapeutic`, `Specimen / Matrix`, `Clinical Metric`).
3. **Sentence Co-occurrence & Predicate Mapping**:
   - Analyzes sentences containing co-occurring entities to extract directional relationships using regex predicate matching:
     - `binds to`, `interacts with` &rarr; **Binds to**
     - `inhibits`, `blocks`, `suppresses` &rarr; **Inhibits**
     - `activates`, `upregulates`, `promotes` &rarr; **Activates / Upregulates**
     - `detects`, `screens for`, `quantifies` &rarr; **Detects / Quantifies**
     - `causes`, `leads to`, `results in` &rarr; **Causes / Mediates**
     - `expressed in`, `localized in` &rarr; **Expressed in**

---

## 6. Supported Data Formats for the Graphing Model

You can input custom data into the BioGraph Studio graphing model in any of the following 3 formats:

### Format 1: Natural Triplets (Easiest for Manual Entry)
One relationship per line in `Subject -> Object : Relationship` or `Subject | Object | Relationship`:
```text
SARS-CoV-2 -> Spike Protein : Encodes
Spike Protein -> ACE2 Receptor : Binds with high affinity
ACE2 Receptor -> Upper Airway Epithelium : Expressed on cell surface
Pfizer BNT162b2 -> Spike Protein : Elicits neutralizing antibodies
Remdesivir -> RNA Polymerase : Chain termination inhibition
```

### Format 2: JSON Schema (Full Control)
```json
{
  "meta": {
    "title": "My Custom Knowledge Graph",
    "summary": "Custom extracted network description."
  },
  "nodes": [
    { "id": "ACE2", "name": "ACE2 Receptor", "category": "Host Receptor / Enzyme", "desc": "Cellular receptor" },
    { "id": "Spike", "name": "Spike Protein", "category": "Viral Target", "desc": "Viral glycoprotein" }
  ],
  "links": [
    { "source": "Spike", "target": "ACE2", "relationship": "Binds to" }
  ]
}
```

### Format 3: CSV Format
```csv
source,target,relationship,sourceCategory,targetCategory
ACE2,SARS-CoV-2,Receptor Binding,Host Receptor / Enzyme,Viral Target
SARS-CoV-2,COVID-19,Etiological Cause,Viral Target,Disease / Pathology
PanBio RAT,Nucleocapsid Protein,Detects Antigen,Diagnostic Assay,Viral Target
```

---

## 7. Pre-Loaded Literature Datasets

BioGraph Studio comes pre-configured with four built-in datasets:

1. **🔬 Multi-Paper Synthesis**: Interconnects all 3 PMC papers into a unified 35-entity, 60-link network showing the complete chain from viral entry (`ACE2` & `Spike`), to diagnostic testing (`LFIAs` & `RT-PCR`), and pediatric immunology (`Type I IFN` & `Memory T-cells`).
2. **📑 PMC8259047**: *Operational characteristics of 30 lateral flow immunoassays used to identify COVID-19 immune response* (David, Mayne et al., J. Immunol Methods).
3. **📑 PMC11462910**: *Comparison of diagnostic accuracy of rapid antigen tests for COVID-19 compared to the viral genetic test in adults: a systematic review and meta-analysis* (Hirabayashi, DeArmond, Stone et al., JBI Evid Synth).
4. **📑 PMC8293341**: *Innate Immunity in Children and the Role of ACE2 Expression in SARS-CoV-2 Infection* (Dioguardi, Cazzolla et al., Pediatr Rep).
5. **✨ Custom User Graph Data**: Real-time modeling for any data or live PMC queries.

---

## 8. Running the Application Locally

1. Open [`graphing-model/demo.html`](demo.html) directly in any web browser or serve via HTTP:
   ```bash
   # Using Python built-in server:
   python -m http.server 5500
   ```
2. Navigate to:
   ```
   http://127.0.0.1:5500/graphing-model/demo.html
   ```
3. Use the navigation links to explore between **BioSearch Home**, **3D Models**, **Interactive Threat Map**, and **BioGraph Studio**!
