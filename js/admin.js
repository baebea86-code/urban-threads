import { auth, db } from "../firebase.js";

import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";


/* =========================
   ADMIN ACCOUNT
========================= */

const ADMIN_EMAIL = "YOUR_EMAIL@example.com";


/* =========================
   ELEMENTS
========================= */

const productCount =
  document.querySelector("#productCount");

const orderCount =
  document.querySelector("#orderCount");

const revenue =
  document.querySelector("#revenue");

const adminOrders =
  document.querySelector("#adminOrders");

const adminProducts =
  document.querySelector("#adminProducts");

const productForm =
  document.querySelector("#productForm");

const productMessage =
  document.querySelector("#productMessage");


let editingProductId = null;


/* =========================
   LOAD DASHBOARD
========================= */

async function loadDashboard() {

  try {

    const productsSnapshot =
      await getDocs(
        collection(db, "products")
      );


    productCount.textContent =
      productsSnapshot.size;


    const ordersSnapshot =
      await getDocs(
        collection(db, "orders")
      );


    orderCount.textContent =
      ordersSnapshot.size;


    let totalRevenue = 0;


    const orders =
      ordersSnapshot.docs.map((orderDoc) => ({

        id: orderDoc.id,

        ...orderDoc.data()

      }));


    orders.forEach((order) => {

      totalRevenue +=
        Number(order.total) || 0;

    });


    revenue.textContent =
      `R${totalRevenue.toFixed(2)}`;


    renderProducts(
      productsSnapshot
    );


    renderOrders(
      orders
    );


  } catch (error) {

    console.error(
      "Dashboard error:",
      error
    );

  }

}


/* =========================
   ADD / EDIT PRODUCT
========================= */

productForm.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();


    const name =
      document
        .querySelector("#productName")
        .value
        .trim();


    const price =
      Number(
        document
          .querySelector("#productPrice")
          .value
      );


    const category =
      document
        .querySelector("#productCategory")
        .value;


    const description =
      document
        .querySelector("#productDescription")
        .value
        .trim();


    const image =
      document
        .querySelector("#productImage")
        .value
        .trim();


    const productData = {

      name,

      price,

      category,

      description,

      image

    };


    try {

      productMessage.textContent =
        editingProductId
          ? "Updating product..."
          : "Adding product...";


      if (editingProductId) {

        await updateDoc(
          doc(
            db,
            "products",
            editingProductId
          ),
          productData
        );


        productMessage.textContent =
          "Product updated successfully!";


        editingProductId = null;


        productForm.querySelector(
          "button[type='submit']"
        ).textContent =
          "Add Product";


      } else {

        await addDoc(
          collection(db, "products"),
          productData
        );


        productMessage.textContent =
          "Product added successfully!";

      }


      productForm.reset();


      await loadDashboard();


    } catch (error) {

      console.error(
        "Product save error:",
        error
      );


      productMessage.textContent =
        "Unable to save product.";

    }

  }
);


/* =========================
   RENDER PRODUCTS
========================= */

function renderProducts(snapshot) {

  if (snapshot.empty) {

    adminProducts.innerHTML = `

      <div class="empty-state">

        <h2>
          No products yet.
        </h2>

      </div>

    `;

    return;
  }


  adminProducts.innerHTML =
    snapshot.docs
      .map((productDoc) => {

        const product =
          productDoc.data();


        return `

          <article class="product-card">

            <div class="product-image-wrap">

              <img
                src="${product.image}"
                alt="${product.name}"
              >

            </div>


            <div class="product-info">

              <span class="product-category">
                ${product.category}
              </span>


              <h3>
                ${product.name}
              </h3>


              <p class="product-description">
                ${product.description}
              </p>


              <div class="product-bottom">

                <strong>
                  R${Number(product.price).toFixed(2)}
                </strong>


                <div>

                  <button
                    class="nav-button edit-product"
                    data-id="${productDoc.id}"
                  >
                    Edit
                  </button>


                  <button
                    class="remove-btn delete-product"
                    data-id="${productDoc.id}"
                  >
                    Delete
                  </button>

                </div>

              </div>

            </div>

          </article>

        `;

      })
      .join("");


  /* EDIT */

  document
    .querySelectorAll(".edit-product")
    .forEach((button) => {

      button.addEventListener(
        "click",
        () => {

          const product =
            snapshot.docs.find(
              (item) =>
                item.id ===
                button.dataset.id
            );


          if (!product) {
            return;
          }


          startEditing(
            product.id,
            product.data()
          );

        }
      );

    });


  /* DELETE */

  document
    .querySelectorAll(".delete-product")
    .forEach((button) => {

      button.addEventListener(
        "click",
        () => {

          deleteProduct(
            button.dataset.id
          );

        }
      );

    });

}


