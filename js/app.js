import { auth } from "../firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { db } from "../firebase.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

console.log("Firebase connected:", db);

const productsRef = collection(db, "products");

const snapshot = await getDocs(productsRef);

snapshot.forEach((doc) => {
  console.log("PRODUCT:", doc.id, doc.data());
});

const navbar = document.querySelector("#navbar");
const footer = document.querySelector("footer");

function renderNavbar(user) {
  navbar.innerHTML = `
    <nav class="navbar">
      <a class="brand" href="index.html">URBAN<span>THREADS</span></a>
      <div class="nav-links">
        <a href="shop.html">Shop</a>
        <a href="cart.html">Cart</a>
        ${
          user
            ? `<span class="user-email">${user.email}</span>
               <button id="logoutBtn" class="nav-button">Log out</button>`
            : `<a href="login.html" class="nav-button">Log in</a>`
        }
  //     </div>
  //   </nav>
  // `;

  document.querySelector("#logoutBtn")?.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "index.html";
  });
}

footer.innerHTML = `
  // <div class="footer-inner">
  //   <strong>URBAN THREADS</strong>
  //   <p>Streetwear for everyday life.</p>
  //   <small>© 2026 Urban Threads</small>
  // </div>
`;

onAuthStateChanged(auth, renderNavbar);
