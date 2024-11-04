import './index.css';

let creation_quiz = {
    title: "",
    questions: []
}


let creation_quizButton = document.getElementById("quiz-button");
let creation_resetButton = document.getElementById("reset-button");
let creation_loadButton = document.getElementById("load-quiz-button");
let creation_exportButton = document.getElementById("export-button");


let creation_booleanButton = document.getElementById("add-boolean");
let creation_singleButton = document.getElementById("add-single");
let creation_multipleButton = document.getElementById("add-multiple");

let creation_questionsContainer = document.getElementById("questions-container");
let creation_titleInput = document.getElementById("quiz-title");

creation_quizButton.addEventListener("click", () => {
    window.location.href = "index.html";
});


creation_resetButton.addEventListener("click", () => {
    creation_resetValues();
    creation_titleInput.value = "";
    creation_renderQuestions();
});


creation_loadButton.addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = () => {
        const file = input.files[0];
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            const data = JSON.parse(reader.result);
            creation_quiz = data;
            creation_titleInput.value = creation_quiz.title;
            creation_renderQuestions();
        });
        reader.readAsText(file);
    };
    input.click();
});


creation_exportButton.addEventListener("click", () => {
    const data = JSON.stringify(creation_quiz);
    const blob = new Blob([data], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${creation_quiz.title ? creation_quiz.title : "Untitled"} Quiz.json`;
    link.click();

    URL.revokeObjectURL(url);
});


const creation_resetValues = () => {
    creation_quiz = {
        title: "",
        questions: []
    }
}


const creation_addQuestion = (type) => {
    const question = {
        question: "",
        type: type,
    }

    if (type === "multiple") {
        question.correct = [];
    }
    else {
        question.correct = "";
    }

    creation_quiz.questions.push(question);
}


creation_titleInput.onchange = () => {
    creation_quiz.title = creation_titleInput.value;
}


const creation_renderQuestions = () => {
    creation_questionsContainer.innerHTML = "";
    creation_quiz.questions.forEach((question, index) => {
        const questionForm = document.createElement("form");
        questionForm.classList.add("question-container");

        // Question Number
        const questionNumber = document.createElement("p");
        questionNumber.innerHTML = `Question: ${index + 1}`;
        questionForm.appendChild(questionNumber);

        // Question Type
        const questionType = document.createElement("p");
        questionType.innerHTML = `${question.type}`;
        questionForm.appendChild(questionType);

        // Delete Question
        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.innerHTML = "Delete";
        deleteButton.classList.add("delete-question-button");
        deleteButton.onclick = () => {
            creation_quiz.questions.splice(index, 1);
            creation_renderQuestions();
        };
        questionForm.appendChild(deleteButton);

        // Question Input
        const questionInput = document.createElement("input");
        questionInput.type = "text";
        questionInput.id = `question-${index}`;
        questionInput.name = `question-${index}`;
        questionInput.value = question.question;
        questionInput.placeholder = "Question";
        questionInput.classList.add("question-input");
        questionInput.onchange = () => {
            question.question = questionInput.value;
        };
        questionForm.appendChild(questionInput);

        // Add Option Button
        if (question.type === "multiple" || question.type === "single") {
            const addOptionButton = document.createElement("button");
            addOptionButton.type = "button";
            addOptionButton.innerHTML = "Add Option";
            addOptionButton.classList.add("add-option-button");
            addOptionButton.onclick = () => {
                question.options = question.options || [];
                question.options.push("");
                creation_renderQuestions();
            };
            questionForm.appendChild(addOptionButton);

            // Add Options
            if (question.options) {
                const optionsContainer = document.createElement("div");
                optionsContainer.classList.add("options-container");

                question.options.forEach((option, optionIndex) => {
                    const optionContainer = document.createElement("div");
                    optionContainer.classList.add("option-container");

                    // Option Input
                    const optionInput = document.createElement("input");
                    optionInput.type = "text";
                    optionInput.value = option;
                    optionInput.placeholder = `Option ${optionIndex + 1}`;
                    optionInput.name = `option-${index}-${optionIndex}`;

                    optionInput.onchange = () => {
                        if (optionIndex < question.options.length) {
                            question.options[optionIndex] = optionInput.value;
                        }
                    };

                    // Option Delete Button
                    const optionDeleteButton = document.createElement("button");
                    optionDeleteButton.type = "button";
                    optionDeleteButton.innerHTML = "X";
                    optionDeleteButton.onclick = () => {
                        question.options.splice(optionIndex, 1);
                        creation_renderQuestions();
                    };

                    // Correct Selection
                    const correctSelection = document.createElement("input");

                    if (question.type === "multiple") {
                        correctSelection.type = "checkbox";
                        correctSelection.name = `correct-${index}-${optionIndex}`;
                        correctSelection.value = optionIndex;
                        correctSelection.onchange = () => {
                            if (correctSelection.checked) {
                                question.correct.push(question.options[optionIndex]);
                            } else {
                                question.correct.splice(question.correct.indexOf(question.options[optionIndex]), 1);
                            }
                        };

                        if (question.correct.includes(option)) {
                            correctSelection.checked = true;
                        }
                    } else if (question.type === "single") {
                        correctSelection.type = "radio";
                        correctSelection.name = `correct-${index}`;
                        correctSelection.value = optionIndex;
                        correctSelection.checked = question.correct === question.options[optionIndex];
                        correctSelection.onchange = () => {
                            question.correct = question.options[optionIndex];
                        };
                    }

                    optionContainer.appendChild(correctSelection);
                    optionContainer.appendChild(optionInput);
                    optionContainer.appendChild(optionDeleteButton);
                    optionsContainer.appendChild(optionContainer);
                });
                questionForm.appendChild(optionsContainer);
            }
        }

        else if (question.type === "boolean") {
            const trueFalseOption = document.createElement("input");
            trueFalseOption.type = "checkbox";
            trueFalseOption.name = `correct-${index}`;
            trueFalseOption.value = "true";
            trueFalseOption.checked = question.correct === "true";

            const trueFalseLabel = document.createElement("label");
            trueFalseLabel.classList.add("option-boolean-label");
            trueFalseLabel.appendChild(trueFalseOption);
            trueFalseLabel.appendChild(document.createElement("span"));
            
            trueFalseOption.onchange = () => {
                question.correct = trueFalseOption.checked.toString();
            };
            
            questionForm.appendChild(trueFalseLabel);
        }

        creation_questionsContainer.appendChild(questionForm);
    });
}



creation_booleanButton.addEventListener("click", () => {
    creation_addQuestion("boolean");
    creation_renderQuestions();
});


creation_singleButton.addEventListener("click", () => {
    creation_addQuestion("single");
    creation_renderQuestions();
});


creation_multipleButton.addEventListener("click", () => {
    creation_addQuestion("multiple");
    creation_renderQuestions();
});
