from rag.loaders.pdf_loader import load_pdf_documents
from rag.embeddings.vector_store import initialize_embeddings, initialize_vector_store
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_text_splitters import RecursiveCharacterTextSplitter
from typing import Optional
from pathlib import Path   

class RAGPipeline():
    def __init__(self):
        self.embeddings = None
        self.vector_store = None
        self.chat_model = None
    
    def setup_embeddings(self) -> None:
        self.embeddings = initialize_embeddings()
    
    def setup_vector_store(self, persist_directory: Optional[Path] = None) -> None:
        if not self.embeddings:
            self.setup_embeddings()

        if not persist_directory:
            persist_directory = Path("./data/embeddings/chroma_db")

        self.vector_store = initialize_vector_store(
            embeddings=self.embeddings,
            collection_name="psy_base",
            persist_directory=persist_directory
        )

    def setup_chat_model(self) -> None:
        self.chat_model = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash-lite"
        )

    def load_and_index_document(self, file_path: Path | str) -> None:
        if not self.vector_store:
            self.setup_vector_store()
        
        docs = load_pdf_documents(Path(file_path))
        self.vector_store.add_documents(docs)

    def setup_all(self) -> None:
        self.setup_embeddings()
        self.setup_vector_store()
        self.setup_chat_model()