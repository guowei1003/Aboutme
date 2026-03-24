from models.schemas import Profile, ProfileLink, SiteSetting


class ProfileStore:
    def __init__(self) -> None:
        self._profile = Profile(
            display_name="爱窝啦 Aivora",
            bio="专注 AI 资讯与 AI 商机洞察。",
            avatar="https://news.aivora.cn/logo.png",
            location="Shanghai",
        )
        self._links = [
            ProfileLink(title="AI 日报", url="/"),
            ProfileLink(title="AI 商机", url="/biz"),
            ProfileLink(title="个人主页", url="/profile"),
        ]
        self._settings = SiteSetting(theme="system", lang="zh-CN", show_biz_entry=True)

    def get_profile(self) -> Profile:
        return self._profile

    def get_links(self) -> list[ProfileLink]:
        return self._links

    def get_settings(self) -> SiteSetting:
        return self._settings


store = ProfileStore()
