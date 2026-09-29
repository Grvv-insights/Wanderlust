# Wanderlust


# 🧭 Wanderlust — Full-Stack Vacation Rental Platform

Wanderlust is a full-stack web application inspired by Airbnb, built to explore, host, and review unique accommodations worldwide. Built using the **MERN** architecture with **EJS** dynamic templating, the application features interactive location mapping, Cloudinary image hosting, Passport session authentication, and dynamic tax calculation toggles.

---

## ✨ Key Features

- **User Authentication & Authorization:** Secure signup, login, and session persistence powered by Passport.js and custom middleware authorization.
- **Listing Management (CRUD):** Users can create, edit, view, and delete property listings with image uploading via Cloudinary.
- **Interactive Maps:** Real-time geocoding and location visualization using Mapbox GL JS (`public/js/map.js`).
- **Category Filtering:** Filter stays dynamically across categories (*Trending*, *Mountains*, *Castles*, *Pools*, *Iconic Cities*, etc.) via navbar controls.
- **Review System:** Rate and leave reviews for hosted properties with cascading deletion handling.
- **Form Validation & Error Handling:** Schema validation powered by Joi (`listing_schema.js`) and custom asynchronous wrappers (`wrapAsync.js`, `ExpressError.js`).
- **Dynamic Tax Display:** Client-side toggle calculating total cost inclusive of 18% GST in real-time (`public/js/navbar.js`).

---

## 🛠️ Tech Stack

- **Frontend:** EJS (Embedded JavaScript), Bootstrap 5, Custom CSS (`navbar.css`, `review_rating.css`, `style.css`), Client-side JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas, Mongoose ODM
- **Authentication:** Passport.js, Passport-Local, Express-Session
- **APIs & Cloud Storage:** Mapbox SDK (Geocoding/Maps), Cloudinary (Image Hosting)

---

## 🚀 Getting Started

Follow these steps to run Wanderlust locally on your machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Git](https://git-scm.com/)
- A MongoDB Atlas Account or local MongoDB instance

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME.git](https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME.git)
   cd YOUR_REPOSITORY_NAME
   ```
