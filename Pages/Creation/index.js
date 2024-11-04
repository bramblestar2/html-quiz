let quiz = {
    title: "",
    questions: []
}


let quizButton = document.getElementById("quiz-button");
let resetButton = document.getElementById("reset-button");
let loadButton = document.getElementById("load-quiz-button");
let exportButton = document.getElementById("export-button");


let booleanButton = document.getElementById("add-boolean");
let singleButton = document.getElementById("add-single");
let multipleButton = document.getElementById("add-multiple");

let questionsContainer = document.getElementById("questions-container");
let titleInput = document.getElementById("quiz-title");

quizButton.addEventListener("click", () => {
    window.location.href = "index.html";
});


resetButton.addEventListener("click", () => {
    resetValues();
    titleInput.value = "";
    renderQuestions();
});


loadButton.addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = () => {
        const file = input.files[0];
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            const data = JSON.parse(reader.result);
            quiz = data;
            titleInput.value = quiz.title;
            renderQuestions();
        });
        reader.readAsText(file);
    };
    input.click();
});


exportButton.addEventListener("click", () => {
    const data = JSON.stringify(quiz);
    const blob = new Blob([data], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${quiz.title ? quiz.title : "Untitled"} Quiz.json`;
    link.click();

    URL.revokeObjectURL(url);
});


const resetValues = () => {
    quiz = {
        title: "",
        questions: []
    }
}


const addQuestion = (type) => {
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

    quiz.questions.push(question);
}


titleInput.onchange = () => {
    quiz.title = titleInput.value;
}


const renderQuestions = () => {
    questionsContainer.innerHTML = "";
    quiz.questions.forEach((question, index) => {
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
            quiz.questions.splice(index, 1);
            renderQuestions();
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
                renderQuestions();
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
                        renderQuestions();
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

        questionsContainer.appendChild(questionForm);
    });
}



booleanButton.addEventListener("click", () => {
    addQuestion("boolean");
    renderQuestions();
});


singleButton.addEventListener("click", () => {
    addQuestion("single");
    renderQuestions();
});


multipleButton.addEventListener("click", () => {
    addQuestion("multiple");
    renderQuestions();
});
