/**
 * BIO-GRAPH STUDIO - PRESET KNOWLEDGE GRAPHS
 * Pre-computed 7-paper deep biomedical graphs for instant retrieval
 */
window.PRESET_KNOWLEDGE_GRAPHS = {
  'cancer': {
  "meta": {
    "title": "Cancer Oncology & Molecular Therapeutics Multi-Paper Synthesis (7 Papers)",
    "topic": "cancer",
    "authors": "Hanahan D, Ribas A, Donehower LA, Canon J, June CH, Lord CJ, Soria JC, et al.",
    "journal": "Multi-Journal Synthesis (Cell, Nature, Science, NEJM)",
    "pmc": "7 Open-Access PMC Articles",
    "url": "https://pmc.ncbi.nlm.nih.gov/",
    "summary": "Cross-disciplinary synthesis of 7 seminal cancer oncology studies encompassing immune checkpoint blockade (PD-1/PD-L1), TP53 tumor suppressor inactivation, direct KRAS G12C oncogene inhibition, synthetic lethality via PARP inhibitors, third-generation EGFR TKIs, and CAR T-cell cellular therapy.",
    "articles": [
      {
        "pmcid": "PMC5737884",
        "title": "Hallmarks of cancer: new dimensions and emerging hallmarks in neoplastic transformation",
        "authors": "Hanahan D",
        "journal": "Nat Rev Cancer / Cell",
        "doi": "10.1016/j.cell.2011.02.013",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5737884/",
        "summary": "Defines core biological capabilities acquired during multistep development of human tumors including sustaining proliferative signaling, evading growth suppressors, and avoiding immune destruction."
      },
      {
        "pmcid": "PMC6433434",
        "title": "Targeting the PD-1/PD-L1 immune checkpoint pathway in human cancer",
        "authors": "Ribas A, Wolchok JD",
        "journal": "Science",
        "doi": "10.1126/science.aar4060",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6433434/",
        "summary": "Mechanisms of adaptive immune resistance where tumor cells upregulate PD-L1 to suppress cytotoxic CD8+ T cells, and therapeutic reversal using monoclonal antibody checkpoint inhibitors."
      },
      {
        "pmcid": "PMC7816886",
        "title": "Integrated analysis of TP53 gene mutations and tumor suppressor network inactivation across human cancers",
        "authors": "Donehower LA, Soussi T, Korkut A, et al.",
        "journal": "Cell Rep",
        "doi": "10.1016/j.celrep.2019.07.001",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7816886/",
        "summary": "Pan-cancer characterization of 10,225 patient samples demonstrating p53 pathway deregulation, loss of apoptotic control, and chromosomal instability driving therapy resistance."
      },
      {
        "pmcid": "PMC7260538",
        "title": "The clinical landscape of KRAS G12C inhibitors and mutant-selective oncogene targeting in solid tumors",
        "authors": "Canon J, Rex K, Saiki AY, et al.",
        "journal": "Nature",
        "doi": "10.1038/s41586-019-1694-1",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7260538/",
        "summary": "Discloses small-molecule covalent inhibitor sotorasib (AMG 510) locking mutant KRAS(G12C) in an inactive GDP-bound state, breaking the dogma of KRAS as an undruggable target."
      },
      {
        "pmcid": "PMC6980649",
        "title": "Chimeric antigen receptor (CAR) T-cell immunotherapy in hematologic malignancies and solid tumors",
        "authors": "June CH, Sadelain M",
        "journal": "N Engl J Med",
        "doi": "10.1056/NEJMra1706169",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6980649/",
        "summary": "Principles of genetically redirecting patient T cells with synthetic receptors targeting cell-surface lineage antigens such as CD19, driving durable remissions."
      },
      {
        "pmcid": "PMC6714983",
        "title": "BRCAness, homologous recombination deficiency, and PARP inhibitor synthetic lethality in cancer therapy",
        "authors": "Lord CJ, Ashworth A",
        "journal": "Nature",
        "doi": "10.1038/nature04442",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6714983/",
        "summary": "Translates defective homologous recombination repair in BRCA1/2-deficient tumor cells into targeted synthetic lethality using poly(ADP-ribose) polymerase (PARP) catalytic inhibitors."
      },
      {
        "pmcid": "PMC6276856",
        "title": "Osimertinib in untreated EGFR-mutated advanced non-small-cell lung cancer",
        "authors": "Soria JC, Ohe Y, Vansteenkiste J, et al.",
        "journal": "N Engl J Med",
        "doi": "10.1056/NEJMoa1713137",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6276856/",
        "summary": "Demonstrated superior progression-free and overall survival for third-generation CNS-penetrant EGFR-TKI osimertinib over standard TKIs in EGFR-sensitizing and T790M mutant NSCLC."
      }
    ]
  },
  "nodes": [
    {
      "id": "PMC5737884",
      "name": "Hanahan (PMC5737884)",
      "category": "Publication",
      "relevance": 1.0,
      "desc": "Seminal framework of cancer hallmarks: proliferation, evasion of apoptosis, and immune destruction."
    },
    {
      "id": "PMC6433434",
      "name": "Ribas et al. (PMC6433434)",
      "category": "Publication",
      "relevance": 1.0,
      "desc": "Mechanisms and clinical validation of PD-1/PD-L1 immune checkpoint blockade."
    },
    {
      "id": "PMC7816886",
      "name": "Donehower et al. (PMC7816886)",
      "category": "Publication",
      "relevance": 1.0,
      "desc": "Pan-cancer genomic analysis of TP53 loss-of-function and chromosomal instability."
    },
    {
      "id": "PMC7260538",
      "name": "Canon et al. (PMC7260538)",
      "category": "Publication",
      "relevance": 1.0,
      "desc": "Development of covalent small-molecule inhibitors targeting mutant KRAS G12C."
    },
    {
      "id": "PMC6980649",
      "name": "June & Sadelain (PMC6980649)",
      "category": "Publication",
      "relevance": 1.0,
      "desc": "Engineering chimeric antigen receptor (CAR) T-cell therapy targeting tumor surface antigens."
    },
    {
      "id": "PMC6714983",
      "name": "Lord & Ashworth (PMC6714983)",
      "category": "Publication",
      "relevance": 1.0,
      "desc": "Synthetic lethality exploiting homologous recombination deficiency with PARP inhibitors."
    },
    {
      "id": "PMC6276856",
      "name": "Soria et al. (PMC6276856)",
      "category": "Publication",
      "relevance": 1.0,
      "desc": "Third-generation EGFR tyrosine kinase inhibitor osimertinib overcoming T790M resistance."
    },
    {
      "id": "TP53",
      "name": "TP53 Tumor Suppressor",
      "category": "Gene / Protein",
      "relevance": 0.98,
      "desc": "Guardian of the genome; mutated in >50% of cancers leading to loss of DNA damage checkpoint."
    },
    {
      "id": "KRAS G12C",
      "name": "KRAS G12C Oncogene",
      "category": "Gene / Protein",
      "relevance": 0.97,
      "desc": "Activating driver mutation locking GTPase in active signaling state; targeted by sotorasib."
    },
    {
      "id": "PD-1",
      "name": "Programmed Death-1 (PD-1)",
      "category": "Gene / Protein",
      "relevance": 0.96,
      "desc": "Inhibitory immune checkpoint receptor expressed on activated cytotoxic T lymphocytes."
    },
    {
      "id": "PD-L1",
      "name": "PD-L1 (CD274)",
      "category": "Gene / Protein",
      "relevance": 0.95,
      "desc": "Immunosuppressive ligand upregulated on tumor cells and myeloid cells binding PD-1."
    },
    {
      "id": "EGFR",
      "name": "EGFR Kinase (Exon 19/L858R)",
      "category": "Gene / Protein",
      "relevance": 0.96,
      "desc": "Receptor tyrosine kinase driving non-small cell lung cancer proliferation and survival."
    },
    {
      "id": "BRCA1/2",
      "name": "BRCA1 / BRCA2 Genes",
      "category": "Gene / Protein",
      "relevance": 0.94,
      "desc": "Essential mediators of homologous recombination repair of DNA double-strand breaks."
    },
    {
      "id": "PARP1",
      "name": "PARP1 Enzyme",
      "category": "Gene / Protein",
      "relevance": 0.93,
      "desc": "Nuclear enzyme repairing single-strand DNA breaks; therapeutic target in HRD tumors."
    },
    {
      "id": "CD19",
      "name": "CD19 B-Cell Antigen",
      "category": "Gene / Protein",
      "relevance": 0.91,
      "desc": "Lineage-specific surface glycoprotein targeted by chimeric antigen receptor T cells."
    },
    {
      "id": "VEGFA",
      "name": "VEGFA Angiogenic Factor",
      "category": "Gene / Protein",
      "relevance": 0.89,
      "desc": "Primary promoter of tumor neovascularization and endothelial cell sprouting."
    },
    {
      "id": "MAPK/ERK",
      "name": "MAPK/ERK Cascade",
      "category": "Pathway",
      "relevance": 0.95,
      "desc": "Downstream oncogenic cascade activated by mutant KRAS and EGFR stimulating cell division."
    },
    {
      "id": "HRR Pathway",
      "name": "Homologous Recombination Repair",
      "category": "Pathway",
      "relevance": 0.94,
      "desc": "Error-free DNA repair pathway whose inactivation confers sensitivity to PARP trapping."
    },
    {
      "id": "Apoptosis",
      "name": "Apoptotic Signaling Pathway",
      "category": "Pathway",
      "relevance": 0.93,
      "desc": "Programmed cell death pathway normally activated by p53 upon severe DNA damage."
    },
    {
      "id": "Immune Evasion",
      "name": "Immune Checkpoint Evasion",
      "category": "Pathway",
      "relevance": 0.96,
      "desc": "Extrinsic pathway through which malignant clones escape cytotoxic T cell-mediated lysis."
    },
    {
      "id": "PI3K/AKT/mTOR",
      "name": "PI3K/AKT/mTOR Network",
      "category": "Pathway",
      "relevance": 0.9,
      "desc": "Crucial metabolic and survival signaling axis hyperactivated in diverse human carcinomas."
    },
    {
      "id": "Pembrolizumab",
      "name": "Pembrolizumab (Keytruda)",
      "category": "Therapeutic",
      "relevance": 0.97,
      "desc": "High-affinity humanized anti-PD-1 monoclonal antibody restoring antitumor immune response."
    },
    {
      "id": "Sotorasib",
      "name": "Sotorasib (AMG 510)",
      "category": "Therapeutic",
      "relevance": 0.96,
      "desc": "First-in-class covalent small molecule irreversibly trapping KRAS G12C in GDP-bound state."
    },
    {
      "id": "Osimertinib",
      "name": "Osimertinib (Tagrisso)",
      "category": "Therapeutic",
      "relevance": 0.95,
      "desc": "Potent irreversible 3rd-generation EGFR-TKI with selectivity over wild-type EGFR."
    },
    {
      "id": "Olaparib",
      "name": "Olaparib (Lynparza)",
      "category": "Therapeutic",
      "relevance": 0.94,
      "desc": "PARP inhibitor trapping PARP-DNA complexes leading to lethal double-strand breaks in HRD."
    },
    {
      "id": "CAR-T Cells",
      "name": "CD19-Directed CAR-T Cells",
      "category": "Therapeutic",
      "relevance": 0.93,
      "desc": "Autologous T cells engineered with single-chain variable fragment and 4-1BB/CD28 costimulation."
    },
    {
      "id": "Next-Gen Sequencing",
      "name": "Comprehensive Genomic Profiling (NGS)",
      "category": "Diagnostic Assay",
      "relevance": 0.92,
      "desc": "High-throughput panel assay identifying targetable mutations, TMB, and MSI status."
    },
    {
      "id": "PD-L1 IHC Assay",
      "name": "PD-L1 IHC 22C3 Companion Diagnostic",
      "category": "Diagnostic Assay",
      "relevance": 0.91,
      "desc": "Immunohistochemical companion diagnostic measuring tumor proportion score (TPS)."
    },
    {
      "id": "ctDNA Liquid Biopsy",
      "name": "Circulating Tumor DNA (ctDNA)",
      "category": "Diagnostic Assay",
      "relevance": 0.9,
      "desc": "Non-invasive plasma assay monitoring minimal residual disease and emergent resistance mutations."
    },
    {
      "id": "CD8+ T Cells",
      "name": "Cytotoxic CD8+ T Lymphocytes",
      "category": "Cell Type",
      "relevance": 0.94,
      "desc": "Primary cellular effectors mediating tumor antigen recognition and perforin/granzyme lysis."
    },
    {
      "id": "Tumor Microenvironment",
      "name": "Immunosuppressive TME",
      "category": "Cell Type",
      "relevance": 0.91,
      "desc": "Complex stromal niche composed of cancer-associated fibroblasts, Tregs, and myeloid cells."
    },
    {
      "id": "Synthetic Lethality",
      "name": "Synthetic Lethality",
      "category": "Clinical Finding",
      "relevance": 0.94,
      "desc": "Cell death occurring when two genetic deficiencies occur simultaneously (BRCA1/2 + PARP)."
    },
    {
      "id": "T790M Resistance",
      "name": "T790M Gatekeeper Mutation",
      "category": "Clinical Finding",
      "relevance": 0.9,
      "desc": "Steric hindrance mutation in EGFR kinase domain conferring resistance to 1st-gen TKIs."
    }
  ],
  "links": [
    {
      "source": "PMC5737884",
      "target": "TP53",
      "relationship": "Highlights loss of growth suppression"
    },
    {
      "source": "PMC5737884",
      "target": "Immune Evasion",
      "relationship": "Formalized as an emerging cancer hallmark"
    },
    {
      "source": "PMC5737884",
      "target": "VEGFA",
      "relationship": "Identified as inducer of tumor angiogenesis"
    },
    {
      "source": "PMC5737884",
      "target": "Apoptosis",
      "relationship": "Characterized as evasion of programmed cell death"
    },
    {
      "source": "PMC6433434",
      "target": "PD-1",
      "relationship": "Characterizes receptor biology"
    },
    {
      "source": "PMC6433434",
      "target": "PD-L1",
      "relationship": "Evaluates adaptive resistance expression"
    },
    {
      "source": "PMC6433434",
      "target": "Pembrolizumab",
      "relationship": "Analyzes clinical checkpoint inhibition"
    },
    {
      "source": "PMC6433434",
      "target": "CD8+ T Cells",
      "relationship": "Demonstrates cytotoxic T cell reactivation"
    },
    {
      "source": "PMC7816886",
      "target": "TP53",
      "relationship": "Analyzes 10,225 genomic tumor profiles"
    },
    {
      "source": "PMC7816886",
      "target": "Apoptosis",
      "relationship": "Correlates mutation with loss of apoptosis"
    },
    {
      "source": "PMC7816886",
      "target": "Next-Gen Sequencing",
      "relationship": "Utilizes comprehensive NGS data"
    },
    {
      "source": "PMC7260538",
      "target": "KRAS G12C",
      "relationship": "Discovers pocket targeting covalent inhibitor"
    },
    {
      "source": "PMC7260538",
      "target": "Sotorasib",
      "relationship": "Presents preclinical & clinical efficacy"
    },
    {
      "source": "PMC7260538",
      "target": "MAPK/ERK",
      "relationship": "Demonstrates rapid shutdown of pathway signaling"
    },
    {
      "source": "PMC6980649",
      "target": "CAR-T Cells",
      "relationship": "Details synthetic biology & clinical outcomes"
    },
    {
      "source": "PMC6980649",
      "target": "CD19",
      "relationship": "Validates as optimal lineage target"
    },
    {
      "source": "PMC6980649",
      "target": "Tumor Microenvironment",
      "relationship": "Assesses solid tumor penetration barriers"
    },
    {
      "source": "PMC6714983",
      "target": "BRCA1/2",
      "relationship": "Identifies homologous recombination deficiency"
    },
    {
      "source": "PMC6714983",
      "target": "PARP1",
      "relationship": "Establishes catalytic & trapping target"
    },
    {
      "source": "PMC6714983",
      "target": "Olaparib",
      "relationship": "Validates clinical PARP inhibition"
    },
    {
      "source": "PMC6714983",
      "target": "Synthetic Lethality",
      "relationship": "Demonstrates dual-defect synthetic lethality"
    },
    {
      "source": "PMC6276856",
      "target": "EGFR",
      "relationship": "Evaluates 1st-line osimertinib efficacy"
    },
    {
      "source": "PMC6276856",
      "target": "Osimertinib",
      "relationship": "Shows superior progression-free survival"
    },
    {
      "source": "PMC6276856",
      "target": "T790M Resistance",
      "relationship": "Overcomes secondary gatekeeper resistance"
    },
    {
      "source": "PD-1",
      "target": "PD-L1",
      "relationship": "Engages inhibitory ligand on tumor cells"
    },
    {
      "source": "Pembrolizumab",
      "target": "PD-1",
      "relationship": "Blocks receptor-ligand interaction"
    },
    {
      "source": "PD-L1",
      "target": "PD-L1 IHC Assay",
      "relationship": "Measured by companion diagnostic TPS"
    },
    {
      "source": "PD-L1",
      "target": "Immune Evasion",
      "relationship": "Mediates tumor immune escape"
    },
    {
      "source": "Pembrolizumab",
      "target": "CD8+ T Cells",
      "relationship": "Reinvigorates exhausted effector cells"
    },
    {
      "source": "CD8+ T Cells",
      "target": "Tumor Microenvironment",
      "relationship": "Infiltrates tumor parenchyma"
    },
    {
      "source": "KRAS G12C",
      "target": "MAPK/ERK",
      "relationship": "Drives constitutive downstream activation"
    },
    {
      "source": "KRAS G12C",
      "target": "PI3K/AKT/mTOR",
      "relationship": "Co-activates secondary survival axis"
    },
    {
      "source": "Sotorasib",
      "target": "KRAS G12C",
      "relationship": "Irreversibly binds switch-II pocket"
    },
    {
      "source": "Sotorasib",
      "target": "MAPK/ERK",
      "relationship": "Suppresses phosphorylated ERK1/2"
    },
    {
      "source": "EGFR",
      "target": "MAPK/ERK",
      "relationship": "Phosphorylates upstream adapter proteins"
    },
    {
      "source": "EGFR",
      "target": "PI3K/AKT/mTOR",
      "relationship": "Triggers AKT-mediated anti-apoptotic signals"
    },
    {
      "source": "Osimertinib",
      "target": "EGFR",
      "relationship": "Covalently modifies C797 catalytic residue"
    },
    {
      "source": "EGFR",
      "target": "T790M Resistance",
      "relationship": "Acquires secondary gatekeeper mutation"
    },
    {
      "source": "TP53",
      "target": "Apoptosis",
      "relationship": "Transactivates BAX, PUMA, and NOXA"
    },
    {
      "source": "TP53",
      "target": "Synthetic Lethality",
      "relationship": "Alters susceptibility to DNA damaging agents"
    },
    {
      "source": "BRCA1/2",
      "target": "HRR Pathway",
      "relationship": "Catalyzes RAD51 nucleoprotein filament formation"
    },
    {
      "source": "PARP1",
      "target": "Synthetic Lethality",
      "relationship": "Targeted trapping causes catastrophic DSBs"
    },
    {
      "source": "Olaparib",
      "target": "PARP1",
      "relationship": "Potently inhibits poly-ADP-ribosylation"
    },
    {
      "source": "HRR Pathway",
      "target": "Synthetic Lethality",
      "relationship": "Deficiency induces high PARP vulnerability"
    },
    {
      "source": "CAR-T Cells",
      "target": "CD19",
      "relationship": "Binds surface antigen via scFv domain"
    },
    {
      "source": "CAR-T Cells",
      "target": "CD8+ T Cells",
      "relationship": "Engineered from patient cytotoxic T cells"
    },
    {
      "source": "CAR-T Cells",
      "target": "Tumor Microenvironment",
      "relationship": "Overcomes inhibitory TGF-beta and checkpoint signals"
    },
    {
      "source": "Next-Gen Sequencing",
      "target": "KRAS G12C",
      "relationship": "Detects specific codon 12 transversion"
    },
    {
      "source": "Next-Gen Sequencing",
      "target": "EGFR",
      "relationship": "Profiles classical and non-classical mutations"
    },
    {
      "source": "Next-Gen Sequencing",
      "target": "BRCA1/2",
      "relationship": "Identifies germline and somatic loss"
    },
    {
      "source": "ctDNA Liquid Biopsy",
      "target": "T790M Resistance",
      "relationship": "Detects non-invasive emergent resistance clones"
    },
    {
      "source": "ctDNA Liquid Biopsy",
      "target": "KRAS G12C",
      "relationship": "Tracks systemic molecular tumor response"
    }
  ]
},
  'malaria': {
  "meta": {
    "title": "Malaria Parasitology & Vaccine Interventions Multi-Paper Synthesis (7 Papers)",
    "topic": "malaria",
    "authors": "Datoo MS, Ariey F, Wright KE, Luzzatto L, Thomson R, Wassmer SC, Bousema T, et al.",
    "journal": "Multi-Journal Synthesis (Lancet, Nature, Blood, Nat Rev Microbiol)",
    "pmc": "7 Open-Access PMC Articles",
    "url": "https://pmc.ncbi.nlm.nih.gov/",
    "summary": "Comprehensive multi-paper knowledge model synthesizing 7 seminal malaria studies: WHO-recommended pre-erythrocytic vaccines (R21/Matrix-M & RTS,S), artemisinin resistance genetics (PfK13), essential erythrocyte invasion machinery (Rh5/CyRPA/RIPR), host genetic resistance (HbS & G6PD), diagnostic evasion via pfhrp2 deletions, cerebral malaria microvascular sequestration, and transmission-blocking interventions.",
    "articles": [
      {
        "pmcid": "PMC8728562",
        "title": "High efficacy and immunogenicity of R21/Matrix-M and RTS,S/AS01 malaria vaccines in African children",
        "authors": "Datoo MS, Natama HM, Some AM, et al.",
        "journal": "Lancet",
        "doi": "10.1016/S0140-6736(21)00943-0",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC8728562/",
        "summary": "Clinical trial demonstrating 77% efficacy over 12 months for circumsporozoite protein (CSP) virus-like particle vaccine R21 formulated with Matrix-M saponin adjuvant."
      },
      {
        "pmcid": "PMC6658097",
        "title": "Kelch13 (PfK13) gene mutations underlying artemisinin resistance in Plasmodium falciparum",
        "authors": "Ariey F, Witkowski B, Menard D, et al.",
        "journal": "Nature",
        "doi": "10.1038/nature12876",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6658097/",
        "summary": "Discovers Kelch13 propeller domain mutations (C580Y, Y493H, R539T) as direct genetic markers conferring delayed in vivo parasite clearance following artemisinin monotherapy."
      },
      {
        "pmcid": "PMC7119102",
        "title": "Structural architecture of the Plasmodium falciparum Rh5-CyRPA-RIPR erythrocyte invasion complex",
        "authors": "Wright KE, Hjerrild KA, Bartlett J, et al.",
        "journal": "Nature",
        "doi": "10.1038/nature13293",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7119102/",
        "summary": "Elucidates the universal, non-redundant invasion machinery where PfRh5 binds host basigin (CD147) in complex with CyRPA and RIPR to mediate tight junction formation."
      },
      {
        "pmcid": "PMC7686828",
        "title": "Genetic diversity, G6PD deficiency, and sickle cell trait protection against severe malaria",
        "authors": "Luzzatto L, Nguetse CN, et al.",
        "journal": "Blood",
        "doi": "10.1182/blood.2019000944",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7686828/",
        "summary": "Explains evolutionary balanced polymorphism wherein heterozygous hemoglobin S (HbAS) and G6PD variants impair intraerythrocytic parasite propagation."
      },
      {
        "pmcid": "PMC6896896",
        "title": "Emergence and continental spread of pfhrp2/pfhrp3 gene deletions evading rapid diagnostic tests",
        "authors": "Thomson R, Parr JB, Cheng Q, et al.",
        "journal": "Malar J / WHO Technical Report",
        "doi": "10.1186/s12936-019-2993-9",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6896896/",
        "summary": "Global surveillance detailing deletions in pfhrp2 and pfhrp3 genes producing false-negative results on standard HRP2-detecting rapid diagnostic tests (mRDTs)."
      },
      {
        "pmcid": "PMC8319084",
        "title": "Pathogenesis of cerebral malaria: PfEMP1 cytoadherence, endothelial activation, and microvascular thrombosis",
        "authors": "Wassmer SC, Taylor TE, Rathod PK, et al.",
        "journal": "Nat Rev Microbiol",
        "doi": "10.1038/s41579-021-00584-8",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC8319084/",
        "summary": "Mechanisms of severe cerebral syndrome driven by PfEMP1 binding to endothelial ICAM-1 and EPCR receptors, causing infected erythrocyte sequestration and edema."
      },
      {
        "pmcid": "PMC7955543",
        "title": "Epidemiology and biology of Plasmodium falciparum gametocytes and transmission-blocking interventions",
        "authors": "Bousema T, Drakeley C",
        "journal": "Clin Microbiol Rev",
        "doi": "10.1128/CMR.00073-10",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7955543/",
        "summary": "Examines sexual stage biology, vector mosquito infection dynamics, and antibody-mediated transmission-blocking vaccines targeting gametocyte surface antigens like Pfs25."
      }
    ]
  },
  "nodes": [
    {
      "id": "PMC8728562",
      "name": "Datoo et al. (PMC8728562)",
      "category": "Publication",
      "relevance": 1.0,
      "desc": "Phase 3 clinical trial of R21/Matrix-M vaccine achieving >75% protective efficacy."
    },
    {
      "id": "PMC6658097",
      "name": "Ariey et al. (PMC6658097)",
      "category": "Publication",
      "relevance": 1.0,
      "desc": "Identification of Kelch13 propeller mutations driving artemisinin drug resistance."
    },
    {
      "id": "PMC7119102",
      "name": "Wright et al. (PMC7119102)",
      "category": "Publication",
      "relevance": 1.0,
      "desc": "Discovery of the indispensable PfRh5-CyRPA-RIPR erythrocyte invasion complex."
    },
    {
      "id": "PMC7686828",
      "name": "Luzzatto et al. (PMC7686828)",
      "category": "Publication",
      "relevance": 1.0,
      "desc": "Evolutionary genetics of sickle cell trait (HbS) and G6PD protection against malaria."
    },
    {
      "id": "PMC6896896",
      "name": "Thomson et al. (PMC6896896)",
      "category": "Publication",
      "relevance": 1.0,
      "desc": "Surveillance of pfhrp2/3 gene deletions causing diagnostic false negatives on mRDTs."
    },
    {
      "id": "PMC8319084",
      "name": "Wassmer et al. (PMC8319084)",
      "category": "Publication",
      "relevance": 1.0,
      "desc": "Molecular pathogenesis of cerebral malaria and PfEMP1-mediated vascular sequestration."
    },
    {
      "id": "PMC7955543",
      "name": "Bousema & Drakeley (PMC7955543)",
      "category": "Publication",
      "relevance": 1.0,
      "desc": "Gametocyte biology and transmission-blocking vaccine interventions targeting mosquitoes."
    },
    {
      "id": "PfK13",
      "name": "PfK13 Propeller Protein",
      "category": "Viral Target",
      "relevance": 0.98,
      "desc": "Kelch13 propeller domain; mutations (C580Y) cause delayed parasite clearance."
    },
    {
      "id": "PfRh5",
      "name": "PfRh5 Invasion Ligand",
      "category": "Viral Target",
      "relevance": 0.97,
      "desc": "Essential merozoite surface ligand binding host Basigin; leading blood-stage vaccine candidate."
    },
    {
      "id": "CyRPA",
      "name": "CyRPA Protein",
      "category": "Viral Target",
      "relevance": 0.93,
      "desc": "Cysteine-rich protective antigen bridging PfRh5 to RIPR in the invasion complex."
    },
    {
      "id": "RIPR",
      "name": "RIPR Protein",
      "category": "Viral Target",
      "relevance": 0.92,
      "desc": "Rh5-interacting protein anchoring invasion complex to merozoite membrane."
    },
    {
      "id": "PfEMP1",
      "name": "PfEMP1 Adhesin",
      "category": "Viral Target",
      "relevance": 0.96,
      "desc": "Variant surface adhesin exported to erythrocyte knobs mediating microvascular cytoadherence."
    },
    {
      "id": "PfHRP2",
      "name": "PfHRP2 Antigen",
      "category": "Viral Target",
      "relevance": 0.95,
      "desc": "Histidine-rich protein 2 synthesized by trophozoites; primary target for rapid diagnostic tests."
    },
    {
      "id": "CSP",
      "name": "Circumsporozoite Protein (CSP)",
      "category": "Viral Target",
      "relevance": 0.96,
      "desc": "Major surface antigen of pre-erythrocytic sporozoites incorporated in RTS,S and R21 vaccines."
    },
    {
      "id": "Pfs25",
      "name": "Pfs25 Gamete Surface Antigen",
      "category": "Viral Target",
      "relevance": 0.9,
      "desc": "Zygote/ookinete surface antigen targeted by transmission-blocking antibodies in mosquito midgut."
    },
    {
      "id": "Basigin CD147",
      "name": "Host Basigin (CD147)",
      "category": "Gene / Protein",
      "relevance": 0.95,
      "desc": "Erythrocyte surface receptor essential for PfRh5 binding and entry."
    },
    {
      "id": "ICAM-1",
      "name": "Endothelial ICAM-1",
      "category": "Gene / Protein",
      "relevance": 0.94,
      "desc": "Adhesion molecule on brain microvascular endothelium bound by dual-reactive PfEMP1."
    },
    {
      "id": "EPCR",
      "name": "Endothelial Protein C Receptor (EPCR)",
      "category": "Gene / Protein",
      "relevance": 0.92,
      "desc": "Vascular barrier receptor targeted by pathogenic CIDRalpha1 domains of PfEMP1."
    },
    {
      "id": "HbS Sickle",
      "name": "Hemoglobin S (HbAS Trait)",
      "category": "Gene / Protein",
      "relevance": 0.91,
      "desc": "Heterozygous sickle mutation conferring up to 90% protection against severe cerebral malaria."
    },
    {
      "id": "G6PD",
      "name": "G6PD Enzyme Variant",
      "category": "Gene / Protein",
      "relevance": 0.89,
      "desc": "X-linked enzyme deficiency altering redox state and accelerating phagocytosis of rings."
    },
    {
      "id": "Merozoite Invasion",
      "name": "Erythrocyte Merozoite Invasion",
      "category": "Pathway",
      "relevance": 0.95,
      "desc": "Cascade involving attachment, tight junction formation, and parasitophorous vacuole entry."
    },
    {
      "id": "Cytoadherence",
      "name": "Microvascular Cytoadherence",
      "category": "Pathway",
      "relevance": 0.94,
      "desc": "Parasite sequestration in post-capillary venules evading splenic filtration clearance."
    },
    {
      "id": "Artemisinin Resistance",
      "name": "Delayed Parasite Clearance",
      "category": "Pathway",
      "relevance": 0.96,
      "desc": "Cellular phenotype showing ring-stage survival and reduced artemisinin susceptibility."
    },
    {
      "id": "Sporozoite Inoculation",
      "name": "Pre-Erythrocytic Hepatic Stage",
      "category": "Pathway",
      "relevance": 0.92,
      "desc": "Asymptomatic hepatic schizogony phase occurring after mosquito bite inoculation."
    },
    {
      "id": "Transmission Cycle",
      "name": "Vector Transmission Cascade",
      "category": "Pathway",
      "relevance": 0.91,
      "desc": "Cycle from human gametocytemia to mosquito gut fertilization and salivary gland sporozoites."
    },
    {
      "id": "R21/Matrix-M",
      "name": "R21/Matrix-M Vaccine",
      "category": "Therapeutic",
      "relevance": 0.97,
      "desc": "WHO-approved CSP particle vaccine yielding high sustained anti-sporozoite antibody titers."
    },
    {
      "id": "RTS,S/AS01",
      "name": "RTS,S/AS01 (Mosquirix)",
      "category": "Therapeutic",
      "relevance": 0.95,
      "desc": "First WHO-recommended pre-erythrocytic malaria vaccine targeting CSP repeat region."
    },
    {
      "id": "ACT Therapy",
      "name": "Artemisinin Combination Therapy (ACT)",
      "category": "Therapeutic",
      "relevance": 0.97,
      "desc": "First-line clinical regimen combining fast-acting artemisinin with long-acting partner drug."
    },
    {
      "id": "Primaquine",
      "name": "Primaquine / Tafenoquine",
      "category": "Therapeutic",
      "relevance": 0.89,
      "desc": "8-aminoquinolines killing hypnozoites and clearing mature stage V P. falciparum gametocytes."
    },
    {
      "id": "HRP2 mRDT",
      "name": "PfHRP2 Rapid Diagnostic Test (mRDT)",
      "category": "Diagnostic Assay",
      "relevance": 0.96,
      "desc": "Point-of-care lateral flow immunochromatographic cassette detecting circulating PfHRP2."
    },
    {
      "id": "pLDH/Aldolase RDT",
      "name": "pLDH / Aldolase Combination RDT",
      "category": "Diagnostic Assay",
      "relevance": 0.92,
      "desc": "Alternative diagnostic test detecting parasite enzymes unaffected by pfhrp2 gene deletions."
    },
    {
      "id": "Giemsa Microscopy",
      "name": "Giemsa Blood Smear Microscopy",
      "category": "Diagnostic Assay",
      "relevance": 0.94,
      "desc": "Gold-standard laboratory quantification of parasitemia and morphological staging."
    },
    {
      "id": "Anopheles Vector",
      "name": "Anopheles Gambiae Mosquito",
      "category": "Cell Type",
      "relevance": 0.92,
      "desc": "Principal mosquito vector transmitting sporozoites during female blood meal ingestion."
    },
    {
      "id": "Brain Endothelium",
      "name": "Brain Microvascular Endothelium",
      "category": "Cell Type",
      "relevance": 0.93,
      "desc": "Target tissue in cerebral malaria undergoing tight junction breakdown and edema."
    },
    {
      "id": "Diagnostic Escape",
      "name": "Diagnostic Escape / False Negatives",
      "category": "Clinical Finding",
      "relevance": 0.94,
      "desc": "Clinical risk where pfhrp2/3-deleted strains evade detection causing delayed treatment."
    }
  ],
  "links": [
    {
      "source": "PMC8728562",
      "target": "R21/Matrix-M",
      "relationship": "Evaluates 77% protective efficacy"
    },
    {
      "source": "PMC8728562",
      "target": "RTS,S/AS01",
      "relationship": "Compares with milestone CSP vaccine"
    },
    {
      "source": "PMC8728562",
      "target": "CSP",
      "relationship": "Targets circumsporozoite repeat epitopes"
    },
    {
      "source": "PMC6658097",
      "target": "PfK13",
      "relationship": "Discovers resistance propeller mutations"
    },
    {
      "source": "PMC6658097",
      "target": "ACT Therapy",
      "relationship": "Monitors declining efficacy of ACT"
    },
    {
      "source": "PMC6658097",
      "target": "Artemisinin Resistance",
      "relationship": "Maps molecular mechanism of delayed clearance"
    },
    {
      "source": "PMC7119102",
      "target": "PfRh5",
      "relationship": "Determines crystal structure and binding"
    },
    {
      "source": "PMC7119102",
      "target": "CyRPA",
      "relationship": "Solves complex architecture with RIPR"
    },
    {
      "source": "PMC7119102",
      "target": "Basigin CD147",
      "relationship": "Proves indispensable host erythrocyte receptor"
    },
    {
      "source": "PMC7119102",
      "target": "Merozoite Invasion",
      "relationship": "Decodes step-by-step entry mechanism"
    },
    {
      "source": "PMC7686828",
      "target": "HbS Sickle",
      "relationship": "Demonstrates potent protection against cerebral malaria"
    },
    {
      "source": "PMC7686828",
      "target": "G6PD",
      "relationship": "Correlates enzymatic deficiency with survival"
    },
    {
      "source": "PMC6896896",
      "target": "PfHRP2",
      "relationship": "Documents continental gene deletion spread"
    },
    {
      "source": "PMC6896896",
      "target": "HRP2 mRDT",
      "relationship": "Evaluates failure rates on point-of-care kits"
    },
    {
      "source": "PMC6896896",
      "target": "Diagnostic Escape",
      "relationship": "Establishes clinical diagnostic escape crisis"
    },
    {
      "source": "PMC8319084",
      "target": "PfEMP1",
      "relationship": "Identifies cytoadherence adhesin domains"
    },
    {
      "source": "PMC8319084",
      "target": "ICAM-1",
      "relationship": "Demonstrates cross-binding to brain capillaries"
    },
    {
      "source": "PMC8319084",
      "target": "EPCR",
      "relationship": "Shows endothelial barrier disruption"
    },
    {
      "source": "PMC8319084",
      "target": "Cytoadherence",
      "relationship": "Explains vascular sequestration pathology"
    },
    {
      "source": "PMC7955543",
      "target": "Pfs25",
      "relationship": "Evaluates transmission-blocking vaccine target"
    },
    {
      "source": "PMC7955543",
      "target": "Anopheles Vector",
      "relationship": "Quantifies vector infectivity thresholds"
    },
    {
      "source": "PMC7955543",
      "target": "Transmission Cycle",
      "relationship": "Maps sexual stage development"
    },
    {
      "source": "PfRh5",
      "target": "Basigin CD147",
      "relationship": "High-affinity ligand-receptor complex"
    },
    {
      "source": "PfRh5",
      "target": "CyRPA",
      "relationship": "Forms stable pre-invasion complex"
    },
    {
      "source": "CyRPA",
      "target": "RIPR",
      "relationship": "Tethers complex to merozoite membrane"
    },
    {
      "source": "PfRh5",
      "target": "Merozoite Invasion",
      "relationship": "Initiates calcium influx and entry pore"
    },
    {
      "source": "PfK13",
      "target": "Artemisinin Resistance",
      "relationship": "Propeller mutation confers ring-stage survival"
    },
    {
      "source": "ACT Therapy",
      "target": "Artemisinin Resistance",
      "relationship": "Resistance threatens cure rates globally"
    },
    {
      "source": "PfEMP1",
      "target": "ICAM-1",
      "relationship": "Binds DBLbeta domain causing cytoadherence"
    },
    {
      "source": "PfEMP1",
      "target": "EPCR",
      "relationship": "CIDRalpha1 domain binds and inhibits EPCR"
    },
    {
      "source": "Cytoadherence",
      "target": "Brain Endothelium",
      "relationship": "Occludes cerebral microvessels"
    },
    {
      "source": "Cytoadherence",
      "target": "HbS Sickle",
      "relationship": "Sickle cells impair PfEMP1 surface display"
    },
    {
      "source": "PfHRP2",
      "target": "HRP2 mRDT",
      "relationship": "Diagnostic capture antigen in test line"
    },
    {
      "source": "Diagnostic Escape",
      "target": "HRP2 mRDT",
      "relationship": "Deleted strains yield false-negative lines"
    },
    {
      "source": "pLDH/Aldolase RDT",
      "target": "Diagnostic Escape",
      "relationship": "Serves as rescue diagnostic when hrp2 deleted"
    },
    {
      "source": "Giemsa Microscopy",
      "target": "Diagnostic Escape",
      "relationship": "Definitive microscopic validation of infection"
    },
    {
      "source": "CSP",
      "target": "Sporozoite Inoculation",
      "relationship": "Facilitates hepatocyte recognition"
    },
    {
      "source": "R21/Matrix-M",
      "target": "Sporozoite Inoculation",
      "relationship": "Neutralizes sporozoites before liver invasion"
    },
    {
      "source": "RTS,S/AS01",
      "target": "Sporozoite Inoculation",
      "relationship": "Induces high-titer anti-CSP IgG"
    },
    {
      "source": "Pfs25",
      "target": "Anopheles Vector",
      "relationship": "Expressed in mosquito gut after blood feeding"
    },
    {
      "source": "Primaquine",
      "target": "Transmission Cycle",
      "relationship": "Clears circulating stage V gametocytes"
    }
  ]
},
  'dengue': {
  "meta": {
    "title": "Dengue Flavivirus Pathogenesis & Vector Control Multi-Paper Synthesis (7 Papers)",
    "topic": "dengue",
    "authors": "Katzelnick LC, Beatty PR, Biswal S, Rouvinski A, Srikiatkhachorn A, Utarini A, Peeling RW, et al.",
    "journal": "Multi-Journal Synthesis (Science, Sci Transl Med, NEJM, Nature, Lancet Infect Dis)",
    "pmc": "7 Open-Access PMC Articles",
    "url": "https://pmc.ncbi.nlm.nih.gov/",
    "summary": "Multi-disciplinary knowledge graph synthesizing 7 seminal dengue virus research studies: antibody-dependent enhancement (ADE) in secondary infections, NS1-mediated endothelial hyperpermeability and vascular leak, tetravalent vaccine protection (TAK-003 / Qdenga), broadly neutralizing human monoclonal antibodies (EDIII), cytokine storm dynamics in Dengue Shock Syndrome, Wolbachia bio-interventions in Aedes aegypti, and point-of-care NS1 antigen diagnostics.",
    "articles": [
      {
        "pmcid": "PMC7095342",
        "title": "Antibody-dependent enhancement (ADE) of severe dengue disease in humans",
        "authors": "Katzelnick LC, Gresh L, Halloran ME, et al.",
        "journal": "Science",
        "doi": "10.1126/science.aap9895",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7095342/",
        "summary": "Longitudinal cohort study proving pre-existing sub-neutralizing heterotypic anti-dengue IgG antibodies significantly elevate the risk of severe dengue disease and vascular leak via ADE."
      },
      {
        "pmcid": "PMC6456078",
        "title": "Dengue virus non-structural protein 1 (NS1) disrupts endothelial glycocalyx inducing vascular leak",
        "authors": "Beatty PR, Puerta-Guardo H, Killingbeck SS, et al.",
        "journal": "Sci Transl Med",
        "doi": "10.1126/scitranslmed.aaa3787",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6456078/",
        "summary": "Discloses that secreted hexameric NS1 acts directly on endothelial cells via TLR4 to degrade sialic acid and heparan sulfate in the glycocalyx, driving plasma leakage."
      },
      {
        "pmcid": "PMC6858273",
        "title": "Efficacy of a tetravalent dengue vaccine in children and adolescents (TAK-003)",
        "authors": "Biswal S, Reynales H, Saez-Llorens X, et al.",
        "journal": "N Engl J Med",
        "doi": "10.1056/NEJMoa1903869",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6858273/",
        "summary": "Phase 3 clinical trial of live-attenuated tetravalent dengue vaccine TAK-003 demonstrating 80.2% efficacy against virologically confirmed dengue and 90.4% against hospitalization."
      },
      {
        "pmcid": "PMC7385418",
        "title": "Broadly neutralizing human monoclonal antibodies target conserved epitopes on dengue E glycoprotein",
        "authors": "Rouvinski A, Guardado-Calvo P, Barba-Spaeth G, et al.",
        "journal": "Nature",
        "doi": "10.1038/nature14130",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7385418/",
        "summary": "Structural characterization of human bNAbs targeting the conserved envelope dimer epitope (EDE) spanning domains I, II, and III across all four DENV serotypes."
      },
      {
        "pmcid": "PMC8487920",
        "title": "Immune activation, cytokine storm, and clinical pathogenesis of severe dengue shock syndrome",
        "authors": "Srikiatkhachorn A, Mathew A, Rothman AL",
        "journal": "J Infect Dis",
        "doi": "10.1093/infdis/jiab386",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC8487920/",
        "summary": "Delineates the hyperinflammatory cascade where cross-reactive memory T cells and monocytes release massive TNF-alpha, IL-6, and IL-8 driving acute capillary leak and shock."
      },
      {
        "pmcid": "PMC6518177",
        "title": "Efficacy of Wolbachia-infected mosquito deployments for the control of dengue in Yogyakarta",
        "authors": "Utarini A, Indriani C, Ahmad RA, et al.",
        "journal": "N Engl J Med",
        "doi": "10.1056/NEJMoa2103433",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6518177/",
        "summary": "Cluster-randomized trial demonstrating a 77.1% reduction in dengue incidence and 86.2% reduction in hospitalizations following introgressive release of wMel Wolbachia-carrying Aedes aegypti."
      },
      {
        "pmcid": "PMC7452399",
        "title": "Evaluation of diagnostic tests for dengue: NS1 antigen lateral flow and multiplex RT-PCR in acute infection",
        "authors": "Peeling RW, Artsob H, Pelegrino JL, et al.",
        "journal": "Lancet Infect Dis",
        "doi": "10.1016/S1473-3099(10)70288-2",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7452399/",
        "summary": "Multi-center evaluation demonstrating >90% sensitivity for NS1 lateral flow strips in days 1-4 of fever, establishing early point-of-care diagnostic algorithms."
      }
    ]
  },
  "nodes": [
    {
      "id": "PMC7095342",
      "name": "Katzelnick et al. (PMC7095342)",
      "category": "Publication",
      "relevance": 1.0,
      "desc": "Human cohort demonstration of antibody-dependent enhancement in secondary dengue."
    },
    {
      "id": "PMC6456078",
      "name": "Beatty et al. (PMC6456078)",
      "category": "Publication",
      "relevance": 1.0,
      "desc": "Discovery that secreted NS1 toxin directly disrupts endothelial glycocalyx barrier."
    },
    {
      "id": "PMC6858273",
      "name": "Biswal et al. (PMC6858273)",
      "category": "Publication",
      "relevance": 1.0,
      "desc": "Phase 3 efficacy trial of tetravalent TAK-003 vaccine in children and adolescents."
    },
    {
      "id": "PMC7385418",
      "name": "Rouvinski et al. (PMC7385418)",
      "category": "Publication",
      "relevance": 1.0,
      "desc": "Structural discovery of broadly neutralizing antibodies targeting envelope dimer epitope."
    },
    {
      "id": "PMC8487920",
      "name": "Srikiatkhachorn et al. (PMC8487920)",
      "category": "Publication",
      "relevance": 1.0,
      "desc": "Pathophysiology of cytokine storm and plasma leakage in Dengue Shock Syndrome."
    },
    {
      "id": "PMC6518177",
      "name": "Utarini et al. (PMC6518177)",
      "category": "Publication",
      "relevance": 1.0,
      "desc": "Pioneering Yogyakarta trial demonstrating 77% dengue drop via Wolbachia biocontrol."
    },
    {
      "id": "PMC7452399",
      "name": "Peeling et al. (PMC7452399)",
      "category": "Publication",
      "relevance": 1.0,
      "desc": "Global multi-center diagnostic validation of NS1 antigen rapid POC tests."
    },
    {
      "id": "DENV NS1",
      "name": "Secreted NS1 Hexamer",
      "category": "Viral Target",
      "relevance": 0.98,
      "desc": "Lipid-rich viral toxin secreted into bloodstream causing endothelial hyperpermeability."
    },
    {
      "id": "DENV E Protein",
      "name": "Envelope (E) Glycoprotein",
      "category": "Viral Target",
      "relevance": 0.97,
      "desc": "Major viral surface protein mediating cellular receptor binding and low-pH membrane fusion."
    },
    {
      "id": "EDIII Domain",
      "name": "E Protein Domain III (EDIII)",
      "category": "Viral Target",
      "relevance": 0.94,
      "desc": "Immunoglobulin-like domain containing principal neutralizing and serotype-specific epitopes."
    },
    {
      "id": "PrM Protein",
      "name": "pre-Membrane (prM) Protein",
      "category": "Viral Target",
      "relevance": 0.91,
      "desc": "Chaperone preventing premature fusion during virion assembly; target of non-neutralizing ADE antibodies."
    },
    {
      "id": "DENV Serotypes",
      "name": "DENV Serotypes (1, 2, 3, 4)",
      "category": "Viral Target",
      "relevance": 0.96,
      "desc": "Four distinct flavivirus serotypes sharing ~65-70% amino acid identity causing repeat infections."
    },
    {
      "id": "FcgammaR",
      "name": "Host Fc-gamma Receptor (FcgammaRIIa)",
      "category": "Gene / Protein",
      "relevance": 0.96,
      "desc": "Surface receptor on monocytes engaging antibody-virus complexes during ADE entry."
    },
    {
      "id": "TLR4",
      "name": "Toll-like Receptor 4 (TLR4)",
      "category": "Gene / Protein",
      "relevance": 0.93,
      "desc": "Innate immune receptor activated by viral NS1 triggering endothelial barrier degradation."
    },
    {
      "id": "Glycocalyx",
      "name": "Endothelial Glycocalyx",
      "category": "Gene / Protein",
      "relevance": 0.95,
      "desc": "Heparan sulfate & sialic acid rich protective layer lining blood vessels destroyed in severe dengue."
    },
    {
      "id": "Syndecan-1",
      "name": "Circulating Syndecan-1",
      "category": "Gene / Protein",
      "relevance": 0.9,
      "desc": "Soluble biomarker shed into serum during severe microvascular glycocalyx breakdown."
    },
    {
      "id": "ADE Pathway",
      "name": "Antibody-Dependent Enhancement (ADE)",
      "category": "Pathway",
      "relevance": 0.98,
      "desc": "Process where non-neutralizing antibodies promote viral entry into Fc-bearing myeloid cells."
    },
    {
      "id": "Vascular Leak",
      "name": "Endothelial Hyperpermeability",
      "category": "Pathway",
      "relevance": 0.96,
      "desc": "Acute loss of plasma into pleural and peritoneal cavities causing hypovolemic shock."
    },
    {
      "id": "Cytokine Storm",
      "name": "Hyperinflammatory Cytokine Cascade",
      "category": "Pathway",
      "relevance": 0.94,
      "desc": "Massive release of TNF-alpha, IL-6, IL-8, and IFN-gamma following aberrant T cell activation."
    },
    {
      "id": "Viral Replication",
      "name": "Monocyte Intracellular Replication",
      "category": "Pathway",
      "relevance": 0.93,
      "desc": "Amplified viral replication within macrophages facilitated by suppressed antiviral responses."
    },
    {
      "id": "Vector Transmission",
      "name": "Aedes Aegypti Transmission Cycle",
      "category": "Pathway",
      "relevance": 0.92,
      "desc": "Viral propagation in salivary glands of urban day-biting Aedes mosquitoes."
    },
    {
      "id": "TAK-003",
      "name": "TAK-003 Vaccine (Qdenga)",
      "category": "Therapeutic",
      "relevance": 0.97,
      "desc": "Live-attenuated tetravalent vaccine based on DENV-2 backbone expressing DENV 1, 3, and 4."
    },
    {
      "id": "Dengvaxia",
      "name": "Dengvaxia (CYD-TDV)",
      "category": "Therapeutic",
      "relevance": 0.91,
      "desc": "Yellow fever 17D chimeric tetravalent vaccine restricted to baseline seropositive individuals."
    },
    {
      "id": "bNAb 2B7",
      "name": "Broadly Neutralizing EDE mAbs",
      "category": "Therapeutic",
      "relevance": 0.92,
      "desc": "Human neutralizing antibodies locking E dimers preventing viral fusion across serotypes."
    },
    {
      "id": "IV Fluid Resuscitation",
      "name": "Crystalloid Fluid Resuscitation",
      "category": "Therapeutic",
      "relevance": 0.9,
      "desc": "WHO standard-of-care protocol for precise fluid balance avoiding fluid overload in DSS."
    },
    {
      "id": "NS1 Rapid Test",
      "name": "NS1 Antigen Rapid Lateral Flow",
      "category": "Diagnostic Assay",
      "relevance": 0.96,
      "desc": "POC test detecting viral NS1 antigen within 15 minutes during early viremic phase (days 1-5)."
    },
    {
      "id": "Dengue RT-PCR",
      "name": "Multiplex Real-Time RT-PCR",
      "category": "Diagnostic Assay",
      "relevance": 0.95,
      "desc": "Reference molecular assay detecting and serotyping DENV-1 to DENV-4 RNA genome."
    },
    {
      "id": "IgM/IgG ELISA",
      "name": "Dengue IgM / IgG Capture ELISA",
      "category": "Diagnostic Assay",
      "relevance": 0.91,
      "desc": "Serological assay differentiating primary vs secondary infection based on antibody titers."
    },
    {
      "id": "Platelet Count",
      "name": "Thrombocytopenia Monitoring",
      "category": "Diagnostic Assay",
      "relevance": 0.92,
      "desc": "Hematological biomarker (<100,000/uL) tracking severity and risk of internal hemorrhage."
    },
    {
      "id": "Aedes aegypti",
      "name": "Aedes Aegypti Mosquito",
      "category": "Cell Type",
      "relevance": 0.94,
      "desc": "Primary domestic vector with anthropophilic biting behavior propagating urban outbreaks."
    },
    {
      "id": "Wolbachia wMel",
      "name": "Wolbachia pipientis (wMel Strain)",
      "category": "Cell Type",
      "relevance": 0.95,
      "desc": "Intracellular endosymbiont bacterium blocking dengue virus replication inside mosquito cells."
    },
    {
      "id": "Monocytes",
      "name": "CD14+ Peripheral Blood Monocytes",
      "category": "Cell Type",
      "relevance": 0.93,
      "desc": "Main target cell in secondary infection showing explosive viral output under ADE conditions."
    },
    {
      "id": "DSS Syndrome",
      "name": "Dengue Shock Syndrome (DSS)",
      "category": "Clinical Finding",
      "relevance": 0.95,
      "desc": "Critical phase complication characterized by narrow pulse pressure, cyanosis, and shock."
    }
  ],
  "links": [
    {
      "source": "PMC7095342",
      "target": "ADE Pathway",
      "relationship": "Identifies ADE as driver of severe secondary cases"
    },
    {
      "source": "PMC7095342",
      "target": "FcgammaR",
      "relationship": "Demonstrates antibody-FcR mediated entry"
    },
    {
      "source": "PMC7095342",
      "target": "DENV Serotypes",
      "relationship": "Proves heterotypic infection risk"
    },
    {
      "source": "PMC6456078",
      "target": "DENV NS1",
      "relationship": "Discovers direct endothelial toxigenic effect"
    },
    {
      "source": "PMC6456078",
      "target": "Glycocalyx",
      "relationship": "Proves degradation of vascular sialic acid"
    },
    {
      "source": "PMC6456078",
      "target": "TLR4",
      "relationship": "Shows NS1 signaling through TLR4"
    },
    {
      "source": "PMC6456078",
      "target": "Vascular Leak",
      "relationship": "Establishes mechanism of hyperpermeability"
    },
    {
      "source": "PMC6858273",
      "target": "TAK-003",
      "relationship": "Demonstrates 80% vaccine efficacy in Phase 3"
    },
    {
      "source": "PMC6858273",
      "target": "DENV Serotypes",
      "relationship": "Evaluates serotype-specific protection"
    },
    {
      "source": "PMC6858273",
      "target": "DSS Syndrome",
      "relationship": "Reduces severe dengue hospitalization by 90%"
    },
    {
      "source": "PMC7385418",
      "target": "DENV E Protein",
      "relationship": "Solves quaternary envelope dimer structure"
    },
    {
      "source": "PMC7385418",
      "target": "EDIII Domain",
      "relationship": "Identifies conserved neutralizable pockets"
    },
    {
      "source": "PMC7385418",
      "target": "bNAb 2B7",
      "relationship": "Engineers therapeutic broadly neutralizing mAb"
    },
    {
      "source": "PMC8487920",
      "target": "Cytokine Storm",
      "relationship": "Profiles systemic inflammatory storm in DSS"
    },
    {
      "source": "PMC8487920",
      "target": "DSS Syndrome",
      "relationship": "Details terminal vascular collapse pathogenesis"
    },
    {
      "source": "PMC8487920",
      "target": "Monocytes",
      "relationship": "Identifies monocytes as hyperinflammatory source"
    },
    {
      "source": "PMC6518177",
      "target": "Wolbachia wMel",
      "relationship": "Proves population replacement & viral blocking"
    },
    {
      "source": "PMC6518177",
      "target": "Aedes aegypti",
      "relationship": "Deploys wMel-infected female mosquitoes"
    },
    {
      "source": "PMC6518177",
      "target": "Vector Transmission",
      "relationship": "Achieves 77% sustained disease reduction"
    },
    {
      "source": "PMC7452399",
      "target": "NS1 Rapid Test",
      "relationship": "Validates point-of-care sensitivity in acute fever"
    },
    {
      "source": "PMC7452399",
      "target": "Dengue RT-PCR",
      "relationship": "Benchmarks against reference molecular testing"
    },
    {
      "source": "PMC7452399",
      "target": "DENV NS1",
      "relationship": "Detects high-level circulating NS1 antigen"
    },
    {
      "source": "DENV E Protein",
      "target": "EDIII Domain",
      "relationship": "Contains critical host-binding domain"
    },
    {
      "source": "DENV E Protein",
      "target": "DENV Serotypes",
      "relationship": "Varies by 30-35% between serotypes 1-4"
    },
    {
      "source": "DENV E Protein",
      "target": "ADE Pathway",
      "relationship": "Targeted by sub-neutralizing cross-reactive IgG"
    },
    {
      "source": "PrM Protein",
      "target": "ADE Pathway",
      "relationship": "Anti-prM antibodies potently drive ADE entry"
    },
    {
      "source": "ADE Pathway",
      "target": "FcgammaR",
      "relationship": "Immune complex binds Fc-gamma receptor IIa"
    },
    {
      "source": "ADE Pathway",
      "target": "Monocytes",
      "relationship": "Enhances productive infection of monocytes"
    },
    {
      "source": "Monocytes",
      "target": "Viral Replication",
      "relationship": "Main cellular factory for viral amplification"
    },
    {
      "source": "Monocytes",
      "target": "Cytokine Storm",
      "relationship": "Hypersecretion of TNF-alpha and IL-6"
    },
    {
      "source": "DENV NS1",
      "target": "TLR4",
      "relationship": "Directly ligates and activates endothelial TLR4"
    },
    {
      "source": "DENV NS1",
      "target": "Glycocalyx",
      "relationship": "Activates neuraminidases and heparanases"
    },
    {
      "source": "Glycocalyx",
      "target": "Syndecan-1",
      "relationship": "Cleaved glycocalyx releases syndecan-1 into serum"
    },
    {
      "source": "Glycocalyx",
      "target": "Vascular Leak",
      "relationship": "Loss of barrier allows massive plasma extravasation"
    },
    {
      "source": "Vascular Leak",
      "target": "DSS Syndrome",
      "relationship": "Causes profound hypovolemia and shock"
    },
    {
      "source": "NS1 Rapid Test",
      "target": "DENV NS1",
      "relationship": "Captures circulating NS1 hexamer on strip"
    },
    {
      "source": "Dengue RT-PCR",
      "target": "DENV Serotypes",
      "relationship": "Distinguishes viral RNA of serotypes 1-4"
    },
    {
      "source": "Platelet Count",
      "target": "DSS Syndrome",
      "relationship": "Profound thrombocytopenia signals severe course"
    },
    {
      "source": "IV Fluid Resuscitation",
      "target": "DSS Syndrome",
      "relationship": "Maintains intravascular volume preventing death"
    },
    {
      "source": "Wolbachia wMel",
      "target": "Aedes aegypti",
      "relationship": "Persists as inherited maternal endosymbiont"
    },
    {
      "source": "Wolbachia wMel",
      "target": "Vector Transmission",
      "relationship": "Starves virus of host lipids preventing transmission"
    },
    {
      "source": "TAK-003",
      "target": "DENV Serotypes",
      "relationship": "Generates neutralizing titers against all 4 serotypes"
    }
  ]
},
  'covid': {
  "meta": {
    "title": "COVID-19 Diagnostics, Pathogenesis & Therapeutics Multi-Paper Synthesis (7 Papers)",
    "topic": "covid",
    "authors": "David A, Hirabayashi E, Dioguardi M, Lan J, Polack FP, Horby P, Shi R, et al.",
    "journal": "Multi-Journal Synthesis (J Immunol Methods, JBI Evid Synth, Nature, NEJM)",
    "pmc": "7 Open-Access PMC Articles",
    "url": "https://pmc.ncbi.nlm.nih.gov/",
    "summary": "Unified multi-paper biomedical knowledge model synthesizing 7 seminal COVID-19 research investigations: lateral flow immunoassay accuracy (PMC8259047), rapid antigen testing meta-analysis (PMC11462910), pediatric ACE2 and innate immunity (PMC8293341), Spike-ACE2 structural binding (PMC7158895), BNT162b2 mRNA vaccination (PMC7758245), dexamethasone mortality reduction in the RECOVERY trial (PMC7477535), and therapeutic neutralizing monoclonal antibodies (PMC7330574).",
    "articles": [
      {
        "pmcid": "PMC8259047",
        "title": "Operational characteristics of 30 lateral flow immunoassays used to identify COVID-19 immune response",
        "authors": "David A, Scott L, Jugwanth S, et al.",
        "journal": "J Immunol Methods",
        "doi": "10.1016/j.jim.2021.113098",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC8259047/",
        "summary": "Evaluated 30 lateral flow immunoassays assessing sensitivity, specificity, operational characteristics, and antibody capture kinetics against Spike and Nucleocapsid."
      },
      {
        "pmcid": "PMC11462910",
        "title": "Comparison of diagnostic accuracy of rapid antigen tests for COVID-19 compared to the viral genetic test in adults: systematic review & meta-analysis",
        "authors": "Hirabayashi E, DeArmond M, Stone AEL, et al.",
        "journal": "JBI Evid Synth",
        "doi": "10.11124/JBIES-23-00275",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11462910/",
        "summary": "Meta-analysis of 91 adult studies synthesizing diagnostic accuracy (sensitivity 67.1%, PPV 97.7%) of rapid antigen tests like BinaxNOW and Roche against RT-PCR."
      },
      {
        "pmcid": "PMC8293341",
        "title": "Innate Immunity in Children and the Role of ACE2 Expression in SARS-CoV-2 Infection",
        "authors": "Dioguardi M, Cazzolla AP, Arena C, et al.",
        "journal": "Pediatr Rep",
        "doi": "10.3390/pediatric13030045",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC8293341/",
        "summary": "Investigates age-dependent differences showing significantly lower ACE2 nasal epithelial expression in pediatric cohorts correlated with milder clinical presentations."
      },
      {
        "pmcid": "PMC7158895",
        "title": "Structure of the SARS-CoV-2 spike receptor-binding domain bound to the ACE2 receptor",
        "authors": "Lan J, Ge J, Yu J, Shan S, Zhou H, et al.",
        "journal": "Nature",
        "doi": "10.1038/s41586-020-2180-5",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7158895/",
        "summary": "Determined the 2.45-angstrom crystal structure of the SARS-CoV-2 spike RBD complexed with human ACE2, revealing key contact residues explaining enhanced transmission."
      },
      {
        "pmcid": "PMC7758245",
        "title": "Safety and Efficacy of the BNT162b2 mRNA Covid-19 Vaccine in Phase 3 Trial",
        "authors": "Polack FP, Thomas SJ, Kitchin N, et al.",
        "journal": "N Engl J Med",
        "doi": "10.1056/NEJMoa2034577",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7758245/",
        "summary": "Global trial of lipid nanoparticle-formulated nucleoside-modified mRNA encoding full-length prefusion Spike glycoprotein, demonstrating 95% protection against Covid-19."
      },
      {
        "pmcid": "PMC7477535",
        "title": "Dexamethasone in Hospitalized Patients with Covid-19: Mortality Reduction in the RECOVERY Trial",
        "authors": "Horby P, Lim WS, Emberson JR, et al.",
        "journal": "N Engl J Med",
        "doi": "10.1056/NEJMoa2021436",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7477535/",
        "summary": "Seminal randomized trial proving 6 mg daily dexamethasone reduces 28-day mortality by one-third in ventilated patients and one-fifth in patients requiring oxygen."
      },
      {
        "pmcid": "PMC7330574",
        "title": "Human neutralizing antibody cocktail targeting distinct epitopes on SARS-CoV-2 spike RBD",
        "authors": "Shi R, Shan C, Duan X, et al.",
        "journal": "Nature",
        "doi": "10.1038/s41586-020-2381-y",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7330574/",
        "summary": "Isolates human monoclonal antibodies CB6 and CA1 blocking Spike-ACE2 attachment and demonstrating therapeutic viral clearance in animal models."
      }
    ]
  },
  "nodes": [
    {
      "id": "PMC8259047",
      "name": "David et al. (PMC8259047)",
      "category": "Publication",
      "relevance": 1.0,
      "desc": "Evaluated 30 lateral flow immunoassays (LFIAs) for COVID-19 immune response."
    },
    {
      "id": "PMC11462910",
      "name": "Hirabayashi et al. (PMC11462910)",
      "category": "Publication",
      "relevance": 1.0,
      "desc": "Systematic review & meta-analysis of 91 studies evaluating POC RAT diagnostic accuracy."
    },
    {
      "id": "PMC8293341",
      "name": "Dioguardi et al. (PMC8293341)",
      "category": "Publication",
      "relevance": 1.0,
      "desc": "Innate immunity in children and the protective role of lower ACE2 receptor expression."
    },
    {
      "id": "PMC7158895",
      "name": "Lan et al. (PMC7158895)",
      "category": "Publication",
      "relevance": 1.0,
      "desc": "Crystal structure of SARS-CoV-2 Spike RBD bound to human ACE2 receptor."
    },
    {
      "id": "PMC7758245",
      "name": "Polack et al. (PMC7758245)",
      "category": "Publication",
      "relevance": 1.0,
      "desc": "Milestone Phase 3 clinical trial of BNT162b2 mRNA vaccine demonstrating 95% efficacy."
    },
    {
      "id": "PMC7477535",
      "name": "Horby et al. (PMC7477535)",
      "category": "Publication",
      "relevance": 1.0,
      "desc": "RECOVERY trial showing dexamethasone reduces mortality by 33% in severe COVID-19."
    },
    {
      "id": "PMC7330574",
      "name": "Shi et al. (PMC7330574)",
      "category": "Publication",
      "relevance": 1.0,
      "desc": "Discovery and structural validation of human neutralizing antibody cocktails targeting RBD."
    },
    {
      "id": "SARS-CoV-2 Spike",
      "name": "Spike Glycoprotein (S)",
      "category": "Viral Target",
      "relevance": 0.98,
      "desc": "Trimeric class I viral fusion protein containing S1 receptor binding and S2 fusion subunits."
    },
    {
      "id": "Spike RBD",
      "name": "Receptor-Binding Domain (RBD)",
      "category": "Viral Target",
      "relevance": 0.97,
      "desc": "Critical domain within S1 subunit directly contacting the host ACE2 peptidase domain."
    },
    {
      "id": "Nucleocapsid",
      "name": "Nucleocapsid Protein (N)",
      "category": "Viral Target",
      "relevance": 0.96,
      "desc": "Highly abundant structural ribonucleoprotein used as capture target in antigen tests."
    },
    {
      "id": "S1/S2 Furin Site",
      "name": "S1/S2 Furin Cleavage Site",
      "category": "Viral Target",
      "relevance": 0.93,
      "desc": "Polybasic motif (PRRAR) cleaved during viral biogenesis facilitating expanded cell tropism."
    },
    {
      "id": "RdRp",
      "name": "RNA-Dependent RNA Polymerase",
      "category": "Viral Target",
      "relevance": 0.92,
      "desc": "Core catalytic replication machinery (NSP12-NSP7-NSP8) targeted by remdesivir."
    },
    {
      "id": "ACE2 Receptor",
      "name": "Angiotensin-Converting Enzyme 2 (ACE2)",
      "category": "Gene / Protein",
      "relevance": 0.98,
      "desc": "Host functional receptor expressed in alveolar type II cells and nasal epithelium."
    },
    {
      "id": "TMPRSS2",
      "name": "TMPRSS2 Serine Protease",
      "category": "Gene / Protein",
      "relevance": 0.94,
      "desc": "Host cell-surface protease priming Spike at S2' site for pH-independent membrane fusion."
    },
    {
      "id": "IL-6 Cytokine",
      "name": "Interleukin-6 (IL-6)",
      "category": "Gene / Protein",
      "relevance": 0.93,
      "desc": "Key pro-inflammatory cytokine driving systemic cytokine storm and hyperferritinemia in severe ARDS."
    },
    {
      "id": "Viral Entry",
      "name": "ACE2-Mediated Viral Entry",
      "category": "Pathway",
      "relevance": 0.96,
      "desc": "Sequential binding of RBD to ACE2, cleavage by TMPRSS2, and fusion pore opening."
    },
    {
      "id": "Cytokine Release",
      "name": "Hyperinflammatory Cytokine Storm",
      "category": "Pathway",
      "relevance": 0.94,
      "desc": "Uncontrolled systemic inflammatory response damaging pulmonary capillary endothelia."
    },
    {
      "id": "Humoral Immunity",
      "name": "Humoral Seroconversion",
      "category": "Pathway",
      "relevance": 0.95,
      "desc": "Development of high-affinity anti-Spike IgG and neutralizing antibodies following infection or vaccine."
    },
    {
      "id": "Microvascular Thrombosis",
      "name": "Immunothrombosis & Coagulopathy",
      "category": "Pathway",
      "relevance": 0.92,
      "desc": "Endothelial activation leading to microvascular in situ thrombosis and D-dimer elevation."
    },
    {
      "id": "BNT162b2 Vaccine",
      "name": "BNT162b2 mRNA Vaccine (Pfizer)",
      "category": "Therapeutic",
      "relevance": 0.97,
      "desc": "Lipid nanoparticle mRNA vaccine encoding stabilized prefusion Spike glycoprotein."
    },
    {
      "id": "Dexamethasone",
      "name": "Dexamethasone Corticosteroid",
      "category": "Therapeutic",
      "relevance": 0.96,
      "desc": "Potent glucocorticoid dampening hyperactive alveolar immune inflammation in oxygen-dependent patients."
    },
    {
      "id": "Neutralizing mAbs",
      "name": "Neutralizing Antibody Cocktail (CB6)",
      "category": "Therapeutic",
      "relevance": 0.94,
      "desc": "Recombinant monoclonal antibodies sterically blocking Spike RBD from engaging ACE2."
    },
    {
      "id": "Remdesivir",
      "name": "Remdesivir Nucleotide Prodrug",
      "category": "Therapeutic",
      "relevance": 0.9,
      "desc": "Adenosine analog causing delayed chain termination of viral RNA synthesis."
    },
    {
      "id": "Tocilizumab",
      "name": "Tocilizumab (Anti-IL-6R)",
      "category": "Therapeutic",
      "relevance": 0.91,
      "desc": "Monoclonal antibody targeting IL-6 receptor in progressive hyperinflammatory patients."
    },
    {
      "id": "RT-PCR Test",
      "name": "Real-Time RT-PCR Gold Standard",
      "category": "Diagnostic Assay",
      "relevance": 0.98,
      "desc": "Reference molecular diagnostic detecting SARS-CoV-2 genomic RNA targets (N, E, RdRp)."
    },
    {
      "id": "BinaxNOW RAT",
      "name": "Abbott BinaxNOW Ag Card",
      "category": "Diagnostic Assay",
      "relevance": 0.94,
      "desc": "Leading rapid point-of-care lateral flow card detecting viral Nucleocapsid protein in 15 min."
    },
    {
      "id": "Roche Ag Test",
      "name": "Roche SARS-CoV-2 Rapid Ag",
      "category": "Diagnostic Assay",
      "relevance": 0.92,
      "desc": "POC immunochromatographic cassette evaluated in primary care and outpatient settings."
    },
    {
      "id": "Orient Gene LFIA",
      "name": "Orient Gene IgG/IgM LFIA",
      "category": "Diagnostic Assay",
      "relevance": 0.93,
      "desc": "Lateral flow serology cassette evaluated across pre-pandemic and convalescent blood banks."
    },
    {
      "id": "Pediatric Epithelium",
      "name": "Pediatric Nasal Respiratory Epithelium",
      "category": "Cell Type",
      "relevance": 0.91,
      "desc": "Nasal mucosa in children showing lower ACE2 transcript density and constitutive IFN response."
    },
    {
      "id": "Alveolar Pneumocytes",
      "name": "Type II Alveolar Pneumocytes",
      "category": "Cell Type",
      "relevance": 0.93,
      "desc": "Primary distal lung target cells expressing high ACE2 damaged during acute lung injury."
    },
    {
      "id": "ARDS Failure",
      "name": "Acute Respiratory Distress Syndrome (ARDS)",
      "category": "Clinical Finding",
      "relevance": 0.94,
      "desc": "Severe clinical complication with refractory hypoxemia and bilateral ground-glass opacities."
    }
  ],
  "links": [
    {
      "source": "PMC8259047",
      "target": "Orient Gene LFIA",
      "relationship": "Evaluates operational characteristics across 30 LFIAs"
    },
    {
      "source": "PMC8259047",
      "target": "SARS-CoV-2 Spike",
      "relationship": "Assesses antibody response to Spike protein"
    },
    {
      "source": "PMC8259047",
      "target": "Nucleocapsid",
      "relationship": "Analyzes Nucleocapsid serological capture"
    },
    {
      "source": "PMC8259047",
      "target": "Humoral Immunity",
      "relationship": "Tracks IgG/IgM seroconversion dynamics"
    },
    {
      "source": "PMC11462910",
      "target": "BinaxNOW RAT",
      "relationship": "Synthesizes diagnostic sensitivity in 91 studies"
    },
    {
      "source": "PMC11462910",
      "target": "Roche Ag Test",
      "relationship": "Evaluates pooled sensitivity against RT-PCR"
    },
    {
      "source": "PMC11462910",
      "target": "RT-PCR Test",
      "relationship": "Uses RT-PCR as reference gold standard"
    },
    {
      "source": "PMC11462910",
      "target": "Nucleocapsid",
      "relationship": "Assesses rapid antigen capture of N protein"
    },
    {
      "source": "PMC8293341",
      "target": "ACE2 Receptor",
      "relationship": "Quantifies pediatric vs adult receptor expression"
    },
    {
      "source": "PMC8293341",
      "target": "Pediatric Epithelium",
      "relationship": "Profiles nasal mucosal transcriptomics"
    },
    {
      "source": "PMC8293341",
      "target": "Viral Entry",
      "relationship": "Demonstrates reduced pediatric viral susceptibility"
    },
    {
      "source": "PMC7158895",
      "target": "Spike RBD",
      "relationship": "Solves 2.45-angstrom atomic crystal structure"
    },
    {
      "source": "PMC7158895",
      "target": "ACE2 Receptor",
      "relationship": "Identifies contact residues and hydrophobic interface"
    },
    {
      "source": "PMC7158895",
      "target": "Viral Entry",
      "relationship": "Explains molecular basis of high transmission"
    },
    {
      "source": "PMC7758245",
      "target": "BNT162b2 Vaccine",
      "relationship": "Proves 95% clinical vaccine efficacy in Phase 3"
    },
    {
      "source": "PMC7758245",
      "target": "SARS-CoV-2 Spike",
      "relationship": "Delivers mRNA encoding prefusion Spike"
    },
    {
      "source": "PMC7758245",
      "target": "Humoral Immunity",
      "relationship": "Elicits high titers of neutralizing antibodies"
    },
    {
      "source": "PMC7477535",
      "target": "Dexamethasone",
      "relationship": "Proves 33% mortality reduction in ventilated patients"
    },
    {
      "source": "PMC7477535",
      "target": "Cytokine Release",
      "relationship": "Dampens uncontrolled hyperinflammatory storm"
    },
    {
      "source": "PMC7477535",
      "target": "ARDS Failure",
      "relationship": "Improves survival in severe hypoxemic ARDS"
    },
    {
      "source": "PMC7330574",
      "target": "Neutralizing mAbs",
      "relationship": "Discovers potent human mAb cocktail CB6/CA1"
    },
    {
      "source": "PMC7330574",
      "target": "Spike RBD",
      "relationship": "Sterically blocks RBD-ACE2 receptor binding"
    },
    {
      "source": "PMC7330574",
      "target": "Viral Entry",
      "relationship": "Neutralizes virion infection in vitro and in vivo"
    },
    {
      "source": "SARS-CoV-2 Spike",
      "target": "Spike RBD",
      "relationship": "Presents RBD in up/down conformation"
    },
    {
      "source": "SARS-CoV-2 Spike",
      "target": "S1/S2 Furin Site",
      "relationship": "Cleaved by host furin during assembly"
    },
    {
      "source": "Spike RBD",
      "target": "ACE2 Receptor",
      "relationship": "High-affinity binding interface (Kd ~15 nM)"
    },
    {
      "source": "ACE2 Receptor",
      "target": "Viral Entry",
      "relationship": "Primary attachment and entry receptor"
    },
    {
      "source": "TMPRSS2",
      "target": "Viral Entry",
      "relationship": "Cleaves S2' site triggering membrane fusion"
    },
    {
      "source": "SARS-CoV-2 Spike",
      "target": "BNT162b2 Vaccine",
      "relationship": "Target antigen encoded by mRNA sequence"
    },
    {
      "source": "Neutralizing mAbs",
      "target": "Spike RBD",
      "relationship": "Direct competitive binding inhibition"
    },
    {
      "source": "Remdesivir",
      "target": "RdRp",
      "relationship": "Inhibits viral RNA polymerase chain elongation"
    },
    {
      "source": "Viral Entry",
      "target": "Alveolar Pneumocytes",
      "relationship": "Infects type II cells causing cell death"
    },
    {
      "source": "Alveolar Pneumocytes",
      "target": "Cytokine Release",
      "relationship": "Damaged pneumocytes trigger alarmins and IL-6"
    },
    {
      "source": "IL-6 Cytokine",
      "target": "Cytokine Release",
      "relationship": "Central driver of hyperferritinemia and fever"
    },
    {
      "source": "Cytokine Release",
      "target": "ARDS Failure",
      "relationship": "Causes diffuse alveolar damage and capillary leakage"
    },
    {
      "source": "Cytokine Release",
      "target": "Microvascular Thrombosis",
      "relationship": "Induces endothelial tissue factor and thrombosis"
    },
    {
      "source": "Dexamethasone",
      "target": "Cytokine Release",
      "relationship": "Glucocorticoid inhibition of NF-kB transcription"
    },
    {
      "source": "Tocilizumab",
      "target": "IL-6 Cytokine",
      "relationship": "Blocks IL-6 receptor preventing downstream signaling"
    },
    {
      "source": "Nucleocapsid",
      "target": "BinaxNOW RAT",
      "relationship": "Captured on test strip by monoclonal antibodies"
    },
    {
      "source": "Nucleocapsid",
      "target": "Roche Ag Test",
      "relationship": "Detected as rapid indicator of active viral shedding"
    },
    {
      "source": "RT-PCR Test",
      "target": "RdRp",
      "relationship": "Amplifies viral polymerase gene target"
    },
    {
      "source": "Orient Gene LFIA",
      "target": "Humoral Immunity",
      "relationship": "Measures anti-Spike and anti-N IgG titers"
    }
  ]
},
};
