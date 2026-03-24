from datetime import datetime
from pydantic import BaseModel, Field


class DailyTopItem(BaseModel):
    rank: int
    title: str
    summary: str


class DailyTrend(BaseModel):
    title: str
    predict_time: str
    probability: int = Field(ge=0, le=100)
    reason: str


class DailyIssue(BaseModel):
    issue_date: str
    title: str
    one_line: str
    keywords: list[str]
    top10: list[DailyTopItem]
    trends: list[DailyTrend]
    created_at: datetime


class RobotConfigIn(BaseModel):
    name: str
    enabled: bool = True
    schedule_cron: str
    source_urls: list[str]
    ai_model: str
    prompt_template: str
    max_items: int = 30
    auto_publish: bool = True


class RobotConfig(RobotConfigIn):
    id: int


class CrawlJob(BaseModel):
    id: int
    robot_id: int
    status: str
    started_at: datetime
    finished_at: datetime | None = None
    message: str = ""
