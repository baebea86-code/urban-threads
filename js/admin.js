import { auth, db } from "../firebase.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";


/* =========================
   ADMIN ACCOUNT
========================= */

const ADMIN_EMAIL = "YOUR_EMAIL@example.com";


/* =========================
   DASHBOARD ELEMENTS
========================= */

const productCount =
  document.querySelector("#productCount");

const orderCount =
  document.querySelector("#orderCount");

const revenue =
  document.querySelector("#revenue");

const adminOrders =
  document.querySelector("#adminOrders");


/* =========================
   LOAD DASHBOARD
========================= */

async function loadDashboard() {

  try {

    /* PRODUCTS */

    const productsSnapshot =
      await getDocs(
        collection(db, "products")
      );


    productCount.textContent =
      productsSnapshot.size;


    /* ORDERS */

    const ordersSnapshot =
      await getDocs(
        collection(db, "orders")
      );


    orderCount.textContent =
      ordersSnapshot.size;


    let totalRevenue = 0;


    const orders =
      ordersSnapshot.docs.map((doc) => ({

        id: doc.id,

        ...doc.data()

      }));


    orders.forEach((order) => {

      totalRevenue +=
        Number(order.total) || 0;

    });


    revenue.textContent =
      `R${totalRevenue.toFixed(2)}`;


    renderOrders(orders);


  } catch (error) {

    console.error(
      "Dashboard error:",
      error
    );


    adminOrders.innerHTML = `

      <div class="empty-state">

        <h2>
          Unable to load dashboard.
        </h2>

        <p>
          Check your Firestore connection and permissions.
        </p>

      </div>

    `;

  }

}


/* =========================
   RENDER ORDERS
========================= */

function renderOrders(orders) {

  if (orders.length === 0) {

    adminOrders.innerHTML = `

      <div class="empty-state">

        <h2>
          No orders yet.
        </h2>

        <p>
          Orders will appear here when customers place them.
        </p>

      </div>

    `;

    return;
  }


  adminOrders.innerHTML =
    orders
      .map((order) => {

        return `

          <article class="summary-card">

            <div class="summary-row">

              <strong>
                Order
              </strong>

              <span>
                ${order.id}
              </span>

            </div>


            <div class="summary-row">

              <strong>
                Customer
              </strong>

              <span>
                ${order.customer?.email || "Unknown"}
              </span>

            </div>


            <div class="summary-row">

              <strong>
                Status
              </strong>

              <span>
                ${order.status || "pending"}
              </span>

            </div>


            <div class="summary-row total">

              <strong>
                Total
              </strong>

              <strong>
                R${Number(order.total || 0).toFixed(2)}
              </strong>

            </div>

          </article>

        `;

      })
      .join("");

}


/* =========================
   ADMIN AUTHENTICATION
========================= */

onAuthStateChanged(auth, (user) => {

  /* USER IS NOT LOGGED IN */

  if (!user) {

    alert(
      "Please log in to access the admin dashboard."
    );

    window.location.href =
      "login.html";

    return;
  }


  /* USER IS LOGGED IN BUT NOT ADMIN */

  if (user.email !== ADMIN_EMAIL) {

    alert(
      "You do not have permission to access the admin dashboard."
    );

    window.location.href =
      "index.html";

    return;
  }


  /* USER IS ADMIN */

  console.log(
    "Admin access granted."
  );

  loadDashboard();

});