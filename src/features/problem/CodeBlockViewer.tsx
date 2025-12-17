import { useMemo, useState } from "react";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-python";
import { cn } from "../../lib/utils";
import { Button } from "../../components/ui/Button";

interface CodeBlockViewerProps {
  code: string;
  language?: "js" | "jsx" | "ts" | "tsx" | "py";
  className?: string;
  minHeightClassName?: string;
}

const languageMap = {
  js: languages.javascript,
  jsx: languages.jsx,
  ts: languages.typescript,
  tsx: languages.tsx,
  py: languages.python,
} as const;

export function CodeBlockViewer({
  code,
  language = "tsx",
  className,
  minHeightClassName = "min-h-[260px]",
}: CodeBlockViewerProps) {
  const [copied, setCopied] = useState(false);

  const lines = useMemo(() => {
    const raw = code.replace(/\n$/, "");
    return raw.length === 0 ? [""] : raw.split("\n");
  }, [code]);

  const html = useMemo(() => {
    return highlight(code, languageMap[language], language);
  }, [code, language]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      className={cn(
        "rounded-lg border border-gray-200 bg-gray-50 overflow-hidden",
        className
      )}
    >
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 bg-white">
        <div className="text-xs text-gray-500 font-medium">
          {language.toUpperCase()}
        </div>
        <Button size="sm" variant="ghost" className="h-7" onClick={handleCopy}>
          {copied ? "복사됨" : "복사"}
        </Button>
      </div>

      <div className={cn("grid", minHeightClassName)}>
        <div className="grid grid-cols-[48px_1fr]">
          <div className="select-none text-right text-xs text-gray-400 py-3 pr-2 border-r border-gray-200 bg-gray-50">
            {lines.map((_, idx) => (
              <div key={idx} className="leading-6">
                {idx + 1}
              </div>
            ))}
          </div>

          <pre
            className={cn(
              "m-0 p-3 overflow-auto text-sm font-mono leading-6 bg-gray-50",
              minHeightClassName
            )}
          >
            <code
              className={cn("language-" + language)}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </pre>
        </div>
      </div>
    </div>
  );
}