/* =========================
   START EDITING
========================= */

function startEditing(
  productId,
  product
) {

  editingProductId =
    productId;


  document.querySelector(
    "#productName"
  ).value =
    product.name || "";


  document.querySelector(
    "#productPrice"
  ).value =
    product.price || "";


  document.querySelector(
    "#productCategory"
  ).value =
    product.category || "";


  document.querySelector(
    "#productDescription"
  ).value =
    product.description || "";


  document.querySelector(
    "#productImage"
  ).value =
    product.image || "";


  productForm.querySelector(
    "button[type='submit']"
  ).textContent =
    "Update Product";


  productMessage.textContent =
    "Editing product...";


  productForm.scrollIntoView({
    behavior: "smooth"
  });

}


/* =========================
   DELETE PRODUCT
========================= */

async function deleteProduct(
  productId
) {

  const confirmed =
    confirm(
      "Are you sure you want to delete this product?"
    );


  if (!confirmed) {
    return;
  }


  try {

    await deleteDoc(
      doc(
        db,
        "products",
        productId
      )
    );


    await loadDashboard();


  } catch (error) {

    console.error(
      "Delete product error:",
      error
    );

  }

}


/* =========================
   RENDER ORDERS
========================= */

function renderOrders(
  orders
) {

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

        const status =
          order.status ||
          "pending";


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
                Total
              </strong>

              <strong>
                R${Number(order.total || 0).toFixed(2)}
              </strong>

            </div>


            <div class="summary-row">

              <strong>
                Status
              </strong>


              <select
                class="order-status"
                data-id="${order.id}"
              >

                <option
                  value="pending"
                  ${status === "pending" ? "selected" : ""}
                >
                  Pending
                </option>


                <option
                  value="processing"
                  ${status === "processing" ? "selected" : ""}
                >
                  Processing
                </option>


                <option
                  value="shipped"
                  ${status === "shipped" ? "selected" : ""}
                >
                  Shipped
                </option>


                <option
                  value="delivered"
                  ${status === "delivered" ? "selected" : ""}
                >
                  Delivered
                </option>

              </select>

            </div>

          </article>

        `;

      })
      .join("");


  /* STATUS CHANGES */

  document
    .querySelectorAll(".order-status")
    .forEach((select) => {

      select.addEventListener(
        "change",
        () => {

          updateOrderStatus(
            select.dataset.id,
            select.value
          );

        }
      );

    });

}


/* =========================
   UPDATE ORDER STATUS
========================= */

async function updateOrderStatus(
  orderId,
  newStatus
) {

  try {

    await updateDoc(
      doc(
        db,
        "orders",
        orderId
      ),
      {
        status: newStatus
      }
    );


    console.log(
      `Order ${orderId} updated to ${newStatus}`
    );


  } catch (error) {

    console.error(
      "Order status update error:",
      error
    );


    alert(
      "Unable to update order status."
    );

  }

}


/* =========================
   ADMIN AUTHENTICATION
========================= */

onAuthStateChanged(
  auth,
  (user) => {

    if (!user) {

      alert(
        "Please log in to access the admin dashboard."
      );


      window.location.href =
        "login.html";


      return;

    }


    if (user.email !== ADMIN_EMAIL) {

      alert(
        "You do not have permission to access the admin dashboard."
      );


      window.location.href =
        "index.html";


      return;

    }


    console.log(
      "Admin access granted."
    );


    loadDashboard();

  }
);