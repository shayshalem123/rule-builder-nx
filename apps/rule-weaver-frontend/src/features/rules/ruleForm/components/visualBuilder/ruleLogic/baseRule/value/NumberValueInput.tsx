import React from "react";

interface NumberValueInputProps {
  value: number;
  onChange: (value: number) => void;
}

export const NumberValueInput: React.FC<NumberValueInputProps> = ({
  value,
  onChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  return (
    <input
      type="number"
      className="w-full border border-border-primary rounded p-2 text-sm"
      value={value}
      onChange={handleChange}
      placeholder="Enter a number"
    />
  );
};
