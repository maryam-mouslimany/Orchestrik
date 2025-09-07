# agent/main.py
from fastapi import FastAPI
from agent.db import ping_db, query, scalar
from agent.routers.llm import router as llm_router
from agent.routers.analytics import router as analytics_router

app = FastAPI(title="Task Management Agents")
app.include_router(llm_router)
app.include_router(analytics_router)

@app.get("/db/ping")
def test_db_ping():
    """
    Check if database connection works.
    """
    ok = ping_db()
    return {"db_ok": ok}


@app.get("/db/test-read")
def test_db_read():
    """
    Test reading from task_status_logs table.
    """
    rows = query("SELECT * FROM task_status_logs LIMIT 5")
    return {"rows": rows}


