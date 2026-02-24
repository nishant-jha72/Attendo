const faceapi = require('face-api.js');
const { Canvas, Image, ImageData, loadImage } = require('canvas');
const Face = require('../Models/FaceModel');
const path = require('path');

// Global Monkey Patch - Critical for Node.js
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });
const loadModels = async () => {
    try {
        // Path must be absolute to avoid directory issues
        const modelPath = path.join(__dirname, '../Models/weights');
        
        await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
        await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath);
        await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath);
        
        console.log("✅ AI Models Loaded and Ready");
    } catch (error) {
        console.error("❌ Failed to load AI models:", error);
    }
};

// 2. Call it immediately
loadModels();
// --- REGISTRATION LOGIC ---
exports.registerFace = async (req, res) => {
    try {
        const { email } = req.body;
        if (!req.file) return res.status(400).json({ message: "Upload an image file" });

        // Convert Multer Buffer to AI-readable Image
        const img = await loadImage(req.file.buffer);

        const detection = await faceapi.detectSingleFace(img)
            .withFaceLandmarks()
            .withFaceDescriptor();

        if (!detection) return res.status(400).json({ message: "Face not detected in image" });

        // Store email and the 128 numbers (descriptor)
        await Face.findOneAndUpdate(
            { email: email.toLowerCase() },
            { descriptor: Array.from(detection.descriptor) },
            { upsert: true }
        );

        res.json({ success: true, message: "Face registered successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- VERIFICATION LOGIC (For Attendance/Login) ---
exports.verifyFace = async (req, res) => {
    try {
        const { email } = req.body;
        if (!req.file) return res.status(400).json({ message: "Upload an image to verify" });

        // 1. Find the stored descriptor in DB
        const user = await Face.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(404).json({ message: "User not registered in Face DB" });

        // 2. Process the newly uploaded image
        const img = await loadImage(req.file.buffer);
        const detection = await faceapi.detectSingleFace(img)
            .withFaceLandmarks()
            .withFaceDescriptor();

        if (!detection) return res.status(400).json({ message: "No face detected in capture" });

        // 3. Compare the two faces
        const storedDescriptor = new Float32Array(user.descriptor);
        const distance = faceapi.euclideanDistance(detection.descriptor, storedDescriptor);

        // threshold 0.6 is standard (lower means more strict)
        const isMatch = distance < 0.6;

        res.json({
            success: isMatch,
            match: isMatch,
            confidence: (1 - distance).toFixed(2),
            message: isMatch ? "Face Verified" : "Face does not match"
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};