import React from 'react';
import { motion } from 'framer-motion';
import { HeartPulse } from 'lucide-react';
import { Link } from 'react-router-dom';

const Services = () => {
  return (
    <section id="services" className="py-24 bg-[#FAFBFC] relative overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Text Content */}
          <div className="pr-4">
            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black text-[#1E3A8A] mb-8 tracking-tight leading-tight"
            >
              About Our <span className="text-blue-500">Services</span>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-[#6B7280] leading-relaxed mb-6 text-[15px]"
            >
              The art of medicine is founded upon the hospital ecosystem. We are obsessed with helping patients navigate complex procedures so they never have to worry about scheduling, offering an automated digital specialty experience.
            </motion.p>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-[#6B7280] leading-relaxed mb-10 text-[15px]"
            >
              Improve medication adherence and simplify prescribing workflows. Our unified hospital management system ensures that your medical inventory, patient appointments, and financial transactions are handled within a single, secure environment.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Link to="/contact">
                <button className="bg-[#FF6B00] hover:bg-[#e65c00] text-white font-bold px-8 py-3.5 rounded-xl shadow-[0_8px_20px_rgba(255,107,0,0.3)] transition-all">
                  Contact With Us
                </button>
              </Link>
            </motion.div>
          </div>

          {/* Right Image Grid */}
          <div className="relative h-[450px] flex gap-5">
            {/* Left Tall Image */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-[45%] h-full rounded-3xl overflow-hidden shadow-xl shadow-slate-200/60"
            >
              <img 
                src="https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Doctor preparing for surgery" 
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            {/* Right Column (Image + Card) */}
            <div className="w-[55%] flex flex-col gap-5">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="h-[65%] rounded-3xl overflow-hidden shadow-xl shadow-slate-200/60"
              >
                <img 
                  src="https://images.unsplash.com/photo-1551076805-e1869043e560?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Surgeons in operating room" 
                  className="w-full h-full object-cover"
                />
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="h-[35%] bg-white border border-blue-50 rounded-3xl p-5 flex items-center gap-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shrink-0 shadow-md">
                  <HeartPulse size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-[#1E3A8A] text-sm mb-0.5">24/7 Emergency</h4>
                  <p className="text-[11px] text-slate-500 leading-snug">Emergency protocols always ready.</p>
                </div>
              </motion.div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Services;
