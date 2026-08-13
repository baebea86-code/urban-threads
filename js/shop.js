import { db } from "../firebase.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";


const productGrid =
  document.querySelector("#productGrid");

const searchInput =
  document.querySelector("#searchInput");

const categorySelect =
  document.querySelector("#categorySelect");


let products = [];

let filteredProducts = [];


/* =========================
   LOAD PRODUCTS
========================= */

async function loadProducts() {

  try {

    productGrid.innerHTML =
      `<p class="message">Loading products...</p>`;


    const productsSnapshot =
      await getDocs(
        collection(db, "products")
      );


    products =
      productsSnapshot.docs.map((doc) => ({

        id: doc.id,

        ...doc.data()

      }));


    filteredProducts = [...products];


    renderProducts();

  } catch (error) {

    console.error(
      "Error loading products:",
      error
    );


    productGrid.innerHTML = `
      <p class="message">
        Unable to load products. Please try again.
      </p>
    `;

  }

}


/* =========================
   RENDER PRODUCTS
========================= */

function renderProducts() {

  if (filteredProducts.length === 0) {

    productGrid.innerHTML = `
      <div class="empty-state">

        <h2>
          No products found.
        </h2>

        <p>
          Try another search or category.
        </p>

      </div>
    `;

    return;
  }


  productGrid.innerHTML =
    filteredProducts
      .map((product) => {

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


                <button
                  class="add-btn"
                  data-id="${product.id}"
                >
                  Add to Cart
                </button>

              </div>

            </div>

          </article>

        `;

      })
      .join("");

}


/* =========================
   SEARCH
========================= */

searchInput.addEventListener(
  "input",
  () => {

    const searchTerm =
      searchInput.value
        .toLowerCase()
        .trim();


    filterProducts(
      searchTerm,
      categorySelect.value
    );

  }
);


/* =========================
   CATEGORY FILTER
========================= */

categorySelect.addEventListener(
  "change",
  () => {

    filterProducts(
      searchInput.value
        .toLowerCase()
        .trim(),

      categorySelect.value

    );

  }
);


/* =========================
   FILTER PRODUCTS
========================= */

function filterProducts(
  searchTerm,
  category
) {

  filteredProducts =
    products.filter((product) => {

      const matchesSearch =
        product.name
          .toLowerCase()
          .includes(searchTerm);


      const matchesCategory =
        category === "all" ||
        product.category === category;


      return (
        matchesSearch &&
        matchesCategory
      );

    });


  renderProducts();

}


/* =========================
   ADD TO CART
========================= */

productGrid.addEventListener(
  "click",
  (event) => {

    const button =
      event.target.closest(".add-btn");


    if (!button) {
      return;
    }


    const productId =
      button.dataset.id;


    const product =
      products.find(
        (item) =>
          item.id === productId
      );


    if (!product) {
      return;
    }


    addToCart(product);

  }
);


/* =========================
   ADD PRODUCT TO CART
========================= */

function addToCart(product) {

  let cart =
    JSON.parse(
      localStorage.getItem("cart")
    ) || [];


  const existingProduct =
    cart.find(
      (item) =>
        item.id === product.id
    );


  if (existingProduct) {

    existingProduct.quantity += 1;

  } else {

    cart.push({

      id: product.id,

      name: product.name,

      price: product.price,

      image: product.image,

      quantity: 1

    });

  }


  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );


  alert(
    `${product.name} added to your cart!`
  );

}


/* =========================
   START
========================= */

loadProducts();