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
    path = os.path.join(os.path.dirname(__file__), "../../prompts/synthesis.txt")
    with open(os.path.normpath(path), "r", encoding="utf-8") as f:
        return f.read()

def synthesis_node(state: GraphState) -> dict:
    print("[4/5] synthesis 실행 중...")
    role_interpretations_str = json.dumps(
        state["role_interpretations"], ensure_ascii=False, indent=2
    )
    ambiguous_terms_str = json.dumps(
        state["ambiguous_terms"], ensure_ascii=False, indent=2
    )
    prompt = _load_prompt().format(
        input_text=state["input_text"],
        sender_role=state["sender_role"],
        receiver_role=", ".join(state["receiver_roles"]),
        role_interpretations=role_interpretations_str,
        ambiguous_terms=ambiguous_terms_str,
    )
    response = _get_llm().invoke(prompt)
    result = json.loads(response.content)
    print("[4/5] synthesis 완료")
    return {
        "terms_with_risk": result.get("terms", []),
        "agreement_questions": result.get("agreementQuestions", []),
        "checklist": result.get("checklist", []),
    }
