from datetime import datetime

from models.schemas import BizItem


class BizStore:
    def __init__(self) -> None:
        self._items = [
            BizItem(
                id=1,
                issue_date=datetime.utcnow().strftime("%Y-%m-%d"),
                title="AI 自动化咨询服务",
                summary="面向中小团队的低成本自动化改造机会。",
                tags=["自动化", "咨询"],
                score=86,
                created_at=datetime.utcnow(),
            )
        ]

    def list_items(self) -> list[BizItem]:
        return self._items

    def get_item(self, item_id: int) -> BizItem | None:
        return next((x for x in self._items if x.id == item_id), None)

    def list_categories(self) -> list[str]:
        seen = set()
        for item in self._items:
            for tag in item.tags:
                seen.add(tag)
        return sorted(seen)

    def list_recommend(self) -> list[BizItem]:
        return sorted(self._items, key=lambda x: x.score, reverse=True)[:5]


store = BizStore()
