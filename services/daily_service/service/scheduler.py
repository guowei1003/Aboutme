from apscheduler.schedulers.background import BackgroundScheduler

from repository.store import store
from service.pipeline import ai_generator_service, crawl_service


class SchedulerService:
    def __init__(self) -> None:
        self._scheduler = BackgroundScheduler(timezone="Asia/Shanghai")

    def start(self) -> None:
        if not self._scheduler.running:
            self._scheduler.start()

    def stop(self) -> None:
        if self._scheduler.running:
            self._scheduler.shutdown(wait=False)

    def refresh_jobs(self) -> None:
        self._scheduler.remove_all_jobs()
        for robot in store.list_robots():
            if not robot.enabled:
                continue
            self._scheduler.add_job(
                self._run_robot,
                "cron",
                id=f"robot-{robot.id}",
                replace_existing=True,
                **self._parse_cron(robot.schedule_cron),
                kwargs={"robot_id": robot.id},
            )

    def _parse_cron(self, expr: str) -> dict[str, str]:
        minute, hour, day, month, day_of_week = expr.split()
        return {
            "minute": minute,
            "hour": hour,
            "day": day,
            "month": month,
            "day_of_week": day_of_week,
        }

    def _run_robot(self, robot_id: int) -> None:
        robot = store.get_robot(robot_id)
        if not robot:
            return
        job = store.create_job(robot_id=robot_id, status="running")
        try:
            raw_items = crawl_service.crawl(robot.source_urls, robot.max_items)
            issue = ai_generator_service.generate_daily(robot, raw_items)
            store.save_issue(issue)
            store.finish_job(job.id, "success", f"generated issue {issue.issue_date}")
        except Exception as exc:  # pragma: no cover
            store.finish_job(job.id, "failed", str(exc))


scheduler_service = SchedulerService()
