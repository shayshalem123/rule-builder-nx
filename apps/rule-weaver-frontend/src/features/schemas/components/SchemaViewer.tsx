import React, { useState } from "react";
import { SchemaDefinition, SchemaProperty } from "../types/schema";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/inputs/card";
import { Badge } from "@/shared/components/inputs/badge";
import JsonEditor from "@/shared/components/jsonEditor/JsonEditor";
import TabNavigation from "@/features/rules/shared/components/TabNavigation";

const TABS = [
  { id: "visual", label: "Visual View" },
  { id: "json", label: "JSON View" },
];

interface SchemaViewerProps {
  definition: SchemaDefinition;
}

const SchemaViewer: React.FC<SchemaViewerProps> = ({ definition }) => {
  const [activeTab, setActiveTab] = useState<string>("visual");

  const renderProperties = (
    properties: Record<string, SchemaProperty>,
    parentKey = "",
    depth = 0,
    parentRequired: string[] = []
  ) => {
    return Object.entries(properties).map(([key, property]) => {
      const fullKey = parentKey ? `${parentKey}.${key}` : key;
      const isRequired =
        parentRequired.includes(key) || property.required === true;

      return (
        <React.Fragment key={fullKey}>
          <div className={`border rounded-md p-3 ${depth > 0 ? "ml-4" : ""}`}>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-mono text-sm font-semibold text-blue-700">
                {key}
              </span>
              <Badge
                variant="outline"
                className="bg-gray-50 text-gray-700 border-gray-200"
              >
                {property.type}
              </Badge>
              {isRequired && (
                <Badge className="bg-red-50 text-red-700 border-red-200">
                  Required
                </Badge>
              )}
              {property.enum && (
                <Badge className="bg-purple-50 text-purple-700 border-purple-200">
                  Enum
                </Badge>
              )}
              {property.format && (
                <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200">
                  Format: {property.format}
                </Badge>
              )}
            </div>

            {property.description && (
              <p className="text-sm text-gray-600 mt-1">
                {property.description}
              </p>
            )}

            {property.enum && (
              <div className="mt-2">
                <span className="text-xs font-medium text-gray-500">
                  Allowed values:
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {property.enum.map((value) => (
                    <Badge key={value} variant="outline" className="text-xs">
                      {value}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {property.default !== undefined && (
              <div className="mt-1 text-xs text-gray-600">
                Default:{" "}
                <code className="bg-gray-100 px-1 rounded">
                  {property.default.toString()}
                </code>
              </div>
            )}

            {/* Render nested properties if they exist */}
            {property.type === "object" && property.properties && (
              <div className="mt-3 pl-3 border-l-2 border-gray-200">
                <div className="text-xs font-medium text-gray-500 mb-2">
                  Properties:
                </div>
                {renderProperties(
                  property.properties,
                  fullKey,
                  depth + 1,
                  property.required instanceof Array ? property.required : []
                )}
              </div>
            )}
          </div>
        </React.Fragment>
      );
    });
  };

  const renderVisualView = () => (
    <Card className="overflow-hidden">
      <CardHeader className="bg-slate-50 pb-2">
        <CardTitle className="text-md font-semibold">
          Schema Definition
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          {renderProperties(
            definition.properties,
            "",
            0,
            definition.required || []
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      <TabNavigation
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === "visual" ? (
        renderVisualView()
      ) : (
        <div className="[&_.absolute.top-2]:right-5">
          <JsonEditor value={definition} readOnly={true} height="500px" />
        </div>
      )}
    </div>
  );
};

export default SchemaViewer;
