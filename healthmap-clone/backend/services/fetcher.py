"""
Data fetcher service: aggregates 100% Free Public Health APIs & Surveillance Feeds.
Sources:
  1. WHO (World Health Organization) RSS Feed
  2. CDC (Centers for Disease Control and Prevention) HAN & Travel Notices
  3. ECDC (European Centre for Disease Prevention and Control) Outbreak Assessments
  4. Disease.sh (Open Disease Data Platform) - COVID & Influenza Surveillance
  5. Global News Disease & Outbreak Surveillance (Google News RSS)
"""
import hashlib
import re
import asyncio
import logging
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
import httpx
import feedparser
from bs4 import BeautifulSoup
from geopy.geocoders import Nominatim

logger = logging.getLogger(__name__)

# Free geocoder with extensive pre-mapped coordinate cache
_geocoder = Nominatim(user_agent="epiwatch-disease-monitor-free", timeout=8)

# Fast coordinate dictionary for 200+ countries, territories, US states, and key cities
_geo_cache: Dict[str, tuple] = {
    # Global Countries
    "Afghanistan": (33.9391, 67.71),
    "Albania": (41.1533, 20.1683),
    "Algeria": (28.0339, 1.6596),
    "Angola": (-11.2027, 17.8739),
    "Argentina": (-38.4161, -63.6167),
    "Armenia": (40.0691, 45.0382),
    "Australia": (-25.2744, 133.7751),
    "Austria": (47.5162, 14.5501),
    "Azerbaijan": (40.1431, 47.5769),
    "Bahamas": (25.0343, -77.3963),
    "Bahrain": (26.0667, 50.5577),
    "Bangladesh": (23.685, 90.3563),
    "Belarus": (53.7098, 27.9534),
    "Belgium": (50.5039, 4.4699),
    "Belize": (17.1899, -88.4976),
    "Benin": (9.3077, 2.3158),
    "Bolivia": (-16.2902, -63.5887),
    "Bosnia and Herzegovina": (43.9159, 17.6791),
    "Botswana": (-22.3285, 24.6849),
    "Brazil": (-14.235, -51.9253),
    "Bulgaria": (42.7339, 25.4858),
    "Burkina Faso": (12.2383, -1.5616),
    "Burundi": (-3.3731, 29.9189),
    "Cambodia": (12.5657, 104.991),
    "Cameroon": (7.3697, 12.3547),
    "Canada": (56.1304, -106.3468),
    "Central African Republic": (6.6111, 20.9394),
    "Chad": (15.4542, 18.7322),
    "Chile": (-35.6751, -71.543),
    "China": (35.8617, 104.1954),
    "Colombia": (4.5709, -74.2973),
    "Congo": (-0.228, 15.8277),
    "Costa Rica": (9.7489, -83.7534),
    "Croatia": (45.1, 15.2),
    "Cuba": (21.5218, -77.7812),
    "Cyprus": (35.1264, 33.4299),
    "Czech Republic": (49.8175, 15.473),
    "DR Congo": (-4.0383, 21.7587),
    "Democratic Republic of Congo": (-4.0383, 21.7587),
    "Denmark": (56.2639, 9.5018),
    "Dominican Republic": (18.7357, -70.1627),
    "Ecuador": (-1.8312, -78.1834),
    "Egypt": (26.8206, 30.8025),
    "El Salvador": (13.7942, -88.8965),
    "Equatorial Guinea": (1.6508, 10.2679),
    "Eritrea": (15.1794, 39.7823),
    "Estonia": (58.5953, 25.0136),
    "Eswatini": (-26.5225, 31.4659),
    "Ethiopia": (9.145, 40.4897),
    "Fiji": (-17.7134, 178.065),
    "Finland": (61.9241, 25.7482),
    "France": (46.2276, 2.2137),
    "Gabon": (-0.8037, 11.6094),
    "Gambia": (13.4432, -15.3101),
    "Georgia": (42.3154, 43.3569),
    "Germany": (51.1657, 10.4515),
    "Ghana": (7.9465, -1.0232),
    "Greece": (39.0742, 21.8243),
    "Guatemala": (15.7835, -90.2308),
    "Guinea": (9.9456, -9.6966),
    "Guinea-Bissau": (11.8037, -15.1804),
    "Guyana": (4.8604, -58.9302),
    "Haiti": (18.9712, -72.2852),
    "Honduras": (15.2, -86.2419),
    "Hungary": (47.1625, 19.5033),
    "Iceland": (64.9631, -19.0208),
    "India": (20.5937, 78.9629),
    "Indonesia": (-0.7893, 113.9213),
    "Iran": (32.4279, 53.688),
    "Iraq": (33.2232, 43.6793),
    "Ireland": (53.1424, -7.6921),
    "Israel": (31.0461, 34.8516),
    "Italy": (41.8719, 12.5674),
    "Ivory Coast": (7.54, -5.5471),
    "Jamaica": (18.1096, -77.2975),
    "Japan": (36.2048, 138.2529),
    "Jordan": (30.5852, 36.2384),
    "Kazakhstan": (48.0196, 66.9237),
    "Kenya": (-0.0236, 37.9062),
    "Kuwait": (29.3117, 47.4818),
    "Kyrgyzstan": (41.2044, 74.7661),
    "Laos": (19.8563, 102.4955),
    "Latvia": (56.8796, 24.6032),
    "Lebanon": (33.8547, 35.8623),
    "Liberia": (6.4281, -9.4295),
    "Libya": (26.3351, 17.2283),
    "Lithuania": (55.1694, 23.8813),
    "Madagascar": (-18.7669, 46.8691),
    "Malawi": (-13.2543, 34.3015),
    "Malaysia": (4.2105, 101.9758),
    "Maldives": (3.2028, 73.2207),
    "Mali": (17.5707, -3.9962),
    "Mauritania": (21.0079, -10.9408),
    "Mauritius": (-20.3484, 57.5522),
    "Mexico": (23.6345, -102.5528),
    "Moldova": (47.4116, 28.3699),
    "Mongolia": (46.8625, 103.8467),
    "Montenegro": (42.7087, 19.3744),
    "Morocco": (31.7917, -7.0926),
    "Mozambique": (-18.6657, 35.5296),
    "Myanmar": (21.9162, 95.956),
    "Namibia": (-22.9576, 18.4904),
    "Nepal": (28.3949, 84.124),
    "Netherlands": (52.1326, 5.2913),
    "New Zealand": (-40.9006, 174.886),
    "Nicaragua": (12.8654, -85.2072),
    "Niger": (17.6078, 8.0817),
    "Nigeria": (9.082, 8.6753),
    "North Korea": (40.3399, 127.5101),
    "Norway": (60.472, 8.4689),
    "Oman": (21.4735, 55.9754),
    "Pakistan": (30.3753, 69.3451),
    "Panama": (8.5379, -80.7821),
    "Papua New Guinea": (-6.315, 143.9555),
    "Paraguay": (-23.4425, -58.4438),
    "Peru": (-9.19, -75.0152),
    "Philippines": (12.8797, 121.774),
    "Poland": (51.9194, 19.1451),
    "Portugal": (39.3999, -8.2245),
    "Qatar": (25.3548, 51.1839),
    "Romania": (45.9432, 24.9668),
    "Russia": (61.524, 105.3188),
    "Rwanda": (-1.9403, 29.8739),
    "Saudi Arabia": (23.8859, 45.0792),
    "Senegal": (14.4974, -14.4524),
    "Serbia": (44.0165, 21.0059),
    "Sierra Leone": (8.4606, -11.7799),
    "Singapore": (1.3521, 103.8198),
    "Slovakia": (48.669, 19.699),
    "Slovenia": (46.1512, 14.9955),
    "Somalia": (5.1521, 46.1996),
    "South Africa": (-30.5595, 22.9375),
    "South Korea": (35.9078, 127.7669),
    "South Sudan": (6.877, 31.307),
    "Spain": (40.4637, -3.7492),
    "Sri Lanka": (7.8731, 80.7718),
    "Sudan": (12.8628, 30.2176),
    "Suriname": (3.9193, -56.0278),
    "Sweden": (60.1282, 18.6435),
    "Switzerland": (46.8182, 8.2275),
    "Syria": (34.8021, 38.9968),
    "Taiwan": (23.6978, 120.9605),
    "Tajikistan": (38.861, 71.2761),
    "Tanzania": (-6.369, 34.8888),
    "Thailand": (15.87, 100.9925),
    "Togo": (8.6195, 0.8248),
    "Trinidad and Tobago": (10.6918, -61.2225),
    "Tunisia": (33.8869, 9.5375),
    "Turkey": (38.9637, 35.2433),
    "Uganda": (1.3733, 32.2903),
    "Ukraine": (48.3794, 31.1656),
    "United Arab Emirates": (23.4241, 53.8478),
    "United Kingdom": (55.3781, -3.436),
    "UK": (55.3781, -3.436),
    "United States": (37.0902, -95.7129),
    "USA": (37.0902, -95.7129),
    "Uruguay": (-32.5228, -55.7658),
    "Uzbekistan": (41.3775, 64.5853),
    "Venezuela": (6.4238, -66.5897),
    "Vietnam": (14.0583, 108.2772),
    "Yemen": (15.5527, 48.5164),
    "Zambia": (-13.1339, 27.8493),
    "Zimbabwe": (-19.0154, 29.1549),

    # US States
    "California": (36.7783, -119.4179),
    "Texas": (31.9686, -99.9018),
    "Florida": (27.6648, -81.5158),
    "New York": (40.7128, -74.006),
    "Illinois": (40.6331, -89.3985),
    "Ohio": (40.4173, -82.9071),
    "Pennsylvania": (41.2033, -77.1945),
    "Georgia": (32.1656, -82.9001),
    "North Carolina": (35.7596, -79.0193),
    "Michigan": (44.3148, -85.6024),
    "Washington": (47.7511, -120.7401),
    "Arizona": (34.0489, -111.0937),
    "Colorado": (39.5501, -105.7821),
    "Virginia": (37.4316, -78.6569),
    "Massachusetts": (42.4072, -71.3824),
    "Indiana": (40.2672, -86.1349),
    "Missouri": (37.9643, -91.8318),
    "Maryland": (39.0458, -76.6413),
    "Wisconsin": (43.7844, -88.7879),
    "Minnesota": (46.7296, -94.6859),
    "Tennessee": (35.5175, -86.5804),
    "Oregon": (43.8041, -120.5542),
    "Louisiana": (30.9843, -91.9623),
    "Alabama": (32.3182, -86.9023),
    "South Carolina": (33.8361, -81.1637),
    "Kentucky": (37.8393, -84.27),
    "Utah": (39.321, -111.0937),
    "Iowa": (41.878, -93.0977),
    "Nevada": (38.8026, -116.4194),
    "Arkansas": (35.201, -91.8318),
    "Mississippi": (32.3547, -89.3985),
    "Kansas": (39.0119, -98.4842),
    "Connecticut": (41.6032, -73.0877),
    "Hawaii": (19.8968, -155.5828),

    # Key Outbreak Centers / Hubs
    "Kinshasa": (-4.4419, 15.2663),
    "Goma": (-1.6585, 29.2205),
    "Geneva": (46.2044, 6.1432),
    "Atlanta": (33.749, -84.388),
    "New Delhi": (28.6139, 77.209),
    "Beijing": (39.9042, 116.4074),
    "London": (51.5074, -0.1278),
    "Paris": (48.8566, 2.3522),
    "Berlin": (52.52, 13.405),
    "Tokyo": (35.6762, 139.6503),
    "Dhaka": (23.8103, 90.4125),
    "Cairo": (30.0444, 31.2357),
    "Nairobi": (-1.2921, 36.8219),
    "Lagos": (6.5244, 3.3792),
    "Brasilia": (-15.8267, -47.9218),
    "São Paulo": (-23.5505, -46.6333),
    "Bogota": (4.711, -74.0721),
    "Lima": (-12.0464, -77.0428),
    "Bangkok": (13.7563, 100.5018),
    "Manila": (14.5995, 120.9842),
    "Jakarta": (-6.2088, 106.8456)
}

