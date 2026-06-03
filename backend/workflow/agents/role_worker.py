import json
import os
from langchain_upstage import ChatUpstage
from workflow.state import WorkerState

_llm = None

def _get_llm():
    global _llm
    if _llm is None:
        _llm = ChatUpstage(model="solar-pro3-260323")
    return _llm

def _load_prompt() -> str:
    path = os.path.join(os.path.dirname(__file__), "../../prompts/role_worker.txt")
    with open(os.path.normpath(path), "r", encoding="utf-8") as f:
        return f.read()

def role_worker_node(state: WorkerState) -> dict:
    print(f"[3/5] role_worker 실행 중... (직군: {state['role']})")
    terms_list = "\n".join(
        f"- {t['term']} (문맥: {t['context_snippet']})"
        for t in state["ambiguous_terms"]
    )
    prompt = _load_prompt().format(
        role=state["role"],
        input_text=state["input_text"],
        sender_role=state["sender_role"],
        receiver_role=", ".join(state["receiver_roles"]),
        terms_list=terms_list,
    )
    response = _get_llm().invoke(prompt)
    result = json.loads(response.content)
    print(f"[3/5] role_worker 완료 (직군: {state['role']})")
    return {
        "role_interpretations": [result],
    }
