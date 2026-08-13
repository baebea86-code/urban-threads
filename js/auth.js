import { auth } from "../firebase.js";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";


const authForm = document.querySelector("#authForm");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");

const authTitle = document.querySelector("#authTitle");
const authSubtitle = document.querySelector("#authSubtitle");
const authSubmit = document.querySelector("#authSubmit");

const authMessage = document.querySelector("#authMessage");
const toggleAuth = document.querySelector("#toggleAuth");


let isLoginMode = true;


/* =========================
   TOGGLE LOGIN / SIGN UP
========================= */

toggleAuth.addEventListener("click", () => {

  isLoginMode = !isLoginMode;

  authMessage.textContent = "";

  if (isLoginMode) {

    authTitle.textContent = "Welcome back.";

    authSubtitle.textContent =
      "Log in to continue shopping.";

    authSubmit.textContent = "Log in";

    toggleAuth.textContent =
      "Don't have an account? Sign up";

  } else {

    authTitle.textContent =
      "Create your account.";

    authSubtitle.textContent =
      "Sign up to start shopping.";

    authSubmit.textContent =
      "Sign up";

    toggleAuth.textContent =
      "Already have an account? Log in";

  }

});


/* =========================
   AUTH FORM
========================= */

authForm.addEventListener("submit", async (event) => {

  event.preventDefault();

  const email = emailInput.value.trim();

  const password = passwordInput.value;


  authMessage.textContent = "Please wait...";


  try {

    if (isLoginMode) {

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      authMessage.textContent =
        "Login successful!";

    } else {

      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      authMessage.textContent =
        "Account created successfully!";

    }


    setTimeout(() => {

      window.location.href = "index.html";

    }, 1000);


  } catch (error) {

    console.error(error);

    authMessage.textContent =
      getAuthErrorMessage(error.code);

  }

});


/* =========================
   FIREBASE ERROR MESSAGES
========================= */

function getAuthErrorMessage(errorCode) {

  switch (errorCode) {

    case "auth/invalid-email":
      return "Please enter a valid email address.";

    case "auth/user-not-found":
      return "No account was found with this email.";

    case "auth/wrong-password":
      return "Incorrect password.";

    case "auth/invalid-credential":
      return "Incorrect email or password.";

    case "auth/email-already-in-use":
      return "An account already exists with this email.";

    case "auth/weak-password":
      return "Password must be at least 6 characters.";

    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";

    default:
      return "Something went wrong. Please try again.";

  }

}