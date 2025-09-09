# agent/services/reopen_service.py
from collections import defaultdict
from typing import Dict, Any, List, Optional
import os
from agent.db import query
from agent.services.llm_service import llm_generate_json

MAX_TASKS_PER_EMP = 6     
MAX_NOTES_PER_TASK = 3    

def fetch_reopened_events(days: int = 90) -> List[Dict[str, Any]]:
    """
    Fetch ONLY 'reopened' events in the last N days, with task, assignee, and note.
    """
    sql = """
    SELECT
        l.task_id,
        l.note,
        l.created_at,
        t.title AS task_title,
        t.assigned_to AS assignee_id,
        u.name  AS assignee_name
    FROM task_status_logs l
    JOIN tasks t      ON t.id = l.task_id
    LEFT JOIN users u ON u.id = t.assigned_to
    WHERE l.to_status = 'reopened'
      AND l.created_at >= NOW() - INTERVAL %s DAY
    ORDER BY l.task_id, l.created_at
    """
    return query(sql, (days,))

def _summarize_for_prompt(events: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Build a compact, neutral snapshot:
      employees -> [{id, name, tasks:[{task_id, title, notes:[]}] }]
    Notes are raw (no classification here).
    """
    per_emp: Dict[Any, Dict[str, Any]] = defaultdict(lambda: {
        "employee_id": None,
        "employee_name": None,
        "tasks": defaultdict(lambda: {"task_title": None, "notes": []})
    })

    for e in events:
        emp_id = e["assignee_id"]
        emp = per_emp[emp_id]
        emp["employee_id"] = emp_id
        emp["employee_name"] = e["assignee_name"]
        t = emp["tasks"][e["task_id"]]
        t["task_title"] = e["task_title"]
        note = (e["note"] or "").strip()
        if note and len(t["notes"]) < MAX_NOTES_PER_TASK:
            t["notes"].append(" ".join(note.split())) 

    out = []
    for emp_id, info in per_emp.items():
        tasks = []
        for tid, tinfo in info["tasks"].items():
            tasks.append({
                "task_id": tid,
                "title": tinfo["task_title"],
                "notes": tinfo["notes"]
            })
        # keep only tasks that actually have notes
        tasks = [x for x in tasks if x["notes"]]
        # cap tasks per employee
        tasks = sorted(tasks, key=lambda x: -len(x["notes"]))[:MAX_TASKS_PER_EMP]
        out.append({
            "employee_id": emp_id,
            "employee_name": info["employee_name"],
            "tasks": tasks
        })
    # remove null/None employees (in case of missing assignee)
    out = [e for e in out if e["employee_id"] is not None]
    return {"employees": out}

def _build_prompt(snapshot: Dict[str, Any], days: int) -> str:
    """
    Ask Gemini to classify each note and produce analytics. We explicitly tell it:
    - Do NOT blame employees for client-request notes.
    - Return STRICT JSON with the schema we expect.
    """
    return f"""
You are an analytics agent. You will receive data about tasks that were reopened in the last {days} days.

INPUT FORMAT (JSON):
{snapshot}

TASKS:
1) For every NOTE in the input, classify it into one of:
   - "client_request" (client asked for changes; not employee's fault),
   - "employee_issue" (missing/incomplete/incorrect work, guideline/brand/spec/perf/test issues),
   - "neutral" (cannot determine or unrelated).
2) Using ONLY the classified notes:
   - Compute, per employee:
       * total_reopens (all notes count),
       * blameworthy_reopens (only employee_issue),
       * client_reopens (only client_request).
     Rank employees by blameworthy_reopens (desc).
   - Extract top internal reasons (themes) from notes labeled employee_issue.
     Provide them as concise strings with counts.
   - Recommend 3-5 concrete, actionable process improvements that would reduce employee_issue causes.
3) DO NOT penalize client_request in blameworthy counts.

OUTPUT:
Return STRICT JSON with this exact schema (no markdown, no comments, no extra keys):
{{
  "employees_ranked": [
    {{
      "employee_id": "number",
      "employee_name": "string",
      "total_reopens": "number",
      "blameworthy_reopens": "number",
      "client_reopens": "number",
      "example_tasks": [{{ "task_id": "number", "title": "string" }}]
    }}
  ],
  "internal_reasons_ranked": [
    {{ "reason": "string", "count": "number", "example_note": "string" }}
  ],
  "actions": ["string", "string", "string"]
}}

REQUIREMENTS:
- Output MUST be valid JSON only.
- Use short, clear strings.
- If data is insufficient, return empty arrays but keep the schema.
"""

def analyze_reopenings(days: int = 90) -> Dict[str, Any]:
    """
    LLM-only pipeline:
    - fetch events,
    - build compact snapshot,
    - ask Gemini to classify + aggregate,
    - return the LLM JSON along with a small numeric summary we can compute locally.
    """
    events = fetch_reopened_events(days=days)
    snapshot = _summarize_for_prompt(events)
    prompt = _build_prompt(snapshot, days)

    llm_json = llm_generate_json(prompt)
    if not isinstance(llm_json, dict):
        llm_json = {"_raw_text": llm_json}

    # Local tiny KPIs (independent from LLM, for cross-check)
    total_employees = len(snapshot["employees"])
    total_tasks = sum(len(e["tasks"]) for e in snapshot["employees"])
    total_reopens = sum(len(t["notes"]) for e in snapshot["employees"] for t in e["tasks"])

    return {
        "window_days": days,
        "snapshot_counts": {
            "employees": total_employees,
            "tasks": total_tasks,
            "reopen_notes": total_reopens
        },
        "llm_insights": llm_json
    }
