import type { Week, Problem } from "../../types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/Card";
import { WeekProgress } from "./WeekProgress";
import { Link } from "react-router-dom";
import { Check, ChevronRight } from "lucide-react";
import { useProgressStore } from "../../stores/progressStore";

interface WeekCardProps {
  week: Week;
  problems: Problem[];
}

export function WeekCard({ week, problems }: WeekCardProps) {
  const { getStatus } = useProgressStore();

  const weekProblems = problems.filter((p) => p.week === week.weekNumber);
  const total = weekProblems.length;
  const completed = weekProblems.filter(
    (p) => getStatus(p.id) === "DONE"
  ).length;
  const isCompleted = total > 0 && completed === total;

  const difficultyLabel =
    week.difficulty <= 1
      ? "쉬움"
      : week.difficulty === 2
      ? "보통"
      : week.difficulty === 3
      ? "어려움"
      : "매우 어려움";

  return (
    <Card
      className={
        "group transition-colors overflow-hidden " +
        (isCompleted
          ? "border-emerald-200 hover:border-emerald-300"
          : "hover:border-gray-300")
      }
    >
      <Link to={`/weeks/${week.id}`}>
        <div
          className={
            "h-1 w-full bg-gradient-to-r " +
            (isCompleted
              ? "from-emerald-600/70 via-emerald-400/50"
              : "from-blue-600/70 via-indigo-500/50") +
            " to-transparent"
          }
        />

        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-2 py-0.5 text-xs font-medium text-gray-700">
                  Week {week.weekNumber}
                </span>

                {isCompleted && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                    <Check className="w-3 h-3" />
                    완료
                  </span>
                )}

                <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                  난이도 {week.difficulty} · {difficultyLabel}
                </span>
              </div>

              <CardTitle className="text-xl group-hover:text-blue-600 transition-colors truncate">
                {week.title}
              </CardTitle>

              <CardDescription className="line-clamp-2 mt-2">
                {week.goal.join(", ")}
              </CardDescription>
            </div>

            <ChevronRight
              className={
                "w-5 h-5 transition-colors mt-1 " +
                (isCompleted
                  ? "text-emerald-500 group-hover:text-emerald-600"
                  : "text-gray-400 group-hover:text-blue-600")
              }
            />
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <WeekProgress total={total} completed={completed} />
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-gray-500">문제</span>
            <span className="font-medium text-gray-900">{total}개</span>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
