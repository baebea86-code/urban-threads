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

const checkoutTotal =
  document.querySelector("#checkoutTotal");

const checkoutMessage =
  document.querySelector("#checkoutMessage");


let cart =
  JSON.parse(localStorage.getItem("cart")) || [];


/* =========================
   CHECK USER
========================= */

onAuthStateChanged(auth, (user) => {

  if (!user) {

    alert("Please log in to checkout.");

    window.location.href = "login.html";

    return;
  }


  if (cart.length === 0) {

    alert("Your cart is empty.");

    window.location.href = "shop.html";

    return;
  }


  displayTotal();

});


/* =========================
   DISPLAY TOTAL
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
  async (event) => {

    event.preventDefault();


    const user =
      auth.currentUser;


    if (!user) {

      checkoutMessage.textContent =
        "Please log in before placing your order.";

      return;
    }


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


    /* =========================
       ORDER DATA
    ========================= */

    const order = {

      userId:
        user.uid,

      customer: {

        name:
          fullName,

        email:
          user.email,

        address:
          address,

        city:
          city,

        phone:
          phone

      },


      items:
        cart.map((item) => ({

          productId:
            item.id,

          name:
            item.name,

          price:
            Number(item.price),

          quantity:
            item.quantity,

          image:
            item.image

        })),


      subtotal:
        subtotal,

      shipping:
        shipping,

      total:
        total,

      status:
        "pending",

      createdAt:
        serverTimestamp()

    };


    try {

      checkoutMessage.textContent =
        "Placing your order...";


      /* =========================
         SAVE TO FIRESTORE
      ========================= */

      const orderRef =
        await addDoc(
          collection(db, "orders"),
          order
        );


      console.log(
        "Order successfully created:",
        orderRef.id
      );


      /* =========================
         CLEAR CART
      ========================= */

      localStorage.removeItem("cart");


      /* =========================
         SUCCESS MESSAGE
      ========================= */

      checkoutMessage.textContent =
        `Order ${orderRef.id} placed successfully!`;


      checkoutForm.reset();


      /* =========================
         REDIRECT
      ========================= */

      setTimeout(() => {

        window.location.href =
          "index.html";

      }, 3000);


    } catch (error) {

      console.error(
        "Error placing order:",
        error
      );


      checkoutMessage.textContent =
        "Something went wrong while placing your order. Please try again.";

    }

  }
);