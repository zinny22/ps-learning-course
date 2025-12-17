import { useParams, Link } from "react-router-dom";
import { ProblemCard } from "../features/problem/ProblemCard";
import { WeekProgress } from "../features/week/WeekProgress";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Checkbox } from "../components/ui/Checkbox";
import { ArrowLeft, CheckCircle2, ListTodo, Lightbulb } from "lucide-react";
import { cn } from "../lib/utils";
import { useProgressStore } from "../stores/progressStore";
import { weeks } from "../data/weeks";
import { problems } from "../data/problems";

export default function WeekDetailPage() {
  const { weekId } = useParams();
  const { getStatus, toggleChecklist, getChecklistStatus } = useProgressStore();

  const week = weeks.find((w) => w.id === weekId);

  if (!week) {
    return <div>Week not found</div>;
  }

  const weekProblems = problems.filter((p) => p.week === week.weekNumber);
  const completedCount = weekProblems.filter(
    (p) => getStatus(p.id) === "DONE"
  ).length;

  return (
    <div className="space-y-8">
      <div>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="mb-4 pl-0 hover:bg-transparent hover:text-blue-600"
        >
          <Link to="/weeks">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Weeks
          </Link>
        </Button>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Week {week.weekNumber}: {week.title}
            </h1>
            <p className="text-gray-500 max-w-2xl">
              Focus on mastering the core concepts and patterns for this week.
            </p>
          </div>
          <Card className="min-w-[240px]">
            <CardContent className="pt-6">
              <WeekProgress
                total={weekProblems.length}
                completed={completedCount}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <ListTodo className="w-5 h-5 text-blue-500" />
              Practice Problems
            </h2>
            <div className="space-y-4">
              {weekProblems.map((problem) => (
                <ProblemCard key={problem.id} problem={problem} />
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6 sticky top-6 h-fit">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-500" />
                Weekly Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {week.goal.map((g, i) => (
                  <li
                    key={i}
                    className="text-sm text-gray-600 flex items-start gap-2"
                  >
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                    {g}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                Learning Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {week.learningPoints.map((point, i) => (
                  <li
                    key={i}
                    className="text-sm text-gray-600 flex items-start gap-2"
                  >
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Checklist
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {week.checklist.map((item, i) => {
                  const isChecked = getChecklistStatus(week.id, i);
                  return (
                    <li
                      key={i}
                      className="text-sm text-gray-600 flex items-start gap-2"
                    >
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() => toggleChecklist(week.id, i)}
                        className="mt-1"
                      />
                      <span
                        className={cn(
                          "flex-1 transition-colors",
                          isChecked && "text-gray-400 line-through"
                        )}
                      >
                        {item}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Helper component since I used it but didn't import it
function Target({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}
