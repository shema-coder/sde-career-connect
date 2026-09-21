"""
Knowledge Layer API routes.

These routes expose structured SDE knowledge without changing
the existing AI endpoint.
"""

from fastapi import APIRouter, HTTPException, Query

from .service import (
    find_institutions,
    get_all_institutions,
    get_institution,
    get_knowledge_summary,
)


router = APIRouter(
    prefix="/knowledge",
    tags=["SDE Knowledge"],
)


@router.get("/summary")
def knowledge_summary():
    return get_knowledge_summary()


@router.get("/institutions")
def institutions():
    return {
        "count": len(get_all_institutions()),
        "institutions": get_all_institutions(),
    }


@router.get("/institutions/{code}")
def institution(code: str):
    result = get_institution(code)

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Institution not found in the SDE knowledge registry.",
        )

    return result


@router.get("/search")
def knowledge_search(
    q: str = Query(..., min_length=1, max_length=200)
):
    results = find_institutions(q)

    return {
        "query": q,
        "count": len(results),
        "results": results,
    }
