import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import API from '../../api/axios';

const LivePhotoLogin = () => {
  const webcamRef = useRef(null);
  const [userName, setUserName] = useState('');
  const [imageFile, setImageFile] = useState(null); // Stores the actual File object
  const [preview, setPreview] = useState(null);    // For UI display only
  const [loading, setLoading] = useState(false);

  // Helper: Convert Base64 string from Webcam to a File object for Multer
  const makeFile = (base64) => {
    fetch(base64)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], "face-capture.jpg", { type: "image/jpeg" });
        setImageFile(file);
      });
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setPreview(imageSrc);
    makeFile(imageSrc); // Convert to raw file for backend
  }, [webcamRef]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!userName) {
      alert("Please enter your username");
      return;
    }
    if (!imageFile) {
        alert("Please capture your photo before logging in.");
        return;
    }

    setLoading(true);

    // 1. Create FormData (Crucial for Multer)
    const formData = new FormData();
    formData.append('userName', userName);
    formData.append('image', imageFile); // 'image' must match your upload.single('image')

    try {
      const response = await API.post('/users/face-login', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Tell axios this is a file upload
        }
      });

      alert("Login Successful!");
      // navigate('/dashboard');
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Verification failed");
      setPreview(null);
      setImageFile(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 border border-slate-100">
        
        <header className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Biometric Login</h1>
          <p className="text-slate-400 font-medium text-sm mt-1">Authenticating via Live Image</p>
        </header>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Username */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">User ID / Name</label>
            <input 
              type="text"
              required
              className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
              placeholder="Enter username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

          {/* Camera View */}
          <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-slate-900 border-4 border-white shadow-inner">
            {!preview ? (
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full h-full object-cover"
              />
            ) : (
              <img src={preview} alt="Captured" className="w-full h-full object-cover" />
            )}
            
            <div className="absolute inset-0 border-[30px] border-slate-900/20 flex items-center justify-center">
               <div className="w-full h-full border-2 border-white/30 border-dashed rounded-full" />
            </div>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-2 gap-3">
            <button 
              type="button" 
              onClick={preview ? () => {setPreview(null); setImageFile(null)} : capture}
              className={`py-4 rounded-2xl font-bold transition-all ${
                preview ? 'bg-slate-100 text-slate-600' : 'bg-slate-800 text-white hover:bg-slate-700'
              }`}
            >
              {preview ? "Retake" : "Capture"}
            </button>

            <button 
              type="submit"
              disabled={loading || !imageFile}
              className="bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 disabled:bg-slate-200 transition-all"
            >
              {loading ? "Verifying..." : "Verify & Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LivePhotoLogin;