# agent/routers/llm.py
from fastapi import APIRouter, HTTPException, Query
from agent.services.llm_service import analyze_project_with_llm, llm_echo

router = APIRouter(prefix="/agents/llm", tags=["LLMAgent"])

@router.get("/projects/{project_id}/plan")
def get_ai_plan(project_id: int):
    try:
        plan = analyze_project_with_llm(project_id)
        return {"ok": True, "data": plan.model_dump()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/ping")
def ping_llm(q: str = Query("pong")):
    try:
        reply = llm_echo(q)
        return {"ok": True, "echo": reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
