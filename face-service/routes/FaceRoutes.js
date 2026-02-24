const express = require('express');
const router = express.Router();
const faceController = require('../controller/FaceController');
const multer = require('multer');

// Configure Multer to use Memory Storage
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // Limit: 5MB
});

// 'image' is the key you will use in Postman (form-data)
router.post('/register', upload.single('image'), faceController.registerFace);
router.post('/verify', upload.single('image'), faceController.verifyFace);

module.exports = router;