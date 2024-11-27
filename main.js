/** Exam struct type definition
 * @typedef { Object } Exam
 * @property { Array<Question> } questions
 */

/** Correct Answers Template 
 * @typedef { Object } CorrectTemplateAnswer
 * @property { string } title
 * @property { number } option
 */

/** Question type definition
 * @typedef  { Object } Question
 * @property { string } title
 * @property { Array<string> } alternatives
 * @property { number } correctAnswer
 */

import {
  DialogGlobalModal,
  ParagraphGlobalModalTitle,
  ButtonGlobalModalConfirm,
  ButtonGlobalModalClose
} from "./components/global-modal.js";

import {
  MainContainer,
  SectionExamContainer,
  SectionFinalResultContainer
} from "./components/main-containers.js";

import {
  InputExamFile,
  FormExamFileUpload,
  SpanExamFileNamePreview
} from "./components/exam-file-upload.js";

import {
  SpanExamQuestionTitle,
  ButtonExamConfirmQuestionAnswer,
  ButtonCancelCurrentExam
} from "./components/exam.js";

import {
  ButtonDoAnotherExam,
  DivAnswersContainer,
  ParagraphUserFinalPoints
} from "./components/final-result.js";

let userPoints = 0;
/** @type {Exam} */
let globalExam = {}
/** @type {Map<Number, Number>} */
const userAnswers = new Map()
/** @type {Map<Number, CorrectTemplateAnswer>} */
const correctTemplate = new Map()

function main() {
  try {
    validateImportedJsonFormat()

    loadCorrectTemplate()

    loadQuestion()
  } catch (err) {
    alert(err.message)
    console.log(err)
  }
}

function validateImportedJsonFormat() {
  if (globalExam.questions === undefined || globalExam.questions.length === 0) throw new Error("Invalid JSON Format: The exam file must have at least one question.")
  globalExam.questions.forEach((question) => {
    if (question.title === null || question.title === undefined || question.title.trim().length === 0) throw new Error("Invalid JSON Format: All questions must have a title.")
    if (question.alternatives === undefined || question.alternatives === null || question.alternatives.length === 0 || question.alternatives.length < 5) throw new Error("Invalid JSON Format: All questions must have five alternatives.")
    question.alternatives.forEach((alternative) => {
      if (alternative.trim().length === 0) throw new Error("Invalid JSON Format: All alternatives must be writen down.")
    })
    if (question.correctAnswer === undefined || question.correctAnswer === null || question.correctAnswer <= 0) throw new Error("Invalid JSON Format: All questions correct answer's must be a number from 1 to 5.")
  })
}

function loadQuestion() {
  const checkedRadio = document.querySelector("input[name='exam-question-alternative']:checked")
  if (checkedRadio) checkedRadio.checked = false
  let questionNumber = Number(SpanExamQuestionTitle.getAttribute("exam-question-number"))

  if (questionNumber > globalExam.questions.length) {
    loadFinally()
    return
  }

  const currentQuestion = questionNumber - 1

  const questionAlternativesText = document.querySelectorAll(".exam-question-alternative-text")

  SectionExamContainer.classList.remove("hidden")

  SpanExamQuestionTitle.textContent = globalExam.questions[currentQuestion].title

  for (let i = 0; i <= 4; i++) {
    questionAlternativesText[i].textContent = globalExam.questions[currentQuestion].alternatives[i]
  }

  MainContainer.classList.add("hidden")
}

function loadFinally() {
  SectionExamContainer.classList.add("hidden")
  SectionFinalResultContainer.classList.remove("hidden")

  for (let i = 0; i <= globalExam.questions.length - 1; i++) {
    const resultDiv = document.createElement("div")
    resultDiv.classList.add("result")

    const questionNumberSpan = document.createElement("span")
    questionNumberSpan.classList.add("question-number")
    questionNumberSpan.textContent = i + 1

    const userAnswerSpan = document.createElement("span")
    userAnswerSpan.classList.add("user-answer")
    userAnswerSpan.textContent = userAnswers.get(i + 1)

    if (userAnswers.get(i + 1) === correctTemplate.get(i + 1).option) {
      userAnswerSpan.classList.add("correct-answer")
    } else {
      userAnswerSpan.classList.add("wrong-answer")
    }

    const correctAnswerNumberSpan = document.createElement("span")
    correctAnswerNumberSpan.classList.add("correct-answer-number")
    correctAnswerNumberSpan.textContent = correctTemplate.get(i + 1).option

    const correctAnswerTextSpan = document.createElement("span")
    correctAnswerTextSpan.classList.add("correct-answer-text")
    correctAnswerTextSpan.textContent = correctTemplate.get(i + 1).title

    resultDiv.appendChild(questionNumberSpan)
    resultDiv.appendChild(userAnswerSpan)
    resultDiv.appendChild(correctAnswerNumberSpan)
    resultDiv.appendChild(correctAnswerTextSpan)

    DivAnswersContainer.appendChild(resultDiv)
    ParagraphUserFinalPoints.textContent = `${userPoints}/${globalExam.questions.length} points`
  }
}

