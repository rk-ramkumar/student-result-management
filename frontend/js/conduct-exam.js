// conduct-example-exam.js

document.addEventListener("DOMContentLoaded", () => {
    // Fetch and display the example exam when the page loads
    fetchAndDisplayExampleExam();
  });
  
  // Function to fetch and display the example exam
  async function fetchAndDisplayExampleExam() {
    try {
      const response = await fetch('http://localhost:3000/exams/example-exam');
      const exampleExam = await response.json();
  
      // Implement code to display example exam details and capture responses
  
      // For simplicity, let's assume the exam data is stored in the 'exampleExam' variable
      const examQuestionsSection = document.getElementById('examQuestionsSection');
      examQuestionsSection.innerHTML = '';
  
      exampleExam.questions.forEach((question, index) => {
        const questionContainer = document.createElement('div');
        questionContainer.className = 'question-container';
  
        const questionText = document.createElement('p');
        questionText.textContent = `Q${index + 1}: ${question.questionText}`;
        questionContainer.appendChild(questionText);
  
        // Add radio buttons for options
        question.options.forEach((option, optionIndex) => {
          const optionLabel = document.createElement('label');
          optionLabel.textContent = option;
  
          const radioButton = document.createElement('input');
          radioButton.type = 'radio';
          radioButton.name = `question${index}`;
          radioButton.value = optionIndex;
  
          optionLabel.appendChild(radioButton);
          questionContainer.appendChild(optionLabel);
        });
  
        examQuestionsSection.appendChild(questionContainer);
      });
    } catch (error) {
      console.error('Error fetching example exam:', error);
    }
  }
  
  // Function to submit the example exam to the server for evaluation
  async function submitExampleExam() {
    try {
      const studentName = document.getElementById('studentName').value;
  
      // Capture responses from radio buttons
      const responses = [];
      const questionContainers = document.querySelectorAll('.question-container');
      questionContainers.forEach((questionContainer, index) => {
        const selectedOption = questionContainer.querySelector(`input[name="question${index}"]:checked`);
        if (selectedOption) {
          responses.push(parseInt(selectedOption.value, 10));
        }
      });
  
      // Submit the example exam to the server
      const response = await fetch('http://localhost:3000/conduct-exam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentName,
          examTitle: 'Example Exam', // Assuming the example exam has this title
          responses,
        }),
      });
  
      const result = await response.json();
      console.log('Example Exam submission result:', result);
  
      // Redirect or display relevant information based on the result
    } catch (error) {
      console.error('Error submitting example exam:', error);
    }
  }
  