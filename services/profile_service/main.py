from fastapi import FastAPI

from routes.profile import router as profile_router

app = FastAPI(title="profile-service", version="1.0.0")
app.include_router(profile_router, prefix="/profile", tags=["profile"])


@app.get("/healthz")
def healthz() -> dict[str, str]:
    return {"status": "ok"}
