import React, { useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useRuleDetails } from "./hooks/useRuleDetails";
import { Button } from "@/shared/components/inputs/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import RuleViewer from "./components/ruleViewer/RuleViewer";
import ExtraPropertiesPanel from "./components/ExtraPropertiesPanel";
import RuleInfoPanel from "./components/RuleInfoPanel";
import { useSchemaByCategory } from "@/features/schemas/hooks/useSchemas";

const RuleDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get("returnTo");

  // Fetch rule data
  const {
    data: rule,
    isLoading: isRuleLoading,
    error: ruleError,
  } = useRuleDetails(id || "");

  // Fetch schema data if rule is loaded
  const {
    schema,
    isLoading: isSchemaLoading,
    error: schemaError,
  } = useSchemaByCategory(rule?.category || "");

  // Determine if page is loading
  const isPageLoading = useMemo(() => {
    if (isRuleLoading) return true;

    if (!rule) return false;

    return rule.category && isSchemaLoading;
  }, [rule, isRuleLoading, isSchemaLoading]);

  // Determine if there's an error
  const error = ruleError || (rule?.category ? schemaError : null);

  const handleReturn = () => {
    if (returnTo) {
      navigate(decodeURIComponent(returnTo));
    } else {
      navigate("/rules");
    }
  };

  if (isPageLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Button variant="ghost" onClick={handleReturn} className="mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {returnTo ? "Return Back" : "Back to Rules"}
          </Button>
          <h1 className="text-2xl font-bold">Rule Details</h1>
        </div>
        <div className="flex flex-col items-center justify-center h-64 bg-background-secondary p-6 rounded-lg shadow-sm">
          <Loader2 className="h-10 w-10 animate-spin text-text-muted mb-4" />
          <p className="text-text-primary">
            {isRuleLoading
              ? "Loading rule information..."
              : "Loading schema information..."}
          </p>
        </div>
      </div>
    );
  }

  if (error || !rule) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Button variant="ghost" onClick={handleReturn} className="mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {returnTo ? "Return Back" : "Back to Rules"}
          </Button>
          <h1 className="text-2xl font-bold">Rule Details</h1>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          {error instanceof Error
            ? error.message
            : "Rule or schema information could not be loaded."}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Button variant="ghost" onClick={handleReturn} className="mb-2">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {returnTo ? "Return Back" : "Back to Rules"}
        </Button>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{rule.name}</h1>
          <Button onClick={() => navigate(`/rules/edit/${id}`)}>
            Edit Rule
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <RuleInfoPanel rule={rule} ruleId={id || ""} schema={schema} />

        {rule.extraProperties &&
          Object.keys(rule.extraProperties).length > 0 && (
            <ExtraPropertiesPanel properties={rule.extraProperties} />
          )}

        <div className="bg-background-secondary p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Rule Logic</h2>
          <RuleViewer rule={rule.rule} />
        </div>
      </div>
    </div>
  );
};

export default RuleDetailsPage;
