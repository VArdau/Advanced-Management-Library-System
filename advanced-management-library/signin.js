const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("click", function () {
  const type =
    passwordInput.getAttribute("type") === "password" ? "text" : "password";
  passwordInput.setAttribute("type", type);

  if (type === "password") {
    this.classList.remove("fa-eye");
    this.classList.add("fa-eye-slash");
  } else {
    this.classList.remove("fa-eye-slash");
    this.classList.add("fa-eye");
  }
});

// sign in logic
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCmcT5fG8Nkny7jlFEN9gn3rRZHxyII_as",
  authDomain: "amllibrary.firebaseapp.com",
  databaseURL:
    "https://amllibrary-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "amllibrary",
  storageBucket: "amllibrary.firebasestorage.app",
  messagingSenderId: "612435739543",
  appId: "1:612435739543:web:f22564c7487cc71de47ad2",
  measurementId: "G-T52D62JS9E",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// registration logic
const login = document.getElementById("login");

login.addEventListener("click", function (event) {
  event.preventDefault();

  // inputs
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // input validation
  if (!email || !password) {
    alert("Please fill in all fields.");
    return;
  }

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      window.location.href = "wishlistPage.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
});
