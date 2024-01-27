  
  // Function to fetch and display the example exam
  async function fetchAndDisplayExampleExam() {
    try {
      const studentName = document.getElementById('studentName').value;

      if (studentName === ""){
        alert("Enter your name.")
        return
      }

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
          optionLabel.textContent = option.optionText;
  
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
  
  async function submitExampleExam() {
    try {
        const studentName = document.getElementById('studentName').value;

        if (studentName === "") {
            alert("Enter your name.");
            return;
        }

        // Capture responses from radio buttons
        const responses = [];
        const questionContainers = document.querySelectorAll('.question-container');
        questionContainers.forEach((questionContainer, index) => {
            const selectedOption = questionContainer.querySelector(`input[name="question${index}"]:checked`);
            if (selectedOption) {
                responses.push(parseInt(selectedOption.value, 10));
            }
        });

        // Get the exam and subject details (you may adjust this based on your frontend structure)
        const examName = 'Example Exam';
        const subject = 'CS'; 
        // Submit the exam to the server
        const response = await fetch('http://localhost:3000/conduct-exam', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                studentName,
                exam: examName,
                subject,
                answers: responses,
            }),
        });

        const result = await response.json();
        console.log('Exam submission result:', result);

        // Redirect or display relevant information based on the result
        // For example, you can redirect to a results page
        if (result.message === 'Exam submitted successfully.') {
            alert('Exam submitted successfully!');
            window.location.href = '/frontend/result.html'; 
        } else {
            alert('Failed to submit the exam.');
        }
    } catch (error) {
        console.error('Error submitting exam:', error);
    }
}

  