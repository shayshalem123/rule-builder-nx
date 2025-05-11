import React from "react";
import { UserRound } from "lucide-react";
import { useUser } from "@/features/users/contexts/UserContext";
import { Avatar, AvatarFallback } from "@/shared/components/inputs/avatar";

const UserMenu: React.FC = () => {
  const { currentUser, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-border-primary animate-pulse"></div>
        <div className="h-4 w-20 bg-border-primary animate-pulse"></div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-8 w-8">
        <AvatarFallback className="bg-user-icon-background text-white flex items-center justify-center">
          <UserRound className="h-5 w-5" />
        </AvatarFallback>
      </Avatar>
      <span className="text-sm font-medium">{currentUser.name}</span>
    </div>
  );
};

export default UserMenu;
