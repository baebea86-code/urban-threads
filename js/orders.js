import { auth, db } from "../firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

import {
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";


const ordersContainer =
  document.querySelector("#ordersContainer");


/* =========================
   CHECK USER
========================= */

onAuthStateChanged(auth, async (user) => {

  if (!user) {

    window.location.href =
      "login.html";

    return;
  }


  await loadOrders(user.uid);

});


/* =========================
   LOAD ORDERS
========================= */

async function loadOrders(userId) {

  try {

    const ordersRef =
      collection(db, "orders");


    const ordersQuery =
      query(
        ordersRef,
        where("userId", "==", userId)
      );


    const snapshot =
      await getDocs(ordersQuery);


    if (snapshot.empty) {

      ordersContainer.innerHTML = `

        <div class="empty-state">

          <h2>
            No orders yet.
          </h2>

          <p>
            Your orders will appear here after you make a purchase.
          </p>

          <br>

          <a
            href="shop.html"
            class="btn"
          >
            Start Shopping
          </a>

        </div>

      `;

      return;
    }


    const orders =
      snapshot.docs.map((doc) => ({

        id: doc.id,

        ...doc.data()

      }));


    renderOrders(orders);


  } catch (error) {

    console.error(
      "Error loading orders:",
      error
    );


    ordersContainer.innerHTML = `

      <div class="empty-state">

        <h2>
          Unable to load orders.
        </h2>

        <p>
          Please try again later.
        </p>

      </div>

    `;

  }

}


/* =========================
   RENDER ORDERS
========================= */

function renderOrders(orders) {

  ordersContainer.innerHTML =
    orders
      .map((order) => {

        const date =
          order.createdAt?.toDate
            ? order.createdAt.toDate().toLocaleDateString()
            : "Date unavailable";


        const items =
          order.items
            .map((item) => `

              <div class="order-product">

                <span>
                  ${item.name}
                </span>

                <span>
                  × ${item.quantity}
                </span>

              </div>

            `)
            .join("");


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

              <span>
                Date
              </span>

              <span>
                ${date}
              </span>

            </div>


            <div class="summary-row">

              <span>
                Status
              </span>

              <strong>
                ${order.status}
              </strong>

            </div>


            <div>

              <h3>
                Items
              </h3>

              ${items}

            </div>


            <div class="summary-row total">

              <span>
                Total
              </span>

              <strong>
                R${Number(order.total).toFixed(2)}
              </strong>

            </div>

          </article>

        `;

      })
      .join("");

}