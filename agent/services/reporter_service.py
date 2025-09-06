# agent/services/reporter_service.py
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, List
from agent.db import query

FINISHED_STATUSES = ("done", "completed")

def _start_of_week_utc() -> str:
    # Monday as start (ISO). Store/compare in UTC string for MySQL.
    now = datetime.now(timezone.utc)
    start = now - timedelta(days=now.weekday())
    return start.replace(hour=0, minute=0, second=0, microsecond=0).strftime("%Y-%m-%d %H:%M:%S")

def project_snapshot(project_id: int) -> Dict[str, Any]:
    # 1) Totals by status
    status_rows = query(
        """
        SELECT t.status, COUNT(*) AS count
        FROM tasks t
        WHERE t.project_id = %s
        GROUP BY t.status
        """,
        (project_id,),
    )
    totals_by_status = {r["status"]: int(r["count"]) for r in status_rows}

    # 2) Overdue tasks: deadline < TODAY and not finished
    overdue = query(
        f"""
        SELECT t.id, t.title, t.assigned_to, t.deadline
        FROM tasks t
        WHERE t.project_id = %s
          AND t.deadline IS NOT NULL
          AND t.deadline < CURDATE()
          AND t.status NOT IN ({",".join(["%s"]*len(FINISHED_STATUSES))})
        ORDER BY t.deadline ASC
        """,
        (project_id, *FINISHED_STATUSES),
    )

    # 3) Throughput this week (created/completed since Monday UTC)
    start_week = _start_of_week_utc()

    created_this_week = query(
        """
        SELECT COUNT(*) AS c
        FROM tasks
        WHERE project_id = %s AND created_at >= %s
        """,
        (project_id, start_week),
    )[0]["c"]

    # If you reliably set updated_at when moving to finished, this is fine:
    completed_this_week = query(
        f"""
        SELECT COUNT(*) AS c
        FROM tasks
        WHERE project_id = %s
          AND status IN ({",".join(["%s"]*len(FINISHED_STATUSES))})
          AND updated_at >= %s
        """,
        (project_id, *FINISHED_STATUSES, start_week),
    )[0]["c"]

    # 4) Workload per employee (open tasks per assignee), but only project members
    workload = query(
        f"""
        SELECT u.id AS user_id, u.name, COUNT(t.id) AS open_tasks
        FROM project_members pm
        JOIN users u ON u.id = pm.user_id
        LEFT JOIN tasks t
          ON t.assigned_to = u.id
         AND t.project_id = pm.project_id
         AND t.status NOT IN ({",".join(["%s"]*len(FINISHED_STATUSES))})
        WHERE pm.project_id = %s
        GROUP BY u.id, u.name
        ORDER BY open_tasks DESC, u.name ASC
        """,
        (*FINISHED_STATUSES, project_id),
    )

    return {
        "project_id": project_id,
        "totals_by_status": totals_by_status,
        "overdue": overdue,
        "created_this_week": int(created_this_week),
        "completed_this_week": int(completed_this_week),
        "workload": workload,
        "generated_at_utc": datetime.now(timezone.utc).isoformat(),
    }
