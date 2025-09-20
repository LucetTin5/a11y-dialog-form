import { useCallback } from "react";
import { openFormModal } from "./modalManager";
import { cn } from "./utils/cn";

const ModalFormPage = () => {
  const handleOpenModal = useCallback(async () => {
    const result = await openFormModal();

    if (result) {
      console.log("form submitted", result);
    }
  }, []);

  return (
    <main className="page-shell">
      <button
        onClick={handleOpenModal}
        type="button"
        className={cn(
          "btn-primary px-8 py-4 text-lg shadow-lg transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-xl",
          "motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        )}
      >
        제출 폼 열기
      </button>
    </main>
  );
};

export default ModalFormPage;
