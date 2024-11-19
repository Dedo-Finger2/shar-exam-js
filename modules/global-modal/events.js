import {
  DialogGlobalModal,
  ButtonGlobalModalClose,
  ButtonGlobalModalConfirm,
} from "./../../components/global-modal.js";

ButtonGlobalModalClose.addEventListener("click", () => DialogGlobalModal.close());

ButtonGlobalModalConfirm.addEventListener("click", () => {
  const modalAction = DialogGlobalModal.getAttribute("action").toUpperCase();
  switch (modalAction) {
    case "CONFIRM-QUESTION-ANSWER": handleUserAnswer(); break
    case "CANCEL-CURRENT-EXAM": handleCancelCurrentExam(); break
    case "DO-ANOTHER-EXAM": handleDoAnotherExam(); break
  }
  DialogGlobalModal.close();
});
