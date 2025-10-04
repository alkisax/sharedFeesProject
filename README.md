# 🏢 Shared Fees Management App

A full-stack MERN + TypeScript application for **building expense management** built in as a real request.  
Admins can upload monthly Excel files with expenses, which are automatically parsed into bills per apartment.  
Users can log in, view their bills, upload payment receipts, and track their balance.  
Admins review and approve payments, manage users, and monitor overall building balances.
- **End‑to‑end architecture** (MongoDB → Express → React → Appwrite).
- **Automations** (Excel → GlobalBill + Bills), **role‑based dashboards**, **file uploads**, **email workflows**.

- **deployed**: https://sharedfeesproject.onrender.com
---

## 🚀 Tech Stack

**Frontend**
- React 18 + TypeScript
- React Router 6
- Material UI (MUI) components
- Axios for API calls
- Context API for auth & variables

**Backend**
- Node.js + Express + TypeScript
- MongoDB + Mongoose
- JWT authentication & role-based access
- Multer for file uploads (Excel & receipts)
- Excel parsing (xlsx)
- Appwrite/S3-ready for file storage

**Testing & Dev**
- Jest (backend tests)
- Swagger/OpenAPI docs (backend API)

---

## ✨ Features

### 👤 User
- **Login & signup** with JWT authentication.
- View current and past bills.
- **Upload receipt** files (PDF or image) for bill payment.
- **Notify admin** after upload (email).
- Track personal balance.

### 👨‍💼 Admin
- **Upload Excel** files → automatically generate **GlobalBill** + **per-user Bills**.
- **Multi‑building** view: switch buildings, see GlobalBills and per‑user bills
- **Mass Building Mailer**: send custom emails to all tenants of a building.
- **Cloud Uploads Panel**: browse/preview/delete Appwrite files.
- **User management**: create, edit, delete, toggle admin role, view balances.
- View per-user balances.

### 🔔 Email Automations
- User → Admin: receipt uploaded (notify admin).
- Admin → Users: mass building announcements.
- Optional hooks ready for: new bill generated, bill approved, bill canceled.

---

## 🛠️ Installation & Setup

### 1. Clone Repo
```bash
git clone https://github.com/alkisax/sharedFeesProject
cd shared-fees-app
```

### 2. Backend
```bash
cd backend
npm install
```
Create `.env` file:
```env
PORT=3001
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
```
Run backend:
```bash
npm run dev
```

### 3. Frontend
```bash
cd frontend
npm install
```
Create `.env` file:
```env
VITE_BACKEND_URL=http://localhost:3001
```
Run frontend:
```bash
npm run dev
```
Frontend runs on `http://localhost:5173`.

---

## 📖 How to Use (as a user)

1. **Signup** at `/signup` or login at `/login`.  
2. After login, go to **User Dashboard** (`/user`) to see your bills.  
3. For unpaid bills, select a PDF/image receipt and **upload proof**.  
   - The bill status changes to **PENDING**.  
   - Admin must approve it.  

---

## 📖 How to Use (as an admin)

1. Login with an account that has the `ADMIN` role.  
2. Access **Admin Panel** (`/admin`) from the navbar.  
3. From the sidebar:
   - **Excel Upload** → upload monthly expense Excel.  
   - **Bills** → view all global bills, drill into user bills, approve/cancel payments.  
   - **Users** → manage users, roles, and balances.  

---

💡 **This project demonstrates**: authentication, role-based dashboards, file uploads, Excel parsing, REST API design, and full MERN stack integration with TypeScript.
