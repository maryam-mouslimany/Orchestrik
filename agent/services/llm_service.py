# agent/services/llm_service.py
import os
import json
import re
import google.generativeai as genai

LLM_API_KEY = os.getenv("LLM_API_KEY")
LLM_MODEL = os.getenv("LLM_MODEL", "gemini-1.5-flash")

if not LLM_API_KEY:
    raise RuntimeError("LLM_API_KEY is missing in .env")

# Configure Gemini client
genai.configure(api_key=LLM_API_KEY)

def llm_echo(q: str) -> str:
    """
    Simple connectivity test:
    - Sends a tiny prompt to Gemini.
    - If we get back 'echo:<q>', the key & model are correct.
    """
    try:
        model = genai.GenerativeModel(LLM_MODEL)
        resp = model.generate_content(f"Return exactly 'echo:{q}' with no extra words.")
        # Gemini’s SDK response can vary; extract text safely:
        text = getattr(resp, "text", None)
        if text:
            return text.strip()
        elif resp.candidates:
            return resp.candidates[0].content.parts[0].text.strip()
        return f"echo:{q}"
    except Exception as e:
        raise RuntimeError(f"Gemini echo failed: {e}")
# --- ADD THIS FUNCTION ---
def llm_generate(prompt: str) -> str:
    """
    Generic text generation with Gemini using the configured model/key.
    """
    import google.generativeai as genai
    model = genai.GenerativeModel(os.getenv("LLM_MODEL", "gemini-1.5-flash"))
    resp = model.generate_content(prompt)
    text = getattr(resp, "text", None)
    if text:
        return text.strip()
    if resp.candidates:
        return resp.candidates[0].content.parts[0].text.strip()
    return ""
def llm_generate_json(prompt: str) -> dict:
    """
    Ask Gemini to return strict JSON (no markdown).
    Strips code fences if they appear and parses into a dict.
    """
    model_name = os.getenv("LLM_MODEL", "gemini-1.5-flash")
    api_key = os.getenv("LLM_API_KEY")
    if not api_key:
        raise RuntimeError("LLM_API_KEY is missing")

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel(
        model_name,
        generation_config={"response_mime_type": "application/json"},
    )
    resp = model.generate_content(prompt)

    text = getattr(resp, "text", None)
    if not text and resp.candidates:
        parts = resp.candidates[0].content.parts
        text = "".join(getattr(p, "text", "") for p in parts)

    if not text:
        return {}

    # safety: strip code fences if any
    text = re.sub(r"^\s*```(?:json)?\s*", "", text.strip())
    text = re.sub(r"\s*```\s*$", "", text)

    try:
        return json.loads(text)
    except Exception:
        return {"_raw_text": text}