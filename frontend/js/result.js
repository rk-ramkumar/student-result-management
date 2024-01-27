document.addEventListener("DOMContentLoaded", () => {
    // Fetch initial exam results on page load
    getResults();
});

function getResults() {
    const studentName = document.getElementById('studentName').value;
    const exam = document.getElementById('exam').value;
    const subject = document.getElementById('subject').value;

    // Replace the following URL with your actual server URL
    const apiUrl = `http://localhost:3000/results?studentName=${encodeURIComponent(studentName)}&exam=${encodeURIComponent(exam)}&subject=${encodeURIComponent(subject)}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(results => renderResults(results))
        .catch(error => console.error('Error fetching results:', error));
}

function renderResults(results) {
    const resultsSection = document.getElementById('resultsSection');

    // Clear existing results
    resultsSection.innerHTML = '';

    if (results.length === 0) {
        // Display a message when there are no results
        const noResultsMessage = document.createElement('p');
        noResultsMessage.textContent = 'No results found.';
        resultsSection.appendChild(noResultsMessage);
    } else {
        // Create a table to display results
        const resultTable = document.createElement('table');
        resultTable.className = 'result-table';

        // Add table header
        const tableHeader = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headers = ['Student Name', 'Score', 'Grade']; 

        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });

        tableHeader.appendChild(headerRow);
        resultTable.appendChild(tableHeader);

        // Add table body with results
        const tableBody = document.createElement('tbody');

        results.forEach(result => {
            const row = document.createElement('tr');

            // Assuming each result object has properties like 'studentName', 'score', 'grade'
            const cells = ['studentName', 'score', 'grade']; 

            cells.forEach(cellProperty => {
                const td = document.createElement('td');
                td.textContent = result[cellProperty];
                row.appendChild(td);
            });

            tableBody.appendChild(row);
        });

        resultTable.appendChild(tableBody);
        resultsSection.appendChild(resultTable);
    }
}
