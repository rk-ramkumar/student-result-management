
async function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword){
        alert("Password misMatch")

        return
    }

    try {
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const result = await response.text();
        alert(result);

        if (result === 'Registration successful.') {
            // Redirect to the dashboard or another page
            window.location.href = '/dashboard.html';
        }
    } catch (error) {
        console.error('Error during registration:', error);
    }
}

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`http://localhost:3000/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const result = await response.text();
        alert(result);

        // Check if login is successful before redirecting
        if (result === 'Login successful.') {
            // Redirect to the dashboard or another page
            window.location.href = '/dashboard.html';
        }
    } catch (error) {
        console.error('Error during login:', error);
    }
}


