# agent/routers/reporter.py
from fastapi import APIRouter, HTTPException
from agent.services.reporter_service import project_snapshot

router = APIRouter(prefix="/agents/reporter", tags=["ReporterAgent"])

@router.get("/projects/{project_id}/snapshot")
def get_project_snapshot(project_id: int):
    try:
        data = project_snapshot(project_id)
        return {"ok": True, "data": data}
    except Exception as e:
        # If you want internal logs, log here; keep API error concise.
        raise HTTPException(status_code=500, detail=f"ReporterAgent error: {str(e)}")
