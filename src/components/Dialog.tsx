import type { ReactNode, Ref } from "react";
import { useEffect, useRef } from "react";
import { mergeRefs } from "../utils/mergeRefs";
import { cn } from "../utils/cn";

interface DialogProps {
  children: ReactNode;
  describedBy: string;
  className?: string;
  dialogRef?: Ref<HTMLDialogElement>;
  isOpen: boolean;
  labelledBy: string;
  onClose: () => void;
}

export const Dialog = ({
  children,
  describedBy,
  className,
  dialogRef,
  isOpen,
  labelledBy,
  onClose,
}: DialogProps) => {
  const localRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const dialog = localRef.current;

    if (!dialog) {
      return;
    }

    if (isOpen && !dialog.open) {
      dialog.showModal();
      return;
    }

    if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const dialog = localRef.current;

    if (!dialog) {
      return;
    }

    const handleClose = () => {
      onClose();
    };

    const handleBackdropClick = (event: MouseEvent) => {
      if (event.target !== dialog) {
        return;
      }

      dialog.close();
    };

    dialog.addEventListener("close", handleClose);
    dialog.addEventListener("click", handleBackdropClick);

    return () => {
      dialog.removeEventListener("close", handleClose);
      dialog.removeEventListener("click", handleBackdropClick);
    };
  }, [onClose]);

  return (
    <dialog
      aria-describedby={describedBy}
      aria-labelledby={labelledBy}
      aria-modal="true"
      className={cn(
        "m-auto min-w-md max-w-2xl overflow-y-auto overscroll-contain rounded-3xl border border-slate-200/80 bg-white p-6 text-slate-900 shadow-2xl sm:p-8",
        "focus-visible:outline-none",
        className
      )}
      ref={mergeRefs(localRef, dialogRef ?? null)}
    >
      {children}
    </dialog>
  );
};
