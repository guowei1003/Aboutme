import os

import httpx
from fastapi import FastAPI, HTTPException

DAILY_SERVICE = os.getenv("DAILY_SERVICE_URL", "http://daily-service:8001")
BIZ_SERVICE = os.getenv("BIZ_SERVICE_URL", "http://biz-service:8002")
PROFILE_SERVICE = os.getenv("PROFILE_SERVICE_URL", "http://profile-service:8003")

app = FastAPI(title="api-gateway", version="1.0.0")


async def proxy_get(base_url: str, path: str, params: dict | None = None):
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.get(f"{base_url}{path}", params=params)
        if resp.status_code >= 400:
            raise HTTPException(status_code=resp.status_code, detail=resp.text)
        return resp.json()


async def proxy_write(base_url: str, path: str, method: str, payload: dict | None = None):
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.request(method, f"{base_url}{path}", json=payload)
        if resp.status_code >= 400:
            raise HTTPException(status_code=resp.status_code, detail=resp.text)
        if not resp.content:
            return {}
        return resp.json()


@app.get("/healthz")
def healthz():
    return {"status": "ok"}


@app.get("/api/daily/{path:path}")
async def daily_get(path: str):
    return await proxy_get(DAILY_SERVICE, f"/daily/{path}")


@app.get("/api/biz/{path:path}")
async def biz_get(path: str):
    return await proxy_get(BIZ_SERVICE, f"/biz/{path}")


@app.get("/api/profile/{path:path}")
async def profile_get(path: str):
    suffix = f"/profile/{path}" if path else "/profile"
    return await proxy_get(PROFILE_SERVICE, suffix)


@app.post("/api/daily/robots")
async def robot_create(payload: dict):
    return await proxy_write(DAILY_SERVICE, "/robots", "POST", payload)


@app.put("/api/daily/robots/{robot_id}")
async def robot_update(robot_id: int, payload: dict):
    return await proxy_write(DAILY_SERVICE, f"/robots/{robot_id}", "PUT", payload)


@app.post("/api/daily/robots/{robot_id}/toggle")
async def robot_toggle(robot_id: int):
    return await proxy_write(DAILY_SERVICE, f"/robots/{robot_id}/toggle", "POST")
