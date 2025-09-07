import importlib.util, sys
print("EXE:", sys.executable)
print("FIND_SPEC google.generativeai:", importlib.util.find_spec("google.generativeai"))
import google.generativeai as genai
print("IMPORTED google.generativeai OK, version:", getattr(genai, "__version__", "unknown"))
