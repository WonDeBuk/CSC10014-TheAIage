from pathlib import Path
from typing import List
from langchain_community.document_loaders import PyPDFLoader
from langchain_core.documents import Document

def load_pdf_documents(file_path: Path) -> List[Document]:
    if (not file_path.exists()) or (file_path.suffix.lower() != ".pdf"):
        raise ValueError(f"The file {file_path} does not exist or is not a PDF.")
    
    loader = PyPDFLoader(str(file_path))
    documents = loader.load()
    return documents