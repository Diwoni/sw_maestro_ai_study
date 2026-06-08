import clsx from "clsx";
import { Check, CircleDashed } from "lucide-react";
import type { AnalyzeState, RouteType, WorkflowStep } from "../types";
import { routeDescription, routeLabel } from "../utils";

const steps: Array<{
  id: WorkflowStep;
  label: string;
  description: string;
}> = [
  {
    id: "context_intake",
    label: "문맥 분석",
    description: "소통 상황과 문맥 충분성을 판단합니다.",
  },
  {
    id: "word_extractor",
    label: "핵심 단어 추출",
    description: "모호할 수 있는 핵심 용어를 찾습니다.",
  },
  {
    id: "role_worker",
    label: "직군별 의미 해석",
    description: "참여 직군 관점의 의미를 병렬 분석합니다.",
  },
  {
    id: "risk_term",
    label: "위험 용어 선별",
    description: "오해 가능성이 높은 용어를 선별합니다.",
  },
  {
    id: "synthesis",
    label: "위험도 종합 분석",
    description: "해석 차이와 위험도를 종합합니다.",
  },
  {
    id: "report",
    label: "최종 보고서 생성",
    description: "합의 질문과 체크리스트를 생성합니다.",
  },
];

export function WorkflowStatus({
  state,
  route,
  completedSteps,
  progressLabel,
}: {
  state: AnalyzeState;
  route?: RouteType;
  completedSteps: WorkflowStep[];
  progressLabel: string;
}) {
  const activeIndex =
    state === "loading"
      ? steps.findIndex((step) => !completedSteps.includes(step.id))
      : state === "success"
        ? steps.length
        : 0;
  const completedCount = state === "success" ? steps.length : completedSteps.length;
  const progress = Math.round((completedCount / steps.length) * 100);

  return (
    <section className="overflow-hidden bg-ink text-white shadow-workflow">
      <div className="border-b border-white/10 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-white/45">
              Live process
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em]">분석 진행 상태</h2>
          </div>
          <span className="font-mono text-2xl font-medium tabular-nums text-[#7da2ff]">
            {progress.toString().padStart(2, "0")}%
          </span>
        </div>
        <div className="mt-5 h-px overflow-hidden bg-white/10">
          <div
            className="h-full bg-action transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-4 flex items-start justify-between gap-4">
          <p className="text-xs font-medium leading-5 text-white/55">
            {state === "loading" && progressLabel ? progressLabel : routeDescription(route)}
          </p>
          <span
            className={clsx(
              "shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em]",
              state === "loading"
                ? "bg-action text-white"
                : state === "success"
                  ? "bg-success text-white"
                  : "border border-white/15 text-white/60",
            )}
          >
            {state === "loading" ? "Running" : routeLabel(route)}
          </span>
        </div>
      </div>

      <div className="px-5 py-2 sm:px-6">
        {steps.map((step, index) => {
          const isDone = state === "success" || completedSteps.includes(step.id);
          const isActive = state === "loading" && index === activeIndex;

          return (
            <div
              key={step.id}
              className={clsx(
                "group grid grid-cols-[1.75rem_1fr_auto] items-center gap-3 border-b border-white/10 py-4 last:border-b-0 transition-all duration-300",
                isActive && "-mx-3 bg-action/15 px-3",
                !isDone && !isActive && "opacity-45",
              )}
            >
              <span
                className={clsx(
                  "grid h-7 w-7 place-items-center border text-[10px] font-semibold",
                  isDone && "border-success bg-success text-white",
                  isActive &&
                    !isDone &&
                    "border-action bg-action text-white shadow-[0_0_0_4px_rgba(49,87,213,0.18)]",
                  !isDone && !isActive && "border-white/20 text-white",
                )}
              >
                {isDone ? (
                  <Check className="h-3.5 w-3.5" strokeWidth={2.2} />
                ) : isActive ? (
                  <CircleDashed className="h-3.5 w-3.5 animate-spin" strokeWidth={1.8} />
                ) : (
                  String(index + 1).padStart(2, "0")
                )}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">{step.label}</p>
                <p className="mt-0.5 truncate text-[11px] font-medium text-white/45">
                  {step.description}
                </p>
              </div>
              <span
                className={clsx(
                  "font-mono text-[9px] font-semibold uppercase tracking-[0.1em]",
                  isDone && "text-[#72d49b]",
                  isActive && "text-[#9bb5ff]",
                  !isDone && !isActive && "text-white/45",
                )}
              >
                {isDone ? "Done" : isActive ? "Now" : "Wait"}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
