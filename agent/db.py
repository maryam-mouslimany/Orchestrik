# agent/db.py
import os
from pathlib import Path
from typing import Optional, List, Dict, Any, Tuple
from mysql.connector.pooling import MySQLConnectionPool
from dotenv import load_dotenv

# 1) Load .env that is in the SAME FOLDER as this file
ENV_PATH = Path(__file__).with_name(".env")
load_dotenv(ENV_PATH, override=True)
print(f"[db] loaded .env from: {ENV_PATH}")

# 2) Read ONLY your keys
DB_HOST = os.getenv("DB_HOST") or "127.0.0.1"
if DB_HOST in (".", "localhost", ""):
    DB_HOST = "127.0.0.1"   # force TCP on Windows

DB_PORT = int(os.getenv("DB_PORT") or "3306")
DB_NAME = os.getenv("DB_NAME")              # REQUIRED
DB_USER = os.getenv("DB_USER")              # REQUIRED
DB_PASS = os.getenv("DB_PASS") or ""        # empty allowed

print(f"[db] host={DB_HOST} port={DB_PORT} db={DB_NAME} user={DB_USER} password_set={bool(DB_PASS)}")

_pool: Optional[MySQLConnectionPool] = None

def _pool_once() -> MySQLConnectionPool:
    """Create the global pool once; reuse afterward."""
    global _pool
    if _pool is None:
        if not DB_NAME or not DB_USER:
            raise RuntimeError("Missing DB_NAME or DB_USER in agent/.env")
        _pool = MySQLConnectionPool(
            pool_name="tm_pool",
            pool_size=5,
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASS,
            database=DB_NAME,
            connection_timeout=5,   # fail fast instead of hanging
            pool_reset_session=True,
            autocommit=True,        # safe for reads & avoids lingering txns
        )
    return _pool

def query(sql: str, params: Tuple[Any, ...] = ()) -> List[Dict[str, Any]]:
    """Run a SELECT and return a list of dict rows."""
    conn = _pool_once().get_connection()
    try:
        cur = conn.cursor(dictionary=True)
        cur.execute(sql, params)
        return cur.fetchall()
    finally:
        try:
            cur.close()
        except Exception:
            pass
        conn.close()

def query_one(sql: str, params: Tuple[Any, ...] = ()) -> Optional[Dict[str, Any]]:
    """Run a SELECT and return the first row or None."""
    rows = query(sql, params)
    return rows[0] if rows else None

def scalar(sql: str, params: Tuple[Any, ...] = ()) -> Optional[Any]:
    """Run a SELECT and return the first column of the first row (or None)."""
    row = query_one(sql, params)
    if not row:
        return None
    # return the first value in the dict
    return next(iter(row.values()))

def ping_db() -> bool:
    """Cheap liveness check for the connection/pool."""
    conn = _pool_once().get_connection()
    try:
        conn.ping(reconnect=False, attempts=1, delay=0)
        return True
    except Exception as e:
        print(f"[db] ping failed: {e}")
        return False
    finally:
        conn.close()
