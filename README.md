# 🛒 E-Commerce Web Application

This is a full-stack E-Commerce web application where users can upload, view, and manage product listings. It supports image uploads via **Cloudinary**, secure **RESTful APIs**, contextual **keyword-based product search**, and uses **PostgreSQL** as the primary database for robust and scalable data storage.

---

## 🚀 What's Working

- ✅ Product listing and management with image upload
- ✅ Cloudinary integration for image hosting
- ✅ Keyword-based search functionality
- ✅ Secure REST API endpoints for products, cart, and wishlist
- ✅ PostgreSQL integration for backend data handling
- ✅ Responsive UI with Tailwind CSS and React
- ✅ Wishlist and Cart management
- ✅ Deployed frontend and backend

---

## 🛠️ Setup Instructions

### Prerequisites

- Node.js ≥ 16.x
- PostgreSQL
- A `.env` file configured with the required variables (example below)
- Cloudinary account (for image uploads)

---

### 🖥 Backend Setup

1. Clone the repository:

```bash
git clone https://github.com/its-AkshatJain/E-commerce.git
cd E-commerce/server
````

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the `server` directory:

```env
PORT=5000
DB_USER=your_db_user
DB_HOST=your_db_host
DB_NAME=your_db_name
DB_PASSWORD=your_db_password
DB_PORT=your_db_port

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

CLIENT_URL=http://localhost:5173
```

4. Start the backend server:

```bash
npm start
```

---

### 💻 Frontend Setup

1. Navigate to the client directory:

```bash
cd ../client
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the `client` directory:

```env
VITE_SERVER_URL=http://localhost:5000
```

> ⚠️ For production, replace `http://localhost:5000` with your deployed backend URL, e.g.:
>
> ```env
> VITE_SERVER_URL=https://e-commerce-1-1mxd.onrender.com
> ```

4. Start the frontend development server:

```bash
npm run dev
```

---

## 🧾 Tech Stack

* **Frontend**: React, Tailwind CSS, Axios, React Router
* **Backend**: Node.js, Express, PostgreSQL, Cloudinary
* **Database**: PostgreSQL (hosted on Aiven)
* **Deployment**: Render (backend), Vercel/Render (frontend)

---

## 🙌 Author

**Akshat Jain**
[Portfolio](https://portfolio-website-akshat-jain.vercel.app)

---

Feel free to contribute or report issues!

```
