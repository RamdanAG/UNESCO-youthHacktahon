import httpx

OLLAMA_HOST = "http://localhost:11434"


def generate(prompt: str, model: str = "llama3") -> str:
    # TODO: call Ollama /api/generate, handle streaming if needed
    raise NotImplementedError("Ollama client not implemented yet")
