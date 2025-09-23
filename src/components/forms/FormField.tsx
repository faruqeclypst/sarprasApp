import { ReactNode } from "react";
import { FieldError } from "react-hook-form";

import { Label } from "../ui/label";

interface FormFieldProps {
  id: string;
  label: string;
  error?: FieldError;
  children: ReactNode;
  description?: string;
}

const FormField = ({ id, label, error, description, children }: FormFieldProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>{label}</Label>
        {description ? <span className="text-xs text-muted-foreground">{description}</span> : null}
      </div>
      {children}
      {error ? <p className="text-xs font-medium text-destructive">{error.message}</p> : null}
    </div>
  );
};

export default FormField;
