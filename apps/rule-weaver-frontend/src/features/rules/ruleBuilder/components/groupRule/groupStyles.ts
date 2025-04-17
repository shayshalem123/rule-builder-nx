export const getGroupStyles = (isAnd: boolean) => {
  const groupColor = isAnd
    ? "bg-rule-and/10 border-rule-and/30"
    : "bg-rule-or/10 border-rule-or/30";

  const groupTextColor = isAnd ? "text-rule-and" : "text-rule-or";

  const groupHighlightColor = isAnd
    ? "bg-rule-and/20 hover:bg-rule-and/30"
    : "bg-rule-or/20 hover:bg-rule-or/30";

  return {
    groupColor,
    groupTextColor,
    groupHighlightColor,
  };
};
