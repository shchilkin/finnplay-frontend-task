import { useId, useState } from "react";

import { EyeIcon } from "../../../shared/ui/icons";

type PasswordFieldProps = {
  disabled: boolean;
  onValueChange: (value: string) => void;
  value: string;
};

export function PasswordField({ disabled, onValueChange, value }: PasswordFieldProps) {
  const inputId = useId();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <div className="field" data-filled={value.length > 0}>
      <div className="password-field">
        <label className="field-label" htmlFor={inputId}>
          Password
        </label>
        <input
          id={inputId}
          className="field-input field-input--with-action"
          type={isPasswordVisible ? "text" : "password"}
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          disabled={disabled}
          autoComplete="current-password"
          placeholder="Password"
        />
        <button
          className="password-toggle"
          type="button"
          aria-label={isPasswordVisible ? "Hide password" : "Show password"}
          onClick={() => setIsPasswordVisible((currentValue) => !currentValue)}
          disabled={disabled}
        >
          <EyeIcon />
        </button>
      </div>
    </div>
  );
}
