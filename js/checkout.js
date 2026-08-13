import { auth, db } from "../firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";


const checkoutForm =
  document.querySelector("#checkoutForm");

const checkoutItems =
  document.querySelector("#checkoutItems");

const checkoutTotal =
  document.querySelector("#checkoutTotal");

const checkoutMessage =
  document.querySelector("#checkoutMessage");


let currentUser = null;


/* =========================
   GET CART
========================= */

function getCart() {

  return JSON.parse(
    localStorage.getItem("urbanThreadsCart")
  ) || [];

}


/* =========================
   RENDER SUMMARY
========================= */

function renderCheckout() {

  const cart =
    getCart();


  if (cart.length === 0) {

    checkoutItems.innerHTML = `

      <div class="empty-state">

        <h2>
          Your cart is empty.
        </h2>

        <a
          href="shop.html"
          class="btn"
        >
          Shop now
        </a>

      </div>

    `;

    checkoutTotal.textContent =
      "R0.00";

    checkoutForm.style.display =
      "none";

    return;

  }


  let total = 0;


  checkoutItems.innerHTML =
    cart
      .map((item) => {

        const itemTotal =
          Number(item.price) *
          Number(item.quantity);


        total += itemTotal;


        return `

          <div class="checkout-item">

            <div>

              <strong>
                ${item.name}
              </strong>

              <p>
                ${item.quantity} ×
                R${Number(item.price).toFixed(2)}
              </p>

            </div>

            <strong>
              R${itemTotal.toFixed(2)}
            </strong>

          </div>

        `;

      })
      .join("");


  checkoutTotal.textContent =
    `R${total.toFixed(2)}`;

}


/* =========================
   AUTH
========================= */

onAuthStateChanged(
  auth,
  (user) => {

    if (!user) {

      window.location.href =
        "login.html";

      return;

    }


    currentUser = user;


    document.querySelector(
      "#customerEmail"
    ).value =
      user.email;


    renderCheckout();

  }
);


/* =========================
   PLACE ORDER
========================= */

checkoutForm.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();


    const cart =
      getCart();


    if (cart.length === 0) {

      checkoutMessage.textContent =
        "Your cart is empty.";

      return;

    }


    let total = 0;


    cart.forEach((item) => {

      total +=
        Number(item.price) *
        Number(item.quantity);

    });


    const customer = {

      name:
        document.querySelector(
          "#customerName"
        ).value.trim(),

      email:
        document.querySelector(
          "#customerEmail"
        ).value.trim(),

      phone:
        document.querySelector(
          "#customerPhone"
        ).value.trim(),

      address:
        document.querySelector(
          "#customerAddress"
        ).value.trim(),

      city:
        document.querySelector(
          "#customerCity"
        ).value.trim()

    };


    try {

      checkoutMessage.textContent =
        "Placing your order...";


      await addDoc(
        collection(db, "orders"),
        {

          userId:
            currentUser.uid,

          customer,

          items: cart,

          total,

          status: "pending",

          createdAt:
            serverTimestamp()

        }
      );


      localStorage.removeItem(
        "urbanThreadsCart"
      );


      checkoutMessage.textContent =
        "Order placed successfully!";


      setTimeout(() => {

        window.location.href =
          "index.html";

      }, 1500);


    } catch (error) {

      console.error(
        "Order error:",
        error
      );


      checkoutMessage.textContent =
        "Unable to place your order. Please try again.";

    }

  }
);