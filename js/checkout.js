import { auth } from "../firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";


const checkoutForm =
  document.querySelector("#checkoutForm");

const checkoutTotal =
  document.querySelector("#checkoutTotal");

const checkoutMessage =
  document.querySelector("#checkoutMessage");


let cart =
  JSON.parse(localStorage.getItem("cart")) || [];


/* =========================
   PROTECT CHECKOUT
========================= */

onAuthStateChanged(auth, (user) => {

  if (!user) {

    alert("Please log in to checkout.");

    window.location.href =
      "login.html";

    return;
  }


  if (cart.length === 0) {

    alert("Your cart is empty.");

    window.location.href =
      "shop.html";

    return;
  }


  displayTotal();

});


/* =========================
   CALCULATE TOTAL
========================= */

function displayTotal() {

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


  checkoutTotal.textContent =
    `R${total.toFixed(2)}`;

}


/* =========================
   PLACE ORDER
========================= */

checkoutForm.addEventListener(
  "submit",
  (event) => {

    event.preventDefault();


    if (cart.length === 0) {

      checkoutMessage.textContent =
        "Your cart is empty.";

      return;
    }


    const fullName =
      document
        .querySelector("#fullName")
        .value
        .trim();


    const address =
      document
        .querySelector("#address")
        .value
        .trim();


    const city =
      document
        .querySelector("#city")
        .value
        .trim();


    const phone =
      document
        .querySelector("#phone")
        .value
        .trim();


    const order = {

      id:
        `UT-${Date.now()}`,

      customer: {

        name:
          fullName,

        address:
          address,

        city:
          city,

        phone:
          phone,

        email:
          auth.currentUser.email

      },

      items:
        cart,

      createdAt:
        new Date().toISOString()

    };


    console.log(
      "ORDER:",
      order
    );


    /* CLEAR CART */

    localStorage.removeItem(
      "cart"
    );


    /* CLEAR FORM */

    checkoutForm.reset();


    /* SHOW SUCCESS */

    checkoutMessage.textContent =
      `Order ${order.id} placed successfully!`;


    setTimeout(() => {

      window.location.href =
        "index.html";

    }, 2500);

  }
);