import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, User, Shield } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('patient');
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://127.0.0.1:8000/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role: role.toUpperCase() })
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => navigate('/login'), 2000);
      } else {
        const data = await res.json();
        setError(data.detail || "Registration failed");
      }
    } catch (err) {
      setError("Network error");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Navbar (from Screenshot 2) */}
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
          <h1 className="text-4xl font-extrabold text-[#1E3A8A] mb-2 tracking-tight">Create an account</h1>
          <p className="text-sm font-medium text-gray-500">
            Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Log in here</Link>
          </p>
        </div>

        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          
          {success && (
            <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm font-bold mb-6 text-center border border-green-100">
              Account created successfully! You can now log in.
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold mb-6 text-center border border-red-100">
              {error}
            </div>
          )}

          <div className="flex gap-4 mb-8">
            <button 
              type="button"
              onClick={() => setRole('patient')}
              className={`flex-1 flex flex-col items-center justify-center py-4 rounded-xl border-2 transition-all ${role === 'patient' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'}`}
            >
              <User size={24} className="mb-2" />
              <span className="font-bold text-sm">Patient</span>
            </button>
            <button 
              type="button"
              onClick={() => setRole('doctor')}
              className={`flex-1 flex flex-col items-center justify-center py-4 rounded-xl border-2 transition-all ${role === 'doctor' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'}`}
            >
              <Shield size={24} className="mb-2" />
              <span className="font-bold text-sm">Doctor</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
              <input 
                type="text" 
                placeholder="John Doe" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.full_name}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Email address</label>
              <input 
                type="email" 
                placeholder="you@example.com" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number (Optional)</label>
              <input 
                type="text" 
                placeholder="+1 (555) 000-0000" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
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
              Create Account
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Register;
