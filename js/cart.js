import { auth } from "../firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";


const cartItemsContainer =
  document.querySelector("#cartItems");

const cartSubtotal =
  document.querySelector("#cartSubtotal");

const cartShipping =
  document.querySelector("#cartShipping");

const cartTotal =
  document.querySelector("#cartTotal");


let cart =
  JSON.parse(localStorage.getItem("cart")) || [];


/* =========================
   AUTHENTICATION
========================= */

onAuthStateChanged(auth, (user) => {

  if (!user) {

    alert("Please log in to access your cart.");

    window.location.href = "login.html";

    return;
  }

  renderCart();

});


/* =========================
   SAVE CART
========================= */

function saveCart() {

  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );

}


/* =========================
   FORMAT PRICE
========================= */

function formatPrice(price) {

  return `R${Number(price).toFixed(2)}`;

}


/* =========================
   RENDER CART
========================= */

function renderCart() {

  if (cart.length === 0) {

    cartItemsContainer.innerHTML = `

      <div class="empty-state">

        <h2>
          Your cart is empty.
        </h2>

        <p>
          Looks like you haven't added anything yet.
        </p>

        <br>

        <a
          href="shop.html"
          class="btn"
        >
          Continue Shopping
        </a>

      </div>

    `;


    cartSubtotal.textContent =
      "R0.00";

    cartShipping.textContent =
      "R0.00";

    cartTotal.textContent =
      "R0.00";

    return;
  }


  cartItemsContainer.innerHTML =
    cart
      .map((item) => {

        return `

          <article class="cart-item">

            <img
              src="${item.image}"
              alt="${item.name}"
            >


            <div>

              <span class="product-category">
                Product
              </span>


              <h3>
                ${item.name}
              </h3>


              <strong>
                ${formatPrice(item.price)}
              </strong>


              <div class="quantity-controls">


                <button
                  class="quantity-btn"
                  data-action="decrease"
                  data-id="${item.id}"
                >
                  −
                </button>


                <span>
                  ${item.quantity}
                </span>


                <button
                  class="quantity-btn"
                  data-action="increase"
                  data-id="${item.id}"
                >
                  +
                </button>


                <button
                  class="remove-btn"
                  data-action="remove"
                  data-id="${item.id}"
                >
                  Remove
                </button>


              </div>

            </div>


            <strong>
              ${formatPrice(
                item.price * item.quantity
              )}
            </strong>


          </article>

        `;

      })
      .join("");


  updateSummary();

}


/* =========================
   UPDATE SUMMARY
========================= */

function updateSummary() {

  const subtotal =
    cart.reduce(
      (total, item) => {

        return (
          total +
          Number(item.price) *
          item.quantity
        );

      },
      0
    );


  const shipping =
    subtotal > 0
      ? 60
      : 0;


  const total =
    subtotal + shipping;


  cartSubtotal.textContent =
    formatPrice(subtotal);

  cartShipping.textContent =
    formatPrice(shipping);

  cartTotal.textContent =
    formatPrice(total);

}


/* =========================
   CART BUTTONS
========================= */

cartItemsContainer.addEventListener(
  "click",
  (event) => {

    const button =
      event.target.closest("button");


    if (!button) {
      return;
    }


    const productId =
      button.dataset.id;


    const action =
      button.dataset.action;


    const product =
      cart.find(
        (item) =>
          item.id === productId
      );


    if (!product) {
      return;
    }


    /* INCREASE */

    if (action === "increase") {

      product.quantity += 1;

    }


    /* DECREASE */

    if (action === "decrease") {

      product.quantity -= 1;


      if (product.quantity <= 0) {

        cart =
          cart.filter(
            (item) =>
              item.id !== productId
          );

      }

    }


    /* REMOVE */

    if (action === "remove") {

      cart =
        cart.filter(
          (item) =>
            item.id !== productId
        );

    }


    saveCart();

    renderCart();

  }
);