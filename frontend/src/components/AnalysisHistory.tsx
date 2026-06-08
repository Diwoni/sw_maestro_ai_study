import clsx from "clsx";
import { ArrowUpRight, Clock3, History, Loader2, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { getAnalysis, getAnalyses } from "../api/client";
import type { AnalysisHistoryItem, AnalyzeResponse } from "../types";

type AnalysisHistoryProps = {
  refreshKey: number;
  onSelect: (report: AnalyzeResponse) => void;
  onError: (message: string) => void;
};

export function AnalysisHistory({ refreshKey, onSelect, onError }: AnalysisHistoryProps) {
  const [items, setItems] = useState<AnalysisHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      setItems(await getAnalyses());
    } catch (error) {
      onError(error instanceof Error ? error.message : "분석 이력을 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [onError]);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory, refreshKey]);

  const handleSelect = async (id: string) => {
    setLoadingId(id);
    try {
      onSelect(await getAnalysis(id));
    } catch (error) {
      onError(error instanceof Error ? error.message : "분석 상세를 불러오지 못했습니다.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <section className="surface-panel p-5 sm:p-7 lg:p-9">
      <div className="flex flex-wrap items-end justify-between gap-5 border-b border-line pb-7">
        <div>
          <p className="editorial-kicker">Recent archive</p>
          <h2 className="mt-3 flex items-center gap-3 text-2xl font-semibold tracking-[-0.035em] text-ink sm:text-3xl">
            <History className="h-5 w-5 text-action" strokeWidth={1.8} />
            최근 분석 기록
          </h2>
          <p className="mt-2 text-sm font-medium leading-6 text-muted">
            기록을 선택하면 아래에서 전체 보고서를 다시 확인할 수 있습니다.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void loadHistory()}
          disabled={isLoading}
          className="group inline-flex items-center gap-2 rounded-md border border-action/25 bg-action-soft px-3.5 py-2.5 text-xs font-semibold text-action transition-all duration-300 hover:border-action hover:bg-white active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          title="분석 이력 새로고침"
        >
          <RefreshCw
            className={`h-4 w-4 transition-transform duration-500 group-hover:rotate-180 ${
              isLoading ? "animate-spin" : ""
            }`}
            strokeWidth={1.8}
          />
          새로고침
        </button>
      </div>

      {isLoading ? (
        <div className="mt-7 flex min-h-40 items-center justify-center gap-3 border border-line bg-[#f3f0e9] text-sm font-semibold text-muted">
          <Loader2 className="h-4 w-4 animate-spin text-action" />
          분석 기록을 불러오는 중입니다.
        </div>
      ) : items.length === 0 ? (
        <div className="mt-7 flex min-h-40 items-center justify-center border border-dashed border-line text-sm font-semibold text-muted">
          아직 완료된 분석 기록이 없습니다.
        </div>
      ) : (
        <div className="mt-7 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item, index) => {
            const isFeatured = index === 0;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => void handleSelect(item.id)}
                disabled={loadingId !== null}
                className={clsx(
                  "group relative min-h-60 min-w-0 overflow-hidden border p-5 text-left transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-card active:translate-y-0 active:scale-[0.99] disabled:cursor-wait disabled:opacity-60 sm:p-6",
                  isFeatured
                    ? "border-action bg-[#263b78] text-white shadow-[0_16px_36px_rgba(49,87,213,0.18)] md:col-span-2"
                    : "border-line bg-[#fffefa] text-ink hover:border-action/60 hover:bg-action-soft/40",
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <span
                    className={clsx(
                      "font-mono text-xs",
                      isFeatured ? "text-[#9bb5ff]" : "text-action",
                    )}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={clsx(
                      "flex items-center gap-1.5 text-[11px] font-medium",
                      isFeatured ? "text-white/45" : "text-muted",
                    )}
                  >
                    {loadingId === item.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Clock3 className="h-3.5 w-3.5" strokeWidth={1.8} />
                    )}
                    {formatDate(item.createdAt)}
                  </span>
                </div>

                <div className={clsx("mt-8", isFeatured && "max-w-2xl")}>
                  <p
                    className={clsx(
                      "text-[10px] font-semibold uppercase tracking-[0.14em]",
                      isFeatured ? "text-white/55" : "text-action",
                    )}
                  >
                    {item.senderRole || "직군 미상"}
                  </p>
                  <p
                    className={clsx(
                      "mt-3 line-clamp-2 font-semibold leading-snug tracking-[-0.025em]",
                      isFeatured ? "text-2xl text-white sm:text-3xl" : "text-lg text-ink",
                    )}
                  >
                    {item.summary}
                  </p>
                  <p
                    className={clsx(
                      "mt-3 line-clamp-2 text-xs font-medium leading-5",
                      isFeatured ? "max-w-xl text-white/50" : "text-muted",
                    )}
                  >
                    {item.keyRequest}
                  </p>
                </div>

                <span
                  className={clsx(
                    "absolute bottom-5 right-5 grid h-9 w-9 place-items-center border transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5",
                    isFeatured
                      ? "border-white/20 bg-action text-white"
                      : "border-action/25 bg-action-soft text-action group-hover:border-action group-hover:bg-action group-hover:text-white",
                  )}
                >
                  <ArrowUpRight className="h-4 w-4" strokeWidth={1.8} />
                </span>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
