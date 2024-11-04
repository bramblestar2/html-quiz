let completeData = {}

let questions = [];
let currentQuestion = {};
let totalQuestions = 0;
let questionsCorrect = 0;

let quizForm = document.getElementById("quiz-form");
let questionText = document.getElementById("question");
let answerContainer = document.getElementById("answer-container");
let loadButton = document.getElementById("load-button");
let imageContainer = document.getElementById("image-container");
let submitButton = document.getElementById("submit-button");
let quizTitleElement = document.getElementById("quiz-title");
let resetButton = document.getElementById("reset-button");

let createButton = document.getElementById("create-button");


window.onchange = (event) => {
    console.log(event);
}




createButton.addEventListener("click", () => {
    window.location.href = "quizCreation.html";
});

const checkSubmitVisibility = () => {
    if (questions.length > 0) {
        submitButton.classList.remove("inactive");
    } else {
        submitButton.classList.add("inactive");
    }

}

document.addEventListener("DOMContentLoaded", () => {
    checkSubmitVisibility();
    resetButton.classList.add("inactive");
});


quizForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (currentQuestion.type === "single") {
        const data = new FormData(quizForm);
        const answer = data.get("answer");
        const correct = currentQuestion.correct === answer;
        if (correct) {
            questionsCorrect++;
        }
    } else if (currentQuestion.type === "multiple") {
        const data = new FormData(quizForm);
        const answers = Array.from(data.values());
        const correct = currentQuestion.correct.every((answer) => answers.includes(answer));
        if (correct) {
            questionsCorrect++;
        }
    } else if (currentQuestion.type === "boolean") {
        const data = new FormData(quizForm);
        const answer = data.get("answer");
        const correct = currentQuestion.correct === answer;
        if (correct) {
            questionsCorrect++;
        }
    }

    nextQuestion();
});


const resetValues = () => {
    resetButton.classList.add("inactive");
    completeData = {}
    quizTitleElement.innerText = "Quiz";
    questions = [];
    currentQuestion = {};
    questionsCorrect = 0;
    totalQuestions = 0;
};


// Ask user to upload JSON file
const loadQuestions = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async () => {
        resetValues();
        const file = input.files[0];
        const data = JSON.parse(await file.text());
        quizTitleElement.innerText = data.title;
        questions = data.questions;
        totalQuestions = questions.length;

        completeData = JSON.parse(JSON.stringify(data));


        resetButton.classList.remove("inactive");

        nextQuestion();
    };
    input.click();
};

const setupSingleChoice = () => {
    for (let i = 0; i < currentQuestion.options.length; i++) {
        const label = document.createElement("label");
        
        const option = document.createElement("input");
        option.name = "answer";
        option.type = "radio";
        option.value = currentQuestion.options[i];

        label.htmlFor = option.value;
        label.appendChild(option);
        label.appendChild(document.createTextNode(currentQuestion.options[i]));
        
        answerContainer.appendChild(label);
    }
};

const setupMultipleChoice = () => {
    for (let i = 0; i < currentQuestion.options.length; i++) {
        const label = document.createElement("label");
        
        const option = document.createElement("input");
        option.name = "answer";
        option.type = "checkbox";
        option.value = currentQuestion.options[i];

        label.appendChild(option);
        label.appendChild(document.createTextNode(currentQuestion.options[i]));
        
        answerContainer.appendChild(label);
    }
};

const setupBooleanChoice = () => {
    const trueLabel = document.createElement("label");
    const trueOption = document.createElement("input");
    const trueSpan = document.createElement("span");
    trueOption.name = "answer";
    trueOption.type = "radio";
    trueOption.value = "true";
    
    const falseLabel = document.createElement("label");
    const falseOption = document.createElement("input");
    const falseSpan = document.createElement("span");
    falseOption.name = "answer";
    falseOption.type = "radio";
    falseOption.value = "false";

    trueLabel.appendChild(trueOption);
    trueLabel.appendChild(trueSpan);
    trueLabel.appendChild(document.createTextNode("True"));
    falseLabel.appendChild(falseOption);
    falseLabel.appendChild(falseSpan);
    falseLabel.appendChild(document.createTextNode("False"));

    trueLabel.classList.add("custom-radio-boolean");
    falseLabel.classList.add("custom-radio-boolean");

    answerContainer.appendChild(trueLabel);
    answerContainer.appendChild(falseLabel);
};

const nextQuestion = () => {
    if (questions.length > 0) {
        checkSubmitVisibility();
        currentQuestion = questions.shift();
        
        questionText.innerText = currentQuestion.question;
        answerContainer.innerHTML = "";

        if (currentQuestion.type === "single") {
            setupSingleChoice();
        } else if (currentQuestion.type === "multiple") {
            setupMultipleChoice();
        } else if (currentQuestion.type === "boolean") {
            setupBooleanChoice();
        }
    } else {
        questionText.innerText = `Quiz complete! You scored ${questionsCorrect} out of ${totalQuestions}.`;
        answerContainer.innerHTML = "";
        checkSubmitVisibility();
    }
};


loadButton.addEventListener("click", loadQuestions);

// Resets the quiz to the beginning
resetButton.addEventListener("click", () => {
    questionsCorrect = 0;
    questions = JSON.parse(JSON.stringify(completeData.questions));
    totalQuestions = questions.length;
    nextQuestion();
});