// JavaScript to toggle password visibility
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("click", function () {
  // Toggle the type attribute between "password" (hidden) and "text" (visible)
  const type =
    passwordInput.getAttribute("type") === "password" ? "text" : "password";
  passwordInput.setAttribute("type", type);

  // Toggle the eye icon to reflect visibility state
  this.classList.toggle("fa-eye");
  this.classList.toggle("fa-eye-slash");
});

// https://firebase.google.com/docs/auth/web/start
// https://www.geeksforgeeks.org/getting-started-with-firebase-email-password-authentication/
// https://www.youtube.com/watch?v=WM178YopjfI
// https://firebase.google.com/docs/firestore/security/get-started
// https://firebase.google.com/docs/cli#sign-in-test-cli

// also index will be guestHomepage but for now wont touch it
// moved it to hosting to not have it as local and be able open the email link on another computer
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

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
const auth = getAuth(app);
const db = getFirestore(app);

document.getElementById("submit").addEventListener("click", async (event) => {
  event.preventDefault();

  const fullName = document.getElementById("fullName").value.trim();
  const dob = document.getElementById("dob").value;
  const gender = document.getElementById("gender").value;
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!fullName || !dob || !gender || !email || !password) {
    alert("Please fill in all fields.");
    return;
  }

  // to ensure they know to type in a valid dob
  const dobRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!dobRegex.test(dob)) {
    alert("Please enter your date of birth in the format dd/mm/yyyy.");
    return;
  }

  try {
    // creates the user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // stores user details in Firestore
    await setDoc(doc(db, "users", user.uid), {
      fullName,
      dob,
      gender,
      email,
      uid: user.uid,
      createdAt: new Date(),
    });

    // sends email verification with link
    await sendEmailVerification(user, {
      url: "https://amllibrary.web.app/memberHomepage.html", // sends to resources as we dont have separate homepages pages yet, but it works now
    });

    // clear after submiting
    document.getElementById("fullName").value = "";
    document.getElementById("dob").value = "";
    document.getElementById("gender").value = "";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";

    alert(
      "Your account has been created. A verification email has been sent. Please verify your email to proceed."
    );
  } catch (error) {
    console.error("Error during registration:", error.message);

    if (error.code === "auth/email-already-in-use") {
      alert(
        "This email address is already in use. Please use a different email."
      );
    } else if (error.code === "auth/weak-password") {
      alert("Your password is too weak. Please use a stronger password.");
    } else {
      alert(`Error: ${error.message}`);
    }
  }
});
