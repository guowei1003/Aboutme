from fastapi import APIRouter, HTTPException

from repository.store import store

router = APIRouter()


@router.get("/issues")
def list_issues():
    return {"results": store.list_items()}


@router.get("/issues/{item_id}")
def issue_detail(item_id: int):
    item = store.get_item(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="not found")
    return item


@router.get("/categories")
def categories():
    return {"results": store.list_categories()}


@router.get("/recommend")
def recommend():
    return {"results": store.list_recommend()}
