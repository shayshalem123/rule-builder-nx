import React from "react";
import { useParams } from "react-router-dom";
import RuleBuilder from "./components/RuleBuilder";
import { useCategoriesDestinations } from "../hooks/useCategoriesDestinations";
import { RuleFormProvider } from "./contexts/RuleFormContext";
import { useRuleDetails } from "../ruleDetails/hooks/useRuleDetails";
import ErrorPage from "@/shared/components/ErrorPage";
import { useNavigate } from "react-router-dom";

interface RulePageProps {
  mode: "create" | "edit";
}

export const RulePage: React.FC<RulePageProps> = ({ mode }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: rule, isLoading: isLoadingRule, error } = useRuleDetails(id);

  if (mode === "edit" && error) {
    return (
      <ErrorPage
        title="Unable to load rule"
        message="The rule could not be found or accessed. Please try again or navigate back to the rules page."
        navigateBackLabel="Back to Rules"
        onNavigateBack={() => navigate("/rules")}
      />
    );
  }

  return (
    <RuleFormProvider initialRule={rule} mode={mode} ruleId={id}>
      <RulePageContent isLoadingRule={isLoadingRule} />
    </RuleFormProvider>
  );
};

interface RulePageContentProps {
  isLoadingRule: boolean;
}

const RulePageContent: React.FC<RulePageContentProps> = ({ isLoadingRule }) => {
  const { isLoading: isLoadingCategoriesDestinations } =
    useCategoriesDestinations();

  const isLoading = isLoadingRule || isLoadingCategoriesDestinations;

  if (isLoading) {
    return (
      <RulePageContainer>
        <div className="animate-pulse p-6 bg-background-secondary rounded-lg shadow-sm border">
          <div className="h-8 bg-border-primary rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            <div className="h-10 bg-border-primary rounded"></div>
            <div className="h-24 bg-border-primary rounded"></div>
            <div className="h-64 bg-border-primary rounded"></div>
          </div>
        </div>
      </RulePageContainer>
    );
  }

  return (
    <RulePageContainer>
      <RuleBuilder />
    </RulePageContainer>
  );
};

const RulePageContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="container mx-auto px-4 py-8">
    <div className="max-w-8xl mx-auto">{children}</div>
  </div>
);
