from datetime import datetime

from models.schemas import DailyIssue, DailyTopItem, DailyTrend, RobotConfig


class CrawlService:
    def crawl(self, source_urls: list[str], limit: int) -> list[dict[str, str]]:
        # 后续可替换为 RSS/API/网页抓取实现
        return [
            {
                "title": f"AI 资讯 {idx + 1}",
                "content": f"来自 {url} 的示例内容",
            }
            for idx, url in enumerate(source_urls[:limit])
        ]


class AIGeneratorService:
    def generate_daily(self, robot: RobotConfig, raw_items: list[dict[str, str]]) -> DailyIssue:
        top10 = [
            DailyTopItem(rank=i + 1, title=item["title"], summary=item["content"])
            for i, item in enumerate(raw_items[:10])
        ]
        trends = [
            DailyTrend(
                title="Agent Skills 生态持续增长",
                predict_time="2026Q2",
                probability=80,
                reason="开发者生态活跃，工具链持续完善",
            )
        ]
        issue_date = datetime.utcnow().strftime("%Y-%m-%d")
        return DailyIssue(
            issue_date=issue_date,
            title=f"AI 日报 {issue_date}",
            one_line="自动抓取与 AI 生成完成。",
            keywords=["AI日报", "自动化", robot.ai_model],
            top10=top10,
            trends=trends,
            created_at=datetime.utcnow(),
        )


crawl_service = CrawlService()
ai_generator_service = AIGeneratorService()
