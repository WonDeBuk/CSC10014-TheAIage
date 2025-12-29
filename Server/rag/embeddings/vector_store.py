from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from pathlib import Path
from typing import Optional

def initialize_embeddings(model: str = "sentence-transformers/all-MiniLM-L6-v2") -> HuggingFaceEmbeddings:
    embeddings = HuggingFaceEmbeddings(model_name=model)
    return embeddings

def initialize_vector_store(embeddings: HuggingFaceEmbeddings, collection_name: str = "psy_base",persist_directory: Optional[Path] = None) -> Chroma:
    if persist_directory:
        persist_directory = str(persist_directory).resolve()
    else:
        persist_directory = "./data/embeddings/chroma_db"

    vector_store = Chroma(
        persist_directory=persist_directory,
        embedding_function=embeddings,
        collection_name=collection_name
    )

    return vector_store