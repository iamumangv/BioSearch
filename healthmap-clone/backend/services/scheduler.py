"""
Scheduler service: runs periodic data collection every 30 minutes.
"""
import logging
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger

from .fetcher import fetch_all_sources
from ..models.database import upsert_outbreak, log_fetch

logger = logging.getLogger(__name__)

scheduler = AsyncIOScheduler()
_last_run_stats = {}


async def run_data_collection():
    """Main scheduled task: fetch data from all sources and persist."""
    global _last_run_stats
    logger.info("[Scheduler] Running data collection cycle...")

    try:
        result = await fetch_all_sources()
        events = result["events"]
        stats = result["stats"]

        new_count = 0
        for event in events:
            is_new = upsert_outbreak(event)
            if is_new:
                new_count += 1

        for source, stat in stats.items():
            log_fetch(
                source=source,
                count=stat.get("count", 0),
                status="success" if not stat.get("error") else "error",
                error=stat.get("error")
            )

        _last_run_stats = {
            "total_fetched": len(events),
            "new_events": new_count,
            "source_stats": stats
        }
        logger.info(f"[Scheduler] Cycle complete. Total: {len(events)}, New: {new_count}")

    except Exception as e:
        logger.error(f"[Scheduler] Data collection failed: {e}")
        _last_run_stats = {"error": str(e)}


def get_last_run_stats() -> dict:
    return _last_run_stats


def start_scheduler():
    """Initialize and start the background scheduler."""
    scheduler.add_job(
        run_data_collection,
        trigger=IntervalTrigger(minutes=30),
        id="data_collection",
        name="Multi-source Disease Data Collection",
        replace_existing=True
    )
    scheduler.start()
    logger.info("[Scheduler] Started. Data collection every 30 minutes.")


def stop_scheduler():
    if scheduler.running:
        scheduler.shutdown()
        logger.info("[Scheduler] Stopped.")
