from fastapi import APIRouter

from repository.store import store

router = APIRouter()


@router.get("")
def profile():
    return store.get_profile()


@router.get("/links")
def links():
    return {"results": store.get_links()}


@router.get("/settings")
def settings():
    return store.get_settings()
