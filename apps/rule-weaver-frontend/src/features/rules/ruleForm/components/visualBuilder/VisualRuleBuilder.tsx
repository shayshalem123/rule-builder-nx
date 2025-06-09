import React, { useState } from 'react';
import { FormikProps } from 'formik';
import { RuleFormValues } from '../../hooks/useRuleForm';
import { RuleFormFields } from './formFields/RuleFormFields';
import { RuleType } from '@/features/rules/types/rule';
import FullScreenRuleLogicModal from './ruleLogic/fullscreen/FullScreenRuleLogicModal';
import { RuleLogicBuilder } from './ruleLogic/RuleLogicBuilder';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/inputs/card';

interface VisualRuleBuilderProps {
  formik: FormikProps<RuleFormValues>;
  ruleLogic: RuleType;
  handleRuleLogicChange: (rule: RuleType) => void;
  category: string;
}

export const VisualRuleBuilder: React.FC<VisualRuleBuilderProps> = ({
  formik,
  ruleLogic,
  handleRuleLogicChange,
  category,
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  return (
    <>
      <div className="space-y-6">
        <Card className="border-border-primary bg-background-primary">
          <CardHeader>
            <CardTitle className="text-lg">Rule Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <RuleFormFields formik={formik} />
          </CardContent>
        </Card>

        <Card className="border-border-primary bg-background-primary">
          <CardContent className="p-6">
            <RuleLogicBuilder
              ruleLogic={ruleLogic}
              handleRuleLogicChange={handleRuleLogicChange}
              category={category}
              isFullScreen={isFullScreen}
              onFullScreenChange={setIsFullScreen}
            />
          </CardContent>
        </Card>
      </div>

      {isFullScreen && (
        <FullScreenRuleLogicModal
          isOpen={isFullScreen}
          onClose={() => setIsFullScreen(false)}
          ruleLogic={ruleLogic}
          handleRuleLogicChange={handleRuleLogicChange}
          category={category}
        />
      )}
    </>
  );
};
