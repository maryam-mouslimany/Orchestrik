# agent/services/llm_service.py
import os, json
from typing import Any, Dict
from pydantic import BaseModel, Field, ValidationError
from openai import OpenAI

from agent.services.reporter_service import project_snapshot

# ---------- CONFIG ----------
# Option A (recommended): set an env var LLM_API_KEY in agent/.env (LLM_API_KEY=sk-...)
LLM_API_KEY = os.getenv("LLM_API_KEY")
LLM_MODEL   = os.getenv("LLM_MODEL", "gpt-4o-mini")
LLM_BASE_URL = os.getenv("LLM_BASE_URL")  # leave None for OpenAI

# Option B (hardcode just to get moving; replace with your key)
# LLM_API_KEY = "PUT_YOUR_OPENAI_KEY_HERE"

if not LLM_API_KEY:
    raise RuntimeError("LLM_API_KEY is missing. Put it in agent/.env or hardcode it in llm_service.py for now.")

client_kwargs = {"api_key": LLM_API_KEY}
if LLM_BASE_URL:
    client_kwargs["base_url"] = LLM_BASE_URL
client = OpenAI(**client_kwargs)

class SuggestedAssignment(BaseModel):
    task_id: int
    suggested_user_id: int
    reason: str = Field(..., max_length=400)

class AIPlan(BaseModel):
    project_id: int
    summary: str = Field(..., max_length=600)
    top_risks: list[str]
    priorities: list[str]
    suggestions: list[SuggestedAssignment]

SYSTEM_PROMPT = (
    "You are an assistant for a task management system. "
    "You will receive a JSON snapshot of a project. "
    "Return STRICT JSON only with schema: "
    "{ project_id:int, summary:str, top_risks:[str], priorities:[str], "
    "  suggestions:[{task_id:int, suggested_user_id:int, reason:str}] }"
)

def _build_user_content(snapshot: Dict[str, Any]) -> str:
    # keep prompt compact
    return json.dumps({
        "project_id": snapshot["project_id"],
        "totals_by_status": snapshot.get("totals_by_status", {}),
        "overdue": snapshot.get("overdue", [])[:20],
        "created_this_week": snapshot.get("created_this_week", 0),
        "completed_this_week": snapshot.get("completed_this_week", 0),
        "workload": snapshot.get("workload", [])[:50],
        "generated_at_utc": snapshot.get("generated_at_utc"),
    }, ensure_ascii=False)

def analyze_project_with_llm(project_id: int) -> AIPlan:
    snapshot = project_snapshot(project_id)
    completion = client.chat.completions.create(
        model=LLM_MODEL,
        temperature=0.2,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": _build_user_content(snapshot)},
        ],
        # If your model supports it, uncomment to force JSON:
        # response_format={"type": "json_object"}
    )
    text = completion.choices[0].message.content or ""
    try:
        obj = json.loads(text)
        return AIPlan(**obj)
    except (json.JSONDecodeError, ValidationError) as e:
        raise ValueError(f"LLM returned invalid JSON: {e}")

def llm_echo(prompt: str) -> str:
    """Tiny ping to verify the LLM connection (no DB)."""
    r = client.chat.completions.create(
        model=LLM_MODEL,
        temperature=0.0,
        messages=[{"role": "user", "content": f"Reply exactly with: {prompt}"}],
    )
    return r.choices[0].message.content or ""
