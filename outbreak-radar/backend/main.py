"""
FastAPI main application entry point.
"""
import logging
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from .models.database import init_db, upsert_outbreak
from .routers.outbreaks import router as outbreaks_router
from .services.scheduler import start_scheduler, stop_scheduler, run_data_collection
from .services.seed_data import seed_database

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger(__name__)

FRONTEND_DIR = os.path.join(os.path.dirname(__file__), "..", "frontend")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("🚀 EpiWatch starting up...")
    init_db()
    seeded = seed_database(upsert_outbreak)
    logger.info(f"🌱 Seeded {seeded} verified outbreak baseline events")
    start_scheduler()
    # Trigger background collection asynchronously
    logger.info("🔍 Triggering initial background data collection...")
    import asyncio
    asyncio.create_task(run_data_collection())
    logger.info("✅ EpiWatch ready!")
    yield
    # Shutdown
    stop_scheduler()
    logger.info("👋 EpiWatch shut down.")


app = FastAPI(
    title="EpiWatch API",
    description="Real-time global disease outbreak monitoring system",
    version="1.0.0",
    lifespan=lifespan
)

# CORS for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API routes
app.include_router(outbreaks_router)

# Serve frontend static files
if os.path.exists(FRONTEND_DIR):
    app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")

    @app.get("/")
    async def serve_frontend():
        return FileResponse(os.path.join(FRONTEND_DIR, "index.html"))

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        file_path = os.path.join(FRONTEND_DIR, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(FRONTEND_DIR, "index.html"))
