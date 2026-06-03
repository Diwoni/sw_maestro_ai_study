import json
import os
from langchain_upstage import ChatUpstage
from workflow.state import GraphState

_llm = None

def _get_llm():
    global _llm
    if _llm is None:
        _llm = ChatUpstage(model="solar-pro3-260323")
    return _llm

def _load_prompt() -> str:
    path = os.path.join(os.path.dirname(__file__), "../../prompts/term_extractor.txt")
    with open(os.path.normpath(path), "r", encoding="utf-8") as f:
        return f.read()

def term_extractor_node(state: GraphState) -> dict:
    print("[2/5] term_extractor 실행 중...")
    context = state.get("context_analysis", {})
    prompt = _load_prompt().format(
        sender_role=state["sender_role"],
        receiver_role=", ".join(state["receiver_roles"]),
        communication_type=state["communication_type"],
        input_text=state["input_text"],
        input_type=context.get("inputType", state["communication_type"]),
        communication_purposes=", ".join(context.get("communicationPurposes", [])),
    )
    response = _get_llm().invoke(prompt)
    result = json.loads(response.content)
    print("[2/5] term_extractor 완료")
    return {
        "ambiguous_terms": result.get("terms", []),
    }
