import { useMemo, useState, useDeferredValue } from "react";
import { ProblemCard } from "../features/problem/ProblemCard";
import { Button } from "../components/ui/Button";
import type { ProblemStatus } from "../types";
import { useProgressStore } from "../stores/progressStore";
import { weeks } from "../data/weeks";
import { problems } from "../data/problems";

export default function ProblemsPage() {
  const [filterStatus, setFilterStatus] = useState<ProblemStatus | "ALL">(
    "ALL"
  );
  const [filterWeek, setFilterWeek] = useState<number | "ALL">("ALL");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const { getStatus } = useProgressStore();

  const filteredProblems = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();

    return problems.filter((problem) => {
      const statusMatch =
        filterStatus === "ALL" || getStatus(problem.id) === filterStatus;
      const weekMatch = filterWeek === "ALL" || problem.week === filterWeek;

      if (!statusMatch || !weekMatch) return false;
      if (q.length === 0) return true;

      const haystack = [
        problem.title,
        String(problem.number),
        problem.platform,
        ...(problem.tags || []),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [deferredQuery, filterStatus, filterWeek, getStatus]);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold mb-2">문제 은행</h1>
        <p className="text-gray-500">
          모든 연습 문제를 한 곳에서 관리하고 검색하세요.
        </p>
      </header>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="p-4 md:p-5 border-b border-gray-100">
          <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">검색</div>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="제목 / 번호 / 태그 / 플랫폼으로 검색"
                className="w-full h-10 px-3 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="text-sm text-gray-500 md:text-right">
              {filteredProblems.length}개
            </div>
          </div>
        </div>

        <div className="p-4 md:p-5 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">상태</span>
              <div className="flex gap-1">
                {(["ALL", "TODO", "DONE", "RETRY"] as const).map((status) => (
                  <Button
                    key={status}
                    variant={filterStatus === status ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setFilterStatus(status)}
                    className="h-8"
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>

            <div className="h-px w-full bg-gray-100 md:hidden" />

            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                주차
              </span>
              <div className="flex gap-1">
                <Button
                  variant={filterWeek === "ALL" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setFilterWeek("ALL")}
                  className="h-8"
                >
                  전체
                </Button>
                {weeks.map((week) => (
                  <Button
                    key={week.id}
                    variant={
                      filterWeek === week.weekNumber ? "default" : "ghost"
                    }
                    size="sm"
                    onClick={() => setFilterWeek(week.weekNumber)}
                    className="h-8 whitespace-nowrap"
                  >
                    {week.weekNumber}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredProblems.length > 0 ? (
          filteredProblems.map((problem) => (
            <ProblemCard key={problem.id} problem={problem} />
          ))
        ) : (
          <div className="text-center py-14 bg-white border border-dashed border-gray-200 rounded-xl">
            <div className="text-gray-900 font-medium mb-1">
              검색 결과가 없습니다
            </div>
            <div className="text-sm text-gray-500">
              검색어를 바꾸거나 필터를 초기화해보세요.
            </div>
            <div className="mt-4 flex justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setQuery("");
                  setFilterWeek("ALL");
                  setFilterStatus("ALL");
                }}
              >
                필터 초기화
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
