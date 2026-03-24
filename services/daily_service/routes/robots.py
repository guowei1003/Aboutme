from fastapi import APIRouter, HTTPException

from models.schemas import RobotConfigIn
from repository.store import store
from service.scheduler import scheduler_service

router = APIRouter()


@router.get("")
def list_robots():
    return {"results": store.list_robots()}


@router.post("")
def create_robot(payload: RobotConfigIn):
    if len(payload.schedule_cron.split()) != 5:
        raise HTTPException(status_code=400, detail="invalid cron expression")
    robot = store.create_robot(payload)
    scheduler_service.refresh_jobs()
    return robot


@router.put("/{robot_id}")
def update_robot(robot_id: int, payload: RobotConfigIn):
    if len(payload.schedule_cron.split()) != 5:
        raise HTTPException(status_code=400, detail="invalid cron expression")
    robot = store.update_robot(robot_id, payload)
    if not robot:
        raise HTTPException(status_code=404, detail="not found")
    scheduler_service.refresh_jobs()
    return robot


@router.post("/{robot_id}/toggle")
def toggle_robot(robot_id: int):
    current = store.get_robot(robot_id)
    if not current:
        raise HTTPException(status_code=404, detail="not found")
    updated = store.update_robot(
        robot_id,
        RobotConfigIn(
            name=current.name,
            enabled=not current.enabled,
            schedule_cron=current.schedule_cron,
            source_urls=current.source_urls,
            ai_model=current.ai_model,
            prompt_template=current.prompt_template,
            max_items=current.max_items,
            auto_publish=current.auto_publish,
        ),
    )
    scheduler_service.refresh_jobs()
    return updated


@router.get("/jobs")
def list_jobs():
    return {"results": store.list_jobs()}
