import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#1e3a8a] text-white pt-16 pb-8 border-t-4 border-[#FF6B00]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Logo & Description */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 text-white font-bold text-2xl tracking-tight">
              <div className="bg-white text-[#1e3a8a] p-1 rounded-md"><Activity size={24} /></div> Medicare
            </Link>
            <p className="text-blue-200 text-sm leading-relaxed pr-4">
              Transforming hospital management with a unified ecosystem for doctors, patients, and administrators. Smart scheduling, telemedicine, and inventory control.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3 text-blue-200 text-sm font-medium">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Services</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Our Services */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-white">Our Services</h3>
            <ul className="space-y-3 text-blue-200 text-sm font-medium">
              <li><Link to="#" className="hover:text-white transition-colors">Doctor Consultations</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Digital Prescriptions</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Pharmacy & Inventory</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Secure Patient Portal</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Hospital Administration</Link></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-white">Contact Us</h3>
            <ul className="space-y-4 text-blue-200 text-sm font-medium">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-[#FF6B00] shrink-0 mt-0.5" />
                <span>123 Health Avenue, Medical District,<br/>NY 10001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-[#FF6B00] shrink-0" />
                <span>+1 (800) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-[#FF6B00] shrink-0" />
                <span>support@medicare-sys.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-blue-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-blue-300">
          <p>© 2026 Medicare Management System. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
