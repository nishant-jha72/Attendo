# 🚀 Attendo: Full-Stack Biometric Management System

**Attendo** is a high-performance, security-focused Employee Management System (EMS). It moves beyond traditional email/password systems by implementing a **Hybrid Biometric Authentication** flow, allowing users to log in using their live camera feed or standard credentials.



---

## 🛠️ Tech Stack

* **Frontend:** React.js (Vite), Tailwind CSS, Axios, React-Webcam.
* **Backend:** Node.js, Express.js, Multer (Multipart/form-data handling).
* **Database:** MongoDB & Mongoose.
* **Security:** JWT (stored in HTTP-Only Cookies), Bcrypt.js, Role-Based Access Control (RBAC).

---

## 🌟 Key Features Implemented

### 1. Hybrid Biometric Login
* **Live Face Capture:** Integrates `react-webcam` to capture high-quality raw images.
* **Multer Integration:** Photos are sent as raw files via `FormData` rather than bloated Base64 strings, ensuring backend compatibility and faster uploads.
* **userName Authentication:** Entire system is migrated to use `userName` handles (e.g., `@nishant_jha`) instead of email addresses.

### 2. Intelligent Navigation
* **Context-Aware Navbar:** Automatically detects authentication state changes using `localStorage` and `useLocation` hooks.
* **Role-Based UI:** Navbar dynamically displays "Mark Attendance" for employees and "Team Management" links for Admins.

### 3. Comprehensive Admin Dashboard
* **Team Analytics:** A central hub to manage employee demographics (Age, Gender, Salary) and residential data.
* **Profile Slide-over:** A reusable `EmployeeDetailView` component for deep-diving into individual performance and contact metrics.



---

## 🛡️ Security Architecture

| Feature | Implementation |
| :--- | :--- |
| **Authentication** | Dual-token (Access/Refresh) system with automated rotation. |
| **Data Integrity** | Passwords hashed using Bcrypt; sensitive fields excluded from API responses. |
| **Media Security** | Multer-driven secure uploads with specific file-type validation. |
| **State Sync** | Storage event listeners to ensure logout is reflected across all open tabs. |



---

## 🚀 Installation & Setup

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/your-username/attendo.git](https://github.com/your-username/attendo.git)
    ```

2.  **Environment Variables:**
    Create a `.env` file in the `/backend` directory:
    ```env
    PORT=5000
    MONGODB_URI=your_mongodb_connection_string
    ACCESS_TOKEN_SECRET=your_jwt_secret
    CLOUDINARY_URL=your_cloudinary_config
    ```

3.  **Run the Project:**
    ```bash
    # For Backend
    cd backend && npm run dev

    # For Frontend
    cd frontend && npm run dev
    ```

---

## 📈 Future Roadmap
* **Liveness Detection:** Adding "Blink" or "Smile" detection to prevent photo-spoofing during face login.
* **Automated Payroll:** Using the `presentDays` counter to automatically calculate monthly payouts.
* **Geo-Fencing:** Ensuring attendance is only marked when the user is within the office radius.

---

**Built with ❤️ by [Nishant Jha]**
