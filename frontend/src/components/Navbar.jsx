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

          <div className="flex items-center gap-2 md:gap-4">
            {token ? (
              <>
                <Link to={`/${role}-dashboard`} className="hidden sm:block text-blue-900 font-bold px-2 py-2 hover:text-[#FF6B00] transition-colors text-sm md:text-base whitespace-nowrap">
                  {getGreeting()}
                </Link>
                <Link to={`/${role}-dashboard`} className="sm:hidden text-blue-900 font-bold px-2 py-2 hover:text-[#FF6B00] transition-colors text-sm whitespace-nowrap">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 md:px-6 md:py-2.5 rounded-full shadow-sm transition-all transform hover:-translate-y-0.5 text-xs md:text-base whitespace-nowrap">
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-blue-900 font-bold px-2 md:px-4 py-2 hover:text-[#FF6B00] transition-colors text-sm md:text-base whitespace-nowrap">
                  Log In
                </Link>
                <Link to="/register" className="bg-[#FF6B00] hover:bg-[#E56000] text-white font-bold px-3 py-1.5 md:px-6 md:py-2.5 rounded-full shadow-lg shadow-orange-500/30 transition-all transform hover:-translate-y-0.5 text-xs md:text-base whitespace-nowrap">
                  <span className="hidden sm:inline">Get Started</span>
                  <span className="sm:hidden">Register</span>
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center ml-1">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-slate-600 focus:outline-none"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
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

          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
