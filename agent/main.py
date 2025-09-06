# agent/main.py
from fastapi import FastAPI, HTTPException
from agent.routers.reporter import router as reporter_router
from agent.db import query

app = FastAPI(title="Task Management Agents")

app.include_router(reporter_router)

@app.get("/health/db")
def health_db():
    try:
        _ = query("SELECT 1 AS ok")
        return {"ok": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
