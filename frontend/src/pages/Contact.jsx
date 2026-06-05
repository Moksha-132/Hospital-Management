import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-[#F4F9FF] pt-32 pb-24 font-sans relative overflow-hidden">
      {/* Background abstract shapes */}
      <div className="absolute top-0 right-0 w-1/2 h-2/3 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-bl-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-2/3 bg-gradient-to-tr from-blue-500/20 to-transparent rounded-tr-full pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Heading */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <motion.h4 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-blue-600 font-bold uppercase tracking-widest text-xs mb-3"
          >
            Get In Touch
          </motion.h4>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-[#1E3A8A] mb-6 tracking-tight"
          >
            Contact Our Support Team
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-[15px] leading-relaxed"
          >
            Have questions about our hospital management system? Whether you're a doctor, administrator, or patient, our team is here to help you 24/7.
          </motion.p>
        </div>

        {/* Grid Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column: Contact Cards */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Visit Us */}
            <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white hover:border-blue-100 transition-colors">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-5">
                <MapPin size={20} />
              </div>
              <h3 className="font-bold text-[#1E3A8A] text-[17px] mb-2">Visit Us</h3>
              <p className="text-slate-500 text-[13px] leading-relaxed">
                Anantapur<br />
                Andhra Pradesh<br />
                India
              </p>
            </div>

            {/* Call Us */}
            <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white hover:border-orange-100 transition-colors">
              <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-[#FF6B00] mb-5">
                <Phone size={20} />
              </div>
              <h3 className="font-bold text-[#1E3A8A] text-[17px] mb-2">Call Us</h3>
              <p className="text-slate-500 text-[13px] leading-relaxed">
                +1 (800) 123-4567<br />
                Mon-Fri, 9am to 6pm EST
              </p>
            </div>

            {/* Email Us */}
            <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white hover:border-green-100 transition-colors">
              <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-5">
                <Mail size={20} />
              </div>
              <h3 className="font-bold text-[#1E3A8A] text-[17px] mb-2">Email Us</h3>
              <p className="text-slate-500 text-[13px] leading-relaxed">
                lmoksha.132@gmail.com
              </p>
            </div>
          </motion.div>

          {/* Right Column: Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2 h-full"
          >
            <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full flex flex-col">
              <h2 className="text-xl font-bold text-[#1E3A8A] mb-8">Send us a message</h2>
              
              <form className="space-y-6 flex-grow flex flex-col">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-2">First Name</label>
                    <input type="text" className="w-full bg-[#F8FAFC] border border-transparent rounded-xl py-3.5 px-4 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-sm text-slate-700 placeholder:text-slate-400 transition-all" placeholder="John" />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-2">Last Name</label>
                    <input type="text" className="w-full bg-[#F8FAFC] border border-transparent rounded-xl py-3.5 px-4 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-sm text-slate-700 placeholder:text-slate-400 transition-all" placeholder="Doe" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-2">Email Address</label>
                    <input type="email" className="w-full bg-[#F8FAFC] border border-transparent rounded-xl py-3.5 px-4 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-sm text-slate-700 placeholder:text-slate-400 transition-all" placeholder="john@example.com" />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-2">Phone Number</label>
                    <input type="tel" className="w-full bg-[#F8FAFC] border border-transparent rounded-xl py-3.5 px-4 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-sm text-slate-700 placeholder:text-slate-400 transition-all" placeholder="+1 (555) 000-0000" />
                  </div>
                </div>
                
                <div className="flex-grow">
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-2">Message</label>
                  <textarea className="w-full bg-[#F8FAFC] border border-transparent rounded-xl py-3.5 px-4 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-sm text-slate-700 placeholder:text-slate-400 h-[140px] resize-none transition-all" placeholder="How can we help you today?"></textarea>
                </div>
                
                <div className="pt-2">
                  <button type="button" className="bg-[#FF6B00] hover:bg-[#e65c00] text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-[0_8px_20px_rgba(255,107,0,0.25)] hover:shadow-[0_8px_20px_rgba(255,107,0,0.4)] hover:-translate-y-0.5 text-sm flex items-center gap-2">
                    <Send size={16} strokeWidth={2.5} /> Send Message
                  </button>
                </div>
              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
