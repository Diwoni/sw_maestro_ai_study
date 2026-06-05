export type RouteType =
  | "consensus_report"
  | "need_more_context"
  | "definition_enrichment";

export type AnalyzeRequest = {
  text: string;
  senderRole: string;
  receiverRole: string;
  communicationType: string;
};

export type TermAnalysis = {
  term: string;
  context: string;
  currentMeaning: string;
  plannerView: string;
  developerView: string;
  designerView: string;
  pmView: string;
  riskLevel: "낮음" | "보통" | "높음" | string;
  riskReason: string;
  confirmationQuestion: string;
};

export type AnalyzeResponse = {
  summary: string;
  keyRequest: string;
  terms: TermAnalysis[];
  agreementQuestions: string[];
  checklist: string[];
  route?: RouteType;
  message?: string;
};

export type TestCase = {
  id: string;
  scenarioName: string;
  primaryUser: string;
  route: RouteType;
  request: AnalyzeRequest;
  response: AnalyzeResponse;
};

export type AnalyzeState = "idle" | "loading" | "success" | "error";
