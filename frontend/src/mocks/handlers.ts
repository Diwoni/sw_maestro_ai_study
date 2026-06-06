import { delay, http, HttpResponse } from "msw";
import { findMockCase } from "../api/client";
import type { AnalyzeRequest } from "../types";

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
];
