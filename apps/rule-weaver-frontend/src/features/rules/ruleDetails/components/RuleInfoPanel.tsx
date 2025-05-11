import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/inputs/button";
import {
  Calendar,
  MapPin,
  Tag,
  User,
  FileJson,
  ExternalLink,
} from "lucide-react";
import { Rule, RuleWithMeta } from "@/features/rules/types/rule";
import { SchemaWithMeta } from "@/features/schemas/types/schema";

interface RuleInfoPanelProps {
  rule: Rule | RuleWithMeta;
  ruleId: string;
  schema?: SchemaWithMeta;
}

const RuleInfoPanel: React.FC<RuleInfoPanelProps> = ({
  rule,
  ruleId,
  schema,
}) => {
  const navigate = useNavigate();

  // Navigate to the schema details page for the current rule's category
  const navigateToSchema = () => {
    if (schema?.id) {
      const returnPath = encodeURIComponent(`/rules/${ruleId}`);
      navigate(`/schemas/${schema.id}?returnTo=${returnPath}`);
    }
  };

  // Check if the rule has meta information (createdBy, createdAt, etc.)
  const ruleWithMeta = rule as RuleWithMeta;
  const hasMeta = !!(
    ruleWithMeta.createdBy ||
    ruleWithMeta.createdAt ||
    ruleWithMeta.updatedAt
  );

  return (
    <div className="bg-background-secondary p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Rule Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rule.description && (
          <div className="col-span-full">
            <h3 className="text-sm font-medium text-text-primary">
              Description
            </h3>
            <p className="mt-1 text-sm text-text-secondary">
              {rule.description}
            </p>
          </div>
        )}

        <div>
          <h3 className="text-sm font-medium text-text-primary">Destination</h3>
          <div className="mt-1 flex items-center gap-1">
            <MapPin className="h-4 w-4 text-warning" />
            <span className="text-sm text-text-secondary">
              Destination {rule.destination}
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-text-primary">Category</h3>
          <div className="mt-1 flex items-center gap-1">
            <Tag className="h-4 w-4 text-success" />
            <span className="text-sm text-text-secondary">{rule.category}</span>
          </div>
        </div>

        {schema && (
          <div>
            <h3 className="text-sm font-medium text-text-primary">Schema</h3>
            <div className="mt-1 flex items-center gap-1">
              <FileJson className="h-4 w-4 text-info" />
              <Button
                variant="link"
                className="p-0 h-auto text-sm text-info hover:text-info flex items-center gap-1"
                onClick={navigateToSchema}
              >
                {schema.name}
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}

        {hasMeta && ruleWithMeta.createdBy && (
          <div>
            <h3 className="text-sm font-medium text-text-primary">
              Created By
            </h3>
            <div className="mt-1 flex items-center gap-1">
              <User className="h-4 w-4 text-text-primary" />
              <span className="text-sm text-text-secondary">
                {ruleWithMeta.createdBy.name}
              </span>
            </div>
          </div>
        )}

        {hasMeta && ruleWithMeta.createdAt && (
          <div>
            <h3 className="text-sm font-medium text-text-primary">
              Created At
            </h3>
            <div className="mt-1 flex items-center gap-1">
              <Calendar className="h-4 w-4 text-text-primary" />
              <span className="text-sm text-text-secondary">
                {new Date(ruleWithMeta.createdAt).toLocaleDateString(
                  undefined,
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </span>
            </div>
          </div>
        )}

        {hasMeta && ruleWithMeta.updatedAt && (
          <div>
            <h3 className="text-sm font-medium text-text-primary">
              Last Updated
            </h3>
            <div className="mt-1 flex items-center gap-1">
              <Calendar className="h-4 w-4 text-text-primary" />
              <span className="text-sm text-text-secondary">
                {new Date(ruleWithMeta.updatedAt).toLocaleDateString(
                  undefined,
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RuleInfoPanel;
