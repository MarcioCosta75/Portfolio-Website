import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDmPqTYTWTQ1RqW_Splurddq1uLLNuRIrM",
    authDomain: "portfoliowebsite-cf5e2.firebaseapp.com",
    projectId: "portfoliowebsite-cf5e2",
    storageBucket: "portfoliowebsite-cf5e2.appspot.com",
    messagingSenderId: "1071276832581",
    appId: "1:1071276832581:web:72133af622418e1384302c",
    measurementId: "G-9K0GQC5W3J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Toggle Password Visibility
document.getElementById('togglePassword').addEventListener('click', function () {
    const passwordField = document.getElementById('password');
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);

    // Toggle icon
    this.src = type === 'password' ? 'static/others/hidden.png' : 'static/others/show.png';
});

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Get the input values
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const loginError = document.getElementById('loginError');

    // Clear previous error messages
    loginError.style.display = 'none';
    loginError.textContent = '';

    // Firebase Authentication sign-in
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in successfully, redirect to listBlogs.html with email in URL
            window.location.href = `listBlogs.html?email=${encodeURIComponent(email)}`;
        })
        .catch((error) => {
            // Show error message
            console.error('Login error:', error);
            loginError.style.display = 'block';
            loginError.textContent = 'Erro ao tentar logar. Verifique suas credenciais e tente novamente.';
        });
});
