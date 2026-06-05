import React from 'react';
import { motion } from 'framer-motion';

const Terms = () => {
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
          <h1 className="text-4xl font-extrabold text-[#1E3A8A] mb-8">Terms of Service</h1>
          <div className="space-y-6 text-slate-600 leading-relaxed">
            <p><strong>Last Updated:</strong> June 2026</p>
            <h2 className="text-2xl font-bold text-[#1E3A8A] mt-8 mb-4">1. Acceptance of Terms</h2>
            <p>By accessing or using our services, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the service.</p>
            <h2 className="text-2xl font-bold text-[#1E3A8A] mt-8 mb-4">2. Medical Disclaimer</h2>
            <p>The content provided through Medicare is for informational purposes only and is not intended as a substitute for professional medical advice, diagnosis, or treatment.</p>
            <h2 className="text-2xl font-bold text-[#1E3A8A] mt-8 mb-4">3. User Accounts</h2>
            <p>When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms.</p>
            <h2 className="text-2xl font-bold text-[#1E3A8A] mt-8 mb-4">4. Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us at lmoksha.132@gmail.com.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Terms;
