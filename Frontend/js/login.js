// LOGIN 

const BACKEND_URL = "http://localhost:3000"

document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const userType = document.getElementById('userType').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${BACKEND_URL}/${userType}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (response.ok) {
            // Handle successful login, e.g., redirect to another page
            localStorage.setItem('authToken', result.token);
            alert("Login Successful");

            // Redirect based on user type
            let redirectPath = '';
            switch (userType) {
                case 'admin':
                    redirectPath = '/frontend/admin_Ind.html';
                    break;
                case 'ngo':
                    redirectPath = '/frontend/index_ngo.html';
                    break;
                case 'restaurant':
                    redirectPath = '/frontend/index_restaurant.html';
                    break;
                case 'volunteer':
                    redirectPath = '/frontend/index_Ind.html';
                    break;
            }

            window.location.href = redirectPath;
        } else {
            // Display error message
            alert(result.message);
        }
    } catch (error) {
        // Handle general errors
        alert('An error occurred. Please try again later.');
    }
});
