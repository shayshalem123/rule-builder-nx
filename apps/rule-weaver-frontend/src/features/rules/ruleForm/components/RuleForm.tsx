import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/shared/components/inputs/tabs';
import { FormControls } from './formControls/FormControls';
import RuleJsonEditor from './jsonEditor/RuleJsonEditor';
import RuleTestSimulator from './testSimulator/RuleTestSimulator';
import { VisualRuleBuilder } from './visualBuilder/VisualRuleBuilder';
import { TestFormData } from './testSimulator/components/AddTestForm';
import { TestCase } from './testSimulator/types';
import { DEFAULT_TEST_METADATA, RuleWithMeta } from '../../types/rule';
import { useRuleForm } from '../hooks';
import { createRuleObjectFromValues } from '../../shared';
import { useState, useEffect } from 'react';
import { useRuleContext } from '../contexts/RuleFormContext';
import { Button } from '@/shared/components/inputs/button';
import { DatabaseIcon } from 'lucide-react';
import ImpactAnalysisModal from './ImpactAnalysisModal';
import { RuleFormValues } from '../hooks/useRuleForm';
import { CategoryProvider } from '../contexts/CategoryContext';
import { DestinationProvider } from '../contexts/DestinationContext';

export type TabId = 'visual' | 'json' | 'test';

interface RuleBuilderProps {
  activeTab: TabId;
  onCancel: () => void;
  setActiveTab: (tab: TabId) => void;
  onFormValuesChange?: (values: RuleFormValues) => void;
  previewRule?: RuleWithMeta;
}

export const RuleForm: React.FC<RuleBuilderProps> = ({
  activeTab,
  onCancel,
  setActiveTab,
  onFormValuesChange,
  previewRule,
}) => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isImpactModalOpen, setIsImpactModalOpen] = useState(false);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [currentTestForm, setCurrentTestForm] = useState<TestFormData>({
    metadata: DEFAULT_TEST_METADATA,
    expectedResult: true,
    name: '',
  });

  const { onSave, initialRule } = useRuleContext();

  const { formik, schemaDefinition, updateRuleLogic } = useRuleForm(
    onSave,
    initialRule
  );

  useEffect(() => {
    if (onFormValuesChange) {
      onFormValuesChange(formik.values);
    }
  }, [formik.values, onFormValuesChange]);

  const showConfirmModal = (e: React.FormEvent) => {
    e.preventDefault();

    if (formik.isValid) {
      setIsConfirmModalOpen(true);
    }
  };

  const closeConfirmModal = () => setIsConfirmModalOpen(false);

  const handleConfirmSave = () => {
    formik.handleSubmit();
    setIsConfirmModalOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
      e.preventDefault();
    }
  };

  const openImpactModal = () => {
    setIsImpactModalOpen(true);
  };

  const closeImpactModal = () => {
    setIsImpactModalOpen(false);
  };

  const currentRule: RuleWithMeta = {
    id: initialRule?.id || '',
    ...(createRuleObjectFromValues(formik.values, initialRule) as RuleWithMeta),
    createdAt: initialRule?.createdAt,
    updatedAt: initialRule?.updatedAt,
    createdBy: initialRule?.createdBy,
    updatedBy: initialRule?.updatedBy,
  };

  const handleReset = () => {
    if (initialRule) {
      formik.resetForm({ values: formik.initialValues });
    } else {
      formik.resetForm();
    }
  };

  const showImpactAnalysis = activeTab === 'visual' || activeTab === 'json';

  return (
    <CategoryProvider initialCategory={formik.values.category}>
      <DestinationProvider initialDestination={formik.values.destination}>
        <div className="flex flex-col h-full relative">
          <ImpactAnalysisModal
            isOpen={isImpactModalOpen}
            onClose={closeImpactModal}
            rule={previewRule}
          />

          <form
            onSubmit={showConfirmModal}
            onKeyDown={handleKeyDown}
            className="flex flex-col h-full"
          >
            <div className="flex-1 overflow-auto">
              <Tabs
                defaultValue="visual"
                value={activeTab}
                onValueChange={(value) => setActiveTab(value as TabId)}
                className="w-full"
              >
                <div className="flex justify-between items-center mb-4 w-full">
                  <TabsList className="grid grid-cols-3 w-[500px]">
                    <TabsTrigger value="visual" className="px-6">
                      <span className="relative">Visual Builder</span>
                    </TabsTrigger>
                    <TabsTrigger value="json" className="px-6">
                      <span className="relative">JSON Editor</span>
                    </TabsTrigger>
                    <TabsTrigger value="test" className="px-6">
                      <span className="relative">Test Simulator</span>
                    </TabsTrigger>
                  </TabsList>

                  {showImpactAnalysis && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={openImpactModal}
                      disabled={!previewRule}
                      className="flex items-center"
                    >
                      <DatabaseIcon className="h-4 w-4 mr-2" />
                      Analyze Rule Impact
                    </Button>
                  )}
                </div>

                <TabsContent value="visual" className="w-full">
                  <VisualRuleBuilder
                    formik={formik}
                    ruleLogic={formik.values.rule}
                    handleRuleLogicChange={updateRuleLogic}
                    category={formik.values.category}
                  />
                </TabsContent>

                <TabsContent value="json" className="w-full">
                  <RuleJsonEditor
                    formik={formik}
                    updateFormik={formik.setValues}
                    schema={schemaDefinition}
                  />
                </TabsContent>

                <TabsContent value="test" className="w-full">
                  <RuleTestSimulator
                    rule={currentRule}
                    testCases={testCases}
                    setTestCases={setTestCases}
                    currentTestForm={currentTestForm}
                    setCurrentTestForm={setCurrentTestForm}
                    schema={schemaDefinition}
                  />
                </TabsContent>
              </Tabs>
            </div>

            {activeTab !== 'test' && (
              <div className="sticky bottom-0 bg-background-secondary border-t border-border-primary py-4 px-6 mt-auto">
                <FormControls
                  onCancel={onCancel}
                  onReset={handleReset}
                  onSubmit={showConfirmModal}
                  formik={formik}
                  isConfirmModalOpen={isConfirmModalOpen}
                  onConfirmModalClose={closeConfirmModal}
                  onConfirmModalConfirm={handleConfirmSave}
                />
              </div>
            )}
          </form>
        </div>
      </DestinationProvider>
    </CategoryProvider>
  );
};
