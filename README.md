# Live Web Link :- https://attendo-beta-two.vercel.app/

# 🚀 Attendo: Full-Stack Biometric Management System

**Attendo** is a high-performance, security-focused Employee Management System (EMS). It moves beyond traditional email/password systems by implementing a **Hybrid Biometric Authentication** flow, allowing users to log in using their live camera feed or standard credentials.

---

## 🏗️ Backend Architecture & Tech Stack

The server follows a **Controller-Service-Repository** pattern to ensure separation of concerns and high scalability.



* **Frontend:** React.js (Vite), Tailwind CSS, Axios, React-Webcam.
* **Backend:** Node.js, Express.js, Multer (Media Handling).
* **Database:** MongoDB & Mongoose.
* **Storage:** Cloudinary (Profile & Biometric image hosting).
* **Security:** JWT (stored in HTTP-Only Cookies), Bcrypt.js, RBAC.

---

## 🌟 Key Features Implemented

### 1. Hybrid Biometric Login
* **Live Face Capture:** Integrates `react-webcam` to capture high-quality raw images.
* **userName Authentication:** Entire system is migrated to use `userName` handles (e.g., `@nishant_jha`) instead of email addresses.
* **Multer Integration:** Photos are sent as raw files via `FormData` rather than bloated Base64 strings.

### 2. Intelligent Navigation
* **Context-Aware Navbar:** Automatically detects authentication state changes using `localStorage` and `useLocation` hooks.
* **Role-Based UI:** Navbar dynamically displays "Mark Attendance" for employees and "Team Management" links for Admins.

---

## 🛡️ API Endpoints

### 👤 User / Employee Routes
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/api/v1/users/login` | Login via Username/Password |
| POST | `/api/v1/users/face-login` | **Biometric Login** (Multer) |
| POST | `/api/v1/users/logout` | Clear Session & Cookies |

### 🛡️ Admin Routes
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/api/v1/admin/employees` | Fetch all registered employees |
| DELETE | `/api/v1/admin/users/:id` | Remove employee from system |

---

## 🧠 Technical Challenges & Solutions

### 1. The "Base64 vs. Binary" Bottleneck
**Challenge:** Base64 captures caused a 33% increase in payload size, leading to slow authentication.
**Solution:** We implemented a frontend utility to convert Base64 data into a **Blob**, allowing the use of `FormData` for raw binary transmission to **Multer**.



### 2. Cross-Component Auth Synchronization
**Challenge:** The Navbar wouldn't update the "Logout" button visibility upon login without a refresh.
**Solution:** Used the `useLocation` hook as a dependency in `useEffect` to force-check `localStorage` on every route change.

### 3. Normalizing the `userName` Identity
**Challenge:** Risk of identity duplication (e.g., `Admin` vs `admin`).
**Solution:** Implemented a **Mongoose Pre-Save Hook** to automatically lowercase all `userName` fields before database entry.

```javascript
userSchema.pre('save', function(next) {
  if (this.isModified('userName')) {
    this.userName = this.userName.toLowerCase();
  }
  next();
});
