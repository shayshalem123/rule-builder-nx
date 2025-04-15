
import React from 'react';
import { RuleWithMeta } from '@/types/rule';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { isBaseRule, isAndRule, isOrRule } from '@/utils/ruleUtils';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface RuleCardProps {
  rule: RuleWithMeta;
  onEdit: () => void;
  onDelete: () => void;
}

const RuleCard: React.FC<RuleCardProps> = ({ rule, onEdit, onDelete }) => {
  const getRuleTypeBadge = () => {
    if (isBaseRule(rule)) {
      return <Badge variant="outline" className="bg-gray-100">Simple Rule</Badge>;
    } else if (isAndRule(rule)) {
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">AND Rule</Badge>;
    } else if (isOrRule(rule)) {
      return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">OR Rule</Badge>;
    }
    return null;
  };

  const getUpdatedTime = () => {
    if (!rule.updatedAt) return null;
    try {
      return formatDistanceToNow(new Date(rule.updatedAt), { addSuffix: true });
    } catch (e) {
      return null;
    }
  };
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold text-gray-800 line-clamp-1">{rule.name}</CardTitle>
          {getRuleTypeBadge()}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        {rule.description && (
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{rule.description}</p>
        )}
        <div className="text-xs text-gray-500">
          {getUpdatedTime() && `Updated ${getUpdatedTime()}`}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-2">
        <Button variant="ghost" size="sm" onClick={onEdit} className="h-8">
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
        <Button variant="ghost" size="sm" onClick={onDelete} className="h-8 text-red-500 hover:text-red-700 hover:bg-red-50">
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RuleCard;
