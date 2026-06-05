import React from 'react';
import { motion } from 'framer-motion';
import { Target, Lightbulb, CheckCircle2 } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="py-24 bg-white relative overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h4 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-3"
          >
            About Us
          </motion.h4>
          <motion.h2 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-[#1E3A8A] mb-6"
          >
            Our Vision & Mission
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-500 leading-relaxed"
          >
            We started Medicare to fix the broken administrative processes in modern hospitals. Our goal is to make receiving care seamless for patients and providing care effortless for doctors.
          </motion.p>
        </div>

        {/* Cards Container */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          
          {/* Mission Card */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-[32px] p-10 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.08)] relative overflow-hidden border border-orange-100 border-t-4 border-t-[#FF6B00]"
          >
            {/* Top right decorative shape */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-orange-50/80 rounded-bl-full pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-8 text-[#FF6B00]">
                <Target size={32} strokeWidth={2} />
              </div>
              <h3 className="text-3xl font-bold text-[#1E3A8A] mb-6 tracking-tight">Our Mission</h3>
              <p className="text-slate-500 leading-relaxed mb-10 text-[15px]">
                To build a hospital management ecosystem that gets rid of administrative friction. We want to empower doctors to focus on what matters most—patient care—by automating everything else.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="text-[#FF6B00]" size={20} strokeWidth={2.5} />
                  <span className="text-slate-700 font-medium text-sm">Better patient experience</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="text-[#FF6B00]" size={20} strokeWidth={2.5} />
                  <span className="text-slate-700 font-medium text-sm">Smart hospital inventory</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="text-[#FF6B00]" size={20} strokeWidth={2.5} />
                  <span className="text-slate-700 font-medium text-sm">Rock-solid data security</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Vision Card */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-[#1E3A8A] rounded-[32px] p-10 md:p-12 relative overflow-hidden shadow-[0_8px_30px_rgb(30,58,138,0.2)]"
          >
            {/* Top right decorative shape */}
            <div className="absolute top-0 right-0 w-56 h-56 bg-[#2546A5] rounded-bl-full pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="w-16 h-16 bg-[#2546A5] rounded-2xl flex items-center justify-center mb-8 text-white shadow-inner">
                <Lightbulb size={32} strokeWidth={2} />
              </div>
              <h3 className="text-3xl font-bold text-white mb-6 tracking-tight">Our Vision</h3>
              <p className="text-blue-100/90 leading-relaxed mb-10 text-[15px]">
                To become the standard for digital healthcare infrastructure. We envision a future where location doesn't block quality care thanks to robust telemedicine, and hospital administration just works.
              </p>
              
              <div className="mt-auto bg-[#2546A5]/80 rounded-2xl p-6 border border-blue-600/30">
                <p className="text-white italic text-sm font-medium">
                  "Building the digital backbone for modern hospitals."
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default About;
