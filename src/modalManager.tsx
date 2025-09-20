import { overlay } from "overlay-kit";
import { FormModalOverlay } from "./components/FormModalOverlay";
import type { FormValues } from "./components/Form";

interface FormModalOptions {
  description?: string;
  initialValues?: Partial<FormValues>;
  title?: string;
}

interface ResolvedFormModalOptions {
  description: string;
  initialValues: FormValues;
  title: string;
}

const defaultFormOptions: ResolvedFormModalOptions = {
  description: "제출 폼 작성하기",
  initialValues: {
    email: "",
    experience: "",
    github: "",
    name: "",
  },
  title: "제출 폼",
};

const resolveFormOptions = (
  options: FormModalOptions = {},
): ResolvedFormModalOptions => ({
  description: options.description ?? defaultFormOptions.description,
  initialValues: {
    ...defaultFormOptions.initialValues,
    ...(options.initialValues ?? {}),
  } as FormValues,
  title: options.title ?? defaultFormOptions.title,
});

const getActiveElement = () =>
  document.activeElement instanceof HTMLElement ? document.activeElement : null;

export const openFormModal = async (
  options: FormModalOptions = {},
): Promise<FormValues | null> => {
  const restoreFocusTo = getActiveElement();
  const resolvedOptions = resolveFormOptions(options);

  return overlay.openAsync<FormValues | null>(({ isOpen, close, unmount }) => (
    <FormModalOverlay
      closeOverlay={(result) => close(result)}
      description={resolvedOptions.description}
      initialValues={resolvedOptions.initialValues}
      isOpen={isOpen}
      restoreFocusTo={restoreFocusTo}
      title={resolvedOptions.title}
      unmountOverlay={unmount}
    />
  ));
};

export type { FormModalOptions };
