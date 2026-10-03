#!/usr/bin/env python3
"""
Dynamic Scientific Paper Fetcher & Biomedical Knowledge Graph Generator
======================================================================
This script searches PubMed Central (PMC) or Europe PMC for papers on ANY topic,
extracts biological/clinical entities and relationships from titles & abstracts,
and outputs a ready-to-visualize dataset for the BioGraph Studio graphing model.

Usage:
    python fetch_pmc_and_generate_graph.py --topic "CRISPR-Cas9 gene editing" --max-papers 5 --output crispr_graph.json
    python fetch_pmc_and_generate_graph.py --topic "mRNA vaccine lipid nanoparticles" --format triplets
"""

import os
import sys
import json
import re
import argparse
import urllib.request
import urllib.parse
from typing import List, Dict, Any, Tuple, Optional

# Common biomedical keywords and stop-terms for regex entity matching
BIOMED_CATEGORIES = {
    "Gene / Protein": [
        "cas9", "crispr", "ace2", "tp53", "brca1", "brca2", "egfr", "kras", "p21", "myc",
        "rad51", "parp1", "spike", "nucleocapsid", "envelope", "membrane", "interferon",
        "interleukin", "il-6", "tnf", "nf-kb", "stat3", "cd4", "cd8", "pd-1", "pdl1"
    ],
    "Host Receptor / Enzyme": [
        "receptor", "tmprss2", "polymerase", "protease", "kinase", "hydrolase", "synthase",
        "integrase", "helicase", "transcriptase", "ligase"
    ],
    "Diagnostic Assay": [
        "rt-pcr", "pcr", "elisa", "lfia", "antigen test", "rapid test", "sequencing",
        "qpcr", "western blot", "flow cytometry", "mass spectrometry", "immuno-assay"
    ],
    "Disease / Pathology": [
        "covid-19", "sars-cov-2", "infection", "cancer", "carcinoma", "lymphoma", "melanoma",
        "cytokine storm", "mis-c", "pneumonia", "ards", "sepsis", "inflammation", "tumor"
    ],
    "Drug / Therapeutic": [
        "vaccine", "antibody", "monoclonal", "inhibitor", "remdesivir", "paxlovid", "mrna",
        "dexamethasone", "tocilizumab", "nirmatrelvir", "bnt162b2", "chemotherapy"
    ],
    "Specimen / Matrix": [
        "serum", "plasma", "nasopharyngeal", "saliva", "blood", "epithelium", "mucosa",
        "swab", "tissue", "biopsy"
    ]
}

RELATION_PATTERNS = [
    (r"(?:binds to|interacts with|complexes with)", "Binds to"),
    (r"(?:inhibits|blocks|suppresses|attenuates)", "Inhibits"),
    (r"(?:activates|upregulates|enhances|promotes|induces)", "Activates / Upregulates"),
    (r"(?:detects|measures|identifies|screens for)", "Detects / Quantifies"),
    (r"(?:causes|leads to|results in|drives)", "Causes / Mediates"),
    (r"(?:regulates|modulates|controls)", "Regulates"),
    (r"(?:targets|cleaves|phosphorylates)", "Targets"),
    (r"(?:cleaves|primes)", "Cleaves / Primes"),
    (r"(?:expressed in|localized in|found in)", "Expressed in"),
    (r"(?:evaluated in|tested against|compared to)", "Evaluated against")
]


def search_europe_pmc(topic: str, max_results: int = 5) -> List[Dict[str, Any]]:
    """Query Europe PMC REST API (covers PMC open access and PubMed)."""
    encoded_topic = urllib.parse.quote(topic)
    url = f"https://www.ebi.ac.uk/europepmc/webservices/rest/search?query={encoded_topic}&format=json&pageSize={max_results}&resultType=core"
    
    print(f"[*] Querying Europe PMC API for topic: '{topic}'...")
    req = urllib.request.Request(url, headers={"User-Agent": "BioSearch-Graphing-Model/1.0"})
    
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            results = data.get("resultList", {}).get("result", [])
            print(f"[+] Found {len(results)} scientific articles.")
            return results
    except Exception as e:
        print(f"[-] Europe PMC query error: {e}. Trying fallback...")
        return search_ncbi_eutils(topic, max_results)


