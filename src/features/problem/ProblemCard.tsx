import type { Problem } from "../../types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { useProgressStore } from "../../stores/progressStore";
import { ProblemStatusToggle } from "./ProblemStatusToggle";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

interface ProblemCardProps {
  problem: Problem;
}

export function ProblemCard({ problem }: ProblemCardProps) {
  const { getStatus, updateStatus } = useProgressStore();
  const status = getStatus(problem.id);

  const getPlatformUrl = () => {
    if (problem.platform === "BOJ") {
      return `https://www.acmicpc.net/problem/${problem.number}`;
    }
    return `https://school.programmers.co.kr/learn/courses/30/lessons/${problem.number}`;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{problem.platform}</Badge>
              <span className="text-sm text-gray-500">#{problem.number}</span>
            </div>
            <CardTitle className="text-lg">
              <Link to={`/problems/${problem.id}`} className="hover:underline">
                {problem.title}
              </Link>
            </CardTitle>
          </div>
          <a
            href={getPlatformUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-gray-600"
          >
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            {problem.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="border-t pt-4">
            <ProblemStatusToggle
              status={status}
              onStatusChange={(newStatus) =>
                updateStatus(problem.id, newStatus)
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