# Complete Disease classification patterns
DISEASE_PATTERNS = {
    "Mpox": ["mpox", "monkeypox", "orthopoxvirus", "clade i", "clade ii"],
    "COVID-19": ["covid", "sars-cov-2", "coronavirus", "omicron", "jn.1", "kp.3"],
    "Influenza": [
        "influenza", "avian flu", "bird flu", "h5n1", "h1n1", "h3n2",
        "swine flu", "hpai", "flu outbreak"
    ],
    "Cholera": ["cholera", "vibrio cholerae"],
    "Dengue": ["dengue", "dengue fever", "breakbone"],
    "Ebola": ["ebola", "ebv", "bundibugyo", "sudan virus"],
    "Marburg": ["marburg", "marburgvirus"],
    "Nipah": ["nipah", "henipavirus"],
    "Measles": ["measles", "rubeola", "morbillivirus"],
    "Malaria": ["malaria", "plasmodium falciparum", "plasmodium vivax"],
    "Plague": ["plague", "yersinia pestis", "bubonic", "pneumonic plague"],
    "Yellow Fever": ["yellow fever"],
    "Zika": ["zika", "zika virus"],
    "Chikungunya": ["chikungunya"],
    "Polio": ["polio", "poliovirus", "poliomyelitis", "cvdpv"],
    "Lassa Fever": ["lassa", "lassa fever"],
    "Oropouche": ["oropouche", "sloth fever"],
    "West Nile": ["west nile", "wnv"],
    "Salmonella": ["salmonella", "salmonellosis"],
    "E.coli": ["e.coli", "escherichia coli", "stec"],
    "Anthrax": ["anthrax", "bacillus anthracis"],
    "Rabies": ["rabies", "lyssavirus"],
    "Meningitis": ["meningitis", "meningococcal"],
    "Legionnaires": ["legionella", "legionnaires"],
    "Hantavirus": ["hantavirus", "hanta"],
    "MERS": ["mers", "middle east respiratory"],
    "Typhoid": ["typhoid", "enteric fever"],
    "Hepatitis": ["hepatitis a", "hepatitis b", "hepatitis e", "hepatitis"],
    "Dermatophilosis": ["dermatophilosis", "dermatophilus"]
}

