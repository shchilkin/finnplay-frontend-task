import { useId } from "react";

type FloatingTextFieldProps = {
  autoComplete: string;
  disabled: boolean;
  label: string;
  onValueChange: (value: string) => void;
  type?: "password" | "text";
  value: string;
};

export function FloatingTextField({
  autoComplete,
  disabled,
  label,
  onValueChange,
  type = "text",
  value,
}: FloatingTextFieldProps) {
  const inputId = useId();

  return (
    <div className="field" data-filled={value.length > 0}>
      <label className="field-label" htmlFor={inputId}>
        {label}
      </label>
      <input
        id={inputId}
        className="field-input"
        type={type}
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        disabled={disabled}
        autoComplete={autoComplete}
        placeholder={label}
      />
    </div>
  );
}
