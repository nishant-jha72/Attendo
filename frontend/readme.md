
This is a comprehensive README.md designed to impress interviewers. It covers the technical stack, the architecture (including the logic we built for Admin-User separation), and the security features like the persistent login and the password reset flow.

📝 Attendo | Smart Attendance Management System
Attendo is a specialized workforce management platform designed to bridge the gap between administrative oversight and employee autonomy. It provides a secure environment where Admins can manage organization records while employees can track their presence and maintain account security.

🚀 Core Features
🔐 Multi-Role Authentication & Navigation
Intelligent Routing: Dynamically directs users to the Admin Dashboard or User Portal based on their role during the login process.

Persistent Sessions: Implements localStorage session management, ensuring users remain logged in across browser refreshes until an explicit logout is triggered.

Security Gatekeeping: Features a central navigation logic that hides registration/login portals once a secure session is active.

👑 Administrative Management
Employee Lifecycle: Admins have exclusive rights to register new users, assigning critical data points like Salary, Position, and Joining Date.

Database Management: Ability to remove employee records and oversee the global attendance metrics of the organization.

Credential Control: Admins generate the initial secure passwords for new hires.

👤 Employee Self-Service (User Portal)
One-Click Attendance: A real-time attendance marking system that captures the exact date and timestamp of the user's check-in.

Privacy Control: Features a "Current Password Verification" flow, allowing users to update their Admin-generated password to a private one.

Profile Overview: A high-fidelity dashboard displaying the user’s profile picture, project details, and a visual progress bar of their attendance percentage.

🛠 Tech Stack
Layer	Technology	Purpose
Frontend	React.js (v18)	Component-based UI architecture
Routing	React Router Dom	SPA navigation and role-based redirects
Styling	Tailwind CSS	Utility-first responsive design and modals
State	React Hooks (useState, useEffect)	Local state management and side effects
Storage	Web Storage API	Session persistence and auth flagging
📐 System Architecture
Key Logic Flows:
Auth Flow: * User inputs credentials → onSubmit triggered → localStorage.setItem('isLoggedIn', true) → Maps('/dashboard').

Attendance Flow: * new Date() used to generate ISO timestamps → State update triggers re-render of the "Present Days" count.

Password Security: * Validation: (InputCurrent === StoredCurrent) && (NewPass === ConfirmPass).

📂 Component Structure
Navbar.jsx: Global navigation featuring conditional rendering (Portal Access vs. Logout).

AdminDashboard.jsx: Data table with CRUD operations for employee management.

UserDashboard.jsx: Personalized view with attendance marking and security settings.

UserRegistration.jsx: A high-detail form for Admin use, supporting profile picture uploads.