SEVERITY_KEYWORDS = {
    "critical": [
        "emergency", "epidemic", "pandemic", "rapidly spreading", "mass casualty",
        "outbreak declared", "pheic", "state of emergency", "surge of deaths"
    ],
    "high": [
        "outbreak", "surge", "spike", "alert", "warning", "concern",
        "significant increase", "fatalities", "spreads", "hospitalized"
    ],
    "medium": [
        "cases reported", "monitoring", "investigation", "cluster", "suspected",
        "detected", "exposure", "confirmed cases"
    ],
    "low": [
        "watch", "advisory", "update", "routine", "seasonal", "guidelines",
        "prevention", "risk assessment"
    ]
}


def classify_disease(text: str) -> str:
    """Classify disease from unstructured text."""
    text_lower = text.lower()
    for disease, keywords in DISEASE_PATTERNS.items():
        if any(kw in text_lower for kw in keywords):
            return disease
    return "Infectious Disease"


def classify_severity(text: str) -> str:
    """Classify outbreak severity level."""
    text_lower = text.lower()
    for level in ["critical", "high", "medium", "low"]:
        if any(kw in text_lower for kw in SEVERITY_KEYWORDS[level]):
            return level
    return "medium"


def classify_alert_level(severity: str) -> str:
    mapping = {"critical": "outbreak", "high": "warning", "medium": "watch", "low": "watch"}
    return mapping.get(severity, "watch")


