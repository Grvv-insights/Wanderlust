# 🧭 Wanderlust — Full-Stack Vacation Rental Platform

Wanderlust is a full-stack web application inspired by Airbnb, built to explore, host, and review unique accommodations worldwide. Built using Node.js, Express, and EJS dynamic templating, the application features interactive location mapping, Cloudinary image hosting, Passport session authentication, and dynamic tax calculation toggles.

---

## ✨ Key Features

- **User Authentication & Authorization:** Secure signup, login, and session persistence powered by Passport.js with custom middleware authorization.
- **Listing Management (CRUD):** Full create, read, update, and delete functionality for listings with multipart image uploads managed via Cloudinary.
- **Seamless Session-Based Review Handling:** Preserves typed review comments and rating data in `req.session` when an unauthenticated user attempts to post, automatically submitting the review upon successful login.
- **Interactive Maps & Geocoding:** Real-time geocoding and interactive location visualization powered by Mapbox GL JS (`public/js/map.js`).
- **Category Filtering:** Filter properties dynamically across categories (*Trending*, *Rooms*, *Iconic Cities*, *Mountains*, *Castles*, *Pools*, *Camping*, *Farms*, *Arctic*, *Domes*, *Boats*) via persistent navbar controls.
- **Review & Rating System:** Leave detailed property feedback with interactive star ratings (Starability) and cascading deletion handling.
- **Schema Validation & Error Handling:** Strict request payload validation using Joi (`schema.js`) combined with central asynchronous error wrappers (`wrapAsync.js`, `ExpressError.js`).
- **Dynamic Tax Display:** Client-side toggle calculating and updating total stay prices inclusive of 18% GST in real-time (`public/js/navbar.js`).
- **Pixel-Perfect Responsive UI:** Adaptive multi-breakpoint navbar layout supporting fluid desktop navigation, category scrolling, and compact mobile action triggers.

---

## 🛠️ Tech Stack

- **Frontend:** EJS (Embedded JavaScript), Bootstrap 5, FontAwesome 6, Starability.css, Custom CSS (`style.css`, `navbar.css`), Client-side Vanilla JS
- **Backend:** Node.js, Express.js
- **Database & Session Storage:** MongoDB Atlas, Mongoose ODM, `connect-mongo` (Session Store)
- **Authentication & Flash Alerts:** Passport.js, Passport-Local, Express-Session, Connect-Flash
- **Validation & File Handling:** Joi Schema Validation, Multer, `multer-storage-cloudinary`
- **APIs & Cloud Services:** Mapbox SDK (Geocoding/Maps), Cloudinary (Image Hosting & Optimization)

---

## 🚀 Getting Started

Follow these steps to set up and run Wanderlust locally on your machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Git](https://git-scm.com/)
- A MongoDB Atlas account (or local MongoDB instance)
- Cloudinary and Mapbox developer credentials

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME.git](https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME.git)
   cd YOUR_REPOSITORY_NAME
   ```
