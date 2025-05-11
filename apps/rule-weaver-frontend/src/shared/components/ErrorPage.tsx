import React from "react";
import { AlertCircle, ArrowLeft, Home } from "lucide-react";
import { Button } from "./inputs/button";

interface ErrorPageProps {
  title?: string;
  message?: string;
  navigateBackLabel?: string;
  navigateHomeLabel?: string;
  onNavigateBack?: () => void;
  onNavigateHome?: () => void;
  illustration?: React.ReactNode;
}

const ErrorPage: React.FC<ErrorPageProps> = ({
  title = "An error occurred",
  message = "We couldn't complete your request. Please try again later.",
  navigateBackLabel = "Go Back",
  navigateHomeLabel = "Go Home",
  onNavigateBack,
  onNavigateHome,
  illustration,
}) => {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-background-secondary shadow-md rounded-xl p-8 md:p-12 border border-border-primary">
          {illustration || (
            <div className="inline-flex items-center justify-center p-4 bg-red-50 rounded-full mb-6">
              <AlertCircle className="h-12 w-12 text-destructive" />
            </div>
          )}

          <h1 className="text-2xl md:text-3xl font-bold text-text-secondary mb-4">
            {title}
          </h1>

          <p className="text-text-primary mb-8 text-base md:text-lg">
            {message}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {onNavigateBack && (
              <Button
                variant="outline"
                onClick={onNavigateBack}
                className="flex items-center justify-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {navigateBackLabel}
              </Button>
            )}

            {onNavigateHome && (
              <Button
                onClick={onNavigateHome}
                className="flex items-center justify-center bg-background-dark text-white hover:bg-background-dark/90"
              >
                <Home className="h-4 w-4 mr-2" />
                {navigateHomeLabel}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
