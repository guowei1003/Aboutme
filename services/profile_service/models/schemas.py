from pydantic import BaseModel


class Profile(BaseModel):
    display_name: str
    bio: str
    avatar: str
    location: str


class ProfileLink(BaseModel):
    title: str
    url: str


class SiteSetting(BaseModel):
    theme: str
    lang: str
    show_biz_entry: bool