def search_ncbi_eutils(topic: str, max_results: int = 5) -> List[Dict[str, Any]]:
    """Fallback query to NCBI Entrez E-utilities API."""
    encoded_topic = urllib.parse.quote(topic)
    esearch_url = f"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pmc&term={encoded_topic}&retmode=json&retmax={max_results}"
    
    print(f"[*] Querying NCBI E-utilities for topic: '{topic}'...")
    req = urllib.request.Request(esearch_url, headers={"User-Agent": "BioSearch-Graphing-Model/1.0"})
    
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            id_list = data.get("esearchresult", {}).get("idlist", [])
            if not id_list:
                return []
            
            # Fetch summary
            ids_str = ",".join(id_list)
            esummary_url = f"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pmc&id={ids_str}&retmode=json"
            with urllib.request.urlopen(esummary_url, timeout=15) as sum_resp:
                sum_data = json.loads(sum_resp.read().decode('utf-8'))
                docs = sum_data.get("result", {})
                articles = []
                for uid in id_list:
                    item = docs.get(uid, {})
                    articles.append({
                        "title": item.get("title", ""),
                        "abstractText": item.get("summary", ""),
                        "authorString": item.get("authors", [{}])[0].get("name", "Unknown") if item.get("authors") else "Unknown",
                        "pmcid": f"PMC{uid}",
                        "doi": item.get("articleids", [{}])[0].get("value", "") if item.get("articleids") else ""
                    })
                return articles
    except Exception as e:
        print(f"[-] NCBI E-utilities error: {e}")
        return []


def infer_entity_category(name: str) -> str:
    """Classifies entity into standard BioGraph categories."""
    lower = name.lower()
    for cat, keywords in BIOMED_CATEGORIES.items():
        for kw in keywords:
            if kw in lower:
                return cat
    return "Gene / Protein"


