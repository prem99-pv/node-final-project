# 🏥 MedCare — Multi-Doctor Healthcare Platform (MERN Stack)

A complete, production-grade, full-stack website for multi-doctor clinics built with **MongoDB, Express.js, React, and Node.js (MERN Stack)**.

---

## 📁 Project Architecture & Folder Structure

The project is cleanly split into two dedicated standalone directories:

```text
Billing-Management-System-main/
│
├── 📂 backend/               # Express.js REST API + MongoDB Mongoose
│   ├── src/
│   │   ├── config/           # Database connection (db.js)
│   │   ├── controllers/      # Auth, Doctors, Appointments, Admin logic
│   │   ├── middleware/       # JWT auth & error handling middleware
│   │   ├── models/           # User, DoctorProfile, Appointment schemas
│   │   ├── routes/           # REST API route declarations
│   │   ├── seeder/           # Automatic sample data population (seed.js)
│   │   └── server.js         # Entry point (port 5000)
│   ├── .env                  # Environment configurations
│   └── package.json          # Server dependencies & scripts
│
├── 📂 frontend/              # Modern React + Vite + Tailwind CSS SPA
│   ├── src/
│   │   ├── assets/           # Healthcare icons and illustrations
│   │   ├── components/       # Navbar, Footer, BookingModal, PrescriptionModal
│   │   ├── context/          # AuthContext (JWT auth & 1-click Demo Switcher)
│   │   ├── pages/            # Home, Login, Register
│   │   │   ├── patient/      # Patient appointments & prescription history
│   │   │   ├── doctor/       # Doctor queue, clinical notes & prescription creator
│   │   │   └── admin/        # Clinic revenue, doctor onboarding, all bookings
│   │   ├── services/         # Axios API instance with JWT auto-headers
│   │   ├── App.jsx           # Client router and protected routes
│   │   └── main.jsx          # React DOM entrypoint
│   └── package.json          # Client dependencies & scripts
│
├── package.json              # Root orchestration package
├── start-clinic.bat          # 1-click launcher for Windows (starts both servers)
└── README.md                 # Project documentation
```

---

## 🌟 Key Features

### 1. Multi-Doctor Specialist Directory & Search
- Browse doctors filtered by specialty: **Cardiology, Dermatology, Pediatrics, Orthopedics**, and more.
- Search by doctor name, qualification, or department.
- Real-time display of ratings, experience years, consultation fees, and clinic OPD room numbers.

### 2. Real-Time Slot Booking Engine
- Date picker calculates available 30-minute consultation slots.
- Already booked or conflicting slots are automatically disabled and blocked in real time.
- Patient booking form captures symptoms, visit reason, and patient information.

### 3. Patient Portal
- Overview of upcoming and completed consultations.
- Cancel or reschedule upcoming appointments.
- **Digital Rx Prescriptions**: View and print doctor prescriptions, dosage instructions, and diagnosis notes.

### 4. Doctor Dashboard
- Live queue of scheduled appointments for the logged-in doctor.
- Patient medical profile preview (blood group, age, symptoms).
- **Consultation Execution**: Add clinical diagnosis, write multi-item medicine prescriptions (name, dosage, frequency, duration, advice), and complete visits.
- **On Duty / On Leave Toggle**: Pause or enable bookings instantly.
- Revenue metrics (consultation fees collected).

### 5. Super Admin Dashboard
- Clinic statistics: Total revenue, onboarded doctors, registered patients, and appointment breakdown.
- **Doctor Onboarding**: Register new doctors with specialty, room number, fee, qualifications, and schedule.
- Global appointment monitoring and patient registry.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18+ (verified on Node v25)
- **MongoDB**: Local MongoDB community service running at `mongodb://127.0.0.1:27017`

---

### Option A: 1-Click Launch (Windows)
Double-click:
```bat
start-clinic.bat
```
This opens two terminals running the backend and frontend simultaneously and navigates to the app.

---

### Option B: Terminal Launch

#### 1. Start the Backend API
```bash
cd backend
npm run dev
```
> Running at: **`http://localhost:5000`**

#### 2. Seed Sample Database (Optional)
```bash
cd backend
npm run seed
```

#### 3. Start the Frontend Client
```bash
cd frontend
npm run dev
```
> Open your browser at: **`http://localhost:5173`**

---

## 🔑 Demo Accounts (Pre-Seeded)

Use the **"Demo Switcher"** in the top navigation bar to switch between roles in 1 click, or sign in with:

| Role | Email | Password | Access / Dashboard |
|---|---|---|---|
| **Patient** | `patient@medcare.com` | `Patient@1234` | Patient appointments, slot booking & Rx |
| **Doctor (Cardiology)** | `dr.sarah@medcare.com` | `Doctor@1234` | Cardiology queue, write prescriptions |
| **Doctor (Dermatology)** | `dr.marcus@medcare.com` | `Doctor@1234` | Dermatology queue, write prescriptions |
| **Admin** | `admin@medcare.com` | `Admin@1234` | Revenue metrics, onboard doctors, patient list |
