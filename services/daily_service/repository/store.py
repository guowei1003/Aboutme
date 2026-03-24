from datetime import datetime

from models.schemas import CrawlJob, DailyIssue, RobotConfig, RobotConfigIn


class InMemoryStore:
    def __init__(self) -> None:
        self._issues: dict[str, DailyIssue] = {}
        self._robots: dict[int, RobotConfig] = {}
        self._jobs: dict[int, CrawlJob] = {}
        self._robot_seq = 1
        self._job_seq = 1

    def list_issues(self) -> list[DailyIssue]:
        return sorted(self._issues.values(), key=lambda x: x.issue_date, reverse=True)

    def get_issue(self, issue_date: str) -> DailyIssue | None:
        return self._issues.get(issue_date)

    def save_issue(self, issue: DailyIssue) -> DailyIssue:
        self._issues[issue.issue_date] = issue
        return issue

    def list_archives(self) -> list[str]:
        return sorted({x.issue_date[:7] for x in self._issues.values()}, reverse=True)

    def list_robots(self) -> list[RobotConfig]:
        return list(self._robots.values())

    def get_robot(self, robot_id: int) -> RobotConfig | None:
        return self._robots.get(robot_id)

    def create_robot(self, payload: RobotConfigIn) -> RobotConfig:
        robot = RobotConfig(id=self._robot_seq, **payload.model_dump())
        self._robots[self._robot_seq] = robot
        self._robot_seq += 1
        return robot

    def update_robot(self, robot_id: int, payload: RobotConfigIn) -> RobotConfig | None:
        if robot_id not in self._robots:
            return None
        robot = RobotConfig(id=robot_id, **payload.model_dump())
        self._robots[robot_id] = robot
        return robot

    def create_job(self, robot_id: int, status: str, message: str = "") -> CrawlJob:
        job = CrawlJob(
            id=self._job_seq,
            robot_id=robot_id,
            status=status,
            started_at=datetime.utcnow(),
            message=message,
        )
        self._jobs[self._job_seq] = job
        self._job_seq += 1
        return job

    def finish_job(self, job_id: int, status: str, message: str = "") -> CrawlJob | None:
        job = self._jobs.get(job_id)
        if not job:
            return None
        job.status = status
        job.finished_at = datetime.utcnow()
        job.message = message
        self._jobs[job_id] = job
        return job

    def list_jobs(self) -> list[CrawlJob]:
        return sorted(self._jobs.values(), key=lambda x: x.started_at, reverse=True)


store = InMemoryStore()
