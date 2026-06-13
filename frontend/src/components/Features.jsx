import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, HeartPulse, Stethoscope, ShieldCheck, Building2, Pill } from 'lucide-react';
import { Link } from 'react-router-dom';

const Features = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section id="features" className="bg-white py-24 font-sans relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-[#1E3A8A] mb-6 tracking-tight">
            Specialist Doctor <span className="text-blue-500">Advanced Services</span>
          </h2>
          <p className="max-w-3xl text-[15px] text-[#6B7280] font-medium mx-auto leading-relaxed">
            Everything you need to seamlessly manage your medical institution, from telemedicine to inventory tracking.
          </p>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left"
        >
          
          <motion.div variants={item} className="bg-white rounded-3xl p-8 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all group">
            <div className="mb-6 text-[#CC5200]">
              <Calendar size={32} strokeWidth={2} />
            </div>
            <h3 className="text-xl font-bold text-[#1E3A8A] mb-3">Smart Scheduling</h3>
            <p className="text-[13px] text-gray-500 mb-8 font-medium leading-relaxed">
              Book, approve, or reject slots easily. Automated rollback for rejected appointments.
            </p>
            <Link to="/register" className="text-blue-600 font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all">
              Get Started <span>→</span>
            </Link>
          </motion.div>

          <motion.div variants={item} className="bg-white rounded-3xl p-8 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all group">
            <div className="mb-6 text-blue-500">
              <HeartPulse size={32} strokeWidth={2} />
            </div>
            <h3 className="text-xl font-bold text-[#1E3A8A] mb-3">Telemedicine Built-in</h3>
            <p className="text-[13px] text-gray-500 mb-8 font-medium leading-relaxed">
              Secure video and audio calls integrated directly within the platform for remote care.
            </p>
            <Link to="/register" className="text-blue-600 font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all">
              Get Started <span>→</span>
            </Link>
          </motion.div>

          <motion.div variants={item} className="bg-white rounded-3xl p-8 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all group">
            <div className="mb-6 text-green-500">
              <Stethoscope size={32} strokeWidth={2} />
            </div>
            <h3 className="text-xl font-bold text-[#1E3A8A] mb-3">Digital Prescriptions</h3>
            <p className="text-[13px] text-gray-500 mb-8 font-medium leading-relaxed">
              Doctors can upload prescriptions seamlessly with instant email notifications.
            </p>
            <Link to="/register" className="text-blue-600 font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all">
              Get Started <span>→</span>
            </Link>
          </motion.div>

          <motion.div variants={item} className="bg-white rounded-3xl p-8 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all group">
            <div className="mb-6 text-purple-600">
              <ShieldCheck size={32} strokeWidth={2} />
            </div>
            <h3 className="text-xl font-bold text-[#1E3A8A] mb-3">Secure Data Management</h3>
            <p className="text-[13px] text-gray-500 mb-8 font-medium leading-relaxed">
              Patient records, uploaded files, and profiles managed with top-tier security.
            </p>
            <Link to="/register" className="text-blue-600 font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all">
              Get Started <span>→</span>
            </Link>
          </motion.div>

          <motion.div variants={item} className="bg-white rounded-3xl p-8 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all group">
            <div className="mb-6 text-[#CC5200]">
              <Building2 size={32} strokeWidth={2} />
            </div>
            <h3 className="text-xl font-bold text-[#1E3A8A] mb-3">Hospital Admin Panel</h3>
            <p className="text-[13px] text-gray-500 mb-8 font-medium leading-relaxed">
              Comprehensive admin dashboard to manage total patients and facility workflow.
            </p>
            <Link to="/register" className="text-blue-600 font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all">
              Get Started <span>→</span>
            </Link>
          </motion.div>

          <motion.div variants={item} className="bg-white rounded-3xl p-8 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all group">
            <div className="mb-6 text-blue-500">
              <Pill size={32} strokeWidth={2} />
            </div>
            <h3 className="text-xl font-bold text-[#1E3A8A] mb-3">Inventory & Pharmacy</h3>
            <p className="text-[13px] text-gray-500 mb-8 font-medium leading-relaxed">
              Manage medical inventory, process patient medicine orders, and integrate payments.
            </p>
            <Link to="/register" className="text-blue-600 font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all">
              Get Started <span>→</span>
            </Link>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};

export default Features;
