import { auth, db } from "../firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

import {
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";


const ordersList =
  document.querySelector("#ordersList");


onAuthStateChanged(
  auth,
  async (user) => {

    if (!user) {

      window.location.href =
        "login.html";

      return;

    }


    try {

      const ordersQuery =
        query(
          collection(db, "orders"),
          where(
            "userId",
            "==",
            user.uid
          )
        );


      const snapshot =
        await getDocs(
          ordersQuery
        );


      if (snapshot.empty) {

        ordersList.innerHTML = `

          <div class="empty-state">

            <h2>
              No orders yet.
            </h2>

            <p>
              Start shopping to see your orders here.
            </p>

            <br>

            <a
              href="shop.html"
              class="btn"
            >
              Shop now
            </a>

          </div>

        `;

        return;

      }


      ordersList.innerHTML =
        snapshot.docs
          .map((orderDoc) => {

            const order =
              orderDoc.data();


            return `

              <article class="summary-card">

                <div class="summary-row">

                  <strong>
                    Order
                  </strong>

                  <span>
                    ${orderDoc.id}
                  </span>

                </div>


                <div class="summary-row">

                  <strong>
                    Status
                  </strong>

                  <strong>
                    ${order.status || "pending"}
                  </strong>

                </div>


                <div class="summary-row">

                  <strong>
                    Items
                  </strong>

                  <span>
                    ${order.items?.length || 0}
                  </span>

                </div>


                <div class="summary-row total">

                  <strong>
                    Total
                  </strong>

                  <strong>
                    R${Number(
                      order.total || 0
                    ).toFixed(2)}
                  </strong>

                </div>

              </article>

            `;

          })
          .join("");


    } catch (error) {

      console.error(
        "Orders error:",
        error
      );


      ordersList.innerHTML = `

        <div class="empty-state">

          <h2>
            Unable to load orders.
          </h2>

        </div>

      `;

    }

  }
);