import { useEffect, useId, useRef } from "react";
import { Dialog } from "./Dialog";
import { Form, type FormValues } from "./Form";

interface FormModalOverlayProps {
  closeOverlay: (result: FormValues | null) => void;
  description: string;
  initialValues: FormValues;
  isOpen: boolean;
  restoreFocusTo: HTMLElement | null;
  title: string;
  unmountOverlay: () => void;
}

const restoreFocus = (element: HTMLElement | null) => {
  if (!element) {
    return;
  }

  requestAnimationFrame(() => {
    if (document.contains(element)) {
      element.focus();
    }
  });
};

export const FormModalOverlay = ({
  closeOverlay,
  description,
  initialValues,
  isOpen,
  restoreFocusTo,
  title,
  unmountOverlay,
}: FormModalOverlayProps) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();
  const pendingResultRef = useRef<FormValues | null>(null);
  const closeReasonRef = useRef<"submit" | "cancel" | null>(null);

  useEffect(() => {
    if (!isOpen || typeof document === "undefined") {
      return;
    }

    const { body } = document;
    const previousOverflow = body.style.overflow;

    body.style.overflow = "hidden";

    return () => {
      body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const focusTitle = () => {
      document.getElementById(titleId)?.focus();
    };

    requestAnimationFrame(focusTitle);
  }, [isOpen, titleId]);

  const handleSubmit = (values: FormValues) => {
    pendingResultRef.current = values;
    closeReasonRef.current = "submit";
    dialogRef.current?.close("submit");
  };

  const handleCancel = () => {
    pendingResultRef.current = null;
    closeReasonRef.current = "cancel";
    dialogRef.current?.close("cancel");
  };

  const handleDialogClose = () => {
    const shouldResolve = closeReasonRef.current === "submit" && pendingResultRef.current;
    const result = shouldResolve ? pendingResultRef.current : null;

    closeOverlay(result ?? null);
    pendingResultRef.current = null;
    closeReasonRef.current = null;

    restoreFocus(restoreFocusTo);
    unmountOverlay();
  };

  return (
    <Dialog
      describedBy={descriptionId}
      dialogRef={dialogRef}
      isOpen={isOpen}
      labelledBy={titleId}
      onClose={handleDialogClose}
    >
      <Form
        description={description}
        describedBy={descriptionId}
        initialValues={initialValues}
        isOpen={isOpen}
        labelledBy={titleId}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        title={title}
      />
    </Dialog>
  );
};
