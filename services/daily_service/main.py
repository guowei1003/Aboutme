from contextlib import asynccontextmanager

from fastapi import FastAPI

from routes.daily import router as daily_router
from routes.robots import router as robot_router
from service.scheduler import scheduler_service


@asynccontextmanager
async def lifespan(_: FastAPI):
    scheduler_service.start()
    yield
    scheduler_service.stop()


app = FastAPI(title="daily-service", version="1.0.0", lifespan=lifespan)
app.include_router(daily_router, prefix="/daily", tags=["daily"])
app.include_router(robot_router, prefix="/robots", tags=["robots"])


@app.get("/healthz")
def healthz() -> dict[str, str]:
    return {"status": "ok"}
