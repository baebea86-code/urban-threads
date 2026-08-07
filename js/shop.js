import { db } from "../firebase.js";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { auth } from "../firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const productGrid = document.querySelector("#productGrid");
const searchInput = document.querySelector("#searchInput");
const categoryFilter = document.querySelector("#categoryFilter");
const shopMessage = document.querySelector("#shopMessage");

let products = [];
let currentUser = null;

onAuthStateChanged(auth, user => {
  currentUser = user;
});

async function loadProducts() {
  try {
    shopMessage.textContent = "Loading products...";
    const snapshot = await getDocs(collection(db, "products"));
    products = snapshot.docs.map(item => ({ id: item.id, ...item.data() }));
    renderProducts();
  } catch (error) {
    console.error(error);
    shopMessage.textContent = "Could not load products. Check your Firebase setup.";
  }
}

function renderProducts() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const category = categoryFilter.value;

  const filtered = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm);
    const matchesCategory = category === "all" || product.category === category;
    return matchesSearch && matchesCategory;
  });

  shopMessage.textContent = filtered.length ? "" : "No products found.";

  productGrid.innerHTML = filtered.map(product => `
    <article class="product-card">
      <div class="product-image-wrap">
        <img src="${product.imageURL}" alt="${product.name}" loading="lazy">
      </div>
      <div class="product-info">
        <p class="product-category">${product.category}</p>
        <h3>${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <div class="product-bottom">
          <strong>R${Number(product.price).toFixed(2)}</strong>
          <button class="add-btn" data-id="${product.id}">Add to cart</button>
        </div>
      </div>
    </article>
  `).join("");

  document.querySelectorAll(".add-btn").forEach(button => {
    button.addEventListener("click", () => addToCart(button.dataset.id));
  });
}

async function addToCart(productId) {
  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }

  const product = products.find(item => item.id === productId);
  if (!product) return;

  const cartRef = doc(db, "users", currentUser.uid, "cart", productId);
  const existing = await getDoc(cartRef);

  if (existing.exists()) {
    await setDoc(cartRef, {
      ...product,
      quantity: existing.data().quantity + 1
    });
  } else {
    await setDoc(cartRef, {
      ...product,
      quantity: 1
    });
  }

  alert(`${product.name} added to cart.`);
}

searchInput.addEventListener("input", renderProducts);
categoryFilter.addEventListener("change", renderProducts);

const params = new URLSearchParams(window.location.search);
const categoryFromURL = params.get("category");
if (categoryFromURL) categoryFilter.value = categoryFromURL;

loadProducts();
