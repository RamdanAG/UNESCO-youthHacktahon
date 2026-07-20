# Wraps the vector database client (e.g. Chroma) used for RAG retrieval.

class VectorStore:
    def add(self, doc_id: str, text: str, embedding: list) -> None:
        # TODO: implement
        raise NotImplementedError

    def query(self, embedding: list, top_k: int = 5) -> list:
        # TODO: implement
        raise NotImplementedError
