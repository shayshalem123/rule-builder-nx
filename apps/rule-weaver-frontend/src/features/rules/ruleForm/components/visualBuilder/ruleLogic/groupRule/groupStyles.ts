export const getGroupStyles = (isAnd: boolean) => {
  const groupColor = isAnd
    ? "bg-rule-and/15 border-rule-and/40"
    : "bg-rule-or/15 border-rule-or/40";

  const groupTextColor = isAnd ? "text-rule-and" : "text-rule-or";

  const groupHighlightColor = isAnd
    ? "bg-rule-and/25 hover:bg-rule-and/35"
    : "bg-rule-or/25 hover:bg-rule-or/35";

  return {
    groupColor,
    groupTextColor,
    groupHighlightColor,
  };
};
