
import React, { useState } from 'react';
import { RuleType, BaseRule, AndRule, OrRule, RuleWithMeta } from '@/types/rule';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BaseRuleComponent from './BaseRuleComponent';
import GroupRuleComponent from './GroupRuleComponent';
import {
  isBaseRule,
  isAndRule,
  isOrRule,
  createEmptyBaseRule,
  createEmptyAndRule,
  createEmptyOrRule,
} from '@/utils/ruleUtils';

interface RuleBuilderProps {
  initialRule?: RuleWithMeta;
  onSave: (rule: Omit<RuleWithMeta, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const RuleBuilder: React.FC<RuleBuilderProps> = ({
  initialRule,
  onSave,
  onCancel,
  isLoading = false,
}) => {
  const [name, setName] = useState(initialRule?.name || '');
  const [description, setDescription] = useState(initialRule?.description || '');
  
  // Extract the rule logic part (without metadata like name, description)
  const getInitialRuleLogic = (): RuleType => {
    if (!initialRule) return createEmptyBaseRule();
    
    const { name, description, createdAt, updatedAt, ...ruleLogic } = initialRule;
    return ruleLogic as RuleType;
  };
  
  const [rule, setRule] = useState<RuleType>(getInitialRuleLogic());
  
  const handleSave = () => {
    if (!name.trim()) {
      alert('Please provide a name for the rule');
      return;
    }
    
    // Combine the rule logic with metadata
    const fullRule: Omit<RuleWithMeta, 'id' | 'createdAt' | 'updatedAt'> = {
      ...rule,
      name,
      description: description.trim() ? description : undefined,
    };
    
    onSave(fullRule);
  };
  
  const handleRuleTypeChange = (type: 'BASE' | 'AND' | 'OR') => {
    if (type === 'BASE') {
      setRule(createEmptyBaseRule());
    } else if (type === 'AND') {
      setRule(createEmptyAndRule());
    } else if (type === 'OR') {
      setRule(createEmptyOrRule());
    }
  };
  
  // Determine the current rule type for the tabs
  const getCurrentRuleType = (): string => {
    if (isBaseRule(rule)) return 'BASE';
    if (isAndRule(rule)) return 'AND';
    if (isOrRule(rule)) return 'OR';
    return 'BASE';
  };
  
  return (
    <div className="space-y-6 max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-sm border">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {initialRule ? 'Edit Rule' : 'Create New Rule'}
        </h2>
        
        <div className="space-y-3">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Rule Name *
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter a descriptive name for this rule"
              required
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description (optional)
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the purpose of this rule"
              rows={3}
            />
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Rule Configuration</h3>
        
        <Tabs value={getCurrentRuleType()} onValueChange={handleRuleTypeChange as any}>
          <TabsList className="mb-4">
            <TabsTrigger value="BASE">Simple Rule</TabsTrigger>
            <TabsTrigger value="AND">AND Group</TabsTrigger>
            <TabsTrigger value="OR">OR Group</TabsTrigger>
          </TabsList>
          
          <TabsContent value="BASE">
            {isBaseRule(rule) && (
              <BaseRuleComponent
                rule={rule}
                onChange={setRule as (rule: BaseRule) => void}
                showDelete={false}
              />
            )}
          </TabsContent>
          
          <TabsContent value="AND">
            {isAndRule(rule) ? (
              <GroupRuleComponent
                rule={rule}
                onChange={setRule as (rule: AndRule) => void}
              />
            ) : (
              <GroupRuleComponent
                rule={createEmptyAndRule()}
                onChange={setRule as (rule: AndRule) => void}
              />
            )}
          </TabsContent>
          
          <TabsContent value="OR">
            {isOrRule(rule) ? (
              <GroupRuleComponent
                rule={rule}
                onChange={setRule as (rule: OrRule) => void}
              />
            ) : (
              <GroupRuleComponent
                rule={createEmptyOrRule()}
                onChange={setRule as (rule: OrRule) => void}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isLoading || !name.trim()}>
          {isLoading ? 'Saving...' : 'Save Rule'}
        </Button>
      </div>
    </div>
  );
};

export default RuleBuilder;
