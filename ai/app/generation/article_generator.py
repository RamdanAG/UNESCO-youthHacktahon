# Generates an in-game "news article" (some real, some hoax) for players to
# evaluate together.

def generate(topic: str) -> dict:
    # TODO: use Retriever + ollama_client.generate() with a grounded prompt
    return {"title": "Coming Soon", "body": "Coming Soon", "is_hoax": False}