def extract_entities_and_relations(articles: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Extracts paper nodes, biological entities, and directional relationships
    from scientific articles.
    """
    nodes_map: Dict[str, Dict[str, Any]] = {}
    links: List[Dict[str, str]] = []

    for art in articles:
        pmcid = art.get("pmcid") or art.get("id") or "Paper"
        title = art.get("title", "").strip().rstrip(".")
        abstract = art.get("abstractText", "") or ""
        author = art.get("authorString", "Researchers et al.")
        if "," in author:
            author = author.split(",")[0] + " et al."
        doi = art.get("doi", "")

        paper_id = pmcid
        paper_label = f"{author} ({pmcid})"
        
        # 1. Add paper node
        nodes_map[paper_id] = {
            "id": paper_id,
            "name": paper_label,
            "category": "Publication",
            "desc": f"{title}. DOI: {doi}"
        }

        full_text = f"{title}. {abstract}"
        sentences = re.split(r"[.!?]\s+", full_text)

        # Collect entities present in this paper
        detected_entities: List[Tuple[str, str]] = []
        for cat, keywords in BIOMED_CATEGORIES.items():
            for kw in keywords:
                pattern = r"\b" + re.escape(kw) + r"\b"
                match = re.search(pattern, full_text, re.IGNORECASE)
                if match:
                    matched_text = match.group(0).capitalize()
                    if matched_text not in [e[0] for e in detected_entities]:
                        detected_entities.append((matched_text, cat))

        # Register entities
        for ent_name, cat in detected_entities:
            if ent_name not in nodes_map:
                nodes_map[ent_name] = {
                    "id": ent_name,
                    "name": ent_name,
                    "category": cat,
                    "desc": f"Biomedical entity analyzed in {pmcid}."
                }
            # Link paper to entity
            links.append({
                "source": paper_id,
                "target": ent_name,
                "relationship": "Investigates / Reports"
            })

        # Find relationships between co-occurring entities in the same sentence
        for sent in sentences:
            sent_lower = sent.lower()
            matching_in_sent = [e[0] for e in detected_entities if re.search(r"\b" + re.escape(e[0].lower()) + r"\b", sent_lower)]
            
            if len(matching_in_sent) >= 2:
                # Determine relationship verb
                rel_label = "Correlated with"
                for rel_pat, label in RELATION_PATTERNS:
                    if re.search(rel_pat, sent_lower):
                        rel_label = label
                        break
                
                # Pair consecutive entities
                for i in range(len(matching_in_sent) - 1):
                    s = matching_in_sent[i]
                    t = matching_in_sent[i + 1]
                    if s != t:
                        links.append({
                            "source": s,
                            "target": t,
                            "relationship": rel_label
                        })

    # Deduplicate links
    unique_links = []
    seen = set()
    for l in links:
        key = (l["source"], l["target"], l["relationship"])
        if key not in seen and l["source"] != l["target"]:
            seen.add(key)
            unique_links.append(l)

    return {
        "meta": {
            "title": f"Dynamic Knowledge Graph: {len(articles)} Papers",
            "articles": [a.get("title", "") for a in articles],
            "pmc_ids": [a.get("pmcid", "") for a in articles if a.get("pmcid")]
        },
        "nodes": list(nodes_map.values()),
        "links": unique_links
    }



def extract_entities_with_gemini(articles: List[Dict[str, Any]], topic: str, api_key: str, model: str = "") -> Optional[Dict[str, Any]]:
    """
    Calls Google Gemini API (gemini-3.1-flash-lite) to extract biological entities and relationships
    from scientific articles with structured JSON output matching BioSearch demo graph fidelity.
    """
    chosen_model = (model or os.environ.get("GEMINI_MODEL") or "gemini-3.1-flash-lite").strip()
    print(f"[*] Querying Google Gemini API ({chosen_model}) to extract biological entities for '{topic}'...")

    id_alias_map = {}
    papers_summary = []
    paper_ids_list = []

    for i, a in enumerate(articles):
        raw_id = str(a.get("pmcid") or a.get("id") or f"Paper_{i+1}").strip()
        pmc_id = raw_id if raw_id.startswith("PMC") else ("PMC" + raw_id)
        bare_id = raw_id.replace("PMC", "")

        author = a.get("authorString", "Researchers et al.")
        if "," in author:
            author = author.split(",")[0] + " et al."
        paper_label = f"{author} ({pmc_id})"

        id_alias_map[raw_id] = pmc_id
        id_alias_map[bare_id] = pmc_id
        id_alias_map[pmc_id] = pmc_id
        id_alias_map[f"Paper_{i+1}"] = pmc_id
        paper_ids_list.append(pmc_id)

        title = a.get("title", "Untitled")
        abstract = (a.get("abstractText") or title)[:1500]
        papers_summary.append(f"[PAPER {i+1}]\nID: {pmc_id}\nCitation: {paper_label}\nTitle: {title}\nAbstract: {abstract}")

    prompt = f"""You are a world-class bioinformatician and biomedical knowledge graph engineer.
Analyze these open-access scientific publications retrieved from Europe PMC/PubMed for the research query: "{topic}".

RESEARCH PAPERS:
{chr(10).join(papers_summary)}

CRITICAL ARCHITECTURE REQUIREMENT (DEMO GRAPH FIDELITY):
Just like the BioSearch flagship demo graph (which models detailed scientific constellations around each publication), you MUST scrape and extract 4 to 6 specific, high-value grounded nodes FOR EACH RESEARCH PAPER above:

1. A "Publication" node for the paper itself (use the exact paper ID provided: {', '.join(paper_ids_list)}).
2. Diagnostic Assay / Technology / Experimental Platform investigated in that paper (e.g. specific test name, assay kit, sequencing platform, therapeutic delivery system).
3. Biological Target / Gene / Protein / Host Receptor / Enzyme examined in that paper (e.g. viral spike, nucleocapsid, host ACE2, TMPRSS2, cytokines, Cas9, guide RNA).
4. Specific Clinical Metric / Quantitative Finding / Variable discovered in that paper (e.g. sensitivity %, specificity, cycle threshold Ct < 25, read time, antibody titer, off-target rate).
5. Specimen / Biological Matrix / Patient Cohort tested in that paper (e.g. nasopharyngeal swab, capillary blood, serum, pediatric cohort, saliva, tissue).
6. Clinical Outcome / Disease State / Regulatory Guideline addressed (e.g. seroconversion, WHO target, SAHPRA approval, mild COVID-19, primary hyperoxaluria).

MANDATORY GRAPH RELATIONSHIPS (EDGES):
1. Paper-to-Entity Links:
   EVERY paper node MUST have direct outgoing edges to ALL of the specific entities extracted from that paper!
   Use descriptive relationships:
   - Paper -> Assay: "Evaluates operational accuracy" / "Deploys methodology"
   - Paper -> Target/Gene: "Investigates target antigen" / "Profiles target gene"
   - Paper -> Metric: "Discovers clinical finding" / "Measures threshold"
   - Paper -> Specimen: "Validated on clinical specimen" / "Tests patient cohort"
   - Paper -> Guideline/Outcome: "Benchmarks against standard" / "Reports clinical outcome"
2. Entity-to-Entity & Cross-Paper Links:
   Create 8 to 18 high-value biological & scientific links between entities (within and across papers that share biology or targets):
   - Assay -> Target: "Detects / Captures"
   - Target -> Receptor: "Binds with high affinity to"
   - Receptor -> Outcome: "Mediates viral entry"
   - Assay -> Metric: "Achieves pooled sensitivity"
   - Metric -> Guideline: "Exceeds threshold criteria"
   - Assay -> Specimen: "Requires matrix"

ALLOWED CATEGORIES (Strictly use these exact strings):
'Publication', 'Diagnostic Assay', 'Viral Target', 'Host Receptor / Enzyme', 'Immune Response',
'Clinical Metric / Variable', 'Regulatory / Guideline', 'Disease / Pathology', 'Specimen / Matrix', 'Gene / Protein', 'Drug / Therapeutic', 'Other'

Return STRICT JSON:
{{
  "nodes": [
    {{ "id": "PMC_ID", "name": "Author et al. (PMC_ID)", "category": "Publication", "desc": "Summary of paper..." }},
    {{ "id": "EntityId", "name": "Display Name", "category": "CategoryName", "desc": "Brief scientific role or finding..." }}
  ],
  "links": [
    {{ "source": "PMC_ID", "target": "EntityId", "relationship": "RelationshipLabel" }}
  ]
}}"""

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{chosen_model}:generateContent?key={api_key}"
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseMimeType": "application/json",
            "temperature": 0.15
        }
    }

    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode('utf-8'),
        headers={"Content-Type": "application/json"}
    )

    try:
        with urllib.request.urlopen(req, timeout=35) as resp:
            res_data = json.loads(resp.read().decode('utf-8'))
            text = res_data["candidates"][0]["content"]["parts"][0]["text"]
            parsed = json.loads(text)

            node_map = {}

            # Pre-register publication nodes
            for idx, a in enumerate(articles):
                canonical_id = paper_ids_list[idx]
                author = a.get("authorString", "Researchers et al.")
                if "," in author:
                    author = author.split(",")[0] + " et al."
                node_map[canonical_id] = {
                    "id": canonical_id,
                    "name": f"{author} ({canonical_id})",
                    "category": "Publication",
                    "desc": f"{a.get('title', '')}. Source: Europe PMC."
                }

            # Register extracted entities
            for n in parsed.get("nodes", []):
                nid = n.get("id")
                if not nid:
                    continue
                norm_id = id_alias_map.get(nid, nid)
                if norm_id in node_map and node_map[norm_id]["category"] == "Publication":
                    if n.get("desc"):
                        node_map[norm_id]["desc"] = n["desc"]
                    if n.get("name") and len(n["name"]) > 5:
                        node_map[norm_id]["name"] = n["name"]
                else:
                    node_map[norm_id] = {
                        "id": norm_id,
                        "name": n.get("name", norm_id),
                        "category": n.get("category", "Other"),
                        "desc": n.get("desc", f"Entity analyzed in research on {topic}.")
                    }

            valid_links = []
            seen_links = set()
            for l in parsed.get("links", []):
                s = id_alias_map.get(l.get("source"), l.get("source"))
                t = id_alias_map.get(l.get("target"), l.get("target"))
                if s in node_map and t in node_map and s != t:
                    k = (s, t)
                    rev_k = (t, s)
                    if k not in seen_links and rev_k not in seen_links:
                        seen_links.add(k)
                        valid_links.append({
                            "source": s,
                            "target": t,
                            "relationship": l.get("relationship", "Interacts with")
                        })

            # Safety net: ensure every paper node has at least 3 connections
            for idx, a in enumerate(articles):
                canonical_id = paper_ids_list[idx]
                existing = [l for l in valid_links if l["source"] == canonical_id or l["target"] == canonical_id]
                if len(existing) < 3:
                    text_blob = f"{a.get('title', '')} {a.get('abstractText', '')}".lower()
                    for eid, entity in node_map.items():
                        if entity["category"] == "Publication" or eid == canonical_id:
                            continue
                        if entity["name"].lower() in text_blob or eid.lower() in text_blob:
                            k = (canonical_id, eid)
                            rev_k = (eid, canonical_id)
                            if k not in seen_links and rev_k not in seen_links:
                                seen_links.add(k)
                                rel = "Investigates / Evaluates"
                                cat = entity["category"]
                                if cat == "Diagnostic Assay":
                                    rel = "Deploys methodology"
                                elif cat in ("Viral Target", "Host Receptor / Enzyme", "Gene / Protein"):
                                    rel = "Investigates target biomolecule"
                                elif cat == "Clinical Metric / Variable":
                                    rel = "Reports clinical finding"
                                elif cat == "Specimen / Matrix":
                                    rel = "Validated on specimen"
                                elif cat == "Regulatory / Guideline":
                                    rel = "Benchmarks against standard"
                                valid_links.append({
                                    "source": canonical_id,
                                    "target": eid,
                                    "relationship": rel
                                })

            return {
                "meta": {
                    "title": f"Gemini Knowledge Graph: {topic}",
                    "articles": [a.get("title", "") for a in articles],
                    "pmc_ids": paper_ids_list,
                    "engine": f"Google Gemini ({chosen_model})"
                },
                "nodes": list(node_map.values()),
                "links": valid_links
            }
    except Exception as e:
        print(f"[-] Gemini API query error: {e}. Falling back to rule-based extractor.")
        return None


def to_triplets_format(graph: Dict[str, Any]) -> str:
    """Converts graph into simple natural triplet format (Subject -> Target : Relationship)."""
    lines = []
    for l in graph["links"]:
        lines.append(f"{l['source']} -> {l['target']} : {l['relationship']}")
    return "\n".join(lines)


def load_env_file(filepath: str = ".env"):
    """Loads key=value pairs from a .env file into os.environ if not already set."""
    candidates = [
        filepath,
        os.path.join("..", filepath),
        os.path.join(os.path.dirname(__file__), "..", filepath),
        os.path.join(os.path.dirname(__file__), filepath)
    ]
    for path in candidates:
        if os.path.exists(path) and os.path.isfile(path):
            try:
                with open(path, "r", encoding="utf-8") as f:
                    for line in f:
                        line = line.strip()
                        if line and not line.startswith("#") and "=" in line:
                            k, v = line.split("=", 1)
                            k = k.strip()
                            v = v.strip().strip('"').strip("'")
                            if k and k not in os.environ and v:
                                os.environ[k] = v
                break
            except Exception:
                pass


def main():
    load_env_file()
    parser = argparse.ArgumentParser(description="Fetch papers dynamically and generate BioGraph data")
    parser.add_argument("--topic", type=str, default="COVID-19 rapid antigen tests ACE2 immunity",
                        help="Medical/biological query term or topic")
    parser.add_argument("--max-papers", type=int, default=5, help="Maximum number of papers to retrieve")
    parser.add_argument("--gemini-api-key", type=str, default="",
                        help="Optional Google Gemini API key to extract entities via LLM")
    parser.add_argument("--model", type=str, default="",
                        help="Google Gemini model identifier (default: gemini-3.1-flash-lite or $GEMINI_MODEL)")
    parser.add_argument("--output", type=str, default="", help="Filepath to save output (.json or .txt)")
    parser.add_argument("--format", choices=["json", "triplets"], default="json",
                        help="Output format: json (for direct import) or triplets (human readable)")
    
    args = parser.parse_args()

    articles = search_europe_pmc(args.topic, args.max_papers)
    if not articles:
        print("[-] No papers found. Try adjusting the query string.")
        sys.exit(1)

    api_key = args.gemini_api_key or os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    model = args.model or os.environ.get("GEMINI_MODEL", "gemini-3.1-flash-lite")
    graph_data = None
    if api_key:
        graph_data = extract_entities_with_gemini(articles, args.topic, api_key, model=model)

    if not graph_data:
        graph_data = extract_entities_and_relations(articles)

    print(f"[+] Successfully generated graph with {len(graph_data['nodes'])} nodes and {len(graph_data['links'])} relationships!")

    if args.format == "triplets":
        out_content = to_triplets_format(graph_data)
    else:
        out_content = json.dumps(graph_data, indent=2)

    if args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            f.write(out_content)
        print(f"[+] Output written to: {args.output}")
    else:
        print("\n=== GENERATED DATA SAMPLE ===")
        print(out_content[:800] + ("\n... [truncated]" if len(out_content) > 800 else ""))
        print("\nTip: Copy and paste this directly into BioGraph Studio > 'Graph Any Data'!")


if __name__ == "__main__":
    main()
