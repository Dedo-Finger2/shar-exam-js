import { DivQuestionAlternatives, DivQuestionAlternativesContainer } from "./../../components/exam.js";

function handleSelectAlternative(e) {
  const alternativeClicked = e.target;
  const previousSelectedAlternatives = document.querySelectorAll(".selected-alternative");
  for (const alternative of previousSelectedAlternatives) {
    if (alternative) {
      alternative.classList.remove("selected-alternative");
      alternative.style.border = "1px solid var(--dark-border)";
    }
  }
  alternativeClicked.classList.add("selected-alternative");
  alternativeClicked.style.border = "1px solid white";
  console.log(DivQuestionAlternatives);
}

DivQuestionAlternatives.forEach((alternative) => {
  alternative.addEventListener('click', handleSelectAlternative);
});

