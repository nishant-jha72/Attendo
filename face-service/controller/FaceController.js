const faceapi = require('face-api.js');
const { Canvas, Image, ImageData, loadImage } = require('canvas');
const Face = require('../Models/FaceModel'); // Ensure folder name is capitalized
const path = require('path');

// Global Monkey Patch - Critical for Node.js
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const loadModels = async () => {
    try {
        const modelPath = path.join(__dirname, '../Models/weights');
        
        await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
        await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath);
        await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath);
        
        console.log("✅ AI Models Loaded and Ready");
    } catch (error) {
        console.error("❌ Failed to load AI models:", error);
    }
};

loadModels();

exports.registerFace = async (req, res) => {
    try {
        // Changed 'email' to 'userName' to match your React frontend
        const { userName } = req.body;
        if (!req.file) return res.status(400).json({ message: "Upload an image file" });

        const img = await loadImage(req.file.buffer);

        const detection = await faceapi.detectSingleFace(img)
            .withFaceLandmarks()
            .withFaceDescriptor();

        if (!detection) return res.status(400).json({ message: "Face not detected in image" });

        await Face.findOneAndUpdate(
            { userName: userName }, // We still store it in the 'email' field
            { descriptor: Array.from(detection.descriptor) }, 
            { upsert: true }
        );

        res.json({ success: true, message: "Face registered successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.verifyFace = async (req, res) => {
    try {
        // Changed 'email' to 'userName' to match your React frontend
        const { userName } = req.body;
        if (!req.file) return res.status(400).json({ message: "Upload an image to verify" });

        const user = await Face.findOne({ userName : userName });
        if (!user) return res.status(404).json({ message: "User not registered in Face DB" });

        const img = await loadImage(req.file.buffer);
        const detection = await faceapi.detectSingleFace(img)
            .withFaceLandmarks()
            .withFaceDescriptor();

        if (!detection) return res.status(400).json({ message: "No face detected in capture" });

        const storedDescriptor = new Float32Array(user.descriptor);
        const distance = faceapi.euclideanDistance(detection.descriptor, storedDescriptor);

        const isMatch = distance < 0.6;

        // Adding 'data' object so React's response.data.data.user.name doesn't break
        if (isMatch) {
        return res.json({
        success: true,
        message: "Face match confirmed",
        userName: userName // Return the identifier
         });
        }
        res.json({
            success: isMatch,
            match: isMatch,
            confidence: (1 - distance).toFixed(2),
            message: isMatch ? "Face Verified" : "Face does not match",
            data: isMatch ? { user: { name: userName } } : null
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};