import os, textwrap
from pathlib import Path
from dotenv import load_dotenv
import google.generativeai as genai

# Force lprint("OK:", genai.__version__)
print("OK:", genai.__version__)
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

key = os.getenv("LLM_API_KEY")
assert key and len(key) > 15, "LLM_API_KEY missing or looks invalid"
genai.configure(api_key=key)

# Optional Windows SSL hint
import certifi, ssl
ssl_context = ssl.create_default_context(cafile=certifi.where())

# Small request with explicit timeout and detailed errors
try:
    model = genai.GenerativeModel("gemini-1.5-flash")
    resp = model.generate_content("Say OK if you can hear me.",  request_options={"timeout": 30})
    print("REPLY:", resp.text[:200])
except Exception as e:
    import traceback
    print("FAILED:", repr(e))
    traceback.print_exc()
