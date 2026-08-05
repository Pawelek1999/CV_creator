interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  error: string | null;
}

export function JsonEditor({ value, onChange, error }: JsonEditorProps) {
  return (
    <div className="flex flex-col gap-2 h-full">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        className={`flex-1 min-h-[500px] font-mono text-xs p-4 rounded-md border resize-none focus:outline-none focus:ring-2 ${
          error
            ? "border-red-400 focus:ring-red-300"
            : "border-gray-300 focus:ring-blue-300"
        }`}
        placeholder="Wklej JSON zgodny ze schematem CV..."
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
