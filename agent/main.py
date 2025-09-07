# agent/main.py
from fastapi import FastAPI, HTTPException
from agent.routers.reporter import router as reporter_router
from agent.db import query
from agent.routers.llm import router as llm_router
from fastapi import FastAPI
import sys, os, importlib.util, site

app = FastAPI(title="Task Management Agents")

@app.get("/debug/env")
def debug_env():
    spec_google = importlib.util.find_spec("google")
    spec_gai = importlib.util.find_spec("google.generativeai")
    return {
        "python": sys.executable,
        "cwd": os.getcwd(),
        "spec_google": None if spec_google is None else str(spec_google.origin),
        "spec_google_generativeai": None if spec_gai is None else str(spec_gai.origin),
        "sitepackages": [p for p in (site.getsitepackages() if hasattr(site, "getsitepackages") else [])],
        "sys_path_first10": sys.path[:10],
    }
@app.get("/debug/import")
def debug_import():
    try:
        import google.generativeai as genai
        return {"ok": True, "version": getattr(genai, "__version__", "unknown")}
    except Exception as e:
        return {"ok": False, "error": str(e)}

app.include_router(reporter_router)
app.include_router(llm_router)

@app.get("/")
def root():
    return {"ok": True, "msg": "agent running"}
@app.get("/health/db")
def health_db():
    try:
        _ = query("SELECT 1 AS ok")
        return {"ok": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
