import clsx from "clsx";
import { ArrowUpRight, History, MessageSquareText } from "lucide-react";
import type { AppPage } from "../types";

const navItems: Array<{ id: AppPage; label: string; description: string; icon: typeof History }> = [
  {
    id: "analyze",
    label: "분석하기",
    description: "협업 텍스트 분석",
    icon: MessageSquareText,
  },
  {
    id: "history",
    label: "분석 이력",
    description: "완료 보고서 조회",
    icon: History,
  },
];

export function Sidebar({
  activePage,
  onNavigate,
}: {
  activePage: AppPage;
  onNavigate: (page: AppPage) => void;
}) {
  return (
    <aside className="relative z-40 flex w-full shrink-0 flex-col border-b border-line bg-[#f6f3ed]/90 px-4 py-4 backdrop-blur-xl sm:px-6 lg:sticky lg:top-0 lg:h-dvh lg:w-[248px] lg:border-b-0 lg:border-r lg:px-5 lg:py-7">
      <div className="flex items-center justify-between lg:block">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center bg-ink text-sm font-semibold tracking-[-0.04em] text-white">
            CB
          </span>
          <div>
            <p className="text-base font-semibold tracking-[-0.025em] text-ink">ContextBridge</p>
            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
              Meaning alignment
            </p>
          </div>
        </div>
        <span className="hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-muted lg:mt-8 lg:block">
          Workspace
        </span>
      </div>

      <nav className="mt-4 flex gap-2 overflow-x-auto lg:mt-3 lg:grid lg:gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === activePage;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={clsx(
                "group flex min-w-max items-center gap-3 border px-3 py-2.5 text-left transition-all duration-300 ease-out active:scale-[0.98] lg:min-w-0 lg:border-transparent lg:px-2.5 lg:py-3",
                isActive
                  ? "border-action bg-action text-white shadow-[0_10px_24px_rgba(49,87,213,0.22)]"
                  : "border-line/80 bg-white/70 text-muted hover:border-action/35 hover:bg-action-soft hover:text-action lg:bg-transparent",
              )}
            >
              <span
                className={clsx(
                  "grid h-8 w-8 shrink-0 place-items-center border transition-colors duration-300",
                  isActive
                    ? "border-white/15 bg-white/10 text-white"
                    : "border-line bg-white text-muted group-hover:border-action/30 group-hover:text-action",
                )}
              >
                <Icon className="h-4 w-4" strokeWidth={1.8} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold">{item.label}</span>
                <span
                  className={clsx(
                    "mt-0.5 hidden text-[11px] font-medium lg:block",
                    isActive ? "text-white/55" : "text-muted",
                  )}
                >
                  {item.description}
                </span>
              </span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto hidden border-t border-line pt-5 lg:block">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">Current scope</p>
        <p className="mt-3 text-xs font-medium leading-5 text-ink">
          문장 속 모호한 표현을 찾고,
          <br />
          합의 질문과 체크리스트로 정리합니다.
        </p>
        <a
          href="#main-report"
          className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-action transition-all duration-300 hover:gap-2.5 hover:text-action-hover"
        >
          보고서 영역
          <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.8} />
        </a>
      </div>
    </aside>
  );
}
