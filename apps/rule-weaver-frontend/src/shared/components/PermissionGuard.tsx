import React from 'react';
import { PermittedAction } from '@/features/rules/types/rule';
import ErrorPage from '@/shared/components/ErrorPage';

interface PermissionGuardProps {
  children: React.ReactNode;
  permittedActions?: PermittedAction[];
  requiredActions: PermittedAction[];
  errorTitle?: string;
  errorMessage: string;
  navigateBackLabel?: string;
  onNavigateBack: () => void;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  permittedActions = [],
  requiredActions,
  errorTitle = 'Access Denied',
  errorMessage,
  navigateBackLabel = 'Back',
  onNavigateBack,
}) => {
  const hasPermission = requiredActions.every((action) =>
    permittedActions.includes(action)
  );

  if (!hasPermission) {
    return (
      <ErrorPage
        title={errorTitle}
        message={errorMessage}
        navigateBackLabel={navigateBackLabel}
        onNavigateBack={onNavigateBack}
      />
    );
  }

  return <>{children}</>;
};
