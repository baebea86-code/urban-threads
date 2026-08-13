import { db } from "../firebase.js";

import {
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";


const products = [

  {
    name: "Classic Black Hoodie",
    category: "Hoodies",
    price: 699,
    description: "A clean everyday hoodie with a relaxed streetwear fit.",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80"
  },

  {
    name: "Oversized Grey Hoodie",
    category: "Hoodies",
    price: 749,
    description: "Comfortable oversized hoodie designed for everyday wear.",
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80"
  },

  {
    name: "Essential White T-Shirt",
    category: "T-shirts",
    price: 299,
    description: "A simple heavyweight white tee for any outfit.",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80"
  },

  {
    name: "Urban Black T-Shirt",
    category: "T-shirts",
    price: 349,
    description: "Minimal black streetwear tee with a relaxed fit.",
    image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=800&q=80"
  },

  {
    name: "Classic White Sneakers",
    category: "Sneakers",
    price: 999,
    description: "Clean everyday sneakers designed to work with any fit.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"
  },

  {
    name: "Street Runner Sneakers",
    category: "Sneakers",
    price: 1199,
    description: "Comfortable sneakers with a modern streetwear silhouette.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"
  },

  {
    name: "Urban Cap",
    category: "Accessories",
    price: 249,
    description: "A simple everyday cap to finish your streetwear look.",
    image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=800&q=80"
  },

  {
    name: "Crossbody Bag",
    category: "Accessories",
    price: 399,
    description: "Compact crossbody bag for everyday essentials.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80"
  }

];


async function seedProducts() {

  try {

    const productsRef =
      collection(db, "products");


    for (const product of products) {

      await addDoc(
        productsRef,
        product
      );

      console.log(
        "Added product:",
        product.name
      );

    }


    console.log(
      "ALL PRODUCTS ADDED SUCCESSFULLY!"
    );


    document.querySelector("#status").textContent =
      "All products added successfully!";


  } catch (error) {

    console.error(
      "PRODUCT SEEDING ERROR:",
      error
    );


    document.querySelector("#status").textContent =
      "There was an error. Check the console.";

  }

}


seedProducts();