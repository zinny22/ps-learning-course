import { Link } from "react-router-dom";
import { concepts } from "../data/concepts";
import { weeks } from "../data/weeks";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { BookOpen, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/Button";

export default function AllConceptsPage() {
  // Sort concepts by week number
  const sortedConcepts = [...concepts].sort((a, b) => {
    const weekA = weeks.find((w) => w.id === a.weekId)?.weekNumber || 0;
    const weekB = weeks.find((w) => w.id === b.weekId)?.weekNumber || 0;
    return weekA - weekB;
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4 flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-blue-500" />
          기본 개념 모음
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          PS(Problem Solving)에 필요한 핵심 알고리즘과 자료구조 개념들을
          주차별로 정리했습니다.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedConcepts.map((concept) => {
          const week = weeks.find((w) => w.id === concept.weekId);
          const allKeywords = concept.sections.flatMap((s) => s.keywords || []);
          // Deduplicate keywords and take first 5
          const uniqueKeywords = [...new Set(allKeywords)].slice(0, 5);

          return (
            <Card
              key={concept.weekId}
              className="flex flex-col hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="text-sm font-medium text-blue-600 mb-2">
                  Week {week?.weekNumber}
                </div>
                <CardTitle className="text-xl mb-2">{concept.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {concept.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto space-y-4">
                {uniqueKeywords.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {uniqueKeywords.map((keyword, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded"
                      >
                        #{keyword}
                      </span>
                    ))}
                  </div>
                )}

                <Button asChild className="w-full mt-4">
                  <Link to={`/weeks/${concept.weekId}/concepts`}>
                    학습하기 <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