def make_id(source: str, url_or_text: str) -> str:
    return hashlib.md5(f"{source}:{url_or_text}".encode()).hexdigest()


def extract_location_and_country(text: str) -> tuple:
    """
    Extract (location, country, coords) from text.
    First checks specific cities and US states, then countries.
    """
    # 1. Check US States
    us_states = [
        "California", "Texas", "Florida", "New York", "Illinois", "Ohio",
        "Pennsylvania", "Georgia", "North Carolina", "Michigan", "Washington",
        "Arizona", "Colorado", "Virginia", "Massachusetts", "Indiana",
        "Missouri", "Maryland", "Wisconsin", "Minnesota", "Tennessee",
        "Oregon", "Louisiana", "Alabama", "South Carolina", "Kentucky",
        "Utah", "Iowa", "Nevada", "Arkansas", "Mississippi", "Kansas",
        "Connecticut", "Hawaii"
    ]
    for state in us_states:
        pattern = rf"\b{re.escape(state)}\b"
        if re.search(pattern, text, re.IGNORECASE):
            return (f"{state}, United States", "United States", _geo_cache.get(state, (37.0902, -95.7129)))

    # 2. Check Key Outbreak Cities
    cities = [
        "Kinshasa", "Goma", "Geneva", "Atlanta", "New Delhi", "Beijing",
        "London", "Paris", "Berlin", "Tokyo", "Dhaka", "Cairo", "Nairobi",
        "Lagos", "Brasilia", "São Paulo", "Bogota", "Lima", "Bangkok",
        "Manila", "Jakarta"
    ]
    for city in cities:
        pattern = rf"\b{re.escape(city)}\b"
        if re.search(pattern, text, re.IGNORECASE):
            # Find country for this city
            country = "Global"
            if city in ["Kinshasa", "Goma"]: country = "DR Congo"
            elif city == "Geneva": country = "Switzerland"
            elif city == "Atlanta": country = "United States"
            elif city == "New Delhi": country = "India"
            elif city == "Beijing": country = "China"
            elif city == "London": country = "United Kingdom"
            elif city == "Dhaka": country = "Bangladesh"
            elif city == "Nairobi": country = "Kenya"
            elif city in ["Brasilia", "São Paulo"]: country = "Brazil"
            return (f"{city}, {country}", country, _geo_cache.get(city, (0.0, 0.0)))

    # 3. Check Countries
    for country, coords in _geo_cache.items():
        if country in us_states or country in cities:
            continue
        pattern = rf"\b{re.escape(country)}\b"
        if re.search(pattern, text, re.IGNORECASE):
            # Normalize country names
            normalized = country
            if country in ["USA", "U.S."]: normalized = "United States"
            elif country == "UK": normalized = "United Kingdom"
            elif country in ["DRC", "Democratic Republic of Congo"]: normalized = "DR Congo"
            return (normalized, normalized, coords)

    # 4. Check Common Abbreviations
    if re.search(r"\b(US|U\.S\.|USA|America)\b", text):
        return ("United States", "United States", _geo_cache["United States"])
    if re.search(r"\b(UK|Britain|England)\b", text):
        return ("United Kingdom", "United Kingdom", _geo_cache["United Kingdom"])
    if re.search(r"\b(DRC|Congo)\b", text):
        return ("DR Congo", "DR Congo", _geo_cache["DR Congo"])
    if re.search(r"\b(EU|Europe)\b", text):
        return ("Europe", "European Union", (50.8503, 4.3517))

    return ("Global Surveillance", "Global", (20.0, 0.0))


