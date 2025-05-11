import React from "react";
import { JSONSchema7 } from "json-schema";
import { jsonMetaSchema } from "@/shared/jsonMetaSchema";

interface JsonSchemaEditorProps {
  value: JSONSchema7;
  onChange: (value: JSONSchema7) => void;
  error?: string;
}

const JsonSchemaEditor: React.FC<JsonSchemaEditorProps> = ({
  value,
  onChange,
  error,
}) => {
  const [editValue, setEditValue] = React.useState<string>(
    JSON.stringify(value, null, 2)
  );
  const [localError, setLocalError] = React.useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditValue(e.target.value);
    try {
      const parsed = JSON.parse(e.target.value);
      onChange(parsed);
      setLocalError(null);
    } catch (err) {
      setLocalError("Invalid JSON");
    }
  };

  return (
    <div className="space-y-2">
      <textarea
        className={`w-full min-h-[200px] p-3 font-mono text-sm border rounded-md bg-background-dark text-background-dark-foreground focus:outline-none focus:ring-2 focus:ring-button-primary/30 ${
          localError || error ? "border-destructive" : "border-border"
        }`}
        value={editValue}
        onChange={handleChange}
        spellCheck="false"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        placeholder='{\n  "type": "object",\n  "properties": {}\n}'
      />
      {(localError || error) && (
        <div className="text-destructive text-sm">{localError || error}</div>
      )}
      <div className="text-xs text-text-muted">
        Use JSON schema format to define extra properties for this destination.
      </div>
    </div>
  );
};

export default JsonSchemaEditor;
