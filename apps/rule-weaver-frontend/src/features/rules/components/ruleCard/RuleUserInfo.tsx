import React from "react";
import { formatDistanceToNow } from "date-fns";
import { Clock, User } from "lucide-react";

interface UserInfo {
  id: string;
  name: string;
}

interface RuleUserInfoProps {
  createdBy?: UserInfo;
  updatedBy?: UserInfo;
  updatedAt?: string;
}

const RuleUserInfo: React.FC<RuleUserInfoProps> = ({
  createdBy,
  updatedBy,
  updatedAt,
}) => {
  const getUpdatedTime = () => {
    if (!updatedAt) return null;
    try {
      return formatDistanceToNow(new Date(updatedAt), { addSuffix: true });
    } catch (e) {
      return null;
    }
  };

  const formattedTime = getUpdatedTime();

  return (
    <div className="text-xs text-gray-500 space-y-1">
      {createdBy && (
        <div className="flex items-center gap-1">
          <User className="h-3 w-3" />
          Created by {createdBy.name}
        </div>
      )}
      {formattedTime && (
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Updated {formattedTime}
          {updatedBy && ` by ${updatedBy.name}`}
        </div>
      )}
    </div>
  );
};

export default RuleUserInfo;
