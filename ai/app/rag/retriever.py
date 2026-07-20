from app.rag.vector_store import VectorStore

# Retrieves relevant context chunks for a given query before generation.

class Retriever:
    def __init__(self):
        self.store = VectorStore()

    def retrieve(self, query: str, top_k: int = 5) -> list:
        # TODO: embed query and call self.store.query()
        raise NotImplementedError
