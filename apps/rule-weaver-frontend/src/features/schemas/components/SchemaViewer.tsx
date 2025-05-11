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
import { ChevronDown, ChevronUp } from "lucide-react";

const TABS = [
  { id: "visual", label: "Visual View" },
  { id: "json", label: "JSON View" },
];

interface SchemaViewerProps {
  definition: SchemaDefinition;
}

const SchemaViewer: React.FC<SchemaViewerProps> = ({ definition }) => {
  const [activeTab, setActiveTab] = useState<string>("visual");
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    new Set()
  );

  const toggleCollapse = (sectionKey: string) => {
    setCollapsedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionKey)) {
        newSet.delete(sectionKey);
      } else {
        newSet.add(sectionKey);
      }
      return newSet;
    });
  };

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

      const hasNestedContent =
        (property.type === "object" && property.properties) ||
        (property.type === "array" && property.items);

      const isCollapsed = collapsedSections.has(fullKey);

      return (
        <React.Fragment key={fullKey}>
          <div className={`border rounded-md p-3 ${depth > 0 ? "ml-4" : ""}`}>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              {hasNestedContent && (
                <button
                  onClick={() => toggleCollapse(fullKey)}
                  className="p-1 rounded-sm hover:bg-muted focus:outline-none focus:ring-1 focus:ring-primary"
                  aria-label={isCollapsed ? "Expand" : "Collapse"}
                >
                  {isCollapsed ? (
                    <ChevronDown className="h-4 w-4 text-text-secondary" />
                  ) : (
                    <ChevronUp className="h-4 w-4 text-text-secondary" />
                  )}
                </button>
              )}
              <span className="font-mono text-sm font-semibold text-primary">
                {key}
              </span>
              <Badge
                variant="outline"
                className="bg-background-primary text-text-secondary border-border-primary"
              >
                {property.type}
              </Badge>
              {isRequired && (
                <Badge
                  variant="outline"
                  className="bg-destructive/10 text-destructive border-destructive/20"
                >
                  Required
                </Badge>
              )}
              {property.enum && (
                <Badge
                  variant="outline"
                  className="bg-purple-500/10 text-purple-500 dark:text-purple-300 border-purple-300/20"
                >
                  Enum
                </Badge>
              )}
              {property.format && (
                <Badge
                  variant="outline"
                  className="bg-indigo-500/10 text-indigo-500 dark:text-indigo-300 border-indigo-300/20"
                >
                  Format: {property.format}
                </Badge>
              )}
            </div>

            {property.description && (
              <p className="text-sm text-text-primary mt-1">
                {property.description}
              </p>
            )}

            {!isCollapsed && (
              <>
                {property.enum && (
                  <div className="mt-2">
                    <span className="text-xs font-medium text-text-primary">
                      Allowed values:
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {property.enum.map((value) => (
                        <Badge
                          key={value}
                          variant="outline"
                          className="text-xs"
                        >
                          {value}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {property.default !== undefined && (
                  <div className="mt-1 text-xs text-text-primary">
                    Default:{" "}
                    <code className="bg-muted px-1 rounded">
                      {property.default.toString()}
                    </code>
                  </div>
                )}

                {/* Render nested properties if they exist */}
                {property.type === "object" && property.properties && (
                  <div className="mt-3 pl-3 border-l-2 border-border-primary">
                    <div className="text-xs font-medium text-text-primary mb-2">
                      Properties:
                    </div>
                    {renderProperties(
                      property.properties,
                      fullKey,
                      depth + 1,
                      property.required instanceof Array
                        ? property.required
                        : []
                    )}
                  </div>
                )}

                {/* Render array items if the type is array */}
                {property.type === "array" && property.items && (
                  <div className="mt-3 pl-3 border-l-2 border-border-primary">
                    <div className="flex flex-col">
                      {property.items.description && (
                        <p className="text-sm text-text-primary mb-3">
                          {property.items.description}
                        </p>
                      )}

                      <div className="text-xs font-medium text-text-primary mb-2">
                        Array Items:
                      </div>

                      <div className="border rounded-md p-3">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <Badge
                            variant="outline"
                            className="bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-300/20"
                          >
                            Items Type: {property.items.type || "Any"}
                          </Badge>

                          {property.items.format && (
                            <Badge
                              variant="outline"
                              className="bg-indigo-500/10 text-indigo-500 dark:text-indigo-300 border-indigo-300/20"
                            >
                              Format: {property.items.format}
                            </Badge>
                          )}
                        </div>

                        {/* If array items are objects with properties, render them */}
                        {property.items.type === "object" &&
                          property.items.properties && (
                            <div className="mt-3 pl-3 border-l-2 border-border-primary">
                              <div className="text-xs font-medium text-text-primary mb-2">
                                Item Properties:
                              </div>
                              {renderProperties(
                                property.items.properties,
                                `${fullKey}.items`,
                                depth + 1,
                                property.items.required instanceof Array
                                  ? property.items.required
                                  : []
                              )}
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </React.Fragment>
      );
    });
  };

  const renderVisualView = () => (
    <Card className="overflow-hidden">
      <CardHeader className="bg-card/50 pb-2">
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
