from workflow.state import GraphState

ROLE_FIELD_MAP = {
    "기획자": "plannerView",
    "개발자": "developerView",
    "디자이너": "designerView",
    "PM": "pmView",
}

def report_node(state: GraphState) -> dict:
    print("[5/5] report 실행 중...")
    role_view_lookup: dict[str, dict[str, str]] = {}
    for worker_result in state["role_interpretations"]:
        role = worker_result["role"]
        for item in worker_result["interpretations"]:
            role_view_lookup.setdefault(item["term"], {})[role] = item["view"]

    # term_extractor가 추출한 context_snippet을 term 이름으로 조회할 수 있도록 매핑
    context_snippet_lookup: dict[str, str] = {
        t["term"]: t.get("context_snippet", "")
        for t in state.get("ambiguous_terms", [])
    }

    terms = []
    for t in state["terms_with_risk"]:
        term_name = t["term"]
        views_by_role = role_view_lookup.get(term_name, {})

        terms.append({
            "term": term_name,
            "context": context_snippet_lookup.get(term_name, ""),
            "currentMeaning": t["currentMeaning"],
            "plannerView": views_by_role.get("기획자"),
            "developerView": views_by_role.get("개발자"),
            "designerView": views_by_role.get("디자이너"),
            "pmView": views_by_role.get("PM"),
            "riskLevel": t["riskLevel"],
            "riskReason": t["riskReason"],
            "confirmationQuestion": t["confirmationQuestion"],
        })

    final_report = {
        "summary": state["summary"],
        "keyRequest": state["key_request"],
        "terms": terms,
        "agreementQuestions": state["agreement_questions"],
        "checklist": state["checklist"],
    }
    print("[5/5] report 완료")
    return {"final_report": final_report}
