from datetime import datetime
from pydantic import Field
from langgraph.types import Command
from langchain.agents import AgentState
from langchain.tools import tool, ToolRuntime
from langchain_core.messages import ToolMessage
from database import DiagnosisModel
from pydantic import PrivateAttr
import chainlit as cl

MENTAL_DISORDER = [
    "Anxiety",
    "Bipolar",
    "Depressive",
    "Dissociative",
    "Eating",
    "Elimination",
    "Gender Dysphoria",
    "Impulse-Control",
    "Neurocognitive",
    "Neurodevelopmental",
    "Obsessive-Compulsive",
    "Paraphilic",
    "Personality",
    "Psychotic",
    "Sexual",
    "Sleep-Wake",
    "Somatic",
    "Substance-Addictive",
    "Trauma-Stressor",
]

class PsychologyAgentState(AgentState):
    """
    State schema for the psychology chatbot agent.
    Extends AgentState with domain-specific fields.
    """
    user_id: str = ""
    score: str = ""
    content: str = ""
    total_guess: str = ""
    tags: list[str] = []

def create_retrieve_context_tool(vector_store):
    """Create the retrieve_context tool with vector store binding."""
    @tool
    def retrieve_context(query: str) -> str:
        """
        Search DSM-5 psychology database for information matching the query.
        Use this to find relevant diagnostic criteria, symptoms, or treatments.
        """
        try:
            retrieved_docs = vector_store.similarity_search(query, k=2)
            if retrieved_docs:
                serialize = "\n\n".join(
                f"Source: {doc.metadata}\nContent: {doc.page_content[:500]}"
                for doc in retrieved_docs)
                return f"Contexts retrieved successfully:\n\n{serialize}"
            else:
                return f"No contexts found for query: {query}"
        except Exception as e:
            return f"An error occurred during context retrieval: {str(e)}"
    return retrieve_context

@tool
def update_diagnosis(
    score: int = Field(description="Score of the user's mental health (e.g., anxiety level 1-10)."),
    content: str = Field(description="Summary/content of the user's mental health state."),
    total_guess: str = Field(description="Total assessment/diagnosis of the user's mental health."),
    tags: list[str] = Field(description=(
        "List of mental disorder category tags. "
        "Must be chosen from the following list:\n"
        f"{','.join(MENTAL_DISORDER)}"
    )),
    _runtime: ToolRuntime = PrivateAttr()
) -> Command:
    """
    Update the agent's internal analysis of the user's mental health state.
    Use this when you have gathered enough information to form an assessment.
    """

    thread_id = None
    user_id = None
    if _runtime and isinstance(_runtime.config, dict):
        thread_id = _runtime.config.get("configurable", {}).get("thread_id")
        user_id = _runtime.config.get("configurable", {}).get("user_id")

    valid_tags = [t for t in tags if t in MENTAL_DISORDER]
    if not valid_tags:
        valid_tags = []

    DiagnosisModel(
        user_id=user_id,
        in_conversation_id=thread_id,
        score=score,
        content=content,
        total_guess=total_guess,
        tags=valid_tags
    ).save()

    return Command(
        update={
            "score": score,
            "content": content,
            "total_guess": total_guess,
            "tags": valid_tags,
            "messages": [
                ToolMessage(
                    content=f"Diagnosis updated. Score={score}, Analysis={content}",
                    tool_call_id=_runtime.tool_call_id if _runtime else None
                )
            ]
        }
    )
