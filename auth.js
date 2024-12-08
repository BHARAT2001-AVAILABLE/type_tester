const signupForm = document.getElementById('signup-form');
const loginForm = document.getElementById('login-form');
const updatePasswordBtn = document.getElementById('update-password-btn');

// Show/Hide Password functionality
document.getElementById('show-signup-password').addEventListener('change', function() {
    const passwordField = document.getElementById('signup-password');
    passwordField.type = this.checked ? 'text' : 'password';
});

document.getElementById('show-login-password').addEventListener('change', function() {
    const passwordField = document.getElementById('login-password');
    passwordField.type = this.checked ? 'text' : 'password';
});

document.getElementById('show-update-password').addEventListener('change', function() {
    const passwordField = document.getElementById('update-password');
    passwordField.type = this.checked ? 'text' : 'password';
});

// Sign Up Logic
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('signup-username').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value.trim();

    if (localStorage.getItem(username)) {
        alert('Username already exists. Please choose a different username.');
        return;
    }

    const userData = { email, password };
    localStorage.setItem(username, JSON.stringify(userData));
    alert('Sign up successful! You can now log in.');
    signupForm.reset();
});

// Sign In Logic
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value.trim();

    const userData = JSON.parse(localStorage.getItem(username));
    if (userData && userData.password === password) {
        alert('Login successful! Redirecting to the Typing Speed Tester...');
        window.location.href = 'typing.html';
    } else {
        alert('Invalid username or password!');
    }
});

// Update Password Logic
updatePasswordBtn.addEventListener('click', () => {
    const username = document.getElementById('login-username').value.trim();
    const newPassword = document.getElementById('update-password').value.trim();

    const userData = JSON.parse(localStorage.getItem(username));
    if (userData) {
        userData.password = newPassword;
        localStorage.setItem(username, JSON.stringify(userData));
        alert('Password updated successfully!');
        document.getElementById('update-password').value = ''; // Clear the input
    } else {
        alert('User not found! Please log in first.');
    }
});
