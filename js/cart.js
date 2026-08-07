import { auth, db } from "../firebase.js";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const cartContent = document.querySelector("#cartContent");

onAuthStateChanged(auth, user => {
  if (!user) {
    cartContent.innerHTML = `
      <div class="empty-state">
        <h2>Please log in to view your cart.</h2>
        <a class="btn" href="login.html">Log in</a>
      </div>
    `;
    return;
  }

  loadCart(user.uid);
});

async function loadCart(uid) {
  const snapshot = await getDocs(collection(db, "users", uid, "cart"));
  const items = snapshot.docs.map(item => ({ id: item.id, ...item.data() }));

  if (!items.length) {
    cartContent.innerHTML = `
      <div class="empty-state">
        <h2>Your cart is empty.</h2>
        <a class="btn" href="shop.html">Continue shopping</a>
      </div>
    `;
    return;
  }

  const total = items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  cartContent.innerHTML = `
    <div class="cart-layout">
      <div class="cart-items">
        ${items.map(item => `
          <article class="cart-item">
            <img src="${item.imageURL}" alt="${item.name}">
            <div class="cart-item-info">
              <p class="product-category">${item.category}</p>
              <h3>${item.name}</h3>
              <p>R${Number(item.price).toFixed(2)} each</p>
              <div class="quantity-controls">
                <button class="quantity-btn" data-action="decrease" data-id="${item.id}">−</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" data-action="increase" data-id="${item.id}">+</button>
                <button class="remove-btn" data-id="${item.id}">Remove</button>
              </div>
            </div>
            <strong>R${(Number(item.price) * item.quantity).toFixed(2)}</strong>
          </article>
        `).join("")}
      </div>

      <aside class="summary-card">
        <h2>Order summary</h2>
        <div class="summary-row"><span>Items</span><span>${items.reduce((n, i) => n + i.quantity, 0)}</span></div>
        <div class="summary-row total"><span>Total</span><strong>R${total.toFixed(2)}</strong></div>
        <button class="btn full" id="checkoutBtn">Checkout</button>
        <p class="checkout-note">Checkout is simulated for this assignment.</p>
      </aside>
    </div>
  `;

  document.querySelectorAll(".quantity-btn").forEach(button => {
    button.addEventListener("click", () =>
      changeQuantity(uid, button.dataset.id, button.dataset.action, items)
    );
  });

  document.querySelectorAll(".remove-btn").forEach(button => {
    button.addEventListener("click", () => removeItem(uid, button.dataset.id));
  });

  document.querySelector("#checkoutBtn").addEventListener("click", () => {
    alert("Checkout complete! This is a demo store.");
  });
}

async function changeQuantity(uid, id, action, items) {
  const item = items.find(product => product.id === id);
  const newQuantity = action === "increase"
    ? item.quantity + 1
    : item.quantity - 1;

  if (newQuantity <= 0) {
    await removeItem(uid, id);
    return;
  }

  await updateDoc(doc(db, "users", uid, "cart", id), {
    quantity: newQuantity
  });

  loadCart(uid);
}

async function removeItem(uid, id) {
  await deleteDoc(doc(db, "users", uid, "cart", id));
  loadCart(uid);
}
