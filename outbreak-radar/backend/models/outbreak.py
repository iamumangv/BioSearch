from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class OutbreakEvent(BaseModel):
    id: str
    title: str
    description: str
    disease: str
    country: str
    location: str
    lat: float
    lon: float
    date: datetime
    source: str
    source_url: str
    severity: str  # "low", "medium", "high", "critical"
    alert_level: str  # "watch", "warning", "outbreak"
    cases: Optional[int] = None
    deaths: Optional[int] = None
    tags: List[str] = []
    is_active: bool = True


class OutbreakSummary(BaseModel):
    total_events: int
    active_outbreaks: int
    countries_affected: int
    last_updated: datetime
    events_by_severity: dict
    events_by_disease: dict
    top_affected_countries: List[dict]


class FilterParams(BaseModel):
    disease: Optional[str] = None
    country: Optional[str] = None
    severity: Optional[str] = None
    days: Optional[int] = 30
    source: Optional[str] = None
