import type { ProblemStatus } from "../../types";
import { Button } from "../../components/ui/Button";
import { CheckCircle2, Circle, RotateCw } from "lucide-react";
import { cn } from "../../lib/utils";

interface ProblemStatusToggleProps {
  status: ProblemStatus;
  onStatusChange: (status: ProblemStatus) => void;
  className?: string;
}

export function ProblemStatusToggle({
  status,
  onStatusChange,
  className,
}: ProblemStatusToggleProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        variant={status === "TODO" ? "default" : "outline"}
        size="sm"
        onClick={() => onStatusChange("TODO")}
        className={cn(
          "gap-1.5",
          status === "TODO" &&
            "bg-gray-100 text-gray-900 hover:bg-gray-200 border-gray-200"
        )}
      >
        <Circle className="w-4 h-4" />
        TODO
      </Button>
      <Button
        variant={status === "DONE" ? "default" : "outline"}
        size="sm"
        onClick={() => onStatusChange("DONE")}
        className={cn(
          "gap-1.5",
          status === "DONE" &&
            "bg-green-600 hover:bg-green-700 text-white border-transparent"
        )}
      >
        <CheckCircle2 className="w-4 h-4" />
        DONE
      </Button>
      <Button
        variant={status === "RETRY" ? "default" : "outline"}
        size="sm"
        onClick={() => onStatusChange("RETRY")}
        className={cn(
          "gap-1.5",
          status === "RETRY" &&
            "bg-amber-500 hover:bg-amber-600 text-white border-transparent"
        )}
      >
        <RotateCw className="w-4 h-4" />
        RETRY
      </Button>
    </div>
  );
}
