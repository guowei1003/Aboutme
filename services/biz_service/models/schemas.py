from datetime import datetime

from pydantic import BaseModel


class BizItem(BaseModel):
    id: int
    issue_date: str
    title: str
    summary: str
    tags: list[str]
    score: int
    created_at: datetime
