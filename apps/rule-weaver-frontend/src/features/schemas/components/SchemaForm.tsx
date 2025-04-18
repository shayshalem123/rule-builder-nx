import React, { useState } from "react";
import { useSchemaForm, SchemaFormValues } from "../hooks/useSchemaForm";
import { Schema, CreateSchema } from "../types/schema";
import { Button } from "@/shared/components/inputs/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/shared/components/inputs/tabs";
import { SchemaFormFields } from "./SchemaFormFields";
import { SchemaJsonEditor } from "./SchemaJsonEditor";
import { SchemaDefinitionEditor } from "./SchemaDefinitionEditor";

type TabId = "form" | "json";

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
  const [activeTab, setActiveTab] = useState<TabId>("form");
  const { formik, categoryOptions } = useSchemaForm(initialData, onSubmit);

  const updateFormik = (values: SchemaFormValues) => {
    formik.setValues(values);
  };

  return (
    <Tabs
      defaultValue="form"
      value={activeTab}
      onValueChange={(value) => setActiveTab(value as TabId)}
      className="w-full"
    >
      <TabsList className="mb-6 grid grid-cols-2 w-full">
        <TabsTrigger value="form" className="w-full">
          <span className="relative">Form View</span>
        </TabsTrigger>
        <TabsTrigger value="json" className="w-full">
          <span className="relative">JSON Editor</span>
        </TabsTrigger>
      </TabsList>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <TabsContent value="form" className="w-full space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Schema Properties</h2>
            <SchemaFormFields
              formik={formik}
              categoryOptions={categoryOptions}
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Schema Definition</h2>
            <SchemaDefinitionEditor formik={formik} />
          </div>
        </TabsContent>

        <TabsContent value="json" className="w-full">
          <SchemaJsonEditor formik={formik} updateFormik={updateFormik} />
        </TabsContent>

        <div className="flex w-full justify-end">
          <Button type="submit" disabled={isSubmitting || !formik.isValid}>
            {isSubmitting
              ? "Saving..."
              : initialData
              ? "Update Schema"
              : "Create Schema"}
          </Button>
        </div>
      </form>
    </Tabs>
  );
};

export default SchemaForm;
