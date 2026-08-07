# Urban Threads

A simple Firebase-powered streetwear e-commerce project built with HTML, CSS and JavaScript.

## Pages

- `index.html` — landing page
- `shop.html` — Firestore product catalogue
- `login.html` — Firebase Authentication
- `cart.html` — authenticated user's Firestore cart

## Setup

1. Create a Firebase project.
2. Enable Email/Password Authentication.
3. Create a Firestore Database.
4. Register a Web App in Firebase.
5. Copy the Firebase configuration into `firebase.js`.
6. Create a `products` collection.
7. Add product documents with:
   - `name`
   - `price`
   - `category`
   - `description`
   - `imageURL`
8. Apply the rules in `firestore.rules`.
9. Run the project using a local development server such as VS Code Live Server.

## Important

Do not commit private service-account credentials. The Web Firebase config is normally used client-side, but Firestore Security Rules must protect user data.
