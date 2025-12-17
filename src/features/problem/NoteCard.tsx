import ReactMarkdown from "react-markdown";
import { cn } from "../../lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";

interface NoteCardProps {
  title: string;
  icon?: React.ReactNode;
  value: string;
  placeholder?: string;
  isEditing: boolean;
  onChange: (value: string) => void;
  className?: string;
  textareaClassName?: string;
  minHeightClassName?: string;
}

export function NoteCard({
  title,
  icon,
  value,
  placeholder,
  isEditing,
  onChange,
  className,
  textareaClassName,
  minHeightClassName = "min-h-[120px]",
}: NoteCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <textarea
            className={cn(
              "w-full p-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-y",
              minHeightClassName,
              textareaClassName
            )}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        ) : (
          <div className={cn("text-sm", minHeightClassName)}>
            {value.trim().length === 0 ? (
              <p className="text-gray-400">{placeholder || ""}</p>
            ) : (
              <div className="prose prose-sm max-w-none prose-pre:bg-gray-50 prose-pre:border prose-pre:border-gray-200 prose-pre:rounded-md">
                <ReactMarkdown>{value}</ReactMarkdown>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
