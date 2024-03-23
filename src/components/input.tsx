// import { useEffect } from "react";

export interface InputProps {
  label?: string;
  className?: string;
  name?: string;
  labelClass?: string;
  type?: React.HTMLInputTypeAttribute;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  containerClass?: string;
  placeholder?: string;
  labelAction?: React.ReactNode;
  required?: boolean;
  error?: string;
  onBlur?: (e: React.FocusEvent) => void;
  formikTouched?: any;
  textArea?: boolean;
  isTouched?: boolean;
  disabled?: boolean;
}
export function Input({
  className,
  label,
  name,
  labelClass,
  type,
  value,
  onChange,
  onBlur,
  containerClass,
  labelAction,
  placeholder,
  required,
  error,
  disabled,
  formikTouched,
  isTouched,
  textArea = false,
}: InputProps) {
  // useEffect({},[disabled])
  return (
    <div className={`${containerClass}`}>
      {label && (
        <div className="flex justify-between">
          <span
            className={`${
              labelClass || ""
            } text-black/70 font-semibold text-sm`}
          >
            <label htmlFor={name}>{label}</label>
            {required && "*"}
          </span>
          {labelAction}
        </div>
      )}
      {!textArea ? (
        <input
          type={type}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onBlur={(e) => {
            onBlur && onBlur(e);
            formikTouched && formikTouched(name, true);
          }}
          // onFocus={() => formikTouched && formikTouched(name, true)}
          className={`bg-bdr rounded-lg text-black/70 w-full p-1 outline-primary/50 text-lg ${className} ${
            disabled && "cursor-not-allowed"
          }`}
          disabled={disabled}
        />
      ) : (
        <textarea
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange as any}
          onBlur={(e) => {
            onBlur && onBlur(e);
            formikTouched && formikTouched(name, true);
          }}
          // onFocus={() => formikTouched && formikTouched(name, true)}
          className={`bg-bdr rounded-lg resize-none no-scrollbar text-black/70 w-full p-1 outline-primary/50 text-lg ${className} ${
            disabled && "cursor-not-allowed"
          }`}
          rows={7}
          disabled={disabled}
        ></textarea>
      )}
      {error && isTouched && (
        <div className="text-sm text-red-500">{error}</div>
      )}
    </div>
  );
}
