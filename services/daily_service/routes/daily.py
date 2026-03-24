from fastapi import APIRouter, HTTPException

from repository.store import store

router = APIRouter()


@router.get("/issues")
def list_issues():
    return {"results": store.list_issues()}


@router.get("/issues/{issue_date}")
def issue_detail(issue_date: str):
    issue = store.get_issue(issue_date)
    if not issue:
        raise HTTPException(status_code=404, detail="not found")
    return issue


@router.get("/archives")
def archives():
    return {"results": store.list_archives()}


@router.get("/top10")
def latest_top10():
    issues = store.list_issues()
    if not issues:
        return {"results": []}
    return {"results": issues[0].top10}


@router.get("/keywords")
def latest_keywords():
    issues = store.list_issues()
    if not issues:
        return {"results": []}
    return {"results": issues[0].keywords}


@router.get("/trends")
def latest_trends():
    issues = store.list_issues()
    if not issues:
        return {"results": []}
    return {"results": issues[0].trends}
