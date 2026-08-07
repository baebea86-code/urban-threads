import { auth } from "../firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const form = document.querySelector("#authForm");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const message = document.querySelector("#authMessage");
const submitButton = document.querySelector("#authSubmit");
const toggleButton = document.querySelector("#toggleAuth");
const title = document.querySelector("#authTitle");
const subtitle = document.querySelector("#authSubtitle");

let isSignup = false;

toggleButton.addEventListener("click", () => {
  isSignup = !isSignup;

  title.textContent = isSignup ? "Create your account." : "Welcome back.";
  subtitle.textContent = isSignup
    ? "Join Urban Threads and start shopping."
    : "Log in to continue shopping.";
  submitButton.textContent = isSignup ? "Sign up" : "Log in";
  toggleButton.textContent = isSignup
    ? "Already have an account? Log in"
    : "Don't have an account? Sign up";
  message.textContent = "";
});

form.addEventListener("submit", async event => {
  event.preventDefault();
  message.textContent = "Please wait...";

  try {
    if (isSignup) {
      await createUserWithEmailAndPassword(
        auth,
        emailInput.value,
        passwordInput.value
      );
    } else {
      await signInWithEmailAndPassword(
        auth,
        emailInput.value,
        passwordInput.value
      );
    }

    window.location.href = "shop.html";
  } catch (error) {
    message.textContent = error.message;
  }
});

onAuthStateChanged(auth, user => {
  if (user) {
    // Prevent authenticated users from unnecessarily staying on the auth page.
    // Comment this out if you want users to remain here after login.
  }
});
