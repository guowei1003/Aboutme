from fastapi import FastAPI

from routes.biz import router as biz_router

app = FastAPI(title="biz-service", version="1.0.0")
app.include_router(biz_router, prefix="/biz", tags=["biz"])


@app.get("/healthz")
def healthz() -> dict[str, str]:
    return {"status": "ok"}
