import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/inputs/card";
import JsonEditor from "@/shared/components/jsonEditor/JsonEditor";
import { JsonSchema, JsonData } from "../types";
import { Button } from "@/shared/components/inputs/button";
import { jsonMetaSchema } from "@/shared/jsonMetaSchema";
import { FileJson } from "lucide-react";

interface SchemaValidationModeProps {
  schema: JsonSchema;
  jsonData: JsonData;
  onSchemaChange: (schema: JsonSchema) => void;
  onJsonDataChange: (data: JsonData) => void;
}

export const SchemaValidationMode: React.FC<SchemaValidationModeProps> = ({
  schema,
  jsonData,
  onSchemaChange,
  onJsonDataChange,
}) => {
  const handleLoadMetaSchema = () => {
    onSchemaChange(jsonMetaSchema);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="border-2 border-blue-300 dark:border-blue-700/70 shadow-md m-2 rounded-lg">
        <CardHeader className="bg-blue-50 dark:bg-blue-800/30">
          <CardTitle className="flex items-center justify-between gap-2 dark:text-blue-200">
            <span>JSON Schema Definition</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLoadMetaSchema}
              title="Load the official JSON Schema definition (meta schema)"
            >
              <FileJson className="mr-2 h-4 w-4" />
              Load Meta Schema
            </Button>
          </CardTitle>
          <CardDescription className="dark:text-blue-300/80">
            Define the structure and validation rules using JSON Schema keywords
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <JsonEditor
            value={schema}
            onChange={onSchemaChange}
            height="60vh"
            showToolbar={true}
            enableStickyProperties={true}
          />
        </CardContent>
      </Card>

      <Card className="border-2 border-green-300 dark:border-green-700/70 shadow-md m-2 rounded-lg">
        <CardHeader className="bg-green-50 dark:bg-green-800/30">
          <CardTitle className="dark:text-green-200">JSON Data</CardTitle>
          <CardDescription className="dark:text-green-300/80">
            Data to validate against the schema
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <JsonEditor
            value={jsonData}
            onChange={onJsonDataChange}
            height="60vh"
            showToolbar={true}
            enableStickyProperties={true}
            jsonSchema={schema}
          />
        </CardContent>
      </Card>
    </div>
  );
};
