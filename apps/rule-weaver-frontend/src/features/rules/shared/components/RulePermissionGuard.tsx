import React from 'react';
import { RuleWithMeta, PermittedAction } from '@/features/rules/types/rule';
import { PermissionGuard } from '@/shared/components/PermissionGuard';
import ErrorPage from '@/shared/components/ErrorPage';
import { Button } from '@/shared/components/inputs/button';
import { ArrowLeft, Loader2 } from 'lucide-react';

interface RulePermissionGuardProps {
  children: React.ReactNode;
  rule?: RuleWithMeta;
  isLoading?: boolean;
  error?: Error | null;
  requiredActions: PermittedAction[];
  errorTitle?: string;
  errorMessage: string;
  navigateBackLabel?: string;
  onNavigateBack: () => void;
  loadingTitle?: string;
  showBackButton?: boolean;
}

export const RulePermissionGuard: React.FC<RulePermissionGuardProps> = ({
  children,
  rule,
  isLoading = false,
  error = null,
  requiredActions,
  errorTitle,
  errorMessage,
  navigateBackLabel = 'Back to Rules',
  onNavigateBack,
  loadingTitle = 'Loading...',
  showBackButton = true,
}) => {
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        {showBackButton && (
          <div className="mb-6">
            <Button variant="ghost" onClick={onNavigateBack} className="mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {navigateBackLabel}
            </Button>
            <h1 className="text-2xl font-bold">{loadingTitle}</h1>
          </div>
        )}
        <div className="flex flex-col items-center justify-center h-64 bg-background-secondary p-6 rounded-lg shadow-sm">
          <Loader2 className="h-10 w-10 animate-spin text-text-muted mb-4" />
          <p className="text-text-primary">Loading rule information...</p>
        </div>
      </div>
    );
  }

  if (error || !rule) {
    return (
      <ErrorPage
        title="Unable to load rule"
        message={
          error?.message ||
          'The rule could not be found or accessed. Please try again or navigate back to the rules page.'
        }
        navigateBackLabel={navigateBackLabel}
        onNavigateBack={onNavigateBack}
      />
    );
  }

  return (
    <PermissionGuard
      permittedActions={rule.permittedActions}
      requiredActions={requiredActions}
      errorTitle={errorTitle}
      errorMessage={errorMessage}
      navigateBackLabel={navigateBackLabel}
      onNavigateBack={onNavigateBack}
    >
      {children}
    </PermissionGuard>
  );
};
