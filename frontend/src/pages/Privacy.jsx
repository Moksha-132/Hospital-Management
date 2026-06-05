import React from 'react';
import { motion } from 'framer-motion';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-[#F4F9FF] pt-32 pb-24 font-sans relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-2/3 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-bl-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-2/3 bg-gradient-to-tr from-blue-500/20 to-transparent rounded-tr-full pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
        >
          <h1 className="text-4xl font-extrabold text-[#1E3A8A] mb-8">Privacy Policy</h1>
          <div className="space-y-6 text-slate-600 leading-relaxed">
            <p><strong>Last Updated:</strong> June 2026</p>
            <h2 className="text-2xl font-bold text-[#1E3A8A] mt-8 mb-4">1. Information We Collect</h2>
            <p>We collect information that you provide directly to us, including your name, email address, phone number, and any medical information necessary for your appointments.</p>
            <h2 className="text-2xl font-bold text-[#1E3A8A] mt-8 mb-4">2. How We Use Information</h2>
            <p>We use the information we collect to provide, maintain, and improve our services, to process your appointments and prescriptions, and to communicate with you.</p>
            <h2 className="text-2xl font-bold text-[#1E3A8A] mt-8 mb-4">3. Data Security</h2>
            <p>We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.</p>
            <h2 className="text-2xl font-bold text-[#1E3A8A] mt-8 mb-4">4. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at lmoksha.132@gmail.com.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Privacy;
