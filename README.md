# Placement Management Portal (PMP) 🎓💻

An advanced, AI-powered MERN stack placement preparation suite and corporate recruitment management dashboard. This portal helps students practice coding challenges, run mock interviews with visual voice feedback, build structured resumes, and apply for corporate placement campaigns.

---

## 🚀 Key Premium Features

### 🎙️ 1. AI Mock Interview Coach (Ava)
* **Visual Voice Equalizer**: Real-time pulsing voice graphs indicating speech activity (supports switching between Voice Mode and Text Mode).
* **Live Session Recording**: Dynamic timer tracking session durations (`LIVE REC`).
* **Performance Logs**: Interactive history tracker dashboard detailing scores, timestamps, and pass metrics (`PASS` / `REVIEW`).
* **AI Feedback Reports**: Comprehensive strength and constructive weakness breakdowns.

### 🧩 2. Separated Practice & MCQ Hubs
* **Coding practice**: Over 72 interview questions categorized by topic and difficulty:
  * **Topics**: Arrays, Strings, Linked List, Stacks & Queues, Trees & Graphs, Recursion.
  * **Difficulty Filters**: Easy, Medium, Hard.
* **Aptitude Tests**: Clean multiple-choice assessment panel separated from the coding hub.

### 📝 3. Resume Builder & Profile Scanner
* **Custom Profile Builder**: Input fields for Projects (full-width), Internships, and Certificates (side-by-side) replacing standard experience list arrays.
* **Resume Evaluation**: Scan and evaluate matching score indicators based on profile metrics.

### 🔐 4. Secure Authentication
* **Case-Insensitive Sign-In**: Sanitized credentials trimming/lowercasing emails automatically.
* **Password Eye-Toggle**: Visual toggle buttons in both Registration and Sign In pages to verify inputted passwords and prevent typos.

---

## 🛠️ Technology Stack

* **Frontend**: React (Vite), Tailwind CSS v4, Lucide Icons, React-Chartjs-2.
* **Backend**: Node.js, Express.js, JWT Authentication, REST APIs.
* **Database**: MongoDB (Mongoose schemas).

---

## ⚙️ Local Setup Guide

Follow these steps to run the application on your local machine:

### 1. Prerequisite
Ensure you have [Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/try/download/community) installed and running on your system.

### 2. Backend Setup
1. Open your terminal and navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Initialize the environment configuration file:
   * Create a `.env` file in the `backend/` directory and configure the ports and MongoDB URI:
     ```env
     PORT=5000
     MONGODB_URI=mongodb://127.0.0.1:27017/placement_portal
     JWT_SECRET=super_secret_placement_management_portal_key_2026
     ```
4. **Seed the database** with 78 interview questions and sample placement drives:
   ```bash
   npm run seed
   ```
5. Run the backend development server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Open a new terminal and navigate to the `frontend/` directory:
   ```bash
   cd ../frontend
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 👤 Sample Credentials
* **Student Candidate**: `student@placement.com` / `studentPassword123`
* **Portal Administrator**: `admin@placement.com` / `adminPassword123`
