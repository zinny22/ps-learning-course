import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { weeks } from "../data/weeks";

export default function CoursePage() {
  const toStars = (difficulty: number) =>
    "⭐".repeat(Math.max(1, Math.min(4, difficulty)));

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold mb-2">PS Learning Course</h1>
        <p className="text-gray-500">
          체계적으로 시작하고, 기록하며 성장하는 PS 학습 코스
        </p>
      </header>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">🎯 목표</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-gray-700">
              <div className="flex gap-2">
                <span className="text-gray-400">-</span>
                <span>
                  알고리즘 문제 풀이(PS)를{" "}
                  <span className="font-semibold">
                    체계적으로 시작하고 지속하기
                  </span>
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-400">-</span>
                <span>
                  문제를 “많이 푸는 것”보다{" "}
                  <span className="font-semibold">
                    패턴과 사고 과정을 정리하며 학습
                  </span>
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-400">-</span>
                <span>
                  코딩 테스트 및 문제 해결 능력의{" "}
                  <span className="font-semibold">기초 체력</span> 만들기
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">📆 전체 기간</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-gray-700">
              <div className="flex gap-2">
                <span className="text-gray-400">-</span>
                <span>
                  <span className="font-semibold">총 기간:</span> 13주
                  <div className="mt-1 text-sm text-gray-600">
                    핵심 커리큘럼: 8주 (기초 체력 완성)
                    <br />
                    확장 학습: 최대 13주 (중급 대비)
                  </div>
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-400">-</span>
                <span>
                  <span className="font-semibold">권장 페이스:</span>
                  <div className="mt-1 text-sm text-gray-600">
                    하루 1~2문제
                    <br />주 5일 문제 풀이 + 주 2일 복습
                  </div>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">🧭 공부 원칙 (중요)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-gray-700">
              <div className="flex gap-3">
                <div className="w-6 shrink-0 text-sm font-semibold text-gray-500">
                  1.
                </div>
                <div>
                  <div className="font-medium">30분 고민 후 해설 확인</div>
                  <div className="text-sm text-gray-600">
                    오래 붙잡고 있는 것은 실력이 아니라 체력 소모
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 shrink-0 text-sm font-semibold text-gray-500">
                  2.
                </div>
                <div>
                  <div className="font-medium">문제 수보다 패턴</div>
                  <div className="text-sm text-gray-600">
                    같은 유형을 묶어서 풀기
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 shrink-0 text-sm font-semibold text-gray-500">
                  3.
                </div>
                <div>
                  <div className="font-medium">
                    풀이 과정을 말로 설명할 수 있어야 함
                  </div>
                  <div className="text-sm text-gray-600">
                    “왜 이 방식인지” 설명 가능해야 이해한 것
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 shrink-0 text-sm font-semibold text-gray-500">
                  4.
                </div>
                <div>
                  <div className="font-medium">모든 문제를 정리하지 않는다</div>
                  <div className="text-sm text-gray-600">
                    막혔던 문제 / 대표 문제만 노션에 기록
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 shrink-0 text-sm font-semibold text-gray-500">
                  5.
                </div>
                <div>
                  <div className="font-medium">틀린 문제는 자산</div>
                  <div className="text-sm text-gray-600">
                    오답은 반드시 이유를 남긴다
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              🗺️ 전체 로드맵 한눈에 보기
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="py-2 pr-4 font-medium">Week</th>
                    <th className="py-2 pr-4 font-medium">주제</th>
                    <th className="py-2 pr-4 font-medium">핵심 목표</th>
                    <th className="py-2 pr-4 font-medium">대표 사고 방식</th>
                    <th className="py-2 pr-0 font-medium">난이도</th>
                  </tr>
                </thead>
                <tbody>
                  {weeks.map((w) => (
                    <tr key={w.id} className="border-b last:border-b-0">
                      <td className="py-3 pr-4 whitespace-nowrap font-medium text-gray-900">
                        <Link
                          to={`/weeks/${w.id}`}
                          className="hover:underline underline-offset-4"
                        >
                          Week {w.weekNumber}
                        </Link>
                      </td>
                      <td className="py-3 pr-4 whitespace-nowrap text-gray-900">
                        {w.title}
                      </td>
                      <td className="py-3 pr-4 text-gray-700">
                        {w.goal[0] || ""}
                      </td>
                      <td className="py-3 pr-4 text-gray-700">
                        {w.thinkingPattern || ""}
                      </td>
                      <td className="py-3 pr-0 whitespace-nowrap text-gray-900">
                        {toStars(w.difficulty)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <Button asChild className="sm:w-auto">
          <Link to="/weeks">주차별 계획 보기</Link>
        </Button>
        <Button asChild variant="outline" className="sm:w-auto">
          <Link to="/problems">문제 은행으로 이동</Link>
        </Button>
      </div>
    </div>
  );
}
