import sqlite3
import json
import os
from datetime import datetime
from typing import List, Optional
from contextlib import contextmanager

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "outbreaks.db")


def get_connection():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn


@contextmanager
def db_connection():
    conn = get_connection()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def init_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    with db_connection() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS outbreaks (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                description TEXT,
                disease TEXT,
                country TEXT,
                location TEXT,
                lat REAL,
                lon REAL,
                date TEXT,
                source TEXT,
                source_url TEXT,
                severity TEXT DEFAULT 'medium',
                alert_level TEXT DEFAULT 'watch',
                cases INTEGER,
                deaths INTEGER,
                tags TEXT DEFAULT '[]',
                is_active INTEGER DEFAULT 1,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)
        conn.execute("""
            CREATE INDEX IF NOT EXISTS idx_date ON outbreaks(date)
        """)
        conn.execute("""
            CREATE INDEX IF NOT EXISTS idx_disease ON outbreaks(disease)
        """)
        conn.execute("""
            CREATE INDEX IF NOT EXISTS idx_country ON outbreaks(country)
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS fetch_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                source TEXT,
                fetched_at TEXT,
                events_count INTEGER,
                status TEXT,
                error TEXT
            )
        """)
    print(f"[DB] Initialized database at {DB_PATH}")


def upsert_outbreak(event: dict) -> bool:
    with db_connection() as conn:
        existing = conn.execute(
            "SELECT id FROM outbreaks WHERE id = ?", (event["id"],)
        ).fetchone()

        if existing:
            conn.execute("""
                UPDATE outbreaks SET
                    title = ?, description = ?, disease = ?, country = ?,
                    location = ?, lat = ?, lon = ?, date = ?, severity = ?,
                    alert_level = ?, cases = ?, deaths = ?, tags = ?,
                    is_active = ?, updated_at = ?
                WHERE id = ?
            """, (
                event["title"], event["description"], event["disease"],
                event["country"], event["location"], event["lat"], event["lon"],
                event["date"], event["severity"], event["alert_level"],
                event.get("cases"), event.get("deaths"),
                json.dumps(event.get("tags", [])),
                1 if event.get("is_active", True) else 0,
                datetime.utcnow().isoformat(),
                event["id"]
            ))
            return False
        else:
            conn.execute("""
                INSERT INTO outbreaks (
                    id, title, description, disease, country, location,
                    lat, lon, date, source, source_url, severity, alert_level,
                    cases, deaths, tags, is_active
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                event["id"], event["title"], event["description"],
                event["disease"], event["country"], event["location"],
                event["lat"], event["lon"], event["date"],
                event["source"], event["source_url"],
                event["severity"], event["alert_level"],
                event.get("cases"), event.get("deaths"),
                json.dumps(event.get("tags", [])),
                1 if event.get("is_active", True) else 0
            ))
            return True


def get_outbreaks(
    days: int = 30,
    disease: Optional[str] = None,
    country: Optional[str] = None,
    severity: Optional[str] = None,
    source: Optional[str] = None,
    limit: int = 500
) -> List[dict]:
    query = """
        SELECT * FROM outbreaks
        WHERE date >= datetime('now', ?)
    """
    params = [f"-{days} days"]

    if disease:
        query += " AND LOWER(disease) LIKE ?"
        params.append(f"%{disease.lower()}%")
    if country:
        query += " AND LOWER(country) LIKE ?"
        params.append(f"%{country.lower()}%")
    if severity:
        query += " AND severity = ?"
        params.append(severity)
    if source:
        query += " AND LOWER(source) LIKE ?"
        params.append(f"%{source.lower()}%")

    query += " ORDER BY date DESC LIMIT ?"
    params.append(limit)

    with db_connection() as conn:
        rows = conn.execute(query, params).fetchall()
        result = []
        for row in rows:
            d = dict(row)
            d["tags"] = json.loads(d.get("tags") or "[]")
            result.append(d)
        return result


def get_summary() -> dict:
    with db_connection() as conn:
        total = conn.execute("SELECT COUNT(*) FROM outbreaks").fetchone()[0]
        active = conn.execute(
            "SELECT COUNT(*) FROM outbreaks WHERE is_active = 1 AND date >= datetime('now', '-30 days')"
        ).fetchone()[0]
        countries = conn.execute(
            "SELECT COUNT(DISTINCT country) FROM outbreaks WHERE date >= datetime('now', '-30 days')"
        ).fetchone()[0]

        by_severity = {}
        for row in conn.execute(
            "SELECT severity, COUNT(*) as cnt FROM outbreaks WHERE date >= datetime('now', '-30 days') GROUP BY severity"
        ).fetchall():
            by_severity[row["severity"]] = row["cnt"]

        by_disease = {}
        for row in conn.execute(
            "SELECT disease, COUNT(*) as cnt FROM outbreaks WHERE date >= datetime('now', '-30 days') GROUP BY disease ORDER BY cnt DESC LIMIT 10"
        ).fetchall():
            by_disease[row["disease"]] = row["cnt"]

        top_countries = []
        for row in conn.execute(
            "SELECT country, COUNT(*) as cnt FROM outbreaks WHERE date >= datetime('now', '-30 days') GROUP BY country ORDER BY cnt DESC LIMIT 10"
        ).fetchall():
            top_countries.append({"country": row["country"], "count": row["cnt"]})

        last_updated = conn.execute(
            "SELECT MAX(updated_at) FROM outbreaks"
        ).fetchone()[0]

        return {
            "total_events": total,
            "active_outbreaks": active,
            "countries_affected": countries,
            "last_updated": last_updated or datetime.utcnow().isoformat(),
            "events_by_severity": by_severity,
            "events_by_disease": by_disease,
            "top_affected_countries": top_countries
        }


def log_fetch(source: str, count: int, status: str, error: str = None):
    with db_connection() as conn:
        conn.execute(
            "INSERT INTO fetch_log (source, fetched_at, events_count, status, error) VALUES (?, ?, ?, ?, ?)",
            (source, datetime.utcnow().isoformat(), count, status, error)
        )


def get_diseases() -> List[str]:
    with db_connection() as conn:
        rows = conn.execute(
            "SELECT DISTINCT disease FROM outbreaks WHERE disease IS NOT NULL ORDER BY disease"
        ).fetchall()
        return [row["disease"] for row in rows if row["disease"]]


def get_countries() -> List[str]:
    with db_connection() as conn:
        rows = conn.execute(
            "SELECT DISTINCT country FROM outbreaks WHERE country IS NOT NULL ORDER BY country"
        ).fetchall()
        return [row["country"] for row in rows if row["country"]]