async def geocode_fallback(location: str, country: str) -> tuple:
    """Fallback to Nominatim geocoding if not in pre-mapped cache."""
    if country in _geo_cache:
        return _geo_cache[country]
    if location in _geo_cache:
        return _geo_cache[location]

    try:
        loop = asyncio.get_event_loop()
        query = f"{location}, {country}" if location != country else country
        result = await loop.run_in_executor(
            None, lambda: _geocoder.geocode(query, exactly_one=True)
        )
        if result:
            coords = (result.latitude, result.longitude)
            _geo_cache[location] = coords
            return coords
    except Exception:
        pass

    return (0.0, 0.0)


# ==========================================
# 1. WHO Official Outbreak News RSS
# ==========================================
async def fetch_who_outbreaks() -> List[Dict[str, Any]]:
    """Fetch official WHO RSS feed for international health advisories."""
    events = []
    url = "https://www.who.int/rss-feeds/news-english.xml"

    try:
        async with httpx.AsyncClient(timeout=12, follow_redirects=True) as client:
            resp = await client.get(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
            feed = feedparser.parse(resp.text)

        for entry in feed.entries[:30]:
            title = entry.get("title", "")
            summary = entry.get("summary", "") or entry.get("description", "")
            link = entry.get("link", "")

            full_text = f"{title} {summary}"
            disease = classify_disease(full_text)

            # Filter for health/disease/outbreak items
            health_keywords = ["outbreak", "disease", "virus", "infection", "vaccin", "health", "epidemic", "fever"]
            if disease == "Infectious Disease" and not any(k in full_text.lower() for k in health_keywords):
                continue

            loc_name, country, coords = extract_location_and_country(full_text)
            severity = classify_severity(full_text)

            try:
                date = datetime(*entry.published_parsed[:6], tzinfo=timezone.utc) if hasattr(entry, "published_parsed") and entry.published_parsed else datetime.now(timezone.utc)
            except Exception:
                date = datetime.now(timezone.utc)

            clean_desc = BeautifulSoup(summary, "html.parser").get_text()[:400]

            events.append({
                "id": make_id("WHO", link or title),
                "title": title,
                "description": clean_desc or "Official World Health Organization disease advisory.",
                "disease": disease,
                "country": country,
                "location": loc_name,
                "lat": coords[0],
                "lon": coords[1],
                "date": date.isoformat(),
                "source": "WHO",
                "source_url": link or "https://www.who.int",
                "severity": severity,
                "alert_level": classify_alert_level(severity),
                "tags": [disease, "WHO", country, "Official Notice"],
                "is_active": True
            })

    except Exception as e:
        logger.warning(f"[WHO] Fetch error: {e}")

    logger.info(f"[WHO] Fetched {len(events)} events")
    return events


# ==========================================
# 2. CDC Health Alert Network & Travel Notices
# ==========================================
async def fetch_cdc_alerts() -> List[Dict[str, Any]]:
    """Fetch CDC Health Alert Network and Travel Health Notices."""
    events = []
    feeds = [
        ("https://tools.cdc.gov/api/v2/resources/media/316422.rss", "CDC HAN"),
        ("https://wwwnc.cdc.gov/travel/notices/rss.xml", "CDC Travel")
    ]

    for feed_url, feed_source in feeds:
        try:
            async with httpx.AsyncClient(timeout=12, follow_redirects=True) as client:
                resp = await client.get(feed_url, headers={"User-Agent": "Mozilla/5.0"})
                feed = feedparser.parse(resp.text)

            for entry in feed.entries[:25]:
                title = entry.get("title", "")
                summary = entry.get("summary", "") or entry.get("description", "")
                link = entry.get("link", "")

                full_text = f"{title} {summary}"
                disease = classify_disease(full_text)
                loc_name, country, coords = extract_location_and_country(full_text)
                severity = classify_severity(full_text)

                try:
                    date = datetime(*entry.published_parsed[:6], tzinfo=timezone.utc) if hasattr(entry, "published_parsed") and entry.published_parsed else datetime.now(timezone.utc)
                except Exception:
                    date = datetime.now(timezone.utc)

                clean_desc = BeautifulSoup(summary, "html.parser").get_text()[:400]

                events.append({
                    "id": make_id("CDC", link or title),
                    "title": title[:220],
                    "description": clean_desc or f"CDC epidemiological advisory: {title}",
                    "disease": disease,
                    "country": country if country != "Global" else "United States",
                    "location": loc_name if loc_name != "Global Surveillance" else "United States",
                    "lat": coords[0] if coords != (20.0, 0.0) else _geo_cache["United States"][0],
                    "lon": coords[1] if coords != (20.0, 0.0) else _geo_cache["United States"][1],
                    "date": date.isoformat(),
                    "source": "CDC",
                    "source_url": link or "https://www.cdc.gov",
                    "severity": severity,
                    "alert_level": classify_alert_level(severity),
                    "tags": [disease, "CDC", country, "Alert Network"],
                    "is_active": True
                })

        except Exception as e:
            logger.warning(f"[{feed_source}] Fetch error: {e}")

    logger.info(f"[CDC] Fetched {len(events)} events")
    return events


# ==========================================
# 3. ECDC (European Centre for Disease Prevention & Control)
# ==========================================
async def fetch_ecdc_outbreaks() -> List[Dict[str, Any]]:
    """Fetch official ECDC European and global threat assessment briefs."""
    events = []
    url = "https://www.ecdc.europa.eu/en/taxonomy/term/1295/feed"

    try:
        async with httpx.AsyncClient(timeout=12, follow_redirects=True) as client:
            resp = await client.get(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
            feed = feedparser.parse(resp.text)

        for entry in feed.entries[:25]:
            title = entry.get("title", "")
            summary = entry.get("summary", "") or entry.get("description", "")
            link = entry.get("link", "")

            full_text = f"{title} {summary}"
            disease = classify_disease(full_text)
            loc_name, country, coords = extract_location_and_country(full_text)
            severity = classify_severity(full_text)
            if "rapid outbreak assessment" in full_text.lower() or "threat assessment" in full_text.lower():
                severity = "high"

            try:
                date = datetime(*entry.published_parsed[:6], tzinfo=timezone.utc) if hasattr(entry, "published_parsed") and entry.published_parsed else datetime.now(timezone.utc)
            except Exception:
                date = datetime.now(timezone.utc)

            clean_desc = BeautifulSoup(summary, "html.parser").get_text()[:400]

            events.append({
                "id": make_id("ECDC", link or title),
                "title": title[:220],
                "description": clean_desc or f"ECDC rapid epidemiological threat assessment: {title}",
                "disease": disease,
                "country": country if country != "Global" else "Europe",
                "location": loc_name if loc_name != "Global Surveillance" else "European Union",
                "lat": coords[0] if coords != (20.0, 0.0) else 50.8503,
                "lon": coords[1] if coords != (20.0, 0.0) else 4.3517,
                "date": date.isoformat(),
                "source": "ECDC",
                "source_url": link or "https://www.ecdc.europa.eu",
                "severity": severity,
                "alert_level": classify_alert_level(severity),
                "tags": [disease, "ECDC", country, "Threat Assessment"],
                "is_active": True
            })

    except Exception as e:
        logger.warning(f"[ECDC] Fetch error: {e}")

    logger.info(f"[ECDC] Fetched {len(events)} events")
    return events


# ==========================================
# 4. Disease.sh Open Disease Surveillance API
# ==========================================
async def fetch_disease_sh_data() -> List[Dict[str, Any]]:
    """
    Fetch 100% Free Open Disease Data from disease.sh.
    Generates real-time epidemic surveillance reports for affected countries.
    """
    events = []
    now_iso = datetime.now(timezone.utc).isoformat()

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            # 1. Fetch country statistics
            resp = await client.get("https://disease.sh/v3/covid-19/countries?sort=active")
            if resp.status_code == 200:
                countries = resp.json()
                # Focus on countries with active cases
                for item in countries[:35]:
                    c_name = item.get("country", "")
                    active = item.get("active", 0)
                    cases = item.get("cases", 0)
                    deaths = item.get("deaths", 0)
                    critical = item.get("critical", 0)
                    c_info = item.get("countryInfo", {})

                    lat = c_info.get("lat")
                    lon = c_info.get("long")
                    if lat is None or lon is None:
                        coords = _geo_cache.get(c_name, (0.0, 0.0))
                        lat, lon = coords

                    # Determine severity based on active caseload
                    if active > 500000 or critical > 5000:
                        severity = "critical"
                    elif active > 50000:
                        severity = "high"
                    elif active > 5000:
                        severity = "medium"
                    else:
                        severity = "low"

                    title = f"Epidemiological Surveillance in {c_name} — {active:,} Active Cases"
                    desc = (
                        f"Active disease surveillance reporting {active:,} active cases, "
                        f"{critical:,} critical patients, and {deaths:,} cumulative fatalities in {c_name}. "
                        f"Continuous open data monitoring via disease.sh public health API."
                    )

                    events.append({
                        "id": make_id("Disease.sh", f"{c_name}:active_surveillance"),
                        "title": title,
                        "description": desc,
                        "disease": "COVID-19",
                        "country": c_name,
                        "location": c_name,
                        "lat": float(lat),
                        "lon": float(lon),
                        "date": now_iso,
                        "source": "Disease.sh",
                        "source_url": f"https://disease.sh/v3/covid-19/countries/{c_name}",
                        "severity": severity,
                        "alert_level": classify_alert_level(severity),
                        "cases": cases,
                        "deaths": deaths,
                        "tags": ["COVID-19", "Disease.sh", c_name, "Open API"],
                        "is_active": active > 0
                    })

            # 2. Fetch CDC Influenza surveillance metric from disease.sh
            try:
                resp_flu = await client.get("https://disease.sh/v3/influenza/cdc/ILINet")
                if resp_flu.status_code == 200:
                    flu_data = resp_flu.json()
                    flu_list = flu_data.get("data", [])
                    if flu_list:
                        latest_flu = flu_list[-1]
                        ili_rate = latest_flu.get("unweighted_ili", 0)
                        week = latest_flu.get("week", "recent")
                        year = latest_flu.get("year", 2026)

                        events.append({
                            "id": make_id("Disease.sh", f"cdc_ili_flu_{year}_{week}"),
                            "title": f"CDC Influenza-Like Illness (ILI) Surveillance Week {week} ({year})",
                            "description": (
                                f"US National CDC Outpatient ILI surveillance reports unweighted ILI rate at {ili_rate}%. "
                                f"Surveillance data aggregated via disease.sh Open Disease API."
                            ),
                            "disease": "Influenza",
                            "country": "United States",
                            "location": "United States",
                            "lat": _geo_cache["United States"][0],
                            "lon": _geo_cache["United States"][1],
                            "date": now_iso,
                            "source": "Disease.sh",
                            "source_url": "https://disease.sh/v3/influenza/cdc/ILINet",
                            "severity": "medium",
                            "alert_level": "watch",
                            "cases": int(latest_flu.get("total_patients", 0)),
                            "deaths": 0,
                            "tags": ["Influenza", "CDC ILINet", "Disease.sh", "United States"],
                            "is_active": True
                        })
            except Exception as e:
                logger.debug(f"[Disease.sh Flu] Minor error: {e}")

    except Exception as e:
        logger.warning(f"[Disease.sh] Fetch error: {e}")

    logger.info(f"[Disease.sh] Fetched {len(events)} events")
    return events


# ==========================================
# 5. Global News Disease & Outbreak Surveillance
# ==========================================
async def fetch_global_news_outbreaks() -> List[Dict[str, Any]]:
    """
    Fetch real-time outbreak reports from verified global news and health agency reporting.
    Uses Google News RSS feed for disease outbreaks — 100% free, real-time, no API key required.
    """
    events = []
    # Queries international biological outbreak keywords
    query_url = (
        "https://news.google.com/rss/search?"
        "q=(outbreak+OR+epidemic+OR+mpox+OR+h5n1+OR+cholera+OR+dengue+OR+marburg+OR+measles+OR+ebola)+when:14d"
        "&hl=en-US&gl=US&ceid=US:en"
    )

    try:
        async with httpx.AsyncClient(timeout=15, follow_redirects=True) as client:
            resp = await client.get(query_url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
            feed = feedparser.parse(resp.text)

        for entry in feed.entries[:50]:
            title = entry.get("title", "")
            link = entry.get("link", "")
            summary = entry.get("summary", "") or entry.get("description", "")

            # Extract publisher if format is "Headline - Publisher"
            parts = title.rsplit(" - ", 1)
            headline = parts[0]
            publisher = parts[1] if len(parts) > 1 else "Global Media"

            full_text = f"{headline} {summary}"
            disease = classify_disease(full_text)
            loc_name, country, coords = extract_location_and_country(full_text)
            severity = classify_severity(full_text)

            try:
                date = datetime(*entry.published_parsed[:6], tzinfo=timezone.utc) if hasattr(entry, "published_parsed") and entry.published_parsed else datetime.now(timezone.utc)
            except Exception:
                date = datetime.now(timezone.utc)

            # Try to extract cases if mentioned in title or summary
            cases = None
            case_match = re.search(r"(\d[\d,]*)\s*(?:cases|infections|patients)", full_text, re.IGNORECASE)
            if case_match:
                try:
                    cases = int(case_match.group(1).replace(",", ""))
                except Exception:
                    pass

            events.append({
                "id": make_id("Global News", link or headline),
                "title": headline[:220],
                "description": f"Surveillance dispatch reported via {publisher}: {headline}",
                "disease": disease,
                "country": country,
                "location": loc_name,
                "lat": coords[0],
                "lon": coords[1],
                "date": date.isoformat(),
                "source": "Global News",
                "source_url": link or "https://news.google.com",
                "severity": severity,
                "alert_level": classify_alert_level(severity),
                "cases": cases,
                "tags": [disease, "Global News", publisher, country],
                "is_active": True
            })

    except Exception as e:
        logger.warning(f"[Global News] Fetch error: {e}")

    logger.info(f"[Global News] Fetched {len(events)} events")
    return events


# ==========================================
# Main Aggregator Coordinator
# ==========================================
async def fetch_all_sources() -> Dict[str, Any]:
    """
    Main aggregator: executes 5 free, unauthenticated data fetchers concurrently.
    Guarantees rich global epidemic surveillance data with zero paid API dependencies.
    """
    logger.info("[Fetcher] Starting multi-source free API data collection...")

    tasks = [
        fetch_who_outbreaks(),
        fetch_cdc_alerts(),
        fetch_ecdc_outbreaks(),
        fetch_disease_sh_data(),
        fetch_global_news_outbreaks()
    ]

    results = await asyncio.gather(*tasks, return_exceptions=True)

    all_events = []
    source_stats = {}
    sources = ["WHO", "CDC", "ECDC", "Disease.sh", "Global News"]

    for source, result in zip(sources, results):
        if isinstance(result, Exception):
            logger.error(f"[{source}] Fetch error: {result}")
            source_stats[source] = {"count": 0, "error": str(result)}
        else:
            all_events.extend(result)
            source_stats[source] = {"count": len(result), "error": None}

    logger.info(f"[Fetcher] Collection completed. Total events gathered: {len(all_events)}")
    return {"events": all_events, "stats": source_stats}
