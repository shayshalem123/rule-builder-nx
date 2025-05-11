import React, { useState } from "react";
import { useSchemaForm, SchemaFormValues } from "../hooks/useSchemaForm";
import { Schema, CreateSchema } from "../types/schema";
import { Button } from "@/shared/components/inputs/button";
import { SchemaFormFields } from "./SchemaFormFields";
import { SchemaDefinitionEditor } from "./SchemaDefinitionEditor";
import { DiffViewButton } from "@/shared/components/diff";
import SchemaDiffModal from "./SchemaDiffModal";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/inputs/card";

interface SchemaFormProps {
  initialData?: Schema;
  onSubmit: (data: CreateSchema) => void;
  isSubmitting?: boolean;
}

const SchemaForm: React.FC<SchemaFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting = false,
}) => {
  const [isDiffModalOpen, setIsDiffModalOpen] = useState(false);
  const { formik, categoryOptions } = useSchemaForm(initialData, onSubmit);

  const showDiffModal = () => {
    setIsDiffModalOpen(true);
  };

  const closeDiffModal = () => {
    setIsDiffModalOpen(false);
  };

  const hasChanges = formik.dirty;
  const isEditMode = !!initialData;

  return (
    <>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <Card className="border-border-primary bg-background-primary">
          <CardHeader>
            <CardTitle className="text-lg">Schema Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <SchemaFormFields
              formik={formik}
              categoryOptions={categoryOptions}
            />
          </CardContent>
        </Card>

        <Card className="border-border-primary bg-background-primary">
          <CardHeader>
            <CardTitle className="text-lg">Schema Definition</CardTitle>
          </CardHeader>
          <CardContent>
            <SchemaDefinitionEditor formik={formik} />
          </CardContent>
        </Card>

        <div className="flex items-center justify-between pt-4 border-t border-border-primary">
          {isEditMode ? (
            <DiffViewButton onClick={showDiffModal} disabled={!hasChanges} />
          ) : (
            <div></div>
          )}

          <div>
            <Button type="submit" disabled={isSubmitting || !formik.isValid}>
              {isSubmitting
                ? "Saving..."
                : initialData
                ? "Update Schema"
                : "Create Schema"}
            </Button>
          </div>
        </div>
      </form>

      {isEditMode && (
        <SchemaDiffModal
          isOpen={isDiffModalOpen}
          onClose={closeDiffModal}
          initialSchema={initialData}
          currentValues={formik.values}
        />
      )}
    </>
  );
};

export default SchemaForm;
