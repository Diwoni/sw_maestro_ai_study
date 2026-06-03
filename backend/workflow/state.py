import operator
from typing import Annotated
from typing_extensions import TypedDict


class GraphState(TypedDict):
    # 입력
    input_text: str
    sender_role: str
    receiver_roles: list[str]   # 복수 수신자 지원
    communication_type: str

    # Phase 1: context_intake 결과
    context_analysis: dict
    # {
    #   "inputType": str,
    #   "senderRoleConfirmed": str,
    #   "receiverRoleConfirmed": str,
    #   "communicationPurposes": list[str],
    #   "contextSufficiency": "sufficient" | "partial" | "insufficient",
    #   "contextNotes": str,
    #   "summary": str,
    #   "keyRequest": str,
    # }
    summary: str
    key_request: str

    # Phase 1: term_extractor 결과
    ambiguous_terms: list[dict]
    # [{ "term": str, "context_snippet": str }, ...]

    # Phase 2: role_worker 병렬 누적
    role_interpretations: Annotated[list, operator.add]
    # [{ "role": str, "interpretations": [{ "term": str, "view": str }, ...] }, ...]

    # Phase 3: synthesis 결과
    terms_with_risk: list[dict]
    agreement_questions: list[str]
    checklist: list[str]

    # Phase 3: report 결과 (최종 응답 JSON)
    final_report: dict


class WorkerState(TypedDict):
    """fan_out_router → role_worker 로 Send할 때 사용하는 서브 상태"""
    role: str
    ambiguous_terms: list[dict]
    input_text: str
    sender_role: str
    receiver_roles: list[str]
