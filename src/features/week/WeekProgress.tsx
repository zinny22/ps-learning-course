import { ProgressBar } from "../../components/ui/ProgressBar";

interface WeekProgressProps {
  total: number;
  completed: number;
  className?: string;
}

export function WeekProgress({
  total,
  completed,
  className,
}: WeekProgressProps) {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className={className}>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-gray-500">진행률</span>
        <span className="font-medium text-gray-900">
          {percentage}%{" "}
          <span className="text-gray-500">
            ({completed}/{total})
          </span>
        </span>
      </div>
      <ProgressBar value={completed} max={total} />
    </div>
  );
}
