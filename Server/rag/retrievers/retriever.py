from langchain_chroma import Chroma
from langchain_core.documents import Document
from typing import List

def retrieve_context(vector_store: Chroma, query: str, k: int = 5) -> List[Document]:
    try:
        retrieved_docs: List[Document] = vector_store.similarity_search(query, k=k)

        if retrieved_docs:
            serialize = "\n\n".join(
            f"Source: {doc.metadata}\nContent: {doc.page_content[:500]}"
            for doc in retrieved_docs)
            
            return f"Contexts retrieved successfully:\n\n{serialize}"
        else:
            return f"No contexts found for query: {query}" 
    except (Exception) as e:
        return f"An error occurred during context retrieval: {str(e)}"