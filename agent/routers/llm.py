from fastapi import APIRouter, HTTPException, Query
from agent.services.llm_service import llm_echo

router = APIRouter(prefix="/agents/llm", tags=["LLMAgent"])

@router.get("/ping")
def ping_llm(q: str = Query("pong")):
    try:
        reply = llm_echo(q)
        return {"ok": True, "echo": reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
