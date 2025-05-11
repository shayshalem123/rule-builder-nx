import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/shared/components/inputs/tabs";
import { DiffModal } from "@/shared/components/diff";
import { FileJson, Split, Code } from "lucide-react";
import { JsonSchema, JsonData, Mode } from "./types";
import { SchemaValidationMode } from "./components/SchemaValidationMode";
import { DiffMode } from "./components/DiffMode";
import { PlainJsonMode } from "./components/PlainJsonMode";

interface JsonToolsPageProps {
  defaultTab?: Mode;
}

const JsonToolsPage: React.FC<JsonToolsPageProps> = ({
  defaultTab = "schema-validation",
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // State for active mode
  const [activeMode, setActiveMode] = useState<Mode>(defaultTab);

  const [schema, setSchema] = useState<JsonSchema>({});
  const [jsonData, setJsonData] = useState<JsonData>({});

  const [leftJson, setLeftJson] = useState<JsonData>({});
  const [rightJson, setRightJson] = useState<JsonData>({});
  const [isDiffModalOpen, setIsDiffModalOpen] = useState(false);

  const [plainJson, setPlainJson] = useState<JsonData>({});

  const handleTabChange = useCallback(
    (value: Mode) => {
      setActiveMode(value);

      const path = `/json-tools/${value}`;

      if (location.pathname !== path) {
        navigate(path);
      }
    },
    [location.pathname, navigate]
  );

  useEffect(() => {
    handleTabChange(activeMode);
  }, [activeMode, handleTabChange]);

  const handleSchemaChange = (updatedSchema: JsonSchema) => {
    setSchema(updatedSchema);
  };

  const handleJsonDataChange = (updatedData: JsonData) => {
    setJsonData(updatedData);
  };

  const handleLeftJsonChange = (updatedData: JsonData) => {
    setLeftJson(updatedData);
  };

  const handleRightJsonChange = (updatedData: JsonData) => {
    setRightJson(updatedData);
  };

  const showDiffModal = () => {
    setIsDiffModalOpen(true);
  };

  const closeDiffModal = () => {
    setIsDiffModalOpen(false);
  };

  const handlePlainJsonChange = (updatedData: JsonData) => {
    setPlainJson(updatedData);
  };

  return (
    <div className="container mx-auto py-8 max-w-full px-6">

      <Tabs
        value={activeMode}
        onValueChange={handleTabChange}
        className="space-y-6"
      >
        <TabsList className="grid grid-cols-3 w-full md:w-[500px] mb-6 mx-auto">
          <TabsTrigger value="plain-json" className="flex items-center gap-2">
            <FileJson className="h-4 w-4" />
            <span>Plain JSON</span>
          </TabsTrigger>
          <TabsTrigger
            value="schema-validation"
            className="flex items-center gap-2"
          >
            <Code className="h-4 w-4" />
            <span>Schema Validation</span>
          </TabsTrigger>
          <TabsTrigger value="diff" className="flex items-center gap-2">
            <Split className="h-4 w-4" />
            <span>Diff Mode</span>
          </TabsTrigger>
        </TabsList>

        {/* Schema Validation Mode */}
        <TabsContent value="schema-validation" className="space-y-6">
          <SchemaValidationMode
            schema={schema}
            jsonData={jsonData}
            onSchemaChange={handleSchemaChange}
            onJsonDataChange={handleJsonDataChange}
          />
        </TabsContent>

        {/* Diff Mode */}
        <TabsContent value="diff" className="space-y-6">
          <DiffMode
            leftJson={leftJson}
            rightJson={rightJson}
            onLeftJsonChange={handleLeftJsonChange}
            onRightJsonChange={handleRightJsonChange}
            onShowFullscreen={showDiffModal}
          />
        </TabsContent>

        {/* Plain JSON Mode */}
        <TabsContent value="plain-json" className="space-y-6">
          <PlainJsonMode
            plainJson={plainJson}
            onPlainJsonChange={handlePlainJsonChange}
          />
        </TabsContent>
      </Tabs>

      {/* Diff Modal - keeping this for full-screen diff viewing */}
      <DiffModal
        isOpen={isDiffModalOpen}
        onClose={closeDiffModal}
        title="JSON Diff Comparison (Full Screen)"
        original={JSON.stringify(leftJson, null, 2)}
        modified={JSON.stringify(rightJson, null, 2)}
        language="json"
        renderSideBySide={true}
      />
    </div>
  );
};

export default JsonToolsPage;
