"""
API router for outbreak data endpoints.
"""
from fastapi import APIRouter, Query, BackgroundTasks, HTTPException
from typing import Optional, List
from datetime import datetime

from ..models.database import (
    get_outbreaks, get_summary, get_diseases, get_countries
)
from ..services.scheduler import run_data_collection, get_last_run_stats

router = APIRouter(prefix="/api", tags=["outbreaks"])


@router.get("/outbreaks")
async def list_outbreaks(
    days: int = Query(default=30, ge=1, le=365, description="Days back to query"),
    disease: Optional[str] = Query(default=None),
    country: Optional[str] = Query(default=None),
    severity: Optional[str] = Query(default=None, pattern="^(low|medium|high|critical)$"),
    source: Optional[str] = Query(default=None),
    limit: int = Query(default=500, ge=1, le=1000)
):
    """Get outbreak events with optional filters."""
    events = get_outbreaks(
        days=days,
        disease=disease,
        country=country,
        severity=severity,
        source=source,
        limit=limit
    )
    return {
        "count": len(events),
        "events": events,
        "fetched_at": datetime.utcnow().isoformat()
    }


@router.get("/summary")
async def get_outbreak_summary():
    """Get high-level statistics about current outbreaks."""
    return get_summary()


@router.get("/diseases")
async def list_diseases():
    """Get all unique disease names in the database."""
    return {"diseases": get_diseases()}


@router.get("/countries")
async def list_countries():
    """Get all unique countries in the database."""
    return {"countries": get_countries()}


@router.post("/refresh")
async def refresh_data(background_tasks: BackgroundTasks):
    """Manually trigger data collection from all sources."""
    background_tasks.add_task(run_data_collection)
    return {"message": "Data refresh triggered", "status": "processing"}


@router.get("/status")
async def get_status():
    """Get system status and last fetch statistics."""
    stats = get_last_run_stats()
    return {
        "status": "running",
        "last_run_stats": stats,
        "timestamp": datetime.utcnow().isoformat()
    }


@router.get("/outbreaks/{outbreak_id}")
async def get_outbreak_detail(outbreak_id: str):
    """Get a specific outbreak event by ID."""
    events = get_outbreaks(days=365, limit=1000)
    for event in events:
        if event["id"] == outbreak_id:
            return event
    raise HTTPException(status_code=404, detail="Outbreak event not found")


@router.get("/sources")
async def list_sources():
    """List all integrated 100% free public health and epidemic data sources."""
    return {
        "sources": [
            {
                "id": "who",
                "name": "World Health Organization (WHO)",
                "type": "Official Health Agency RSS",
                "auth_required": False,
                "cost": "Free",
                "feed_url": "https://www.who.int/rss-feeds/news-english.xml",
                "description": "Global official disease advisories and emergency public health updates."
            },
            {
                "id": "cdc",
                "name": "Centers for Disease Control and Prevention (CDC)",
                "type": "Official Health Agency RSS",
                "auth_required": False,
                "cost": "Free",
                "feed_url": "https://tools.cdc.gov/api/v2/resources/media/316422.rss",
                "description": "CDC Health Alert Network (HAN) & international Travel Health Notices."
            },
            {
                "id": "ecdc",
                "name": "European Centre for Disease Prevention and Control (ECDC)",
                "type": "Epidemiological Threat Assessments RSS",
                "auth_required": False,
                "cost": "Free",
                "feed_url": "https://www.ecdc.europa.eu/en/taxonomy/term/1295/feed",
                "description": "Rapid outbreak assessments and infectious disease threat briefs across Europe and worldwide."
            },
            {
                "id": "disease_sh",
                "name": "Disease.sh Open Disease API",
                "type": "REST API",
                "auth_required": False,
                "cost": "Free (Open Source)",
                "api_url": "https://disease.sh/v3/covid-19/countries",
                "description": "Comprehensive open disease data covering active cases, critical patients, and historical surveillance."
            },
            {
                "id": "global_news",
                "name": "Global Disease News Surveillance",
                "type": "Real-time Media & Medical Press RSS",
                "auth_required": False,
                "cost": "Free",
                "feed_url": "https://news.google.com/rss/search",
                "description": "Continuous media and agency monitoring (Reuters, CIDRAP, FDA, BBC, AP) for early outbreak detection."
            }
        ]
    }


@router.get("/stats/covid")
async def get_covid_stats(country: Optional[str] = None):
    """Query free real-time disease statistics from Disease.sh API."""
    import httpx
    url = f"https://disease.sh/v3/covid-19/countries/{country}" if country else "https://disease.sh/v3/covid-19/all"
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(url)
            if resp.status_code == 200:
                return resp.json()
            return {"error": f"Upstream API returned {resp.status_code}"}
    except Exception as e:
        return {"error": str(e)}


@router.get("/stats/influenza")
async def get_influenza_stats():
    """Query free CDC Influenza-Like Illness surveillance data from Disease.sh API."""
    import httpx
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get("https://disease.sh/v3/influenza/cdc/ILINet")
            if resp.status_code == 200:
                return resp.json()
            return {"error": f"Upstream API returned {resp.status_code}"}
    except Exception as e:
        return {"error": str(e)}

