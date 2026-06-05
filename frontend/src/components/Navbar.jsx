import React, { useState } from 'react';
import { Menu, X, Activity } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname.includes('dashboard');
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const role = localStorage.getItem('role') || sessionStorage.getItem('role');
  const name = localStorage.getItem('name') || sessionStorage.getItem('name');

  const getGreeting = () => {
    if (!name) return 'Dashboard';
    if (role === 'doctor') return `Hello, Dr. ${name}`;
    return `Hello, ${name}`;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('name');
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <Activity size={24} />
            </div>
            <div className="flex flex-col">
              <Link to="/" className="font-bold text-2xl tracking-tight text-blue-900 leading-none">Medicare</Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          {!isDashboard && (
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Home</Link>
              <Link to="/#how-it-works" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">How It Works</Link>
              <Link to="/#services" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Services</Link>
              <Link to="/#about" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">About</Link>
              <Link to="/contact" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Contact</Link>
            </div>
          )}

          <div className="hidden md:flex items-center gap-4">
            {token ? (
              <>
                <Link to={`/${role}-dashboard`} className="text-blue-900 font-bold px-4 py-2 hover:text-[#FF6B00] transition-colors">
                  {getGreeting()}
                </Link>
                <button onClick={handleLogout} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-2.5 rounded-full shadow-sm transition-all transform hover:-translate-y-0.5">
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-blue-900 font-bold px-4 py-2 hover:text-[#FF6B00] transition-colors">
                  Log In
                </Link>
                <Link to="/register" className="bg-[#FF6B00] hover:bg-[#E56000] text-white font-bold px-6 py-2.5 rounded-full shadow-lg shadow-orange-500/30 transition-all transform hover:-translate-y-0.5">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-xl absolute w-full border-t border-slate-100">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {!isDashboard && (
              <>
                <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-md font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50">Home</Link>
                <Link to="/#how-it-works" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-md font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50">How It Works</Link>
                <Link to="/#services" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-md font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50">Services</Link>
                <Link to="/#about" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-md font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50">About</Link>
                <Link to="/contact" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-md font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50">Contact</Link>
              </>
            )}
            <div className="mt-4 flex flex-col gap-3 px-3 pt-4 border-t border-slate-100">
              {token ? (
                <>
                  <Link to={`/${role}-dashboard`} onClick={() => setIsOpen(false)} className="w-full text-center text-blue-600 font-bold border border-blue-200 py-3 rounded-full hover:bg-blue-50 transition-colors">
                    {getGreeting()}
                  </Link>
                  <button onClick={() => { setIsOpen(false); handleLogout(); }} className="w-full text-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-full shadow-sm transition-colors">
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)} className="w-full text-center text-slate-600 font-medium border border-slate-200 py-3 rounded-full hover:bg-slate-50 transition-colors">
                    Log In
                  </Link>
                  <Link to="/register" onClick={() => setIsOpen(false)} className="w-full text-center bg-[#FF6B00] hover:bg-[#E56000] text-white font-medium py-3 rounded-full shadow-md transition-colors">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
