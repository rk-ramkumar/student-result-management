let questionCount = 1; 

function addQuestion() {
    const questionsContainer = document.getElementById('questionsContainer');

    const questionDiv = document.createElement('div');
    questionDiv.className = 'question';

    const questionLabel = document.createElement('label');
    questionLabel.textContent = `Question ${questionCount}: `;
    questionDiv.appendChild(questionLabel);

    const questionInput = document.createElement('input');
    questionInput.type = 'text';
    questionInput.name = `question${questionCount}`;
    questionInput.placeholder = 'Enter the question';
    questionInput.required = true;
    questionDiv.appendChild(questionInput);

    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'options';

    // Add options dynamically
    for (let i = 1; i <= 4; i++) {
        const optionLabel = document.createElement('label');
        optionLabel.textContent = `Option ${i}: `;

        const optionInput = document.createElement('input');
        optionInput.type = 'text';
        optionInput.name = `question${questionCount}_option${i}`;
        optionInput.placeholder = `Enter option ${i}`;
        optionInput.required = true;

        const correctAnswerCheckbox = document.createElement('input');
        correctAnswerCheckbox.type = 'radio';
        correctAnswerCheckbox.name = `question${questionCount}_correct`;
        correctAnswerCheckbox.value = i - 1; // Use index as value

        optionLabel.appendChild(optionInput);
        optionLabel.appendChild(correctAnswerCheckbox);
        optionsDiv.appendChild(optionLabel);
    }

    questionDiv.appendChild(optionsDiv);

    questionsContainer.appendChild(questionDiv);

    questionCount++;
}

function createExam() {
    const examTitle = document.getElementById('examTitle').value;

    const questions = [];
    const questionDivs = document.querySelectorAll('.question');
    questionDivs.forEach((questionDiv) => {
        const questionText = questionDiv.querySelector('input[type="text"]').value;

        const options = [];
        const optionInputs = questionDiv.querySelectorAll('.options input[type="text"]');
        optionInputs.forEach((optionInput, index) => {
            const optionText = optionInput.value;
            const isCorrect = questionDiv.querySelector(`input[name="question${questionCount}_correct"]:checked`);

            options.push({
                optionText,
                isCorrect: isCorrect ? true : false,
            });
        });

        questions.push({
            questionText,
            options,
        });
    });

    // Send the exam details to the server
    sendExamToServer(examTitle, questions);
}


async function sendExamToServer(examTitle, questions) {
    try {
        const response = await fetch('http://localhost:3000/create-exam', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                examTitle,
                questions,
            }),
        });

        if (response.ok) {
            const result = await response.json();
            alert(result.message)
            console.log(result.message);
        } else {
            console.error('Error creating exam:', response.statusText);
        }
    } catch (error) {
        console.error('Error sending exam to server:', error);
    }
}
