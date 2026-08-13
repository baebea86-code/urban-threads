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