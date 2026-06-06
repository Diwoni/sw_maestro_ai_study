import { delay, http, HttpResponse } from "msw";
import { findMockCase } from "../api/client";
import { testCases } from "../data/testCases";
import type { AnalysisHistoryItem, AnalyzeRequest } from "../types";

const mockHistory: AnalysisHistoryItem[] = testCases.slice(0, 5).map((testCase, index) => ({
  id: testCase.id,
  summary: testCase.response.summary,
  keyRequest: testCase.response.keyRequest,
  senderRole: testCase.request.senderRole || "직군 미상",
  createdAt: new Date(Date.now() - index * 60 * 60 * 1000).toISOString(),
}));

export const handlers = [
  http.post("*/api/analyze", async ({ request }) => {
    const body = (await request.json()) as Partial<AnalyzeRequest>;

    if (!body.text?.trim() || !body.communicationType?.trim()) {
      return HttpResponse.json(
        {
          message: "분석할 텍스트와 필수 소통 정보를 입력해주세요.",
        },
        { status: 400 },
      );
    }

    const mockCase = findMockCase({
      text: body.text,
      senderRole: body.senderRole ?? "",
      receiverRole: body.receiverRole ?? "",
      communicationType: body.communicationType,
    });

    await delay(650);

    return HttpResponse.json(mockCase.response);
  }),
  http.get("*/api/analyses", async () => {
    await delay(250);
    return HttpResponse.json(mockHistory);
  }),
  http.get("*/api/analyses/:id", async ({ params }) => {
    const mockCase = testCases.find((testCase) => testCase.id === params.id);

    await delay(250);

    if (!mockCase) {
      return HttpResponse.json({ detail: "존재하지 않는 분석 ID입니다." }, { status: 404 });
    }

    return HttpResponse.json(mockCase.response);
  }),
];
