🛡️ Employee Management System with Face ID
This project is a full-stack application that manages employees using a "Twin-Service" architecture. It combines traditional password authentication with AI-powered facial recognition.

🏗️ System Architecture
The project is split into three main parts:

Main Backend (Port 5000): Handles Employee data, Admin logic, Cloudinary uploads, and JWT generation.

Face Service (Port 5001): A dedicated AI microservice that processes images using face-api.js and stores "Face Fingerprints" (descriptors).

Frontend (Vite + React): A modern UI that captures webcam snapshots and coordinates with both backends.

📚 Key Terms & Technologies
1. Artificial Intelligence (AI) Terms
Descriptor (Face Fingerprint): An array of 128 decimal numbers that represent the unique features of a face. We don't save images in the Face DB; we save these numbers.

Euclidean Distance: The mathematical formula used to compare two faces.

Distance < 0.6: It’s the same person (Match).

Distance > 0.6: It’s a different person (No Match).

SSD Mobilenet v1: The AI model used for Face Detection (finding where the face is in a photo).

Monkey Patching: Since face-api.js was built for browsers, we "patch" it in Node.js using the canvas library to simulate a browser environment so it can process pixels.

2. Backend & Database Terms
1:1 Verification: The system asks, "Is this person Nishant?" (User provides Username + Photo). This is faster and more secure.

1:N Identification: The system asks, "Who is this person?" (User provides only a Photo).

Multer: Middleware used to handle multipart/form-data (uploading files).

Buffer: Temporary storage in RAM for the image file before the AI processes it.

Upsert: A database operation that Updates a record if it exists, or Inserts a new one if it doesn't.

3. Authentication & Security
JWT (JSON Web Token): A secure way to transmit information between parties.

Access Token: Short-lived (e.g., 1 day) used to access protected routes.

Refresh Token: Long-lived, used to get a new Access Token without logging in again.

Handshake Protocol: The process where the Face Service confirms a match, and the Main Backend issues the actual security tokens based on that confirmation.

🛠️ Implementation Logic
Employee Registration
Admin fills out the form and uploads a profile picture.

The Main Backend uploads the image to Cloudinary.

Before deleting the local file, the Main Backend streams the image to the Face Service.

The Face Service calculates the 128-float descriptor and saves it to MongoDB.

The local file is then safely deleted.

Face Login (The Verification Flow)
The User enters their userName and captures a photo.

The Frontend sends the photo to the Face Service.

The Face Service finds the stored descriptor for that userName and calculates the distance.

If it matches, the Frontend then calls the Main Backend's finalize route.

The Main Backend issues the JWT Cookies, logging the user in.

🚀 Environment Variables Needed
Main Backend (.env)
``` [Code snippet]
PORT=5000
MONGODB_URI=your_uri
ACCESS_TOKEN_SECRET=your_secret
REFRESH_TOKEN_SECRET=your_secret
CLOUDINARY_URL=your_url
Face Service (.env)
Code snippet
PORT=5001
MONGODB_URI=your_uri (Can be the same or a separate DB)
Frontend (.env)
```
```
[Code snippet]
VITE_MAIN_API_URL=http://localhost:5000/api/v1
VITE_FACE_API_URL=http://localhost:5001/api/face
```
💡 Troubleshooting
ENOENT Error: Occurs if you delete the image in the Main Backend before the Face Service finishes reading it.

Unexpected Field: Occurs if the key name in formData.append('key') doesn't match upload.single('key').

No Token Provided: Occurs if the Admin is not authenticated when trying to register an employee.
