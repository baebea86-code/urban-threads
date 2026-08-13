import { db } from "../firebase.js";

import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";


const products = [

  {
    id: "urban-essential-tee",
    name: "Urban Essential Tee",
    category: "T-shirts",
    description: "Classic everyday cotton tee",
    image: "https://plus.unsplash.com/premium_photo-1673356301535-2cc45bcc79e4?w=1200&auto=format&fit=crop&q=60",
    price: 300,
    stock: 28
  },

  {
    id: "classic-black-tee",
    name: "Classic Black Tee",
    category: "T-shirts",
    description: "A clean black tee made for everyday streetwear.",
    image: "https://images.unsplash.com/photo-1773525911716-a24c634a1319?w=1200&auto=format&fit=crop&q=60",
    price: 329,
    stock: 25
  },

  {
    id: "essential-black-hoodie",
    name: "Essential Black Hoodie",
    category: "Hoodies",
    description: "A comfortable everyday hoodie with a clean urban look.",
    image: "https://media.istockphoto.com/id/2255391316/photo/pink-luxury-women-hoodie-sweatshirt-with-zipper-isolated-on-white-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=1OLZtGTSpr-mxBRXhaCk1KRHGuRNGCjy9grIbsc4Be8=",
    price: 499,
    stock: 20
  },

  {
    id: "oversized-grey-hoodie",
    name: "Oversized Grey Hoodie",
    category: "Hoodies",
    description: "Relaxed oversized fit for effortless streetwear.",
    image: "https://images.unsplash.com/photo-1650287052182-a13d8245c927?w=1200&auto=format&fit=crop&q=60",
    price: 549,
    stock: 18
  },

  {
    id: "street-runner",
    name: "Street Runner",
    category: "Sneakers",
    description: "Everyday sneakers designed for comfort and city style.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1170&auto=format&fit=crop",
    price: 899,
    stock: 15
  },

  {
    id: "classic-white-sneaker",
    name: "Classic White Sneaker",
    category: "Sneakers",
    description: "A clean everyday sneaker that goes with everything.",
    image: "https://media.istockphoto.com/id/1140990766/photo/sneakers-are-red-sports-with-a-white-sole-there-is-a-shadow-close-up-on-a-black-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=HpTOhcw0asymGqu3E2Fs-blcYHlKsz0uI0GOap5JBNg=",
    price: 999,
    stock: 12
  },

  {
    id: "urban-cap",
    name: "Urban Cap",
    category: "Accessories",
    description: "A minimal everyday cap to complete your streetwear look.",
    image: "https://images.unsplash.com/photo-1537832816519-689ad163238b?w=1200&auto=format&fit=crop&q=60",
    price: 199,
    stock: 30
  },

  {
    id: "crossbody-bag",
    name: "Crossbody Bag",
    category: "Accessories",
    description: "A compact everyday bag for essentials on the move.",
    image: "https://images.unsplash.com/photo-1575201647632-45fae95c9ce4?w=1200&auto=format&fit=crop&q=60",
    price: 349,
    stock: 20
  }

];


async function seedProducts() {

  try {

    for (const product of products) {

      const productRef =
        doc(db, "products", product.id);

      await setDoc(productRef, {

        name: product.name,

        category: product.category,

        description: product.description,

        image: product.image,

        price: product.price,

        stock: product.stock

      });

      console.log(
        `Added/updated: ${product.name}`
      );

    }

    console.log(
      "SUCCESS: All 8 products have been added."
    );

  } catch (error) {

    console.error(
      "Error adding products:",
      error
    );

  }

}


seedProducts();