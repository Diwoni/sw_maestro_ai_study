from langgraph.graph import StateGraph, END
from langgraph.types import Send
from workflow.state import GraphState, WorkerState
from workflow.agents.context_intake import context_intake_node
from workflow.agents.term_extractor import term_extractor_node
from workflow.agents.role_worker import role_worker_node
from workflow.agents.synthesis import synthesis_node
from workflow.agents.report import report_node


def check_context_sufficiency(state: GraphState) -> str:
    """insufficient이면 조기 종료, 그 외에는 term_extractor로 진행"""
    sufficiency = state.get("context_analysis", {}).get("contextSufficiency", "sufficient")
    if sufficiency == "insufficient":
        return "insufficient"
    return "sufficient"


def raise_insufficient_context(state: GraphState) -> dict:
    """문맥 부족 시 호출되는 노드 — contextNotes를 포함한 에러를 발생시킴"""
    notes = state.get("context_analysis", {}).get("contextNotes", "")
    message = "분석할 텍스트의 문맥 정보가 부족합니다."
    if notes:
        message += f" {notes}"
    raise ValueError(message)


def route_after_term_extractor(state: GraphState):
    """
    ambiguous_terms가 없으면 report로 바로 이동.
    있으면 역할별 워커를 Send로 동적 생성해서 병렬 실행.
    """
    if not state.get("ambiguous_terms"):
        return "report"

    # sender + 모든 receiver를 합쳐 중복 제거 후 각각 워커 생성
    roles = list({state["sender_role"]} | set(state["receiver_roles"]))
    return [
        Send(
            "role_worker",
            WorkerState(
                role=role,
                ambiguous_terms=state["ambiguous_terms"],
                input_text=state["input_text"],
                sender_role=state["sender_role"],
                receiver_roles=state["receiver_roles"],
            ),
        )
        for role in roles
    ]


def build_graph():
    graph = StateGraph(GraphState)

    graph.add_node("context_intake", context_intake_node)
    graph.add_node("insufficient_context", raise_insufficient_context)
    graph.add_node("term_extractor", term_extractor_node)
    graph.add_node("role_worker", role_worker_node)
    graph.add_node("synthesis", synthesis_node)
    graph.add_node("report", report_node)

    graph.set_entry_point("context_intake")

    graph.add_conditional_edges(
        "context_intake",
        check_context_sufficiency,
        {
            "insufficient": "insufficient_context",
            "sufficient": "term_extractor",
        },
    )

    graph.add_conditional_edges(
        "term_extractor",
        route_after_term_extractor,
    )

    graph.add_edge("role_worker", "synthesis")
    graph.add_edge("synthesis", "report")
    graph.add_edge("report", END)

    return graph.compile()


workflow = build_graph()
