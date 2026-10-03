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

import sys
import json
import re
import argparse
import urllib.request
import urllib.parse
from typing import List, Dict, Any, Tuple

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


def to_triplets_format(graph: Dict[str, Any]) -> str:
    """Converts graph into simple natural triplet format (Subject -> Target : Relationship)."""
    lines = []
    for l in graph["links"]:
        lines.append(f"{l['source']} -> {l['target']} : {l['relationship']}")
    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(description="Fetch papers dynamically and generate BioGraph data")
    parser.add_argument("--topic", type=str, default="COVID-19 rapid antigen tests ACE2 immunity",
                        help="Medical/biological query term or topic")
    parser.add_argument("--max-papers", type=int, default=5, help="Maximum number of papers to retrieve")
    parser.add_argument("--output", type=str, default="", help="Filepath to save output (.json or .txt)")
    parser.add_argument("--format", choices=["json", "triplets"], default="json",
                        help="Output format: json (for direct import) or triplets (human readable)")
    
    args = parser.parse_args()

    articles = search_europe_pmc(args.topic, args.max_papers)
    if not articles:
        print("[-] No papers found. Try adjusting the query string.")
        sys.exit(1)

    graph_data = extract_entities_and_relations(articles)
    print(f"[+] Successfully extracted {len(graph_data['nodes'])} nodes and {len(graph_data['links'])} relationships!")

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
