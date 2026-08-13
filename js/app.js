import { auth } from "../firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";


/* =========================
   ELEMENTS
========================= */

const navbar =
  document.querySelector("#navbar");

const footer =
  document.querySelector("footer");


/* =========================
   NAVBAR
========================= */

function renderNavbar(user) {

  if (!navbar) {
    return;
  }


  navbar.innerHTML = `

    <nav class="navbar">

      <a
        class="brand"
        href="index.html"
      >
        URBAN<span>THREADS</span>
      </a>


      <div class="nav-links">

        <a href="shop.html">
          Shop
        </a>

        <a href="cart.html">
          Cart
        </a>

        <button
          id="themeToggleBtn"
          class="theme-toggle"
          title="Toggle theme"
        >
          🌙
        </button>

        ${
          user
            ? `

              <a href="orders.html">
                Orders
              </a>

              <span class="user-email">
                ${user.email}
              </span>

              <button
                id="logoutBtn"
                class="nav-button"
              >
                Log out
              </button>

            `
            : `

              <a
                href="login.html"
                class="nav-button"
              >
                Log in
              </a>

            `
        }

      </div>

    </nav>

  `;


  /* =========================
     LOGOUT
  ========================= */

  const logoutBtn =
    document.querySelector("#logoutBtn");


  if (logoutBtn) {

    logoutBtn.addEventListener(
      "click",
      async () => {

        try {

          await signOut(auth);

          window.location.href =
            "index.html";

        } catch (error) {

          console.error(
            "Logout error:",
            error
          );

        }

      }
    );

  }

  /* =========================
     THEME TOGGLE
  ========================= */

  const themeToggleBtn =
    document.querySelector("#themeToggleBtn");

  if (themeToggleBtn) {

    themeToggleBtn.addEventListener(
      "click",
      () => {
        toggleTheme();
      }
    );

    updateThemeIcon();

  }

}


/* =========================
   FOOTER
========================= */

if (footer) {

  footer.innerHTML = `

    <div class="footer-inner">

      <strong>
        URBAN THREADS
      </strong>

      <p>
        Streetwear for everyday life.
      </p>

      <small>
        © 2026 Urban Threads
      </small>

    </div>

  `;

}


/* =========================
   AUTH STATE
========================= */

onAuthStateChanged(
  auth,
  (user) => {

    renderNavbar(user);

  }
);

/* =========================
   THEME MANAGEMENT
========================= */

function initializeTheme() {
  const savedTheme = localStorage.getItem("theme") || "light";
  const html = document.documentElement;

  if (savedTheme === "dark") {
    html.classList.add("dark-mode");
  } else {
    html.classList.remove("dark-mode");
  }

  updateThemeIcon();
}

function toggleTheme() {
  const html = document.documentElement;

  if (html.classList.contains("dark-mode")) {
    html.classList.remove("dark-mode");
    localStorage.setItem("theme", "light");
  } else {
    html.classList.add("dark-mode");
    localStorage.setItem("theme", "dark");
  }

  updateThemeIcon();
}

function updateThemeIcon() {
  const themeToggleBtn =
    document.querySelector("#themeToggleBtn");

  if (themeToggleBtn) {
    const isDarkMode = document.documentElement.classList.contains("dark-mode");
    themeToggleBtn.textContent = isDarkMode ? "☀️" : "🌙";
  }
}

// Initialize theme on page load
initializeTheme();