# agent/routers/analytics.py
from fastapi import APIRouter, HTTPException, Query
from agent.services.reopen_service import analyze_reopenings

router = APIRouter(prefix="/agents/analytics", tags=["AnalyticsAgent"])

@router.get("/reopens")
def get_reopens(
    days: int = Query(90, ge=1, le=365)
):
    try:
        result = analyze_reopenings(days=days)
        return {"ok": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
