# SSFullStackUI

A full-stack student management system UI built using **React (Vite)** with **TailwindCSS** for styling and **Axios** for API communication.  
This project allows you to manage students with fields like **name, email, mobile, gender, country, state, and district**.  
It is designed to connect with a Node.js + Express + MongoDB backend.

---

## ✨ Features

- Add, update, and delete student records
- Dropdowns for country, state, and district selection (fetched dynamically)
- Gender selection using radio buttons
- Clean UI built with **TailwindCSS**
- Integrated with REST APIs using Axios
- SweetAlert2 notifications for success/error messages
- Image upload and CSV export functionality

---

## 🛠️ Tech Stack

- **Frontend:** React + Vite  
- **Styling:** TailwindCSS  
- **HTTP Client:** Axios  
- **Notifications:** SweetAlert2  
- **Backend (separate, in `/Backend`):** Node.js, Express, MongoDB

---

## 🏗️ System Design

### Frontend

- Built with React (bootstrapped by Vite)
- Component-based architecture (pages, layout, features)
- State and CRUD handled via Axios and REST calls to backend
- TailwindCSS for responsive and modern UI
- SweetAlert2 for interactive notifications
- Features include pagination, CSV export, multi-select dropdowns, and image upload

### Backend

- Node.js and Express REST API (see `/Backend` directory)
- MongoDB for database (connection via Mongoose)
- Routes for students, countries, states, districts, languages, image upload
- Supports multipart/form-data for image uploads (via multer)
- CORS enabled for frontend-backend communication

### Data Flow

1. **Frontend** sends HTTP requests to backend (e.g., fetch/add/update/delete student, upload image)
2. **Backend** processes requests, interacts with MongoDB, and serves data or files
3. **Frontend** updates UI and notifies user with SweetAlert2
4. **Image files** are uploaded to `/uploads` and served statically

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/DIVYANSH-SHRIVASTAV/SSFullStackUI.git
cd SSFullStackUI
```

### 2. Install Frontend Dependencies

```bash
cd copy_SSFullstackUI
npm install
```

### 3. Install Backend Dependencies

```bash
cd ../Backend
npm install
```

### 4. Configure Environment

Create a `.env` file in the `Backend` directory with your MongoDB URI:

```
MONGO_URI=mongodb://localhost:27017/ssfullstackdb
```

### 5. Run Backend Server

```bash
cd Backend
npm start
# Server runs at http://localhost:5000
```

### 6. Run Frontend Development Server

```bash
cd ../copy_SSFullstackUI
npm run dev
# App runs at http://localhost:5173 by default
```

---

## 🏢 Folder Structure

```
```
SSFullStackUI/
│
├── Backend/
│   ├── config/
│   │   └── db.js                # MongoDB connection configuration
│   ├── middleware/
│   │   └── multer.js            # Middleware for handling file uploads
│   ├── models/
│   │   ├── country.model.js     # Country schema/model
│   │   ├── district.model.js    # District schema/model
│   │   ├── language.model.js    # Language schema/model
│   │   ├── state.model.js       # State schema/model
│   │   └── student.model.js     # Student schema/model
│   ├── routes/
│   │   ├── country.routes.js    # API routes for countries
│   │   ├── district.routes.js   # API routes for districts
│   │   ├── imageUpload.routes.js# API routes for image uploads
│   │   ├── language.routes.js   # API routes for languages
│   │   ├── state.routes.js      # API routes for states
│   │   └── student.routes.js    # API routes for students
│   ├── uploads/                 # Uploaded images/files (served statically)
│   ├── .env                     # Environment variables (not committed)
│   └── server.js                # Entry point for backend Express server
│
├── copy_SSFullstackUI/          # Frontend React app (created with Vite)
│   ├── public/
│   │   └── vite.svg             # Static assets and icons
│   ├── src/
│   │   ├── assets/              # (optional) Images, fonts, etc.
│   │   ├── components/          # Reusable React components
│   │   │   ├── Layout.jsx       # Main layout and navigation
│   │   │   └── ...              # Other shared components
│   │   ├── pages/               # Page-level components/views
│   │   │   ├── ExportCSV.jsx    # CSV export feature
│   │   │   ├── ImageUpload.jsx  # Image upload feature
│   │   │   └── ...              # Other feature pages (pagination, dropdowns, etc.)
│   │   ├── App.jsx              # Main React app component
│   │   ├── App.css              # Global styles (TailwindCSS import)
│   │   ├── index.jsx            # Entry point for React app
│   │   ├── index.css            # TailwindCSS base import
│   │   └── ...                  # Other utility files
│   ├── .eslintrc                # ESLint configuration (may be .js or .json)
│   ├── vite.config.js           # Vite build tool configuration
│   ├── package.json             # Frontend dependencies and scripts
│   └── README.md                # Frontend-specific README (optional)
│
├── important.txt                # Git/GitHub workflow notes
├── README.md                    # Main project README (system design, setup, etc.)
└── .gitignore                   # Git ignore file for node_modules, .env, uploads, etc.
```
---

## 📝 Git Setup (optional)

To initialize and push your code to GitHub:

```bash
git init
git remote add origin https://github.com/username/my-project.git
git add .
git commit -m "Initial commit"
git branch -M main
git push -u origin main
```

---

## 📢 Notes

- Make sure MongoDB is running locally or update `MONGO_URI` if using a cloud provider.
- For image uploads, files are stored in `/Backend/uploads` and served via `/uploads` route.
- The backend must be running for the frontend to function properly.

---


