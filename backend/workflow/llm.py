from langchain_upstage import ChatUpstage

_llm = None


def get_llm() -> ChatUpstage:
    global _llm
    if _llm is None:
        _llm = ChatUpstage(model="solar-pro3-260323")
    return _llm