function loadCorrectTemplate() {
  for (let i = 0; i <= globalExam.questions.length - 1; i++) {
    const currentQuestion = globalExam.questions[i]
    const currentQuestionCorrectAnswerOption = currentQuestion.correctAnswer
    const currenctQuestionCorrectAnswerText = currentQuestion.alternatives[currentQuestionCorrectAnswerOption - 1]
    /** @type {CorrectTemplateAnswer} */
    const correctAnswerObj = { title: currenctQuestionCorrectAnswerText, option: currentQuestionCorrectAnswerOption }
    correctTemplate.set(i + 1, correctAnswerObj)
  }
}

function handleDoAnotherExam() {
  userAnswers.clear()
  correctTemplate.clear()
  globalExam = {}
  SectionFinalResultContainer.classList.add("hidden")
  InputExamFile.value = null
  MainContainer.classList.remove("hidden")
  SpanExamQuestionTitle.setAttribute("exam-question-number", 1)
  document.querySelectorAll(".result").forEach((element) => element.remove())
  userPoints = 0
  SpanExamFileNamePreview.textContent = "No file selected..."
  DialogGlobalModal.classList.remove("flex")
}

function handleCancelCurrentExam() {
  userAnswers.clear()
  correctTemplate.clear()
  globalExam = {}
  SectionExamContainer.classList.add("hidden")
  InputExamFile.value = null
  MainContainer.classList.remove("hidden")
  userPoints = 0
  SpanExamFileNamePreview.textContent = "No file selected..."
}

function handleUserAnswer() {
  const SpanExamQuestionTitle = document.querySelector("#exam-question-title")
  const questionAlternativeRadioSelected = document.querySelector("input[name='exam-question-alternative']:checked")

  let questionNumber = Number(SpanExamQuestionTitle.getAttribute("exam-question-number"))

  userAnswers.set(questionNumber, Number(questionAlternativeRadioSelected.value))

  if (correctTemplate.get(questionNumber).option === Number(questionAlternativeRadioSelected.value)) userPoints++

  SpanExamQuestionTitle.setAttribute("exam-question-number", questionNumber + 1)

  questionNumber = Number(SpanExamQuestionTitle.getAttribute("exam-question-number"))

  loadQuestion()
}

ButtonDoAnotherExam.addEventListener("click", () => {
  DialogGlobalModal.setAttribute("action", "do-another-exam")
  ParagraphGlobalModalTitle.textContent = "Wanna do another exam?"
  DialogGlobalModal.classList.add("flex")
  DialogGlobalModal.showModal()
})

ButtonCancelCurrentExam.addEventListener("click", () => {
  DialogGlobalModal.setAttribute("action", "cancel-current-exam")
  ParagraphGlobalModalTitle.textContent = "Are you sure you want to cancel this exam?"
  DialogGlobalModal.showModal()
})

// Get json file content
FormExamFileUpload.addEventListener("submit", (e) => {
  e.preventDefault()

  if (InputExamFile.files.length === 0) {
    alert("Please select a file.")
    return
  }

  const jsonFile = InputExamFile.files[0];
  const oneMebabyte = 1048576
  const jsonFileSizeInMegabytes = jsonFile.size / oneMebabyte
  const maximumJsonFileSizeInMegabytes = 5.0

  if (jsonFileSizeInMegabytes > maximumJsonFileSizeInMegabytes) {
    alert("Json file cannot be larger than 5mb.")
    return
  }

  const reader = new FileReader()
  reader.readAsText(jsonFile)
  reader.onload = (e) => {
    globalExam = JSON.parse(e.target.result)
    main()
  }
})

// Handle user answering
ButtonExamConfirmQuestionAnswer.addEventListener("click", () => {
  DialogGlobalModal.setAttribute("action", "confirm-question-answer")
  ParagraphGlobalModalTitle.textContent = "Are you sure you want to confirm this answer?"
  DialogGlobalModal.showModal()
})

ButtonGlobalModalClose.addEventListener("click", () => DialogGlobalModal.close())

ButtonGlobalModalConfirm.addEventListener("click", () => {
  const modalAction = DialogGlobalModal.getAttribute("action").toUpperCase()
  switch (modalAction) {
    case "CONFIRM-QUESTION-ANSWER": handleUserAnswer(); break
    case "CANCEL-CURRENT-EXAM": handleCancelCurrentExam(); break
    case "DO-ANOTHER-EXAM": handleDoAnotherExam(); break
  }
  DialogGlobalModal.close()
})

InputExamFile.addEventListener('change', (e) => {
  const fileName = e.target.files[0].name
  SpanExamFileNamePreview.textContent = fileName
})

import("./modules/alternative-select/events.js");
