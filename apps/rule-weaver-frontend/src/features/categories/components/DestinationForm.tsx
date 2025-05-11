import React, { useState } from "react";
import { FormCategoryDestination } from "../types/category";
import JsonSchemaEditor from "./JsonSchemaEditor";
import { JSONSchema7 } from "json-schema";

interface DestinationFormProps {
  destination?: FormCategoryDestination;
  onSave: (destination: FormCategoryDestination) => void;
  onCancel: () => void;
}

const DEFAULT_EXTRA_PROPERTIES: JSONSchema7 = {
  type: "object",
  properties: {},
};

const DestinationForm: React.FC<DestinationFormProps> = ({
  destination,
  onSave,
  onCancel,
}) => {
  const [name, setName] = useState(destination?.name || "");
  const [fieldName, setFieldName] = useState(
    destination?.typeOptions.fieldName || ""
  );
  const [options, setOptions] = useState<string[]>(
    destination?.typeOptions.options || []
  );
  const [extraProperties, setExtraProperties] = useState<JSONSchema7>(
    destination?.extraProperties || DEFAULT_EXTRA_PROPERTIES
  );
  const [optionInput, setOptionInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Destination name is required";
    }

    if (!fieldName.trim()) {
      newErrors.fieldName = "Field name is required";
    }

    if (options.length === 0) {
      newErrors.options = "At least one option is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    onSave({
      name,
      typeOptions: {
        fieldName,
        options,
      },
      extraProperties,
    });
  };

  const addOption = () => {
    if (optionInput.trim() && !options.includes(optionInput.trim())) {
      setOptions([...options, optionInput.trim()]);
      setOptionInput("");
    }
  };

  const removeOption = (option: string) => {
    setOptions(options.filter((opt) => opt !== option));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">
            Destination Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-button-primary/30 ${
              errors.name ? "border-destructive" : "border-border"
            }`}
            placeholder="e.g. A, B, or C"
          />
          {errors.name && (
            <div className="text-destructive text-sm mt-1">{errors.name}</div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">
            Field Name
          </label>
          <input
            type="text"
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
            className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-button-primary/30 ${
              errors.fieldName ? "border-destructive" : "border-border"
            }`}
            placeholder="e.g. format, algorithm, dataType"
          />
          {errors.fieldName && (
            <div className="text-destructive text-sm mt-1">
              {errors.fieldName}
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Field Options
        </label>
        <div className="flex space-x-2 mb-2">
          <input
            type="text"
            value={optionInput}
            onChange={(e) => setOptionInput(e.target.value)}
            className="flex-1 p-2 border rounded-md border-border focus:outline-none focus:ring-2 focus:ring-button-primary/30"
            placeholder="Add an option value (e.g. json, xml, csv)"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addOption();
              }
            }}
          />
          <button
            type="button"
            onClick={addOption}
            className="px-4 py-2 bg-button-primary text-button-primary-foreground rounded-md hover:bg-button-primary-hover transition-colors"
          >
            Add
          </button>
        </div>
        {errors.options && (
          <div className="text-destructive text-sm mb-2">{errors.options}</div>
        )}

        <div className="p-3 border border-border rounded-md bg-background-secondary/10 min-h-[80px]">
          {options.length === 0 ? (
            <div className="text-text-secondary text-sm text-center py-3">
              No options added yet. Add field options above.
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {options.map((option) => (
                <div
                  key={option}
                  className="flex items-center bg-background-secondary px-2.5 py-1 rounded-md"
                >
                  <span className="text-sm text-text-primary font-medium">
                    {option}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeOption(option)}
                    className="ml-2 text-text-secondary hover:text-destructive transition-colors"
                    aria-label={`Remove ${option} option`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Extra Properties (JSON Schema)
        </label>
        <div className="p-3 border border-border rounded-md bg-background-secondary/10">
          <JsonSchemaEditor
            value={extraProperties}
            onChange={setExtraProperties}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-border mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-border rounded-md hover:bg-background-dark/5 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-button-primary text-button-primary-foreground rounded-md hover:bg-button-primary-hover transition-colors"
        >
          Save Destination
        </button>
      </div>
    </form>
  );
};

export default DestinationForm;
