import { useCallback, useId, useMemo } from "react";
import { useForm } from "./hooks/useForm";
import { cn } from "../utils/cn";

export interface FormValues extends Record<string, unknown> {
  email: string;
  experience: string;
  github?: string;
  name: string;
}

interface FormProps {
  description: string;
  describedBy: string;
  initialValues?: Partial<FormValues>;
  isOpen: boolean;
  labelledBy: string;
  onCancel: () => void;
  onSubmit: (values: FormValues) => void;
  title: string;
}

export const Form = ({
  description,
  describedBy,
  initialValues,
  isOpen,
  labelledBy,
  onCancel,
  onSubmit,
  title,
}: FormProps) => {
  const nameFieldId = useId();
  const emailFieldId = useId();
  const experienceFieldId = useId();
  const githubFieldId = useId();
  const errorSummaryId = useId();

  const resolvedInitialValues = useMemo<FormValues>(
    () => ({
      email: initialValues?.email ?? "",
      experience: initialValues?.experience ?? "",
      github: initialValues?.github ?? "",
      name: initialValues?.name ?? "",
    }),
    [initialValues]
  );

  const { formData, errors, handleChange, handleSubmit, resetForm } =
    useForm<FormValues>({
      initialData: resolvedInitialValues,
      isOpen,
      onSubmit,
      validate: (values) => {
        const fieldErrors: Partial<Record<keyof FormValues, string>> = {};

        if (!values.name?.trim()) {
          fieldErrors.name = "이름을 입력해주세요.";
        }

        if (!values.email?.trim()) {
          fieldErrors.email = "이메일을 입력해주세요.";
        } else {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(values.email)) {
            fieldErrors.email = "올바른 이메일 형식을 입력해주세요.";
          }
        }

        if (!values.experience?.trim()) {
          fieldErrors.experience = "FE 연차를 선택해주세요.";
        }

        if (values.github?.trim()) {
          try {
            // eslint-disable-next-line no-new
            new URL(values.github);
          } catch (_error) {
            fieldErrors.github = "올바른 GitHub 링크를 입력해주세요.";
          }
        }

        return fieldErrors;
      },
    });

  const handleCancelClick = useCallback(() => {
    resetForm();
    onCancel();
  }, [onCancel, resetForm]);

  const renderFieldError = (id: string, message?: string) => {
    if (!message) {
      return null;
    }

    return (
      <p className="mt-1 text-sm font-medium text-red-600" id={id} role="alert">
        {message}
      </p>
    );
  };

  const describedByValue = [describedBy, errorSummaryId]
    .filter(Boolean)
    .join(" ");

  return (
    <form
      aria-describedby={describedByValue}
      className="flex w-full flex-col gap-6"
      method="dialog"
      onSubmit={handleSubmit}
    >
      <header className="space-y-3 text-center sm:text-left">
        <h2 className="text-2xl font-semibold text-slate-900" id={labelledBy} tabIndex={-1}>
          {title}
        </h2>
        <p className="text-sm leading-relaxed text-slate-600" id={describedBy}>
          {description}
        </p>
      </header>

      <div aria-live="assertive" className="sr-only" id={errorSummaryId} />

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700" htmlFor={nameFieldId}>
            이름
          </label>
          <input
            aria-describedby={errors.name ? `${nameFieldId}-error` : undefined}
            aria-invalid={Boolean(errors.name)}
            className={cn(
              "form-field-input",
              errors.name && "form-field-input-error"
            )}
            id={nameFieldId}
            name="name"
            onChange={handleChange}
            type="text"
            value={formData.name}
          />
          {renderFieldError(`${nameFieldId}-error`, errors.name)}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700" htmlFor={emailFieldId}>
            이메일
          </label>
          <input
            aria-describedby={errors.email ? `${emailFieldId}-error` : undefined}
            aria-invalid={Boolean(errors.email)}
            className={cn(
              "form-field-input",
              errors.email && "form-field-input-error"
            )}
            id={emailFieldId}
            name="email"
            onChange={handleChange}
            type="email"
            value={formData.email}
          />
          {renderFieldError(`${emailFieldId}-error`, errors.email)}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700" htmlFor={experienceFieldId}>
            FE 연차
          </label>
          <select
            aria-describedby={
              errors.experience ? `${experienceFieldId}-error` : undefined
            }
            aria-invalid={Boolean(errors.experience)}
            className={cn(
              "form-field-input cursor-pointer appearance-none pr-8",
              errors.experience && "form-field-input-error"
            )}
            id={experienceFieldId}
            name="experience"
            onChange={handleChange}
            value={formData.experience}
          >
            <option value="">FE 연차를 선택해주세요</option>
            <option value="0-1">0-1년차</option>
            <option value="1-3">1-3년차</option>
            <option value="3-5">3-5년차</option>
            <option value="5+">5년 이상</option>
          </select>
          {renderFieldError(`${experienceFieldId}-error`, errors.experience)}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700" htmlFor={githubFieldId}>
            GitHub 링크 (선택)
          </label>
          <input
            aria-describedby={
              errors.github ? `${githubFieldId}-error` : undefined
            }
            aria-invalid={Boolean(errors.github)}
            className={cn(
              "form-field-input",
              errors.github && "form-field-input-error"
            )}
            id={githubFieldId}
            name="github"
            onChange={handleChange}
            placeholder="https://github.com/username"
            type="url"
            value={formData.github}
          />
          {renderFieldError(`${githubFieldId}-error`, errors.github)}
        </div>
      </div>

      <footer className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">
        <button
          className="btn-primary px-5 py-2.5 text-sm"
          type="submit"
        >
          제출하기
        </button>
        <button
          className="btn-secondary px-5 py-2.5 text-sm"
          onClick={handleCancelClick}
          type="button"
        >
          취소하기
        </button>
      </footer>
    </form>
  );
};
