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

const examWrapperSection = document.querySelector("#exam-wrapper")
const mainContentWrapper = document.querySelector("#main-content-wrapper")
const finalResultWrapperSection = document.querySelector("#final-result")
const answersWrapperDiv = document.querySelector("#answers")
const userPointsP = document.querySelector("#user-points")
const globalModalDialog = document.querySelector("#confirm-modal")
const globalModalTitleP = document.querySelector("#modal-title")
const globalModalConfirmBtn = document.querySelector("#modal-confirm")
const globalMOdalCloseBtn = document.querySelector("#modal-close")

const examFileForm = document.querySelector("#exam-file-form")
const examFileInput = document.querySelector("#exam-file")
const questionAnswerForm = document.querySelector("#question-answer-form")
const questionTitleSpan = document.querySelector("#question-title")
const doAnotherExamBtn = document.querySelector("#do-another-exam")
const cancelCurrentExamBtn = document.querySelector("#cancel-exam")
const confirmQuestionAnswerBtn = document.querySelector("#confirm-question-answer")

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
  const checkedRadio = document.querySelector("input[name='question-alternative']:checked")
  if (checkedRadio) checkedRadio.checked = false
  let questionNumber = Number(questionTitleSpan.getAttribute("question-number"))

  if (questionNumber > globalExam.questions.length) {
    loadFinally()
    return
  }

  const currentQuestion = questionNumber - 1

  const questionAlternativesText = document.querySelectorAll(".alternative-text")

  examWrapperSection.classList.remove("hidden")


  questionTitleSpan.textContent = globalExam.questions[currentQuestion].title

  for (let i = 0; i <= 4; i++) {
    questionAlternativesText[i].textContent = globalExam.questions[currentQuestion].alternatives[i]
  }

  mainContentWrapper.classList.add("hidden")
}

function loadFinally() {
  examWrapperSection.classList.add("hidden")
  finalResultWrapperSection.classList.remove("hidden")

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

    answersWrapperDiv.appendChild(resultDiv)
    userPointsP.textContent = `${userPoints}/${globalExam.questions.length} points`
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
  finalResultWrapperSection.classList.add("hidden")
  examFileInput.value = null
  mainContentWrapper.classList.remove("hidden")
  questionTitleSpan.setAttribute("question-number", 1)
  document.querySelectorAll(".result").forEach((element) => element.remove())
  userPoints = 0
}

function handleCancelCurrentExam() {
  userAnswers.clear()
  correctTemplate.clear()
  globalExam = {}
  examWrapperSection.classList.add("hidden")
  examFileInput.value = null
  mainContentWrapper.classList.remove("hidden")
  userPoints = 0
}

function handleUserAnswer() {
  const questionTitleSpan = document.querySelector("#question-title")
  const questionAlternativeRadioSelected = document.querySelector("input[name='question-alternative']:checked")

  let questionNumber = Number(questionTitleSpan.getAttribute("question-number"))

  userAnswers.set(questionNumber, Number(questionAlternativeRadioSelected.value))

  if (correctTemplate.get(questionNumber).option === Number(questionAlternativeRadioSelected.value)) userPoints++

  questionTitleSpan.setAttribute("question-number", questionNumber + 1)

  questionNumber = Number(questionTitleSpan.getAttribute("question-number"))

  loadQuestion()
}

doAnotherExamBtn.addEventListener("click", () => {
  globalModalDialog.setAttribute("action", "do-another-exam")
  globalModalTitleP.textContent = "Wanna do another exam?"
  globalModalDialog.showModal()
})

cancelCurrentExamBtn.addEventListener("click", () => {
  globalModalDialog.setAttribute("action", "cancel-current-exam")
  globalModalTitleP.textContent = "Are you sure you want to cancel this exam?"
  globalModalDialog.showModal()
})

// Get json file content
examFileForm.addEventListener("submit", (e) => {
  e.preventDefault()

  if (examFileInput.files.length === 0) {
    alert("Please select a file.")
    return
  }

  const jsonFile = examFileInput.files[0];
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
    console.log(jsonFile)
    main()
  }
})

// Handle user answering
confirmQuestionAnswerBtn.addEventListener("click", () => {
  globalModalDialog.setAttribute("action", "confirm-question-answer")
  globalModalTitleP.textContent = "Are you sure you want to confirm this answer?"
  globalModalDialog.showModal()
})

globalMOdalCloseBtn.addEventListener("click", () => globalModalDialog.close())

globalModalConfirmBtn.addEventListener("click", () => {
  const modalAction = globalModalDialog.getAttribute("action").toUpperCase()
  switch (modalAction) {
    case "CONFIRM-QUESTION-ANSWER": handleUserAnswer(); break
    case "CANCEL-CURRENT-EXAM": handleCancelCurrentExam(); break
    case "DO-ANOTHER-EXAM": handleDoAnotherExam(); break
  }
  globalModalDialog.close()
})
