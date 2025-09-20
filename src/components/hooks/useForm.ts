import type { ChangeEvent, FormEvent } from "react";
import { useCallback, useEffect, useState } from "react";

type FormElement =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement;

export interface UseFormProps<T extends Record<string, unknown>> {
  initialData?: T;
  isOpen: boolean;
  onSubmit?: (data: T) => void;
  validate?: (data: T) => Partial<Record<keyof T, string>>;
}

export const useForm = <T extends Record<string, unknown>>({
  initialData,
  isOpen,
  onSubmit,
  validate,
}: UseFormProps<T>) => {
  const [formData, setFormData] = useState<T>(initialData || ({} as T));
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData || ({} as T));
      setErrors({});
    }
  }, [initialData, isOpen]);

  const handleChange = useCallback((event: ChangeEvent<FormElement>) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const runValidation = useCallback(
    (data: T) => {
      if (!validate) return {};
      return validate(data);
    },
    [validate]
  );

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const validationResult = runValidation(formData);

      if (Object.keys(validationResult).length > 0) {
        setErrors(validationResult);
        return;
      }

      setErrors({});
      onSubmit?.(formData);
    },
    [formData, onSubmit, runValidation]
  );

  const resetForm = useCallback(() => {
    setFormData(initialData || ({} as T));
    setErrors({});
  }, [initialData]);

  return {
    formData,
    errors,
    handleChange,
    handleSubmit,
    resetForm,
    setErrors,
    setFormData,
  } as const;
};
