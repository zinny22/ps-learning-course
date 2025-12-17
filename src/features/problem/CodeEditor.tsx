import Editor from "react-simple-code-editor";
import { cn } from "../../lib/utils";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-python";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
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

export function CodeEditor({
  value,
  onChange,
  placeholder,
  language = "tsx",
  className,
  minHeightClassName = "min-h-[220px]",
}: CodeEditorProps) {
  return (
    <div
      className={cn(
        "rounded-md border border-gray-200 overflow-hidden",
        className
      )}
    >
      <Editor
        value={value}
        onValueChange={onChange}
        highlight={(code) => highlight(code, languageMap[language], language)}
        padding={12}
        textareaId="code-editor"
        preClassName={cn(
          "text-sm font-mono leading-6 outline-none",
          minHeightClassName
        )}
        textareaClassName={cn(
          "text-sm font-mono leading-6 outline-none",
          minHeightClassName
        )}
        placeholder={placeholder}
        style={{
          fontFamily:
            'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        }}
      />
    </div>
  );
}
