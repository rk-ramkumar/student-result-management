
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
    questionInput.required = true;
    questionDiv.appendChild(questionInput);

    questionCount++;

    questionsContainer.appendChild(questionDiv);
}

function createExam() {
    const examTitle = document.getElementById('examTitle').value;

    const questions = [];
    const questionInputs = document.querySelectorAll('.question input');
    questionInputs.forEach((input) => {
        questions.push(input.value);
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
            console.log(result.message);
        } else {
            console.error('Error creating exam:', response.statusText);
        }
    } catch (error) {
        console.error('Error sending exam to server:', error);
    }
}
