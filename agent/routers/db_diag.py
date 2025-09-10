from fastapi import APIRouter, HTTPException, Query
from agent.db import ping_db, query as db_query

router = APIRouter(prefix="/agents/db", tags=["DBDiag"])

@router.get("/ping")
def ping():
    try:
        ok = ping_db()
        return {"ok": ok}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/test-select")
def test_select():
    """
    Safe, fixed query to verify SELECT and dictionary rows.
    """
    try:
        rows = db_query("SELECT 1 AS one, NOW() AS ts")
        return {"ok": True, "rows": rows}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/count")
def count(table: str = Query(..., pattern="^[a-zA-Z0-9_]+$")):
    """
    Simple row count for a given table name. Restricted to [a-zA-Z0-9_].
    """
    try:
        rows = db_query(f"SELECT COUNT(*) AS c FROM `{table}`")
        return {"ok": True, "table": table, "count": rows[0]["c"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
