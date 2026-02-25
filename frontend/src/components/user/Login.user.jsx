import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import API from '../../api/axios';       // Main Backend (Passwords)
import faceAPI from '../../api/faceApi'; // Face Service (AI)

const UserLogin = () => {
  const navigate = useNavigate();
  const webcamRef = useRef(null);

  const [loginMode, setLoginMode] = useState('face'); 
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // --- IMPROVED FACE LOGIC: Async File Creation ---
  const capture = useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;
    
    setPreview(imageSrc);

    // Convert Base64 to File object immediately to ensure it's ready for upload
    const res = await fetch(imageSrc);
    const blob = await res.blob();
    const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
    setImageFile(file);
  }, [webcamRef]);

  // --- UPDATED SUBMIT LOGIC ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let response;
      
     if (loginMode === 'face') {
    const formData = new FormData();
    formData.append('userName', userName);
    formData.append('image', imageFile);

    // 1. Ask Face Service: "Is this the right person?"
    const faceRes = await faceAPI.post('/verify', formData);

    if (faceRes.data.success) {
        // 2. Ask Main Backend: "Face is okay, now give me my login tokens"
        const finalResponse = await API.post('/users/face-login-finalize', { 
            userName: faceRes.data.userName 
        });

        // 3. Save details and navigate
        localStorage.setItem('userName', finalResponse.data.data.user.name);
        localStorage.setItem('userRole', 'user');
        localStorage.setItem('isLoggedIn', 'true');
        
        navigate('/user-dashboard');
        window.location.reload();
    }
} else {
        // Main backend for password login
        response = await API.post('/users/login', { userName, password });
      }

      // --- HANDLE SUCCESS ---
      localStorage.setItem('userRole', 'user');
      localStorage.setItem('isLoggedIn', 'true');
      
      // Note: Adjust the path response.data... based on your backend return structure
      const user = response.data?.data?.user || response.data?.user;
      if (user?.name) {
        localStorage.setItem('userName', user.name);
      }
      
      navigate('/user-dashboard');
      window.location.reload();
      
    } catch (err) {
      // Catch specific messages from Face Service (e.g., "Face not match")
      setError(err.response?.data?.message || "Authentication failed");
      setPreview(null);
      setImageFile(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 border border-slate-100 transition-all">
        
        {/* --- HEADER --- */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-50 rounded-2xl mb-4">
            <span className="text-2xl">{loginMode === 'face' ? '📸' : '🔑'}</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            {loginMode === 'face' ? 'Face Login' : 'Password Login'}
          </h1>
          <p className="text-slate-500 mt-2 text-sm font-medium">
            Enter your username to begin.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Username (Always visible) */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Username</label>
            <input 
              type="text" 
              required
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="e.g. nishant_jha" 
              className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold" 
            />
          </div>

          {/* --- CONDITIONAL VIEW: FACE --- */}
          {loginMode === 'face' ? (
            <div className="space-y-6">
              <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-slate-900 border-4 border-white shadow-lg">
                {!preview ? (
                  <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" className="w-full h-full object-cover" />
                ) : (
                  <img src={preview} alt="Captured" className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 border-[30px] border-slate-900/10 flex items-center justify-center">
                   <div className="w-full h-full border-2 border-white/40 border-dashed rounded-full" />
                </div>
              </div>

              <button 
                type="button" 
                onClick={preview ? () => { setPreview(null); setImageFile(null); } : capture}
                className="w-full py-4 rounded-2xl font-bold bg-slate-800 text-white hover:bg-slate-700 transition shadow-lg"
              >
                {preview ? "🔄 Retake Photo" : "📸 Capture Face"}
              </button>
            </div>
          ) : (
            /* --- CONDITIONAL VIEW: PASSWORD --- */
            <div className="animate-in fade-in slide-in-from-bottom-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold" 
              />
            </div>
          )}
          
          <button 
            type="submit"
            disabled={loading || (loginMode === 'face' && !imageFile)}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:bg-slate-200"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        {/* --- TOGGLE BUTTON --- */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <button 
            type="button"
            onClick={() => {
              setLoginMode(loginMode === 'face' ? 'password' : 'face');
              setError('');
              setPreview(null);
              setImageFile(null);
            }}
            className="w-full flex items-center justify-center gap-2 text-indigo-600 font-bold text-sm hover:bg-indigo-50 py-3 rounded-xl transition-all"
          >
            {loginMode === 'face' ? (
              <><span className="text-lg">🔑</span> Use Password Instead</>
            ) : (
              <><span className="text-lg">📸</span> Use Face Recognition</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;