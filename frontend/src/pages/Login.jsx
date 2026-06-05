import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '', // FastAPI OAuth2 uses username field for email usually
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // FastAPI OAuth2PasswordRequestForm expects form data
      const formBody = new URLSearchParams();
      formBody.append('username', formData.username);
      formBody.append('password', formData.password);

      const res = await fetch(`http://127.0.0.1:8000/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formBody
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('role', data.role);
        
        if (data.role === 'ADMIN') navigate('/admin-dashboard');
        else if (data.role === 'DOCTOR') navigate('/doctor-dashboard');
        else navigate('/patient-dashboard');
      } else {
        const data = await res.json();
        setError(data.detail || "Invalid credentials");
      }
    } catch (err) {
      setError("Network error");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Navbar */}
      <nav className="bg-white px-8 py-4 flex justify-between items-center shadow-sm">
        <Link to="/" className="flex items-center gap-2 text-blue-600 font-bold text-2xl tracking-tight">
          <div className="bg-blue-600 text-white p-1 rounded-md"><Activity size={24} /></div> Medicare
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-600">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <Link to="/how-it-works" className="hover:text-blue-600">How It Works</Link>
          <Link to="/services" className="hover:text-blue-600">Services</Link>
          <Link to="/about" className="hover:text-blue-600">About</Link>
          <Link to="/contact" className="hover:text-blue-600">Contact</Link>
        </div>
        <div className="flex items-center gap-4 text-sm font-bold">
          <Link to="/login" className="text-gray-700 hover:text-blue-600">Log In</Link>
          <Link to="/register" className="bg-[#FF6B00] hover:bg-[#e65c00] text-white px-6 py-2.5 rounded-full transition-colors shadow-md shadow-orange-500/20">
            Get Started
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-[#1E3A8A] mb-2 tracking-tight">Welcome back</h1>
          <p className="text-sm font-medium text-gray-500">
            Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Create one here</Link>
          </p>
        </div>

        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold mb-6 text-center border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Email address</label>
              <input 
                type="email" 
                placeholder="you@example.com" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                 <label className="block text-xs font-bold text-gray-700">Password</label>
                 <Link to="#" className="text-xs font-bold text-blue-600 hover:underline">Forgot password?</Link>
              </div>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>

            <button type="submit" className="w-full bg-[#1E3A8A] hover:bg-blue-900 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-blue-900/20 mt-6 text-sm">
              Log In
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Login;
