import React from "react";
import { Schema } from "../types/schema";
import { SchemaFormValues } from "../hooks/useSchemaForm";
import { DiffModal } from "@/shared/components/diff";

interface SchemaDiffModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSchema?: Schema;
  currentValues: SchemaFormValues;
}

const SchemaDiffModal: React.FC<SchemaDiffModalProps> = ({
  isOpen,
  onClose,
  initialSchema,
  currentValues,
}) => {
  // Format schema JSON for diff comparison
  const formatSchemaJson = (schema: Schema | Record<string, unknown>) => {
    return JSON.stringify(schema, null, 2);
  };

  // Prepare the original (initial) schema JSON
  const originalJson = initialSchema ? formatSchemaJson(initialSchema) : "{}"; // Empty object if no initial schema (new schema)

  // Prepare the modified (current) schema JSON
  const modifiedJson = formatSchemaJson({
    ...initialSchema,
    ...currentValues,
  });

  return (
    <DiffModal
      isOpen={isOpen}
      onClose={onClose}
      title="Schema Changes"
      original={originalJson}
      modified={modifiedJson}
      language="json"
      renderSideBySide={true}
    />
  );
};

export default SchemaDiffModal;
