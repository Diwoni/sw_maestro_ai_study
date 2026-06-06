import { testCases } from "../data/testCases";
import type {
  AnalysisHistoryItem,
  AnalyzeRequest,
  AnalyzeResponse,
  TestCase,
} from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "";

export function findMockCase(request: AnalyzeRequest): TestCase {
  const normalized = request.text.trim();

  if (!request.senderRole || !request.receiverRole) {
    return testCases.find((item) => item.route === "need_more_context") ?? testCases[0];
  }

  return (
    testCases.find((item) => normalized && item.request.text.includes(normalized.slice(0, 18))) ??
    testCases.find((item) => item.request.communicationType === request.communicationType) ??
    testCases[0]
  );
}

export async function analyzeText(request: AnalyzeRequest): Promise<AnalyzeResponse> {
  const mock = findMockCase(request);

  try {
    const response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    const body = (await response.json()) as AnalyzeResponse;

    if (!response.ok) {
      throw new Error(body.message ?? "분석 요청에 실패했습니다.");
    }

    return {
      ...body,
      route: body.route ?? mock.route,
    };
  } catch (error) {
    console.warn("Falling back to mock analysis:", error);
    return mock.response;
  }
}

export async function getAnalyses(): Promise<AnalysisHistoryItem[]> {
  const response = await fetch(`${API_BASE_URL}/api/analyses`);
  const body = (await response.json()) as AnalysisHistoryItem[] | { detail?: string; message?: string };

  if (!response.ok) {
    throw new Error(getErrorMessage(body, "분석 이력을 불러오지 못했습니다."));
  }

  return body as AnalysisHistoryItem[];
}

export async function getAnalysis(id: string): Promise<AnalyzeResponse> {
  const response = await fetch(`${API_BASE_URL}/api/analyses/${encodeURIComponent(id)}`);
  const body = (await response.json()) as AnalyzeResponse | { detail?: string; message?: string };

  if (!response.ok) {
    throw new Error(getErrorMessage(body, "분석 상세를 불러오지 못했습니다."));
  }

  return body as AnalyzeResponse;
}

function getErrorMessage(body: unknown, fallback: string) {
  if (typeof body === "object" && body !== null) {
    if ("detail" in body && typeof body.detail === "string") {
      return body.detail;
    }

    if ("message" in body && typeof body.message === "string") {
      return body.message;
    }
  }

  return fallback;
}
