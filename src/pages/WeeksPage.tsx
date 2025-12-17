import { weeks } from "../data/weeks";
import { problems } from "../data/problems";
import { WeekCard } from "../features/week/WeekCard";

export default function WeeksPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold mb-2">주차별 계획</h1>
        <p className="text-gray-500">
          주차별 로드맵을 따라 PS를 체계적으로 학습하세요.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {weeks.map((week) => (
          <WeekCard key={week.id} week={week} problems={problems} />
        ))}
      </div>
    </div>
  );
}
